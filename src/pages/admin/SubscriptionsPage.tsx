import { CreditCard, Plus } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, formatDate } from '@/utils/format'

const MOCK_PLANS = [
  { id: 'p1', name: 'Gói Cơ Bản',    price: 199000, duration: 30, trips: 20, desc: 'Lý tưởng cho người dùng thỉnh thoảng', active: 234 },
  { id: 'p2', name: 'Gói Thường',     price: 399000, duration: 30, trips: 60, desc: 'Phù hợp đi làm hàng ngày',              active: 891 },
  { id: 'p3', name: 'Gói Cao Cấp',   price: 699000, duration: 30, trips: -1, desc: 'Không giới hạn chuyến đi',               active: 312 },
]

const MOCK_SUBS = [
  { id: 's1', user: 'Nguyễn Văn An', plan: 'Gói Thường',   startDate: '2024-03-01T00:00:00', endDate: '2024-03-31T00:00:00', status: 'ACTIVE',  trips: 23 },
  { id: 's2', user: 'Trần Thị Bình', plan: 'Gói Cơ Bản',   startDate: '2024-03-10T00:00:00', endDate: '2024-04-10T00:00:00', status: 'ACTIVE',  trips: 7  },
  { id: 's3', user: 'Lê Hoàng Cần',  plan: 'Gói Cao Cấp',  startDate: '2024-02-01T00:00:00', endDate: '2024-03-01T00:00:00', status: 'EXPIRED', trips: 58 },
]

export default function SubscriptionsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Gói dịch vụ</h1>
          <p className="text-sm text-gray-400 mt-1">Quản lý các gói đăng ký</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Tạo gói mới</Button>
      </div>

      {/* Plans */}
      <div className="grid sm:grid-cols-3 gap-4">
        {MOCK_PLANS.map(plan => (
          <Card key={plan.id} className="hover:border-brand-500/20 transition-colors">
            <CardContent>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                  <CreditCard className="w-4 h-4 text-brand-400" />
                </div>
                <span className="font-display font-semibold text-sm">{plan.name}</span>
              </div>
              <div className="text-2xl font-display font-bold text-brand-600 mb-1">{formatCurrency(plan.price)}</div>
              <div className="text-xs text-gray-400 mb-3">{plan.duration} ngày · {plan.trips === -1 ? 'Không giới hạn' : `${plan.trips} chuyến`}</div>
              <p className="text-xs text-gray-9000 mb-4">{plan.desc}</p>
              <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-400">Đang dùng</span>
                <Badge variant="success">{plan.active} người</Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Subscriptions table */}
      <Card>
        <CardContent className="p-0">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-display font-semibold">Đăng ký gần đây</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-xs text-gray-400">
                  {['Người dùng','Gói','Bắt đầu','Kết thúc','Chuyến đi','Trạng thái'].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MOCK_SUBS.map(s => (
                  <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-5 py-3 font-medium text-gray-800 text-xs">{s.user}</td>
                    <td className="px-5 py-3 text-brand-600 text-xs">{s.plan}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(s.startDate)}</td>
                    <td className="px-5 py-3 text-gray-400 text-xs whitespace-nowrap">{formatDate(s.endDate)}</td>
                    <td className="px-5 py-3 font-mono text-xs text-brand-400">{s.trips}</td>
                    <td className="px-5 py-3">
                      <Badge variant={s.status === 'ACTIVE' ? 'success' : 'default'}>
                        {s.status === 'ACTIVE' ? 'Đang dùng' : 'Hết hạn'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
