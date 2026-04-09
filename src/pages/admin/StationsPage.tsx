import { useState, useEffect, useCallback } from 'react'
import { Search, Plus, MapPin, Edit, Trash2, AlertTriangle, RefreshCw, X, Clock, Map } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import { StationModal } from '@/components/shared/StationModal'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { stationApi } from '@/api/station.api'
import type { Station, StationType } from '@/types/station.types'
import { toast } from 'sonner'

// ─── Constants ───────────────────────────────────────────────────────────────
const TYPE_MAP: Record<StationType, string> = {
  public: 'Công cộng',
  university: 'Trường học',
  commercial: 'Thương mại',
  residential: 'Khu dân cư'
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <Card className="animate-pulse">
      <CardContent>
        <div className="flex justify-between mb-3">
          <div className="w-9 h-9 rounded-xl bg-gray-200" />
          <div className="w-16 h-6 rounded-full bg-gray-200" />
        </div>
        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
        <div className="h-3 bg-gray-200 rounded w-full mb-4" />
        <div className="h-1.5 bg-gray-200 rounded-full w-full mb-4" />
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-50">
          <div className="w-20 h-3 bg-gray-200 rounded" />
          <div className="flex gap-2">
            <div className="w-7 h-7 bg-gray-200 rounded-lg" />
            <div className="w-7 h-7 bg-gray-200 rounded-lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function Pagination({ page, totalPages, total, onPageChange }: { page: number, totalPages: number, total: number, onPageChange: (p: number) => void }) {
  return (
    <div className="flex items-center justify-between pt-4 border-t border-gray-200 mt-6">
      <span className="text-sm text-gray-500">Tổng cộng: <span className="font-bold text-gray-900">{total}</span> trạm</span>
      <div className="flex gap-1">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
          <button key={p} onClick={() => onPageChange(p)}
            className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${p === page ? 'bg-brand-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}>
            {p}
          </button>
        ))}
      </div>
    </div>
  )
}

function DeleteConfirmModal({ station, onConfirm, onCancel, loading }: { station: Station; onConfirm: () => void; onCancel: () => void; loading: boolean }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-xl p-6 max-w-sm w-full">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900">Xóa trạm xe</h3>
          </div>
        </div>
        <p className="text-sm text-gray-600 mb-5">
          Bạn chắc chắn muốn xóa trạm <span className="font-semibold text-gray-900">{station.stationName}</span>? Hành động này không thể hoàn tác.
        </p>
        <div className="flex gap-3">
          <Button variant="secondary" className="flex-1" onClick={onCancel} disabled={loading}><X className="w-4 h-4 mr-2" /> Hủy</Button>
          <Button variant="danger" className="flex-1" onClick={onConfirm} loading={loading}><Trash2 className="w-4 h-4 mr-2" /> Xóa trạm</Button>
        </div>
      </div>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function StationsPage() {
  const [search, setSearch] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [page, setPage] = useState(1)
  const LIMIT = 9

  const [stations, setStations] = useState<Station[]>([])
  const [meta, setMeta] = useState({ page: 1, limit: LIMIT, total: 0, totalPages: 1 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Station | null>(null)
  const [deleting, setDeleting] = useState(false)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Station | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const fetchStations = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {

      const cleanKeyword = search.trim() !== '' ? search.trim() : undefined;

      const res = await stationApi.getAll({
        page,
        limit: LIMIT,
        keyword: cleanKeyword
      })
      const apiResponse = res.data as any;;

      if (Array.isArray(apiResponse.data)) {

        setStations(apiResponse.data);
        setMeta({
          page: page,
          limit: LIMIT,
          total: apiResponse.data.length,
          totalPages: Math.ceil(apiResponse.data.length / LIMIT) || 1
        });

      } else if (apiResponse.data && Array.isArray(apiResponse.data.data)) {
        setStations(apiResponse.data.data);
        setMeta({
          page: Number(apiResponse.data.page || apiResponse.data.meta?.page) || 1,
          limit: Number(apiResponse.data.limit || apiResponse.data.meta?.limit) || LIMIT,
          total: Number(apiResponse.data.total || apiResponse.data.meta?.total) || 0,
          totalPages: Math.ceil((Number(apiResponse.data.total || 0)) / LIMIT) || 1
        });
      } else {
        setStations([]);
      }

    } catch (err: any) {
      setError(err.response?.data?.message || 'Không thể kết nối đến server')
    } finally {
      setLoading(false)
    }
  }, [page, search])

  const handleSaveStation = async (formData: FormData) => {
    setIsSaving(true)
    try {
      if (editTarget) {
        await stationApi.update(editTarget.id, formData)
        toast.success('Cập nhật trạm thành công')
      } else {
        await stationApi.create(formData)
        toast.success('Thêm trạm mới thành công')
      }
      setIsModalOpen(false)
      fetchStations()
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Có lỗi xảy ra khi lưu')
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => { fetchStations() }, [fetchStations])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    setSearch(searchInput.trim())
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await stationApi.delete(deleteTarget.id)
      toast.success(`Đã xóa trạm ${deleteTarget.stationName}`)
      setDeleteTarget(null)
      fetchStations()
    } catch {
      toast.error('Xóa trạm thất bại')
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Trạm xe</h1>
          <p className="text-sm text-gray-400 mt-0.5">Quản lý mạng lưới vị trí đặt xe</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchStations} disabled={loading}
            className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-400 transition-colors">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <Button className="gap-2" onClick={() => { setEditTarget(null); setIsModalOpen(true) }}>
            <Plus className="w-4 h-4" /> Thêm trạm mới
          </Button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 text-red-600 text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4" /> {error}
        </div>
      )}

      {/* Toolbar */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2 max-w-md">
        <Input
          placeholder="Tìm tên trạm, địa chỉ..."
          leftIcon={<Search className="w-4 h-4" />}
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
        <Button type="submit">Tìm</Button>
        {search && (
          <Button type="button" variant="outline" onClick={() => { setSearch(''); setSearchInput(''); setPage(1) }}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </form>

      {/* Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {loading ? (
          Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
        ) : stations.length === 0 ? (
          <div className="col-span-full py-12 text-center text-gray-400">
            <Map className="w-10 h-10 mx-auto mb-3 text-gray-200" />
            <p>Không tìm thấy trạm xe nào</p>
          </div>
        ) : (
          stations.map(station => {
            const pct = Math.round((station.availableSlots / station.totalSlots) * 100)
            const variant = pct === 0 ? 'danger' : pct < 20 ? 'warning' : 'success'

            return (
              <Card key={station.id} className="hover:border-brand-500/30 transition-colors group">
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center">
                      <MapPin className="w-5 h-5 text-brand-600" />
                    </div>
                    <Badge variant={station.isActive ? 'success' : 'default'}>
                      {station.isActive ? 'Hoạt động' : 'Tạm ngưng'}
                    </Badge>
                  </div>

                  <h3 className="font-display font-semibold text-gray-900 mb-1 line-clamp-1" title={station.stationName}>
                    {station.stationName}
                  </h3>
                  <p className="text-xs text-gray-500 mb-4 line-clamp-2 min-h-[32px]">{station.address}</p>

                  <div className="space-y-1.5 mb-4">
                    <div className="flex justify-between text-xs">
                      <span className="text-gray-500">Chỗ trống / Tổng</span>
                      <span className="font-mono font-medium text-brand-600">{station.availableSlots} / {station.totalSlots}</span>
                    </div>
                    <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${pct === 0 ? 'bg-red-500' : pct < 20 ? 'bg-yellow-500' : 'bg-brand-500'}`}
                        style={{ width: `${pct}%` }} />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] uppercase font-bold text-gray-400">{TYPE_MAP[station.stationType] || 'Không xác định'}</span>
                      <div className="flex items-center gap-1 text-xs text-gray-500 font-mono">
                        <Clock className="w-3 h-3" /> {station.openTime?.slice(0, 5)} - {station.closeTime?.slice(0, 5)}
                      </div>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => { setEditTarget(station); setIsModalOpen(true) }}
                        className="p-1.5 rounded-lg hover:bg-blue-50 text-gray-400 hover:text-blue-600 transition-colors">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button onClick={() => setDeleteTarget(station)}
                        className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Pagination */}
      {!loading && meta.totalPages > 1 && (
        <Pagination page={meta.page} totalPages={meta.totalPages} total={meta.total} onPageChange={setPage} />
      )}

      <StationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveStation}
        initialData={editTarget}
        loading={isSaving}
      />
      {deleteTarget && (
        <DeleteConfirmModal
          station={deleteTarget}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />

      )}
    </div>
  )
}