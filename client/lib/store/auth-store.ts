import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { login, logout as apiLogout, getCurrentUser, signup } from '@/actions/auth'

type AuthState = {
  user: { id: string; email: string } | null
  token: string | null
  isLoading: boolean
  error: string | null
}

type AuthActions = {
  initializeUser: () => Promise<void>
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: false,
      error: null,
      
      initializeUser: async () => {
        if (typeof window === 'undefined') return
        
        try {
          set({ isLoading: true })
          const token = localStorage.getItem('token')
          
          if (token) {
            const user = await getCurrentUser()
            set({ user, token })
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Auth failed' })
        } finally {
          set({ isLoading: false })
        }
      },
      
      login: async (email, password) => {
        try {
          set({ isLoading: true })
          const { user, token, error } = await login(email, password)
          
          if (error || !user || !token) {
            throw new Error(error || 'Login failed')
          }
          
          set({ user, token, error: null })
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Login failed' })
          throw error
        } finally {
          set({ isLoading: false })
        }
      },

      signup: async (email, password) => {
        try {
          set({ isLoading: true });
          const response = await signup(email, password);
          
          if (response.error || !response.user || !response.token) {
            throw new Error(response.error || 'Signup failed');
          }
          
          if (typeof window !== 'undefined') {
            localStorage.setItem('token', response.token);
          }
          
          set({ user: response.user, token: response.token, error: null });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Signup failed' });
          throw error;
        } finally {
          set({ isLoading: false });
        }
      },
      
      logout: async () => {
        await apiLogout()
        set({ user: null, token: null, error: null })
      }
    }),
    {
      name: 'token',
      partialize: (state) => ({ token: state.token }),
    }
  )
)