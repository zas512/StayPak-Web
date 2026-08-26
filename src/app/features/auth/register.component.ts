import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { InputComponent } from '../../shared/ui/input.component';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-register',
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
            <p class="text-gray-600 dark:text-gray-400 mt-1">Join StayPak and start exploring</p>
          </div>

          @if (error()) {
            <div class="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-600 dark:text-red-400 text-sm" role="alert">
              {{ error() }}
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-5" #registerForm="ngForm">
            <div class="grid grid-cols-2 gap-4">
              <app-input
                label="First name"
                type="text"
                placeholder="Ahmed"
                [(ngModel)]="formData.firstName"
                name="firstName"
                [required]="true"
                [error]="firstNameError()"
                id="firstName"
                autocomplete="given-name"
              ></app-input>

              <app-input
                label="Last name"
                type="text"
                placeholder="Khan"
                [(ngModel)]="formData.lastName"
                name="lastName"
                [required]="true"
                [error]="lastNameError()"
                id="lastName"
                autocomplete="family-name"
              ></app-input>
            </div>

            <app-input
              label="Email"
              type="email"
              placeholder="you@example.com"
              [(ngModel)]="formData.email"
              name="email"
              [required]="true"
              [error]="emailError()"
              id="email"
              autocomplete="email"
            ></app-input>

            <app-input
              label="Phone (optional)"
              type="tel"
              placeholder="+92 3XX XXXXXXX"
              [(ngModel)]="formData.phone"
              name="phone"
              [error]="phoneError()"
              id="phone"
              autocomplete="tel"
            ></app-input>

            <app-input
              label="Password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="formData.password"
              name="password"
              [required]="true"
              [error]="passwordError()"
              id="password"
              autocomplete="new-password"
              [hint]="passwordHint()"
            ></app-input>

            <app-input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="formData.confirmPassword"
              name="confirmPassword"
              [required]="true"
              [error]="confirmPasswordError()"
              id="confirmPassword"
              autocomplete="new-password"
            ></app-input>

            <div class="flex items-start">
              <input
                type="checkbox"
                [(ngModel)]="agreeTerms"
                name="agreeTerms"
                required
                id="agreeTerms"
                class="w-4 h-4 mt-0.5 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
              >
              <label for="agreeTerms" class="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the <a routerLink="/terms" class="text-emerald-600 dark:text-emerald-400 hover:underline">Terms of Service</a>
                and <a routerLink="/privacy" class="text-emerald-600 dark:text-emerald-400 hover:underline">Privacy Policy</a>
              </label>
            </div>

            <button appButton type="submit" variant="primary" size="lg" class="w-full" [loading]="isLoading()" [disabled]="!!registerForm.invalid">
              Create account
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
          Already have an account? <a routerLink="/auth/login" class="text-emerald-600 dark:text-emerald-400 font-medium hover:underline">Sign in</a>
        </p>
      </div>
    </div>
  `,
})
export class RegisterComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  formData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  };
  agreeTerms = false;
  isLoading = signal(false);
  error = signal('');

  firstNameError = computed(() => {
    if (!this.formData.firstName) return '';
    if (this.formData.firstName.length < 2) return 'At least 2 characters';
    return '';
  });

  lastNameError = computed(() => {
    if (!this.formData.lastName) return '';
    if (this.formData.lastName.length < 2) return 'At least 2 characters';
    return '';
  });

  emailError = computed(() => {
    if (!this.formData.email) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email)) return 'Enter a valid email';
    return '';
  });

  phoneError = computed(() => {
    if (!this.formData.phone) return '';
    if (!/^\+?[0-9\s-]{10,}$/.test(this.formData.phone)) return 'Enter a valid phone number';
    return '';
  });

  passwordError = computed(() => {
    if (!this.formData.password) return '';
    if (this.formData.password.length < 8) return 'At least 8 characters';
    if (!/[A-Z]/.test(this.formData.password)) return 'Include uppercase letter';
    if (!/[a-z]/.test(this.formData.password)) return 'Include lowercase letter';
    if (!/[0-9]/.test(this.formData.password)) return 'Include number';
    return '';
  });

  passwordHint = computed(() => {
    if (!this.formData.password) return 'At least 8 chars with upper, lower, number';
    const errors = [];
    if (this.formData.password.length < 8) errors.push('8+ chars');
    if (!/[A-Z]/.test(this.formData.password)) errors.push('uppercase');
    if (!/[a-z]/.test(this.formData.password)) errors.push('lowercase');
    if (!/[0-9]/.test(this.formData.password)) errors.push('number');
    return errors.length ? `Missing: ${errors.join(', ')}` : 'Strong password!';
  });

  confirmPasswordError = computed(() => {
    if (!this.formData.confirmPassword) return '';
    if (this.formData.confirmPassword !== this.formData.password) return 'Passwords do not match';
    return '';
  });

  async onSubmit() {
    if (
      this.firstNameError() ||
      this.lastNameError() ||
      this.emailError() ||
      this.phoneError() ||
      this.passwordError() ||
      this.confirmPasswordError() ||
      !this.agreeTerms
    ) return;

    this.isLoading.set(true);
    this.error.set('');

    try {
      const { confirmPassword, ...data } = this.formData;
      await this.auth.register(data).toPromise();
    } catch (err: any) {
      this.error.set(err.error?.message || 'Registration failed. Please try again.');
    } finally {
      this.isLoading.set(false);
    }
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}