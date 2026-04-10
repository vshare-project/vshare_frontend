import React, { useState, useEffect } from 'react'
import { X, Upload, Car, Bike, Battery, MapPin } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Vehicle, VehicleType, VehicleStatus } from '@/types/vehicle.types'

interface VehicleModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FormData) => Promise<void>
  initialData?: Vehicle | null
  loading?: boolean
}

export function VehicleModal({ isOpen, onClose, onSave, initialData, loading }: VehicleModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  // ─── STATE CƠ BẢN (Base Vehicle) ──────────────────────────────────────────
  const [baseData, setBaseData] = useState({
    vehicleCode: '', vehicleType: 'motorbike' as VehicleType,
    brand: '', model: '', color: '', year: '', licensePlate: '',
    batteryLevel: '100', rangeKm: '', status: 'available' as VehicleStatus, stationId: ''
  })

  // ─── STATE CHI TIẾT Ô TÔ (Car Details) ────────────────────────────────────
  const [carData, setCarData] = useState({
    capacity: 4, numDoors: 4, transmissionType: 'automatic', driveMode: '2wd',
    motorPowerKw: '', batteryCapacityKwh: '', maxSpeedKmh: '', chargingTimeHour: '',
    hasAirConditioning: true, hasSunroof: false, hasGPS: false, hasBackupCamera: false, hasBlindSpotMonitor: false
  })

  // ─── STATE CHI TIẾT XE MÁY (Motorbike Details) ────────────────────────────
  const [motoData, setMotoData] = useState({
    motorbikeType: 'scooter', motorPowerW: '', batteryCapacityKwh: '', maxSpeedKmh: '',
    chargingTimeHour: '', weightKg: '', maxLoadKg: '',
    hasHelmetStorage: false, hasUSBCharger: false, hasAntiLockBrakes: false, hasGPS: false
  })

  useEffect(() => {
    if (initialData) {
      setBaseData({
        vehicleCode: initialData.vehicleCode, vehicleType: initialData.vehicleType,
        brand: initialData.brand, model: initialData.model, color: initialData.color || '',
        year: initialData.year?.toString() || '', licensePlate: initialData.licensePlate || '',
        batteryLevel: initialData.batteryLevel.toString(), rangeKm: initialData.rangeKm?.toString() || '',
        status: initialData.status, stationId: initialData.stationId?.toString() || ''
      })
      if (initialData.carDetails) {
        setCarData({ ...carData, ...initialData.carDetails } as any)
      }
      if (initialData.motorbikeDetails) {
        setMotoData({ ...motoData, ...initialData.motorbikeDetails } as any)
      }
      setPreviewUrls(initialData.issueImages || [])
      setFiles([])
    } else {
      setBaseData({
        vehicleCode: '', vehicleType: 'motorbike', brand: '', model: '', color: '', year: '',
        licensePlate: '', batteryLevel: '100', rangeKm: '', status: 'available', stationId: ''
      })
      setPreviewUrls([])
      setFiles([])
    }
  }, [initialData, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length + files.length > 3) {
      alert('Chỉ được chọn tối đa 3 ảnh theo quy định!')
      return
    }

    setFiles(prev => [...prev, ...selectedFiles])
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviews])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const submitData = new FormData()

    // 1. Append Base Data
    Object.entries(baseData).forEach(([key, value]) => {
      if (value !== '' && value !== undefined) submitData.append(key, value.toString())
    })

    // 2. Append Nested Data (Thành JSON String)
    if (baseData.vehicleType === 'car') {
      submitData.append('carDetails', JSON.stringify(carData))
    } else if (baseData.vehicleType === 'motorbike') {
      submitData.append('motorbikeDetails', JSON.stringify(motoData))
    }

    // 3. Append Hình ảnh
    files.forEach(file => {
      submitData.append('issueImages', file)
    })

    await onSave(submitData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl my-8">
        <div className="flex justify-between items-center p-5 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-2xl">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            {baseData.vehicleType === 'car' ? <Car className="w-6 h-6 text-brand-600" /> : <Bike className="w-6 h-6 text-brand-600" />}
            {initialData ? 'Chỉnh sửa phương tiện' : 'Thêm phương tiện mới'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* --- THÔNG TIN CƠ BẢN --- */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4 border-l-4 border-brand-500 pl-3">Thông tin cơ bản</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mã xe *</label>
                <Input required placeholder="VD: VF-001" value={baseData.vehicleCode} onChange={e => setBaseData({ ...baseData, vehicleCode: e.target.value })} disabled={!!initialData} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại xe *</label>
                <select className="w-full flex h-10 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  value={baseData.vehicleType} onChange={e => setBaseData({ ...baseData, vehicleType: e.target.value as VehicleType })} disabled={!!initialData}>
                  <option value="motorbike">Xe máy</option>
                  <option value="car">Ô tô</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái *</label>
                <select className="w-full flex h-10 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
                  value={baseData.status} onChange={e => setBaseData({ ...baseData, status: e.target.value as VehicleStatus })}>
                  <option value="available">Sẵn sàng</option>
                  <option value="in_use">Đang sử dụng</option>
                  <option value="maintenance">Bảo trì</option>
                  <option value="low_battery">Pin yếu</option>
                </select>
              </div>

              <div><label className="block text-sm font-medium text-gray-700 mb-1">Hãng xe *</label><Input required placeholder="VinFast" value={baseData.brand} onChange={e => setBaseData({ ...baseData, brand: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Model *</label><Input required placeholder="Klara S / VF3" value={baseData.model} onChange={e => setBaseData({ ...baseData, model: e.target.value })} /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Màu sắc</label><Input placeholder="Xanh, Đỏ..." value={baseData.color} onChange={e => setBaseData({ ...baseData, color: e.target.value })} /></div>

              <div><label className="block text-sm font-medium text-gray-700 mb-1">Biển số xe</label><Input placeholder="29A-12345" value={baseData.licensePlate} onChange={e => setBaseData({ ...baseData, licensePlate: e.target.value })} /></div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mức pin (0-100) *</label>
                <Input required type="number" min="0" max="100" leftIcon={<Battery className="w-4 h-4" />} value={baseData.batteryLevel} onChange={e => setBaseData({ ...baseData, batteryLevel: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID Trạm gắn liền</label>
                <Input type="number" placeholder="ID Trạm (nếu có)" leftIcon={<MapPin className="w-4 h-4" />} value={baseData.stationId} onChange={e => setBaseData({ ...baseData, stationId: e.target.value })} />
              </div>
            </div>
          </div>

          {/* --- CHI TIẾT TÙY THEO LOẠI XE --- */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4 border-l-4 border-brand-500 pl-3">Thông số kỹ thuật</h3>

            {/* THÔNG SỐ Ô TÔ */}
            {baseData.vehicleType === 'car' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Số chỗ ngồi</label><Input type="number" value={carData.capacity} onChange={e => setCarData({ ...carData, capacity: Number(e.target.value) })} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Loại hộp số</label>
                  <select className="w-full flex h-10 px-3 py-2 rounded-xl border border-gray-200" value={carData.transmissionType} onChange={e => setCarData({ ...carData, transmissionType: e.target.value })}>
                    <option value="automatic">Tự động</option><option value="manual">Số sàn</option><option value="cvt">Vô cấp</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Dung lượng Pin (kWh)</label><Input type="number" step="any" value={carData.batteryCapacityKwh} onChange={e => setCarData({ ...carData, batteryCapacityKwh: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Vận tốc tối đa (km/h)</label><Input type="number" step="any" value={carData.maxSpeedKmh} onChange={e => setCarData({ ...carData, maxSpeedKmh: e.target.value })} /></div>

                {/* Checkboxes Ô tô */}
                <div className="col-span-4 flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={carData.hasAirConditioning} onChange={e => setCarData({ ...carData, hasAirConditioning: e.target.checked })} /> Điều hòa</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={carData.hasGPS} onChange={e => setCarData({ ...carData, hasGPS: e.target.checked })} /> GPS</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={carData.hasBackupCamera} onChange={e => setCarData({ ...carData, hasBackupCamera: e.target.checked })} /> Camera lùi</label>
                </div>
              </div>
            )}

            {/* THÔNG SỐ XE MÁY */}
            {baseData.vehicleType === 'motorbike' && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Kiểu xe máy</label>
                  <select className="w-full flex h-10 px-3 py-2 rounded-xl border border-gray-200" value={motoData.motorbikeType} onChange={e => setMotoData({ ...motoData, motorbikeType: e.target.value })}>
                    <option value="scooter">Tay ga</option><option value="manual">Xe số</option><option value="sport">Thể thao</option>
                  </select>
                </div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Công suất Động cơ (W)</label><Input type="number" value={motoData.motorPowerW} onChange={e => setMotoData({ ...motoData, motorPowerW: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Dung lượng Pin (kWh)</label><Input type="number" step="any" value={motoData.batteryCapacityKwh} onChange={e => setMotoData({ ...motoData, batteryCapacityKwh: e.target.value })} /></div>
                <div><label className="block text-sm font-medium text-gray-700 mb-1">Tải trọng tối đa (kg)</label><Input type="number" value={motoData.maxLoadKg} onChange={e => setMotoData({ ...motoData, maxLoadKg: e.target.value })} /></div>

                {/* Checkboxes Xe máy */}
                <div className="col-span-4 flex flex-wrap gap-4 mt-2">
                  <label className="flex items-center gap-2"><input type="checkbox" checked={motoData.hasHelmetStorage} onChange={e => setMotoData({ ...motoData, hasHelmetStorage: e.target.checked })} /> Cốp mũ bảo hiểm</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={motoData.hasAntiLockBrakes} onChange={e => setMotoData({ ...motoData, hasAntiLockBrakes: e.target.checked })} /> Phanh ABS</label>
                  <label className="flex items-center gap-2"><input type="checkbox" checked={motoData.hasUSBCharger} onChange={e => setMotoData({ ...motoData, hasUSBCharger: e.target.checked })} /> Sạc USB</label>
                </div>
              </div>
            )}
          </div>

          {/* Upload Ảnh */}
          <div>
            <h3 className="font-semibold text-lg text-gray-800 mb-4 border-l-4 border-brand-500 pl-3">Hình ảnh xe</h3>
            <label className="block text-sm font-medium text-gray-700 mb-2">Tải lên (Tối đa 3 ảnh)</label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {previewUrls.map((url, idx) => (
                <div key={idx} className="relative w-20 h-20 shrink-0 rounded-lg border border-gray-200 overflow-hidden group">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                </div>
              ))}

              {previewUrls.length < 3 && (
                <label className="w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-500 hover:bg-brand-50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                  <Upload className="w-5 h-5 text-gray-400 mb-1" />
                  <span className="text-[10px] font-medium text-gray-500">Tải lên</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                </label>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 sticky bottom-0 bg-white">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Hủy</Button>
            <Button type="submit" loading={loading}>{initialData ? 'Cập nhật xe' : 'Thêm xe mới'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}