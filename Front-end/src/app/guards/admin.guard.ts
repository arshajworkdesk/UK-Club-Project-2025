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
    // TESTING MODE: Always allow access
    // TODO: Restore actual authentication check in production
    return true;
    
    // Production code (commented for testing):
    // if (this.authService.isAdmin()) {
    //   return true;
    // } else {
    //   // Redirect to admin login if not authenticated
    //   this.router.navigate(['/admin/login']);
    //   return false;
    // }
  }
}

