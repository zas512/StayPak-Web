import { Component, signal, computed, inject, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';
import { AuthService } from '../../core/services/auth.service';
import { Listing, ListingQueryParams, PaginatedListings, PropertyType } from '../../core/models/listing.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-listings-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header with Map Toggle -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-4">
              <a routerLink="/" class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </a>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Stays in {{ searchParams.city || 'Pakistan' }}</h1>
            </div>
            <div class="flex items-center gap-2">
              <button appButton variant="outline" size="sm" (click)="showMap.set(!showMap())" [class.bg-emerald-50]="showMap()" class="dark:hover:bg-emerald-900/20">
                <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Map
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div class="flex flex-col lg:flex-row gap-8">
          <!-- Filters Sidebar -->
          <aside class="lg:w-64 flex-shrink-0" [class.hidden]="showMap() && !showFiltersMobile()">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sticky top-24 h-fit">
              <div class="flex items-center justify-between mb-4">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Filters</h2>
                @if (hasActiveFilters()) {
                  <button appButton variant="ghost" size="sm" (click)="clearFilters()">Clear all</button>
                }
              </div>

              <div class="space-y-5">
                <!-- Property Type -->
                <fieldset>
                  <legend class="text-sm font-medium text-gray-900 dark:text-white mb-3">Property type</legend>
                  <div class="space-y-2">
                    @for (type of propertyTypes; track type) {
                      <label class="flex items-center cursor-pointer">
                        <input type="checkbox" [value]="type" (change)="togglePropertyType(type)" [checked]="searchParams.propertyType?.includes(type)" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500">
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300 capitalize">{{ type }}</span>
                      </label>
                    }
                  </div>
                </fieldset>

                <!-- Price Range -->
                <fieldset>
                  <legend class="text-sm font-medium text-gray-900 dark:text-white mb-3">Price per night (PKR)</legend>
                  <div class="flex items-center gap-2">
                    <input type="number" [(ngModel)]="searchParams.minPrice" (ngModelChange)="applyFilters()" placeholder="Min" class="w-1/2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <span class="text-gray-400">–</span>
                    <input type="number" [(ngModel)]="searchParams.maxPrice" (ngModelChange)="applyFilters()" placeholder="Max" class="w-1/2 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  </div>
                </fieldset>

                <!-- Guests -->
                <fieldset>
                  <legend class="text-sm font-medium text-gray-900 dark:text-white mb-3">Guests</legend>
                  <select [(ngModel)]="searchParams.minGuests" (ngModelChange)="applyFilters()" class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    <option value="1">1+ guests</option>
                    <option value="2">2+ guests</option>
                    <option value="3">3+ guests</option>
                    <option value="4">4+ guests</option>
                    <option value="5">5+ guests</option>
                    <option value="6">6+ guests</option>
                  </select>
                </fieldset>

                <!-- Instant Book -->
                <fieldset>
                  <legend class="text-sm font-medium text-gray-900 dark:text-white mb-3">Booking options</legend>
                  <label class="flex items-center cursor-pointer">
                    <input type="checkbox" [(ngModel)]="searchParams.instantBook" (ngModelChange)="applyFilters()" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500">
                    <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Instant Book</span>
                  </label>
                </fieldset>

                <!-- Amenities -->
                <fieldset>
                  <legend class="text-sm font-medium text-gray-900 dark:text-white mb-3">Amenities</legend>
                  <div class="space-y-2 max-h-48 overflow-y-auto">
                    @for (amenity of amenities(); track amenity) {
                      <label class="flex items-center cursor-pointer">
                        <input type="checkbox" [value]="amenity" (change)="toggleAmenity(amenity)" [checked]="searchParams.amenities?.includes(amenity)" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500">
                        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">{{ amenity }}</span>
                      </label>
                    }
                  </div>
                </fieldset>
              </div>
            </div>
          </aside>

          <!-- Results -->
          <main class="flex-1 min-w-0">
            <!-- Mobile Filters Toggle -->
            <button appButton variant="outline" class="lg:hidden w-full mb-4" (click)="showFiltersMobile.set(!showFiltersMobile())">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 18a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l6.414-6.414a1 1 0 01.707-.293H15a1 1 0 01.707.293l6.414 6.414a1 1 0 01.293.707V17a1 1 0 01-1 1H5z"></path>
              </svg>
              Filters {{ hasActiveFilters() ? '(' + activeFilterCount() + ')' : '' }}
            </button>

            <!-- Sort & Results Count -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
              <p class="text-gray-600 dark:text-gray-400">
                <span class="font-semibold">{{ totalResults() }}</span> stays found
              </p>
              <div class="flex items-center gap-2">
                <label for="sort" class="text-sm text-gray-600 dark:text-gray-400">Sort by:</label>
                <select id="sort" [(ngModel)]="searchParams.sortBy" (ngModelChange)="applyFilters()" class="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="createdAt">Newest</option>
                  <option value="pricePerNight">Price: Low to high</option>
                  <option value="-pricePerNight">Price: High to low</option>
                  <option value="title">Name A-Z</option>
                </select>
              </div>
            </div>

            <!-- Listings Grid -->
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
                <p class="text-gray-600 dark:text-gray-400 mb-4">Try adjusting your filters or search in a different area.</p>
                <button appButton variant="outline" (click)="clearFilters()">Clear all filters</button>
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
                        <div class="absolute top-3 left-3 flex flex-col gap-1.5">
                          @if (listing.instantBook) {
                            <app-badge variant="success">Instant Book</app-badge>
                          }
                          @if (listing.status === 'active' && listing.host?.cnicStatus === 'verified') {
                            <app-badge variant="info">Verified Host</app-badge>
                          }
                        </div>
                        <button
                          type="button"
                          (click)="$event.stopPropagation(); toggleWishlist(listing.id)"
                          class="absolute top-3 right-3 w-10 h-10 rounded-full bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm flex items-center justify-center shadow-md hover:bg-white dark:hover:bg-gray-800 transition-colors"
                          [attr.aria-label]="isWishlisted(listing.id) ? 'Remove from wishlist' : 'Add to wishlist'">
                          <svg class="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" [class.fill-current]="isWishlisted(listing.id)" [class.text-emerald-500]="isWishlisted(listing.id)">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                          </svg>
                        </button>
                      </div>
                      <div class="p-4">
                        <h3 class="font-semibold text-gray-900 dark:text-white line-clamp-1 mb-1">{{ listing.title }}</h3>
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
          </main>
        </div>
      </div>

      <!-- Map Placeholder -->
      @if (showMap()) {
        <div class="fixed inset-0 bg-white dark:bg-gray-900 z-50 lg:relative lg:static lg:z-auto lg:h-[600px] rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 mx-4 lg:mx-0 my-4 lg:my-0">
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center p-8">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Map view coming soon</h3>
              <p class="text-gray-600 dark:text-gray-400">Interactive map with listing markers will be available here.</p>
            </div>
          </div>
        </div>
      }
    </div>
  `,
})
export class ListingsPageComponent implements OnInit {
  private listingsService = inject(ListingsService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  listings = signal<Listing[]>([]);
  isLoading = signal(true);
  totalResults = signal(0);
  totalPages = signal(0);
  currentPage = signal(1);

  searchParams: ListingQueryParams = {
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    status: 'active',
  };

  propertyTypes: PropertyType[] = ['apartment', 'house', 'room', 'villa'];
  showMap = signal(false);
  showFiltersMobile = signal(false);
  wishlist = signal<string[]>([]);

  // Load amenities from service
  amenities = signal<string[]>([]);

  ngOnInit() {
    // Load from localStorage
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      this.wishlist.set(JSON.parse(savedWishlist));
    }

    // Load amenities
    this.listingsService.getAmenities().subscribe({
      next: (amenities) => this.amenities.set(amenities),
    });

    // Read query params
    this.route.queryParams.subscribe((params) => {
      this.searchParams = {
        ...this.searchParams,
        city: params['city'] || '',
        checkIn: params['checkIn'] || '',
        checkOut: params['checkOut'] || '',
        minGuests: params['guests'] ? parseInt(params['guests']) : 1,
        page: params['page'] ? parseInt(params['page']) : 1,
      };
      this.currentPage.set(this.searchParams.page || 1);
      this.loadListings();
    });
  }

  loadListings() {
    this.isLoading.set(true);
    this.listingsService.getAll(this.searchParams).subscribe({
      next: (response: PaginatedListings) => {
        this.listings.set(response.data);
        this.totalResults.set(response.meta.total);
        this.totalPages.set(response.meta.totalPages);
        this.currentPage.set(response.meta.page);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  applyFilters() {
    this.searchParams.page = 1;
    this.currentPage.set(1);
    this.updateUrlAndLoad();
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages()) return;
    this.searchParams.page = page;
    this.currentPage.set(page);
    this.updateUrlAndLoad();
  }

  updateUrlAndLoad() {
    const queryParams: any = { ...this.searchParams };
    // Remove empty values
    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] === '' || queryParams[key] === null || queryParams[key] === undefined) {
        delete queryParams[key];
      }
    });
    if (queryParams.propertyType && queryParams.propertyType.length === 0) delete queryParams.propertyType;
    if (queryParams.amenities && queryParams.amenities.length === 0) delete queryParams.amenities;

    this.router.navigate([], { queryParams, queryParamsHandling: 'merge' });
    this.loadListings();
  }

  togglePropertyType(type: PropertyType) {
    const current = (this.searchParams.propertyType as PropertyType[]) || [];
    const index = current.indexOf(type);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(type);
    }
    this.searchParams.propertyType = current.length ? current : undefined;
    this.applyFilters();
  }

  toggleAmenity(amenity: string) {
    const current = this.searchParams.amenities || [];
    const index = current.indexOf(amenity);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(amenity);
    }
    this.searchParams.amenities = current.length ? current : undefined;
    this.applyFilters();
  }

  clearFilters() {
    this.searchParams = {
      page: 1,
      limit: 12,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      status: 'active',
    };
    this.applyFilters();
  }

  hasActiveFilters = computed(() => {
    return !!(
      this.searchParams.propertyType?.length ||
      this.searchParams.minPrice ||
      this.searchParams.maxPrice ||
      this.searchParams.instantBook ||
      this.searchParams.amenities?.length ||
      (this.searchParams.minGuests ?? 1) > 1
    );
  });

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.searchParams.propertyType?.length) count += this.searchParams.propertyType.length;
    if (this.searchParams.minPrice) count++;
    if (this.searchParams.maxPrice) count++;
    if (this.searchParams.instantBook) count++;
    if (this.searchParams.amenities?.length) count += this.searchParams.amenities.length;
    if ((this.searchParams.minGuests ?? 1) > 1) count++;
    return count;
  });

  visiblePages = computed(() => {
    const pages: number[] = [];
    const current = this.currentPage();
    const total = this.totalPages();

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      pages.push(1);
      if (current > 3) pages.push(-1); // ellipsis
      for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) {
        pages.push(i);
      }
      if (current < total - 2) pages.push(-1); // ellipsis
      pages.push(total);
    }
    return pages;
  });

  isWishlisted(listingId: string): boolean {
    return this.wishlist().includes(listingId);
  }

  toggleWishlist(listingId: string) {
    const current = [...this.wishlist()];
    const index = current.indexOf(listingId);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(listingId);
    }
    this.wishlist.set(current);
    localStorage.setItem('wishlist', JSON.stringify(current));
  }
}