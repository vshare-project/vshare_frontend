import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, Battery, Edit, Trash2, Bike, Car, ChevronLeft, ChevronRight, RefreshCw, Wifi, WifiOff, AlertTriangle, X, Check } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { vehicleApi } from '@/api/vehicle.api'
import type { Vehicle, VehicleType, VehicleStatus } from '@/types/vehicle.types'
import { toast } from 'sonner'

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_MAP: Record<VehicleStatus, { label: string; variant: 'success' | 'info' | 'warning' | 'danger' | 'default' }> = {
  available: { label: 'Sẵn sàng', variant: 'success' },
  rented: { label: 'Đang thuê', variant: 'info' },
  charging: { label: 'Đang sạc', variant: 'warning' },
  maintenance: { label: 'Bảo trì', variant: 'danger' },
  low_battery: { label: 'Pin yếu', variant: 'warning' },
  out_of_service: { label: 'Ngừng HĐ', variant: 'danger' },
}

const STATUS_FILTERS: { value: string; label: string }[] = [
  { value: '', label: 'Tất cả' },
  { value: 'available', label: 'Sẵn sàng' },
  { value: 'rented', label: 'Đang thuê' },
  { value: 'charging', label: 'Đang sạc' },
  { value: 'maintenance', label: 'Bảo trì' },
  { value: 'low_battery', label: 'Pin yếu' },
  { value: 'out_of_service', label: 'Ngừng HĐ' },
]

// ─── Sub-components ───────────────────────────────────────────────────────────

function BatteryBar({ level }: { level: number }) {
  const color = level >= 60 ? 'bg-green-500' : level >= 25 ? 'bg-yellow-400' : 'bg-red-500'
  const textColor = level >= 60 ? 'text-green-600' : level >= 25 ? 'text-yellow-600' : 'text-red-600'
  return (
    <div className="flex items-center gap-2 min-w-[80px]">
      <div className="h-1.5 w-14 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${level}%` }} />
      </div>
      <span className={`text-xs font-mono font-semibold ${textColor}`}>{level}%</span>
    </div>
  )
}

function VehicleTypeIcon({ type }: { type: VehicleType }) {
  return type === 'car'
    ? <Car className="w-3.5 h-3.5" />
    : <Bike className="w-3.5 h-3.5" />
}

function Pagination({
  page, totalPages, total, limit, onPageChange
}: { page: number; totalPages: number; total: number; limit: number; onPageChange: (p: number) => void }) {
  const from = (page - 1) * limit + 1
  const to = Math.min(page * limit, total)

  return (
    <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
      <span className="text-xs text-gray-400">
        Hiển thị <span className="font-medium text-gray-600">{from}–{to}</span> / {total} xe
      </span>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          let p: number
          if (totalPages <= 5) p = i + 1
          else if (page <= 3) p = i + 1
          else if (page >= totalPages - 2) p = totalPages - 4 + i
          else p = page - 2 + i
          return (
            <button key={p} onClick={() => onPageChange(p)}
              className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${p === page ? 'bg-brand-600 text-white' : 'hover:bg-gray-100 text-gray-500'
                }`}>
              {p}
            </button>
          )
        })}

        <button
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed text-gray-500 transition-colors"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      {Array.from({ length: 8 }).map((_, i) => (
        <td key={i} className="px-5 py-3">
          <div className="h-3 bg-gray-100 rounded w-3/4" />
        </td>
      ))}
    </tr>
  )
}

function DeleteConfirmModal({ vehicle, onConfirm, onCancel, loading }: {
  vehicle: Vehicle; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-display font-bold text-gray-900">Xóa xe</h3>
            <p className="text-xs text-gray-400">Hành động này không thể hoàn tác</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Bạn chắc chắn muốn xóa xe <span className="font-semibold text-gray-900">{vehicle.vehicleCode}</span> ({vehicle.brand} {vehicle.model})?
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}>
            <X className="w-4 h-4" /> Hủy
          </Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} loading={loading}>
            <Trash2 className="w-4 h-4" /> Xóa xe
          </Button>
        </div>
      </div>
    </div>
  )
}

// ─── Vehicle Table ────────────────────────────────────────────────────────────

function VehicleTable({
  vehicles, loading, onEdit, onDelete
}: { vehicles: Vehicle[]; loading: boolean; onEdit: (v: Vehicle) => void; onDelete: (v: Vehicle) => void }) {
  const headers = ['Mã xe', 'Loại xe', 'Hãng / Model', 'Biển số', 'Trạm', 'Pin', 'Tầm hoạt động', 'Trạng thái', 'Hành động']

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm min-w-[900px]">
        <thead>
          <tr className="border-b border-gray-100 text-xs text-gray-400">
            {headers.map(h => (
              <th key={h} className="text-left px-5 py-3 font-medium whitespace-nowrap">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)
            : vehicles.length === 0
              ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-gray-400 text-sm">
                    <div className="flex flex-col items-center gap-2">
                      <WifiOff className="w-8 h-8 text-gray-200" />
                      Không có dữ liệu
                    </div>
                  </td>
                </tr>
              )
              : vehicles.map(v => {
                const s = STATUS_MAP[v.status as VehicleStatus] || { label: v.status, variant: 'default' as const }
                const details = v.vehicleType === 'motorbike' ? v.motorbikeDetails : v.carDetails
                const range = v.rangeKm ? `${parseFloat(v.rangeKm)}km` : '—'

                return (
                  <tr key={v.id} className="hover:bg-gray-50/70 transition-colors group">
                    {/* Mã xe */}
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs font-semibold text-gray-700 bg-gray-100 px-2 py-0.5 rounded-md">
                        {v.vehicleCode}
                      </span>
                    </td>

                    {/* Loại xe */}
                    <td className="px-5 py-3">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs font-medium border ${v.vehicleType === 'car'
                          ? 'bg-blue-50 text-blue-700 border-blue-100'
                          : 'bg-green-50 text-green-700 border-green-100'
                        }`}>
                        <VehicleTypeIcon type={v.vehicleType} />
                        {v.vehicleType === 'car' ? 'Ô tô' : 'Xe máy'}
                      </div>
                    </td>

                    {/* Hãng / Model */}
                    <td className="px-5 py-3">
                      <div>
                        <p className="font-semibold text-gray-800 text-xs">{v.brand}</p>
                        <p className="text-gray-400 text-xs">{v.model} · {v.year} · {v.color}</p>
                      </div>
                    </td>

                    {/* Biển số */}
                    <td className="px-5 py-3">
                      <span className="font-mono text-xs text-gray-600">{v.licensePlate}</span>
                    </td>

                    {/* Trạm */}
                    <td className="px-5 py-3">
                      {v.station
                        ? <span className="text-xs text-gray-600 max-w-[120px] block truncate" title={v.station.stationName}>{v.station.stationName}</span>
                        : <span className="text-xs text-gray-300 italic">Chưa gán</span>
                      }
                    </td>

                    {/* Pin */}
                    <td className="px-5 py-3">
                      <BatteryBar level={v.batteryLevel} />
                    </td>

                    {/* Tầm hoạt động */}
                    <td className="px-5 py-3">
                      <span className="text-xs text-gray-500 font-mono">{range}</span>
                    </td>

                    {/* Trạng thái */}
                    <td className="px-5 py-3">
                      <Badge variant={s.variant}>{s.label}</Badge>
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => onEdit(v)}
                          className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors" title="Chỉnh sửa">
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDelete(v)}
                          className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors" title="Xóa">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })
          }
        </tbody>
      </table>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VehiclesPage() {
  const [activeTab, setActiveTab] = useState<VehicleType | 'all'>('all')
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [page, setPage] = useState(1)
  const LIMIT = 10

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [meta, setMeta] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Vehicle | null>(null)
  const [deleting, setDeleting] = useState(false)

  // Phân tách xe theo loại để hiển thị số lượng trên tab
  const carCount = vehicles.filter(v => v.vehicleType === 'car').length
  const motorbikeCount = vehicles.filter(v => v.vehicleType === 'motorbike').length

  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const keyword = [
        search,
        filterStatus,
        activeTab !== 'all' ? activeTab : ''
      ].filter(Boolean).join(' ') || undefined

      const res = await vehicleApi.getAll({ page, limit: LIMIT, keyword })
      setVehicles(res.data.data)
      setMeta(res.data.meta)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e.response?.data?.message || 'Không thể kết nối đến server')
    } finally {
      setLoading(false)
    }
  }, [page, search, filterStatus, activeTab])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  // Reset page khi đổi filter
  useEffect(() => { setPage(1) }, [search, filterStatus, activeTab])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSearch(searchInput)
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await vehicleApi.delete(deleteTarget.id)
      toast.success(`Đã xóa xe ${deleteTarget.vehicleCode}`)
      setDeleteTarget(null)
      fetchVehicles()
    } catch {
      toast.error('Xóa xe thất bại')
    } finally {
      setDeleting(false)
    }
  }

  // Lọc client-side theo tab loại xe (vì API tìm bằng keyword chung)
  const displayedVehicles = activeTab === 'all'
    ? vehicles
    : vehicles.filter(v => v.vehicleType === activeTab)

  const tabs: { key: VehicleType | 'all'; label: string; icon: React.ReactNode; count?: number }[] = [
    { key: 'all', label: 'Tất cả', icon: <Wifi className="w-3.5 h-3.5" /> },
    { key: 'motorbike', label: 'Xe máy', icon: <Bike className="w-3.5 h-3.5" />, count: motorbikeCount },
    { key: 'car', label: 'Ô tô', icon: <Car className="w-3.5 h-3.5" />, count: carCount },
  ]

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Phương tiện</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Quản lý toàn bộ xe điện · {meta.total} xe trong hệ thống
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchVehicles} disabled={loading}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-40">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Button className="gap-2">
            <Plus className="w-4 h-4" /> Thêm xe
          </Button>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
          <button onClick={fetchVehicles} className="ml-auto text-xs underline hover:no-underline">Thử lại</button>
        </div>
      )}

      {/* Tabs loại xe */}
      <div className="flex gap-2 border-b border-gray-100 pb-0">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${activeTab === tab.key
                ? 'border-brand-600 text-brand-700'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
              }`}>
            {tab.icon}
            {tab.label}
            {tab.count !== undefined && tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-mono ${activeTab === tab.key ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
                }`}>{tab.count}</span>
            )}
          </button>
        ))}
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap gap-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-64">
          <div className="flex-1">
            <Input
              placeholder="Tìm mã xe, loại xe, trạng thái..."
              leftIcon={<Search className="w-4 h-4" />}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
          </div>
          <button type="submit"
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-sm font-medium hover:bg-brand-700 transition-colors">
            Tìm
          </button>
          {search && (
            <button type="button" onClick={() => { setSearch(''); setSearchInput('') }}
              className="px-3 py-2 border border-gray-200 rounded-xl text-sm text-gray-500 hover:bg-gray-50 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </form>

        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map(f => (
            <button key={f.value} onClick={() => setFilterStatus(f.value)}
              className={`px-3 py-2 rounded-xl text-xs font-medium border transition-colors ${filterStatus === f.value
                  ? 'border-brand-400 bg-brand-50 text-brand-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50'
                }`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <VehicleTable
            vehicles={displayedVehicles}
            loading={loading}
            onEdit={(v) => toast.info(`Sắp ra: Edit ${v.vehicleCode}`)}
            onDelete={(v) => setDeleteTarget(v)}
          />
          {!loading && meta.totalPages > 1 && (
            <Pagination
              page={meta.page}
              totalPages={meta.totalPages}
              total={meta.total}
              limit={meta.limit}
              onPageChange={setPage}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Modal */}
      {deleteTarget && (
        <DeleteConfirmModal
          vehicle={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  )
}
