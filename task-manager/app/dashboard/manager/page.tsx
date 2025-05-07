"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { TaskFilters } from "@/components/task-filters"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getAllTasks, getAllUsers } from "@/lib/api"
import type { Task, User } from "@/lib/types"

export default function ManagerDashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    employee: "all",
  })
  const router = useRouter()

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token") || ""
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.")
        }

        console.log("Fetching tasks and employees for manager dashboard")

        // Fetch tasks
        const tasksData = await getAllTasks(token)
        console.log(`Received ${tasksData.length} tasks`)

        // Fetch employees to get names
        const allUsers = await getAllUsers(token)
        const employeesList = allUsers.filter((user) => user.role === "employee")
        console.log(`Received ${employeesList.length} employees`)
        setEmployees(employeesList)

        // Enhance tasks with employee names if not already present
        const enhancedTasks = tasksData.map((task) => {
          if (task.assignedTo) return task

          const employee = employeesList.find((emp) => emp.id === task.assignedTo)
          return {
            ...task,
            employeeName: employee ? employee.name : "Unknown",
          }
        })

        setTasks(enhancedTasks)
      } catch (err) {
        console.error("Error fetching data:", err)

        if (err.message === "Failed to fetch") {
          setError("Cannot connect to the backend server. Please ensure your backend is running and accessible.")
        } else {
          setError(err instanceof Error ? err.message : "Failed to load data. Please try again later.")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleCreateTask = () => {
    router.push("/dashboard/manager/tasks/create")
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus = filters.status === "all" || task.status === filters.status
    const matchesEmployee = filters.employee === "all" || task.assignedTo === Number.parseInt(filters.employee)
    return matchesStatus && matchesEmployee
  })

  return (
    <AuthGuard requiredRole="manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </div>

        <TaskFilters filters={filters} setFilters={setFilters} showEmployeeFilter={true} employees={employees} />

        <Card>
          <CardHeader>
            <CardTitle>All Tasks</CardTitle>
            <CardDescription>Manage and monitor all tasks across your team</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Loading tasks...</span>
              </div>
            ) : (
              <TaskList tasks={filteredTasks} isLoading={false} error={error} isManager={true} employees={employees} />
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
