export type CarCategory = 'suv' | 'sedan' | 'hatchback' | 'luxury' | 'sports' | 'convertible';
export type FuelType = 'petrol' | 'diesel' | 'electric' | 'hybrid';
export type TransmissionType = 'automatic' | 'manual';
export type BookingStatus = 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
export type AppRole = 'admin' | 'customer';

export interface Car {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  category: CarCategory;
  fuel_type: FuelType;
  transmission: TransmissionType;
  seats: number;
  price_per_day: number;
  description: string | null;
  features: string[];
  images: string[];
  location: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: string;
  user_id: string;
  car_id: string;
  pickup_date: string;
  dropoff_date: string;
  pickup_location: string;
  dropoff_location: string;
  total_days: number;
  total_amount: number;
  status: BookingStatus;
  notes: string | null;
  payment_method?: string | null;
  created_at: string;
  updated_at: string;
  car?: Car;
}

export interface Profile {
  id: string;
  user_id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  address: string | null;
  city: string | null;
  created_at: string;
  updated_at: string;
}

export interface Payment {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  stripe_payment_id: string | null;
  payment_method: string | null;
  status: string;
  created_at: string;
}

export interface CarFilters {
  category?: CarCategory;
  location?: string;
  minPrice?: number;
  maxPrice?: number;
  fuelType?: FuelType;
  transmission?: TransmissionType;
  pickupDate?: Date;
  dropoffDate?: Date;
}
