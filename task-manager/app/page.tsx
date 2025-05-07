"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { loginUser, getUserById } from "@/lib/api"
import type { UserAuth } from "@/lib/types"
import { getUserIdFromToken } from "@/lib/config"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      console.log("Attempting login with:", { email })

      const credentials: UserAuth = { email, password }
      const token = await loginUser(credentials)

      // Store token
      localStorage.setItem("token", token)
      console.log("Token stored in localStorage")

      try {
        // Extract user ID from token
        const userId = getUserIdFromToken(token)
        console.log("Extracted user ID from token:", userId)

        // Fetch user details using the token
        const userData = await getUserById(userId, token)
        localStorage.setItem("user", JSON.stringify(userData))
        console.log("User data stored in localStorage:", userData)

        // Redirect based on role
        if (userData.role === "manager") {
          console.log("Redirecting to manager dashboard")
          router.push("/dashboard/manager")
        } else {
          console.log("Redirecting to employee dashboard")
          router.push("/dashboard/employee")
        }
      } catch (userError) {
        console.error("Error fetching user details:", userError)

        // If we can't get user details, try to extract role from token
        try {
          const payload = token.split(".")[1]
          const decodedPayload = JSON.parse(atob(payload))
          console.log("Decoded JWT payload:", decodedPayload)

          // Create a minimal user object from token data
          const minimalUser = {
            id: decodedPayload.id || 1,
            name: decodedPayload.name || email.split("@")[0],
            email: email,
            role: decodedPayload.role || "employee",
          }

          localStorage.setItem("user", JSON.stringify(minimalUser))
          console.log("Created minimal user from token:", minimalUser)

          // Redirect based on role from token
          if (minimalUser.role === "manager") {
            console.log("Redirecting to manager dashboard (from token)")
            router.push("/dashboard/manager")
          } else {
            console.log("Redirecting to employee dashboard (from token)")
            router.push("/dashboard/employee")
          }
        } catch (tokenError) {
          console.error("Error extracting data from token:", tokenError)
          throw new Error("Could not retrieve user information")
        }
      }
    } catch (err) {
      console.error("Login error:", err)

      if (err.message === "Failed to fetch") {
        setError(
          "Cannot connect to the backend server at http://localhost:8080. Please ensure your backend is running and accessible. If you're using a remote environment, make sure your backend allows cross-origin requests (CORS).",
        )
      } else {
        setError(err instanceof Error ? err.message : "Login failed. Please try again.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Task Manager</CardTitle>
          <CardDescription className="text-center">Enter your credentials to sign in to your account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleLogin}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-muted-foreground">Task Manager for Employees and Managers</p>
        </CardFooter>
      </Card>
    </div>
  )
}
