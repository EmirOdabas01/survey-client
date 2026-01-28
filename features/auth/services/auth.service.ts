import { apiClient } from "@/shared/api/api-client";
import {
  setAccessToken,
  setRefreshToken,
  deleteAuthTokens,
  getAccessToken,
  getRefreshToken,
} from "@/shared/lib/cookies.client";
import type {
  LoginCredentials,
  RegisterCredentials,
  TokenResponse,
  RegisterResponse,
  RefreshTokenResponse,
  User,
} from "@/shared/types/auth.types";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

class AuthService {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    try {
      const response = await apiClient.post<TokenResponse>(
        "/Auth/Login",
        credentials,
      );

      setAccessToken(response.token.accessToken, response.token.expiration);
      setRefreshToken(response.token.refreshToken);

      return response;
    } catch (error) {
      throw new Error(error instanceof Error ? error.message : "Login failed");
    }
  }

  async register(credentials: RegisterCredentials): Promise<RegisterResponse> {
    try {
      const payload = {
        nameSurname: credentials.nameSurname,
        userName: credentials.userName,
        eMail: credentials.email,
        password: credentials.password,
        passwordConfirm: credentials.passwordConfirm,
      };

      const response = await apiClient.post<RegisterResponse>(
        "/User/Register",
        payload,
      );

      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed",
      );
    }
  }

  async refreshToken(): Promise<boolean> {
    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      return false;
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
        deleteAuthTokens();
        return false;
      }

      const data: RefreshTokenResponse = await response.json();
      setAccessToken(data.token.accessToken, data.token.expiration);
      setRefreshToken(data.token.refreshToken);

      return true;
    } catch (error) {
      deleteAuthTokens();
      return false;
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.put("/Auth/LogOut");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      deleteAuthTokens();
    }
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      const user = await apiClient.get<User>("/Auth/Me");
      return user;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const accessToken = getAccessToken();
    const refreshToken = getRefreshToken();
    console.log(!!(accessToken || refreshToken));
    return !!(accessToken || refreshToken);
  }

  hasRefreshToken(): boolean {
    return !!getRefreshToken();
  }
}

export const authService = new AuthService();
