"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { usePathname, useRouter } from "next/navigation"
import Link from "next/link"
import { LayoutDashboard, CheckSquare, Users, Settings, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useSidebar } from "@/components/sidebar-provider"
import { cn } from "@/lib/utils"

export function DashboardSidebar() {
  const { isOpen, toggle } = useSidebar()
  const pathname = usePathname()
  const router = useRouter()

  const [userId, setUserId] = useState("")
  const [userRole, setUserRole] = useState<"manager" | "employee" | "">("")
  const [userName, setUserName] = useState("")

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const user = JSON.parse(userData)
        setUserId(user.id)
        setUserRole(user.role?.toLowerCase())
        setUserName(user.name)
      } catch (error) {
        console.error("Invalid user data in localStorage:", error)
      }
    }
  }, [])

  const navItems = [
    {
      title: "Dashboard",
      href: `/dashboard/${userRole}`,
      icon: LayoutDashboard,
      role: "all",
    },
    {
      title: "My Tasks",
      href: `/dashboard/${userRole}`,
      icon: CheckSquare,
      role: "employee",
    },
    {
      title: "Users",
      href: `/dashboard/${userRole}/employees`,
      icon: Users,
      role: "manager",
    },
    {
      title: "Settings",
      href: "/dashboard/profile",
      icon: Settings,
      role: "all",
    },
  ]

  const handleLogout = () => {
    router.push("/")
  }

  return (
    <>
      <Button variant="ghost" size="icon" className="absolute left-4 top-4 z-50 md:hidden" onClick={toggle}>
        <Menu />
      </Button>

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 transform bg-white shadow-lg transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold">Task Manager</h1>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-4">
            {navItems
              .filter((item) => item.role === "all" || item.role === userRole)
              .map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center rounded-md px-3 py-2 text-sm font-medium",
                    pathname === item.href
                      ? "bg-gray-100 text-gray-900"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900",
                  )}
                >
                  <item.icon className="mr-3 h-5 w-5" />
                  {item.title}
                </Link>
              ))}
          </nav>

          <div className="border-t p-4">
            <div className="mb-2 flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-200" />
              <div className="ml-3">
                <p className="text-sm font-medium">{userName}</p>
                <p className="text-xs text-gray-500">Role: {userRole}</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
