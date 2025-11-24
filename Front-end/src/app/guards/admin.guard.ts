import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  canActivate(): boolean {
    // Allow all authenticated users (admin, manager, member) to access dashboard
    if (this.authService.isAuthenticated()) {
      return true;
    } else {
      // Redirect to login if not authenticated
      this.router.navigate(['/admin/login']);
      return false;
    }
  }
}

