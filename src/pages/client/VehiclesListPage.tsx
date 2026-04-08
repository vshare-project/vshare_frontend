import { useState, useEffect, useCallback, useRef } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  Search, Bike, Car, Battery, Zap, MapPin, SlidersHorizontal,
  ChevronLeft, ChevronRight, X, RefreshCw, WifiOff, Star,
  Gauge, Weight, Clock, Usb, ShieldCheck, Navigation2, Wind,
  CheckCircle2, ChevronDown, ChevronUp
} from 'lucide-react'
import { vehicleApi } from '@/api/vehicle.api'
import type { Vehicle, VehicleType, VehicleStatus, MotorbikeDetails, CarDetails } from '@/types/vehicle.types'
import { useAuthStore } from '@/store/auth.store'

// ─── Constants ───────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  available:      { label: 'Sẵn sàng',  color: 'text-green-700 bg-green-50 border-green-200',   dot: 'bg-green-500' },
  rented:         { label: 'Đang thuê', color: 'text-blue-700 bg-blue-50 border-blue-200',       dot: 'bg-blue-500' },
  charging:       { label: 'Đang sạc',  color: 'text-yellow-700 bg-yellow-50 border-yellow-200', dot: 'bg-yellow-500' },
  maintenance:    { label: 'Bảo trì',   color: 'text-red-700 bg-red-50 border-red-200',          dot: 'bg-red-500' },
  low_battery:    { label: 'Pin yếu',   color: 'text-orange-700 bg-orange-50 border-orange-200', dot: 'bg-orange-500' },
  out_of_service: { label: 'Ngừng HĐ', color: 'text-gray-600 bg-gray-100 border-gray-200',      dot: 'bg-gray-400' },
}

const MOTORBIKE_TYPE_LABEL: Record<string, string> = {
  scooter: 'Xe tay ga',
  manual:  'Xe số',
  sport:   'Xe thể thao',
}

const FILTER_STATUSES = [
  { value: 'available',   label: 'Sẵn sàng' },
  { value: 'low_battery', label: 'Pin yếu' },
  { value: 'charging',    label: 'Đang sạc' },
  { value: 'maintenance', label: 'Bảo trì' },
]

const MOTORBIKE_SUBTYPES = [
  { value: 'scooter', label: 'Xe tay ga' },
  { value: 'manual',  label: 'Xe số' },
  { value: 'sport',   label: 'Xe thể thao' },
]

// ─── Helpers ─────────────────────────────────────────────────────────────────

function BatteryBar({ level }: { level: number }) {
  const color = level >= 60 ? 'bg-green-500' : level >= 25 ? 'bg-yellow-400' : 'bg-red-500'
  const textColor = level >= 60 ? 'text-green-600' : level >= 25 ? 'text-yellow-600' : 'text-red-500'
  return (
    <div className="flex items-center gap-1.5">
      <div className="h-1.5 w-12 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${level}%` }} />
      </div>
      <span className={`text-xs font-semibold font-mono ${textColor}`}>{level}%</span>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || { label: status, color: 'text-gray-600 bg-gray-100 border-gray-200', dot: 'bg-gray-400' }
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  )
}

function FeatureIcon({ has, label }: { has: boolean; label: string }) {
  return (
    <span className={`inline-flex items-center gap-1 text-xs ${has ? 'text-green-600' : 'text-gray-300'}`}>
      <CheckCircle2 className="w-3.5 h-3.5" />
      {label}
    </span>
  )
}

// ─── Vehicle Card ─────────────────────────────────────────────────────────────

function VehicleCard({ vehicle, onRent }: { vehicle: Vehicle; onRent: (v: Vehicle) => void }) {
  const [expanded, setExpanded] = useState(false)
  const isAvailable = vehicle.status === 'available'
  const isMoto = vehicle.vehicleType === 'motorbike'
  const moto = vehicle.motorbikeDetails
  const car = vehicle.carDetails

  const mainImage = vehicle.issueImages?.[0]

  return (
    <div className={`bg-white rounded-2xl border transition-all duration-200 overflow-hidden group ${
      isAvailable
        ? 'border-gray-100 hover:border-green-200 hover:shadow-lg hover:shadow-green-500/5'
        : 'border-gray-100 opacity-75'
    }`}>
      {/* Image / Visual area */}
      <div className="relative h-40 bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {mainImage ? (
          <img src={mainImage} alt={`${vehicle.brand} ${vehicle.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            {isMoto
              ? <Bike className="w-16 h-16 text-gray-200" />
              : <Car className="w-16 h-16 text-gray-200" />
            }
          </div>
        )}

        {/* Type badge top-left */}
        <div className={`absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${
          isMoto
            ? 'bg-green-50/90 text-green-700 border-green-200'
            : 'bg-blue-50/90 text-blue-700 border-blue-200'
        }`}>
          {isMoto ? <Bike className="w-3 h-3" /> : <Car className="w-3 h-3" />}
          {isMoto
            ? (moto ? MOTORBIKE_TYPE_LABEL[moto.motorbikeType] || 'Xe máy' : 'Xe máy')
            : 'Ô tô điện'
          }
        </div>

        {/* Status top-right */}
        <div className="absolute top-3 right-3">
          <StatusBadge status={vehicle.status} />
        </div>

        {/* Year badge bottom-left */}
        <div className="absolute bottom-3 left-3 px-2 py-0.5 bg-black/40 backdrop-blur-sm rounded-md text-xs text-white font-mono">
          {vehicle.year}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-display font-bold text-gray-900 text-sm leading-tight">
              {vehicle.brand} {vehicle.model}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-mono text-xs text-gray-400">{vehicle.vehicleCode}</span>
              <span className="text-gray-200">·</span>
              <span className="text-xs text-gray-400">{vehicle.color}</span>
            </div>
          </div>
        </div>

        {/* Key stats row */}
        <div className="grid grid-cols-3 gap-2 mb-3">
          {/* Battery */}
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <Battery className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
            <BatteryBar level={vehicle.batteryLevel} />
          </div>

          {/* Range */}
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <Navigation2 className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs font-semibold text-gray-700">
              {vehicle.rangeKm ? `${parseFloat(vehicle.rangeKm)}km` : '—'}
            </span>
          </div>

          {/* Speed */}
          <div className="bg-gray-50 rounded-xl p-2 text-center">
            <Gauge className="w-3.5 h-3.5 text-gray-400 mx-auto mb-1" />
            <span className="text-xs font-semibold text-gray-700">
              {isMoto && moto
                ? `${parseFloat(moto.maxSpeedKmh)}km/h`
                : car ? `${parseFloat(car.maxSpeedKmh)}km/h` : '—'
              }
            </span>
          </div>
        </div>

        {/* Station */}
        <div className="flex items-center gap-1.5 mb-3 text-xs text-gray-400">
          <MapPin className="w-3.5 h-3.5 shrink-0" />
          <span className="truncate">
            {vehicle.station?.stationName || 'Chưa gán trạm'}
          </span>
        </div>

        {/* Expandable details */}
        {(moto || car) && (
          <>
            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 text-xs text-green-600 hover:text-green-700 font-medium mb-2 transition-colors"
            >
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? 'Ẩn thông số' : 'Xem thêm thông số'}
            </button>

            {expanded && (
              <div className="bg-gray-50 rounded-xl p-3 mb-3 space-y-3">
                {/* Motorbike details */}
                {isMoto && moto && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Zap className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{(moto.motorPowerW / 1000).toFixed(1)}kW</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Battery className="w-3.5 h-3.5 text-blue-500" />
                        <span>{moto.batteryCapacityKwh}kWh</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        <span>Sạc {moto.chargingTimeHour}h</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Weight className="w-3.5 h-3.5 text-gray-400" />
                        <span>Tải {moto.maxLoadKg}kg</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <FeatureIcon has={moto.hasHelmetStorage} label="Cốp mũ" />
                      <FeatureIcon has={moto.hasUSBCharger}    label="Cổng USB" />
                      <FeatureIcon has={moto.hasAntiLockBrakes} label="ABS" />
                      <FeatureIcon has={moto.hasGPS}           label="GPS" />
                    </div>
                    {moto.features?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {moto.features.map((f, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-green-50 text-green-700 rounded-md border border-green-100">{f}</span>
                        ))}
                      </div>
                    )}
                  </>
                )}

                {/* Car details */}
                {!isMoto && car && (
                  <>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Zap className="w-3.5 h-3.5 text-yellow-500" />
                        <span>{car.motorPowerKw}kW</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Battery className="w-3.5 h-3.5 text-blue-500" />
                        <span>{car.batteryCapacityKwh}kWh</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Clock className="w-3.5 h-3.5 text-purple-500" />
                        <span>Sạc {car.chargingTimeHour}h</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-gray-600">
                        <Star className="w-3.5 h-3.5 text-gray-400" />
                        <span>{car.seats} chỗ ngồi</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-1.5">
                      <FeatureIcon has={car.hasAC}        label="Điều hoà" />
                      <FeatureIcon has={car.hasGPS}       label="GPS" />
                      <FeatureIcon has={car.hasBluetooth} label="Bluetooth" />
                    </div>
                    {car.features?.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {car.features.map((f, i) => (
                          <span key={i} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-md border border-blue-100">{f}</span>
                        ))}
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </>
        )}

        {/* CTA */}
        {isAvailable ? (
          <button
            onClick={() => onRent(vehicle)}
            className="w-full py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Zap className="w-4 h-4" fill="currentColor" />
            Thuê ngay
          </button>
        ) : (
          <div className="w-full py-2.5 bg-gray-100 text-gray-400 text-sm font-medium rounded-xl text-center">
            Không khả dụng
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, total, limit, onPageChange }: {
  page: number; totalPages: number; total: number; limit: number; onPageChange: (p: number) => void
}) {
  const from = Math.min((page - 1) * limit + 1, total)
  const to = Math.min(page * limit, total)

  const pageNums: number[] = []
  const delta = 2
  for (let i = Math.max(1, page - delta); i <= Math.min(totalPages, page + delta); i++) {
    pageNums.push(i)
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
      <p className="text-sm text-gray-400">
        Hiển thị <span className="font-medium text-gray-700">{from}–{to}</span> trong{' '}
        <span className="font-medium text-gray-700">{total}</span> xe
      </p>

      <div className="flex items-center gap-1">
        <button onClick={() => onPageChange(1)} disabled={page <= 1}
          className="px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors">«</button>
        <button onClick={() => onPageChange(page - 1)} disabled={page <= 1}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500 transition-colors">
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pageNums[0] > 1 && (
          <>
            <button onClick={() => onPageChange(1)}
              className="w-8 h-8 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors">1</button>
            {pageNums[0] > 2 && <span className="text-gray-300 px-1">…</span>}
          </>
        )}

        {pageNums.map(p => (
          <button key={p} onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-xs font-medium transition-colors ${
              p === page ? 'bg-green-600 text-white' : 'text-gray-600 hover:bg-gray-100'
            }`}>{p}</button>
        ))}

        {pageNums[pageNums.length - 1] < totalPages && (
          <>
            {pageNums[pageNums.length - 1] < totalPages - 1 && <span className="text-gray-300 px-1">…</span>}
            <button onClick={() => onPageChange(totalPages)}
              className="w-8 h-8 rounded-lg text-xs text-gray-500 hover:bg-gray-100 transition-colors">{totalPages}</button>
          </>
        )}

        <button onClick={() => onPageChange(page + 1)} disabled={page >= totalPages}
          className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 text-gray-500 transition-colors">
          <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={() => onPageChange(totalPages)} disabled={page >= totalPages}
          className="px-2 py-1.5 rounded-lg text-xs text-gray-400 hover:bg-gray-100 disabled:opacity-30 transition-colors">»</button>
      </div>
    </div>
  )
}

// ─── Rent Confirm Modal ───────────────────────────────────────────────────────

function RentModal({ vehicle, onConfirm, onClose }: {
  vehicle: Vehicle; onConfirm: () => void; onClose: () => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-[slideUp_0.2s_ease]">
        {/* Vehicle image */}
        <div className="h-40 bg-gradient-to-br from-green-50 to-green-100 relative overflow-hidden">
          {vehicle.issueImages?.[0] ? (
            <img src={vehicle.issueImages[0]} alt="" className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {vehicle.vehicleType === 'motorbike'
                ? <Bike className="w-20 h-20 text-green-200" />
                : <Car className="w-20 h-20 text-green-200" />
              }
            </div>
          )}
          <button onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center text-gray-600 hover:bg-white transition-colors">
            <X className="w-4 h-4" />
          </button>
          <div className="absolute bottom-3 left-4">
            <StatusBadge status={vehicle.status} />
          </div>
        </div>

        <div className="p-5">
          <h3 className="font-display font-bold text-xl text-gray-900">
            {vehicle.brand} {vehicle.model}
          </h3>
          <p className="text-sm text-gray-400 mt-0.5">{vehicle.vehicleCode} · {vehicle.color} · {vehicle.year}</p>

          {/* Quick info */}
          <div className="grid grid-cols-3 gap-3 my-4">
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Battery className="w-4 h-4 text-gray-400 mx-auto mb-1.5" />
              <p className="text-sm font-bold text-gray-800">{vehicle.batteryLevel}%</p>
              <p className="text-xs text-gray-400">Pin</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <Navigation2 className="w-4 h-4 text-gray-400 mx-auto mb-1.5" />
              <p className="text-sm font-bold text-gray-800">
                {vehicle.rangeKm ? `${parseFloat(vehicle.rangeKm)}km` : '—'}
              </p>
              <p className="text-xs text-gray-400">Tầm hoạt động</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-3 text-center">
              <MapPin className="w-4 h-4 text-gray-400 mx-auto mb-1.5" />
              <p className="text-xs font-bold text-gray-800 leading-tight">
                {vehicle.station?.stationName || 'Chưa gán trạm'}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Trạm xe</p>
            </div>
          </div>

          {vehicle.station?.address && (
            <div className="flex items-start gap-2 p-3 bg-green-50 rounded-xl mb-4 text-xs text-green-700">
              <MapPin className="w-3.5 h-3.5 mt-0.5 shrink-0" />
              {vehicle.station.address}
            </div>
          )}

          <div className="flex gap-3">
            <button onClick={onClose}
              className="flex-1 py-3 border border-gray-200 text-gray-600 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors">
              Huỷ
            </button>
            <button onClick={onConfirm}
              className="flex-2 flex-grow-[2] py-3 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" fill="currentColor" />
              Xác nhận thuê xe này
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VehiclesListPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const { isAuthenticated } = useAuthStore()

  // ── State ──
  const [activeTab, setActiveTab] = useState<VehicleType | 'all'>(
    (searchParams.get('type') as VehicleType) || 'all'
  )
  const [searchInput, setSearchInput] = useState(searchParams.get('q') || '')
  const [appliedSearch, setAppliedSearch] = useState(searchParams.get('q') || '')
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '')
  const [motorbikeSubtype, setMotorbikeSubtype] = useState('')
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1)
  const LIMIT = 12

  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [meta, setMeta] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [rentTarget, setRentTarget] = useState<Vehicle | null>(null)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)

  const searchRef = useRef<HTMLInputElement>(null)

  // ── Fetch ──
  const fetchVehicles = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Build keyword: combine type + status + text search
      // Backend hỗ trợ Like search trên vehicleCode, vehicleType, vehicleStatus
      const keywordParts: string[] = []

      if (activeTab !== 'all') keywordParts.push(activeTab)
      if (statusFilter)        keywordParts.push(statusFilter)
      if (appliedSearch)       keywordParts.push(appliedSearch)

      // Gọi API — nếu có nhiều keyword thì dùng cái ưu tiên nhất
      // (backend Like nên match partial)
      const keyword = keywordParts.length > 0 ? keywordParts[0] : undefined

      const res = await vehicleApi.getAll({ page, limit: LIMIT, keyword })
      let data = res.data.data

      // Client-side filter cho các trường hợp keyword không cover được
      if (activeTab !== 'all') {
        data = data.filter(v => v.vehicleType === activeTab)
      }
      if (statusFilter) {
        data = data.filter(v => v.status === statusFilter)
      }
      if (appliedSearch) {
        const q = appliedSearch.toLowerCase()
        data = data.filter(v =>
          v.vehicleCode.toLowerCase().includes(q) ||
          v.brand.toLowerCase().includes(q) ||
          v.model.toLowerCase().includes(q) ||
          v.color.toLowerCase().includes(q)
        )
      }
      if (motorbikeSubtype) {
        data = data.filter(v => v.motorbikeDetails?.motorbikeType === motorbikeSubtype)
      }

      setVehicles(data)
      setMeta(res.data.meta)
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } }
      setError(e?.response?.data?.message || 'Không thể kết nối đến server')
    } finally {
      setLoading(false)
    }
  }, [page, activeTab, statusFilter, appliedSearch, motorbikeSubtype])

  useEffect(() => { fetchVehicles() }, [fetchVehicles])

  // Reset page khi đổi filter
  useEffect(() => { setPage(1) }, [activeTab, statusFilter, appliedSearch, motorbikeSubtype])

  // Sync URL params
  useEffect(() => {
    const p: Record<string, string> = {}
    if (activeTab !== 'all') p.type = activeTab
    if (appliedSearch) p.q = appliedSearch
    if (statusFilter) p.status = statusFilter
    if (page > 1) p.page = String(page)
    setSearchParams(p, { replace: true })
  }, [activeTab, appliedSearch, statusFilter, page])

  // ── Handlers ──
  const handleSearchSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    setAppliedSearch(searchInput)
  }

  const clearSearch = () => {
    setSearchInput('')
    setAppliedSearch('')
    searchRef.current?.focus()
  }

  const clearAllFilters = () => {
    setActiveTab('all')
    setSearchInput('')
    setAppliedSearch('')
    setStatusFilter('')
    setMotorbikeSubtype('')
    setPage(1)
  }

  const handleRent = (vehicle: Vehicle) => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/rent/${vehicle.id}` } })
      return
    }
    setRentTarget(vehicle)
  }

  const confirmRent = () => {
    if (rentTarget) {
      navigate(`/rent/${rentTarget.id}`)
    }
  }

  // ── Derived ──
  const hasActiveFilters = activeTab !== 'all' || appliedSearch || statusFilter || motorbikeSubtype
  const availableCount = vehicles.filter(v => v.status === 'available').length

  // Tabs
  const tabs = [
    { key: 'all' as const,       icon: <Zap className="w-4 h-4" />,  label: 'Tất cả xe' },
    { key: 'motorbike' as const, icon: <Bike className="w-4 h-4" />, label: 'Xe máy điện' },
    { key: 'car' as const,       icon: <Car className="w-4 h-4" />,  label: 'Ô tô điện' },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ── Page Header ── */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-display font-bold text-gray-900">Danh sách xe</h1>
              <p className="text-sm text-gray-400 mt-1">
                {loading
                  ? 'Đang tải...'
                  : `${meta.total} xe trong hệ thống · ${availableCount} sẵn sàng`
                }
              </p>
            </div>

            {/* View map link */}
            <Link to="/map"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-green-200 bg-green-50 text-green-700 text-sm font-medium hover:bg-green-100 transition-colors self-start sm:self-auto">
              <MapPin className="w-4 h-4" />
              Xem bản đồ trạm
            </Link>
          </div>

          {/* ── Type Tabs ── */}
          <div className="flex gap-1 mt-5 border-b border-gray-100 -mb-6 pb-0">
            {tabs.map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-all -mb-px ${
                  activeTab === tab.key
                    ? 'border-green-600 text-green-700'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-200'
                }`}>
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* ── Search + Filter Bar ── */}
        <div className="flex flex-wrap gap-3 mb-5">
          {/* Search */}
          <form onSubmit={handleSearchSubmit} className="flex gap-2 flex-1 min-w-0 max-w-lg">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={searchRef}
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                placeholder="Tìm hãng xe, model, màu sắc, mã xe..."
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-colors"
              />
              {searchInput && (
                <button type="button" onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button type="submit"
              className="px-5 py-2.5 bg-green-600 hover:bg-green-700 text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap">
              Tìm kiếm
            </button>
          </form>

          {/* Filter toggle */}
          <button
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${
              filterPanelOpen || statusFilter || motorbikeSubtype
                ? 'border-green-400 bg-green-50 text-green-700'
                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
            }`}>
            <SlidersHorizontal className="w-4 h-4" />
            Lọc
            {(statusFilter || motorbikeSubtype) && (
              <span className="w-5 h-5 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">
                {[statusFilter, motorbikeSubtype].filter(Boolean).length}
              </span>
            )}
          </button>

          {/* Refresh */}
          <button onClick={fetchVehicles} disabled={loading}
            className="p-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* ── Expanded Filter Panel ── */}
        {filterPanelOpen && (
          <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-5 shadow-sm">
            <div className="flex flex-wrap gap-6">
              {/* Status filter */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Trạng thái</p>
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => setStatusFilter('')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      !statusFilter ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                    }`}>Tất cả</button>
                  {FILTER_STATUSES.map(f => (
                    <button key={f.value} onClick={() => setStatusFilter(f.value === statusFilter ? '' : f.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        statusFilter === f.value ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>{f.label}</button>
                  ))}
                </div>
              </div>

              {/* Motorbike subtype filter (chỉ hiện khi tab xe máy) */}
              {(activeTab === 'motorbike' || activeTab === 'all') && (
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Loại xe máy</p>
                  <div className="flex flex-wrap gap-2">
                    <button onClick={() => setMotorbikeSubtype('')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        !motorbikeSubtype ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                      }`}>Tất cả</button>
                    {MOTORBIKE_SUBTYPES.map(s => (
                      <button key={s.value} onClick={() => setMotorbikeSubtype(s.value === motorbikeSubtype ? '' : s.value)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                          motorbikeSubtype === s.value ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                        }`}>{s.label}</button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Active filter chips ── */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-xs text-gray-400">Đang lọc:</span>
            {activeTab !== 'all' && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-green-50 border border-green-200 rounded-full text-xs text-green-700 font-medium">
                {activeTab === 'motorbike' ? <Bike className="w-3 h-3" /> : <Car className="w-3 h-3" />}
                {activeTab === 'motorbike' ? 'Xe máy' : 'Ô tô'}
                <button onClick={() => setActiveTab('all')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {appliedSearch && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-200 rounded-full text-xs text-blue-700 font-medium">
                "{appliedSearch}"
                <button onClick={clearSearch}><X className="w-3 h-3" /></button>
              </span>
            )}
            {statusFilter && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600 font-medium">
                {STATUS_CONFIG[statusFilter]?.label}
                <button onClick={() => setStatusFilter('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            {motorbikeSubtype && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-100 border border-gray-200 rounded-full text-xs text-gray-600 font-medium">
                {MOTORBIKE_SUBTYPES.find(s => s.value === motorbikeSubtype)?.label}
                <button onClick={() => setMotorbikeSubtype('')}><X className="w-3 h-3" /></button>
              </span>
            )}
            <button onClick={clearAllFilters}
              className="text-xs text-red-500 hover:text-red-700 underline ml-1">Xóa tất cả</button>
          </div>
        )}

        {/* ── Error ── */}
        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm mb-5">
            <WifiOff className="w-4 h-4 shrink-0" />
            <span>{error}</span>
            <button onClick={fetchVehicles} className="ml-auto text-xs underline">Thử lại</button>
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden animate-pulse">
                <div className="h-40 bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="grid grid-cols-3 gap-2">
                    {[1,2,3].map(j => <div key={j} className="h-14 bg-gray-100 rounded-xl" />)}
                  </div>
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-4">
              {activeTab === 'car' ? <Car className="w-10 h-10 text-gray-300" /> : <Bike className="w-10 h-10 text-gray-300" />}
            </div>
            <h3 className="font-display font-bold text-gray-700 mb-2">Không tìm thấy xe</h3>
            <p className="text-sm text-gray-400 mb-5 max-w-xs">
              {hasActiveFilters ? 'Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm' : 'Hiện chưa có xe nào trong hệ thống'}
            </p>
            {hasActiveFilters && (
              <button onClick={clearAllFilters}
                className="px-5 py-2.5 bg-green-600 text-white text-sm font-semibold rounded-xl hover:bg-green-700 transition-colors">
                Xóa bộ lọc
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {vehicles.map(v => (
                <VehicleCard key={v.id} vehicle={v} onRent={handleRent} />
              ))}
            </div>

            {meta.totalPages > 1 && (
              <Pagination
                page={meta.page} totalPages={meta.totalPages}
                total={meta.total} limit={meta.limit}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {/* ── Rent Modal ── */}
      {rentTarget && (
        <RentModal
          vehicle={rentTarget}
          onConfirm={confirmRent}
          onClose={() => setRentTarget(null)}
        />
      )}
    </div>
  )
}
