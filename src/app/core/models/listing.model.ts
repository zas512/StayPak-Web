export type PropertyType = 'apartment' | 'house' | 'room' | 'villa';
export type ListingStatus = 'draft' | 'active' | 'paused' | 'deleted';

export interface ListingPhoto {
  id: string;
  listingId: string;
  s3Key: string;
  cdnUrl: string;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
}

export interface ListingAvailability {
  id: string;
  listingId: string;
  date: string;
  isBlocked: boolean;
  overridePrice?: number;
}

export interface ListingHost {
  id: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  cnicStatus: 'pending' | 'verified' | 'rejected';
}

export interface Listing {
  id: string;
  hostId: string;
  title: string;
  description?: string;
  propertyType: PropertyType;
  city: string;
  area?: string;
  address?: string;
  lat?: number;
  lng?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities: string[];
  pricePerNight: number;
  instantBook: boolean;
  status: ListingStatus;
  createdAt: string;
  updatedAt: string;
  photos?: ListingPhoto[];
  host?: ListingHost;
  availability?: ListingAvailability[];
}

export interface CreateListingRequest {
  title: string;
  description?: string;
  propertyType: PropertyType;
  city: string;
  area?: string;
  address?: string;
  lat?: number;
  lng?: number;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  amenities?: string[];
  pricePerNight: number;
  instantBook?: boolean;
}

export interface UpdateListingRequest extends Partial<CreateListingRequest> {
  status?: ListingStatus;
}

export interface ListingQueryParams {
  page?: number;
  limit?: number;
  city?: string;
  propertyType?: PropertyType;
  minPrice?: number;
  maxPrice?: number;
  minGuests?: number;
  checkIn?: string;
  checkOut?: string;
  amenities?: string[];
  instantBook?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: ListingStatus;
}

export interface PaginatedListings {
  data: Listing[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface AvailabilityRequest {
  date: string;
  isBlocked?: boolean;
  overridePrice?: number;
}