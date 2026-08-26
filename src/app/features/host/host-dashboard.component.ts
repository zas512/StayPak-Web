import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';
import { BookingsService } from '../../core/services/bookings.service';
import { AuthService } from '../../core/services/auth.service';
import { Listing } from '../../core/models/listing.model';
import { Booking } from '../../core/models/booking.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-host-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Host Dashboard</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Manage your listings and track your earnings</p>
          </div>
          <a routerLink="/host/listings/new" appButton variant="primary" size="lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New listing
          </a>
        </div>

        @if (isLoading()) {
          <!-- Loading skeleton -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            @for (i of [1,2,3,4]; track i) {
              <div class="bg-white dark:bg-gray-800 rounded-xl p-6 animate-pulse">
                <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              </div>
            }
          </div>
        } @else {
          <!-- Stats Cards -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <app-card>
              <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats().totalListings }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Active listings</div>
            </app-card>
            <app-card>
              <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ stats().totalBookings }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total bookings</div>
            </app-card>
            <app-card>
              <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ stats().pendingBookings }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Pending requests</div>
            </app-card>
            <app-card>
              <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">Rs {{ stats().totalEarnings.toLocaleString() }}</div>
              <div class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total earnings</div>
            </app-card>
          </div>

          <!-- Earnings Chart -->
          <app-card class="mb-8">
            <div slot="header">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Earnings (last 6 months)</h2>
            </div>
            @if (earningsData().length > 0) {
              <div class="flex items-end justify-between gap-2 h-48 px-2">
                @for (month of earningsData(); track month.label) {
                  <div class="flex-1 flex flex-col items-center gap-2">
                    <div class="text-xs font-medium text-gray-700 dark:text-gray-300">Rs {{ (month.amount / 1000).toFixed(0) }}k</div>
                    <div
                      class="w-full rounded-t-lg bg-emerald-500 dark:bg-emerald-400 transition-all duration-500"
                      [style.height.%]="getBarHeight(month.amount)"
                      [title]="month.label + ': Rs ' + month.amount.toLocaleString()">
                    </div>
                    <div class="text-xs text-gray-500 dark:text-gray-400">{{ month.label }}</div>
                  </div>
                }
              </div>
            } @else {
              <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                <svg class="w-12 h-12 mx-auto mb-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                No earnings data yet
              </div>
            }
          </app-card>

          <!-- Recent Bookings -->
          <app-card class="mb-8">
            <div slot="header" class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent bookings</h2>
              <a routerLink="/host/bookings" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View all</a>
            </div>
            @if (recentBookings().length === 0) {
              <div class="text-center py-8 text-gray-500 dark:text-gray-400">
                No bookings yet
              </div>
            } @else {
              <div class="space-y-3">
                @for (booking of recentBookings(); track booking.id) {
                  <div class="flex items-center gap-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <img
                      [src]="booking.listing?.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=100'"
                      [alt]="booking.listing?.title"
                      class="w-14 h-14 rounded-lg object-cover flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ booking.listing?.title }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">
                        {{ formatDate(booking.checkIn) }} – {{ formatDate(booking.checkOut) }}
                      </p>
                    </div>
                    <div class="text-right">
                      <p class="font-semibold text-gray-900 dark:text-white">Rs {{ booking.totalAmount.toLocaleString() }}</p>
                      <app-badge [variant]="getBookingStatusBadge(booking.status)">{{ booking.status }}</app-badge>
                    </div>
                  </div>
                }
              </div>
            }
          </app-card>

          <!-- My Listings -->
          <app-card>
            <div slot="header" class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Your listings</h2>
              <a routerLink="/host/listings/new" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Add new</a>
            </div>
            @if (myListings().length === 0) {
              <div class="text-center py-12">
                <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">No listings yet</h3>
                <p class="text-gray-600 dark:text-gray-400 mb-4">Start earning by listing your property on StayPak.</p>
                <a routerLink="/host/listings/new" appButton variant="primary">Create your first listing</a>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                @for (listing of myListings(); track listing.id) {
                  <div class="border border-gray-100 dark:border-gray-700 rounded-xl overflow-hidden">
                    <div class="relative aspect-[4/3]">
                      <img
                        [src]="listing.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'"
                        [alt]="listing.title"
                        class="w-full h-full object-cover"
                      />
                      <div class="absolute top-2 right-2">
                        <app-badge [variant]="getListingStatusBadge(listing.status)">{{ listing.status }}</app-badge>
                      </div>
                    </div>
                    <div class="p-4">
                      <h3 class="font-medium text-gray-900 dark:text-white truncate mb-1">{{ listing.title }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ listing.city }}{{ listing.area ? ', ' + listing.area : '' }}</p>
                      <div class="flex items-center justify-between">
                        <span class="font-semibold text-emerald-600 dark:text-emerald-400">Rs {{ listing.pricePerNight.toLocaleString() }}/night</span>
                        <div class="flex gap-2">
                          <a [routerLink]="['/host/listings', listing.id, 'edit']" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">Edit</a>
                          <a [routerLink]="['/listings', listing.id]" class="text-sm text-gray-600 dark:text-gray-400 hover:underline">View</a>
                        </div>
                      </div>
                    </div>
                  </div>
                }
              </div>
            }
          </app-card>
        }
      </div>
    </div>
  `,
})
export class HostDashboardComponent implements OnInit {
  private listingsService = inject(ListingsService);
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(true);
  myListings = signal<Listing[]>([]);
  recentBookings = signal<Booking[]>([]);
  earningsData = signal<{ label: string; amount: number }[]>([]);

  stats = signal({
    totalListings: 0,
    totalBookings: 0,
    pendingBookings: 0,
    totalEarnings: 0,
  });

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.isLoading.set(true);

    // Load host's listings
    this.listingsService.getMyListings({ limit: 100 }).subscribe({
      next: (response) => {
        this.myListings.set(response.data);
        this.stats.update((s) => ({ ...s, totalListings: response.data.filter((l) => l.status === 'active').length }));
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });

    // Load host's bookings (for listings they own)
    this.bookingsService.getAll({ limit: 50 }).subscribe({
      next: (response) => {
        const bookings = response.data;
        this.recentBookings.set(bookings.slice(0, 5));
        this.stats.update((s) => ({
          ...s,
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b) => b.status === 'pending').length,
          totalEarnings: bookings
            .filter((b) => b.status === 'completed' || b.status === 'confirmed')
            .reduce((sum, b) => sum + b.totalAmount, 0),
        }));
        this.generateEarningsChart(bookings);
      },
      error: () => {},
    });
  }

  generateEarningsChart(bookings: Booking[]) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const now = new Date();
    const data: { label: string; amount: number }[] = [];

    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthBookings = bookings.filter((b) => {
        const bd = new Date(b.createdAt);
        return bd.getMonth() === d.getMonth() && bd.getFullYear() === d.getFullYear();
      });
      const amount = monthBookings
        .filter((b) => b.status === 'completed' || b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalAmount, 0);
      data.push({ label: months[d.getMonth()], amount });
    }

    this.earningsData.set(data);
  }

  getBarHeight(amount: number): number {
    const max = Math.max(...this.earningsData().map((d) => d.amount), 1);
    return Math.max(5, (amount / max) * 100);
  }

  getBookingStatusBadge(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (status) {
      case 'confirmed': return 'success';
      case 'pending': return 'warning';
      case 'completed': return 'info';
      case 'cancelled': return 'danger';
      default: return 'default';
    }
  }

  getListingStatusBadge(status: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'draft': return 'info';
      case 'deleted': return 'danger';
      default: return 'default';
    }
  }

  formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }
}
