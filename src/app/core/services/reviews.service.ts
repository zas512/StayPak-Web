import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Review, CreateReviewRequest, ReviewQueryParams, PaginatedReviews, RatingSummary } from '../models/review.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReviewsService {
  constructor(private api: ApiService) {}

  getAll(params: ReviewQueryParams = {}): Observable<PaginatedReviews> {
    return this.api.get<PaginatedReviews>('/reviews', params);
  }

  getByBooking(bookingId: string): Observable<Review[]> {
    return this.api.get<Review[]>(`/reviews/booking/${bookingId}`);
  }

  create(data: CreateReviewRequest): Observable<Review> {
    return this.api.post<Review>('/reviews', data);
  }

  getHostRating(hostId: string): Observable<RatingSummary> {
    return this.api.get<RatingSummary>(`/reviews/host/${hostId}/rating`);
  }

  getListingRating(listingId: string): Observable<RatingSummary> {
    return this.api.get<RatingSummary>(`/reviews/listing/${listingId}/rating`);
  }
}