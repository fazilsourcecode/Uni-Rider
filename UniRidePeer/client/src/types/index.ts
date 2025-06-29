export interface User {
  id: number;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  universityId: string;
  university: string;
  dateOfBirth: string;
  role: 'lender' | 'borrower';
  profileImageUrl?: string;
  licenseImageUrl?: string;
  isVerified: boolean;
  isPhoneVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Motorcycle {
  id: number;
  ownerId: number;
  make: string;
  model: string;
  year: number;
  type: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  seatingCapacity: number;
  hourlyRate: string;
  location: string;
  latitude?: string;
  longitude?: string;
  images?: string[];
  description?: string;
  isAvailable: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  id: number;
  borrowerId: number;
  motorcycleId: number;
  startDateTime: string;
  endDateTime: string;
  totalAmount: string;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
  paymentMethod?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: number;
  senderId: number;
  receiverId: number;
  bookingId?: number;
  content: string;
  messageType: 'text' | 'image' | 'system';
  isRead: boolean;
  createdAt: string;
}

export interface Review {
  id: number;
  bookingId: number;
  reviewerId: number;
  revieweeId: number;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface RegistrationData {
  phoneNumber: string;
  university: string;
  role: 'lender' | 'borrower';
}

export interface ProfileData {
  phoneNumber: string;
  firstName: string;
  lastName: string;
  email: string;
  universityId: string;
  university: string;
  dateOfBirth: string;
  role: 'lender' | 'borrower';
  profileImageUrl?: string;
  licenseImageUrl?: string;
}

export interface SearchFilters {
  latitude?: number;
  longitude?: number;
  radius?: number;
  type?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface BookingData {
  borrowerId: number;
  motorcycleId: number;
  startDateTime: string;
  endDateTime: string;
  totalAmount: string;
  paymentMethod?: string;
}
