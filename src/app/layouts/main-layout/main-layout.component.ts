import { Component, signal, computed } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../core/models/user.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <!-- Header -->
      <header class="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex items-center justify-between h-16">
            <!-- Logo -->
            <div class="flex-shrink-0">
              <a routerLink="/" class="flex items-center space-x-2">
                <svg class="w-8 h-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="text-xl font-bold text-gray-900 dark:text-white">StayPak</span>
              </a>
            </div>

            <!-- Navigation -->
            <nav class="hidden md:flex items-center space-x-8" [class]="isAuthenticated() ? '' : 'hidden'">
              <a routerLink="/listings" routerLinkActive="text-emerald-600" class="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">Explore</a>
              <a routerLink="/host/dashboard" routerLinkActive="text-emerald-600" *ngIf="isHost()" class="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">Host Dashboard</a>
              <a routerLink="/trips" routerLinkActive="text-emerald-600" class="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors">Trips</a>
              <a routerLink="/messages" routerLinkActive="text-emerald-600" class="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors relative">
                Messages
                <span *ngIf="unreadCount() > 0" class="absolute -top-2 -right-2 bg-emerald-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">{{ unreadCount() }}</span>
              </a>
            </nav>

            <!-- Actions -->
            <div class="flex items-center space-x-4">
              <!-- Theme Toggle -->
              <button
                (click)="toggleTheme()"
                class="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle theme">
                <svg *ngIf="!isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
                </svg>
                <svg *ngIf="isDark()" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
              </button>

              @if (!isAuthenticated()) {
                <div class="flex items-center space-x-2">
                  <a routerLink="/auth/login" class="text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 font-medium transition-colors hidden sm:block">Log in</a>
                  <a routerLink="/auth/register" class="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors font-medium">Sign up</a>
                </div>
              } @else {
                <!-- User Menu -->
                <div class="relative" #userMenu>
                  <button
                    (click)="toggleUserMenu()"
                    class="flex items-center space-x-2 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                    <img
                      *ngIf="currentUser()?.avatarUrl"
                      [src]="currentUser()!.avatarUrl"
                      alt="{{ currentUser()?.fullName }}"
                      class="w-8 h-8 rounded-full"
                    />
                    <svg *ngIf="!currentUser()?.avatarUrl" class="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-400 flex items-center justify-center" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"></path>
                    </svg>
                    <span class="hidden sm:block text-sm font-medium text-gray-700 dark:text-gray-200">{{ currentUser()?.fullName }}</span>
                    <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  </button>

                  @if (showUserMenu()) {
                    <div class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-1 border border-gray-200 dark:border-gray-700 z-50 animate-fade-in">
                      <div class="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                        <p class="text-sm font-medium text-gray-900 dark:text-white">{{ currentUser()?.fullName }}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">{{ currentUser()?.email }}</p>
                      </div>
                      <a routerLink="/profile" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" (click)="closeUserMenu()">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                        <span>Profile</span>
                      </a>
                      <a routerLink="/trips" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" (click)="closeUserMenu()">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path></svg>
                        <span>Your Trips</span>
                      </a>
                      <a *ngIf="isHost()" routerLink="/host/dashboard" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" (click)="closeUserMenu()">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                        <span>Host Dashboard</span>
                      </a>
                      <a routerLink="/messages" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" (click)="closeUserMenu()">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                        <span>Messages</span>
                      </a>
                      <a routerLink="/settings" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2" (click)="closeUserMenu()">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                        <span>Settings</span>
                      </a>
                      <hr class="my-1 border-gray-200 dark:border-gray-700">
                      <button (click)="logout()" class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                        <span>Log out</span>
                      </button>
                    </div>
                  }
                </div>
              }
            </div>
          </div>
        </div>
      </header>

      <!-- Mobile Menu -->
      <div *ngIf="mobileMenuOpen()" class="md:hidden bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div class="px-4 py-4 space-y-4">
          <a routerLink="/listings" class="block text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" (click)="closeMobileMenu()">Explore</a>
          <a *ngIf="isHost()" routerLink="/host/dashboard" class="block text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" (click)="closeMobileMenu()">Host Dashboard</a>
          <a routerLink="/trips" class="block text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" (click)="closeMobileMenu()">Trips</a>
          <a routerLink="/messages" class="block text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400" (click)="closeMobileMenu()">Messages</a>
          <hr class="border-gray-200 dark:border-gray-700">
          @if (!isAuthenticated()) {
            <a routerLink="/auth/login" class="block text-center bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 py-2 rounded-lg" (click)="closeMobileMenu()">Log in</a>
            <a routerLink="/auth/register" class="block text-center bg-emerald-600 text-white py-2 rounded-lg" (click)="closeMobileMenu()">Sign up</a>
          } @else {
            <button (click)="logout()" class="block w-full text-left text-red-600 dark:text-red-400" (click)="closeMobileMenu()">Log out</button>
          }
        </div>
      </div>

      <!-- Main Content -->
      <main class="min-h-[calc(100vh-64px)]">
        <router-outlet></router-outlet>
      </main>

      <!-- Footer -->
      <footer class="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">StayPak</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">Your trusted marketplace for stays across Pakistan.</p>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Discover</h4>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a routerLink="/listings" class="hover:text-emerald-600 dark:hover:text-emerald-400">All Listings</a></li>
                <li><a routerLink="/listings" class="hover:text-emerald-600 dark:hover:text-emerald-400" [queryParams]="{city: 'Karachi'}">Karachi</a></li>
                <li><a routerLink="/listings" class="hover:text-emerald-600 dark:hover:text-emerald-400" [queryParams]="{city: 'Lahore'}">Lahore</a></li>
                <li><a routerLink="/listings" class="hover:text-emerald-600 dark:hover:text-emerald-400" [queryParams]="{city: 'Islamabad'}">Islamabad</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Support</h4>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a routerLink="/help" class="hover:text-emerald-600 dark:hover:text-emerald-400">Help Center</a></li>
                <li><a routerLink="/safety" class="hover:text-emerald-600 dark:hover:text-emerald-400">Safety</a></li>
                <li><a routerLink="/terms" class="hover:text-emerald-600 dark:hover:text-emerald-400">Terms</a></li>
                <li><a routerLink="/privacy" class="hover:text-emerald-600 dark:hover:text-emerald-400">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 class="font-medium text-gray-900 dark:text-white mb-3">Host</h4>
              <ul class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a routerLink="/host" class="hover:text-emerald-600 dark:hover:text-emerald-400">List Your Property</a></li>
                <li><a routerLink="/host/guide" class="hover:text-emerald-600 dark:hover:text-emerald-400">Hosting Guide</a></li>
                <li><a routerLink="/host/resources" class="hover:text-emerald-600 dark:hover:text-emerald-400">Resources</a></li>
              </ul>
            </div>
          </div>
          <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>&copy; 2025 StayPak. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from { opacity: 0; transform: translateY(-4px); }
      to { opacity: 1; transform: translateY(0); }
    }
    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }
  `],
})
export class MainLayoutComponent {
  mobileMenuOpen = signal(false);
  showUserMenu = signal(false);
  unreadCount = signal(0);
  isDark = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
  ) {}

  get isAuthenticated() {
    return this.auth.isAuthenticated;
  }

  get currentUser() {
    return this.auth.currentUser;
  }

  isHost = computed(() => {
    const user = this.currentUser();
    return user && (user.role === 'host' || user.role === 'both');
  });

  ngOnInit() {
    this.initTheme();
    this.loadUnreadCount();
  }

  initTheme() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    this.isDark.set(isDark);
    this.applyTheme(isDark);
  }

  toggleTheme() {
    const newValue = !this.isDark();
    this.isDark.set(newValue);
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    this.applyTheme(newValue);
  }

  applyTheme(isDark: boolean) {
    document.documentElement.classList.toggle('dark', isDark);
  }

  toggleUserMenu() {
    this.showUserMenu.update((v) => !v);
  }

  closeUserMenu() {
    this.showUserMenu.set(false);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update((v) => !v);
  }

  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
  }

  logout() {
    this.auth.logout();
    this.closeUserMenu();
    this.closeMobileMenu();
  }

  loadUnreadCount() {
    // Would call messages service to get unread count
  }
}