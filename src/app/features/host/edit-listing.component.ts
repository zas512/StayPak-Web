import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';
import { PropertyType, UpdateListingRequest, Listing, ListingStatus, AvailabilityRequest } from '../../core/models/listing.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { InputComponent } from '../../shared/ui/input.component';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-edit-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, InputComponent, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <div class="flex items-center gap-4">
              <a routerLink="/host/dashboard" class="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </a>
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Edit listing</h1>
            </div>
            <div class="flex items-center gap-3">
              @if (listing()) {
                <app-badge [variant]="getStatusBadge(listing()!.status)">{{ listing()!.status }}</app-badge>
              }
              <button appButton variant="primary" size="sm" (click)="save()" [loading]="isSaving()" [disabled]="!listing()">
                Save changes
              </button>
            </div>
          </div>
        </div>
      </header>

      @if (isLoading()) {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div class="animate-pulse space-y-4">
            <div class="h-64 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            <div class="h-32 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          </div>
        </div>
      } @else if (!listing()) {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Listing not found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">This listing may have been removed.</p>
          <a routerLink="/host/dashboard" appButton variant="primary">Back to dashboard</a>
        </div>
      } @else {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          @if (saveError()) {
            <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert">
              {{ saveError() }}
            </div>
          }
          @if (saveSuccess()) {
            <div class="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-600 dark:text-green-400 text-sm">
              Changes saved successfully!
            </div>
          }

          <form #form="ngForm" (ngSubmit)="save()" class="space-y-8">
            <!-- Basic Info -->
            <app-card>
              <div slot="header" class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Basic information</h2>
                <select
                  [(ngModel)]="form_data.status"
                  name="status"
                  class="px-3 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <option value="draft">Draft</option>
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                </select>
              </div>
              <div class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                  <input
                    type="text"
                    [(ngModel)]="form_data.title"
                    name="title"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                  <textarea
                    [(ngModel)]="form_data.description"
                    name="description"
                    rows="4"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  ></textarea>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Property type *</label>
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    @for (type of propertyTypes; track type) {
                      <button
                        type="button"
                        (click)="form_data.propertyType = type"
                        [class.bg-emerald-50]="form_data.propertyType === type"
                        [class.border-emerald-500]="form_data.propertyType === type"
                        [class.text-emerald-700]="form_data.propertyType === type"
                        class="p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium capitalize transition-colors text-gray-700 dark:text-gray-300">
                        {{ type }}
                      </button>
                    }
                  </div>
                </div>
              </div>
            </app-card>

            <!-- Location -->
            <app-card>
              <div slot="header">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Location</h2>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">City *</label>
                  <input
                    type="text"
                    [(ngModel)]="form_data.city"
                    name="city"
                    required
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area / Neighborhood</label>
                  <input
                    type="text"
                    [(ngModel)]="form_data.area"
                    name="area"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                </div>
                <div class="sm:col-span-2">
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                  <input
                    type="text"
                    [(ngModel)]="form_data.address"
                    name="address"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                </div>
              </div>
            </app-card>

            <!-- Details -->
            <app-card>
              <div slot="header">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Property details</h2>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Max guests *</label>
                  <select [(ngModel)]="form_data.maxGuests" name="maxGuests" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    @for (n of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]; track n) {
                      <option [value]="n">{{ n }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms *</label>
                  <select [(ngModel)]="form_data.bedrooms" name="bedrooms" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    @for (n of [1,2,3,4,5,6,7,8,9,10]; track n) {
                      <option [value]="n">{{ n }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bathrooms *</label>
                  <select [(ngModel)]="form_data.bathrooms" name="bathrooms" class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                    @for (n of [1,2,3,4,5,6,7,8,9,10]; track n) {
                      <option [value]="n">{{ n }}</option>
                    }
                  </select>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Price/night (PKR) *</label>
                  <input
                    type="number"
                    [(ngModel)]="form_data.pricePerNight"
                    name="pricePerNight"
                    min="100"
                    class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                </div>
              </div>

              <div class="mt-4">
                <label class="flex items-center cursor-pointer">
                  <input type="checkbox" [(ngModel)]="form_data.instantBook" name="instantBook" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500">
                  <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Instant Book</span>
                </label>
              </div>
            </app-card>

            <!-- Amenities -->
            <app-card>
              <div slot="header">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Amenities</h2>
              </div>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                @for (amenity of availableAmenities; track amenity) {
                  <label class="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    <input
                      type="checkbox"
                      [checked]="selectedAmenities().includes(amenity)"
                      (change)="toggleAmenity(amenity)"
                      class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                    >
                    <span class="text-sm text-gray-700 dark:text-gray-300 capitalize">{{ amenity.replace(/_/g, ' ') }}</span>
                  </label>
                }
              </div>
            </app-card>

            <!-- Photos -->
            <app-card>
              <div slot="header" class="flex items-center justify-between">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Photos</h2>
                <span class="text-sm text-gray-500 dark:text-gray-400">{{ (listing()?.photos?.length || 0) + pendingFiles().length }} photos</span>
              </div>
              <div class="space-y-4">
                @if ((listing()?.photos?.length || 0) + pendingFiles().length < 10) {
                  <label class="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                    <svg class="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <span class="text-sm text-gray-500 dark:text-gray-400">Add more photos</span>
                    <input type="file" accept="image/*" multiple class="hidden" (change)="onFileSelect($event)">
                  </label>
                }

                @if (listing()?.photos?.length) {
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @for (photo of listing()!.photos; track photo.id; let i = $index) {
                      <div class="relative group">
                        <img [src]="photo.cdnUrl" [alt]="photo.id" class="w-full h-28 object-cover rounded-lg">
                        @if (photo.isCover || i === 0) {
                          <span class="absolute bottom-1 left-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded">Cover</span>
                        }
                      </div>
                    }
                  </div>
                }

                @if (pendingFiles().length > 0) {
                  <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    @for (item of pendingFiles(); track $index) {
                      <div class="relative group">
                        <img [src]="getPreviewUrl(item.file)" [alt]="'pending'" class="w-full h-28 object-cover rounded-lg">
                        <button
                          type="button"
                          (click)="removePendingFile($index)"
                          class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="Remove">
                          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                          </svg>
                        </button>
                      </div>
                    }
                  </div>
                }
              </div>
            </app-card>

            <!-- Actions -->
            <div class="flex items-center justify-between">
              <button type="button" appButton variant="danger" (click)="deleteListing()" [disabled]="isSaving()">
                Delete listing
              </button>
              <button type="submit" appButton variant="primary" [loading]="isSaving()">
                Save changes
              </button>
            </div>
          </form>
        </div>
      }
    </div>
  `,
})
export class EditListingComponent implements OnInit {
  private listingsService = inject(ListingsService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  propertyTypes: PropertyType[] = ['apartment', 'house', 'room', 'villa'];

  listing = signal<Listing | null>(null);
  isLoading = signal(true);
  isSaving = signal(false);
  saveError = signal('');
  saveSuccess = signal(false);

  form_data: UpdateListingRequest = {
    title: '',
    description: '',
    propertyType: 'apartment',
    city: '',
    area: '',
    address: '',
    maxGuests: 2,
    bedrooms: 1,
    bathrooms: 1,
    amenities: [],
    pricePerNight: 5000,
    instantBook: false,
    status: 'active',
  };

  availableAmenities: string[] = [
    'wifi', 'kitchen', 'ac', 'heating', 'tv', 'washer', 'parking',
    'pool', 'gym', 'elevator', 'generator', 'security', 'balcony',
    'workspace', 'breakfast', 'pet_friendly', 'smoking_allowed', 'cctv',
  ];

  selectedAmenities = signal<string[]>([]);
  pendingFiles = signal<{ file: File }[]>([]);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.loadListing(id);
      } else {
        this.isLoading.set(false);
      }
    });
  }

  loadListing(id: string) {
    this.isLoading.set(true);
    this.listingsService.getById(id).subscribe({
      next: (listing) => {
        this.listing.set(listing);
        this.populateForm(listing);
        this.isLoading.set(false);
      },
      error: () => {
        this.listing.set(null);
        this.isLoading.set(false);
      },
    });
  }

  populateForm(listing: Listing) {
    this.form_data = {
      title: listing.title,
      description: listing.description || '',
      propertyType: listing.propertyType,
      city: listing.city,
      area: listing.area || '',
      address: listing.address || '',
      maxGuests: listing.maxGuests,
      bedrooms: listing.bedrooms,
      bathrooms: listing.bathrooms,
      amenities: listing.amenities || [],
      pricePerNight: listing.pricePerNight,
      instantBook: listing.instantBook,
      status: listing.status,
    };
    this.selectedAmenities.set(listing.amenities || []);
  }

  toggleAmenity(amenity: string) {
    const current = [...this.selectedAmenities()];
    const index = current.indexOf(amenity);
    if (index > -1) {
      current.splice(index, 1);
    } else {
      current.push(amenity);
    }
    this.selectedAmenities.set(current);
    this.form_data.amenities = current;
  }

  onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;
    const files = Array.from(input.files).map((f) => ({ file: f }));
    this.pendingFiles.update((existing) => [...existing, ...files]);
    input.value = '';
  }

  removePendingFile(index: number) {
    this.pendingFiles.update((files) => files.filter((_, i) => i !== index));
  }

  getPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  getStatusBadge(status: ListingStatus): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (status) {
      case 'active': return 'success';
      case 'paused': return 'warning';
      case 'draft': return 'info';
      case 'deleted': return 'danger';
      default: return 'default';
    }
  }

  async save() {
    if (!this.listing()) return;

    this.isSaving.set(true);
    this.saveError.set('');
    this.saveSuccess.set(false);

    try {
      const updated = await this.listingsService.update(this.listing()!.id, this.form_data).toPromise();

      // Upload pending files
      if (this.pendingFiles().length > 0) {
        for (let i = 0; i < this.pendingFiles().length; i++) {
          const item = this.pendingFiles()[i];
          try {
            await this.listingsService.addPhoto(this.listing()!.id, item.file, i === 0 && !this.listing()!.photos?.length, i).toPromise();
          } catch (e) {
            console.error('Failed to upload photo:', e);
          }
        }
      }

      this.saveSuccess.set(true);
      // Reload listing to reflect changes
      this.loadListing(this.listing()!.id);
    } catch (err: any) {
      this.saveError.set(err.error?.message || 'Failed to save changes. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }

  async deleteListing() {
    if (!this.listing()) return;
    if (!confirm('Are you sure you want to delete this listing? This action cannot be undone.')) return;

    this.isSaving.set(true);
    try {
      await this.listingsService.delete(this.listing()!.id).toPromise();
      this.router.navigate(['/host/dashboard']);
    } catch (err: any) {
      this.saveError.set(err.error?.message || 'Failed to delete listing.');
      this.isSaving.set(false);
    }
  }
}
