import { apiClient } from "@/shared/api/api-client";
import {
  setAccessToken,
  setRefreshToken,
  deleteAuthTokens,
  getAccessToken,
} from "@/shared/lib/cookies.client";
import type {
  LoginCredentials,
  RegisterCredentials,
  TokenResponse,
  RegisterResponse,
  UserInfoResponse,
} from "@/shared/types/auth.types";
import { userInfo } from "os";

class AuthService {
  async login(credentials: LoginCredentials): Promise<TokenResponse> {
    try {
      const response = await apiClient.post<TokenResponse>(
        "/Auth/Login",
        credentials
      );
      console.log(response.token.accessToken);
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
        payload
      );

      return response;
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "Registration failed"
      );
    }
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await apiClient.post<TokenResponse>(
        "/Auth/RefreshTokenLogin",
        { refreshToken }
      );

      setAccessToken(response.token.accessToken, response.token.expiration);
      setRefreshToken(response.token.refreshToken);

      return response;
    } catch (error) {
      deleteAuthTokens();
      throw new Error("Token refresh failed");
    }
  }

  async logout(): Promise<void> {
    try {
      await apiClient.put("/Auth/Logout");
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      deleteAuthTokens();
    }
  }

  async getCurrentUser(): Promise<UserInfoResponse | null> {
    try {
      const token = getAccessToken();
      if (!token) return null;
      const userInfo = await apiClient.request<UserInfoResponse>("/Auth/Me");
      console.log(`user: ${userInfo}`);
      return userInfo;
    } catch (error) {
      return null;
    }
  }

  isAuthenticated(): boolean {
    const token = getAccessToken();
    return !!token;
  }
}

export const authService = new AuthService();
