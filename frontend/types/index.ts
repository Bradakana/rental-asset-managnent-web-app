// User and Authentication Types
export interface User {
  id: string
  firstName: string
  lastName: string
  email: string
  username: string
  vendorId: string
  role: 'admin' | 'manager' | 'user'
  createdAt: Date
  updatedAt: Date
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  vendorId: string | null
  loading: boolean
}

// Asset Types
export interface Asset {
  id: string
  name: string
  type: 'car' | 'real-estate'
  description: string
  dailyRate: number
  status: 'available' | 'rented' | 'maintenance' | 'unavailable'
  location: string
  image?: string
  vendorId: string
  lastRental?: Date
  createdAt: Date
  updatedAt: Date
}

// Renter Types
export interface Renter {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  licenseNumber?: string
  passportNumber?: string
  status: 'active' | 'inactive' | 'suspended'
  verified: boolean
  avatar?: string
  totalRentals: number
  totalSpent: number
  rating: number
  vendorId: string
  createdAt: Date
  updatedAt: Date
}

// Rental Types
export interface Rental {
  id: string
  assetId: string
  assetName: string
  assetType: 'car' | 'real-estate'
  renterId: string
  renterName: string
  renterEmail: string
  startDate: Date
  endDate: Date
  totalAmount: number
  dailyRate: number
  deposit?: number
  status: 'active' | 'completed' | 'overdue' | 'cancelled'
  notes?: string
  contractUrl?: string
  pickupCondition?: string
  returnCondition?: string
  vendorId: string
  createdAt: Date
  updatedAt: Date
}

// Document Types
export interface Document {
  id: string
  name: string
  type: 'license' | 'passport' | 'contract' | 'other'
  url: string
  renterId?: string
  rentalId?: string
  vendorId: string
  expiresAt?: Date
  createdAt: Date
}

// Vendor Types
export interface Vendor {
  id: string
  name: string
  type: 'car' | 'real-estate' | 'both'
  description?: string
  ownerId: string
  createdAt: Date
  updatedAt: Date
}

// Dashboard Statistics
export interface DashboardStats {
  totalAssets: number
  availableAssets: number
  rentedAssets: number
  monthlyRevenue: number
  totalRentals: number
  activeRentals: number
  overdueRentals: number
  totalRevenue: number
  totalRenters: number
  activeRenters: number
  expiringDocs: number
  avgRating: number
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// Form Types
export interface LoginForm {
  email: string
  password: string
}

export interface RegisterForm {
  firstName: string
  lastName: string
  username: string
  email: string
  password: string
}

export interface AssetForm {
  name: string
  type: 'car' | 'real-estate'
  description: string
  dailyRate: number
  location: string
  image?: File
}

export interface RenterForm {
  firstName: string
  lastName: string
  email: string
  phone: string
  address?: string
  licenseNumber?: string
  passportNumber?: string
  notes?: string
  documents?: File[]
}

export interface RentalForm {
  assetId: string
  renterId: string
  startDate: string
  endDate: string
  dailyRate: number
  deposit?: number
  notes?: string
  contract?: File
} 