export type StationType = 'public' | 'university' | 'commercial' | 'residential'

export interface Station {
  id: number
  stationName: string
  address: string
  latitude: number
  longitude: number
  totalSlots: number
  availableSlots: number // Số lượng chỗ còn trống
  isActive: boolean
  stationType: StationType
  imageUrls?: string[]
  openTime?: string
  closeTime?: string
  createdAt: string
  updatedAt: string
}

export interface StationPaginationResponse {
  status: string
  message: string
  data: {
    data: Station[]
    meta: {
      page: number
      limit: number
      total: number
      totalPages: number
    }
  }
}