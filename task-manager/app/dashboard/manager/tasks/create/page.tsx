"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthGuard } from "@/components/auth-guard"
import { createTask, getAllUsers } from "@/lib/api"
import { TaskStatus, type User } from "@/lib/types"

export default function CreateTaskPage() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [employees, setEmployees] = useState<User[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = localStorage.getItem("token") || ""
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.")
        }

        const allUsers = await getAllUsers(token)
        // Filter to only show employees
        const employeesList = allUsers.filter((user) => user.role === "employee")
        setEmployees(employeesList)
      } catch (err) {
        console.error("Error fetching employees:", err)
      }
    }

    fetchEmployees()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const token = localStorage.getItem("token") || ""
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const deadlineDate = new Date(deadline)

      await createTask(
        {
          title,
          description,
          deadline: deadlineDate.toISOString(),
          assignedTo: Number.parseInt(assignedTo),
          status: TaskStatus.PENDING, // Default status for new tasks
        },
        token,
      )

      router.push("/dashboard/manager")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create task. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthGuard requiredRole="manager">
      <div className="space-y-6">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Task Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  type="datetime-local"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee">Assign To</Label>
                <Select value={assignedTo} onValueChange={setAssignedTo} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select an employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id.toString()}>
                        {employee.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <CardFooter className="px-0 pt-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Task"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
