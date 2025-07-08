"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Navigate } from "react-router-dom"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Label } from "../ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Alert, AlertDescription } from "../ui/alert"

const LoginPage = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { user, login } = useAuth()

  if (user) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    const result = await login(email, password)

    if (!result.success) {
      setError(result.error)
    }

    setLoading(false)
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8fafc",
        padding: "1rem",
      }}
    >
      <Card style={{ width: "100%", maxWidth: "400px" }}>
        <CardHeader style={{ textAlign: "center" }}>
          <CardTitle style={{ fontSize: "1.5rem", marginBottom: "0.5rem" }}>Dental Center Login</CardTitle>
          <CardDescription>Enter your credentials to access the management system</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" style={{ marginBottom: "1rem" }}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "1rem" }}>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
            </div>

            <Button type="submit" disabled={loading} style={{ width: "100%" }}>
              {loading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div
            style={{
              marginTop: "1.5rem",
              padding: "1rem",
              backgroundColor: "#f8fafc",
              borderRadius: "0.375rem",
              fontSize: "0.875rem",
            }}
          >
            <p style={{ fontWeight: "600", marginBottom: "0.5rem" }}>Demo Accounts:</p>
            <p>
              <strong>Admin:</strong> admin@entnt.in / admin123
            </p>
            <p>
              <strong>Patient:</strong> john@entnt.in / patient123
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default LoginPage
