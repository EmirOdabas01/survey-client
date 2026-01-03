"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { authService } from "../services/auth.service";
import type {
  User,
  LoginCredentials,
  RegisterCredentials,
} from "@/shared/types/auth.types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (
    credentials: RegisterCredentials
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadUser();
  }, []);

  async function loadUser() {
    try {
      if (authService.isAuthenticated()) {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  async function login(credentials: LoginCredentials) {
    try {
      await authService.login(credentials);
      await loadUser();
      router.push("/dashboard");
    } catch (error) {
      throw error;
    }
  }

  async function register(
    credentials: RegisterCredentials
  ): Promise<{ success: boolean; message: string }> {
    try {
      const response = await authService.register(credentials);

      if (response.success) {
        router.push("/login");
      }

      return response;
    } catch (error) {
      throw error;
    }
  }

  async function logout() {
    try {
      await authService.logout();
      setUser(null);
      router.push("/login");
    } catch (error) {
      console.error("Logout error:", error);
      setUser(null);
      router.push("/login");
    }
  }

  async function refreshUser() {
    await loadUser();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
