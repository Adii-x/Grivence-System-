import { create } from 'zustand';

export type UserRole = 'student' | 'staff' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department?: string;
  studentId?: string;
  year?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: JSON.parse(localStorage.getItem('nexus_user') || 'null'),
  token: localStorage.getItem('nexus_token'),
  isAuthenticated: !!localStorage.getItem('nexus_token'),
  login: (user, token) => {
    localStorage.setItem('nexus_user', JSON.stringify(user));
    localStorage.setItem('nexus_token', token);
    set({ user, token, isAuthenticated: true });
  },
  logout: () => {
    localStorage.removeItem('nexus_user');
    localStorage.removeItem('nexus_token');
    set({ user: null, token: null, isAuthenticated: false });
  },
}));
