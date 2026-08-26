export type ReviewTarget = 'listing' | 'host' | 'guest';

export interface Review {
  id: string;
  bookingId: string;
  reviewerId: string;
  revieweeId: string;
  target: ReviewTarget;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer?: { id: string; fullName: string; avatarUrl?: string };
  reviewee?: { id: string; fullName: string; avatarUrl?: string };
  booking?: { id: string; listing: { id: string; title: string } };
}

export interface CreateReviewRequest {
  bookingId: string;
  target: ReviewTarget;
  rating: number;
  comment?: string;
}

export interface ReviewQueryParams {
  page?: number;
  limit?: number;
  target?: ReviewTarget;
  revieweeId?: string;
  bookingId?: string;
}

export interface PaginatedReviews {
  data: Review[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface RatingSummary {
  averageRating: number;
  totalReviews: number;
  breakdown: { star: number; count: number }[];
}