import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BookingsService } from '../../core/services/bookings.service';
import { AuthService } from '../../core/services/auth.service';
import { Booking, PaymentGateway, Payment } from '../../core/models/booking.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-booking-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Back Link -->
        <a routerLink="/trips" class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to trips
        </a>

        @if (isLoading()) {
          <app-card class="animate-pulse">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
          </app-card>
        } @else if (!booking()) {
          <app-card class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Booking not found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-4">This booking may have been removed or is no longer available.</p>
            <a routerLink="/trips" appButton variant="primary">Back to trips</a>
          </app-card>
        } @else {
          <!-- Header -->
          <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
            <div>
              <div class="flex items-center gap-3 mb-2">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Booking #{{ booking()!.id.slice(0, 8) }}</h1>
                <app-badge [variant]="getStatusBadgeVariant(booking()!.status)">{{ booking()!.status }}</app-badge>
              </div>
              <p class="text-gray-600 dark:text-gray-400">Created {{ formatDateTime(booking()!.createdAt) }}</p>
            </div>
            <div class="flex gap-3">
              @if (showCancelButton()) {
                <button appButton variant="danger" (click)="cancelBooking()" [loading]="isCancelling()">Cancel booking</button>
              }
              <a [routerLink]="['/messages', booking()!.id]" appButton variant="outline">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                Message
              </a>
            </div>
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left: Details -->
            <div class="lg:col-span-2 space-y-6">
              <!-- Listing Card -->
              <app-card>
                <div slot="header">
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Stay details</h2>
                </div>
                <div class="flex flex-col sm:flex-row gap-4">
                  <a [routerLink]="['/listings', booking()!.listingId]" class="flex-shrink-0">
                    <img
                      [src]="booking()!.listing?.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'"
                      [alt]="booking()!.listing?.title"
                      class="w-full sm:w-32 h-32 rounded-lg object-cover"
                    />
                  </a>
                  <div class="flex-1">
                    <a [routerLink]="['/listings', booking()!.listingId]" class="group">
                      <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                        {{ booking()!.listing?.title }}
                      </h3>
                    </a>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ booking()!.listing?.city }}</p>

                    <div class="mt-4 grid grid-cols-2 gap-4">
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Check-in</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ formatDate(booking()!.checkIn) }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ getDayName(booking()!.checkIn) }}</p>
                      </div>
                      <div>
                        <p class="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wide">Check-out</p>
                        <p class="text-sm font-medium text-gray-900 dark:text-white mt-1">{{ formatDate(booking()!.checkOut) }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ getDayName(booking()!.checkOut) }}</p>
                      </div>
                    </div>

                    <div class="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p class="text-sm text-gray-600 dark:text-gray-400">
                        {{ booking()!.guestsCount }} {{ booking()!.guestsCount === 1 ? 'guest' : 'guests' }} ·
                        {{ booking()!.nights }} {{ booking()!.nights === 1 ? 'night' : 'nights' }}
                      </p>
                    </div>
                  </div>
                </div>
              </app-card>

              <!-- Host/Guest Info -->
              @if (isHostView()) {
                <app-card>
                  <div slot="header">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Guest information</h2>
                  </div>
                  <div class="flex items-center gap-4">
                    <img
                      [src]="booking()!.guest?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (booking()!.guest?.fullName || 'Guest') + '&background=059669&color=fff'"
                      [alt]="booking()!.guest?.fullName || 'Guest'"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div class="flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">{{ booking()!.guest?.fullName }}</p>
                      @if (booking()!.guest?.phone) {
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ booking()!.guest?.phone }}</p>
                      }
                    </div>
                    @if (booking()!.guest?.phone) {
                      <a [href]="'tel:' + booking()!.guest?.phone" appButton variant="outline" size="sm">Call guest</a>
                    }
                  </div>
                </app-card>
              } @else {
                <app-card>
                  <div slot="header">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Host information</h2>
                  </div>
                  <div class="flex items-center gap-4">
                    <img
                      [src]="booking()!.listing?.host?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (booking()!.listing?.host?.fullName || 'Host') + '&background=059669&color=fff'"
                      [alt]="booking()!.listing?.host?.fullName || 'Host'"
                      class="w-12 h-12 rounded-full object-cover"
                    />
                    <div class="flex-1">
                      <p class="font-medium text-gray-900 dark:text-white">{{ booking()!.listing?.host?.fullName }}</p>
                      @if (booking()!.listing?.host?.phone) {
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ booking()!.listing?.host?.phone }}</p>
                      }
                    </div>
                    @if (booking()!.listing?.host?.phone) {
                      <a [href]="'tel:' + booking()!.listing?.host?.phone" appButton variant="outline" size="sm">Call host</a>
                    }
                  </div>
                </app-card>
              }

              <!-- Payments -->
              @if (booking()!.payments && booking()!.payments!.length > 0) {
                <app-card>
                  <div slot="header">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Payment history</h2>
                  </div>
                  <div class="space-y-3">
                    @for (payment of booking()!.payments; track payment.id) {
                      <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                        <div>
                          <p class="font-medium text-gray-900 dark:text-white capitalize">{{ payment.gateway }}</p>
                          <p class="text-xs text-gray-500 dark:text-gray-400">{{ formatDateTime(payment.createdAt) }}</p>
                        </div>
                        <div class="text-right">
                          <p class="font-semibold text-gray-900 dark:text-white">Rs {{ payment.amount.toLocaleString() }}</p>
                          <app-badge [variant]="getPaymentBadgeVariant(payment.status)">{{ payment.status }}</app-badge>
                        </div>
                      </div>
                    }
                  </div>
                </app-card>
              }
            </div>

            <!-- Right: Summary & Actions -->
            <div class="lg:col-span-1">
              <div class="sticky top-24 space-y-6">
                <!-- Price Summary -->
                <app-card>
                  <div slot="header">
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Price summary</h2>
                  </div>
                  <div class="space-y-3">
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Rs {{ booking()!.baseAmount / booking()!.nights | number:'1.0-0' }} × {{ booking()!.nights }} {{ booking()!.nights === 1 ? 'night' : 'nights' }}</span>
                      <span class="text-gray-900 dark:text-white">Rs {{ booking()!.baseAmount.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between text-sm">
                      <span class="text-gray-600 dark:text-gray-400">Service fee</span>
                      <span class="text-gray-900 dark:text-white">Rs {{ booking()!.serviceFee.toLocaleString() }}</span>
                    </div>
                    <div class="flex justify-between font-semibold pt-3 border-t border-gray-200 dark:border-gray-700">
                      <span class="text-gray-900 dark:text-white">Total</span>
                      <span class="text-gray-900 dark:text-white">Rs {{ booking()!.totalAmount.toLocaleString() }}</span>
                    </div>
                  </div>
                </app-card>

                <!-- Payment Action -->
                @if (booking()!.paymentStatus === 'unpaid' && !isHostView()) {
                  <app-card>
                    <div slot="header">
                      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Complete payment</h2>
                    </div>

                    @if (showPaymentForm()) {
                      <div class="space-y-4">
                        <div>
                          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select payment method</label>
                          <div class="space-y-2">
                            @for (gateway of gateways; track gateway.value) {
                              <label class="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-lg cursor-pointer hover:border-emerald-500 transition-colors"
                                [class.border-emerald-500]="selectedGateway() === gateway.value"
                                [class.bg-emerald-50]="selectedGateway() === gateway.value"
                                [class.dark:bg-emerald-900/20]="selectedGateway() === gateway.value">
                                <input type="radio" [value]="gateway.value" (change)="selectedGateway.set(gateway.value)" [checked]="selectedGateway() === gateway.value" class="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500">
                                <span class="ml-3 flex-1">
                                  <span class="block text-sm font-medium text-gray-900 dark:text-white">{{ gateway.label }}</span>
                                  <span class="block text-xs text-gray-500 dark:text-gray-400">{{ gateway.description }}</span>
                                </span>
                              </label>
                            }
                          </div>
                        </div>

                        @if (paymentError()) {
                          <div class="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert">
                            {{ paymentError() }}
                          </div>
                        }

                        <button appButton variant="primary" size="lg" class="w-full" [loading]="isPaying()" (click)="initiatePayment()">
                          Pay Rs {{ booking()!.totalAmount.toLocaleString() }}
                        </button>
                        <button appButton variant="ghost" size="sm" class="w-full" (click)="showPaymentForm.set(false)">Cancel</button>
                      </div>
                    } @else {
                      <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">Complete your payment to confirm this booking.</p>
                      <button appButton variant="primary" size="lg" class="w-full" (click)="showPaymentForm.set(true)">
                        Pay now
                      </button>
                    }
                  </app-card>
                } @else if (booking()!.paymentStatus === 'paid') {
                  <app-card>
                    <div slot="header" class="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      <h2 class="text-lg font-semibold">Payment complete</h2>
                    </div>
                    <p class="text-sm text-gray-600 dark:text-gray-400">Your payment has been processed successfully.</p>
                  </app-card>
                } @else if (isHostView()) {
                  <app-card>
                    <div slot="header">
                      <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Host actions</h2>
                    </div>
                    <div class="space-y-3">
                      @if (booking()!.status === 'pending') {
                        <button appButton variant="primary" size="lg" class="w-full" (click)="confirmBooking()" [loading]="isConfirming()">Confirm booking</button>
                      }
                      @if (showContactGuest()) {
                        <a [routerLink]="['/messages', booking()!.id]" appButton variant="outline" size="lg" class="w-full">Contact guest</a>
                      }
                    </div>
                  </app-card>
                }
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
})
export class BookingDetailComponent implements OnInit {
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  booking = signal<Booking | null>(null);
  isLoading = signal(true);
  isCancelling = signal(false);
  isConfirming = signal(false);
  isPaying = signal(false);
  showPaymentForm = signal(false);
  paymentError = signal('');
  selectedGateway = signal<PaymentGateway>('jazzcash');

  gateways: { value: PaymentGateway; label: string; description: string }[] = [
    { value: 'jazzcash', label: 'JazzCash', description: 'Mobile wallet · Instant' },
    { value: 'easypaisa', label: 'EasyPaisa', description: 'Mobile wallet · Instant' },
    { value: 'safepay', label: 'SafePay', description: 'Card payments · Secure' },
  ];

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadBooking(id);
      }
    });
  }

  loadBooking(id: string) {
    this.isLoading.set(true);
    this.bookingsService.getById(id).subscribe({
      next: (booking) => {
        this.booking.set(booking);
        this.isLoading.set(false);
      },
      error: () => {
        this.booking.set(null);
        this.isLoading.set(false);
      },
    });
  }

  isHostView = computed(() => {
    const user = this.authService.currentUser();
    return !!user && !!this.booking() && this.booking()!.listing?.host?.id === user.id;
  });

  showCancelButton = computed(() => {
    const booking = this.booking();
    if (!booking) return false;
    return booking.status === 'pending' || booking.status === 'confirmed';
  });

  showContactGuest = computed(() => {
    const booking = this.booking();
    if (!booking) return false;
    return booking.status === 'confirmed' || booking.status === 'completed';
  });

  async cancelBooking() {
    const booking = this.booking();
    if (!booking) return;

    if (!confirm('Are you sure you want to cancel this booking? This action cannot be undone.')) return;

    this.isCancelling.set(true);
    try {
      const reason = prompt('Cancellation reason (optional):') || undefined;
      await this.bookingsService.update(booking.id, { status: 'cancelled', cancelReason: reason }).toPromise();
      this.loadBooking(booking.id);
    } catch (err: any) {
      alert(err.error?.message || 'Failed to cancel booking');
    } finally {
      this.isCancelling.set(false);
    }
  }

  async confirmBooking() {
    const booking = this.booking();
    if (!booking) return;

    this.isConfirming.set(true);
    try {
      await this.bookingsService.update(booking.id, { status: 'confirmed' }).toPromise();
      this.loadBooking(booking.id);
    } catch (err: any) {
      alert(err.error?.message || 'Failed to confirm booking');
    } finally {
      this.isConfirming.set(false);
    }
  }

  async initiatePayment() {
    const booking = this.booking();
    if (!booking) return;

    this.isPaying.set(true);
    this.paymentError.set('');

    try {
      const response = await this.bookingsService.initiatePayment(booking.id, {
        gateway: this.selectedGateway(),
      }).toPromise() as any;

      // Redirect to gateway
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        this.paymentError.set('Payment URL not received');
        this.isPaying.set(false);
      }
    } catch (err: any) {
      this.paymentError.set(err.error?.message || 'Failed to initiate payment');
      this.isPaying.set(false);
    }
  }

  getStatusBadgeVariant(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  }

  getPaymentBadgeVariant(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (status) {
      case 'success': return 'success';
      case 'initiated': return 'warning';
      case 'failed': return 'danger';
      case 'refunded': return 'info';
      default: return 'default';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  formatDateTime(dateStr: string): string {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  getDayName(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { weekday: 'long' });
  }
}