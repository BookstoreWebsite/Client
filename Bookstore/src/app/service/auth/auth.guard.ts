import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const isAuth = this.authService.isAuthenticated();
    console.log('AuthGuard canActivate -> isAuthenticated =', isAuth);

    if (isAuth) {
      return true;
    }

    console.log('AuthGuard: not authenticated, redirecting to /login');
    return this.router.createUrlTree(['/login']);
  }
}
