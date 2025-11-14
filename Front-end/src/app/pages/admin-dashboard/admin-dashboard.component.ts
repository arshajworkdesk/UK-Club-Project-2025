import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ApiService, Member } from '../../services/api.service';
import { fadeIn } from '../../animations/route.animations';

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

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router
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
    this.apiService.approveMember(memberId).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'Member approved successfully';
          this.loadData(); // Reload data
          setTimeout(() => {
            this.successMessage = '';
          }, 3000);
        }
      },
      error: (error) => {
        console.error('Error approving member:', error);
        this.errorMessage = 'Failed to approve member';
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      }
    });
  }

  rejectMember(memberId: number): void {
    if (confirm('Are you sure you want to reject this member?')) {
      this.apiService.rejectMember(memberId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Member rejected';
            this.loadData(); // Reload data
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          }
        },
        error: (error) => {
          console.error('Error rejecting member:', error);
          this.errorMessage = 'Failed to reject member';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
  }

  assignAdmin(memberId: number): void {
    if (confirm('Are you sure you want to assign admin role to this member?')) {
      this.apiService.assignAdmin(memberId).subscribe({
        next: (response) => {
          if (response.success) {
            this.successMessage = 'Admin role assigned successfully';
            this.loadData(); // Reload data
            setTimeout(() => {
              this.successMessage = '';
            }, 3000);
          }
        },
        error: (error) => {
          console.error('Error assigning admin:', error);
          this.errorMessage = 'Failed to assign admin role';
          setTimeout(() => {
            this.errorMessage = '';
          }, 3000);
        }
      });
    }
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

