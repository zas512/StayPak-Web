import { CommonModule } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';
import { InputComponent } from '../../shared/ui/input.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, InputComponent, CardComponent],
  template: `
    <div
      class="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-linear-to-br from-gray-50 via-white to-emerald-50/30 dark:from-gray-950 dark:via-gray-900 dark:to-emerald-950/20"
    >
      <div class="sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <!-- Brand & Back navigation -->
        <div class="flex items-center justify-between mb-6">
          <a
            routerLink="/"
            class="inline-flex items-center text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors group"
          >
            <svg
              class="w-4 h-4 mr-1.5 transform group-hover:-translate-x-1 transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
            Back to StayPak
          </a>
          <div
            class="flex items-center space-x-1 text-xs text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/60 px-2.5 py-1 rounded-full"
          >
            <span class="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Pakistan</span>
          </div>
        </div>

        <app-card>
          <div slot="header" class="text-center pb-2">
            <div
              class="w-12 h-12 mx-auto mb-3.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center shadow-inner"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                ></path>
              </svg>
            </div>
            <h1 class="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Create your account
            </h1>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Find and book verified stays across Pakistan
            </p>
          </div>

          <!-- Server Error Alert -->
          @if (error()) {
            <div
              class="mb-5 p-3.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl text-red-600 dark:text-red-400 text-sm flex items-start gap-2.5 animate-fadeIn"
              role="alert"
            >
              <svg
                class="w-5 h-5 shrink-0 mt-0.5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
              <div class="flex-1 font-medium">{{ error() }}</div>
            </div>
          }

          <form (ngSubmit)="onSubmit()" class="space-y-4" novalidate>
            <!-- First Name & Last Name -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <app-input
                label="First name"
                type="text"
                placeholder="Ahmed"
                [(ngModel)]="formData.firstName"
                (ngModelChange)="markTouched('firstName')"
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
                (ngModelChange)="markTouched('lastName')"
                name="lastName"
                [required]="true"
                [error]="lastNameError()"
                id="lastName"
                autocomplete="family-name"
              ></app-input>
            </div>

            <!-- Email -->
            <app-input
              label="Email address"
              type="email"
              placeholder="ahmed.khan@example.com"
              [(ngModel)]="formData.email"
              (ngModelChange)="markTouched('email')"
              name="email"
              [required]="true"
              [error]="emailError()"
              id="email"
              autocomplete="email"
            ></app-input>

            <!-- Pakistani Phone -->
            <div>
              <app-input
                label="Mobile number"
                type="tel"
                placeholder="0300 1234567 or +92 300 1234567"
                [(ngModel)]="formData.phone"
                (ngModelChange)="markTouched('phone')"
                name="phone"
                [required]="true"
                [error]="phoneError()"
                hint="Used for booking confirmations and host communication"
                id="phone"
                autocomplete="tel"
              ></app-input>
            </div>

            <!-- Password -->
            <div>
              <app-input
                label="Password"
                type="password"
                placeholder="••••••••"
                [(ngModel)]="formData.password"
                (ngModelChange)="markTouched('password')"
                name="password"
                [required]="true"
                [error]="passwordError()"
                id="password"
                autocomplete="new-password"
              ></app-input>

              <!-- Live Password Strength Meter -->
              @if (formData.password) {
                <div class="mt-2 space-y-1.5 animate-fadeIn">
                  <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-500 dark:text-gray-400">Password strength:</span>
                    <span
                      class="font-semibold"
                      [ngClass]="{
                        'text-red-500': passwordStrength() === 'Weak',
                        'text-amber-500': passwordStrength() === 'Fair',
                        'text-blue-500': passwordStrength() === 'Good',
                        'text-emerald-500': passwordStrength() === 'Strong',
                      }"
                    >
                      {{ passwordStrength() }}
                    </span>
                  </div>
                  <div
                    class="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden flex gap-1"
                  >
                    <div
                      class="h-full rounded-full transition-all duration-300"
                      [ngClass]="{
                        'w-1/4 bg-red-500': passwordStrengthScore() >= 1,
                        'w-2/4 bg-amber-500': passwordStrengthScore() >= 2,
                        'w-3/4 bg-blue-500': passwordStrengthScore() >= 3,
                        'w-full bg-emerald-500': passwordStrengthScore() === 4,
                      }"
                    ></div>
                  </div>
                </div>
              }
            </div>

            <!-- Confirm Password -->
            <app-input
              label="Confirm password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="formData.confirmPassword"
              (ngModelChange)="markTouched('confirmPassword')"
              name="confirmPassword"
              [required]="true"
              [error]="confirmPasswordError()"
              id="confirmPassword"
              autocomplete="new-password"
            ></app-input>

            <!-- Terms and conditions -->
            <div class="pt-1">
              <label class="flex items-start cursor-pointer group">
                <input
                  type="checkbox"
                  [(ngModel)]="agreeTerms"
                  (ngModelChange)="markTouched('terms')"
                  name="agreeTerms"
                  id="agreeTerms"
                  class="w-4 h-4 mt-0.5 text-emerald-600 rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 focus:ring-emerald-500 focus:ring-offset-0 cursor-pointer transition-colors"
                />
                <span
                  class="ml-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-400 leading-tight select-none"
                >
                  I agree to StayPak's
                  <a
                    routerLink="/terms"
                    class="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                    target="_blank"
                    >Terms of Service</a
                  >
                  and
                  <a
                    routerLink="/privacy"
                    class="text-emerald-600 dark:text-emerald-400 font-medium hover:underline"
                    target="_blank"
                    >Privacy Policy</a
                  >
                </span>
              </label>
              @if (submitted() && !agreeTerms) {
                <p class="mt-1.5 text-xs text-red-500 dark:text-red-400 font-medium animate-fadeIn">
                  Please accept the terms and conditions to proceed
                </p>
              }
            </div>

            <!-- Submit Button -->
            <button
              appButton
              type="submit"
              variant="primary"
              size="lg"
              class="w-full mt-2 shadow-sm shadow-emerald-500/10 font-semibold"
              [loading]="isLoading()"
              [disabled]="isLoading()"
            >
              @if (isLoading()) {
                <span class="inline-flex items-center gap-2">
                  <svg class="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle
                      class="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      stroke-width="4"
                    ></circle>
                    <path
                      class="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Creating account...
                </span>
              } @else {
                <span>Create account</span>
              }
            </button>
          </form>

          <!-- Divider -->
          <div class="relative my-6">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-200 dark:border-gray-700/80"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase tracking-wider">
              <span
                class="px-3 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-500 font-medium"
              >
                Or continue with
              </span>
            </div>
          </div>

          <!-- Google Button -->
          <button
            type="button"
            (click)="googleLogin()"
            appButton
            variant="outline"
            size="lg"
            class="w-full text-sm font-medium border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            [disabled]="isLoading()"
          >
            <svg class="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </app-card>

        <!-- Sign in footer -->
        <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?
          <a
            routerLink="/auth/login"
            class="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline ml-1"
            >Sign in</a
          >
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
  submitted = signal(false);
  touchedFields = signal<{ [key: string]: boolean }>({});

  markTouched(field: string) {
    this.touchedFields.update((t) => ({ ...t, [field]: true }));
  }

  isFieldActive(field: string): boolean {
    return this.submitted() || !!this.touchedFields()[field];
  }

  firstNameError = computed(() => {
    if (!this.isFieldActive('firstName') && !this.formData.firstName) return '';
    if (!this.formData.firstName.trim()) return 'First name is required';
    if (this.formData.firstName.trim().length < 2)
      return 'First name must be at least 2 characters';
    return '';
  });

  lastNameError = computed(() => {
    if (!this.isFieldActive('lastName') && !this.formData.lastName) return '';
    if (!this.formData.lastName.trim()) return 'Last name is required';
    if (this.formData.lastName.trim().length < 2) return 'Last name must be at least 2 characters';
    return '';
  });

  emailError = computed(() => {
    if (!this.isFieldActive('email') && !this.formData.email) return '';
    if (!this.formData.email.trim()) return 'Email address is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.formData.email.trim())) {
      return 'Please enter a valid email address';
    }
    return '';
  });

  phoneError = computed(() => {
    if (!this.isFieldActive('phone') && !this.formData.phone) return '';
    if (!this.formData.phone.trim()) return 'Phone number is required';
    const cleaned = this.formData.phone.trim().replace(/[\s-]/g, '');
    if (!/^(\+92|0)\d{10}$/.test(cleaned)) {
      return 'Enter a valid Pakistani mobile number (e.g. 03001234567 or +923001234567)';
    }
    return '';
  });

  passwordStrengthScore = computed(() => {
    const pwd = this.formData.password;
    if (!pwd) return 0;
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    return score;
  });

  passwordStrength = computed(() => {
    const score = this.passwordStrengthScore();
    if (score <= 1) return 'Weak';
    if (score === 2) return 'Fair';
    if (score === 3) return 'Good';
    return 'Strong';
  });

  passwordError = computed(() => {
    if (!this.isFieldActive('password') && !this.formData.password) return '';
    if (!this.formData.password) return 'Password is required';
    if (this.formData.password.length < 8) return 'Password must be at least 8 characters';
    if (!/[A-Z]/.test(this.formData.password)) return 'Include at least one uppercase letter';
    if (!/[a-z]/.test(this.formData.password)) return 'Include at least one lowercase letter';
    if (!/[0-9]/.test(this.formData.password)) return 'Include at least one number';
    return '';
  });

  confirmPasswordError = computed(() => {
    if (!this.isFieldActive('confirmPassword') && !this.formData.confirmPassword) return '';
    if (!this.formData.confirmPassword) return 'Please confirm your password';
    if (this.formData.confirmPassword !== this.formData.password) {
      return 'Passwords do not match';
    }
    return '';
  });

  async onSubmit() {
    this.submitted.set(true);

    if (
      this.firstNameError() ||
      this.lastNameError() ||
      this.emailError() ||
      this.phoneError() ||
      this.passwordError() ||
      this.confirmPasswordError() ||
      !this.agreeTerms
    ) {
      return;
    }

    this.isLoading.set(true);
    this.error.set('');

    try {
      const { confirmPassword, ...data } = this.formData;
      let formattedPhone = data.phone.trim().replace(/[\s-]/g, '');
      if (formattedPhone.startsWith('0')) {
        formattedPhone = `+92${formattedPhone.substring(1)}`;
      }
      const fullName = `${data.firstName.trim()} ${data.lastName.trim()}`.trim();

      await this.auth
        .register({
          email: data.email.trim().toLowerCase(),
          password: data.password,
          phone: formattedPhone,
          fullName,
          firstName: data.firstName.trim(),
          lastName: data.lastName.trim(),
        })
        .toPromise();
    } catch (err: any) {
      const msg = err?.error?.message;
      if (Array.isArray(msg)) {
        this.error.set(msg.join(', '));
      } else if (typeof msg === 'string') {
        this.error.set(msg);
      } else {
        this.error.set('Registration failed. Please check your network and try again.');
      }
    } finally {
      this.isLoading.set(false);
    }
  }

  googleLogin() {
    this.auth.googleLogin();
  }
}
