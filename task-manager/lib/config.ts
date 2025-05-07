// API base URL - change this to your actual backend URL
export const API_BASE_URL = "http://localhost:8080"

// User roles
export const USER_ROLES = {
  MANAGER: "MANAGER",
  EMPLOYEE: "EMPLOYEE",
}

// JWT token utilities
export const getUserIdFromToken = (token: string): number => {
  try {
    // Basic JWT structure: header.payload.signature

    const pureToken = token.replace("Bearer ", "").trim()
    const payload = pureToken.split(".")[1]
    const decodedPayload = JSON.parse(atob(payload))
    return decodedPayload.id || 1 // Adjust based on your actual JWT structure
  } catch (error) {
    console.error("Error extracting user ID from token:", error)
    return 1 // Default fallback
  }
}
