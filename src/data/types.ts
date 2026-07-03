export interface Category {
  id: string;
  title: string;
  icon: string; // Ionicons name
  color: string;
}

export interface AmusementOption {
  id: string;
  title: string;
  price: number; // per person, toman
}

export interface TimeSlot {
  id: string;
  date: string; // shamsi display
  start: string;
  end: string;
  departure?: string;
  remaining: number;
}

export interface Amusement {
  id: string;
  categoryId: string;
  title: string;
  agencyId: string;
  description: string;
  photos: string[];
  city: string;
  location: string;
  priceAdult: number;
  priceChild: number;
  rules: string[];
  minAge: number;
  maxAge: number;
  capacity: number;
  healthRestricted: boolean;
  options: AmusementOption[];
  slots: TimeSlot[];
  rating: number;
  verified: boolean;
  featured?: boolean;
}

export interface Agency {
  id: string;
  name: string;
  city: string;
  verified: boolean;
  phone: string;
}

export const TAX_RATE = 0.1;
