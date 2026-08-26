import { Component, signal, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';
import { AuthService } from '../../core/services/auth.service';
import { Listing, ListingQueryParams } from '../../core/models/listing.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, BadgeComponent],
  template: `
    <div class="min-h-screen">
      <!-- Hero Section -->
      <section class="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-emerald-900 text-white overflow-hidden">
        <div class="absolute inset-0 bg-black/20"></div>
        <div class="absolute inset-0" aria-hidden="true">
          <svg class="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" stroke-width="0.5" opacity="0.1"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)"/>
          </svg>
        </div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-40">
          <div class="max-w-3xl">
            <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Find your perfect stay in
              <span class="text-emerald-200">Pakistan</span>
            </h1>
            <p class="text-lg sm:text-xl text-emerald-100 mb-8 max-w-2xl">
              Discover unique homes, apartments, and villas across Pakistan. From the mountains of Hunza to the beaches of Karachi.
            </p>

            <!-- Search Form -->
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-4 sm:p-6 border border-white/20">
              <form (ngSubmit)="onSearch()" class="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-12 sm:gap-4 sm:items-end">
                <div class="sm:col-span-4">
                  <label class="block text-sm font-medium text-emerald-100 mb-2">Where to?</label>
                  <input
                    type="text"
                    [(ngModel)]="searchParams.city"
                    name="city"
                    placeholder="City, area or landmark"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white placeholder:text-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  />
                </div>
                <div class="sm:col-span-3">
                  <label class="block text-sm font-medium text-emerald-100 mb-2">Check-in</label>
                  <input
                    type="date"
                    [(ngModel)]="searchParams.checkIn"
                    name="checkIn"
                    [min]="today"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  />
                </div>
                <div class="sm:col-span-3">
                  <label class="block text-sm font-medium text-emerald-100 mb-2">Check-out</label>
                  <input
                    type="date"
                    [(ngModel)]="searchParams.checkOut"
                    name="checkOut"
                    [min]="tomorrow"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent"
                  />
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-emerald-100 mb-2">Guests</label>
                  <select
                    [(ngModel)]="searchParams.minGuests"
                    name="guests"
                    class="w-full px-4 py-3 rounded-lg bg-white/20 border border-white/30 text-white focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent">
                    <option value="1">1 guest</option>
                    <option value="2">2 guests</option>
                    <option value="3">3 guests</option>
                    <option value="4">4 guests</option>
                    <option value="5">5+ guests</option>
                  </select>
                </div>
                <div class="sm:col-span-12 sm:col-span-1">
                  <button type="submit" appButton variant="primary" size="lg" class="w-full sm:w-auto">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    Search
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Floating stats -->
        <div class="absolute bottom-0 left-0 right-0 -translate-y-1/2 px-4">
          <div class="max-w-7xl mx-auto">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              @for (stat of stats; track stat.label) {
                <div class="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 text-center">
                  <div class="text-3xl font-bold">{{ stat.value }}</div>
                  <div class="text-emerald-100 text-sm">{{ stat.label }}</div>
                </div>
              }
            </div>
          </div>
        </div>
      </section>

      <!-- Popular Cities -->
      <section class="py-16 bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Popular destinations</h2>
            <a routerLink="/listings" class="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">View all →</a>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            @for (city of popularCities; track city.name) {
              <a [routerLink]="['/listings']" [queryParams]="{city: city.name}" class="group relative aspect-[4/3] rounded-2xl overflow-hidden">
                <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                <img [src]="city.image" [alt]="city.name" class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                <div class="absolute bottom-4 left-4 right-4 text-white">
                  <h3 class="text-xl font-bold">{{ city.name }}</h3>
                  <p class="text-sm opacity-90">{{ city.count }} properties</p>
                </div>
              </a>
            }
          </div>
        </div>
      </section>

      <!-- Featured Listings -->
      <section class="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between mb-8">
            <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
              @if (isLoading()) {
                Featured stays
              } @else {
                Featured stays in {{ searchParams.city || 'Pakistan' }}
              }
            </h2>
            <a routerLink="/listings" [queryParams]="{city: searchParams.city}" class="text-emerald-600 dark:text-emerald-400 hover:underline font-medium">View all →</a>
          </div>

          @if (isLoading()) {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (i of [1,2,3,4,5,6,7,8]; track i) {
                <div class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden animate-pulse">
                  <div class="aspect-[4/3] bg-gray-200 dark:bg-gray-700"></div>
                  <div class="p-4 space-y-3">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div class="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                  </div>
                </div>
              }
            </div>
          } @else if (listings().length === 0) {
            <div class="text-center py-16">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No stays found</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your search criteria or explore other areas.</p>
              <button appButton variant="outline" (click)="clearSearch()">Clear filters</button>
            </div>
          } @else {
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              @for (listing of listings(); track listing.id) {
                <article class="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300 group">
                  <a [routerLink]="['/listings', listing.id]" class="block">
                    <div class="relative aspect-[4/3] overflow-hidden">
                      <img
                        [src]="listing.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800'"
                        [alt]="listing.title"
                        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                      />
                      @if (listing.instantBook) {
                        <div class="absolute top-3 left-3">
                          <app-badge variant="success">Instant Book</app-badge>
                        </div>
                      }
                    </div>
                    <div class="p-4">
                      <div class="flex items-start justify-between mb-2">
                        <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-1">{{ listing.title }}</h3>
                      </div>
                      <p class="text-sm text-gray-500 dark:text-gray-400 mb-2">{{ listing.city }}{{ listing.area ? ', ' + listing.area : '' }}</p>
                      <div class="flex items-center justify-between">
                        <div>
                          <span class="text-xl font-bold text-gray-900 dark:text-white">Rs {{ listing.pricePerNight.toLocaleString() }}</span>
                          <span class="text-gray-500 dark:text-gray-400 ml-1">/ night</span>
                        </div>
                        <div class="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <svg class="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.91l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.67-.38-1.91.588-1.91h3.461a1 1 0 00.951-.69l1.07-3.292z"></path></svg>
                          <span>{{ (listing.photos?.length ?? 0) + 1 }} photos</span>
                        </div>
                      </div>
                    </div>
                  </a>
                </article>
              }
            </div>
          }
        </div>
      </section>

      <!-- How it works -->
      <section class="py-16 bg-white dark:bg-gray-900">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">How StayPak works</h2>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            @for (step of steps; track step.number) {
              <div class="text-center p-6">
                <div class="w-16 h-16 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
                  <span class="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{{ step.number }}</span>
                </div>
                <h3 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">{{ step.title }}</h3>
                <p class="text-gray-600 dark:text-gray-400">{{ step.description }}</p>
              </div>
            }
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="py-16 bg-emerald-600 dark:bg-emerald-700">
        <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 class="text-2xl sm:text-3xl font-bold mb-4">Ready to host your property?</h2>
          <p class="text-emerald-100 mb-8">List your space on StayPak and reach thousands of travelers across Pakistan.</p>
          <a routerLink="/host/dashboard" appButton variant="secondary" size="lg" class="bg-white text-emerald-600 hover:bg-emerald-50">
            Become a host
          </a>
        </div>
      </section>
    </div>
  `,
})
export class HomeComponent implements OnInit {
  private listingsService = inject(ListingsService);
  private authService = inject(AuthService);

  isLoading = signal(true);
  listings = signal<Listing[]>([]);
  searchParams: ListingQueryParams = {
    city: '',
    checkIn: '',
    checkOut: '',
    minGuests: 1,
  };

  today = new Date().toISOString().split('T')[0];
  tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  stats = [
    { label: 'Active listings', value: '10,000+' },
    { label: 'Cities covered', value: '50+' },
    { label: 'Happy guests', value: '50,000+' },
    { label: 'Hosts joined', value: '5,000+' },
  ];

  popularCities = [
    { name: 'Karachi', count: 2500, image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600' },
    { name: 'Lahore', count: 2100, image: 'https://images.unsplash.com/photo-1596422846543-75c6fc01e927?w=600' },
    { name: 'Islamabad', count: 1800, image: 'https://images.unsplash.com/photo-1585955244801-b8d47916b9c6?w=600' },
    { name: 'Hunza', count: 900, image: 'https://images.unsplash.com/photo-1582192639150-5a334b3b8f70?w=600' },
  ];

  steps = [
    { number: 1, title: 'Search', description: 'Find the perfect stay by location, dates, and guests.' },
    { number: 2, title: 'Book', description: 'Reserve instantly or request to book with secure payment.' },
    { number: 3, title: 'Stay', description: 'Enjoy your trip with 24/7 support and local hosts.' },
  ];

  ngOnInit() {
    this.loadFeaturedListings();
  }

  loadFeaturedListings() {
    this.isLoading.set(true);
    const params: ListingQueryParams = {
      limit: 8,
      status: 'active',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };

    if (this.searchParams.city) {
      params.city = this.searchParams.city;
    }
    if (this.searchParams.checkIn && this.searchParams.checkOut) {
      params.checkIn = this.searchParams.checkIn;
      params.checkOut = this.searchParams.checkOut;
    }
    if (this.searchParams.minGuests) {
      params.minGuests = this.searchParams.minGuests;
    }

    this.listingsService.getAll(params).subscribe({
      next: (response) => {
        this.listings.set(response.data);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  onSearch() {
    if (this.searchParams.checkIn && this.searchParams.checkOut) {
      if (new Date(this.searchParams.checkIn) >= new Date(this.searchParams.checkOut)) {
        alert('Check-out must be after check-in');
        return;
      }
    }
    this.loadFeaturedListings();
  }

  clearSearch() {
    this.searchParams = {
      city: '',
      checkIn: '',
      checkOut: '',
      minGuests: 1,
    };
    this.loadFeaturedListings();
  }
}