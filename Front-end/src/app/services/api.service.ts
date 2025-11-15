import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { APP_MESSAGES } from '../constants/app.messages';

export interface RegistrationData {
  fullName: string;
  email: string;
  password: string;
}

export interface RegistrationResponse {
  success: boolean;
  message: string;
  data?: any;
}

export interface MembershipData {
  fullName: string;
  email: string;
  password: string;
  dob: string;
  gender: string;
  profilePicture?: File | string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface Member {
  id: number;
  fullName: string;
  email: string;
  dob?: string;
  gender?: string;
  profilePicture?: string;
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  role?: 'member' | 'admin';
  status?: string;
}

export interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  admin?: {
    id: number;
    email: string;
    fullName: string;
    role: string;
  };
  token?: string;
}

export interface ActionResponse {
  success: boolean;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  /**
   * Register a new membership (placeholder)
   * @param formData FormData containing membership registration data and optional profile picture
   * @returns Observable with registration response
   */
  registerMembership(formData: FormData): Observable<RegistrationResponse> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    // return this.http.post<RegistrationResponse>(`${this.apiUrl}/membership/register`, formData);
    
    // For testing without backend:
    return of({ success: true, message: APP_MESSAGES.SUCCESS.MEMBERSHIP_REQUEST_SUBMITTED }).pipe(delay(1000));
  }

  /**
   * Admin login (placeholder)
   * @param loginData Login credentials
   * @returns Observable with login response
   */
  adminLogin(loginData: LoginData): Observable<LoginResponse> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/login`, loginData);
    
    // For testing without backend, uncomment below:
    // return of({ success: true, message: 'Login successful' }).pipe(delay(500));
  }

  /**
   * Get all approved members (public view)
   * @returns Observable with array of approved members
   */
  getApprovedMembers(): Observable<Member[]> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    return this.http.get<Member[]>(`${this.apiUrl}/members`);
    
    // For testing without backend, uncomment below:
    // return of([]).pipe(delay(500));
  }

  /**
   * Get all members (for backward compatibility)
   * @returns Observable with array of members
   */
  getMembers(): Observable<Member[]> {
    return this.getApprovedMembers();
  }

  /**
   * Send contact message
   * @param message Contact message data
   * @returns Observable with contact response
   */
  sendContactMessage(message: ContactMessage): Observable<ContactResponse> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    return this.http.post<ContactResponse>(`${this.apiUrl}/contact`, message);
    
    // For testing without backend, uncomment below:
    // return of({ success: true, message: 'Message sent successfully' }).pipe(delay(1000));
  }

  /**
   * Get pending members (admin only)
   * @returns Observable with array of pending members
   */
  getPendingMembers(): Observable<Member[]> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    // return this.http.get<Member[]>(`${this.apiUrl}/admin/pending-members`);
    
    // For testing without backend:
    return of([
      { id: 1, fullName: 'John Doe', email: 'john@example.com', dob: '1990-01-15', gender: 'male', approvalStatus: 'Pending' as const, role: 'member' as const },
      { id: 2, fullName: 'Jane Smith', email: 'jane@example.com', dob: '1992-05-20', gender: 'female', approvalStatus: 'Pending' as const, role: 'member' as const }
    ]).pipe(delay(500));
  }

  /**
   * Approve a member (admin only)
   * @param memberId Member ID to approve
   * @returns Observable with action response
   */
  approveMember(memberId: number): Observable<ActionResponse> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    // return this.http.post<ActionResponse>(`${this.apiUrl}/admin/approve-member/${memberId}`, {});
    
    // For testing without backend:
    return of({ success: true, message: APP_MESSAGES.SUCCESS.MEMBER_APPROVED }).pipe(delay(500));
  }

  /**
   * Reject a member (admin only)
   * @param memberId Member ID to reject
   * @returns Observable with action response
   */
  rejectMember(memberId: number): Observable<ActionResponse> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    // return this.http.post<ActionResponse>(`${this.apiUrl}/admin/reject-member/${memberId}`, {});
    
    // For testing without backend:
    return of({ success: true, message: APP_MESSAGES.SUCCESS.MEMBER_REJECTED }).pipe(delay(500));
  }

  /**
   * Assign admin role to a member (admin only)
   * @param memberId Member ID to make admin
   * @returns Observable with action response
   */
  assignAdmin(memberId: number): Observable<ActionResponse> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    // return this.http.post<ActionResponse>(`${this.apiUrl}/admin/assign-admin/${memberId}`, {});
    
    // For testing without backend:
    return of({ success: true, message: APP_MESSAGES.SUCCESS.ADMIN_ASSIGNED }).pipe(delay(500));
  }

  /**
   * Get all admins (admin only)
   * @returns Observable with array of admin members
   */
  getAllAdmins(): Observable<Member[]> {
    // Placeholder implementation
    // TODO: Replace with actual API endpoint when backend is ready
    // return this.http.get<Member[]>(`${this.apiUrl}/admin/admins`);
    
    // For testing without backend:
    return of([
      { id: 1, fullName: 'Admin User', email: 'admin@ukclub.com', dob: '1985-01-01', gender: 'male', approvalStatus: 'Approved' as const, role: 'admin' as const }
    ]).pipe(delay(500));
  }
}

