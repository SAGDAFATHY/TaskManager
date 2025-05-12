import type { Task, TaskStatus, User, UserAuth, UserInsert } from "./types"
import { API_BASE_URL } from "./config"

// Logout helper
const logout = () => {
  localStorage.removeItem("token")
   localStorage.removeItem("user")
  window.location.href = "/"
}

// Generic fetch handler
const handleFetch = async (url: string, options: RequestInit): Promise<Response> => {
  const response = await fetch(url, options)

  if (!response.ok) {
    const errorText = await response.text()

    if (errorText.toLowerCase().includes("invalid token")) {
      console.warn("Invalid token detected, logging out")
      logout()
    }

    throw new Error(errorText || "Request failed")
  }

  return response
}

// Auth API
export const loginUser = async (credentials: UserAuth): Promise<string> => {
  const response = await handleFetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  const token = await response.text()
  return `Bearer ${token}`
}

export const getUserById = async (id: number, token: string): Promise<User> => {
  const response = await handleFetch(`${API_BASE_URL}/user/view-user-by-id/${id}`, {
    headers: { Authorization: token },
  })

  return await response.json()
}

export const updatePassword = async (id: number, newPassword: string, token: string): Promise<void> => {
  await handleFetch(`${API_BASE_URL}/user/update-pass/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "text/plain",
      Authorization: token,
    },
    body: newPassword,
  })
}


// Manager API
export const getAllUsers = async (token: string): Promise<User[]> => {
  const response = await handleFetch(`${API_BASE_URL}/manager/view-all-users`, {
    headers: { Authorization: token },
  })

  return await response.json()
}

export const addUser = async (user: UserInsert, token: string): Promise<void> => {
  await handleFetch(`${API_BASE_URL}/manager/add-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(user),
  })
}

export const deleteUser = async (id: number, token: string): Promise<void> => {
  await handleFetch(`${API_BASE_URL}/manager/delete-user/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  })
}

// Task API
export const getAllTasks = async (token: string): Promise<Task[]> => {
  const response = await handleFetch(`${API_BASE_URL}/tasks/manager`, {
    headers: { Authorization: token },
  })

  return await response.json()
}

export const getTaskById = async (id: number, token: string): Promise<Task> => {
  const response = await handleFetch(`${API_BASE_URL}/tasks/${id}`, {
    headers: { Authorization: token },
  })

  return await response.json()
}

export const createTask = async (task: Omit<Task, "id">, token: string): Promise<Task> => {
  const response = await handleFetch(`${API_BASE_URL}/tasks/manager`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(task),
  })

  return await response.json()
}

export const updateTask = async (id: number, task: Task, token: string): Promise<Task> => {
  const response = await handleFetch(`${API_BASE_URL}/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token,
    },
    body: JSON.stringify(task),
  })

  return await response.json()
}

export const deleteTask = async (id: number, token: string): Promise<void> => {
  await handleFetch(`${API_BASE_URL}/tasks/manager/${id}`, {
    method: "DELETE",
    headers: { Authorization: token },
  })
}

export const getTasksByEmployee = async (employeeId: number, token: string): Promise<Task[]> => {
  const response = await handleFetch(`${API_BASE_URL}/tasks/employee?employeeId=${employeeId}`, {
    headers: { Authorization: token },
  })

  return await response.json()
}

export const getTasksByStatus = async (status: TaskStatus, token: string): Promise<Task[]> => {
  const response = await handleFetch(`${API_BASE_URL}/tasks/status?status=${status}`, {
    headers: { Authorization: token },
  })

  return await response.json()
}

export const getTasksByEmployeeAndStatus = async (
  employeeId: number,
  status: TaskStatus,
  token: string,
): Promise<Task[]> => {
  const response = await handleFetch(`${API_BASE_URL}/tasks/filter?employeeId=${employeeId}&status=${status}`, {
    headers: { Authorization: token },
  })

  return await response.json()
}
