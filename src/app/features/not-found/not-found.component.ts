import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button.component';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent, CardComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
      <div class="text-center max-w-md">
        <!-- 404 Animation -->
        <div class="mb-8 relative">
          <div class="relative inline-block">
            <span class="text-9xl font-bold text-emerald-600/20 dark:text-emerald-400/20">4</span>
            <span class="absolute inset-0 flex items-center justify-center">
              <svg class="w-40 h-40 text-emerald-600/10 dark:text-emerald-400/10 animate-spin" fill="none" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" stroke-width="4" stroke-dasharray="180 100" stroke-linecap="round"></circle>
              </svg>
            </span>
            <span class="relative text-9xl font-bold text-emerald-600 dark:text-emerald-400">4</span>
          </div>
        </div>

        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">Page Not Found</h1>
        <p class="text-gray-600 dark:text-gray-400 mb-8">
          Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
        </p>

        <div class="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <a routerLink="/" appButton variant="primary" size="lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Go Home
          </a>
          <a routerLink="/listings" appButton variant="outline" size="lg">
            <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            Browse Stays
          </a>
        </div>

        <!-- Helpful Links -->
        <app-card class="text-left">
          <h3 class="font-semibold text-gray-900 dark:text-white mb-4">Popular destinations</h3>
          <div class="flex flex-wrap gap-2">
            @for (city of cities; track city) {
              <a [routerLink]="['/listings']" [queryParams]="{city: city.toLowerCase()}" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline px-3 py-1 bg-emerald-50 dark:bg-emerald-900/20 rounded-full transition-colors">
                {{ city }}
              </a>
            }
          </div>
        </app-card>

        <!-- Support Links -->
        <div class="mt-8 space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <p>Need help?</p>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/help" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Help Center</a>
            <a routerLink="/safety" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Safety</a>
            <a routerLink="/terms" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms</a>
            <a routerLink="/privacy" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy</a>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class NotFoundComponent {
  cities = ['Karachi', 'Lahore', 'Islamabad', 'Murree', 'Hunza', 'Skardu', 'Swat', 'Multan', 'Peshawar', 'Quetta'];
}