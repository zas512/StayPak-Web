import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BookingsService } from '../../core/services/bookings.service';
import { AuthService } from '../../core/services/auth.service';
import { Booking, BookingStatus, PaginatedBookings } from '../../core/models/booking.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-trips',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Your trips</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Manage your upcoming and past bookings</p>
          </div>
          <a routerLink="/listings" appButton variant="primary">Book a new trip</a>
        </div>

        <!-- Tab Navigation -->
        <div class="flex gap-1 bg-white dark:bg-gray-800 rounded-lg p-1 mb-6 border border-gray-100 dark:border-gray-700">
          @for (tab of tabs; track tab.value) {
            <button
              type="button"
              (click)="setActiveTab(tab.value)"
              class="px-4 py-2 rounded-md text-sm font-medium transition-colors"
              [class]="activeTab() === tab.value
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'">
              {{ tab.label }}
            </button>
          }
        </div>

        @if (isLoading()) {
          <div class="space-y-4">
            @for (i of [1,2,3]; track i) {
              <app-card class="animate-pulse">
                <div class="flex gap-4">
                  <div class="w-24 h-24 bg-gray-200 dark:bg-gray-700 rounded-lg flex-shrink-0"></div>
                  <div class="flex-1 space-y-3">
                    <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                  <div class="w-32 h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </app-card>
            }
          </div>
        } @else if (filteredTrips().length === 0) {
          <app-card class="text-center py-12">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No trips found</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              @if (activeTab() === 'upcoming') {
                You don't have any upcoming trips.
              } @else if (activeTab() === 'past') {
                You haven't completed any trips yet.
              } @else {
                No cancelled trips.
              }
            </p>
            @if (activeTab() === 'upcoming') {
              <a routerLink="/listings" appButton variant="primary">Find a place to stay</a>
            }
          </app-card>
        } @else {
          <div class="space-y-4">
            @for (trip of filteredTrips(); track trip.id) {
              <app-card>
                <div class="flex flex-col md:flex-row gap-6">
                  <!-- Listing Image -->
                  <a [routerLink]="['/bookings', trip.id]" class="flex-shrink-0">
                    <img
                      [src]="trip.listing?.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'"
                      [alt]="trip.listing?.title"
                      class="w-24 h-24 md:w-32 md:h-32 rounded-lg object-cover"
                    />
                  </a>

                  <!-- Trip Details -->
                  <div class="flex-1 min-w-0 flex flex-col md:flex-row md:items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <a [routerLink]="['/bookings', trip.id]" class="group">
                        <h3 class="font-semibold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                          {{ trip.listing?.title }}
                        </h3>
                      </a>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ trip.listing?.city }}{{ trip.listing?.area ? ', ' + trip.listing?.area : '' }}</p>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                        {{ formatDate(trip.checkIn) }} – {{ formatDate(trip.checkOut) }} · {{ trip.guestsCount }} {{ trip.guestsCount === 1 ? 'guest' : 'guests' }} · {{ trip.nights }} {{ trip.nights === 1 ? 'night' : 'nights' }}
                      </p>
                      @if (trip.listing?.host) {
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1">Hosted by {{ getHostName(trip) }}</p>
                      }
                    </div>

                    <div class="flex flex-col items-end gap-3 md:items-center md:flex-row">
                      <div class="text-right">
                        <p class="font-bold text-gray-900 dark:text-white">Rs {{ trip.totalAmount.toLocaleString() }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">Total</p>
                      </div>
                      <app-badge [variant]="getStatusBadgeVariant(trip.status)">{{ trip.status }}</app-badge>
                      <a [routerLink]="['/bookings', trip.id]" appButton variant="outline" size="sm">View details</a>
                    </div>
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
                (click)="loadPage(currentPage() - 1)"
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
                  (click)="loadPage(page)"
                  [attr.aria-current]="page === currentPage() ? 'page' : null">
                  {{ page }}
                </button>
              }
              <button
                appButton
                variant="outline"
                size="sm"
                (click)="loadPage(currentPage() + 1)"
                [disabled]="currentPage() === totalPages()"
                aria-label="Next page">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </nav>
          }
        }
      </div>
    </div>
  `,
})
export class TripsComponent implements OnInit {
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);

  trips = signal<Booking[]>([]);
  isLoading = signal(true);
  currentPage = signal(1);
  totalPages = signal(1);
  totalResults = signal(0);
  activeTab = signal<'upcoming' | 'past' | 'cancelled'>('upcoming');

  tabs = [
    { value: 'upcoming' as const, label: 'Upcoming' },
    { value: 'past' as const, label: 'Past' },
    { value: 'cancelled' as const, label: 'Cancelled' },
  ];

  setActiveTab(value: 'upcoming' | 'past' | 'cancelled') {
    this.activeTab.set(value);
  }

  filteredTrips = computed(() => {
    const now = new Date();
    return this.trips().filter((trip) => {
      const checkIn = new Date(trip.checkIn);
      const checkOut = new Date(trip.checkOut);

      switch (this.activeTab()) {
        case 'upcoming':
          return trip.status !== 'cancelled' && checkOut >= now;
        case 'past':
          return trip.status === 'completed' || (trip.status !== 'cancelled' && checkOut < now);
        case 'cancelled':
          return trip.status === 'cancelled';
        default:
          return false;
      }
    });
  });

  ngOnInit() {
    this.loadTrips();
  }

  loadTrips() {
    this.isLoading.set(true);
    this.bookingsService.getAll({ page: this.currentPage(), limit: 10 }).subscribe({
      next: (response: PaginatedBookings) => {
        this.trips.set(response.data);
        this.totalPages.set(response.meta.totalPages);
        this.totalResults.set(response.meta.total);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  loadPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
    this.loadTrips();
  }

  getStatusBadgeVariant(status: BookingStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  }

  getHostName(trip: Booking): string {
    return (trip.listing as any)?.host?.fullName || '';
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
}