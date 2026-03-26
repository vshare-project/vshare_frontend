import { useEffect, useState } from 'react'
import { useAuthStore } from '@/store/auth.store'
import { userApi } from '@/api/user.api'
import { User as UserIcon, Mail, Phone, Clock, Bike, Star, Camera } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatDate, formatCurrency } from '@/utils/format'
import UserAvatar from '@/components/shared/UserAvatar'

export default function ProfilePage() {
  const { user, setUser } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ totalRides: 0, totalCost: 0 })

  useEffect(() => {
    const fetchLatestProfile = async () => {
      try {
        const res = await userApi.getProfile()
        setUser(res.data)
      } catch (error) {
        console.error("Lỗi lấy thông tin profile", error)
      } finally {
        setLoading(false)
      }
    }
    fetchLatestProfile()
  }, [])

  const handleUploadAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const res = await userApi.updateAvatar(file)
      setUser(res.data)
    } catch (err) {
      console.error("Upload thất bại")
    }
  }

  if (loading || !user) return <div className="p-10 text-center">Đang tải...</div>

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-display font-bold mb-6">Tài khoản của tôi</h1>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <Card glow>
            <CardContent className="pt-6">
              <div className="text-center">
                {/* Khu vực ảnh đại diện có nút upload */}
                <div className="relative w-24 h-24 mx-auto mb-4 group">
                  <UserAvatar
                    src={user.profileImageUrl}
                    alt={user.fullName}
                    className="w-full h-full border-2 border-brand-500/20"
                  />
                  <label className="absolute bottom-0 right-0 p-1.5 bg-brand-500 text-white rounded-full cursor-pointer shadow-lg hover:bg-brand-600 transition-colors">
                    <Camera className="w-4 h-4" />
                    <input type="file" className="hidden" onChange={handleUploadAvatar} accept="image/*" />
                  </label>
                </div>

                <h2 className="font-display font-bold text-lg">{user.fullName}</h2>
                <Badge variant="success" className="mt-1 uppercase text-[10px]">
                  {user.userType}
                </Badge>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 space-y-3">
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600 truncate">{user.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">{user.phone || 'Chưa cập nhật'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Ví & Điểm (BE của bạn có 2 trường này) */}
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-500">Số dư ví</span>
                <span className="font-bold text-brand-600">{formatCurrency(user.walletBalance)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-500">Điểm xanh</span>
                <Badge variant="success" className="bg-green-100 text-green-700">
                  🍃 {user.greenPoints}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Ride history - Tạm thời giữ Mock hoặc render thông báo trống */}
        <div className="md:col-span-2">
          {/* ... Giữ nguyên phần render Ride History của bạn nhưng đổi MOCK_RIDES thành state thực ... */}
        </div>
      </div>
    </div>
  )
}