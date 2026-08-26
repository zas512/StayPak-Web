export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';
export type BookingPaymentStatus = 'unpaid' | 'paid' | 'refunded';
export type PaymentGateway = 'jazzcash' | 'easypaisa' | 'safepay';
export type PaymentRecordStatus = 'initiated' | 'success' | 'failed' | 'refunded';

export interface Booking {
  id: string;
  listingId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
  nights: number;
  baseAmount: number;
  serviceFee: number;
  totalAmount: number;
  status: BookingStatus;
  paymentStatus: BookingPaymentStatus;
  cancelReason?: string;
  createdAt: string;
  updatedAt: string;
  listing?: {
    id: string;
    title: string;
    city: string;
    photos: { cdnUrl: string; isCover: boolean }[];
    host: { id: string; fullName: string; avatarUrl?: string; phone: string; email: string };
  };
  guest?: { id: string; fullName: string; avatarUrl?: string; phone: string; email: string };
  payments?: Payment[];
  messages?: Message[];
  reviews?: Review[];
}

export interface CreateBookingRequest {
  listingId: string;
  checkIn: string;
  checkOut: string;
  guestsCount: number;
}

export interface UpdateBookingRequest {
  status?: BookingStatus;
  cancelReason?: string;
}

export interface BookingQueryParams {
  page?: number;
  limit?: number;
  status?: BookingStatus;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedBookings {
  data: Booking[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface Payment {
  id: string;
  bookingId: string;
  gateway: PaymentGateway;
  gatewayRef?: string;
  amount: number;
  currency: string;
  status: PaymentRecordStatus;
  gatewayResponse?: any;
  createdAt: string;
  updatedAt: string;
}

export interface InitiatePaymentRequest {
  gateway: PaymentGateway;
}

export interface PaymentCallbackRequest {
  gatewayRef: string;
  status: 'success' | 'failed';
  gatewayResponse?: any;
}

export interface Message {
  id: string;
  bookingId: string;
  senderId: string;
  body: string;
  isRead: boolean;
  sentAt: string;
  sender?: { id: string; fullName: string; avatarUrl?: string };
  booking?: { id: string; listing: { id: string; title: string } };
}

export interface CreateMessageRequest {
  bookingId: string;
  body: string;
}

export interface MessageQueryParams {
  page?: number;
  limit?: number;
  bookingId?: string;
}

export interface Conversation {
  bookingId: string;
  listing: { id: string; title: string; photos: { cdnUrl: string; isCover: boolean }[] };
  otherUser: { id: string; fullName: string; avatarUrl?: string };
  lastMessage?: Message;
  unreadCount: number;
}