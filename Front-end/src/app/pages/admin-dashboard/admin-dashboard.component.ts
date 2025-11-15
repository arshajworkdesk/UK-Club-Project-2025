import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, Member } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { fadeIn } from '../../animations/route.animations';
import { APP_MESSAGES } from '../../constants/app.messages';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [fadeIn]
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'pending' | 'approved' | 'admins' = 'pending';
  
  pendingMembers: Member[] = [];
  approvedMembers: Member[] = [];
  admins: Member[] = [];
  
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  // Expose constants for template
  readonly APP_MESSAGES = APP_MESSAGES;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService,
    private confirmationDialog: ConfirmationDialogService
  ) {}

  ngOnInit(): void {
    // Check if admin is logged in
    if (!this.authService.isAdmin()) {
      this.router.navigate(['/admin/login']);
      return;
    }

    this.loadData();
  }

  loadData(): void {
    this.isLoading = true;
    
    // Load pending members
    this.apiService.getPendingMembers().subscribe({
      next: (members) => {
        this.pendingMembers = members;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading pending members:', error);
        this.pendingMembers = [];
        this.isLoading = false;
      }
    });

    // Load approved members
    this.apiService.getApprovedMembers().subscribe({
      next: (members) => {
        this.approvedMembers = members.filter(m => m.role !== 'admin');
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading approved members:', error);
        this.approvedMembers = [];
        this.isLoading = false;
      }
    });

    // Load admins
    this.apiService.getAllAdmins().subscribe({
      next: (members) => {
        this.admins = members;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading admins:', error);
        this.admins = [];
        this.isLoading = false;
      }
    });
  }

  switchTab(tab: 'pending' | 'approved' | 'admins'): void {
    this.activeTab = tab;
  }

  approveMember(memberId: number): void {
    this.confirmationDialog.show({
      title: APP_MESSAGES.CONFIRMATION.APPROVE_TITLE,
      message: APP_MESSAGES.CONFIRMATION.APPROVE_MEMBER,
      confirmText: APP_MESSAGES.CONFIRMATION.BUTTON_APPROVE,
      cancelText: APP_MESSAGES.CONFIRMATION.BUTTON_CANCEL,
      type: 'info'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.approveMember(memberId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success(APP_MESSAGES.SUCCESS.MEMBER_APPROVED);
              this.loadData(); // Reload data
            }
          },
          error: (error) => {
            console.error('Error approving member:', error);
            this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
          }
        });
      }
    });
  }

  rejectMember(memberId: number): void {
    this.confirmationDialog.show({
      title: APP_MESSAGES.CONFIRMATION.REJECT_TITLE,
      message: APP_MESSAGES.CONFIRMATION.REJECT_MEMBER,
      confirmText: APP_MESSAGES.CONFIRMATION.BUTTON_REJECT,
      cancelText: APP_MESSAGES.CONFIRMATION.BUTTON_CANCEL,
      type: 'danger'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.rejectMember(memberId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.error(APP_MESSAGES.SUCCESS.MEMBER_REJECTED);
              this.loadData(); // Reload data
            }
          },
          error: (error) => {
            console.error('Error rejecting member:', error);
            this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
          }
        });
      }
    });
  }

  assignAdmin(memberId: number): void {
    this.confirmationDialog.show({
      title: APP_MESSAGES.CONFIRMATION.ASSIGN_ADMIN_TITLE,
      message: APP_MESSAGES.CONFIRMATION.ASSIGN_ADMIN,
      confirmText: APP_MESSAGES.CONFIRMATION.BUTTON_ASSIGN,
      cancelText: APP_MESSAGES.CONFIRMATION.BUTTON_CANCEL,
      type: 'warning'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.assignAdmin(memberId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success(APP_MESSAGES.SUCCESS.ADMIN_ASSIGNED);
              this.loadData(); // Reload data
            }
          },
          error: (error) => {
            console.error('Error assigning admin:', error);
            this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
          }
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/admin/login']);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatGender(gender?: string): string {
    if (!gender) return 'N/A';
    const genderMap: { [key: string]: string } = {
      'male': 'Male',
      'female': 'Female',
      'other': 'Other',
      'prefer-not-to-say': 'Prefer not to say'
    };
    return genderMap[gender] || gender;
  }
}

