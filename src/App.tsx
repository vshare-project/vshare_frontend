import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ClientLayout } from '@/layouts/ClientLayout'
import { AdminLayout } from '@/layouts/AdminLayout'
import { useAuthStore } from '@/store/auth.store'

// Client pages
import HomePage from '@/pages/client/HomePage'
import MapPage from '@/pages/client/MapPage'
import RentPage from '@/pages/client/RentPage'
import ProfilePage from '@/pages/client/ProfilePage'
import LoginPage from '@/pages/client/auth/LoginPage'
import RegisterPage from '@/pages/client/auth/RegisterPage'
import ForgotPasswordPage from '@/pages/client/auth/ForgotPasswordPage'

// Admin pages
import DashboardPage from '@/pages/admin/DashboardPage'
import VehiclesPage from '@/pages/admin/VehiclesPage'
import StationsPage from '@/pages/admin/StationsPage'
import UsersPage from '@/pages/admin/UsersPage'
import SubscriptionsPage from '@/pages/admin/SubscriptionsPage'


interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ('admin' | 'staff' | 'customer')[];
}
function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  // Nếu có yêu cầu quyền cụ thể (ví dụ vào admin cần admin hoặc staff)
  if (allowedRoles && !allowedRoles.includes(user?.userType as any)) {
    return <Navigate to="/" replace />
  }
  return <>{children}</>
}

// Route này dành cho Login/Register: Nếu login rồi thì không cho vào nữa
function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore()
  if (isAuthenticated) return <Navigate to="/" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Client Routes */}
        <Route element={<ClientLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          
          {/* Cần đăng nhập mới vào được */}
          <Route path="/rent/:vehicleId" element={<ProtectedRoute><RentPage /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          
          {/* Đã đăng nhập thì không được vào Login/Register nữa */}
          <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
          <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        </Route>

        {/* Admin Routes - Chỉ cho phép admin và staff */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'staff']}>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="vehicles" element={<VehiclesPage />} />
          <Route path="stations" element={<StationsPage />} />
          <Route path="users" element={<UsersPage />} />
          <Route path="subscriptions" element={<SubscriptionsPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
