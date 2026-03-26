import { Outlet } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { Toaster } from 'sonner'

export function ClientLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-16">
        <Outlet />
      </main>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#fff', border: '1px solid #e5e7eb', color: '#111827' },
      }} />
    </div>
  )
}
