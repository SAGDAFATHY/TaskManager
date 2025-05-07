"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { updatePassword } from "@/lib/api"
import type { User } from "@/lib/types"

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Get user from localStorage
    const userData = localStorage.getItem("user")
    if (userData) {
      setUser(JSON.parse(userData))
    }
  }, [])

  const handleUpdatePassword = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      if (!user) {
        throw new Error("User information not found. Please log in again.")
      }

      const token = localStorage.getItem("token") || ""
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.")
      }

      await updatePassword(user.id, newPassword, token)

      setSuccess("Password updated successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update password. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!user) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Profile Settings</CardTitle>
          <CardDescription>Update your account settings and change your password</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-medium">Account Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name</Label>
                <div className="mt-1 text-muted-foreground">{user.name}</div>
              </div>
              <div>
                <Label>Email</Label>
                <div className="mt-1 text-muted-foreground">{user.email}</div>
              </div>
              <div>
                <Label>Role</Label>
                <div className="mt-1 text-muted-foreground capitalize">{user.role.toLowerCase()}</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Change Password</h3>
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {success && (
              <Alert className="bg-green-50 text-green-800 border-green-200">
                <AlertDescription>{success}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleUpdatePassword} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
