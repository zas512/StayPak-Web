import { Injectable, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { User, AuthTokens, LoginRequest, RegisterRequest, UpdateProfileRequest, CnicUploadRequest } from '../models/user.model';
import { BehaviorSubject, tap, catchError, throwError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private userSubject = new BehaviorSubject<User | null>(null);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  user = this.userSubject.asObservable();
  currentUser = signal<User | null>(null);
  isLoading = this.loadingSubject.asObservable();
  isAuthenticated = computed(() => !!this.currentUser());

  constructor(
    private api: ApiService,
    private router: Router,
  ) {
    this.initAuth();
  }

  private initAuth() {
    const token = localStorage.getItem('accessToken');
    const userData = localStorage.getItem('user');
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUser.set(user);
        this.userSubject.next(user);
      } catch {
        this.logout();
      }
    }
  }

  login(credentials: LoginRequest) {
    this.loadingSubject.next(true);
    return this.api.post<AuthTokens>('/auth/login', credentials).pipe(
      tap((tokens) => this.handleAuthSuccess(tokens)),
      catchError((err) => {
        this.loadingSubject.next(false);
        return throwError(() => err);
      }),
    );
  }

  register(data: RegisterRequest) {
    this.loadingSubject.next(true);
    return this.api.post<AuthTokens>('/auth/register', data).pipe(
      tap((tokens) => this.handleAuthSuccess(tokens)),
      catchError((err) => {
        this.loadingSubject.next(false);
        return throwError(() => err);
      }),
    );
  }

  private handleAuthSuccess(tokens: AuthTokens) {
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
    this.fetchCurrentUser().subscribe({
      next: (user) => {
        this.loadingSubject.next(false);
        this.router.navigate(['/']);
      },
      error: () => {
        this.loadingSubject.next(false);
        this.logout();
      },
    });
  }

  fetchCurrentUser() {
    return this.api.get<User>('/auth/me').pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.userSubject.next(null);
    this.router.navigate(['/auth/login']);
  }

  updateProfile(data: UpdateProfileRequest) {
    return this.api.patch<User>('/users/me', data).pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
    );
  }

  uploadAvatar(file: File) {
    return this.api.upload<User>('/users/me/avatar', file, 'avatar').pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
    );
  }

  uploadCnic(file: File, cnicNumber: string) {
    return this.api.upload<User>('/users/me/cnic', file, 'cnicDoc', { cnicNumber }).pipe(
      tap((user) => {
        this.currentUser.set(user);
        this.userSubject.next(user);
        localStorage.setItem('user', JSON.stringify(user));
      }),
    );
  }

  refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return of(null);

    return this.api.post<AuthTokens>('/auth/refresh', { refreshToken }, false).pipe(
      tap((tokens) => {
        localStorage.setItem('accessToken', tokens.accessToken);
        localStorage.setItem('refreshToken', tokens.refreshToken);
      }),
      catchError(() => {
        this.logout();
        return of(null);
      }),
    );
  }

  googleLogin() {
    window.location.href = `${this.api['baseUrl'].replace('/api', '')}/api/auth/google`;
  }
}