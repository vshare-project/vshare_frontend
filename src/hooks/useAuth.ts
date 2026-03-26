import { UserRole } from './../types/user.types';
import { useAuthStore } from '@/store/auth.store'
import { authApi } from '@/api/auth.api'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogin = async (email: string, password: string) => {
    try {
      const { data } = await authApi.login(email, password)
      login(data.user, data.accessToken, data.refreshToken)
      toast.success('Đăng nhập thành công!')
      if (data.user.userType === UserRole.ADMIN || data.user.userType === UserRole.STAFF) {
        navigate('/admin')
      } else {
        navigate('/')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } }
      toast.error(error.response?.data?.message || 'Đăng nhập thất bại')
      throw err
    }
  }

  const handleLogout = async () => {
    try { await authApi.logout() } catch { /* ignore */ }
    logout()
    navigate('/login')
  }

  const isAdmin = user?.userType === 'admin'
  const isStaff = user?.userType === 'staff'

  return { user, isAuthenticated, isAdmin, isStaff, handleLogin, handleLogout }
}
