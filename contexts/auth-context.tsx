"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  id: string
  role: "Admin" | "Patient"
  email: string
  patientId?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => boolean
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const MOCK_USERS = [
  { id: "1", role: "Admin" as const, email: "admin@entnt.in", password: "admin123" },
  { id: "2", role: "Patient" as const, email: "john@entnt.in", password: "patient123", patientId: "p1" },
  { id: "3", role: "Patient" as const, email: "jane@entnt.in", password: "patient123", patientId: "p2" },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem("dental_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = (email: string, password: string): boolean => {
    const foundUser = MOCK_USERS.find((u) => u.email === email && u.password === password)
    if (foundUser) {
      const userSession = {
        id: foundUser.id,
        role: foundUser.role,
        email: foundUser.email,
        ...(foundUser.patientId && { patientId: foundUser.patientId }),
      }
      setUser(userSession)
      localStorage.setItem("dental_user", JSON.stringify(userSession))
      return true
    }
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("dental_user")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
