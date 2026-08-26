import { Component, signal, computed, inject, OnInit, OnDestroy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { BookingsService } from '../../core/services/bookings.service';
import { AuthService } from '../../core/services/auth.service';
import { Message, Conversation } from '../../core/models/booking.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { InputComponent } from '../../shared/ui/input.component';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-message-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, InputComponent, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      @if (isLoading()) {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <app-card class="animate-pulse h-[60vh] flex flex-col">
            <div class="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex gap-4">
                <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div class="flex-1 space-y-1">
                  <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/6"></div>
                </div>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              @for (i of [1,2,3,4,5]; track i) {
                <div class="flex gap-3">
                  <div class="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                  <div class="flex-1 space-y-1">
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                    <div class="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                  </div>
                </div>
              }
            </div>
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex gap-2">
                <div class="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg flex-1"></div>
                <div class="h-10 w-10 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>
          </app-card>
        </div>
      } @else if (!conversation()) {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
          </svg>
          <h3 class="text-xl font-medium text-gray-900 dark:text-white mb-2">Conversation not found</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-4">This conversation may have been removed.</p>
          <a routerLink="/messages" appButton variant="primary">Back to messages</a>
        </div>
      } @else {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <!-- Header -->
          <div class="mb-6">
            <a routerLink="/messages" class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-4 transition-colors">
              <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
              </svg>
              Back to messages
            </a>
            <div class="flex items-start gap-4">
              <a [routerLink]="['/listings', conversation()!.listing.id]" class="flex-shrink-0">
                <img
                  [src]="conversation()!.listing.photos?.[0]?.cdnUrl || 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=200'"
                  [alt]="conversation()!.listing.title"
                  class="w-16 h-16 rounded-lg object-cover"
                />
              </a>
              <div class="flex-1 min-w-0">
                <a [routerLink]="['/listings', conversation()!.listing.id]" class="group">
                  <h1 class="text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors truncate">
                    {{ conversation()!.listing.title }}
                  </h1>
                </a>
                <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ conversation()!.listing.city }}</p>
                <div class="flex items-center gap-3 mt-2">
                  <img
                    [src]="conversation()!.otherUser.avatarUrl || 'https://ui-avatars.com/api/?name=' + conversation()!.otherUser.fullName + '&background=059669&color=fff&size=32'"
                    [alt]="conversation()!.otherUser.fullName"
                    class="w-8 h-8 rounded-full object-cover"
                  />
                  <span class="text-sm font-medium text-gray-900 dark:text-white">{{ conversation()!.otherUser.fullName }}</span>
                  <app-badge [variant]="isCurrentUserGuest() ? 'success' : 'info'" class="text-xs">
                    {{ isCurrentUserGuest() ? 'Guest' : 'Host' }}
                  </app-badge>
                </div>
              </div>
            </div>
          </div>

          <!-- Messages -->
          <app-card class="h-[65vh] flex flex-col">
            <div class="flex-1 overflow-y-auto p-4 space-y-4" #messagesContainer>
              @if (messages().length === 0) {
                <div class="text-center py-12 text-gray-500 dark:text-gray-400">
                  <p>No messages yet. Start the conversation!</p>
                </div>
              } @else {
                @for (message of messages(); track message.id) {
                  <div class="flex" [class.justify-end]="message.senderId === currentUserId()">
                    <div class="max-w-[70%] flex flex-col" [class.items-end]="message.senderId === currentUserId()">
                      @if (message.senderId !== currentUserId()) {
                        <p class="text-xs text-gray-500 dark:text-gray-400 mb-1 ml-1">{{ message.sender?.fullName }}</p>
                      }
                      <div
                        class="px-4 py-2 rounded-2xl"
                        [class]="message.senderId === currentUserId()
                          ? 'bg-emerald-600 text-white rounded-tr-md'
                          : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-tl-md border border-gray-100 dark:border-gray-700'">
                        <p class="text-sm whitespace-pre-wrap">{{ message.body }}</p>
                        <p class="text-xs mt-1 opacity-70 text-right">{{ formatTime(message.sentAt) }}</p>
                      </div>
                      @if (message.senderId === currentUserId() && !message.isRead) {
                        <p class="text-xs text-gray-400 dark:text-gray-500 mt-1 mr-1">Sent</p>
                      } @else if (message.senderId === currentUserId() && message.isRead) {
                        <p class="text-xs text-emerald-500 mt-1 mr-1">Read</p>
                      }
                    </div>
                    <img
                      [src]="message.senderId === currentUserId() ? (this.authService.currentUser()?.avatarUrl || 'https://ui-avatars.com/api/?name=User&background=059669&color=fff') : (conversation()!.otherUser.avatarUrl || 'https://ui-avatars.com/api/?name=' + conversation()!.otherUser.fullName + '&background=059669&color=fff')"
                      [alt]="message.senderId === currentUserId() ? 'You' : conversation()!.otherUser.fullName"
                      class="w-8 h-8 rounded-full object-cover ml-2"
                    />
                  </div>
                }
              }
            </div>

            <!-- Message Input -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <form (ngSubmit)="sendMessage()" class="flex gap-2" #messageForm="ngForm">
                <input
                  type="text"
                  [(ngModel)]="newMessage"
                  name="newMessage"
                  placeholder="Type a message..."
                  required
                  class="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  #messageInput
                />
                <button
                  appButton
                  type="submit"
                  variant="primary"
                  [loading]="isSending()"
                  [disabled]="messageForm.invalid || !newMessage.trim()"
                  class="h-10">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </form>
            </div>
          </app-card>
        </div>
      }
    </div>
  `,
})
export class MessageThreadComponent implements OnInit, OnDestroy {
  private bookingsService = inject(BookingsService);
  protected authService = inject(AuthService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  conversation = signal<Conversation | null>(null);
  messages = signal<Message[]>([]);
  isLoading = signal(true);
  isSending = signal(false);
  newMessage = '';
  currentUserId = signal<string>('');
  private pollingInterval: any;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) this.currentUserId.set(user.id);

    this.route.paramMap.subscribe((params) => {
      const bookingId = params.get('bookingId');
      if (bookingId) {
        this.loadConversation(bookingId);
        this.startPolling(bookingId);
      }
    });
  }

  ngOnDestroy() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
    }
  }

  loadConversation(bookingId: string) {
    this.isLoading.set(true);
    this.bookingsService.getMessages(bookingId).subscribe({
      next: (response: any) => {
        this.messages.set(response.data || []);
        this.isLoading.set(false);
        this.scrollToBottom();
      },
      error: () => {
        this.isLoading.set(false);
      },
    });

    this.bookingsService.getConversations().subscribe({
      next: (conversations) => {
        const conv = conversations.find(c => c.bookingId === bookingId);
        if (conv) this.conversation.set(conv);
      },
    });
  }

  startPolling(bookingId: string) {
    this.pollingInterval = setInterval(() => {
      this.bookingsService.getMessages(bookingId).subscribe({
        next: (response: any) => {
          const newMessages = response.data || [];
          if (newMessages.length > this.messages().length) {
            this.messages.set(newMessages);
            this.scrollToBottom();
          }
        },
      });
    }, 5000);
  }

  isCurrentUserGuest = computed(() => {
    const user = this.authService.currentUser();
    const conv = this.conversation();
    return !!user && !!conv && conv.lastMessage?.senderId !== user.id;
  });

  async sendMessage() {
    if (!this.newMessage.trim() || !this.conversation()) return;

    this.isSending.set(true);
    const messageText = this.newMessage;
    this.newMessage = '';

    try {
      await this.bookingsService.sendMessage({
        bookingId: this.conversation()!.bookingId,
        body: messageText,
      }).toPromise();

      // Reload messages
      this.loadConversation(this.conversation()!.bookingId);
    } catch (err: any) {
      this.newMessage = messageText;
      alert(err.error?.message || 'Failed to send message');
    } finally {
      this.isSending.set(false);
    }
  }

  formatTime(dateStr: string): string {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }

  private scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector('#messagesContainer') as HTMLElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }, 0);
  }
}