import { Routes } from '@angular/router';
import { AuthGuard, GuestGuard, HostGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'listings',
    loadComponent: () => import('./features/listings/listings-page.component').then((m) => m.ListingsPageComponent),
  },
  {
    path: 'listings/:id',
    loadComponent: () => import('./features/listings/listing-detail.component').then((m) => m.ListingDetailComponent),
  },
  {
    path: 'auth/login',
    canActivate: [GuestGuard],
    loadComponent: () => import('./features/auth/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register',
    canActivate: [GuestGuard],
    loadComponent: () => import('./features/auth/register.component').then((m) => m.RegisterComponent),
  },
  {
    path: 'auth/callback',
    loadComponent: () => import('./features/auth/callback.component').then((m) => m.AuthCallbackComponent),
  },
  {
    path: 'profile',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent),
  },
  {
    path: 'settings',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/profile/settings.component').then((m) => m.SettingsComponent),
  },
  {
    path: 'trips',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/bookings/trips.component').then((m) => m.TripsComponent),
  },
  {
    path: 'bookings/:id',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/bookings/booking-detail.component').then((m) => m.BookingDetailComponent),
  },
  {
    path: 'messages',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/messages/messages.component').then((m) => m.MessagesComponent),
  },
  {
    path: 'messages/:bookingId',
    canActivate: [AuthGuard],
    loadComponent: () => import('./features/messages/message-thread.component').then((m) => m.MessageThreadComponent),
  },
  {
    path: 'host',
    canActivate: [AuthGuard, HostGuard],
    loadComponent: () => import('./features/host/host-dashboard.component').then((m) => m.HostDashboardComponent),
  },
  {
    path: 'host/dashboard',
    canActivate: [AuthGuard, HostGuard],
    loadComponent: () => import('./features/host/host-dashboard.component').then((m) => m.HostDashboardComponent),
  },
  {
    path: 'host/listings/new',
    canActivate: [AuthGuard, HostGuard],
    loadComponent: () => import('./features/host/create-listing.component').then((m) => m.CreateListingComponent),
  },
  {
    path: 'host/listings/:id/edit',
    canActivate: [AuthGuard, HostGuard],
    loadComponent: () => import('./features/host/edit-listing.component').then((m) => m.EditListingComponent),
  },
  {
    path: 'host/bookings',
    canActivate: [AuthGuard, HostGuard],
    loadComponent: () => import('./features/host/host-bookings.component').then((m) => m.HostBookingsComponent),
  },
  {
    path: 'help',
    loadComponent: () => import('./features/help/help.component').then((m) => m.HelpComponent),
  },
  {
    path: 'safety',
    loadComponent: () => import('./features/help/safety.component').then((m) => m.SafetyComponent),
  },
  {
    path: 'terms',
    loadComponent: () => import('./features/help/terms.component').then((m) => m.TermsComponent),
  },
  {
    path: 'privacy',
    loadComponent: () => import('./features/help/privacy.component').then((m) => m.PrivacyComponent),
  },
  {
    path: '**',
    loadComponent: () => import('./features/not-found/not-found.component').then((m) => m.NotFoundComponent),
  },
];