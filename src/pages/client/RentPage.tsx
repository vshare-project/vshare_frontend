import { useParams, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { Battery, MapPin, Clock, CreditCard, ChevronLeft, Zap } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/utils/format'
import { toast } from 'sonner'

// Mock
const MOCK_VEHICLE = {
  id: 'v1', code: 'VS-001', name: 'VinFast Klara S 2024',
  type: 'SCOOTER', status: 'AVAILABLE', batteryLevel: 92,
  pricePerHour: 25000, stationId: '1',
  stationName: 'Trạm Bến Thành',
  stationAddress: '1 Công Trường Quách Thị Trang, Q.1',
  range: '~110km', maxSpeed: '60km/h', weight: '98kg',
}

export default function RentPage() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const [hours, setHours] = useState(1)
  const [loading, setLoading] = useState(false)
  const v = MOCK_VEHICLE
  const total = v.pricePerHour * hours

  const handleRent = async () => {
    setLoading(true)
    await new Promise(r => setTimeout(r, 1200))
    setLoading(false)
    toast.success('Đặt xe thành công! Mã QR đã gửi vào email.')
    navigate('/')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <button onClick={() => navigate(-1)} className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 mb-6 transition-colors">
        <ChevronLeft className="w-4 h-4" /> Quay lại
      </button>

      <h1 className="text-2xl font-display font-bold mb-6">Xác nhận thuê xe</h1>

      {/* Vehicle card */}
      <Card className="mb-4">
        <CardContent>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant="success">{v.status === 'AVAILABLE' ? 'Sẵn sàng' : 'Không khả dụng'}</Badge>
                <span className="text-xs font-mono text-gray-400">{v.code}</span>
              </div>
              <h2 className="text-xl font-display font-bold text-gray-800">{v.name}</h2>
              <div className="flex items-center gap-1 mt-1 text-sm text-gray-9000">
                <MapPin className="w-3.5 h-3.5" /> {v.stationName}
              </div>
            </div>
            <div className="w-20 h-20 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-center">
              <Zap className="w-8 h-8 text-brand-500/40" fill="currentColor" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mt-5">
            {[
              { label: 'Pin', value: `${v.batteryLevel}%`, icon: Battery },
              { label: 'Tầm hoạt động', value: v.range, icon: MapPin },
              { label: 'Tốc độ max', value: v.maxSpeed, icon: Zap },
            ].map(({ label, value, icon: Icon }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <Icon className="w-4 h-4 text-brand-400 mx-auto mb-1" />
                <div className="text-sm font-medium text-gray-800">{value}</div>
                <div className="text-xs text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Duration selector */}
      <Card className="mb-4">
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-4 h-4 text-brand-400" />
            <h3 className="font-display font-semibold">Thời gian thuê</h3>
          </div>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setHours(Math.max(1, hours - 1))}
              className="w-10 h-10 rounded-xl border border-gray-100 hover:border-brand-500/40 text-gray-600 text-xl font-bold flex items-center justify-center transition-colors">−</button>
            <div className="flex-1 text-center">
              <span className="text-3xl font-display font-bold text-brand-600">{hours}</span>
              <span className="text-gray-400 ml-2">giờ</span>
            </div>
            <button onClick={() => setHours(Math.min(24, hours + 1))}
              className="w-10 h-10 rounded-xl border border-gray-100 hover:border-brand-500/40 text-gray-600 text-xl font-bold flex items-center justify-center transition-colors">+</button>
          </div>
          <div className="flex gap-2">
            {[1, 2, 4, 8].map(h => (
              <button key={h} onClick={() => setHours(h)}
                className={`flex-1 py-2 rounded-lg text-xs font-mono border transition-colors ${hours === h ? 'border-brand-500/50 bg-brand-500/10 text-brand-400' : 'border-gray-100 text-gray-400 hover:border-brand-500/20'}`}>
                {h}h
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card className="mb-6 glow">
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-4 h-4 text-brand-400" />
            <h3 className="font-display font-semibold">Tóm tắt đặt xe</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: `Giá thuê (${formatCurrency(v.pricePerHour)}/h × ${hours}h)`, value: formatCurrency(total) },
              { label: 'Phí dịch vụ', value: 'Miễn phí' },
              { label: 'Bảo hiểm', value: 'Đã bao gồm' },
            ].map(row => (
              <div key={row.label} className="flex justify-between">
                <span className="text-gray-9000">{row.label}</span>
                <span className="text-gray-700 font-mono">{row.value}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-2 flex justify-between font-semibold">
              <span className="text-gray-700">Tổng cộng</span>
              <span className="text-brand-600 text-lg font-display">{formatCurrency(total)}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleRent} size="lg" className="w-full" loading={loading}>
        <Zap className="w-5 h-5" fill="currentColor" />
        Xác nhận thuê xe
      </Button>
      <p className="text-center text-xs text-gray-400 mt-3">Mã QR mở khoá xe sẽ gửi về email của bạn</p>
    </div>
  )
}
