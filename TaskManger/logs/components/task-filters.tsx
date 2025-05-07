"use client"

import { useEffect, useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { getAllUsers } from "@/lib/api"
import { TaskStatus, type User } from "@/lib/types"

interface TaskFiltersProps {
  filters: {
    status: string
    employee?: string
  }
  setFilters: (filters: any) => void
  showEmployeeFilter?: boolean
  employees?: User[]
}

export function TaskFilters({
  filters,
  setFilters,
  showEmployeeFilter = false,
  employees: propEmployees = [],
}: TaskFiltersProps) {
  const [employees, setEmployees] = useState<User[]>(propEmployees)
  const [isLoading, setIsLoading] = useState(propEmployees.length === 0 && showEmployeeFilter)

  useEffect(() => {
    // If employees are provided as props, use them
    if (propEmployees.length > 0) {
      setEmployees(propEmployees)
      setIsLoading(false)
      return
    }

    // Otherwise fetch them if needed
    if (showEmployeeFilter && employees.length === 0) {
      const fetchEmployees = async () => {
        try {
          const token = localStorage.getItem("token") || ""
          if (!token) {
            throw new Error("Authentication token not found. Please log in again.")
          }

          console.log("Fetching employees for filter")
          const allUsers = await getAllUsers(token)
          // Filter to only show employees
          const employeesList = allUsers.filter((user) => user.role === "EMPLOYEE")
          console.log(`Received ${employeesList.length} employees for filter`)
          setEmployees(employeesList)
        } catch (err) {
          console.error("Error fetching employees:", err)
        } finally {
          setIsLoading(false)
        }
      }

      fetchEmployees()
    }
  }, [showEmployeeFilter, propEmployees, employees.length])

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="w-full sm:w-48">
        <Label htmlFor="status-filter" className="mb-2 block">
          Status
        </Label>
        <Select value={filters.status} onValueChange={(value) => setFilters({ ...filters, status: value })}>
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={TaskStatus.PENDING}>Pending</SelectItem>
            <SelectItem value={TaskStatus.IN_PROGRESS}>In Progress</SelectItem>
            <SelectItem value={TaskStatus.COMPLETED}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {showEmployeeFilter && (
        <div className="w-full sm:w-48">
          <Label htmlFor="employee-filter" className="mb-2 block">
            Employee
          </Label>
          <Select
            value={filters.employee}
            onValueChange={(value) => setFilters({ ...filters, employee: value })}
            disabled={isLoading || employees.length === 0}
          >
            <SelectTrigger id="employee-filter">
              <SelectValue placeholder={isLoading ? "Loading..." : "Filter by employee"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Employees</SelectItem>
              {employees.map((employee) => (
                <SelectItem key={employee.id} value={employee.id.toString()}>
                  {employee.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}
