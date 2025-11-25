import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';

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
  dateOfBirth?: string; // Backend returns dateOfBirth (LocalDate as string)
  gender?: string;
  profilePictureUrl?: string; // Backend returns profilePictureUrl
  approvalStatus: 'Pending' | 'Approved' | 'Rejected';
  role?: 'member' | 'manager' | 'admin';
  createdAt?: string;
  updatedAt?: string;
  // Legacy fields for backward compatibility
  dob?: string; // Alias for dateOfBirth
  profilePicture?: string; // Alias for profilePictureUrl
}

export interface ContactMessage {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export interface ContactMessageResponse {
  id: number;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ContactMessagePageResponse {
  content: ContactMessageResponse[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
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

export interface ClubDetails {
  id: number;
  clubName: string;
  establishedYear: number;
  description: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  clubImage?: string;
  clubLogo?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClubDetailsRequest {
  clubName: string;
  establishedYear: number;
  description: string;
  email: string;
  phone: string;
  address: string;
  businessHours: string;
  clubImage?: string;
  clubLogo?: string;
}

export interface AuditLog {
  id: number;
  timestamp: string;
  userName: string;
  userEmail: string;
  actionType: string;
  description: string;
  entityType: string;
  entityId?: number;
}

export interface AuditLogPageResponse {
  content: AuditLog[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  
  // Subject to notify when club details are updated
  private clubDetailsUpdated$ = new Subject<ClubDetails>();
  
  // Observable for components to subscribe to club details updates
  get clubDetailsUpdated(): Observable<ClubDetails> {
    return this.clubDetailsUpdated$.asObservable();
  }

  constructor(private http: HttpClient) { }
  
  /**
   * Notify subscribers that club details have been updated
   * @param details Updated club details
   */
  notifyClubDetailsUpdated(details: ClubDetails): void {
    this.clubDetailsUpdated$.next(details);
  }

  /**
   * Upload profile picture
   * @param file The image file to upload
   * @returns Observable with upload response containing filename and URL
   */
  uploadProfilePicture(file: File): Observable<{ success: boolean; message: string; filename?: string; url?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; message: string; filename?: string; url?: string }>(`${this.apiUrl}/upload/profile-picture`, formData);
  }

  /**
   * Register a new membership
   * @param registrationData Registration data
   * @returns Observable with registration response
   */
  registerMembership(registrationData: MembershipData): Observable<RegistrationResponse> {
    return this.http.post<RegistrationResponse>(`${this.apiUrl}/membership/register`, registrationData);
  }

  /**
   * User login (all roles: admin, manager, member)
   * @param loginData Login credentials
   * @returns Observable with login response
   */
  adminLogin(loginData: LoginData): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData);
  }

  /**
   * Get all approved members (public view)
   * @returns Observable with array of approved members
   */
  getApprovedMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/members`);
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
    return this.http.post<ContactResponse>(`${this.apiUrl}/contact`, message);
  }

  /**
   * Get pending members (admin only)
   * @returns Observable with array of pending members
   */
  getPendingMembers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/admin/pending-members`);
  }

  /**
   * Approve a member (admin only)
   * @param memberId Member ID to approve
   * @returns Observable with action response
   */
  approveMember(memberId: number): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.apiUrl}/admin/approve-member/${memberId}`, {});
  }

  /**
   * Reject a member (admin only)
   * @param memberId Member ID to reject
   * @returns Observable with action response
   */
  rejectMember(memberId: number): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.apiUrl}/admin/reject-member/${memberId}`, {});
  }

  /**
   * Assign admin role to a member (admin only)
   * @param memberId Member ID to make admin
   * @returns Observable with action response
   */
  assignAdmin(memberId: number): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.apiUrl}/admin/assign-admin/${memberId}`, {});
  }

  /**
   * Get all admins (all authenticated users can view)
   * @returns Observable with array of admin members
   */
  getAllAdmins(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/admin/admins`);
  }

  /**
   * Get all managers (all authenticated users can view)
   * @returns Observable with array of manager members
   */
  getAllManagers(): Observable<Member[]> {
    return this.http.get<Member[]>(`${this.apiUrl}/admin/managers`);
  }

  /**
   * Assign manager role to a member (admin only)
   * @param memberId Member ID to make manager
   * @returns Observable with action response
   */
  assignManager(memberId: number): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.apiUrl}/admin/assign-manager/${memberId}`, {});
  }

  /**
   * Get club details (public)
   * @returns Observable with club details
   */
  getClubDetails(): Observable<ClubDetails> {
    return this.http.get<ClubDetails>(`${this.apiUrl}/club-details`);
  }

  /**
   * Update club details (admin only)
   * @param details Club details to update
   * @returns Observable with updated club details
   */
  updateClubDetails(details: ClubDetailsRequest): Observable<ClubDetails> {
    return this.http.post<ClubDetails>(`${this.apiUrl}/admin/club-details`, details);
  }

  /**
   * Get paginated audit logs with filters (admin only)
   * @param actionType Filter by action type (optional)
   * @param startDate Filter by start date (optional)
   * @param endDate Filter by end date (optional)
   * @param page Page number (0-indexed, default: 0)
   * @param size Page size (default: 10)
   * @returns Observable with paginated audit logs
   */
  /**
   * Get all contact messages (admin/manager only)
   * @returns Observable with array of contact messages
   */
  getContactMessages(): Observable<ContactMessageResponse[]> {
    return this.http.get<ContactMessageResponse[]>(`${this.apiUrl}/admin/contact-messages`);
  }

  /**
   * Get contact messages with pagination (admin/manager only)
   * @param page Page number (0-indexed)
   * @param size Page size
   * @returns Observable with paginated contact messages
   */
  getContactMessagesPaginated(page: number = 0, size: number = 10): Observable<ContactMessagePageResponse> {
    return this.http.get<ContactMessagePageResponse>(`${this.apiUrl}/admin/contact-messages?page=${page}&size=${size}`);
  }

  /**
   * Delete contact messages by IDs (admin/manager only)
   * @param messageIds Array of message IDs to delete
   * @returns Observable
   */
  deleteContactMessages(messageIds: number[]): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/admin/contact-messages/delete`, { ids: messageIds });
  }

  getAuditLogs(actionType?: string, startDate?: string, endDate?: string, page: number = 0, size: number = 10): Observable<AuditLogPageResponse> {
    let params = new URLSearchParams();
    if (actionType) params.append('actionType', actionType);
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    params.append('page', page.toString());
    params.append('size', size.toString());
    
    const queryString = params.toString();
    const url = `${this.apiUrl}/admin/audit-logs${queryString ? '?' + queryString : ''}`;
    return this.http.get<AuditLogPageResponse>(url);
  }

  /**
   * Get club image URL by filename or public ID
   * @param filenameOrUrl The filename, Cloudinary public ID, or full URL stored in database
   * @returns Full URL to access the club image (Cloudinary URL or API endpoint URL)
   */
  getClubImageUrl(filenameOrUrl: string): string {
    if (!filenameOrUrl) return '';
    // If it's already a full URL (Cloudinary or other), return as-is
    if (filenameOrUrl.startsWith('http://') || filenameOrUrl.startsWith('https://')) {
      return filenameOrUrl;
    }
    // Otherwise, construct API endpoint URL (for backward compatibility)
    return `${this.apiUrl}/club-images/${filenameOrUrl}`;
  }

  /**
   * Get profile picture URL by filename or public ID
   * @param filenameOrUrl The filename, Cloudinary public ID, or full URL stored in database
   * @returns Full URL to access the profile picture (Cloudinary URL or API endpoint URL)
   */
  getProfilePictureUrl(filenameOrUrl: string): string {
    if (!filenameOrUrl) return '';
    // If it's already a full URL (Cloudinary or other), return as-is
    if (filenameOrUrl.startsWith('http://') || filenameOrUrl.startsWith('https://')) {
      return filenameOrUrl;
    }
    // Otherwise, construct API endpoint URL (for backward compatibility)
    return `${this.apiUrl}/profile-pictures/${filenameOrUrl}`;
  }

  /**
   * Get club logo URL by filename or public ID
   * @param filenameOrUrl The filename, Cloudinary public ID, or full URL stored in database
   * @returns Full URL to access the club logo (Cloudinary URL or API endpoint URL)
   */
  getClubLogoUrl(filenameOrUrl: string): string {
    if (!filenameOrUrl) return '';
    // If it's already a full URL (Cloudinary or other), return as-is
    if (filenameOrUrl.startsWith('http://') || filenameOrUrl.startsWith('https://')) {
      return filenameOrUrl;
    }
    // Otherwise, construct API endpoint URL (for backward compatibility)
    return `${this.apiUrl}/club-logos/${filenameOrUrl}`;
  }

  /**
   * Upload club image
   * @param file The image file to upload
   * @returns Observable with upload response containing filename
   */
  uploadClubImage(file: File): Observable<{ success: boolean; message: string; filename?: string; url?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; message: string; filename?: string; url?: string }>(
      `${this.apiUrl}/upload/club-image`,
      formData
    );
  }

  /**
   * Upload club logo
   * @param file The logo file to upload
   * @returns Observable with upload response containing filename
   */
  uploadClubLogo(file: File): Observable<{ success: boolean; message: string; filename?: string; url?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ success: boolean; message: string; filename?: string; url?: string }>(
      `${this.apiUrl}/upload/club-logo`,
      formData
    );
  }

  /**
   * Remove a member (admin can remove non-admins, manager can only remove members)
   * @param memberId Member ID to remove
   * @returns Observable with action response
   */
  removeMember(memberId: number): Observable<ActionResponse> {
    return this.http.delete<ActionResponse>(`${this.apiUrl}/admin/remove-member/${memberId}`);
  }

  /**
   * Demote manager to regular member (admin only)
   * @param memberId Member ID to demote
   * @returns Observable with action response
   */
  demoteManagerToMember(memberId: number): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.apiUrl}/admin/demote-manager/${memberId}`, {});
  }

  /**
   * Promote manager to admin (admin only)
   * @param memberId Member ID to promote
   * @returns Observable with action response
   */
  promoteManagerToAdmin(memberId: number): Observable<ActionResponse> {
    return this.http.post<ActionResponse>(`${this.apiUrl}/admin/promote-manager/${memberId}`, {});
  }

}

