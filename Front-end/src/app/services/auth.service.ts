import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { ApiService, LoginResponse } from './api.service';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: 'admin';
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_KEY = 'uk_club_admin';
  private readonly TOKEN_KEY = 'uk_club_token';
  private readonly ADMIN_KEY = 'uk_club_is_admin';
  
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(this.getStoredAdmin());
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor(private apiService: ApiService) {
    // Check if admin session exists on service initialization
    this.checkStoredSession();
  }

  /**
   * Login as admin - calls backend API
   * @param email Admin email
   * @param password Admin password
   * @returns Observable with login response
   */
  login(email: string, password: string): Observable<{ success: boolean; message: string; admin?: AdminUser; token?: string }> {
    return this.apiService.adminLogin({ email, password }).pipe(
      map((response: LoginResponse) => {
        if (response.success && response.admin && response.token) {
          // Store admin info and token
          const admin: AdminUser = {
            id: response.admin.id,
            email: response.admin.email,
            fullName: response.admin.fullName,
            role: 'admin'
          };
          
          this.setStoredAdmin(admin);
          this.setStoredToken(response.token);
          this.currentAdminSubject.next(admin);
          
          return {
            success: true,
            message: response.message || 'Login successful',
            admin: admin,
            token: response.token
          };
        } else {
          return {
            success: false,
            message: response.message || 'Login failed'
          };
        }
      }),
      catchError((error) => {
        console.error('Login API error:', error);
        let errorMessage = 'Login failed. Please try again.';
        
        // Check for connection errors (service down, network issues)
        const errorMessageStr = error?.message?.toLowerCase() || '';
        const isConnectionError = error.status === 0 || 
                                  errorMessageStr.includes('connection refused') ||
                                  errorMessageStr.includes('failed to fetch') ||
                                  errorMessageStr.includes('network error') ||
                                  errorMessageStr.includes('connection');
        
        if (isConnectionError) {
          errorMessage = 'Cannot connect to server. Please contact Admin';
        } else if (error.error?.message) {
          errorMessage = error.error.message;
        } else if (error.status === 401) {
          errorMessage = 'Invalid credentials or user is not an admin';
        }
        
        return of({
          success: false,
          message: errorMessage
        });
      })
    );
  }

  /**
   * Logout admin
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.ADMIN_KEY);
    this.currentAdminSubject.next(null);
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    const admin = this.getStoredAdmin();
    const token = this.getStoredToken();
    return admin !== null && token !== null;
  }

  /**
   * Get current admin user
   */
  getCurrentAdmin(): AdminUser | null {
    return this.getStoredAdmin();
  }

  /**
   * Get stored JWT token
   */
  getToken(): string | null {
    return this.getStoredToken();
  }

  /**
   * Get stored admin from localStorage
   */
  private getStoredAdmin(): AdminUser | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Error reading admin from storage:', error);
    }
    return null;
  }

  /**
   * Store admin in localStorage
   */
  private setStoredAdmin(admin: AdminUser): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(admin));
      localStorage.setItem(this.ADMIN_KEY, 'true');
    } catch (error) {
      console.error('Error storing admin:', error);
    }
  }

  /**
   * Check stored session on initialization
   */
  private checkStoredSession(): void {
    const admin = this.getStoredAdmin();
    const token = this.getStoredToken();
    if (admin && token) {
      this.currentAdminSubject.next(admin);
    } else {
      // Clear invalid session
      this.logout();
    }
  }

  /**
   * Get stored token from localStorage
   */
  private getStoredToken(): string | null {
    try {
      return localStorage.getItem(this.TOKEN_KEY);
    } catch (error) {
      console.error('Error reading token from storage:', error);
      return null;
    }
  }

  /**
   * Store token in localStorage
   */
  private setStoredToken(token: string): void {
    try {
      localStorage.setItem(this.TOKEN_KEY, token);
    } catch (error) {
      console.error('Error storing token:', error);
    }
  }
}

