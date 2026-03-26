import axios from 'axios'
import { useAuthStore } from '@/store/auth.store'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        const { refreshToken } = useAuthStore.getState()

        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          { refreshToken },
        )

        // Backend trả về data: { data: { accessToken, refreshToken } } 
        const { accessToken, refreshToken: newRefreshToken } = data.data

        useAuthStore.getState().setTokens(accessToken, newRefreshToken)

        original.headers.Authorization = `Bearer ${accessToken}`
        return api(original)
      } catch (err) {
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(err)
      }
    }
    return Promise.reject(error)
  }
)

export default api
