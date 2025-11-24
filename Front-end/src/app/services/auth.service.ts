import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map, catchError, of } from 'rxjs';
import { ApiService, LoginResponse } from './api.service';

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: 'admin' | 'manager' | 'member';
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
   * Login as user (all roles: admin, manager, member) - calls backend API
   * @param email User email
   * @param password User password
   * @returns Observable with login response
   */
  login(email: string, password: string): Observable<{ success: boolean; message: string; admin?: AdminUser; token?: string }> {
    return this.apiService.adminLogin({ email, password }).pipe(
      map((response: LoginResponse) => {
        if (response.success && response.admin && response.token) {
          // Store user info and token (supports all roles)
          const user: AdminUser = {
            id: response.admin.id,
            email: response.admin.email,
            fullName: response.admin.fullName,
            role: (response.admin.role?.toLowerCase() as 'admin' | 'manager' | 'member') || 'member'
          };
          
          this.setStoredAdmin(user);
          this.setStoredToken(response.token);
          this.currentAdminSubject.next(user);
          
          return {
            success: true,
            message: response.message || 'Login successful',
            admin: user,
            token: response.token
          };
        } else {
          console.error('Login failed - missing data:', {
            success: response.success,
            hasAdmin: !!response.admin,
            hasToken: !!response.token
          });
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
          errorMessage = 'Invalid credentials. Please check your email and password, or ensure your account is approved.';
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
   * Check if current user is authenticated
   */
  isAuthenticated(): boolean {
    const user = this.getStoredAdmin();
    const token = this.getStoredToken();
    return user !== null && token !== null;
  }

  /**
   * Check if current user is admin (backward compatibility)
   */
  isAdmin(): boolean {
    return this.isAuthenticated();
  }

  /**
   * Get current user (all roles)
   */
  getCurrentUser(): AdminUser | null {
    return this.getStoredAdmin();
  }

  /**
   * Get current admin user (backward compatibility)
   */
  getCurrentAdmin(): AdminUser | null {
    return this.getStoredAdmin();
  }

  /**
   * Get current user role
   */
  getUserRole(): 'admin' | 'manager' | 'member' | null {
    const user = this.getStoredAdmin();
    return user?.role || null;
  }

  /**
   * Check if user can approve/reject members
   * Allowed: admin, manager
   */
  canApproveReject(): boolean {
    const role = this.getUserRole();
    return role === 'admin' || role === 'manager';
  }

  /**
   * Check if user can assign admin role
   * Allowed: admin only
   */
  canAssignAdmin(): boolean {
    return this.getUserRole() === 'admin';
  }

  /**
   * Check if user is member (view only)
   */
  isMember(): boolean {
    return this.getUserRole() === 'member';
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

