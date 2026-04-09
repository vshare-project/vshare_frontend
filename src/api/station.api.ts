import api from './axios'
import type { Station, StationPaginationResponse } from '@/types/station.types'

export interface GetStationsParams {
  page?: number
  limit?: number
  keyword?: string
}

export const stationApi = {
  getAll: (params?: GetStationsParams) => 
    api.get<StationPaginationResponse>('/station', { params }),

  getById: (id: number | string) => 
    api.get<{ status: string; data: Station }>(`/station/${id}`),

  // API thêm và sửa yêu cầu FormData vì có upload.array('images', 5)
  create: (data: FormData) => 
    api.post('/station', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  update: (id: number | string, data: FormData) => 
    api.patch(`/station/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  delete: (id: number | string) => 
    api.delete(`/station/${id}`),
}