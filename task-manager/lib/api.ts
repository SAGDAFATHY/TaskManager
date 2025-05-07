import type { Task, TaskStatus, User, UserAuth, UserInsert } from "./types"
import { API_BASE_URL } from "./config"

// Auth API
export const loginUser = async (credentials: UserAuth): Promise<string> => {
  console.log("Logging in with:", credentials)

  const response = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Login failed:", errorText)
    throw new Error(errorText || "Login failed")
  }

  const token = await response.text()
  console.log("Login successful, token received")
  return `Bearer ${token}`
}

export const getUserById = async (id: number, token: string): Promise<User> => {
  console.log(`Fetching user with ID: ${id}`)

  const response = await fetch(`${API_BASE_URL}/user/view-user-by-id/${id}`, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to fetch user:", errorText)
    throw new Error("Failed to fetch user details")
  }

  const userData = await response.json()
  console.log("User data received:", userData)
  return userData
}

export const updatePassword = async (id: number, newPassword: string, token: string): Promise<void> => {
  console.log(`Updating password for user ID: ${id}`)

  const response = await fetch(`${API_BASE_URL}/user/update-pass/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain",
      Authorization: token,
    },
    body: newPassword,
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to update password:", errorText)
    throw new Error("Failed to update password")
  }

  console.log("Password updated successfully")
}

// Manager API
export const getAllUsers = async (token: string): Promise<User[]> => {
  console.log("Fetching all users")

  const response = await fetch(`${API_BASE_URL}/manager/view-all-users`, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to fetch users:", errorText)
    throw new Error("Failed to fetch users")
  }

  const users = await response.json()
  console.log(`Retrieved ${users.length} users`)
  return users
}

export const addUser = async (user: UserInsert, token: string): Promise<void> => {
  console.log("Adding new user:", user.name)

  const response = await fetch(`${API_BASE_URL}/manager/add-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(user),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to add user:", errorText)
    throw new Error(errorText || "Failed to add user")
  }

  console.log("User added successfully")
}

export const deleteUser = async (id: number, token: string): Promise<void> => {
  console.log(`Deleting user with ID: ${id}`)

  const response = await fetch(`${API_BASE_URL}/manager/delete-user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to delete user:", errorText)
    throw new Error("Failed to delete user")
  }

  console.log("User deleted successfully")
}

// Task API
export const getAllTasks = async (token: string): Promise<Task[]> => {
  console.log("Fetching all tasks")

  const response = await fetch(`${API_BASE_URL}/tasks/manager`, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to fetch tasks:", errorText)
    throw new Error("Failed to fetch tasks")
  }

  const tasks = await response.json()
  console.log(`Retrieved ${tasks.length} tasks`)
  return tasks
}

export const getTaskById = async (id: number, token: string): Promise<Task> => {
  console.log(`Fetching task with ID: ${id}`)

  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to fetch task:", errorText)
    throw new Error("Failed to fetch task")
  }

  const task = await response.json()
  console.log("Task data received:", task)
  return task
}

export const createTask = async (task: Omit<Task, "id">, token: string): Promise<Task> => {
  console.log("Creating new task:", task.title)

  const response = await fetch(`${API_BASE_URL}/tasks/manager`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to create task:", errorText)
    throw new Error("Failed to create task")
  }

  const createdTask = await response.json()
  console.log("Task created successfully:", createdTask)
  return createdTask
}

export const updateTask = async (id: number, task: Task, token: string): Promise<Task> => {
  console.log(`Updating task with ID: ${id}`)

  const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(task),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to update task:", errorText)
    throw new Error("Failed to update task")
  }

  const updatedTask = await response.json()
  console.log("Task updated successfully:", updatedTask)
  return updatedTask
}

export const deleteTask = async (id: number, token: string): Promise<void> => {
  console.log(`Deleting task with ID: ${id}`)

  const response = await fetch(`${API_BASE_URL}/tasks/manager/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to delete task:", errorText)
    throw new Error("Failed to delete task")
  }

  console.log("Task deleted successfully")
}

export const getTasksByEmployee = async (employeeId: number, token: string): Promise<Task[]> => {
  console.log(`Fetching tasks for employee ID: ${employeeId}`)

  const response = await fetch(`${API_BASE_URL}/tasks/employee?employeeId=${employeeId}`, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to fetch employee tasks:", errorText)
    throw new Error("Failed to fetch tasks")
  }

  const tasks = await response.json()
  console.log(`Retrieved ${tasks.length} tasks for employee`)
  return tasks
}

export const getTasksByStatus = async (status: TaskStatus, token: string): Promise<Task[]> => {
  console.log(`Fetching tasks with status: ${status}`)

  const response = await fetch(`${API_BASE_URL}/tasks/status?status=${status}`, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to fetch tasks by status:", errorText)
    throw new Error("Failed to fetch tasks")
  }

  const tasks = await response.json()
  console.log(`Retrieved ${tasks.length} tasks with status ${status}`)
  return tasks
}

export const getTasksByEmployeeAndStatus = async (
  employeeId: number,
  status: TaskStatus,
  token: string,
): Promise<Task[]> => {
  console.log(`Fetching tasks for employee ID: ${employeeId} with status: ${status}`)

  const response = await fetch(`${API_BASE_URL}/tasks/filter?employeeId=${employeeId}&status=${status}`, {
    headers: {
      Authorization: token,
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Failed to fetch filtered tasks:", errorText)
    throw new Error("Failed to fetch tasks")
  }

  const tasks = await response.json()
  console.log(`Retrieved ${tasks.length} filtered tasks`)
  return tasks
}
