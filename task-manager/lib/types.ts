// Task-related types
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
}

export interface Task {
  id: number
  title: string
  description: string
  deadline: string // ISO string format
  status: TaskStatus
  assignedTo: number
}

// User-related types
export interface User {
  id: number
  name: string
  email: string
  role: string
}

export interface UserAuth {
  email: string
  password: string
}

export interface UserInsert {
  name: string
  email: string
  role: string
  password: string
}
