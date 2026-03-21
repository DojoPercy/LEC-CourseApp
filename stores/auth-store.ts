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
        });
      },

      // Password reset not yet in API — keep stubs
      sendResetCode: async (email) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000));
        set({ resetEmail: email, isLoading: false });
      },

      verifyResetCode: async (code) => {
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 800));
        const isValid = code === "123456";
        set({ isCodeVerified: isValid, isLoading: false });
        return isValid;
      },

      resetPassword: async (_newPassword) => {
        const { resetEmail, isCodeVerified } = get();
        if (!resetEmail || !isCodeVerified) throw new Error("Invalid reset state");
        set({ isLoading: true });
        await new Promise((r) => setTimeout(r, 1000));
        set({ resetEmail: null, isCodeVerified: false, isLoading: false });
      },

      clearResetState: () => set({ resetEmail: null, isCodeVerified: false }),

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
