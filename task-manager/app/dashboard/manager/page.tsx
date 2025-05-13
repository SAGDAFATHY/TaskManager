"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TaskList } from "@/components/task-list"
import { TaskFilters } from "@/components/task-filters"
import { Button } from "@/components/ui/button"
import { Loader2, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { getAllTasks, getAllUsers, getTasksByStatus, getTasksByEmployee, getTasksByEmployeeAndStatus } from "@/lib/api"
import type { Task, User } from "@/lib/types"

export default function ManagerDashboard() {
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [employees, setEmployees] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isFiltering, setIsFiltering] = useState(false)
  const [error, setError] = useState("")
  const [filters, setFilters] = useState({
    status: "all",
    employee: "all",
  })
  const router = useRouter()

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem("token") || ""
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.")
        }

        // Fetch employees first
        const allUsers = await getAllUsers(token)
        const employeesList = allUsers.filter((user) => user.role === "employee")
        setEmployees(employeesList)

        // Then fetch tasks
        const tasksData = await getAllTasks(token)

        // Enhance tasks with employee names
        const enhancedTasks = tasksData.map((task) => {
          const employee = employeesList.find((emp) => emp.id === task.assignedTo)
          return {
            ...task,
            employeeName: employee ? employee.name : "Unassigned",
          }
        })

        setAllTasks(enhancedTasks)
        setFilteredTasks(enhancedTasks)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err instanceof Error ? err.message : "Failed to load data. Please try again later.")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  // Apply filters when they change
  useEffect(() => {
    const applyFilters = async () => {
      // Skip if we're still loading initial data or if we have no tasks
      if (isLoading || allTasks.length === 0) return

      try {
        setIsFiltering(true)
        const token = localStorage.getItem("token") || ""
        if (!token) return

        let result: Task[] = []

        if (filters.status === "all" && filters.employee === "all") {
          // Use local filtering when showing all
          result = allTasks
        } else if (filters.status === "all") {
          // Only employee filter
          if (filters.employee === "all") {
            result = allTasks
          } else {
            const tasks = await getTasksByEmployee(parseInt(filters.employee), token)
            result = tasks.map(task => ({
              ...task,
              employeeName: employees.find(emp => emp.id === task.assignedTo)?.name || "Unassigned"
            }))
          }
        } else if (filters.employee === "all") {
          // Only status filter
          const tasks = await getTasksByStatus(filters.status, token)
          result = tasks.map(task => ({
            ...task,
            employeeName: employees.find(emp => emp.id === task.assignedTo)?.name || "Unassigned"
          }))
        } else {
          // Both filters
          const tasks = await getTasksByEmployeeAndStatus(
            parseInt(filters.employee),
            filters.status,
            token
          )
          result = tasks.map(task => ({
            ...task,
            employeeName: employees.find(emp => emp.id === task.assignedTo)?.name || "Unassigned"
          }))
        }

        setFilteredTasks(result)
      } catch (err) {
        console.error("Error applying filters:", err)
        setError("Failed to apply filters. Please try again.")
      } finally {
        setIsFiltering(false)
      }
    }

    applyFilters()
  }, [filters, allTasks, employees, isLoading])

  const handleCreateTask = () => {
    router.push("/dashboard/manager/tasks/create")
  }

  return (
    <AuthGuard requiredRole="manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manager Dashboard</h1>
          <Button onClick={handleCreateTask}>
            <Plus className="mr-2 h-4 w-4" /> Create Task
          </Button>
        </div>

        <TaskFilters 
          filters={filters} 
          setFilters={setFilters} 
          showEmployeeFilter={true} 
          employees={employees} 
        />

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
            ) : error ? (
              <div className="text-destructive">{error}</div>
            ) : isFiltering ? (
              <div className="flex justify-center items-center h-32">
                <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
                <span>Applying filters...</span>
              </div>
            ) : (
              <TaskList 
                tasks={filteredTasks} 
                isLoading={false} 
                error="" 
                isManager={true} 
                employees={employees} 
              />
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}