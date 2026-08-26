import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingsService } from '../../core/services/bookings.service';
import { Booking, BookingStatus } from '../../core/models/booking.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';
import { InputComponent } from '../../shared/ui/input.component';

@Component({
  selector: 'app-host-bookings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, CardComponent, BadgeComponent, InputComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Manage bookings</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">View and manage booking requests for your listings</p>
          </div>
        </div>

        @if (isLoading()) {
          <!-- Loading skeleton -->
          <div class="space-y-4">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse flex items-center gap-4">
                <div class="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700"></div>
                <div class="flex-1">
                  <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2"></div>
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                </div>
              </div>
            }
          </div>
        } @else {
          <!-- Filter Tabs -->
          <div class="flex flex-wrap gap-2 mb-6" role="tablist">
            @for (status of bookingStatuses; track status) {
              <button
                role="tab"
                [attr.aria-selected]="currentFilter() === status"
                (click)="currentFilter.set(status)"
                [class.bg-emerald-50]="currentFilter() === status"
                [class.text-emerald-700]="currentFilter() === status"
                [class.border-emerald-500]="currentFilter() === status"
                class="px-4 py-2 text-sm font-medium border border-gray-200 dark:border-gray-600 rounded-lg transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                {{ getStatusLabel(status) }}
                <span class="ml-2 px-2 py-0.5 text-xs bg-gray-100 dark:bg-gray-700 rounded-full"
                  [class.bg-emerald-100]="currentFilter() === status"
                  [class.text-emerald-700]="currentFilter() === status"
                  [class.dark:bg-emerald-900/30]="currentFilter() === status"
                  [class.dark:text-emerald-400]="currentFilter() === status">
                  {{ getFilterCount(status) }}
                </span>
              </button>
            }
          </div>

          @if (filteredBookings().length === 0) {
            <app-card class="text-center py-16">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No bookings found</h3>
              <p class="text-gray-600 dark:text-gray-400">{{ getEmptyStateMessage() }}</p>
            </app-card>
          } @else {
            <div class="space-y-4">
              @for (booking of filteredBookings(); track booking.id) {
                <app-card class="p-0 overflow-hidden">
                  <div class="flex flex-col sm:flex-row">
                    <!-- Listing Thumbnail -->
                    <div class="relative w-full sm:w-40 sm:h-40 flex-shrink-0">
                      <img
                        [src]="booking.listing?.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'"
                        [alt]="booking.listing?.title"
                        class="w-full h-full object-cover"
                      />
                    </div>

                    <!-- Booking Details -->
                    <div class="flex-1 p-4 sm:p-6 space-y-3">
                      <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <h3 class="font-semibold text-gray-900 dark:text-white">{{ booking.listing?.title }}</h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400">{{ booking.listing?.city }}</p>
                        </div>
                        <app-badge [variant]="getStatusBadge(booking.status)" class="whitespace-nowrap">{{ booking.status }}</app-badge>
                      </div>

                      <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p class="text-gray-500 dark:text-gray-400">Check-in</p>
                          <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(booking.checkIn) }}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 dark:text-gray-400">Check-out</p>
                          <p class="font-medium text-gray-900 dark:text-white">{{ formatDate(booking.checkOut) }}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 dark:text-gray-400">Guests</p>
                          <p class="font-medium text-gray-900 dark:text-white">{{ booking.guestsCount }}</p>
                        </div>
                        <div>
                          <p class="text-gray-500 dark:text-gray-400">Nights</p>
                          <p class="font-medium text-gray-900 dark:text-white">{{ booking.nights }}</p>
                        </div>
                      </div>

                      <div class="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-gray-100 dark:border-gray-700">
                        <div class="flex items-center gap-4 text-sm">
                          <span class="text-gray-500 dark:text-gray-400">Guest:</span>
                          <span class="font-medium text-gray-900 dark:text-white">{{ booking.guest?.fullName }}</span>
                        </div>
                        <div class="flex items-center gap-4 text-sm">
                          <span class="text-gray-500 dark:text-gray-400">Payment:</span>
                          <app-badge [variant]="getPaymentBadge(booking.paymentStatus)">{{ booking.paymentStatus }}</app-badge>
                        </div>
                        <div class="text-right">
                          <p class="text-sm text-gray-500 dark:text-gray-400">Total</p>
                          <p class="font-bold text-lg text-gray-900 dark:text-white">Rs {{ booking.totalAmount.toLocaleString() }}</p>
                        </div>
                      </div>

                      <!-- Actions for pending bookings -->
                      @if (booking.status === 'pending') {
                        <div class="flex items-center gap-3 pt-2">
                          <button
                            appButton
                            variant="success"
                            size="sm"
                            (click)="updateBookingStatus(booking.id, 'confirmed')"
                            [disabled]="isUpdating(booking.id)">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                            Confirm
                          </button>
                          <button
                            appButton
                            variant="danger"
                            size="sm"
                            (click)="openCancelModal(booking)"
                            [disabled]="isUpdating(booking.id)">
                            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                            Decline
                          </button>
                          <a [routerLink]="['/bookings', booking.id]" appButton variant="outline" size="sm">View details</a>
                        </div>
                      } @else if (booking.status === 'confirmed' || booking.status === 'completed') {
                        <div class="flex items-center gap-3 pt-2">
                          @if (booking.status === 'confirmed') {
                            <button
                              appButton
                              variant="outline"
                              size="sm"
                              (click)="updateBookingStatus(booking.id, 'completed')"
                              [disabled]="isUpdating(booking.id)">
                              Mark completed
                            </button>
                          }
                          <a [routerLink]="['/bookings', booking.id]" appButton variant="outline" size="sm">View details</a>
                          @if (booking.guest?.phone) {
                            <a [href]="'tel:' + booking.guest.phone" appButton variant="ghost" size="sm">
                              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                              </svg>
                            </a>
                          }
                        </div>
                      } @else {
                        <div class="flex items-center gap-3 pt-2">
                          <a [routerLink]="['/bookings', booking.id]" appButton variant="outline" size="sm">View details</a>
                        </div>
                      }
                    </div>
                  </div>
                </app-card>
              }
            </div>

            <!-- Pagination -->
            @if (totalPages() > 1) {
              <nav class="mt-8 flex items-center justify-center gap-2" aria-label="Pagination">
                <button
                  appButton
                  variant="outline"
                  size="sm"
                  (click)="goToPage(currentPage() - 1)"
                  [disabled]="currentPage() === 1"
                  aria-label="Previous page">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                  </svg>
                </button>
                @for (page of visiblePages(); track page) {
                  <button
                    appButton
                    [variant]="page === currentPage() ? 'primary' : 'outline'"
                    size="sm"
                    (click)="goToPage(page)"
                    [attr.aria-current]="page === currentPage() ? 'page' : null">
                    {{ page }}
                  </button>
                }
                <button
                  appButton
                  variant="outline"
                  size="sm"
                  (click)="goToPage(currentPage() + 1)"
                  [disabled]="currentPage() === totalPages()"
                  aria-label="Next page">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </button>
              </nav>
            }
          }
        }
      </div>

      <!-- Cancel Modal -->
      @if (cancelBooking()) {
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" (click)="closeCancelModal()">
          <div class="bg-white dark:bg-gray-800 rounded-xl max-w-md w-full p-6" (click)="$event.stopPropagation()">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Decline booking</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to decline this booking request from <strong>{{ cancelBooking()?.guest?.fullName }}</strong>?
              The guest will be notified and the dates will become available again.
            </p>
            <label class="block mb-4">
              <span class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Reason (optional)</span>
              <textarea
                [(ngModel)]="cancelReason"
                rows="3"
                placeholder="Let the guest know why..."
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              ></textarea>
            </label>
            <div class="flex justify-end gap-3">
              <button appButton variant="outline" (click)="closeCancelModal()">Cancel</button>
              <button appButton variant="danger" (click)="confirmCancel()" [disabled]="isUpdating(cancelBooking()!.id)">
                Decline booking
              </button>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class HostBookingsComponent implements OnInit {
  private bookingsService = inject(BookingsService);
  private router = inject(Router);

  allBookings = signal<Booking[]>([]);
  isLoading = signal(true);
  currentPage = signal(1);
  limit = 10;
  totalPages = signal(1);
  updatingIds = signal<string[]>([]);

  currentFilter = signal<BookingStatus | 'all'>('all');
  cancelBooking = signal<Booking | null>(null);
  cancelReason = '';

  bookingStatuses: (BookingStatus | 'all')[] = ['all', 'pending', 'confirmed', 'cancelled', 'completed'];

  filteredBookings = computed(() => {
    const filter = this.currentFilter();
    const bookings = this.allBookings();
    if (filter === 'all') return bookings;
    return bookings.filter((b) => b.status === filter);
  });

  ngOnInit() {
    this.loadBookings();
  }

  loadBookings(page = 1) {
    this.isLoading.set(true);
    this.currentPage.set(page);
    this.bookingsService.getAll({ page, limit: this.limit, status: this.currentFilter() === 'all' ? undefined : this.currentFilter() }).subscribe({
      next: (response) => {
        this.allBookings.set(response.data);
        this.totalPages.set(response.meta.totalPages);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.loadBookings(page);
  }

  visiblePages = computed(() => {
    const pages: number[] = [];
    const current = this.currentPage();
    const total = this.totalPages();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1);
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push(-1);
      pages.push(total);
    }
    return pages;
  });

  isUpdating(id: string): boolean {
    return this.updatingIds().includes(id);
  }

  getFilterCount(status: BookingStatus | 'all'): number {
    if (status === 'all') return this.allBookings().length;
    return this.allBookings().filter((b) => b.status === status).length;
  }

  getStatusLabel(status: BookingStatus | 'all'): string {
    const labels: Record<string, string> = {
      all: 'All',
      pending: 'Pending',
      confirmed: 'Confirmed',
      cancelled: 'Cancelled',
      completed: 'Completed',
    };
    return labels[status];
  }

  getStatusBadge(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  }

  getPaymentBadge(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (status) {
      case 'paid': return 'success';
      case 'unpaid': return 'warning';
      case 'refunded': return 'info';
      default: return 'default';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  async updateBookingStatus(bookingId: string, status: BookingStatus) {
    if (this.isUpdating(bookingId)) return;

    this.updatingIds.update((ids) => [...ids, bookingId]);

    try {
      await this.bookingsService.update(bookingId, { status }).toPromise();
      this.allBookings.update((bookings) =>
        bookings.map((b) => (b.id === bookingId ? { ...b, status } : b))
      );
    } catch (err: any) {
      alert(err.error?.message || 'Failed to update booking status.');
    } finally {
      this.updatingIds.update((ids) => ids.filter((id) => id !== bookingId));
    }
  }

  openCancelModal(booking: Booking) {
    this.cancelBooking.set(booking);
    this.cancelReason = '';
  }

  closeCancelModal() {
    this.cancelBooking.set(null);
    this.cancelReason = '';
  }

  async confirmCancel() {
    const booking = this.cancelBooking();
    if (!booking) return;

    this.updatingIds.update((ids) => [...ids, booking.id]);

    try {
      await this.bookingsService.update(booking.id, { status: 'cancelled', cancelReason: this.cancelReason }).toPromise();
      this.allBookings.update((bookings) =>
        bookings.map((b) => (b.id === booking.id ? { ...b, status: 'cancelled' as BookingStatus, cancelReason: this.cancelReason } : b))
      );
      this.closeCancelModal();
    } catch (err: any) {
      alert(err.error?.message || 'Failed to cancel booking.');
    } finally {
      this.updatingIds.update((ids) => ids.filter((id) => id !== booking.id));
    }
  }

  getEmptyStateMessage(): string {
    const filter = this.currentFilter();
    const messages: Record<string, string> = {
      all: 'No bookings yet. When guests book your listings, they\'ll appear here.',
      pending: 'No pending booking requests.',
      confirmed: 'No confirmed bookings.',
      cancelled: 'No cancelled bookings.',
      completed: 'No completed bookings yet.',
    };
    return messages[filter] || 'No bookings found.';
  }
}