export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  STAFF = 'staff',
}

export enum UserStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  OTHER = 'other',
}

export interface UpdateUserDto {
  fullName?: string
  phone?: string
  dateOfBirth?: string 
  profileImageUrl?: string
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  userType: UserRole; 
  status: UserStatus; 
  profileImageUrl?: string; 
  walletBalance: number;
  greenPoints: number;
  isEmailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}

