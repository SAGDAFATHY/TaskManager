"use client"

import { useEffect, useState } from "react"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { TaskFilters } from "@/components/task-filters"
import { AuthGuard } from "@/components/auth-guard"
import { getTasksByEmployee } from "@/lib/api"
import type { Task } from "@/lib/types"
import { Loader2 } from "lucide-react"

export default function EmployeeDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
  })

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Get current user ID from localStorage
        const user = JSON.parse(localStorage.getItem("user") || "{}")
        const token = localStorage.getItem("token") || ""

        if (!user.id || !token) {
          throw new Error("User information not found. Please log in again.")
        }

        console.log(`Fetching tasks for employee ID: ${user.id}`)
        const data = await getTasksByEmployee(user.id, token)
        console.log(`Received ${data.length} tasks for employee`)
        setTasks(data)
      } catch (err) {
        console.error("Error fetching tasks:", err)

        if (err.message === "Failed to fetch") {
          setError("Cannot connect to the backend server. Please ensure your backend is running and accessible.")
        } else {
          setError(err instanceof Error ? err.message : "Failed to load tasks. Please try again later.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const filteredTasks = tasks.filter((task) => {
    return filters.status === "all" || task.status === filters.status
  })

  return (
    <AuthGuard requiredRole="employee">
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Tasks</h1>

        <TaskFilters filters={filters} setFilters={setFilters} showEmployeeFilter={false} />

        <Card>
          <CardHeader>
            <CardTitle>Assigned Tasks</CardTitle>
            <CardDescription>View and manage your assigned tasks</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading tasks...</span>
              </div>
            ) : (
              <TaskList tasks={filteredTasks} isLoading={false} error={error} isManager={false} />
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
