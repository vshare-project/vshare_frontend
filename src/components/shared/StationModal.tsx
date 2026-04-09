import React, { useState, useEffect } from 'react'
import { X, Upload, MapPin, Clock, Image as ImageIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import type { Station, StationType } from '@/types/station.types'

interface StationModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (data: FormData) => Promise<void>
  initialData?: Station | null
  loading?: boolean
}

export function StationModal({ isOpen, onClose, onSave, initialData, loading }: StationModalProps) {
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  
  // State quản lý form
  const [formData, setFormData] = useState({
    stationName: '',
    address: '',
    latitude: '',
    longitude: '',
    totalSlots: '',
    availableSlots: '',
    stationType: 'public' as StationType,
    openTime: '07:00',
    closeTime: '23:00',
    isActive: true,
  })

  // Đổ dữ liệu vào form nếu là chế độ "Chỉnh sửa"
  useEffect(() => {
    if (initialData) {
      setFormData({
        stationName: initialData.stationName,
        address: initialData.address,
        latitude: initialData.latitude.toString(),
        longitude: initialData.longitude.toString(),
        totalSlots: initialData.totalSlots.toString(),
        availableSlots: initialData.availableSlots.toString(),
        stationType: initialData.stationType,
        openTime: initialData.openTime?.slice(0, 5) || '07:00',
        closeTime: initialData.closeTime?.slice(0, 5) || '23:00',
        isActive: initialData.isActive,
      })
      setPreviewUrls(initialData.imageUrls || [])
      setFiles([]) // Reset file mới
    } else {
      // Reset form nếu là "Thêm mới"
      setFormData({
        stationName: '', address: '', latitude: '', longitude: '',
        totalSlots: '', availableSlots: '', stationType: 'public',
        openTime: '07:00', closeTime: '23:00', isActive: true,
      })
      setPreviewUrls([])
      setFiles([])
    }
  }, [initialData, isOpen])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length + files.length > 5) {
      alert('Chỉ được chọn tối đa 5 ảnh!')
      return
    }
    
    setFiles(prev => [...prev, ...selectedFiles])
    
    // Tạo link preview cho ảnh mới chọn
    const newPreviews = selectedFiles.map(file => URL.createObjectURL(file))
    setPreviewUrls(prev => [...prev, ...newPreviews])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const submitData = new FormData()
    submitData.append('stationName', formData.stationName)
    submitData.append('address', formData.address)
    submitData.append('latitude', formData.latitude)
    submitData.append('longitude', formData.longitude)
    submitData.append('totalSlots', formData.totalSlots)
    submitData.append('availableSlots', formData.availableSlots)
    submitData.append('stationType', formData.stationType)
    submitData.append('openTime', formData.openTime)
    submitData.append('closeTime', formData.closeTime)
    submitData.append('isActive', formData.isActive.toString())

    // Append danh sách file ảnh
    files.forEach(file => {
      submitData.append('images', file)
    })

    await onSave(submitData)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl my-8">
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? 'Chỉnh sửa trạm xe' : 'Thêm trạm mới'}
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:bg-gray-100 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tên trạm</label>
              <Input required placeholder="VD: Trạm Bến Thành" 
                value={formData.stationName} onChange={e => setFormData({...formData, stationName: e.target.value})} />
            </div>
            
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
              <Input required placeholder="VD: Quận 1, TP.HCM" leftIcon={<MapPin className="w-4 h-4"/>}
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Vĩ độ (Latitude)</label>
              <Input required type="number" step="any" placeholder="10.7729" 
                value={formData.latitude} onChange={e => setFormData({...formData, latitude: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Kinh độ (Longitude)</label>
              <Input required type="number" step="any" placeholder="106.6980" 
                value={formData.longitude} onChange={e => setFormData({...formData, longitude: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tổng số chỗ</label>
              <Input required type="number" placeholder="20" 
                value={formData.totalSlots} onChange={e => setFormData({...formData, totalSlots: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Chỗ còn trống</label>
              <Input required type="number" placeholder="20" 
                value={formData.availableSlots} onChange={e => setFormData({...formData, availableSlots: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ mở cửa</label>
              <Input required type="time" leftIcon={<Clock className="w-4 h-4"/>}
                value={formData.openTime} onChange={e => setFormData({...formData, openTime: e.target.value})} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giờ đóng cửa</label>
              <Input required type="time" leftIcon={<Clock className="w-4 h-4"/>}
                value={formData.closeTime} onChange={e => setFormData({...formData, closeTime: e.target.value})} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại trạm</label>
              <select 
                className="w-full flex h-10 px-3 py-2 rounded-xl border border-gray-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
                value={formData.stationType} 
                onChange={e => setFormData({...formData, stationType: e.target.value as StationType})}
              >
                <option value="public">Công cộng</option>
                <option value="university">Trường học</option>
                <option value="commercial">Thương mại</option>
                <option value="residential">Khu dân cư</option>
              </select>
            </div>
            
            <div className="flex items-center mt-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="w-4 h-4 text-brand-600 rounded border-gray-300"
                  checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} />
                <span className="text-sm font-medium text-gray-700">Trạm đang hoạt động</span>
              </label>
            </div>

            {/* Upload Ảnh */}
            <div className="col-span-2 mt-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Ảnh trạm (Tối đa 5 ảnh)</label>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {previewUrls.map((url, idx) => (
                  <div key={idx} className="relative w-20 h-20 shrink-0 rounded-lg border border-gray-200 overflow-hidden group">
                    <img src={url} alt="preview" className="w-full h-full object-cover" />
                  </div>
                ))}
                
                {previewUrls.length < 5 && (
                  <label className="w-20 h-20 shrink-0 rounded-lg border-2 border-dashed border-gray-300 hover:border-brand-500 hover:bg-brand-50 flex flex-col items-center justify-center cursor-pointer transition-colors">
                    <Upload className="w-5 h-5 text-gray-400 mb-1" />
                    <span className="text-[10px] font-medium text-gray-500">Tải lên</span>
                    <input type="file" multiple accept="image/*" className="hidden" onChange={handleFileChange} />
                  </label>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <Button type="button" variant="outline" onClick={onClose} disabled={loading}>Hủy bỏ</Button>
            <Button type="submit" loading={loading}>
              {initialData ? 'Cập nhật' : 'Thêm trạm mới'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}