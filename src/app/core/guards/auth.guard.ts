import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, map, take } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.user.pipe(
      take(1),
      map((user) => {
        if (user) return true;
        return this.router.createUrlTree(['/auth/login'], {
          queryParams: { returnUrl: this.router.url },
        });
      }),
    );
  }
}

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.user.pipe(
      take(1),
      map((user) => {
        if (!user) return true;
        return this.router.createUrlTree(['/']);
      }),
    );
  }
}

@Injectable({ providedIn: 'root' })
export class HostGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): Observable<boolean | UrlTree> {
    return this.auth.user.pipe(
      take(1),
      map((user) => {
        if (user && (user.role === 'host' || user.role === 'both')) return true;
        return this.router.createUrlTree(['/']);
      }),
    );
  }
}