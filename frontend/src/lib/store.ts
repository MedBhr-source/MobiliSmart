import { create } from 'zustand';
import { User } from './types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('auth_token') : false,

  setAuth: (user, token) => {
    if (typeof window !== 'undefined') localStorage.setItem('auth_token', token);
    set({ user, token, isAuthenticated: true });
  },

  logout: () => {
    if (typeof window !== 'undefined') localStorage.removeItem('auth_token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : null,
    })),
}));
