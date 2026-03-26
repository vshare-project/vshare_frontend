import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { Zap, Mail, Lock, User, Phone } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'

const schema = z.object({
  fullName: z.string().min(2, 'Họ tên ít nhất 2 ký tự'),
  email: z.string().email('Email không hợp lệ'),
  phone: z.string().regex(/^0\d{9}$/, 'Số điện thoại không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu ít nhất 6 ký tự'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Mật khẩu không khớp', path: ['confirmPassword'],
})
type FormData = z.infer<typeof schema>

export default function RegisterPage() {
  const navigate = useNavigate()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.register({ fullName: data.fullName, email: data.email, phone: data.phone, password: data.password })
      toast.success('Đăng ký thành công! Hãy đăng nhập.')
      navigate('/login')
    } catch {
      toast.error('Đăng ký thất bại, email đã tồn tại')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4 glow">
            <Zap className="w-7 h-7 text-brand-400" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-display font-bold">Tạo tài khoản</h1>
          <p className="text-sm text-green-600 mt-1">Tham gia VShare hôm nay</p>
        </div>

        <div className="glass rounded-2xl p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input {...register('fullName')} label="Họ và tên" placeholder="Nguyễn Văn A"
              leftIcon={<User className="w-4 h-4" />} error={errors.fullName?.message} />
            <Input {...register('email')} label="Email" type="email" placeholder="you@example.com"
              leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} />
            <Input {...register('phone')} label="Số điện thoại" placeholder="0901234567"
              leftIcon={<Phone className="w-4 h-4" />} error={errors.phone?.message} />
            <Input {...register('password')} label="Mật khẩu" type="password" placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />} error={errors.password?.message} />
            <Input {...register('confirmPassword')} label="Xác nhận mật khẩu" type="password" placeholder="••••••••"
              leftIcon={<Lock className="w-4 h-4" />} error={errors.confirmPassword?.message} />
            <Button type="submit" className="w-full mt-2" loading={isSubmitting}>
              Đăng ký
            </Button>
          </form>
        </div>

        <p className="text-center text-sm text-green-600 mt-4">
          Đã có tài khoản?{' '}
          <Link to="/login" className="text-brand-400 hover:text-brand-300 font-medium">Đăng nhập</Link>
        </p>
      </div>
    </div>
  )
}
