import axios from 'axios'
import { ApiError } from './errors'

export const http = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? '/api',
})

http.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(new ApiError('Request was cancelled', 0, 'CANCELLED'))
    }

    if (!error.response) {
      if (error.code === 'ECONNABORTED') {
        return Promise.reject(new ApiError('Request timed out', 0, 'TIMEOUT'))
      }
      return Promise.reject(
        new ApiError('Network error. Check your connection.', 0, 'NETWORK_ERROR')
      )
    }

    const { status, data } = error.response

    const message = data?.message ?? getDefaultMessage(status)
    const code = data?.code
    const details = data?.details

    return Promise.reject(new ApiError(message, status, code, details))
  }
)

function getDefaultMessage(status: number): string {
  const messages: Record<number, string> = {
    400: 'Invalid request',
    401: 'Unauthorized',
    403: 'Forbidden',
    404: 'Not found',
    409: 'Conflict',
    422: 'Validation error',
    429: 'Too many requests',
    500: 'Internal server error',
    502: 'Bad gateway',
    503: 'Service unavailable',
  }
  return messages[status] ?? 'An unexpected error occurred'
}
