// API Configuration
const getApiBaseUrl = (): string => {
  // Check if we're in development mode
  if (import.meta.env.DEV) {
    return 'http://localhost:3000/api'
  }
  
  // In production, use the environment variable or fallback to a relative URL
  return import.meta.env.VITE_API_BASE_URL || '/api'
}

export const API_BASE_URL = getApiBaseUrl()

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
} 