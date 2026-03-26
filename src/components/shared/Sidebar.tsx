import { NavLink } from 'react-router-dom'
import { LayoutDashboard, Bike, MapPin, Users, CreditCard, Zap, LogOut, ChevronLeft } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useAppStore } from '@/store/app.store'
import { cn } from '@/utils/cn'

const navItems = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/vehicles', icon: Bike, label: 'Phương tiện' },
  { to: '/admin/stations', icon: MapPin, label: 'Trạm xe' },
  { to: '/admin/users', icon: Users, label: 'Người dùng' },
  { to: '/admin/subscriptions', icon: CreditCard, label: 'Gói dịch vụ' },
]

export function Sidebar() {
  const { user, handleLogout } = useAuth()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <>
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={toggleSidebar} />
      )}

      <aside className={cn(
        'fixed top-0 left-0 h-screen z-40 flex flex-col bg-white border-r border-gray-100 shadow-sm transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-16'
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100 h-16">
          {sidebarOpen && (
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-600 flex items-center justify-center">
                <Zap className="w-3.5 h-3.5 text-white" fill="currentColor" />
              </div>
              <span className="font-display font-bold text-sm text-gray-900">
                V<span className="text-brand-600">Share</span> Admin
              </span>
            </div>
          )}
          <button onClick={toggleSidebar}
            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors ml-auto">
            <ChevronLeft className={cn('w-4 h-4 transition-transform', !sidebarOpen && 'rotate-180')} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {navItems.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-brand-50 text-brand-700 border border-brand-100'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                !sidebarOpen && 'justify-center'
              )}
              title={!sidebarOpen ? label : undefined}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {sidebarOpen && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* User */}
        <div className="p-3 border-t border-gray-100">
          {sidebarOpen ? (
            <div className="flex items-center gap-3 px-2 py-2">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-brand-200 shrink-0 bg-brand-50">
                <img
                  src={user?.profileImageUrl || 'https://ui-avatars.com/api/?name=' + user?.fullName}
                  className="w-full h-full object-cover"
                  alt="Avatar"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-gray-900 truncate uppercase">{user?.fullName}</p>
                {/* Hiển thị Role Badge nhỏ */}
                <p className="text-[10px] font-medium text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded inline-block">
                  {user?.userType}
                </p>
              </div>
              <button onClick={handleLogout} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button onClick={handleLogout}
              className="w-full flex justify-center p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors">
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </aside>
    </>
  )
}
