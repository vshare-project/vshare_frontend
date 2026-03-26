import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Zap, Mail, Lock } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'

const schema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
})
type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const { handleLogin } = useAuth()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })
  const onSubmit = async (data: FormData) => {
    await handleLogin(data.email, data.password)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-600 mb-4 shadow-lg shadow-green-200">
            <Zap className="w-7 h-7 text-white" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Đăng nhập</h1>
          <p className="text-sm text-gray-500 mt-1">Chào mừng trở lại VShare</p>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register('email')} label="Email" type="email" placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} />
            <Input {...register('password')} label="Mật khẩu" type="password" placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />} error={errors.password?.message} />
            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-xs text-brand-600 hover:text-brand-700">Quên mật khẩu?</Link>
            </div>
            <Button type="submit" className="w-full" loading={isSubmitting}>Đăng nhập</Button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100" />
            </div>
            <div className="relative flex justify-center text-xs text-gray-400">
              <span className="bg-white px-2">tài khoản demo</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button type="button" className="text-xs px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-brand-50 transition-colors">
              👤 user@demo.vn
            </button>
            <button type="button" className="text-xs px-3 py-2 rounded-lg bg-gray-50 border border-gray-200 text-gray-600 hover:border-brand-300 hover:bg-brand-50 transition-colors">
              🛡️ admin@demo.vn
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-4">
          Chưa có tài khoản?{' '}
          <Link to="/register" className="text-brand-600 hover:text-brand-700 font-semibold">Đăng ký ngay</Link>
        </p>
      </div>
    </div>
  )
}
