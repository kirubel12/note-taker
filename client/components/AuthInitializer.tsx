'use client'

import { useEffect } from 'react'
import { useAuthStore } from '@/lib/store/auth-store'

export function AuthInitializer() {
  const initializeUser = useAuthStore((state) => state.initializeUser)
  
  useEffect(() => {
    initializeUser()
  }, [initializeUser])

  return null
}