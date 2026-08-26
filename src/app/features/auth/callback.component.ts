import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { CardComponent } from '../../shared/ui/card.component';

@Component({
  selector: 'app-auth-callback',
  standalone: true,
  imports: [CommonModule, ButtonDirective, CardComponent],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4 py-12">
      <div class="max-w-md w-full text-center">
        <app-card>
          <div slot="header">
            <div class="mx-auto w-12 h-12 mb-4 rounded-full flex items-center justify-center" [class]="spinnerClass()">
              @if (!isError() && !isSuccess()) {
                <svg class="animate-spin w-7 h-7 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              } @else if (isSuccess()) {
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              } @else {
                <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              }
            </div>
            <h1 class="text-xl font-bold text-gray-900 dark:text-white">
              @if (!isError() && !isSuccess()) {
                Completing sign in...
              } @else if (isSuccess()) {
                Welcome!
              } @else {
                Something went wrong
              }
            </h1>
          </div>

          <div class="text-center">
            <p class="text-gray-600 dark:text-gray-400 mb-6">
              @if (!isError() && !isSuccess()) {
                Please wait while we complete your authentication.
              } @else if (isSuccess()) {
                You've been signed in successfully. Redirecting...
              } @else {
                {{ errorMessage() }}
              }
            </p>

            @if (isError()) {
              <div class="space-y-3">
                <button appButton variant="primary" (click)="retry()" [loading]="isRetrying()">
                  Try again
                </button>
                <button appButton variant="ghost" routerLink="/auth/login">
                  Back to login
                </button>
              </div>
            }
          </div>
        </app-card>
      </div>
    </div>
  `,
})
export class AuthCallbackComponent implements OnInit {
  private auth = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  isLoading = signal(true);
  isError = signal(false);
  isSuccess = signal(false);
  isRetrying = signal(false);
  errorMessage = signal('');

  spinnerClass = computed(() => {
    if (this.isSuccess()) return 'bg-emerald-500';
    if (this.isError()) return 'bg-red-500';
    return 'bg-emerald-500';
  });

  ngOnInit() {
    this.handleCallback();
  }

  async handleCallback() {
    const fragment = this.route.snapshot.fragment;
    const queryParams = this.route.snapshot.queryParams;

    // Handle OAuth callback with fragment (access_token in URL fragment)
    if (fragment) {
      const params = new URLSearchParams(fragment);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      const error = params.get('error');

      if (error) {
        this.setError(`Authentication failed: ${error}`);
        return;
      }

      if (accessToken && refreshToken) {
        try {
          await this.auth.handleOAuthCallback(accessToken, refreshToken).toPromise();
          this.setSuccess();
        } catch (err: any) {
          this.setError(err.error?.message || 'Failed to complete sign in');
        }
      } else {
        this.setError('Invalid authentication response');
      }
    }
    // Handle OAuth callback with query params (some providers)
    else if (queryParams['access_token'] && queryParams['refresh_token']) {
      try {
        await this.auth.handleOAuthCallback(queryParams['access_token'], queryParams['refresh_token']).toPromise();
        this.setSuccess();
      } catch (err: any) {
        this.setError(err.error?.message || 'Failed to complete sign in');
      }
    }
    // Handle error in query params
    else if (queryParams['error']) {
      this.setError(`Authentication failed: ${queryParams['error']}`);
    }
    else {
      this.setError('No authentication data received');
    }
  }

  setSuccess() {
    this.isLoading.set(false);
    this.isSuccess.set(true);
    // Redirect after short delay
    setTimeout(() => {
      this.router.navigate(['/']);
    }, 1500);
  }

  setError(message: string) {
    this.isLoading.set(false);
    this.isError.set(true);
    this.errorMessage.set(message);
  }

  async retry() {
    this.isRetrying.set(true);
    this.isError.set(false);
    this.errorMessage.set('');
    await this.handleCallback();
    this.isRetrying.set(false);
  }
}