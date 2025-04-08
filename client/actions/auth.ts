'use server'

import { fetchWrapper } from '@/hooks/fetchwrapper'
import { redirect } from 'next/navigation'

export type AuthResponse = {
  user: {
    id: string
    email: string
  }
  token: string
}

export async function signup(email: string, password: string) {
  try {
    const data = await fetchWrapper.post<AuthResponse>('/auth/signup', {
      email,
      password
    })
    
    return { 
      user: data.user,
      error: null 
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Registration failed'
    }
  }
}

export async function login(email: string, password: string) {
  try {
    const data = await fetchWrapper.post<AuthResponse>('/auth/signin', {
      email,
      password
    })

    // Store token in localStorage through client-side code
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token)
    }
    
    return { 
      user: data.user,
      error: null 
    }
  } catch (error) {
    return {
      user: null,
      error: error instanceof Error ? error.message : 'Login failed'
    }
  }
}

export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
  redirect('/auth/login')
}