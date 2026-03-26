import { Link, NavLink, useNavigate } from 'react-router-dom'
import { Zap, Map, User, LogOut, Menu, X, ChevronDown, LayoutDashboard } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { cn } from '@/utils/cn'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const { user, isAuthenticated, handleLogout, isAdmin, isStaff } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const navLinks = [
    { to: '/', label: 'Trang chủ' },
    { to: '/map', label: 'Bản đồ trạm' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shadow-sm">
              <Zap className="w-4 h-4 text-white" fill="currentColor" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-gray-900">
              V<span className="text-brand-600">Share</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                className={({ isActive }) => cn(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}>
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Auth */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 rounded-full bg-brand-100 border border-brand-200 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-brand-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">{user?.fullName}</span>
                  <ChevronDown className={cn('w-3.5 h-3.5 text-gray-400 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-lg py-1">
                    {/* NÚT TRANG QUẢN TRỊ: Chỉ hiện cho Admin/Staff */}
                    {(isAdmin || isStaff) && (
                      <Link to="/admin" onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-brand-600 font-bold hover:bg-brand-50">
                        <LayoutDashboard className="w-4 h-4" /> Trang quản trị
                      </Link>
                    )}
                    <Link to="/profile" onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      <User className="w-4 h-4" /> Tài khoản
                    </Link>
                    <button onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50">
                      <LogOut className="w-4 h-4" /> Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login"><Button variant="ghost" size="sm">Đăng nhập</Button></Link>
                <Link to="/register"><Button size="sm">Đăng ký</Button></Link>
              </>
            )}
          </div>

          {/* Mobile toggle */}
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-50" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5 text-gray-700" /> : <Menu className="w-5 h-5 text-gray-700" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1 border-t border-gray-100 pt-3">
            {navLinks.map(link => (
              <NavLink key={link.to} to={link.to} end={link.to === '/'}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) => cn(
                  'flex items-center gap-2 px-4 py-2 rounded-lg text-sm',
                  isActive ? 'text-brand-600 bg-brand-50' : 'text-gray-600 hover:bg-gray-50'
                )}>{link.label}</NavLink>
            ))}
            {!isAuthenticated && (
              <div className="flex gap-2 pt-2 px-4">
                <Link to="/login" className="flex-1"><Button variant="outline" size="sm" className="w-full">Đăng nhập</Button></Link>
                <Link to="/register" className="flex-1"><Button size="sm" className="w-full">Đăng ký</Button></Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
