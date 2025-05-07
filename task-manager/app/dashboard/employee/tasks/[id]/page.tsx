"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Calendar } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AuthGuard } from "@/components/auth-guard"
import { format } from "date-fns"
import { getTaskById, updateTask } from "@/lib/api"
import { type Task, TaskStatus } from "@/lib/types"

export default function TaskDetailPage({ params }: { params: { id: string } }) {
  const [task, setTask] = useState<Task | null>(null)
  const [status, setStatus] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const router = useRouter()
  const { id } = params

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const token = localStorage.getItem("token") || ""
        if (!token) {
          throw new Error("Authentication token not found. Please log in again.")
        }

        const taskData = await getTaskById(Number.parseInt(id), token)
        setTask(taskData)
        setStatus(taskData.status)
      } catch (err) {
        setError("Failed to load task. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTask()
  }, [id])

  const handleUpdateStatus = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      const token = localStorage.getItem("token") || ""
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      if (!task) {
        throw new Error("Task data is missing")
      }

      await updateTask(
        Number.parseInt(id),
        {
          ...task,
          status: status as TaskStatus,
        },
        token,
      )

      router.push("/dashboard/employee")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update task. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <AuthGuard requiredRole="employee">
      <div className="space-y-6">
        <Button variant="ghost" className="flex items-center gap-2" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>

        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>{task?.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant="destructive">
                {/* <AlertCircle className="h-4 w-4" /> */}
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1">
              <h3 className="text-sm font-medium">Description</h3>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{task?.description}</p>
            </div>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Deadline: {task?.deadline ? format(new Date(task.deadline), "PPP p") : "Not set"}
                </span>
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Update Status</Label>
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

              <CardFooter className="px-0 pt-4">
                <Button type="submit" className="w-full" disabled={isSaving}>
                  {isSaving ? "Updating..." : "Update Status"}
                </Button>
              </CardFooter>
            </form>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
