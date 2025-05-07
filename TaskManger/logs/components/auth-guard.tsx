"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function AuthGuard({
  children,
  requiredRole,
}: {
  children: React.ReactNode
  requiredRole?: "manager" | "employee"
}) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token")
    const user = localStorage.getItem("user")

    if (!token || !user) {
      router.push("/")
      return
    }

    // Check if user has required role
    if (requiredRole) {
      const userData = JSON.parse(user)
      const hasRequiredRole = userData.role.toLowerCase() === requiredRole
      console.log(
        `User role: ${userData.role}, Required role: ${requiredRole}, Converted: ${userData.role.toLowerCase()}`,
      )

      if (!hasRequiredRole) {
        // Redirect to appropriate dashboard
        if (userData.role === "manager") {
          router.push("/dashboard/manager")
        } else {
          router.push("/dashboard/employee")
        }
        return
      }
    }

    setIsAuthorized(true)
    setIsLoading(false)
  }, [router, requiredRole])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return isAuthorized ? children : null
}
