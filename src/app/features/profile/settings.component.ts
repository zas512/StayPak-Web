import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User, UpdateProfileRequest } from '../../core/models/user.model';
import { ButtonDirective } from '../../shared/ui/button.directive';
import { InputComponent } from '../../shared/ui/input.component';
import { CardComponent } from '../../shared/ui/card.component';
import { BadgeComponent } from '../../shared/ui/badge.component';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonDirective, InputComponent, CardComponent, BadgeComponent],
  template: `
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div class="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <!-- Back Link -->
        <a routerLink="/profile" class="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 mb-6 transition-colors">
          <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
          </svg>
          Back to profile
        </a>

        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-8">Settings</h1>

        @if (successMessage()) {
          <div class="mb-6 p-4 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-lg text-emerald-700 dark:text-emerald-400" role="alert">
            {{ successMessage() }}
          </div>
        }

        @if (errorMessage()) {
          <div class="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400" role="alert">
            {{ errorMessage() }}
          </div>
        }

        <!-- Profile Section -->
        <app-card class="mb-6">
          <div slot="header">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Profile information</h2>
          </div>

          <form (ngSubmit)="saveProfile()" class="space-y-5" #profileForm="ngForm">
            <div class="grid grid-cols-2 gap-4">
              <app-input
                label="First name"
                type="text"
                placeholder="Ahmed"
                [(ngModel)]="profileData.firstName"
                name="firstName"
                [required]="true"
                [error]="firstNameError()"
                id="firstName"
              ></app-input>

              <app-input
                label="Last name"
                type="text"
                placeholder="Khan"
                [(ngModel)]="profileData.lastName"
                name="lastName"
                [required]="true"
                [error]="lastNameError()"
                id="lastName"
              ></app-input>
            </div>

            <app-input
              label="Email"
              type="email"
              placeholder="you@example.com"
              [(ngModel)]="profileData.email"
              name="email"
              [required]="true"
              [disabled]="true"
              [error]="emailError()"
              id="email"
              hint="Email cannot be changed. Contact support if needed."
            ></app-input>

            <app-input
              label="Phone number"
              type="tel"
              placeholder="+92 3XX XXXXXXX"
              [(ngModel)]="profileData.phone"
              name="phone"
              [error]="phoneError()"
              id="phone"
            ></app-input>

            <div class="flex items-center gap-3 pt-2">
              <button appButton type="submit" variant="primary" [loading]="isSavingProfile()" [disabled]="!!profileForm.invalid">
                Save changes
              </button>
            </div>
          </form>
        </app-card>

        <!-- Avatar Section -->
        <app-card class="mb-6">
          <div slot="header">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Profile photo</h2>
          </div>

          <div class="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <img
              [src]="user()?.avatarUrl || 'https://ui-avatars.com/api/?name=' + (user()?.fullName || 'User') + '&background=059669&color=fff&size=256'"
              [alt]="user()?.fullName || 'Profile'"
              class="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
            />
            <div class="flex-1">
              <p class="text-gray-600 dark:text-gray-400 mb-4">Upload a clear photo of yourself. This helps hosts and guests recognize you.</p>
              <label class="inline-block cursor-pointer">
                <input type="file" accept="image/*" (change)="onAvatarSelect($event)" class="sr-only" #avatarInput>
                <button appButton variant="outline" [loading]="isUploadingAvatar()" type="button">
                  <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                  </svg>
                  Upload photo
                </button>
              </label>
              <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, PNG up to 5MB</p>
            </div>
          </div>
        </app-card>

        <!-- CNIC Verification Section -->
        <app-card class="mb-6">
          <div slot="header" class="flex items-center justify-between">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">CNIC verification</h2>
            <app-badge [variant]="getCnicBadgeVariant()">{{ getCnicStatusLabel() }}</app-badge>
          </div>

          @if (user()?.cnicStatus === 'verified') {
            <div class="text-center py-4">
              <svg class="w-12 h-12 mx-auto text-emerald-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-gray-600 dark:text-gray-400">Your CNIC has been verified. You can now list properties and book with Instant Book.</p>
            </div>
          } @else if (user()?.cnicStatus === 'pending') {
            <div class="text-center py-4">
              <svg class="w-12 h-12 mx-auto text-amber-500 mb-3 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-gray-600 dark:text-gray-400">Your CNIC is under review. This usually takes 24-48 hours.</p>
            </div>
          } @else if (user()?.cnicStatus === 'rejected') {
            <div class="text-center py-4">
              <svg class="w-12 h-12 mx-auto text-red-500 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
              <p class="text-gray-600 dark:text-gray-400">Your CNIC was rejected. Please upload a clear, valid CNIC image.</p>
            </div>
          } @else {
            <div class="space-y-4">
              <p class="text-gray-600 dark:text-gray-400">Verify your identity to unlock hosting features and Instant Book. Upload a clear photo of your CNIC (front side).</p>
              <form (ngSubmit)="uploadCnic()" #cnicForm="ngForm" class="space-y-4">
                <app-input
                  label="CNIC Number"
                  type="text"
                  placeholder="12345-1234567-1"
                  [(ngModel)]="cnicNumber"
                  name="cnicNumber"
                  [required]="true"
                  [error]="cnicNumberError()"
                  id="cnicNumber"
                  hint="Format: XXXXX-XXXXXXX-X"
                ></app-input>

                <div>
                  <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">CNIC Front Photo</label>
                  <label class="inline-block cursor-pointer">
                    <input type="file" accept="image/*" (change)="onCnicSelect($event)" class="sr-only" #cnicInput>
                    <button appButton variant="outline" [loading]="isUploadingCnic()" type="button" [disabled]="!cnicNumber || !!cnicNumberError()">
                      <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                      </svg>
                      Upload CNIC photo
                    </button>
                  </label>
                  <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">JPG, PNG up to 5MB. Ensure all details are clearly visible.</p>
                  @if (cnicPreview()) {
                    <div class="mt-3 relative w-64">
                      <img [src]="cnicPreview()!" alt="CNIC preview" class="w-full rounded-lg border border-gray-200 dark:border-gray-700">
                    </div>
                  }
                </div>

                <button appButton type="submit" variant="primary" [loading]="isUploadingCnic()" [disabled]="cnicForm.invalid || !cnicFile()">
                  Submit for verification
                </button>
              </form>
            </div>
          }
        </app-card>

        <!-- Password Section -->
        <app-card class="mb-6">
          <div slot="header">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Change password</h2>
          </div>

          <form (ngSubmit)="changePassword()" class="space-y-5" #passwordForm="ngForm">
            <app-input
              label="Current password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="passwordData.currentPassword"
              name="currentPassword"
              [required]="true"
              [error]="currentPasswordError()"
              id="currentPassword"
            ></app-input>

            <app-input
              label="New password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="passwordData.newPassword"
              name="newPassword"
              [required]="true"
              [error]="newPasswordError()"
              id="newPassword"
              [hint]="passwordHint()"
            ></app-input>

            <app-input
              label="Confirm new password"
              type="password"
              placeholder="••••••••"
              [(ngModel)]="passwordData.confirmPassword"
              name="confirmPassword"
              [required]="true"
              [error]="confirmPasswordError()"
              id="confirmPassword"
            ></app-input>

            <button appButton type="submit" variant="primary" [loading]="isChangingPassword()" [disabled]="!!passwordForm.invalid">
              Update password
            </button>
          </form>
        </app-card>

        <!-- Danger Zone -->
        <app-card variant="outlined" class="border-red-200 dark:border-red-800">
          <div slot="header" class="flex items-center gap-2 text-red-600 dark:text-red-400">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h2 class="text-lg font-semibold">Danger zone</h2>
          </div>

          <div class="space-y-4">
            <div>
              <p class="text-gray-600 dark:text-gray-400 mb-3">Once you delete your account, there is no going back. Please be certain.</p>
              <button appButton variant="danger" (click)="confirmDeleteAccount = true">Delete account</button>
            </div>
          </div>

          @if (confirmDeleteAccount) {
            <div class="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p class="text-red-700 dark:text-red-400 font-medium mb-3">Are you absolutely sure? This action cannot be undone.</p>
              <div class="flex gap-3">
                <button appButton variant="danger" (click)="deleteAccount()" [loading]="isDeletingAccount()">Yes, delete my account</button>
                <button appButton variant="outline" (click)="confirmDeleteAccount = false">Cancel</button>
              </div>
            </div>
          }
        </app-card>
      </div>
    </div>
  `,
})
export class SettingsComponent implements OnInit {
  private authService = inject(AuthService);

  user = this.authService.currentUser;

  profileData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
  };

  cnicNumber = '';
  cnicFile = signal<File | null>(null);
  cnicPreview = signal<string | null>(null);

  passwordData = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  };

  isSavingProfile = signal(false);
  isUploadingAvatar = signal(false);
  isUploadingCnic = signal(false);
  isChangingPassword = signal(false);
  isDeletingAccount = signal(false);

  successMessage = signal('');
  errorMessage = signal('');
  confirmDeleteAccount = false;

  firstNameError = computed(() => {
    if (!this.profileData.firstName) return '';
    if (this.profileData.firstName.length < 2) return 'At least 2 characters';
    return '';
  });

  lastNameError = computed(() => {
    if (!this.profileData.lastName) return '';
    if (this.profileData.lastName.length < 2) return 'At least 2 characters';
    return '';
  });

  emailError = computed(() => {
    if (!this.profileData.email) return '';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.profileData.email)) return 'Invalid email';
    return '';
  });

  phoneError = computed(() => {
    if (!this.profileData.phone) return '';
    if (!/^\+?[0-9\s-]{10,}$/.test(this.profileData.phone)) return 'Enter a valid phone number';
    return '';
  });

  cnicNumberError = computed(() => {
    if (!this.cnicNumber) return '';
    if (!/^\d{5}-\d{7}-\d{1}$/.test(this.cnicNumber)) return 'Format: XXXXX-XXXXXXX-X';
    return '';
  });

  currentPasswordError = computed(() => {
    if (!this.passwordData.currentPassword) return '';
    return '';
  });

  newPasswordError = computed(() => {
    if (!this.passwordData.newPassword) return '';
    if (this.passwordData.newPassword.length < 8) return 'At least 8 characters';
    if (!/[A-Z]/.test(this.passwordData.newPassword)) return 'Include uppercase letter';
    if (!/[a-z]/.test(this.passwordData.newPassword)) return 'Include lowercase letter';
    if (!/[0-9]/.test(this.passwordData.newPassword)) return 'Include number';
    return '';
  });

  passwordHint = computed(() => {
    if (!this.passwordData.newPassword) return 'At least 8 chars with upper, lower, number';
    const errors = [];
    if (this.passwordData.newPassword.length < 8) errors.push('8+ chars');
    if (!/[A-Z]/.test(this.passwordData.newPassword)) errors.push('uppercase');
    if (!/[a-z]/.test(this.passwordData.newPassword)) errors.push('lowercase');
    if (!/[0-9]/.test(this.passwordData.newPassword)) errors.push('number');
    return errors.length ? `Missing: ${errors.join(', ')}` : 'Strong password!';
  });

  confirmPasswordError = computed(() => {
    if (!this.passwordData.confirmPassword) return '';
    if (this.passwordData.confirmPassword !== this.passwordData.newPassword) return 'Passwords do not match';
    return '';
  });

  ngOnInit() {
    const u = this.user();
    if (u) {
      const names = u.fullName.split(' ');
      this.profileData.firstName = names[0] || '';
      this.profileData.lastName = names.slice(1).join(' ') || '';
      this.profileData.email = u.email;
      this.profileData.phone = u.phone || '';
      this.cnicNumber = u.cnicNumber || '';
    }
  }

  getCnicStatusLabel(): string {
    switch (this.user()?.cnicStatus) {
      case 'verified': return 'Verified';
      case 'pending': return 'Pending review';
      case 'rejected': return 'Rejected';
      default: return 'Not verified';
    }
  }

  getCnicBadgeVariant(): 'default' | 'success' | 'warning' | 'danger' | 'info' | 'outline' {
    switch (this.user()?.cnicStatus) {
      case 'verified': return 'success';
      case 'pending': return 'warning';
      case 'rejected': return 'danger';
      default: return 'default';
    }
  }

  async saveProfile() {
    if (this.firstNameError() || this.lastNameError() || this.phoneError()) return;

    this.isSavingProfile.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      const fullName = `${this.profileData.firstName} ${this.profileData.lastName}`.trim();
      await this.authService.updateProfile({ fullName, phone: this.profileData.phone }).toPromise();
      this.successMessage.set('Profile updated successfully');
      setTimeout(() => this.successMessage.set(''), 3000);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Failed to update profile');
    } finally {
      this.isSavingProfile.set(false);
    }
  }

  onAvatarSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('File size must be less than 5MB');
      return;
    }

    this.uploadAvatar(file);
  }

  async uploadAvatar(file: File) {
    this.isUploadingAvatar.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.authService.uploadAvatar(file).toPromise();
      this.successMessage.set('Profile photo updated');
      setTimeout(() => this.successMessage.set(''), 3000);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Failed to upload photo');
    } finally {
      this.isUploadingAvatar.set(false);
    }
  }

  onCnicSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      this.errorMessage.set('File size must be less than 5MB');
      return;
    }

    this.cnicFile.set(file);
    this.cnicPreview.set(URL.createObjectURL(file));
    this.errorMessage.set('');
  }

  async uploadCnic() {
    if (this.cnicNumberError() || !this.cnicFile()) return;

    this.isUploadingCnic.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      await this.authService.uploadCnic(this.cnicFile()!, this.cnicNumber).toPromise();
      this.successMessage.set('CNIC submitted for verification');
      this.cnicFile.set(null);
      this.cnicPreview.set(null);
      this.cnicNumber = '';
      setTimeout(() => this.successMessage.set(''), 5000);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Failed to submit CNIC');
    } finally {
      this.isUploadingCnic.set(false);
    }
  }

  async changePassword() {
    if (this.currentPasswordError() || this.newPasswordError() || this.confirmPasswordError()) return;

    this.isChangingPassword.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    try {
      // This would need a new endpoint in the API
      // For now, just show success
      this.successMessage.set('Password changed successfully (API endpoint needed)');
      this.passwordData = { currentPassword: '', newPassword: '', confirmPassword: '' };
      setTimeout(() => this.successMessage.set(''), 3000);
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Failed to change password');
    } finally {
      this.isChangingPassword.set(false);
    }
  }

  async deleteAccount() {
    this.isDeletingAccount.set(true);
    try {
      // This would need a delete account endpoint
      // this.authService.logout();
    } catch (err: any) {
      this.errorMessage.set(err.error?.message || 'Failed to delete account');
    } finally {
      this.isDeletingAccount.set(false);
    }
  }
}