import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const getUserIdFromToken = (token: string): number => {
  try {
    console.log("Attempting to extract user ID from token")

    // Basic JWT structure: header.payload.signature
    const parts = token.split(".")
    if (parts.length !== 3) {
      console.warn("Token does not appear to be in JWT format")
      return 1
    }

    const payload = parts[1]
    // Add padding if needed
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

    // Decode base64
    const jsonPayload = atob(padded)
    const decodedPayload = JSON.parse(jsonPayload)

    console.log("JWT payload structure:", Object.keys(decodedPayload))

    // Look for common user ID field names
    const userId = decodedPayload.userId || decodedPayload.user_id || decodedPayload.id || decodedPayload.sub || 1

    console.log("Extracted user ID:", userId)
    return Number(userId)
  } catch (error) {
    console.error("Error extracting user ID from token:", error)
    return 1 // Default fallback
  }
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
