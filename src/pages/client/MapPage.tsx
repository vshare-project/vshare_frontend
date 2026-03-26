import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { divIcon } from 'leaflet'
import { renderToStaticMarkup } from 'react-dom/server'
import { Search, MapPin, Battery, ChevronRight, Bike, Car, RefreshCw, WifiOff, Zap } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { vehicleApi } from '@/api/vehicle.api'
import type { Vehicle, VehicleType } from '@/types/vehicle.types'

// Hà Nội mock stations (sẽ thay bằng station API sau)
const MOCK_STATIONS = [
  { id: '1', name: 'Trạm Hoàn Kiếm', address: '1 Đinh Tiên Hoàng, Hoàn Kiếm', lat: 21.0285, lng: 105.8542, district: 'Hoàn Kiếm' },
  { id: '2', name: 'Trạm Hồ Tây', address: '16 Thanh Niên, Tây Hồ', lat: 21.0507, lng: 105.8384, district: 'Tây Hồ' },
  { id: '3', name: 'Trạm Cầu Giấy', address: '144 Xuân Thủy, Cầu Giấy', lat: 21.0358, lng: 105.7972, district: 'Cầu Giấy' },
  { id: '4', name: 'Trạm Hai Bà Trưng', address: '191 Bà Triệu, Hai Bà Trưng', lat: 21.0162, lng: 105.8456, district: 'Hai Bà Trưng' },
  { id: '5', name: 'Trạm Thanh Xuân', address: '72A Nguyễn Trãi, Thanh Xuân', lat: 20.9984, lng: 105.8214, district: 'Thanh Xuân' },
  { id: '6', name: 'Trạm Mỹ Đình', address: '20 Phạm Hùng, Nam Từ Liêm', lat: 21.0227, lng: 105.7831, district: 'Nam Từ Liêm' },
]

const STATUS_LABEL: Record<string, { label: string; variant: 'success' | 'warning' | 'danger' | 'info' | 'default' }> = {
  available: { label: 'Sẵn sàng', variant: 'success' },
  rented: { label: 'Đang thuê', variant: 'info' },
  charging: { label: 'Sạc', variant: 'warning' },
  maintenance: { label: 'Bảo trì', variant: 'danger' },
  low_battery: { label: 'Pin yếu', variant: 'warning' },
  out_of_service: { label: 'Ngừng HĐ', variant: 'danger' },
}

function StationPin({ count, hasAvailable }: { count: number; hasAvailable: boolean }) {
  return (
    <div style={{
      width: 38, height: 38,
      background: hasAvailable ? '#16a34a' : '#9ca3af',
      borderRadius: '50%',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      border: '2.5px solid white',
      boxShadow: hasAvailable ? '0 2px 12px rgba(22,163,74,0.35)' : '0 2px 8px rgba(0,0,0,0.15)',
      color: 'white', fontWeight: 700, fontSize: 13
    }}>
      {count}
    </div>
  )
}

function VehicleCard({ v, type }: { v: Vehicle; type: VehicleType }) {
  const s = STATUS_LABEL[v.status] || { label: v.status, variant: 'default' as const }
  const isAvailable = v.status === 'available'
  const details = type === 'motorbike' ? v.motorbikeDetails : v.carDetails
  const maxSpeed = details
    ? 'maxSpeedKmh' in details ? details.maxSpeedKmh : null
    : null

  return (
    <div className={`p-3 rounded-xl border transition-all ${isAvailable ? 'bg-white border-gray-100 hover:border-brand-200 hover:shadow-sm' : 'bg-gray-50 border-gray-100 opacity-70'
      }`}>
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="flex items-center gap-1.5 mb-0.5">
            {type === 'car'
              ? <Car className="w-3.5 h-3.5 text-blue-500" />
              : <Bike className="w-3.5 h-3.5 text-green-600" />}
            <span className="font-semibold text-xs text-gray-800">{v.brand} {v.model}</span>
          </div>
          <span className="font-mono text-xs text-gray-400">{v.vehicleCode}</span>
        </div>
        <Badge variant={s.variant}>{s.label}</Badge>
      </div>

      <div className="flex items-center gap-3 mb-2.5">
        {/* Battery */}
        <div className="flex items-center gap-1">
          <div className="h-1.5 w-10 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full ${v.batteryLevel >= 60 ? 'bg-green-500' : v.batteryLevel >= 25 ? 'bg-yellow-400' : 'bg-red-500'
              }`} style={{ width: `${v.batteryLevel}%` }} />
          </div>
          <span className="text-xs text-gray-500 font-mono">{v.batteryLevel}%</span>
        </div>
        {/* Range */}
        {v.rangeKm && (
          <span className="text-xs text-gray-400">~{parseFloat(v.rangeKm)}km</span>
        )}
        {/* Speed */}
        {maxSpeed && (
          <span className="text-xs text-gray-400 flex items-center gap-0.5">
            <Zap className="w-3 h-3" />{parseFloat(maxSpeed)}km/h
          </span>
        )}
      </div>

      {isAvailable ? (
        <Link to={`/rent/${v.id}`}>
          <Button size="sm" className="w-full h-7 text-xs">
            Thuê ngay <ChevronRight className="w-3 h-3" />
          </Button>
        </Link>
      ) : (
        <div className="h-7 flex items-center justify-center rounded-lg bg-gray-100 text-xs text-gray-400">
          Không khả dụng
        </div>
      )}
    </div>
  )
}

export default function MapPage() {
  const [selectedStationId, setSelectedStationId] = useState<string | null>(null)
  const [stationSearch, setStationSearch] = useState('')
  const [vehicleTab, setVehicleTab] = useState<VehicleType | 'all'>('all')

  // Vehicle API state
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [vehicleLoading, setVehicleLoading] = useState(false)
  const [vehicleError, setVehicleError] = useState<string | null>(null)

  const filteredStations = MOCK_STATIONS.filter(s =>
    s.name.toLowerCase().includes(stationSearch.toLowerCase()) ||
    s.district.toLowerCase().includes(stationSearch.toLowerCase())
  )

  // Fetch available vehicles when a station is selected
  useEffect(() => {
    if (!selectedStationId) { setVehicles([]); return }
    const fetch = async () => {
      setVehicleLoading(true)
      setVehicleError(null)
      try {
        // Lấy toàn bộ xe available (backend có thể thêm stationId filter sau)
        const res = await vehicleApi.getAll({ keyword: 'available', limit: 50 })
        // Filter client-side theo stationId nếu có
        const stationVehicles = res.data.data.filter(
          v => v.stationId === selectedStationId || v.station?.id === selectedStationId
        )
        // Nếu không có xe gán trạm thì show tất cả available để demo
        setVehicles(stationVehicles.length > 0 ? stationVehicles : res.data.data.slice(0, 6))
      } catch {
        setVehicleError('Không thể tải danh sách xe')
      } finally {
        setVehicleLoading(false)
      }
    }
    fetch()
  }, [selectedStationId])

  const selectedStation = MOCK_STATIONS.find(s => s.id === selectedStationId)

  const displayedVehicles = vehicleTab === 'all'
    ? vehicles
    : vehicles.filter(v => v.vehicleType === vehicleTab)

  const motorbikeCount = vehicles.filter(v => v.vehicleType === 'motorbike').length
  const carCount = vehicles.filter(v => v.vehicleType === 'car').length

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* ── Sidebar ──────────────────────────────── */}
      <div className="w-80 bg-white border-r border-gray-100 flex flex-col shrink-0 overflow-hidden">

        {/* Search stations */}
        <div className="p-4 border-b border-gray-100">
          <h2 className="font-display font-bold text-base text-gray-900 mb-3">Trạm xe VShare</h2>
          <Input placeholder="Tìm trạm, quận..."
            leftIcon={<Search className="w-4 h-4" />}
            value={stationSearch}
            onChange={e => setStationSearch(e.target.value)} />
        </div>

        {/* Station list */}
        <div className={`overflow-y-auto p-3 space-y-1.5 transition-all ${selectedStation ? 'max-h-48' : 'flex-1'}`}>
          {filteredStations.map(station => (
            <button key={station.id}
              onClick={() => setSelectedStationId(
                selectedStationId === station.id ? null : station.id
              )}
              className={`w-full text-left p-3 rounded-xl border transition-all ${selectedStationId === station.id
                  ? 'border-brand-400 bg-brand-50'
                  : 'border-gray-100 hover:border-brand-200 hover:bg-gray-50 bg-white'
                }`}>
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold text-xs text-gray-900">{station.name}</span>
                <MapPin className={`w-3.5 h-3.5 shrink-0 ${selectedStationId === station.id ? 'text-brand-600' : 'text-gray-300'}`} />
              </div>
              <p className="text-xs text-gray-400 mt-0.5 truncate">{station.district}</p>
            </button>
          ))}
        </div>

        {/* Vehicle panel - shows when station is selected */}
        {selectedStation && (
          <div className="flex-1 flex flex-col overflow-hidden border-t border-gray-100">
            {/* Vehicle type tabs */}
            <div className="px-4 pt-3 pb-0">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-700 truncate">{selectedStation.name}</p>
                <button onClick={() => { if (selectedStationId) setVehicles([]); setSelectedStationId(selectedStationId) }}
                  disabled={vehicleLoading}
                  className="p-1 rounded-lg hover:bg-gray-100 text-gray-400 disabled:opacity-40">
                  <RefreshCw className={`w-3 h-3 ${vehicleLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              <div className="flex border-b border-gray-100 -mx-4 px-4 gap-3">
                {([
                  { key: 'all', label: 'Tất cả', count: vehicles.length },
                  { key: 'motorbike', label: 'Xe máy', count: motorbikeCount },
                  { key: 'car', label: 'Ô tô', count: carCount },
                ] as const).map(tab => (
                  <button key={tab.key} onClick={() => setVehicleTab(tab.key)}
                    className={`flex items-center gap-1 pb-2 text-xs font-medium border-b-2 transition-colors -mb-px ${vehicleTab === tab.key
                        ? 'border-brand-600 text-brand-700'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                      }`}>
                    {tab.label}
                    <span className={`px-1.5 py-0.5 rounded-full text-xs font-mono ${vehicleTab === tab.key ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'
                      }`}>{tab.count}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Vehicle list */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
              {vehicleLoading ? (
                <div className="space-y-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-24 rounded-xl bg-gray-50 animate-pulse border border-gray-100" />
                  ))}
                </div>
              ) : vehicleError ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <WifiOff className="w-6 h-6 text-gray-200" />
                  <p className="text-xs text-gray-400">{vehicleError}</p>
                </div>
              ) : displayedVehicles.length === 0 ? (
                <div className="flex flex-col items-center gap-2 py-6 text-center">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center">
                    {vehicleTab === 'car' ? <Car className="w-5 h-5 text-gray-200" /> : <Bike className="w-5 h-5 text-gray-200" />}
                  </div>
                  <p className="text-xs text-gray-400">Không có xe khả dụng</p>
                </div>
              ) : (
                displayedVehicles.map(v => (
                  <VehicleCard key={v.id} v={v} type={v.vehicleType} />
                ))
              )}
            </div>
          </div>
        )}

        {/* Prompt to select station */}
        {!selectedStation && (
          <div className="p-4 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-400">Chọn một trạm để xem xe khả dụng</p>
          </div>
        )}
      </div>

      {/* ── Map ──────────────────────────────────── */}
      <div className="flex-1 relative">
        <MapContainer center={[21.028, 105.854]} zoom={13}
          style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a>'
          />
          {filteredStations.map(station => {
            const isSelected = selectedStationId === station.id
            const icon = divIcon({
              html: renderToStaticMarkup(
                <StationPin count={3} hasAvailable={true} />
              ),
              className: '', iconSize: [38, 38], iconAnchor: [19, 19],
            })
            return (
              <Marker key={station.id} position={[station.lat, station.lng]} icon={icon}
                eventHandlers={{ click: () => setSelectedStationId(isSelected ? null : station.id) }}>
                <Popup>
                  <div style={{ minWidth: 180 }}>
                    <strong style={{ fontSize: 13, color: '#111827' }}>{station.name}</strong>
                    <p style={{ fontSize: 11, color: '#16a34a', margin: '4px 0 2px' }}>{station.address}</p>
                    <p style={{ fontSize: 11, color: '#6b7280' }}>{station.district}</p>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>

        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-xl border border-gray-100 shadow-md p-3 text-xs z-10 space-y-2">
          <p className="font-semibold text-gray-700">Chú thích</p>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-brand-600 shadow-sm" />
            <span className="text-gray-500">Có xe</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-gray-400" />
            <span className="text-gray-500">Hết xe</span>
          </div>
        </div>

        {/* Selected station overlay on map */}
        {selectedStation && (
          <div className="absolute top-4 left-4 bg-white rounded-xl border border-brand-200 shadow-lg p-3 z-10 max-w-56">
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-brand-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-xs text-gray-900">{selectedStation.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{selectedStation.address}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
