"use client"

import { useEffect, useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CheckCircle2, Clock, AlertCircle, ListChecks } from "lucide-react"
import { getTasksByEmployee, getAllTasks } from "@/lib/api" // تأكدي أن عندك هذا المسار
import { Task } from "@/lib/types"
import Link from "next/link"

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])

  const token = localStorage.getItem("token") || ""
  const user = JSON.parse(localStorage.getItem("user") || "{}")

  useEffect(() => {

    const fetchTasksForEmployee = async () => {
      try {
        const data = await getTasksByEmployee(user.id, token)
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks", error)
      }
    }

    const fetchTasksForManager = async () => {
      try {
        const data = await getAllTasks(token)
        setTasks(data)
      } catch (error) {
        console.error("Error fetching tasks", error)
      }
    }

    if(user.role === "manager")
        fetchTasksForManager()
    else
        fetchTasksForEmployee()
  }, [])

  const pending = tasks.filter((t) => t.status === "PENDING")
  const inProgress = tasks.filter((t) => t.status === "IN_PROGRESS")
  const completed = tasks.filter((t) => t.status === "COMPLETED")
  const recentTasks = [...tasks].slice(-4).reverse()

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Tasks" count={tasks.length} icon={<ListChecks className="h-4 w-4 text-muted-foreground" />} description="All assigned tasks" />
        <StatCard title="Pending" count={pending.length} icon={<Clock className="h-4 w-4 text-muted-foreground" />} description="Tasks not started" />
        <StatCard title="In Progress" count={inProgress.length} icon={<AlertCircle className="h-4 w-4 text-muted-foreground" />} description="Tasks currently in progress" />
        <StatCard title="Completed" count={completed.length} icon={<CheckCircle2 className="h-4 w-4 text-muted-foreground" />} description="Tasks completed" />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>Your most recently assigned tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentTasks.map((task, i) => (
                <Link href={`dashboard/${user.role}`} key={task.id} className="block">
                <div key={task.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div>
                    <p className="font-medium">{task.title}</p>
                    <p className="text-sm text-muted-foreground">
                      Due: {task.deadline || "N/A"}
                    </p>
                  </div>
                  <div
                    className={`px-2 py-1 rounded-full text-xs ${
                      task.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : task.status === "IN_PROGRESS"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {task.status.replace("-", " ").replace(/\b\w/g, l => l.toUpperCase())}
                  </div>
                </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function StatCard({ title, count, icon, description }: { title: string; count: number; icon: React.ReactNode; description: string }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
