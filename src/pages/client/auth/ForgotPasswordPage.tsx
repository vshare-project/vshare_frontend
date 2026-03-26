import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link } from 'react-router-dom'
import { Zap, Mail, ArrowLeft } from 'lucide-react'
import { authApi } from '@/api/auth.api'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { toast } from 'sonner'
import { useState } from 'react'

const schema = z.object({ email: z.string().email('Email không hợp lệ') })
type FormData = z.infer<typeof schema>

export default function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    try {
      await authApi.forgotPassword(data.email)
      setSent(true)
      toast.success('Email đặt lại mật khẩu đã được gửi!')
    } catch {
      toast.error('Không tìm thấy email này')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-500/10 border border-brand-500/20 mb-4">
            <Zap className="w-7 h-7 text-brand-400" fill="currentColor" />
          </div>
          <h1 className="text-2xl font-display font-bold">Quên mật khẩu</h1>
          <p className="text-sm text-green-600 mt-1">Nhập email để nhận link đặt lại</p>
        </div>

        <div className="glass rounded-2xl p-6">
          {sent ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 rounded-full bg-brand-500/10 border border-brand-500/20 flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-brand-400" />
              </div>
              <p className="text-sm text-green-300">Kiểm tra hộp thư của bạn và làm theo hướng dẫn.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input {...register('email')} label="Email" type="email" placeholder="you@example.com"
                leftIcon={<Mail className="w-4 h-4" />} error={errors.email?.message} />
              <Button type="submit" className="w-full" loading={isSubmitting}>Gửi link đặt lại</Button>
            </form>
          )}
        </div>

        <p className="text-center mt-4">
          <Link to="/login" className="inline-flex items-center gap-1 text-sm text-green-600 hover:text-green-300">
            <ArrowLeft className="w-3 h-3" /> Quay lại đăng nhập
          </Link>
        </p>
      </div>
    </div>
  )
}
