"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { SidebarProvider } from "@/components/sidebar-provider"
import { DashboardSidebar } from "@/components/sidebar"
import { TopBar } from "@/components/top-bar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [userRole, setUserRole] = useState<"manager" | "employee" | null>(null)

  useEffect(() => {
    const fetchUserRole = () => {
      const userData = localStorage.getItem("user")
      if (userData) {
        try {
          const user = JSON.parse(userData)
          setUserRole(user.role?.toLowerCase()) // manager or employee
        } catch (error) {
          console.error("Invalid user data in localStorage:", error)
        }
      }
    }
  
    fetchUserRole()
  }, [])
  

  if (userRole === null) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    )
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <DashboardSidebar userRole={userRole} />
        <div className="flex flex-1 flex-col overflow-hidden">
          <TopBar userRole={userRole} />
          <main className="flex-1 overflow-auto p-6 bg-gray-50">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  )
}
