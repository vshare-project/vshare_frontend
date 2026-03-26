import { useState } from 'react'
import { Search, Plus, MapPin, Edit, Trash2 } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import type { Station } from '@/types/station.types'

const MOCK: Station[] = [
  { id: '1', name: 'Trạm Bến Thành',    address: '1 Công Trường Quách Thị Trang, Q.1', lat: 10.7729, lng: 106.6980, totalSlots: 20, availableVehicles: 12, district: 'Quận 1' },
  { id: '2', name: 'Trạm Landmark 81',  address: '208 Nguyễn Hữu Cảnh, Bình Thạnh',    lat: 10.7951, lng: 106.7220, totalSlots: 15, availableVehicles: 3,  district: 'Bình Thạnh' },
  { id: '3', name: 'Trạm Tân Sơn Nhất', address: 'Đường Trường Sơn, Tân Bình',         lat: 10.8198, lng: 106.6690, totalSlots: 25, availableVehicles: 0,  district: 'Tân Bình' },
  { id: '4', name: 'Trạm Vinhomes Q9',  address: '568 Nguyễn Xiển, TP. Thủ Đức',       lat: 10.8411, lng: 106.7854, totalSlots: 20, availableVehicles: 15, district: 'TP. Thủ Đức' },
  { id: '5', name: 'Trạm Crescent Mall', address: '101 Tôn Dật Tiên, Q.7',             lat: 10.7290, lng: 106.7180, totalSlots: 18, availableVehicles: 6,  district: 'Quận 7' },
]

export default function StationsPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.district.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold">Trạm xe</h1>
          <p className="text-sm text-gray-400 mt-1">Quản lý vị trí trạm</p>
        </div>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Thêm trạm</Button>
      </div>

      <div className="flex-1 max-w-sm">
        <Input placeholder="Tìm trạm, quận..." leftIcon={<Search className="w-4 h-4" />}
          value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map(station => {
          const pct = Math.round((station.availableVehicles / station.totalSlots) * 100)
          const variant = station.availableVehicles === 0 ? 'danger' : station.availableVehicles < 5 ? 'warning' : 'success'
          return (
            <Card key={station.id} className="hover:border-gray-100/80 transition-colors group">
              <CardContent>
                <div className="flex items-start justify-between mb-3">
                  <div className="w-9 h-9 rounded-xl bg-brand-500/10 border border-brand-500/20 flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-brand-400" />
                  </div>
                  <Badge variant={variant}>
                    {station.availableVehicles}/{station.totalSlots} xe
                  </Badge>
                </div>
                <h3 className="font-display font-semibold text-gray-800 mb-1">{station.name}</h3>
                <p className="text-xs text-gray-400 mb-3">{station.address}</p>

                <div className="space-y-1.5 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-400">Xe sẵn sàng</span>
                    <span className="font-mono text-brand-600">{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-gray-50 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${pct === 0 ? 'bg-red-500' : pct < 30 ? 'bg-yellow-500' : 'bg-brand-500'}`}
                      style={{ width: `${pct}%` }} />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-mono">{station.lat.toFixed(4)}, {station.lng.toFixed(4)}</span>
                  <div className="flex gap-1">
                    <button className="p-1.5 rounded-lg hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors"><Edit className="w-3.5 h-3.5" /></button>
                    <button className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-600 hover:text-red-400 transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
