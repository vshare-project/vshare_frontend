import api from './axios'
import { User, UpdateUserDto } from '@/types/user.types'

export interface ApiResponse<T> {
  status: string
  message: string
  data: T
}

export const userApi = {
  getProfile: async () => {
    const res = await api.get<ApiResponse<User>>('/users/me')
    return res.data
  },

  updateProfile: async (data: UpdateUserDto) => {
    const res = await api.patch<ApiResponse<User>>('/users/update-profile', data)
    return res.data
  },

  updateAvatar: async (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    const res = await api.patch<ApiResponse<User>>('/users/upload-avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return res.data
  },
}