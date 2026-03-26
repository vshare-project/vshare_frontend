import api from './axios'

export const authApi = {
  login: async (identifier: string, password: string) => {
    const res = await api.post('/auth/login', { identifier, password });
    return res.data;
  },

  register: (data: { fullName: string; email: string; phone: string; password: string }) =>
    api.post('/auth/register', data),

  forgotPassword: (email: string) =>
    api.post('/auth/forgot-password', { email }),

  resetPassword: (token: string, password: string) =>
    api.post('/auth/reset-password', { token, password }),

  logout: () => api.post('/auth/logout'),
}
