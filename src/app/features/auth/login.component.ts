import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { InputComponent } from '../../shared/ui/input.component';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, InputComponent, CardComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div class="max-w-md w-full">
        <!-- Back to home -->
        <a routerLink="/" class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-8 transition-colors">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to StayPak
        </a>

        <app-card>
          <div slot="header" class="text-center">
            <div class="w-12 h-12 mx-auto mb-4 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center">
              <svg class="w-7 h-7 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Sign in to your account</p>
          </div>

          @if (error()) {
            <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert">
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-5" #loginForm="ngForm">
            <app-input
              label="Email"
              type="email"
              placeholder="you@example.com"
              [(ngModel)]="credentials.email"
              name="email"
              [required]="true"
              [error]="emailError()"
              id="email"
              autocomplete="email"
            ></app-input>

            <app-input
              label="Password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="credentials.password"
              name="password"
              [required]="true"
              [error]="passwordError()"
              id="password"
              autocomplete="current-password"
            ></app-input>

            <div class="flex items-center justify-between">
              <label class="flex items-center">
                <input type="checkbox" [(ngModel)]="rememberMe" name="rememberMe" class="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500">
                <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
              </label>
              <a routerLink="/auth/forgot-password" class="text-sm text-emerald-600 dark:text-emerald-400 hover:underline">Forgot password?</a>
            </div>

            <button appButton type="submit" variant="primary" size="lg" class="w-full" [loading]="isLoading()" [disabled]="!!loginForm.invalid">
              Sign in
            </button>
          </form>

          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700"></div>
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Or continue with</span>
            </div>
          </div>

          <button
            type="button"
            (click)="googleLogin()"
            appButton
            variant="outline"
            size="lg"
            class="w-full"
            [loading]="isLoading()">
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
          </button>
        </app-card>

        <p class="mt-6 text-center text-gray-600 dark:text-gray-400">
          Don't have an account? <a routerLink="/auth/register" class="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Sign up</a>
        </p>
      </div>
    </div>
  `,
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  credentials = { email: '', password: '' };
  rememberMe = false;
  isLoading = signal(false);
  error = signal('');

  emailError = computed(() => {
    if (!this.credentials.email) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.credentials.email)) return 'Enter a valid email';
    return '';
  });

  passwordError = computed(() => {
    if (!this.credentials.password) return '';
    if (this.credentials.password.length < 8) return 'Password must be at least 8 characters';
    return '';
  });

  async onSubmit() {
    if (this.emailError() || this.passwordError()) return;

    this.isLoading.set(true);
    this.error.set('');

    try {
      await this.auth.login(this.credentials).toPromise();
    } catch (err: any) {
      this.error.set(err.error?.message || 'Invalid email or password');
    } finally {
      this.isLoading.set(false);
    }
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}