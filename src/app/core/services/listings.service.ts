import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  Listing,
  CreateListingRequest,
  UpdateListingRequest,
  ListingQueryParams,
  PaginatedListings,
  AvailabilityRequest,
} from '../models/listing.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ListingsService {
  constructor(private api: ApiService) {}

  getAll(params: ListingQueryParams = {}): Observable<PaginatedListings> {
    return this.api.get<PaginatedListings>('/listings', params);
  }

  getById(id: string): Observable<Listing> {
    return this.api.get<Listing>(`/listings/${id}`);
  }

  getMyListings(params: ListingQueryParams = {}): Observable<PaginatedListings> {
    return this.api.get<PaginatedListings>('/listings/host/mine', params);
  }

  create(data: CreateListingRequest): Observable<Listing> {
    return this.api.post<Listing>('/listings', data);
  }

  update(id: string, data: UpdateListingRequest): Observable<Listing> {
    return this.api.patch<Listing>(`/listings/${id}`, data);
  }

  delete(id: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/listings/${id}`);
  }

  addPhoto(listingId: string, file: File, isCover = false, sortOrder = 0): Observable<any> {
    return this.api.upload(`/listings/${listingId}/photos`, file, 'photo', { isCover, sortOrder });
  }

  removePhoto(listingId: string, photoId: string): Observable<{ message: string }> {
    return this.api.delete<{ message: string }>(`/listings/${listingId}/photos/${photoId}`);
  }

  updateAvailability(listingId: string, availability: AvailabilityRequest[]): Observable<any[]> {
    return this.api.patch<any[]>(`/listings/${listingId}/availability`, availability);
  }

  getCities(): Observable<string[]> {
    return this.api.get<string[]>('/listings/cities');
  }

  getPropertyTypes(): Observable<string[]> {
    return this.api.get<string[]>('/listings/property-types');
  }

  getAmenities(): Observable<string[]> {
    return this.api.get<string[]>('/listings/amenities');
  }
}