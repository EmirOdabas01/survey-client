import {
  getAccessToken,
  getRefreshToken,
  setAccessToken,
  setRefreshToken,
  getTokenExpiration,
  deleteAuthTokens,
  isTokenExpired,
} from "../lib/cookies.client";
import type { TokenResponse } from "../types/auth.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

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

      const data: TokenResponse = await response.json();
      setAccessToken(data.token.accessToken, data.token.expiration);
      setRefreshToken(data.token.refreshToken);

      return data.token.accessToken;
    } catch (error) {
      deleteAuthTokens();
      window.location.href = "/login";
      throw error;
    }
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    let accessToken = getAccessToken();

    if (accessToken && isTokenExpired() && !this.isRefreshing) {
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
            const error = await retryResponse.json();
            throw new Error(error.message || "Request failed");
          }

          return await retryResponse.json();
        } catch (error) {
          this.isRefreshing = false;
          throw error;
        }
      }

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Request failed");
      }

      return await response.json();
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
    options?: RequestInit
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
    options?: RequestInit
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
    options?: RequestInit
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    });
  }
}

export const apiClient = new ApiClient();
