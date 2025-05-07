"use client"

import { use } from 'react' 
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AlertCircle, ArrowLeft, Trash2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { AuthGuard } from "@/components/auth-guard"
import { getTaskById, updateTask, deleteTask, getAllUsers, getUserById } from "@/lib/api"
import { type Task, TaskStatus, type User } from "@/lib/types"

export default function TaskDetailPage({ params }) {
  const [task, setTask] = useState<Task | null>(null)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [deadline, setDeadline] = useState("")
  const [status, setStatus] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [employees, setEmployees] = useState<User[]>([])
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const router = useRouter()
  const { id } = use(params)

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token") || ""
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.")
        }

        const taskData = await getTaskById(Number.parseInt(id), token)
        setTask(taskData)
        setTitle(taskData.title)
        setDescription(taskData.description)

        // Format date for datetime-local input
        if (taskData.deadline) {
          const deadlineDate = new Date(taskData.deadline)
          const formattedDate = deadlineDate.toISOString().slice(0, 16)
          setDeadline(formattedDate)
        }

        setStatus(taskData.status)
        
        const assignedToUsername = await getUserById(taskData.assignedTo,token)
        setAssignedTo(assignedToUsername.name)
        // Fetch employees
        const allUsers = await getAllUsers(token)
        // Filter to only show employees
        const employeesList = allUsers.filter((user) => user.role === "employee")
        setEmployees(employeesList)
      } catch (err) {
        setError("Failed to load task. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [id])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token") || ""
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      const deadlineDate = deadline ? new Date(deadline) : null

      if (!task) {
        throw new Error("Task data is missing")
      }

      await updateTask(
        Number.parseInt(id),
        {
          ...task,
          title,
          description,
          deadline: deadlineDate ? deadlineDate.toISOString() : null,
          status: status as TaskStatus,
          assignedTo: Number.parseInt(assignedTo),
        },
        token,
      )

      router.push("/dashboard/manager")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      const token = localStorage.getItem("token") || ""
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      await deleteTask(Number.parseInt(id), token)
      router.push("/dashboard/manager")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete task. Please try again.")
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <AuthGuard requiredRole="manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>

          <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="flex items-center gap-2">
                <Trash2 className="h-4 w-4" /> Delete Task
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete this task?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete the task.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>Edit Task</CardTitle>
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
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
                    <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
                    <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employee">Assigned To</Label>
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
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
