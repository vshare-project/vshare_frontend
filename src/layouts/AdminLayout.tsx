import { Outlet, Link } from 'react-router-dom'
import { Sidebar } from '@/components/shared/Sidebar'
import { useAppStore } from '@/store/app.store'
import { Toaster } from 'sonner'
import { cn } from '@/utils/cn'
import { ArrowLeft, ExternalLink } from 'lucide-react'

export function AdminLayout() {
  const { sidebarOpen } = useAppStore()

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      {/* Container chính */}
      <div className={cn(
        'flex-1 flex flex-col min-h-screen transition-all duration-300',
        sidebarOpen ? 'ml-64' : 'ml-16'
      )}>

        {/* Header của trang Admin */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <h1 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Hệ thống quản trị</h1>
          </div>

          {/* Nút quay lại Client */}
          <Link
            to="/"
            className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg transition-colors border border-brand-100"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Quay lại trang chủ</span>
            <ExternalLink className="w-3 h-3 opacity-50" />
          </Link>
        </header>

        {/* Nội dung Page */}
        <main className="flex-1 p-6 overflow-auto">
          <Outlet />
        </main>
      </div>

      <Toaster position="top-right" toastOptions={{
        style: { background: '#fff', border: '1px solid #e5e7eb', color: '#111827' },
      }} />
    </div>
  )
}