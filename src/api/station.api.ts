import api from './axios'

export const stationApi = {
  getAll: () => api.get('/stations'),

  getById: (id: string) => api.get(`/stations/${id}`),

  create: (data: unknown) => api.post('/stations', data),

  update: (id: string, data: unknown) => api.put(`/stations/${id}`, data),

  delete: (id: string) => api.delete(`/stations/${id}`),
}
