import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import {
  Booking,
  CreateBookingRequest,
  UpdateBookingRequest,
  BookingQueryParams,
  PaginatedBookings,
  InitiatePaymentRequest,
  Conversation,
  CreateMessageRequest,
} from '../models/booking.model';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookingsService {
  constructor(private api: ApiService) {}

  getAll(params: BookingQueryParams = {}): Observable<PaginatedBookings> {
    return this.api.get<PaginatedBookings>('/bookings', params);
  }

  getById(id: string): Observable<Booking> {
    return this.api.get<Booking>(`/bookings/${id}`);
  }

  create(data: CreateBookingRequest): Observable<Booking> {
    return this.api.post<Booking>('/bookings', data);
  }

  update(id: string, data: UpdateBookingRequest): Observable<Booking> {
    return this.api.patch<Booking>(`/bookings/${id}`, data);
  }

  initiatePayment(bookingId: string, data: InitiatePaymentRequest): Observable<{ paymentId: string; paymentUrl: string; gateway: string }> {
    return this.api.post(`/bookings/${bookingId}/payment`, data);
  }

  getConversations(): Observable<Conversation[]> {
    return this.api.get<Conversation[]>('/messages/conversations');
  }

  getMessages(bookingId: string, page = 1, limit = 50): Observable<any> {
    return this.api.get(`/messages`, { bookingId, page, limit });
  }

  sendMessage(data: CreateMessageRequest): Observable<any> {
    return this.api.post('/messages', data);
  }

  markAsRead(messageId: string): Observable<any> {
    return this.api.patch(`/messages/${messageId}/read`, {});
  }

  getUnreadCount(): Observable<{ unreadCount: number }> {
    return this.api.get('/messages/unread-count');
  }
}