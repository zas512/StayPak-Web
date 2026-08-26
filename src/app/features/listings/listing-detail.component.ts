import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';
import { BookingsService } from '../../core/services/bookings.service';
import { AuthService } from '../../core/services/auth.service';
import { Listing } from '../../core/models/listing.model';
import { Booking } from '../../core/models/booking.model';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-listing-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Back Button -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <a routerLink="/listings" class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to listings
        </a>
      </div>

      @if (isLoading()) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="animate-pulse">
            <div class="aspect-[21/9] bg-gray-200 dark:bg-gray-700 rounded-2xl mb-8"></div>
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-8"></div>
            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div class="lg:col-span-2 space-y-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"></div>
              </div>
              <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      } @else if (!listing()) {
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Listing not found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">This listing may have been removed or is no longer available.</p>
          <button appButton variant="primary" routerLink="/listings">Browse listings</button>
        </div>
      } @else {
        <!-- Photo Gallery -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div class="relative rounded-2xl overflow-hidden">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-2 h-[60vh]">
              <!-- Main photo -->
              <div class="md:col-span-2 md:row-span-2 h-full">
                <img
                  [src]="selectedPhoto() || listing()!.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200'"
                  [alt]="listing()!.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <!-- Thumbnails -->
              @for (photo of (listing()!.photos || []).slice(0, 4); track photo.id; let i = $index) {
                <div class="hidden md:block h-full cursor-pointer overflow-hidden" (click)="selectPhoto(photo.cdnUrl)">
                  <img
                    [src]="photo.cdnUrl"
                    [alt]="photo.id"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-200"
                    [class.ring-2]="selectedPhoto() === photo.cdnUrl"
                    [class.ring-emerald-500]="selectedPhoto() === photo.cdnUrl"
                  />
                </div>
              }
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <!-- Left: Details -->
            <div class="lg:col-span-2 space-y-8">
              <!-- Header -->
              <div>
                <div class="flex items-start justify-between flex-wrap gap-4">
                  <div>
                    <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">{{ listing()!.title }}</h1>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ listing()!.city }}{{ listing()!.area ? ', ' + listing()!.area : '' }}
                    </p>
                  </div>
                  <div class="flex items-center gap-2">
                    @if (listing()!.instantBook) {
                      <app-badge variant="success">Instant Book</app-badge>
                    }
                    @if (listing()!.status === 'active' && listing()!.host?.cnicStatus === 'verified') {
                      <app-badge variant="info">Verified Host</app-badge>
                    }
                  </div>
                </div>

                <!-- Host Info -->
                <div class="flex items-center gap-4 mt-4 py-4 border-b border-gray-200 dark:border-gray-700">
                  <img
                    [src]="listing()!.host?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (listing()!.host?.fullName || 'Host')"
                    [alt]="listing()!.host?.fullName || 'Host'"
                    class="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p class="font-medium text-gray-900 dark:text-white">Hosted by {{ listing()!.host?.fullName || 'StayPak Host' }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">
                      {{ listing()!.maxGuests }} guests · {{ listing()!.bedrooms }} bedrooms · {{ listing()!.bathrooms }} bathrooms
                    </p>
                  </div>
                </div>
              </div>

              <!-- Description -->
              <div>
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">About this place</h2>
                <p class="text-gray-700 dark:text-gray-300 leading-relaxed">{{ listing()!.description || 'No description provided.' }}</p>
              </div>

              <!-- Amenities -->
              @if (listing()!.amenities?.length) {
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">What this place offers</h2>
                  <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    @for (amenity of listing()!.amenities; track amenity) {
                      <div class="flex items-center gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-100 dark:border-gray-700">
                        <svg class="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                        </svg>
                        <span class="text-sm text-gray-700 dark:text-gray-300 capitalize">{{ amenity.replace(/_/g, ' ') }}</span>
                      </div>
                    }
                  </div>
                </div>
              }

              <!-- Location -->
              @if (listing()!.address) {
                <div>
                  <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-3">Location</h2>
                  <div class="p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700">
                    <p class="text-gray-700 dark:text-gray-300">{{ listing()!.address }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ listing()!.city }}{{ listing()!.area ? ', ' + listing()!.area : '' }}</p>
                  </div>
                </div>
              }
            </div>

            <!-- Right: Booking Widget -->
            <div class="lg:col-span-1">
              <div class="sticky top-24">
                <app-card>
                  <div slot="header">
                    <div class="flex items-baseline justify-between">
                      <div>
                        <span class="text-2xl font-bold text-gray-900 dark:text-white">Rs {{ listing()!.pricePerNight.toLocaleString() }}</span>
                        <span class="text-gray-500 dark:text-gray-400 ml-1 text-sm">/ night</span>
                      </div>
                      @if (listing()!.status === 'active' && listing()!.host?.cnicStatus === 'verified') {
                        <span class="inline-flex items-center text-sm text-emerald-600 dark:text-emerald-400">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path></svg>
                          Verified
                        </span>
                      }
                    </div>
                  </div>

                  <form (ngSubmit)="onSubmit()" class="space-y-4" #bookingForm="ngForm">
                    <!-- Date Selection -->
                    <div class="grid grid-cols-2 gap-2">
                      <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Check-in</label>
                        <input
                          type="date"
                          [(ngModel)]="checkIn"
                          name="checkIn"
                          [min]="today"
                          (change)="onDateChange()"
                          required
                          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                      </div>
                      <div>
                        <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Check-out</label>
                        <input
                          type="date"
                          [(ngModel)]="checkOut"
                          name="checkOut"
                          [min]="tomorrow"
                          (change)="onDateChange()"
                          required
                          class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                      </div>
                    </div>

                    <!-- Guests -->
                    <div>
                      <label class="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">Guests</label>
                      <select
                        [(ngModel)]="guests"
                        name="guests"
                        (change)="onDateChange()"
                        required
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                        @for (i of [1,2,3,4,5,6,7,8]; track i) {
                          <option [value]="i" [disabled]="i > listing()!.maxGuests">{{ i }} {{ i === 1 ? 'guest' : 'guests' }}</option>
                        }
                      </select>
                    </div>

                    <!-- Price Breakdown -->
                    @if (nights() > 0) {
                      <div class="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600 dark:text-gray-400">
                            Rs {{ listing()!.pricePerNight.toLocaleString() }} × {{ nights() }} {{ nights() === 1 ? 'night' : 'nights' }}
                          </span>
                          <span class="text-gray-900 dark:text-white">Rs {{ (listing()!.pricePerNight * nights()).toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between text-sm">
                          <span class="text-gray-600 dark:text-gray-400">Service fee</span>
                          <span class="text-gray-900 dark:text-white">Rs {{ serviceFee().toLocaleString() }}</span>
                        </div>
                        <div class="flex justify-between font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
                          <span class="text-gray-900 dark:text-white">Total</span>
                          <span class="text-gray-900 dark:text-white">Rs {{ totalAmount().toLocaleString() }}</span>
                        </div>
                      </div>
                    }

                    <!-- Action Button -->
                    @if (!authService.currentUser()) {
                      <button appButton variant="primary" size="lg" class="w-full" routerLink="/auth/login">
                        Sign in to book
                      </button>
                    } @else if (isOwnListing()) {
                      <button appButton variant="outline" size="lg" class="w-full" disabled>
                        This is your listing
                      </button>
                    } @else if (bookingError()) {
                      <div class="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm text-center" role="alert">
                        {{ bookingError() }}
                      </div>
                      <button appButton variant="primary" size="lg" class="w-full" [loading]="isBooking()" [disabled]="bookingForm.invalid || nights() === 0" type="submit">
                        {{ listing()!.instantBook ? 'Reserve now' : 'Request to book' }}
                      </button>
                    } @else {
                      <button appButton variant="primary" size="lg" class="w-full" [loading]="isBooking()" [disabled]="bookingForm.invalid || nights() === 0" type="submit">
                        {{ listing()!.instantBook ? 'Reserve now' : 'Request to book' }}
                      </button>
                    }

                    <p class="text-center text-xs text-gray-500 dark:text-gray-400">You won't be charged yet</p>
                  </form>
                </app-card>

                <!-- Host Actions -->
                @if (isOwnListing()) {
                  <div class="mt-4 text-center">
                    <a [routerLink]="['/host/listings', listing()!.id, 'edit']" appButton variant="outline" size="sm" class="w-full">
                      Edit listing
                    </a>
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ListingDetailComponent implements OnInit {
  private listingsService = inject(ListingsService);
  private bookingsService = inject(BookingsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  authService = inject(AuthService);

  listing = signal<Listing | null>(null);
  isLoading = signal(true);
  isBooking = signal(false);
  bookingError = signal('');

  selectedPhoto = signal<string | null>(null);
  checkIn = '';
  checkOut = '';
  guests = 1;

  today = new Date().toISOString().split('T')[0];
  tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  nights = computed(() => {
    if (!this.checkIn || !this.checkOut) return 0;
    const ci = new Date(this.checkIn);
    const co = new Date(this.checkOut);
    const diff = co.getTime() - ci.getTime();
    return diff > 0 ? Math.ceil(diff / 86400000) : 0;
  });

  serviceFee = computed(() => {
    if (!this.listing() || this.nights() === 0) return 0;
    const base = this.listing()!.pricePerNight * this.nights();
    const fee = base * 0.1;
    return Math.min(5000, Math.max(500, Math.round(fee)));
  });

  totalAmount = computed(() => {
    if (!this.listing()) return 0;
    return this.listing()!.pricePerNight * this.nights() + this.serviceFee();
  });

  isOwnListing = computed(() => {
    const user = this.authService.currentUser();
    return !!user && !!this.listing() && this.listing()!.hostId === user.id;
  });

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadListing(id);
      }
    });
  }

  loadListing(id: string) {
    this.isLoading.set(true);
    this.listingsService.getById(id).subscribe({
      next: (listing) => {
        this.listing.set(listing);
        this.isLoading.set(false);
      },
      error: () => {
        this.listing.set(null);
        this.isLoading.set(false);
      },
    });
  }

  selectPhoto(url: string) {
    this.selectedPhoto.set(url);
  }

  onDateChange() {
    if (this.checkIn && this.checkOut) {
      const ci = new Date(this.checkIn);
      const co = new Date(this.checkOut);
      if (co <= ci) {
        this.bookingError.set('Check-out must be after check-in');
      } else {
        this.bookingError.set('');
      }
    }
  }

  async onSubmit() {
    if (!this.listing() || this.nights() === 0) return;
    if (this.bookingError()) return;

    this.isBooking.set(true);
    this.bookingError.set('');

    try {
      const booking = await this.bookingsService.create({
        listingId: this.listing()!.id,
        checkIn: this.checkIn,
        checkOut: this.checkOut,
        guestsCount: this.guests,
      }).toPromise();

      // Navigate to payment
      this.router.navigate(['/bookings', (booking as Booking).id], {
        queryParams: { payment: 'pending' },
      });
    } catch (err: any) {
      this.bookingError.set(err.error?.message || 'Failed to create booking. Please try again.');
    } finally {
      this.isBooking.set(false);
    }
  }
}