import axios from 'axios'

// Dynamically determine the API base URL
const getBaseURL = () => {
  // If VITE_API_URL is set in .env, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  
  // Otherwise, use the current host with port 8000
  const protocol = window.location.protocol
  const hostname = window.location.hostname
  
  // For local development with .test domain
  if (hostname.includes('.test')) {
    return 'http://queue-system.test/api'
  }
  
  // For network access (192.168.x.x or production)
  return `${protocol}//${hostname}:8000/api`
}

// API Configuration
const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// Debug: Log the API URL being used
console.log('🌐 API Base URL:', api.defaults.baseURL)

// Request interceptor (for future auth tokens)
api.interceptors.request.use(
  (config) => {
    // You can add auth tokens here later
    // const token = localStorage.getItem('token')
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`
    // }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor (for error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message)
    return Promise.reject(error)
  }
)

export default api