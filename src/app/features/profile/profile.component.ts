import { Component, signal, inject, OnInit, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User, UpdateProfileRequest } from '../../core/models/user.model';
import { ButtonComponent } from '../../shared/ui/button.component';
import { InputComponent } from '../../shared/ui/input.component';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent, InputComponent, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Profile Header -->
        <app-card variant="elevated">
          <div class="flex flex-col md:flex-row items-start md:items-center gap-6">
            <img
              [src]="user()?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (user()?.fullName || 'User') + '&background=059669&color=fff&size=128'"
              [alt]="user()?.fullName || 'Profile'"
              class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <div class="flex-1 text-center md:text-left">
              <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ user()?.fullName }}</h1>
              <p class="text-gray-600 dark:text-gray-400 mt-1">{{ user()?.email }}</p>
              @if (user()?.phone) {
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{ user()?.phone }}</p>
              }
              <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-3">
                <app-badge variant="outline" [variant]="getRoleBadgeVariant()">
                  {{ user()?.role || 'guest' }}
                </app-badge>
                @if (user()?.cnicStatus === 'verified') {
                  <app-badge variant="success">CNIC Verified</app-badge>
                } @else if (user()?.cnicStatus === 'pending') {
                  <app-badge variant="warning">CNIC Pending</app-badge>
                } @else if (user()?.cnicStatus === 'rejected') {
                  <app-badge variant="danger">CNIC Rejected</app-badge>
                }
              </div>
              <div class="mt-3 flex justify-center md:justify-start gap-4">
                <a routerLink="/settings" appButton variant="outline" size="sm">Edit profile</a>
                @if (isHost()) {
                  <a routerLink="/host/dashboard" appButton variant="primary" size="sm">Host dashboard</a>
                } @else {
                  <a routerLink="/host/dashboard" appButton variant="secondary" size="sm">Become a host</a>
                }
              </div>
            </div>
          </div>
        </app-card>

        <!-- Stats Overview -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <app-card class="text-center">
            <div class="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{{ stats().trips }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Trips</div>
          </app-card>
          <app-card class="text-center">
            <div class="text-3xl font-bold text-blue-600 dark:text-blue-400">{{ stats().upcoming }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Upcoming</div>
          </app-card>
          <app-card class="text-center">
            <div class="text-3xl font-bold text-purple-600 dark:text-purple-400">{{ stats().hosted }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Hosted stays</div>
          </app-card>
          <app-card class="text-center">
            <div class="text-3xl font-bold text-amber-600 dark:text-amber-400">{{ stats().listings }}</div>
            <div class="text-sm text-gray-600 dark:text-gray-400">Active listings</div>
          </app-card>
        </div>

        <!-- Quick Actions -->
        <app-card class="mt-6">
          <div slot="header">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Quick actions</h2>
          </div>
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <a routerLink="/trips" appButton variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Your trips</span>
            </a>
            <a routerLink="/messages" appButton variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
              <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
              </svg>
              <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Messages</span>
            </a>
            @if (isHost()) {
              <a routerLink="/host/listings/new" appButton variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">New listing</span>
              </a>
              <a routerLink="/host/bookings" appButton variant="outline" class="h-auto p-4 flex flex-col items-center gap-2">
                <svg class="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"></path>
                </svg>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Host bookings</span>
              </a>
            }
          </div>
        </app-card>

        <!-- Upcoming Trips -->
        <app-card class="mt-6">
          <div slot="header" class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Upcoming trips</h2>
            <a routerLink="/trips" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View all</a>
          </div>
          @if (upcomingTrips().length === 0) {
            <div class="text-center py-8">
              <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-gray-600 dark:text-gray-400">No upcoming trips</p>
              <a routerLink="/listings" class="mt-3 inline-block text-emerald-600 dark:text-emerald-400 hover:underline">Find a place to stay</a>
            </div>
          } @else {
            <div class="space-y-4">
              @for (trip of upcomingTrips(); track trip.id) {
                <div class="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                  <img
                    [src]="trip.listing?.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'"
                    [alt]="trip.listing?.title"
                    class="w-20 h-20 rounded-lg object-cover"
                  />
                  <div class="flex-1 min-w-0">
                    <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ trip.listing?.title }}</h3>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ trip.listing?.city }}</p>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ formatDate(trip.checkIn) }} – {{ formatDate(trip.checkOut) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900 dark:text-white">Rs {{ trip.totalAmount.toLocaleString() }}</p>
                    <app-badge [variant]="getStatusBadgeVariant(trip.status)">{{ trip.status }}</app-badge>
                  </div>
                  <a [routerLink]="['/bookings', trip.id]" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">View</a>
                </div>
              }
            </div>
          }
        </app-card>

        @if (isHost()) {
          <!-- Host Listings -->
          <app-card class="mt-6">
            <div slot="header" class="flex items-center justify-between">
              <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Your listings</h2>
              <a routerLink="/host/dashboard" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Manage all</a>
            </div>
            @if (hostListings().length === 0) {
              <div class="text-center py-8">
                <svg class="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                <p class="text-gray-600 dark:text-gray-400">No listings yet</p>
                <a routerLink="/host/listings/new" class="mt-3 inline-block" appButton variant="primary">Create your first listing</a>
              </div>
            } @else {
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                @for (listing of hostListings(); track listing.id) {
                  <div class="flex gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-100 dark:border-gray-700">
                    <img
                      [src]="listing.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'"
                      [alt]="listing.title"
                      class="w-20 h-20 rounded-lg object-cover flex-shrink-0"
                    />
                    <div class="flex-1 min-w-0">
                      <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ listing.title }}</h3>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ listing.city }}{{ listing.area ? ', ' + listing.area : '' }}</p>
                      <p class="text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-1">Rs {{ listing.pricePerNight.toLocaleString() }}/night</p>
                    </div>
                    <div class="flex flex-col items-end gap-2">
                      <app-badge [variant]="getListingStatusBadge(listing.status)">{{ listing.status }}</app-badge>
                      <a [routerLink]="['/host/listings', listing.id, 'edit']" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Edit</a>
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
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  user = this.authService.currentUser;
  stats = signal({ trips: 0, upcoming: 0, hosted: 0, listings: 0 });
  upcomingTrips = signal<any[]>([]);
  hostListings = signal<any[]>([]);

  ngOnInit() {
    // Load stats and trips - would be from API in real app
    // For now using mock data
    this.loadMockData();
  }

  loadMockData() {
    this.stats.set({ trips: 12, upcoming: 2, hosted: 5, listings: 3 });
    // Mock upcoming trips would come from bookings service
  }

  isHost = computed(() => {
    const u = this.user();
    return !!u && (u.role === 'host' || u.role === 'both');
  });

  getRoleBadgeVariant(): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    const role = this.user()?.role;
    switch (role) {
      case 'host': return 'info';
      case 'both': return 'success';
      default: return 'outline';
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
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}