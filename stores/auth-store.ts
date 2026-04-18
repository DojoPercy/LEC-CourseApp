import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { apiFetch } from "@/lib/api";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  resetEmail: string | null;
  isCodeVerified: boolean;
  verifiedCode: string | null;

  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    megaCenterId?: string
  ) => Promise<void>;
  logout: () => void;
  sendResetCode: (email: string) => Promise<void>;
  verifyResetCode: (code: string) => Promise<boolean>;
  resetPassword: (newPassword: string) => Promise<void>;
  clearResetState: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      resetEmail: null,
      isCodeVerified: false,
      verifiedCode: null,

      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const res = await apiFetch<{ token: string; user: User }>(
            "/api/auth/signin",
            {
              method: "POST",
              body: JSON.stringify({ email, password }),
            }
          );
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      register: async (firstName, lastName, email, password, megaCenterId) => {
        set({ isLoading: true });
        try {
          const res = await apiFetch<{ token: string; user: User }>(
            "/api/auth/signup",
            {
              method: "POST",
              body: JSON.stringify({
                firstName,
                lastName,
                email,
                password,
                confirmPassword: password,
                megaCenterId,
              }),
            }
          );
          set({
            user: res.user,
            token: res.token,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          resetEmail: null,
          isCodeVerified: false,
          verifiedCode: null,
        });
      },

      sendResetCode: async (email) => {
        set({ isLoading: true });
        try {
          await apiFetch<{ message: string }>("/api/auth/forgot-password", {
            method: "POST",
            body: JSON.stringify({ email }),
          });
          set({ resetEmail: email, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      verifyResetCode: async (code) => {
        const { resetEmail } = get();
        if (!resetEmail) throw new Error("No email in reset state");
        set({ isLoading: true });
        try {
          const res = await apiFetch<{ valid: boolean }>("/api/auth/verify-reset-code", {
            method: "POST",
            body: JSON.stringify({ email: resetEmail, code }),
          });
          set({ isCodeVerified: res.valid, verifiedCode: res.valid ? code : null, isLoading: false });
          return res.valid;
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      resetPassword: async (newPassword) => {
        const { resetEmail, isCodeVerified, verifiedCode } = get();
        if (!resetEmail || !isCodeVerified || !verifiedCode) throw new Error("Invalid reset state");
        set({ isLoading: true });
        try {
          await apiFetch<{ message: string }>("/api/auth/reset-password", {
            method: "POST",
            body: JSON.stringify({ email: resetEmail, code: verifiedCode, newPassword }),
          });
          set({ resetEmail: null, isCodeVerified: false, verifiedCode: null, isLoading: false });
        } catch (error) {
          set({ isLoading: false });
          throw error;
        }
      },

      clearResetState: () => set({ resetEmail: null, isCodeVerified: false, verifiedCode: null }),

      updateProfile: (updates) => {
        const { user } = get();
        if (!user) return;
        set({ user: { ...user, ...updates } });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
