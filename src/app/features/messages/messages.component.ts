import { Component, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BookingsService } from '../../core/services/bookings.service';
import { AuthService } from '../../core/services/auth.service';
import { Conversation } from '../../core/models/booking.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-messages',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Header -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Messages</h1>
          <p class="text-gray-600 dark:text-gray-400 mt-1">Communicate with hosts and guests</p>
        </div>

        @if (isLoading()) {
          <div class="space-y-3">
            @for (i of [1,2,3,4,5]; track i) {
              <div class="animate-pulse bg-white dark:bg-gray-800 rounded-xl p-4 border border-gray-100 dark:border-gray-700">
                <div class="flex gap-4">
                  <div class="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div class="flex-1 space-y-2">
                    <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                  <div class="w-20 h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              </div>
            }
          </div>
        } @else if (conversations().length === 0) {
          <app-card class="text-center py-16">
            <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">No conversations yet</h3>
            <p class="text-gray-600 dark:text-gray-400 mb-6">Start a conversation by booking a stay or hosting guests.</p>
            <a routerLink="/listings" appButton variant="primary">Browse listings</a>
          </app-card>
        } @else {
          <div class="space-y-3">
            @for (conversation of conversations(); track conversation.bookingId) {
              <a [routerLink]="['/messages', conversation.bookingId]" class="block">
                <app-card class="transition-shadow hover:shadow-md cursor-pointer">
                  <div class="flex flex-col sm:flex-row gap-4">
                    <!-- Listing Image -->
                    <div class="relative flex-shrink-0">
                      <img
                        [src]="conversation.listing.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'"
                        [alt]="conversation.listing.title"
                        class="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover"
                      />
                      @if (conversation.unreadCount > 0) {
                        <span class="absolute -top-1 -right-1 w-5 h-5 bg-emerald-600 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {{ conversation.unreadCount > 9 ? '9+' : conversation.unreadCount }}
                        </span>
                      }
                    </div>

                    <!-- Conversation Info -->
                    <div class="flex-1 min-w-0">
                      <div class="flex items-start justify-between gap-4">
                        <div class="min-w-0">
                          <h3 class="font-medium text-gray-900 dark:text-white truncate">{{ conversation.listing.title }}</h3>
                          <p class="text-sm text-gray-500 dark:text-gray-400 truncate">{{ conversation.listing.city }}</p>
                        </div>
                        @if (conversation.lastMessage?.sentAt) {
                          <span class="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{{ formatRelativeTime(conversation.lastMessage.sentAt) }}</span>
                        }
                      </div>
                      <div class="flex items-center justify-between mt-2">
                        <div class="flex items-center gap-2 min-w-0">
                          <img
                            [src]="conversation.otherUser.avatarUrl || 'https://ui-avatars.com/api/?name=' + conversation.otherUser.fullName + '&background=059669&color=fff&size=32'"
                            [alt]="conversation.otherUser.fullName"
                            class="w-8 h-8 rounded-full object-cover"
                          />
                          <span class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ conversation.otherUser.fullName }}</span>
                          <app-badge [variant]="getRoleBadgeVariant(conversation.lastMessage?.senderId === conversation.otherUser.id ? 'guest' : 'host')" class="text-xs">
                            {{ conversation.lastMessage?.senderId === conversation.otherUser.id ? 'Guest' : 'Host' }}
                          </app-badge>
                        </div>
                      </div>
                      @if (conversation.lastMessage) {
                        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1 truncate">{{ conversation.lastMessage.body }}</p>
                      }
                    </div>

                    <!-- Unread Indicator -->
                    @if (conversation.unreadCount > 0) {
                      <div class="flex items-center justify-center sm:justify-end">
                        <span class="w-2.5 h-2.5 bg-emerald-500 rounded-full"></span>
                      </div>
                    }
                  </div>
                </app-card>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `,
})
export class MessagesComponent implements OnInit {
  private bookingsService = inject(BookingsService);
  private authService = inject(AuthService);
  private router = inject(Router);

  conversations = signal<Conversation[]>([]);
  isLoading = signal(true);

  ngOnInit() {
    this.loadConversations();
  }

  loadConversations() {
    this.isLoading.set(true);
    this.bookingsService.getConversations().subscribe({
      next: (conversations) => {
        this.conversations.set(conversations);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      },
    });
  }

  formatRelativeTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  }

  getRoleBadgeVariant(role: string): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (role) {
      case 'host': return 'info';
      case 'guest': return 'success';
      default: return 'default';
    }
  }
}