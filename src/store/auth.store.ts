import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'TEACHER' | 'STUDENT';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null, // Mặc định chưa đăng nhập
  isAuthenticated: false,

  login: (userData, token) => {
    // Lưu token vào localStorage để axios.client.ts có thể lấy được
    localStorage.setItem('accessToken', token);
    set({ user: userData, isAuthenticated: true });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({ user: null, isAuthenticated: false });
  },
}));