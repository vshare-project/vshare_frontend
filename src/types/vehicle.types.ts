export type VehicleType = 'car' | 'motorbike'

export type VehicleStatus =
  | 'available'
  | 'rented'
  | 'maintenance'
  | 'charging'
  | 'low_battery'
  | 'out_of_service'

export interface MotorbikeDetails {
  id: string
  motorbikeType: 'scooter' | 'manual' | 'sport'
  motorPowerW: number
  batteryCapacityKwh: string
  maxSpeedKmh: string
  chargingTimeHour: string
  weightKg: number
  maxLoadKg: number
  hasHelmetStorage: boolean
  hasUSBCharger: boolean
  hasAntiLockBrakes: boolean
  hasGPS: boolean
  features: string[]
}

export interface CarDetails {
  id: string
  seats: number
  motorPowerKw: number
  batteryCapacityKwh: string
  maxSpeedKmh: string
  chargingTimeHour: string
  weightKg: number
  maxLoadKg: number
  hasAC: boolean
  hasGPS: boolean
  hasBluetooth: boolean
  features: string[]
}

export interface Vehicle {
  id: string
  createdAt: string
  updatedAt: string
  vehicleCode: string
  vehicleType: VehicleType
  brand: string
  model: string
  color: string
  year: number
  licensePlate: string
  batteryLevel: number
  rangeKm: string
  status: VehicleStatus
  stationId: string | null
  currentLat: string
  currentLong: string
  lastMaintenanceDate: string | null
  issueImages: string[]
  station: { id: string; stationName: string; address: string } | null
  carDetails: CarDetails | null
  motorbikeDetails: MotorbikeDetails | null
}

export interface VehiclePaginationResponse {
  status: string
  message: string
  data: Vehicle[]
  meta: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}
