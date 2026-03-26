export interface Station {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  totalSlots: number
  availableVehicles: number
  imageUrl?: string
  district: string
}
