// API Configuration
const getApiBaseUrl = (): string => {
  // hardcoding backend URL for now...
  return 'http://44.201.79.252:3000/api'
}

export const API_BASE_URL = getApiBaseUrl()

export const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken')
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  }
} 