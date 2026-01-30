import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  isTokenExpired,
  deleteAuthTokens,
} from "@/shared/lib/cookies.client";
import type { RefreshTokenResponse } from "@/shared/types/auth.types";
import type { ValidationErrors } from "@/shared/types/api.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiValidationError extends Error {
  errors: ValidationErrors;

  constructor(errors: ValidationErrors) {
    const message = errors
      .map((e) => `${e.key}: ${e.value.join(", ")}`)
      .join("; ");
    super(message);
    this.name = "ApiValidationError";
    this.errors = errors;
  }

  getFieldErrors(): Record<string, string[]> {
    const fieldErrors: Record<string, string[]> = {};
    this.errors.forEach((e) => {
      fieldErrors[e.key.toLowerCase()] = e.value;
    });
    return fieldErrors;
  }
}

class ApiClient {
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  private subscribeTokenRefresh(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  private onTokenRefreshed(token: string) {
    this.refreshSubscribers.forEach((callback) => callback(token));
    this.refreshSubscribers = [];
  }

  private async refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      throw new Error("No refresh token available");
    }

    try {
      const response = await fetch(`${API_BASE_URL}/Auth/RefreshTokenLogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (!response.ok) {
        throw new Error("Token refresh failed");
      }

      const data: RefreshTokenResponse = await response.json();

      setAccessToken(data.token.accessToken, data.token.expiration);
      setRefreshToken(data.token.refreshToken);

      return data.token.accessToken;
    } catch (error) {
      deleteAuthTokens();
      window.location.href = "/login";
      throw error;
    }
  }

  private async getValidAccessToken(): Promise<string | null> {
    let accessToken = getAccessToken();
    const refreshToken = getRefreshToken();

    const needsRefresh =
      (!accessToken && refreshToken) || (accessToken && isTokenExpired());

    if (needsRefresh && !this.isRefreshing) {
      this.isRefreshing = true;
      try {
        accessToken = await this.refreshAccessToken();
        this.onTokenRefreshed(accessToken);
      } catch (error) {
        throw error;
      } finally {
        this.isRefreshing = false;
      }
    }

    if (this.isRefreshing) {
      accessToken = await new Promise<string>((resolve) => {
        this.subscribeTokenRefresh((token: string) => {
          resolve(token);
        });
      });
    }

    return accessToken;
  }

  private extractErrorMessage(errorData: any, fallback: string): string {
    if (errorData.Message) {
      return errorData.Message;
    }
    if (errorData.message) {
      return errorData.message;
    }
    if (errorData.Title) {
      return errorData.Title;
    }
    return fallback;
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;

    let accessToken: string | null = null;

    try {
      accessToken = await this.getValidAccessToken();
    } catch (error) {
      throw error;
    }

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (options.headers) {
      const customHeaders = new Headers(options.headers);
      customHeaders.forEach((value, key) => {
        headers[key] = value;
      });
    }

    if (accessToken) {
      headers["Authorization"] = `Bearer ${accessToken}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 400) {
        const errorData = await response.json();

        if (Array.isArray(errorData)) {
          throw new ApiValidationError(errorData as ValidationErrors);
        }

        throw new Error(this.extractErrorMessage(errorData, "Bad request"));
      }

      if (response.status === 401 && !this.isRefreshing) {
        this.isRefreshing = true;
        try {
          const newAccessToken = await this.refreshAccessToken();
          this.onTokenRefreshed(newAccessToken);
          this.isRefreshing = false;

          headers["Authorization"] = `Bearer ${newAccessToken}`;
          const retryResponse = await fetch(url, {
            ...options,
            headers,
          });

          if (!retryResponse.ok) {
            const errorData = await retryResponse.json();
            throw new Error(
              this.extractErrorMessage(errorData, "Request failed"),
            );
          }

          return await retryResponse.json();
        } catch (error) {
          this.isRefreshing = false;
          throw error;
        }
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(this.extractErrorMessage(errorData, "Request failed"));
      }

      const text = await response.text();
      if (!text) {
        return {} as T;
      }

      return JSON.parse(text);
    } catch (error) {
      throw error;
    }
  }

  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "GET" });
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { ...options, method: "DELETE" });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestInit,
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
