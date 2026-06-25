# Raho MVP — Admin Dashboard Architecture
**Stack:** Angular 17 · TypeScript · Angular Material · NgRx Signals · TailwindCSS

---

## Overview

The admin dashboard is an internal tool used by the Raho team to moderate listings, verify hosts, manage disputes, and monitor platform health. It is not customer-facing. Built in Angular because it's the stated learning goal — and admin dashboards are actually Angular's sweet spot (heavy CRUD, forms, tables, clear module boundaries).

The dashboard talks to the same NestJS API as the mobile app, using a separate `admin` role with elevated permissions.

---

## Technology Decisions

| Concern | Choice | Why |
|---|---|---|
| Framework | Angular 17 (standalone components) | Learning goal; admin dashboards are CRUD-heavy = Angular's sweet spot |
| Language | TypeScript (strict) | Shared types with backend |
| UI Components | Angular Material (MDC) | Production-ready tables, forms, dialogs out of the box |
| State management | NgRx SignalStore | Angular 17 native, simpler than classic NgRx, no boilerplate |
| HTTP | Angular `HttpClient` with interceptors | Built-in, clean JWT attachment |
| Forms | Reactive Forms | Complex filters and multi-field forms need reactive approach |
| Charts | Apache ECharts (`ngx-echarts`) | Booking trends, revenue charts, occupancy heatmaps |
| Tables | Angular Material Table + CDK Virtual Scroll | Handle large listing/booking lists without pagination hacks |
| Auth | JWT stored in memory (not localStorage) | Admin dashboard — security matters more than persistence |
| Routing | Angular Router with lazy-loaded modules | Each section loads independently |
| CSS | TailwindCSS + Angular Material tokens | Tailwind for layout/spacing, Material for components |

---

## Folder Structure

```
src/
├── app/
│   ├── app.component.ts          ← root shell: sidebar + router outlet
│   ├── app.routes.ts             ← top-level lazy routes
│   │
│   ├── core/                     ← singleton services, guards, interceptors
│   │   ├── auth/
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.guard.ts
│   │   │   └── admin.guard.ts     ← blocks non-admin role
│   │   ├── interceptors/
│   │   │   ├── jwt.interceptor.ts
│   │   │   └── error.interceptor.ts
│   │   ├── services/
│   │   │   └── api.service.ts     ← base HTTP wrapper
│   │   └── models/               ← shared TypeScript interfaces
│   │       ├── user.model.ts
│   │       ├── listing.model.ts
│   │       ├── booking.model.ts
│   │       └── payment.model.ts
│   │
│   ├── shared/                   ← reusable standalone components
│   │   ├── components/
│   │   │   ├── stat-card/
│   │   │   ├── data-table/        ← generic paginated table wrapper
│   │   │   ├── status-badge/
│   │   │   ├── confirm-dialog/
│   │   │   ├── photo-preview/
│   │   │   └── empty-state/
│   │   └── pipes/
│   │       ├── pkr-currency.pipe.ts
│   │       └── time-ago.pipe.ts
│   │
│   ├── features/
│   │   ├── auth/
│   │   │   └── login/
│   │   │       ├── login.component.ts
│   │   │       └── login.component.html
│   │   │
│   │   ├── dashboard/            ← overview/home
│   │   │   ├── dashboard.component.ts
│   │   │   ├── dashboard.component.html
│   │   │   └── dashboard.store.ts
│   │   │
│   │   ├── users/
│   │   │   ├── users.routes.ts
│   │   │   ├── users-list/
│   │   │   ├── user-detail/
│   │   │   └── users.store.ts
│   │   │
│   │   ├── listings/
│   │   │   ├── listings.routes.ts
│   │   │   ├── listings-list/
│   │   │   ├── listing-detail/
│   │   │   ├── listing-review/    ← approve/reject pending listings
│   │   │   └── listings.store.ts
│   │   │
│   │   ├── bookings/
│   │   │   ├── bookings.routes.ts
│   │   │   ├── bookings-list/
│   │   │   ├── booking-detail/
│   │   │   └── bookings.store.ts
│   │   │
│   │   ├── payments/
│   │   │   ├── payments.routes.ts
│   │   │   ├── payments-list/
│   │   │   └── payments.store.ts
│   │   │
│   │   └── analytics/
│   │       ├── analytics.component.ts
│   │       └── analytics.component.html
│   │
│   └── layout/
│       ├── shell/                ← sidebar nav + top bar
│       │   ├── shell.component.ts
│       │   └── shell.component.html
│       └── sidebar/
│           ├── sidebar.component.ts
│           └── sidebar-nav.ts    ← nav item definitions
│
├── environments/
│   ├── environment.ts
│   └── environment.prod.ts
└── styles/
    ├── styles.scss               ← Material theme + global resets
    └── tailwind.config.js
```

---

## Routing

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./features/auth/login/login.component') },
  {
    path: '',
    component: ShellComponent,
    canActivate: [AuthGuard, AdminGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        loadComponent: () => import('./features/dashboard/dashboard.component'),
      },
      {
        path: 'users',
        loadChildren: () => import('./features/users/users.routes'),
      },
      {
        path: 'listings',
        loadChildren: () => import('./features/listings/listings.routes'),
      },
      {
        path: 'bookings',
        loadChildren: () => import('./features/bookings/bookings.routes'),
      },
      {
        path: 'payments',
        loadChildren: () => import('./features/payments/payments.routes'),
      },
      {
        path: 'analytics',
        loadComponent: () => import('./features/analytics/analytics.component'),
      },
    ],
  },
  { path: '**', redirectTo: 'dashboard' },
];
```

```typescript
// features/listings/listings.routes.ts
export const listingsRoutes: Routes = [
  { path: '', loadComponent: () => import('./listings-list/listings-list.component') },
  { path: 'review', loadComponent: () => import('./listing-review/listing-review.component') },
  { path: ':id', loadComponent: () => import('./listing-detail/listing-detail.component') },
];
```

---

## Auth

Admin sessions use short-lived JWT (15min) stored in memory — never localStorage. On page refresh, the admin must log in again. This is intentional: admin accounts are high-value targets.

```typescript
// core/auth/auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;
  private currentUser = signal<AdminUser | null>(null);

  readonly user = this.currentUser.asReadonly();
  readonly isAuthenticated = computed(() => this.currentUser() !== null);

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<LoginResponse>('/auth/admin/login', { email, password }).pipe(
      tap(({ data }) => {
        this.accessToken = data.accessToken;
        this.currentUser.set(data.user);
      })
    );
  }

  getToken() { return this.accessToken; }

  logout() {
    this.accessToken = null;
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }
}
```

```typescript
// core/interceptors/jwt.interceptor.ts
export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (token) {
    req = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) auth.logout();
      return throwError(() => error);
    })
  );
};
```

---

## State Management with NgRx SignalStore

Each feature has its own SignalStore — no global mega-store.

```typescript
// features/listings/listings.store.ts
import { signalStore, withState, withMethods, withComputed, patchState } from '@ngrx/signals';
import { inject } from '@angular/core';
import { ListingsService } from './listings.service';

interface ListingsState {
  listings: Listing[];
  total: number;
  page: number;
  limit: number;
  loading: boolean;
  filter: {
    status: string | null;
    city: string | null;
    search: string | null;
  };
}

const initialState: ListingsState = {
  listings: [], total: 0, page: 1, limit: 20, loading: false,
  filter: { status: null, city: null, search: null },
};

export const ListingsStore = signalStore(
  withState(initialState),

  withComputed(({ filter }) => ({
    activeFilters: computed(() => Object.values(filter()).filter(Boolean).length),
  })),

  withMethods((store, listingsService = inject(ListingsService)) => ({
    async loadListings() {
      patchState(store, { loading: true });
      const { data, meta } = await listingsService.getListings({
        page: store.page(),
        limit: store.limit(),
        ...store.filter(),
      });
      patchState(store, { listings: data, total: meta.total, loading: false });
    },

    setFilter(filter: Partial<ListingsState['filter']>) {
      patchState(store, (s) => ({ filter: { ...s.filter, ...filter }, page: 1 }));
      this.loadListings();
    },

    setPage(page: number) {
      patchState(store, { page });
      this.loadListings();
    },
  }))
);
```

---

## Feature Screens

### Dashboard

Shows the health of the platform at a glance. All numbers pulled from a `/admin/stats` endpoint.

```
┌──────────────────────────────────────────────────────────┐
│  Today at a glance                                       │
│                                                          │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐   │
│  │ New users│ │ Bookings │ │  Revenue │ │ Pending  │   │
│  │    +24   │ │    +11   │ │ PKR 128k │ │ CNIC: 8  │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘   │
│                                                          │
│  Bookings this week (ECharts line chart)                 │
│  ──────────────────────────────────────────────────────  │
│                                                          │
│  Pending actions                                         │
│  • 3 listings awaiting approval                          │
│  • 8 CNIC verifications pending                          │
│  • 2 disputed bookings                                   │
└──────────────────────────────────────────────────────────┘
```

### Users Management (`/users`)

```typescript
// Columns shown in the Angular Material table
const userColumns = [
  'avatar',
  'fullName',
  'email',
  'phone',
  'role',
  'cnicStatus',    // pending | verified | rejected — with color badge
  'createdAt',
  'actions',       // View, Suspend
];

// Filters (reactive form)
const filterForm = new FormGroup({
  search: new FormControl(''),          // searches name, email, phone
  role: new FormControl(''),            // guest | host | both | all
  cnicStatus: new FormControl(''),      // pending | verified | rejected | all
  dateFrom: new FormControl<Date | null>(null),
  dateTo: new FormControl<Date | null>(null),
});
```

**User detail view:**
- Full profile info
- CNIC photo (loaded from S3 presigned URL)
- Approve / Reject CNIC buttons
- Booking history (as guest and as host)
- Suspend account button with reason input

### Listings Management (`/listings`)

```typescript
const listingColumns = [
  'photo',          // thumbnail
  'title',
  'host',           // host name + link
  'city',
  'price',          // PKR per night
  'status',         // draft | active | paused | deleted
  'bookings',       // count
  'createdAt',
  'actions',        // View, Approve, Suspend, Delete
];
```

**Listing review queue** (`/listings/review`) — shows all `status: draft` listings pending first activation approval:
- Property photos carousel
- All listing details
- Approve (sets status to `active`) or Reject (with reason, notifies host)

### Bookings Management (`/bookings`)

```typescript
const bookingColumns = [
  'id',             // short UUID
  'listing',        // listing title + link
  'guest',          // guest name + link
  'checkIn',
  'checkOut',
  'totalAmount',
  'status',         // pending | confirmed | cancelled | completed
  'paymentStatus',  // unpaid | paid | refunded
  'createdAt',
  'actions',        // View details, Force cancel, Issue refund
];
```

**Booking detail view:**
- All booking fields
- Payment record(s) with gateway response (collapsed JSON viewer)
- Message thread between guest and host (read-only)
- Admin actions: force cancel, mark as completed, initiate refund

### Payments Management (`/payments`)

```typescript
const paymentColumns = [
  'id',
  'bookingId',      // link to booking
  'gateway',        // JazzCash | EasyPaisa | Safepay — with icon
  'gatewayRef',
  'amount',
  'status',
  'createdAt',
];
```

Raw gateway response viewable in an expandable panel — useful for debugging failed payments.

### Analytics (`/analytics`)

All charts via `ngx-echarts`:

- Bookings per day (line chart, last 30 days)
- Revenue per day (line chart, PKR, last 30 days)
- Bookings by city (bar chart)
- Bookings by gateway (pie: JazzCash / EasyPaisa / Safepay)
- New user signups per week (bar chart)
- Listing status breakdown (pie: active / paused / draft)

---

## Shared Components

### `<app-data-table>` — Generic Table Wrapper

```typescript
// shared/components/data-table/data-table.component.ts
@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [MatTableModule, MatPaginatorModule, MatSortModule, CommonModule],
  template: `
    <mat-table [dataSource]="dataSource" matSort>
      <ng-content />
    </mat-table>
    <mat-paginator
      [length]="total"
      [pageSize]="pageSize"
      [pageSizeOptions]="[10, 20, 50]"
      (page)="pageChange.emit($event)"
    />
  `
})
export class DataTableComponent {
  @Input() dataSource: any[] = [];
  @Input() total = 0;
  @Input() pageSize = 20;
  @Output() pageChange = new EventEmitter<PageEvent>();
}
```

### `<app-status-badge>`

```typescript
// Maps status strings to Material chip colors
const statusConfig: Record<string, { color: string; label: string }> = {
  active:    { color: 'green', label: 'Active' },
  pending:   { color: 'orange', label: 'Pending' },
  confirmed: { color: 'blue', label: 'Confirmed' },
  cancelled: { color: 'red', label: 'Cancelled' },
  completed: { color: 'teal', label: 'Completed' },
  verified:  { color: 'green', label: 'Verified' },
  rejected:  { color: 'red', label: 'Rejected' },
  paid:      { color: 'green', label: 'Paid' },
  refunded:  { color: 'purple', label: 'Refunded' },
};
```

---

## API Integration

The admin dashboard calls the same NestJS API but hits admin-specific endpoints guarded by `@Roles('admin')`:

```typescript
// core/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private base = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Generic helper — all endpoints return { success, data, meta }
  get<T>(path: string, params?: any): Observable<ApiResponse<T>> {
    return this.http.get<ApiResponse<T>>(`${this.base}${path}`, { params });
  }

  post<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.post<ApiResponse<T>>(`${this.base}${path}`, body);
  }

  patch<T>(path: string, body: any): Observable<ApiResponse<T>> {
    return this.http.patch<ApiResponse<T>>(`${this.base}${path}`, body);
  }

  delete<T>(path: string): Observable<ApiResponse<T>> {
    return this.http.delete<ApiResponse<T>>(`${this.base}${path}`);
  }
}
```

### Admin API endpoints (NestJS additions needed)

```
GET  /admin/stats                     ← dashboard summary numbers
GET  /admin/users                     ← paginated, filterable
GET  /admin/users/:id
PATCH /admin/users/:id/cnic-status    ← { status: 'verified' | 'rejected', reason? }
PATCH /admin/users/:id/suspend        ← { reason }

GET  /admin/listings                  ← includes draft/paused
GET  /admin/listings/:id
PATCH /admin/listings/:id/approve     ← sets status: active
PATCH /admin/listings/:id/reject      ← { reason }

GET  /admin/bookings
GET  /admin/bookings/:id
PATCH /admin/bookings/:id/cancel      ← force cancel with reason
POST  /admin/bookings/:id/refund      ← initiate refund via payment gateway

GET  /admin/payments
GET  /admin/payments/:id
```

---

## Angular Material Theme

```scss
// styles/styles.scss
@use '@angular/material' as mat;

$raho-primary: mat.define-palette((
  50: #E1F5EE,
  100: #9FE1CB,
  500: #1D9E75,
  700: #0F6E56,
  900: #04342C,
  contrast: (500: white, 700: white)
));

$raho-accent: mat.define-palette(mat.$orange-palette, A200);

$theme: mat.define-light-theme((
  color: (primary: $raho-primary, accent: $raho-accent),
  typography: mat.define-typography-config(),
  density: 0,
));

@include mat.all-component-themes($theme);
```

---

## AWS Hosting (Admin Dashboard)

The Angular app builds to static files and is hosted on S3 + CloudFront — no server needed.

```
CloudFront distribution
    └── S3 Bucket: raho-admin.raho.pk
        └── index.html + compiled JS/CSS chunks

CloudFront config:
  - Custom error response: 403/404 → index.html (for SPA routing)
  - Cache policy: CachingOptimized for assets, no cache for index.html
  - HTTPS only
  - IP allowlist: office IP + VPN IPs only (admin dashboard is not public)
```

```bash
# Build and deploy
ng build --configuration production
aws s3 sync dist/raho-admin/ s3://raho-admin-bucket/ --delete
aws cloudfront create-invalidation --distribution-id XXXX --paths "/*"
```

---

## Development Setup

```bash
# Install Angular CLI
npm install -g @angular/cli

# Bootstrap project
ng new raho-admin --routing --style=scss --standalone

# Dependencies
npm install @angular/material @angular/cdk
npm install @ngrx/signals
npm install ngx-echarts echarts
npm install -D tailwindcss

# Generate a feature (example)
ng generate component features/listings/listings-list --standalone
ng generate service features/listings/listings

# Run dev server
ng serve
# proxies /api/* to http://localhost:3000 via proxy.conf.json
```

```json
// proxy.conf.json (dev only — so you don't need CORS config locally)
{
  "/api": {
    "target": "http://localhost:3000",
    "secure": false,
    "changeOrigin": true,
    "pathRewrite": { "^/api": "" }
  }
}
```

```json
// angular.json — add proxy to serve config
"serve": {
  "options": {
    "proxyConfig": "proxy.conf.json"
  }
}
```

---

## MVP Scope Boundaries

The following are explicitly out of scope for admin dashboard MVP:

- Role-based admin tiers (all admins have full access for now)
- Audit log of admin actions
- Host payout management UI (handled manually via bank transfer for MVP)
- Bulk actions on listings or users
- Real-time notifications in admin UI (polling is fine for MVP)
- Multi-language support (English only)
- Dark mode
