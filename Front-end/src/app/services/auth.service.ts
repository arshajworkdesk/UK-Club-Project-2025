import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';

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
  private readonly ADMIN_KEY = 'uk_club_is_admin';
  
  private currentAdminSubject = new BehaviorSubject<AdminUser | null>(this.getStoredAdmin());
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  constructor() {
    // TESTING MODE: Don't auto-login so user can test login form
    // TODO: Restore auto-login or session check in production
    // const testAdmin: AdminUser = { id: 1, email: 'admin@ukclub.com', fullName: 'Test Admin', role: 'admin' };
    // this.setStoredAdmin(testAdmin);
    // this.currentAdminSubject.next(testAdmin);
    
    // Check if admin session exists on service initialization
    this.checkStoredSession();
  }

  /**
   * Login as admin (placeholder - will be replaced with actual API call)
   * TESTING MODE: Always succeeds
   * TODO: Restore actual authentication in production
   * @param email Admin email
   * @param password Admin password
   * @returns Observable with login response
   */
  login(email: string, password: string): Observable<{ success: boolean; message: string; admin?: AdminUser }> {
    // TESTING MODE: Always succeed
    const testAdmin: AdminUser = { id: 1, email: email || 'admin@ukclub.com', fullName: 'Test Admin', role: 'admin' };
    this.setStoredAdmin(testAdmin);
    this.currentAdminSubject.next(testAdmin);
    
    return of({ 
      success: true, 
      message: 'Login successful (Testing Mode)',
      admin: testAdmin
    }).pipe(delay(500));
    
    // Production code (commented for testing):
    // const mockAdmins = [
    //   { id: 1, email: 'admin@ukclub.com', fullName: 'Admin User', role: 'admin' as const }
    // ];
    // const admin = mockAdmins.find(a => a.email === email);
    // if (admin) {
    //   this.setStoredAdmin(admin);
    //   this.currentAdminSubject.next(admin);
    //   return of({ 
    //     success: true, 
    //     message: 'Login successful',
    //     admin: admin
    //   }).pipe(delay(500));
    // } else {
    //   return of({ 
    //     success: false, 
    //     message: 'Invalid credentials or user is not an admin' 
    //   }).pipe(delay(500));
    // }
  }

  /**
   * Logout admin
   */
  logout(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.ADMIN_KEY);
    this.currentAdminSubject.next(null);
  }

  /**
   * Check if current user is admin
   * TESTING MODE: Checks localStorage (allows testing login flow)
   * TODO: Restore actual check in production
   */
  isAdmin(): boolean {
    // TESTING MODE: Check localStorage so login page is accessible initially
    // But login() always succeeds, so any credentials will work
    const admin = this.getStoredAdmin();
    return admin !== null;
    
    // Note: AdminGuard is bypassed for testing, so this only affects UI visibility
  }

  /**
   * Get current admin user
   * TESTING MODE: Always returns a test admin
   * TODO: Restore actual check in production
   */
  getCurrentAdmin(): AdminUser | null {
    // TESTING MODE: Always return test admin
    return { id: 1, email: 'admin@ukclub.com', fullName: 'Test Admin', role: 'admin' };
    
    // Production code (commented for testing):
    // return this.getStoredAdmin();
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
    if (admin) {
      this.currentAdminSubject.next(admin);
    }
  }
}

