'use server'

import { fetchWrapper } from '@/hooks/fetchwrapper'
import { redirect } from 'next/navigation'

export type AuthResponse = {
  message: string
  token: string
  user: {
    id: string
    email: string
  }
}

export async function signup(email: string, password: string) {
  try {
    const data = await fetchWrapper.post<AuthResponse>('/auth/signup', {
      email,
      password
    })
    
    return { 
      token: data.token,
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

    if (typeof window !== 'undefined') {
      localStorage.setItem('token', data.token)
    }
    
    return { 
      token: data.token,
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

export async function getCurrentUser() {
  try {
    const data = await fetchWrapper.get<{
      user: {
        id: string
        email: string
      }
    }>('/auth/me', true) // Add true to require authentication
    
    return data.user
  } catch (error) {
    return null
  }
}

export async function logout() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token')
  }
  redirect('/auth/login')
}