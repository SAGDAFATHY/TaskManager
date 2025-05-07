"use client"
import { useRouter } from "next/navigation"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { format } from "date-fns"
import { Pencil } from "lucide-react"
import { type Task, TaskStatus } from "@/lib/types"

interface TaskListProps {
  tasks: Task[]
  isLoading: boolean
  error: string
  isManager?: boolean
  employees?: any[]
}

export function TaskList({ tasks, isLoading, error, isManager = false, employees = [] }: TaskListProps) {
  const router = useRouter()

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case TaskStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            Pending
          </Badge>
        )
      case TaskStatus.IN_PROGRESS:
        return (
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            In Progress
          </Badge>
        )
      case TaskStatus.COMPLETED:
        return (
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            Completed
          </Badge>
        )
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  const getEmployeeName = (assignedTo: number) => {
    const employee = employees.find((emp) => emp.id === assignedTo)
    return employee ? employee.name : "Unknown"
  }

  const handleEditTask = (taskId: number) => {
    if (isManager) {
      router.push(`/dashboard/manager/tasks/${taskId}`)
    } else {
      router.push(`/dashboard/employee/tasks/${taskId}`)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-32">Loading tasks...</div>
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No tasks found. {isManager && "Create a new task to get started."}
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          {isManager && <TableHead>Assigned To</TableHead>}
          <TableHead>Deadline</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            {isManager && <TableCell>{ getEmployeeName(task.assignedTo)}</TableCell>}
            <TableCell>{task.deadline ? format(new Date(task.deadline), "MMM d, yyyy") : "Not set"}</TableCell>
            <TableCell>{getStatusBadge(task.status)}</TableCell>
            <TableCell className="text-right">
              <Button variant="ghost" size="sm" onClick={() => handleEditTask(task.id)}>
                <Pencil className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
