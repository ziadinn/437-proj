// API Configuration
const getApiBaseUrl = (): string => {
  // hardcoding backend URL for now...
  return 'https://437-proj-be-production.up.railway.app/api'
}

export const API_BASE_URL = getApiBaseUrl()

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
} 