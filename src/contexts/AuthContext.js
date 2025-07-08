"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

const DEMO_USERS = [
  {
    id: "1",
    email: "admin@entnt.in",
    password: "admin123",
    role: "Admin",
    name: "Dr. Sarah Johnson",
  },
  {
    id: "2",
    email: "john@entnt.in",
    password: "patient123",
    role: "Patient",
    name: "John Smith",
  },
]

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedUser = localStorage.getItem("dental_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const login = async (email, password) => {
    const foundUser = DEMO_USERS.find((u) => u.email === email && u.password === password)

    if (foundUser) {
      const userWithoutPassword = { ...foundUser }
      delete userWithoutPassword.password

      setUser(userWithoutPassword)
      localStorage.setItem("dental_user", JSON.stringify(userWithoutPassword))
      return { success: true }
    }

    return { success: false, error: "Invalid credentials" }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("dental_user")
  }

  const value = {
    user,
    login,
    logout,
    loading,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
