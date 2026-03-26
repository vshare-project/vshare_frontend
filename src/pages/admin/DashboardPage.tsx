import { Bike, MapPin, Users, TrendingUp, ArrowUp, ArrowDown, Activity } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const stats = [
  { label: 'Tổng phương tiện',  value: '512',      change: '+12',  up: true,  icon: Bike,       color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100' },
  { label: 'Trạm xe hoạt động', value: '52',        change: '+3',   up: true,  icon: MapPin,     color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100' },
  { label: 'Người dùng',        value: '10,842',    change: '+245', up: true,  icon: Users,      color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100' },
  { label: 'Doanh thu tháng',   value: '₫128.5M',  change: '-2%',  up: false, icon: TrendingUp, color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
]

const recentRides = [
  { user: 'Nguyễn Văn A', vehicle: 'VS-001', from: 'Hoàn Kiếm', to: 'Tây Hồ',    duration: '2h', cost: '50,000₫', status: 'COMPLETED' },
  { user: 'Trần Thị B',   vehicle: 'VS-023', from: 'Cầu Giấy', to: 'Mỹ Đình',    duration: '1h', cost: '25,000₫', status: 'ACTIVE' },
  { user: 'Lê Văn C',     vehicle: 'VS-007', from: 'Thanh Xuân', to: 'Hoàn Kiếm', duration: '3h', cost: '75,000₫', status: 'COMPLETED' },
  { user: 'Phạm Thị D',   vehicle: 'VS-041', from: 'Hai Bà Trưng', to: 'Royal City', duration: '1h', cost: '20,000₫', status: 'ACTIVE' },
]

const vehicleStatus = [
  { label: 'Sẵn sàng',  count: 312, pct: 61, color: 'bg-green-500' },
  { label: 'Đang thuê', count: 148, pct: 29, color: 'bg-blue-500' },
  { label: 'Bảo trì',   count: 36,  pct: 7,  color: 'bg-yellow-500' },
  { label: 'Đang sạc',  count: 16,  pct: 3,  color: 'bg-purple-500' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-400 mt-1">Tổng quan hoạt động VShare · Hà Nội</p>
      </div>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.label}>
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-gray-400 font-medium">{s.label}</p>
                  <p className="text-2xl font-display font-bold mt-1 text-gray-900">{s.value}</p>
                  <div className={`flex items-center gap-1 mt-1 text-xs ${s.up ? 'text-green-600' : 'text-red-500'}`}>
                    {s.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {s.change} so với tháng trước
                  </div>
                </div>
                <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center`}>
                  <s.icon className={`w-5 h-5 ${s.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-4">
        {/* Recent rides */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent>
              <div className="flex items-center gap-2 mb-4">
                <Activity className="w-4 h-4 text-brand-600" />
                <h3 className="font-display font-semibold text-gray-900">Chuyến đi gần đây</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-400 border-b border-gray-100">
                      {['Người dùng','Xe','Lộ trình','Thời gian','Chi phí','Trạng thái'].map(h => (
                        <th key={h} className="text-left pb-2 pr-3 font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {recentRides.map((r, i) => (
                      <tr key={i} className="text-xs hover:bg-gray-50/50">
                        <td className="py-2.5 pr-3 font-medium text-gray-800">{r.user}</td>
                        <td className="py-2.5 pr-3 font-mono text-gray-500">{r.vehicle}</td>
                        <td className="py-2.5 pr-3 text-gray-500">{r.from} → {r.to}</td>
                        <td className="py-2.5 pr-3 text-gray-400">{r.duration}</td>
                        <td className="py-2.5 pr-3 font-mono text-brand-600 font-semibold">{r.cost}</td>
                        <td className="py-2.5">
                          <Badge variant={r.status === 'ACTIVE' ? 'success' : 'default'}>
                            {r.status === 'ACTIVE' ? 'Đang chạy' : 'Xong'}
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

        {/* Vehicle status */}
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <Bike className="w-4 h-4 text-brand-600" />
              <h3 className="font-display font-semibold text-gray-900">Trạng thái xe</h3>
            </div>
            <div className="space-y-3">
              {vehicleStatus.map(s => (
                <div key={s.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{s.label}</span>
                    <span className="font-mono text-gray-500">{s.count} ({s.pct}%)</span>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full ${s.color} rounded-full`} style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
              <div className="text-2xl font-display font-bold text-brand-600">512</div>
              <div className="text-xs text-gray-400">Tổng phương tiện</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
