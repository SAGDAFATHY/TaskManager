"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthGuard } from "@/components/auth-guard"
import { getAllUsers, addUser, deleteUser } from "@/lib/api"
import type { User, UserInsert } from "@/lib/types"

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState("")
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState<User | null>(null)
  const [newEmployee, setNewEmployee] = useState<Omit<UserInsert, "role">>({
    name: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

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
        setError("Failed to load employees. Please try again later.")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [])

  const handleAddEmployee = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const token = localStorage.getItem("token") || ""
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      await addUser(
        {
          ...newEmployee,
          role: "employee",
        },
        token,
      )

      setShowAddDialog(false)
      setNewEmployee({ name: "", email: "", password: "" })

      // Refresh employee list
      const allUsers = await getAllUsers(token)
      const employeesList = allUsers.filter((user) => user.role === "employee")
      setEmployees(employeesList)
    } catch (err) {
      console.error("Error adding employee:", err)
      alert(err instanceof Error ? err.message : "Failed to add employee")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteEmployee = async () => {
    if (!selectedEmployee) return

    setIsSubmitting(true)
    try {
      const token = localStorage.getItem("token") || ""
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      await deleteUser(selectedEmployee.id, token)

      setShowDeleteDialog(false)
      setSelectedEmployee(null)

      // Refresh employee list
      const allUsers = await getAllUsers(token)
      const employeesList = allUsers.filter((user) => user.role === "employee")
      setEmployees(employeesList)
    } catch (err) {
      console.error("Error deleting employee:", err)
      alert(err instanceof Error ? err.message : "Failed to delete employee")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <AuthGuard requiredRole="manager">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Manage Employees</h1>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> Add Employee
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Employee</DialogTitle>
                <DialogDescription>
                  Create a new employee account. They will be able to log in and manage their assigned tasks.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddEmployee}>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({ ...newEmployee, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={newEmployee.password}
                      onChange={(e) => setNewEmployee({ ...newEmployee, password: e.target.value })}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Adding..." : "Add Employee"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Employee List</CardTitle>
            <CardDescription>Manage your team members and their accounts</CardDescription>
          </CardHeader>
          <CardContent>
            {error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : employees.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">
                No employees found. Add your first employee to get started.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employees.map((employee) => (
                    <TableRow key={employee.id}>
                      <TableCell>{employee.name}</TableCell>
                      <TableCell>{employee.email}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Dialog
                            open={showDeleteDialog && selectedEmployee?.id === employee.id}
                            onOpenChange={(open) => {
                              setShowDeleteDialog(open)
                              if (open) setSelectedEmployee(employee)
                            }}
                          >
                            <DialogTrigger asChild>
                              <Button variant="destructive" size="sm">
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Delete Employee</DialogTitle>
                                <DialogDescription>
                                  Are you sure you want to delete {employee.name}? This action cannot be undone.
                                </DialogDescription>
                              </DialogHeader>
                              <DialogFooter>
                                <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
                                  Cancel
                                </Button>
                                <Button variant="destructive" onClick={handleDeleteEmployee} disabled={isSubmitting}>
                                  {isSubmitting ? "Deleting..." : "Delete"}
                                </Button>
                              </DialogFooter>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  )
}
