import api from './axios'
import type { VehiclePaginationResponse, Vehicle } from '@/types/vehicle.types'

export interface GetVehiclesParams {
  page?: number
  limit?: number
  keyword?: string
}

export const vehicleApi = {
  getAll: (params?: GetVehiclesParams) =>
    api.get<VehiclePaginationResponse>('/vehicle', { params }),

  getById: (id: string) =>
    api.get<{ status: string; data: Vehicle }>(`/vehicle/${id}`),

  getByType: (type: string, params?: GetVehiclesParams) =>
    api.get<VehiclePaginationResponse>(`/vehicle/type/${type}`, { params }),

  create: (data: FormData) =>
    api.post('/vehicle', data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  update: (id: string, data: FormData) =>
    api.patch(`/vehicle/${id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } }),

  delete: (id: string) =>
    api.delete(`/vehicle/${id}`),
}
