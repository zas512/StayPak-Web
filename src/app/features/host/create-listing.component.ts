import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ListingsService } from '../../core/services/listings.service';
import { AuthService } from '../../core/services/auth.service';
import { PropertyType, CreateListingRequest, Listing, AvailabilityRequest } from '../../core/models/listing.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-create-listing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, CardComponent],
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
              <h1 class="text-xl font-bold text-gray-900 dark:text-white">Create new listing</h1>
            </div>
            <div class="flex items-center gap-3">
              <a routerLink="/host/dashboard" appButton variant="outline" size="sm">Cancel</a>
              <button appButton variant="primary" size="sm" (click)="save('active')" [loading]="isSaving()" [disabled]="!isFormValid()">
                Publish
              </button>
            </div>
          </div>
        </div>
      </header>

      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        @if (saveError()) {
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert">
            {{ saveError() }}
          </div>
        }

        <form #form="ngForm" (ngSubmit)="save('active')" class="space-y-8">
          <!-- Basic Info -->
          <app-card>
            <div slot="header">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Basic information</h2>
            </div>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title *</label>
                <input
                  type="text"
                  [(ngModel)]="form_data.title"
                  name="title"
                  required
                  placeholder="Cozy apartment in Lahore"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea
                  [(ngModel)]="form_data.description"
                  name="description"
                  rows="4"
                  placeholder="Describe your place, amenities, neighborhood..."
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
                      class="p-3 border border-gray-200 dark:border-gray-600 rounded-lg text-sm font-medium capitalize transition-colors hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
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
                  placeholder="Lahore"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Area / Neighborhood</label>
                <input
                  type="text"
                  [(ngModel)]="form_data.area"
                  name="area"
                  placeholder="Gulberg"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>
              <div class="sm:col-span-2">
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  [(ngModel)]="form_data.address"
                  name="address"
                  placeholder="Street, block, landmark"
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
                <select
                  [(ngModel)]="form_data.maxGuests"
                  name="maxGuests"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  @for (n of [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]; track n) {
                    <option [value]="n">{{ n }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bedrooms *</label>
                <select
                  [(ngModel)]="form_data.bedrooms"
                  name="bedrooms"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  @for (n of [1,2,3,4,5,6,7,8,9,10]; track n) {
                    <option [value]="n">{{ n }}</option>
                  }
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bathrooms *</label>
                <select
                  [(ngModel)]="form_data.bathrooms"
                  name="bathrooms"
                  required
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500">
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
                  required
                  min="100"
                  placeholder="5000"
                  class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
              </div>
            </div>

            <div class="mt-4">
              <label class="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  [(ngModel)]="form_data.instantBook"
                  name="instantBook"
                  class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                >
                <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Enable Instant Book (guests can book without approval)</span>
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
              <span class="text-sm text-gray-500 dark:text-gray-400">{{ uploadedPhotos().length }} uploaded</span>
            </div>
            <div class="space-y-4">
              @if (uploadedPhotos().length < 10) {
                <label class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  <svg class="w-10 h-10 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                  </svg>
                  <span class="text-sm text-gray-500 dark:text-gray-400">Click to upload photos</span>
                  <input type="file" accept="image/*" multiple class="hidden" (change)="onFileSelect($event)" [disabled]="isUploading()">
                </label>
              }

              @if (uploadedPhotos().length > 0) {
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  @for (photo of uploadedPhotos(); track photo.id; let i = $index) {
                    <div class="relative group">
                      <img [src]="photo.cdnUrl" [alt]="photo.id" class="w-full h-28 object-cover rounded-lg">
                      <button
                        type="button"
                        (click)="removePhoto(photo.id)"
                        [disabled]="isUploading()"
                        class="absolute top-1 right-1 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Remove photo">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                      </button>
                      @if (i === 0) {
                        <span class="absolute bottom-1 left-1 px-2 py-0.5 bg-emerald-500 text-white text-xs rounded">Cover</span>
                      }
                    </div>
                  }
                </div>
              }

              @if (pendingFiles().length > 0) {
                <div class="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <svg class="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                  </svg>
                  {{ pendingFiles().length }} photo(s) ready to upload
                </div>
              }
            </div>
          </app-card>

          <!-- Submit -->
          <div class="flex items-center justify-between">
            <button type="button" appButton variant="outline" (click)="save('draft')" [loading]="isSaving()" [disabled]="!isFormValid()">
              Save as draft
            </button>
            <button type="submit" appButton variant="primary" [loading]="isSaving()" [disabled]="!isFormValid() || uploadedPhotos().length === 0">
              Publish listing
            </button>
          </div>
          @if (uploadedPhotos().length === 0) {
            <p class="text-xs text-amber-600 dark:text-amber-400 text-center">Add at least one photo to publish</p>
          }
        </form>
      </div>
    </div>
  `,
})
export class CreateListingComponent implements OnInit {
  private listingsService = inject(ListingsService);
  private router = inject(Router);

  propertyTypes: PropertyType[] = ['apartment', 'house', 'room', 'villa'];

  form_data: CreateListingRequest = {
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
  };

  availableAmenities: string[] = [
    'wifi', 'kitchen', 'ac', 'heating', 'tv', 'washer', 'parking',
    'pool', 'gym', 'elevator', 'generator', 'security', 'balcony',
    'workspace', 'breakfast', 'pet_friendly', 'smoking_allowed', 'cctv',
  ];

  selectedAmenities = signal<string[]>([]);
  uploadedPhotos = signal<{ id: string; cdnUrl: string }[]>([]);
  pendingFiles = signal<{ file: File; isCover: boolean; sortOrder: number }[]>([]);
  isSaving = signal(false);
  isUploading = signal(false);
  saveError = signal('');

  ngOnInit() {
    // Pre-load amenities from API if available
    this.listingsService.getAmenities().subscribe({
      next: (amenities) => {
        if (amenities.length > 0) this.availableAmenities = amenities;
      },
      error: () => {},
    });
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

  async onFileSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    // Store files locally for upload after listing creation
    const files = Array.from(input.files);
    for (const file of files) {
      this.pendingFiles.update((f) => [
        ...f,
        { file, isCover: this.uploadedPhotos().length === 0 && this.pendingFiles().length === 0, sortOrder: this.uploadedPhotos().length + this.pendingFiles().length },
      ]);
    }
    input.value = '';
  }

  removePhoto(photoId: string) {
    this.uploadedPhotos.update((photos) => photos.filter((p) => p.id !== photoId));
  }

  isFormValid(): boolean {
    return !!(
      this.form_data.title.trim() &&
      this.form_data.city.trim() &&
      this.form_data.propertyType &&
      this.form_data.maxGuests > 0 &&
      this.form_data.bedrooms > 0 &&
      this.form_data.bathrooms > 0 &&
      this.form_data.pricePerNight >= 100
    );
  }

  async save(status: 'draft' | 'active') {
    if (!this.isFormValid()) return;

    this.isSaving.set(true);
    this.saveError.set('');

    try {
      const payload: CreateListingRequest = {
        ...this.form_data,
      };

      const listing = await this.listingsService.create(payload).toPromise();
      const created = listing as Listing;

      // Upload pending files
      if (this.pendingFiles().length > 0 && created?.id) {
        for (const item of this.pendingFiles()) {
          try {
            await this.listingsService.addPhoto(created.id, item.file, item.isCover, item.sortOrder).toPromise();
          } catch (e) {
            console.error('Failed to upload photo:', e);
          }
        }
      }

      this.router.navigate(['/host/dashboard']);
    } catch (err: any) {
      this.saveError.set(err.error?.message || 'Failed to create listing. Please try again.');
    } finally {
      this.isSaving.set(false);
    }
  }
}
