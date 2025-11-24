import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ApiService, Member, ClubDetails, ClubDetailsRequest, AuditLog, AuditLogPageResponse, ContactMessageResponse, ContactMessagePageResponse } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { ConfirmationDialogService } from '../../services/confirmation-dialog.service';
import { fadeIn } from '../../animations/route.animations';
import { APP_MESSAGES } from '../../constants/app.messages';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.scss'],
  animations: [fadeIn]
})
export class AdminDashboardComponent implements OnInit {
  activeTab: 'pending' | 'approved' | 'admins' | 'club-details' | 'audit-logs' | 'contact-messages' = 'pending';
  
  pendingMembers: Member[] = [];
  approvedMembers: Member[] = [];
  admins: Member[] = [];
  managers: Member[] = [];
  auditLogs: AuditLog[] = [];
  auditLogPageResponse: any = null;
  auditLogCurrentPage = 0;
  auditLogPageSize = 10;
  auditLogTotalPages = 0;
  auditLogTotalElements = 0;
  
  // Audit log filters
  auditLogActionTypeFilter: string = '';
  auditLogStartDate: string = '';
  auditLogEndDate: string = '';
  
  isLoading = false;
  isLoadingAuditLogs = false;
  isLoadingContactMessages = false;
  contactMessages: ContactMessageResponse[] = [];
  contactMessagePageResponse: ContactMessagePageResponse | null = null;
  contactMessageCurrentPage = 0;
  contactMessagePageSize = 10;
  contactMessageTotalPages = 0;
  contactMessageTotalElements = 0;
  selectedContactMessageIds: Set<number> = new Set();
  errorMessage = '';
  successMessage = '';
  currentUserMember: Member | null = null;
  
  // Club details
  clubDetails: any = null;
  clubDetailsForm: any = null;
  isSavingClubDetails = false;
  isEditingClubDetails = false;
  originalClubDetails: any = null;
  selectedClubImage: File | null = null;
  clubImagePreview: string | null = null;
  selectedClubLogo: File | null = null;
  clubLogoPreview: string | null = null;

  // Expose constants for template
  readonly APP_MESSAGES = APP_MESSAGES;
  
  // Expose Math for template
  Math = Math;
  
  // Permission helpers (exposed to template)
  canApproveReject = () => this.authService.canApproveReject();
  canAssignAdmin = () => this.authService.canAssignAdmin();
  isMember = () => this.authService.isMember();
  getUserRole = () => this.authService.getUserRole();
  
  // Get dashboard subtitle based on user role
  getDashboardSubtitle(): string {
    if (this.authService.isMember()) {
      return APP_MESSAGES.UI.MEMBER_DASHBOARD_SUBTITLE;
    }
    return APP_MESSAGES.UI.ADMIN_DASHBOARD_SUBTITLE;
  }
  
  // Get current user info
  getCurrentUser() {
    return this.authService.getCurrentUser();
  }
  
  // Get user profile picture URL
  getUserProfilePictureUrl(): string | null {
    if (this.currentUserMember?.profilePictureUrl) {
      // If it's already a full URL, return it
      if (this.currentUserMember.profilePictureUrl.startsWith('http://') || 
          this.currentUserMember.profilePictureUrl.startsWith('https://')) {
        return this.currentUserMember.profilePictureUrl;
      }
      // Otherwise, use API service to construct URL from filename
      return this.apiService.getProfilePictureUrl(this.currentUserMember.profilePictureUrl);
    }
    return null;
  }

  // Get profile picture URL for any member
  getMemberProfilePictureUrl(member: any): string | null {
    if (member?.profilePictureUrl) {
      // If it's already a full URL, return it
      if (member.profilePictureUrl.startsWith('http://') || 
          member.profilePictureUrl.startsWith('https://')) {
        return member.profilePictureUrl;
      }
      // Otherwise, use API service to construct URL from filename
      return this.apiService.getProfilePictureUrl(member.profilePictureUrl);
    }
    return null;
  }

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private router: Router,
    private toastService: ToastService,
    private confirmationDialog: ConfirmationDialogService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    // Check if user is authenticated (all roles can access dashboard)
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }

    // Set default tab based on role
    // Members only see approved tab
    if (this.authService.isMember()) {
      this.activeTab = 'approved';
    }

    this.initializeClubDetailsForm();
    this.loadCurrentUserDetails();
    this.loadData();
    this.loadClubDetails();
    
    // Contact messages will be loaded when user clicks on the Contact Messages tab
  }
  
  loadCurrentUserDetails(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      // Fetch full member details including profile picture
      this.apiService.getApprovedMembers().subscribe({
        next: (members) => {
          // Find current user in the members list
          this.currentUserMember = members.find(m => m.id === currentUser.id) || null;
        },
        error: (error) => {
          console.error('Error loading current user details:', error);
        }
      });
    }
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

    // Load approved members (exclude admins and managers - they're shown in separate tab)
    this.apiService.getApprovedMembers().subscribe({
      next: (members) => {
        this.approvedMembers = members.filter(m => m.role !== 'admin' && m.role !== 'manager');
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

    // Load managers
    this.apiService.getAllManagers().subscribe({
      next: (members) => {
        this.managers = members;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading managers:', error);
        this.managers = [];
        this.isLoading = false;
      }
    });
  }

  switchTab(tab: 'pending' | 'approved' | 'admins' | 'club-details' | 'audit-logs' | 'contact-messages'): void {
    this.activeTab = tab;
    // Load audit logs when tab is switched to audit-logs
    if (tab === 'audit-logs') {
      this.loadAuditLogs();
    }
    // Load contact messages when tab is switched to contact-messages
    if (tab === 'contact-messages') {
      this.loadContactMessages();
    }
  }

  approveMember(memberId: number): void {
    // Check permission before action
    if (!this.authService.canApproveReject()) {
      this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED_APPROVE_REJECT);
      return;
    }

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
            if (error.status === 403) {
              this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED_APPROVE_REJECT);
            } else {
              this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
            }
          }
        });
      }
    });
  }

  rejectMember(memberId: number): void {
    // Check permission before action
    if (!this.authService.canApproveReject()) {
      this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED_APPROVE_REJECT);
      return;
    }

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
            if (error.status === 403) {
              this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED_APPROVE_REJECT);
            } else {
              this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
            }
          }
        });
      }
    });
  }

  assignAdmin(memberId: number): void {
    // Check permission before action
    if (!this.authService.canAssignAdmin()) {
      this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
      return;
    }

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
            if (error.status === 403) {
              this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
            } else {
              this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
            }
          }
        });
      }
    });
  }

  assignManager(memberId: number): void {
    // Check permission before action
    if (!this.authService.canAssignAdmin()) {
      this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
      return;
    }

    this.confirmationDialog.show({
      title: APP_MESSAGES.CONFIRMATION.ASSIGN_MANAGER_TITLE,
      message: APP_MESSAGES.CONFIRMATION.ASSIGN_MANAGER,
      confirmText: APP_MESSAGES.CONFIRMATION.BUTTON_ASSIGN,
      cancelText: APP_MESSAGES.CONFIRMATION.BUTTON_CANCEL,
      type: 'warning'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.assignManager(memberId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success(APP_MESSAGES.SUCCESS.MANAGER_ASSIGNED);
              this.loadData(); // Reload data
            }
          },
          error: (error) => {
            console.error('Error assigning manager:', error);
            if (error.status === 403) {
              this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
            } else {
              this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
            }
          }
        });
      }
    });
  }

  removeMember(memberId: number, memberRole?: string): void {
    const currentUserRole = this.authService.getUserRole();
    
    // Check permission: admin can remove non-admins, manager can only remove members
    if (currentUserRole === 'admin') {
      // Admin can remove any non-admin
      if (memberRole === 'admin') {
        this.toastService.error(APP_MESSAGES.ERROR.ADMIN_CANNOT_BE_REMOVED);
        return;
      }
    } else if (currentUserRole === 'manager') {
      // Manager can only remove members
      if (memberRole !== 'member') {
        this.toastService.error(APP_MESSAGES.ERROR.CAN_ONLY_REMOVE_MEMBERS);
        return;
      }
    } else {
      this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED_REMOVE);
      return;
    }

    this.confirmationDialog.show({
      title: APP_MESSAGES.CONFIRMATION.REMOVE_MEMBER_TITLE,
      message: APP_MESSAGES.CONFIRMATION.REMOVE_MEMBER,
      confirmText: APP_MESSAGES.CONFIRMATION.BUTTON_REMOVE,
      cancelText: APP_MESSAGES.CONFIRMATION.BUTTON_CANCEL,
      type: 'danger'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.removeMember(memberId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success(APP_MESSAGES.SUCCESS.MEMBER_REMOVED);
              this.loadData(); // Reload data
            }
          },
          error: (error) => {
            console.error('Error removing member:', error);
            if (error.status === 403) {
              this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED_REMOVE_MEMBER);
            } else {
              this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
            }
          }
        });
      }
    });
  }

  demoteManager(memberId: number): void {
    // Check permission: only admin can demote manager
    if (!this.authService.canAssignAdmin()) {
      this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
      return;
    }

    this.confirmationDialog.show({
      title: APP_MESSAGES.CONFIRMATION.DEMOTE_MANAGER_TITLE,
      message: APP_MESSAGES.CONFIRMATION.DEMOTE_MANAGER,
      confirmText: APP_MESSAGES.CONFIRMATION.BUTTON_DEMOTE,
      cancelText: APP_MESSAGES.CONFIRMATION.BUTTON_CANCEL,
      type: 'warning'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.demoteManagerToMember(memberId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success(APP_MESSAGES.SUCCESS.MANAGER_DEMOTED);
              this.loadData(); // Reload data
            }
          },
          error: (error) => {
            console.error('Error demoting manager:', error);
            if (error.status === 403) {
              this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
            } else {
              this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
            }
          }
        });
      }
    });
  }

  promoteManager(memberId: number): void {
    // Check permission: only admin can promote manager
    if (!this.authService.canAssignAdmin()) {
      this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
      return;
    }

    this.confirmationDialog.show({
      title: APP_MESSAGES.CONFIRMATION.PROMOTE_MANAGER_TITLE,
      message: APP_MESSAGES.CONFIRMATION.PROMOTE_MANAGER,
      confirmText: APP_MESSAGES.CONFIRMATION.BUTTON_PROMOTE,
      cancelText: APP_MESSAGES.CONFIRMATION.BUTTON_CANCEL,
      type: 'warning'
    }).then((confirmed) => {
      if (confirmed) {
        this.apiService.promoteManagerToAdmin(memberId).subscribe({
          next: (response) => {
            if (response.success) {
              this.toastService.success(APP_MESSAGES.SUCCESS.MANAGER_PROMOTED);
              this.loadData(); // Reload data
            }
          },
          error: (error) => {
            console.error('Error promoting manager:', error);
            if (error.status === 403) {
              this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
            } else {
              this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR);
            }
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
    if (!dateString) return APP_MESSAGES.UI.GENDER_FORMAT.NOT_AVAILABLE;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  formatGender(gender?: string): string {
    if (!gender) return APP_MESSAGES.UI.GENDER_FORMAT.NOT_AVAILABLE;
    const genderMap: { [key: string]: string } = {
      'male': APP_MESSAGES.UI.GENDER_FORMAT.MALE,
      'female': APP_MESSAGES.UI.GENDER_FORMAT.FEMALE,
      'other': APP_MESSAGES.UI.GENDER_FORMAT.OTHER,
      'prefer-not-to-say': APP_MESSAGES.UI.GENDER_FORMAT.PREFER_NOT_TO_SAY
    };
    return genderMap[gender] || gender;
  }
  
  initializeClubDetailsForm(): void {
    this.clubDetailsForm = this.fb.group({
      clubName: ['', [Validators.required, Validators.maxLength(255)]],
      establishedYear: ['', [Validators.required, Validators.min(1800), Validators.max(2100)]],
      description: ['', [Validators.required, Validators.minLength(50)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]],
      address: ['', [Validators.required]],
      businessHours: ['', [Validators.required, Validators.maxLength(255)]],
      clubImage: [''],
      clubLogo: ['']
    });
  }
  
  loadClubDetails(): void {
    this.apiService.getClubDetails().subscribe({
      next: (details) => {
        this.clubDetails = details;
        this.originalClubDetails = { ...details }; // Store original for cancel
        // Clear any selected image when loading
        this.selectedClubImage = null;
        this.selectedClubLogo = null;
        // Set image preview if club image exists (with cache busting on first load)
        if (details.clubImage) {
          const imageUrl = this.getClubImagePath(details.clubImage);
          // Add cache busting parameter to ensure fresh load
          this.clubImagePreview = imageUrl + '?t=' + Date.now();
        } else {
          this.clubImagePreview = null;
        }
        // Set logo preview if club logo exists
        if (details.clubLogo) {
          const logoUrl = this.getClubLogoPath(details.clubLogo);
          this.clubLogoPreview = logoUrl + '?t=' + Date.now();
        } else {
          this.clubLogoPreview = null;
        }
        // Populate form if details exist
        if (details && this.clubDetailsForm) {
          this.clubDetailsForm.patchValue({
            clubName: details.clubName,
            establishedYear: details.establishedYear,
            description: details.description,
            email: details.email,
            phone: details.phone,
            address: details.address,
            businessHours: details.businessHours,
            clubImage: details.clubImage || '',
            clubLogo: details.clubLogo || ''
          });
          // Disable form by default (read-only mode)
          this.clubDetailsForm.disable();
        }
      },
      error: (error) => {
        console.error('Error loading club details:', error);
        // If not found, form will be empty for initial creation
        if (this.clubDetailsForm) {
          this.clubDetailsForm.disable();
        }
      }
    });
  }
  
  getClubImagePath(imageName: string): string {
    if (!imageName) return '';
    // Use API service to get the club image URL
    return this.apiService.getClubImageUrl(imageName);
  }

  getClubLogoPath(logoName: string): string {
    if (!logoName) return '';
    // Use API service to get the club logo URL
    return this.apiService.getClubLogoUrl(logoName);
  }
  
  saveImageToLocal(file: File): void {
    // Note: Browser security prevents direct file system writes
    // The image file would need to be uploaded to the server
    // For now, we're just storing the filename in the database
    // The actual file should be manually placed in the club-images directory
    // on the macOS system or uploaded through a file upload API
    // TODO: Implement file upload to server if needed
  }
  
  onClubImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type - only JPG/JPEG or PNG allowed
      if (!APP_CONSTANTS.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        this.toastService.error(APP_MESSAGES.FILE_UPLOAD.INVALID_TYPE);
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > APP_CONSTANTS.FILE_UPLOAD.MAX_SIZE) {
        this.toastService.error(APP_MESSAGES.FILE_UPLOAD.FILE_TOO_LARGE);
        return;
      }
      
      this.selectedClubImage = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.clubImagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Note: We don't update the form yet - the filename will be set after upload
    }
  }
  
  clearClubImage(): void {
    // Clear the selected file
    this.selectedClubImage = null;
    
    // Clear the preview
    this.clubImagePreview = null;
    
    // Clear the form field
    if (this.clubDetailsForm) {
      this.clubDetailsForm.patchValue({
        clubImage: ''
      });
    }
    
    // Note: We don't restore the original image here because the user explicitly wants to clear it
    // The original will be restored if they cancel editing
  }

  onClubLogoSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validate file type - only JPG/JPEG or PNG allowed
      if (!APP_CONSTANTS.FILE_UPLOAD.ALLOWED_TYPES.includes(file.type.toLowerCase())) {
        this.toastService.error(APP_MESSAGES.FILE_UPLOAD.INVALID_TYPE);
        return;
      }
      
      // Validate file size (max 2MB)
      if (file.size > APP_CONSTANTS.FILE_UPLOAD.MAX_SIZE) {
        this.toastService.error(APP_MESSAGES.FILE_UPLOAD.FILE_TOO_LARGE_LOGO);
        return;
      }
      
      this.selectedClubLogo = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.clubLogoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  clearClubLogo(): void {
    // Clear the selected file
    this.selectedClubLogo = null;
    
    // Clear the preview
    this.clubLogoPreview = null;
    
    // Clear the form field
    if (this.clubDetailsForm) {
      this.clubDetailsForm.patchValue({
        clubLogo: ''
      });
    }
  }

  onClubLogoError(event: Event): void {
    const img = event.target as HTMLImageElement;
    const currentSrc = img.src;
    // Add cache busting parameter if not already present
    if (!currentSrc.includes('?t=')) {
      img.src = currentSrc + '?t=' + new Date().getTime();
    } else {
      // If already tried with cache busting, hide the image
      img.style.display = 'none';
    }
  }

  onClubImageError(event: Event): void {
    console.error('Error loading club image:', event);
    const img = event.target as HTMLImageElement;
    // Try to reload with cache busting
    if (img.src) {
      const url = new URL(img.src);
      url.searchParams.set('t', Date.now().toString());
      img.src = url.toString();
    }
  }
  
  clearForm(): void {
    if (this.clubDetailsForm) {
      // Clear all form fields to empty
      this.clubDetailsForm.reset({
        clubName: '',
        establishedYear: '',
        description: '',
        email: '',
        phone: '',
        address: '',
        businessHours: '',
        clubImage: '',
        clubLogo: ''
      });
      this.selectedClubImage = null;
      this.clubImagePreview = null;
      this.selectedClubLogo = null;
      this.clubLogoPreview = null;
      // Mark all fields as untouched to clear validation errors
      Object.keys(this.clubDetailsForm.controls).forEach(key => {
        this.clubDetailsForm.get(key)?.markAsUntouched();
      });
    }
  }
  
  
  enableEditMode(): void {
    this.isEditingClubDetails = true;
    if (this.clubDetailsForm) {
      this.clubDetailsForm.enable();
      // Mark all fields as touched to show validation errors if any
      Object.keys(this.clubDetailsForm.controls).forEach(key => {
        this.clubDetailsForm.get(key)?.markAsTouched();
      });
    }
  }
  
  cancelEdit(): void {
    this.isEditingClubDetails = false;
    this.selectedClubImage = null; // Clear selected image
    if (this.clubDetailsForm && this.originalClubDetails) {
      // Restore original values
      this.clubDetailsForm.patchValue({
        clubName: this.originalClubDetails.clubName,
        establishedYear: this.originalClubDetails.establishedYear,
        description: this.originalClubDetails.description,
        email: this.originalClubDetails.email,
        phone: this.originalClubDetails.phone,
        address: this.originalClubDetails.address,
        businessHours: this.originalClubDetails.businessHours,
        clubImage: this.originalClubDetails.clubImage || '',
        clubLogo: this.originalClubDetails.clubLogo || ''
      });
      // Restore original image preview
      if (this.originalClubDetails.clubImage) {
        this.clubImagePreview = this.getClubImagePath(this.originalClubDetails.clubImage);
      } else {
        this.clubImagePreview = null;
      }
      // Restore original logo preview
      if (this.originalClubDetails.clubLogo) {
        this.clubLogoPreview = this.getClubLogoPath(this.originalClubDetails.clubLogo);
      } else {
        this.clubLogoPreview = null;
      }
      this.selectedClubLogo = null;
      this.clubDetailsForm.disable();
    }
  }
  
  saveClubDetails(): void {
    if (!this.clubDetailsForm || !this.apiService || !this.toastService) {
      return;
    }
    
    if (this.clubDetailsForm.valid && !this.isSavingClubDetails) {
      this.isSavingClubDetails = true;
      
      const formValue = this.clubDetailsForm.value;
      
      // Helper function to save club details after uploads
      const saveDetails = (logoFilename?: string, imageFilename?: string) => {
        const request: ClubDetailsRequest = {
          clubName: formValue?.clubName || '',
          establishedYear: formValue?.establishedYear || 0,
          description: formValue?.description || '',
          email: formValue?.email || '',
          phone: formValue?.phone || '',
          address: formValue?.address || '',
          businessHours: formValue?.businessHours || '',
          clubImage: imageFilename || formValue?.clubImage || '',
          clubLogo: logoFilename || formValue?.clubLogo || ''
        };
        
        this.saveClubDetailsRequest(request);
      };
      
      // If both logo and image are selected, upload logo first, then image, then save
      if (this.selectedClubLogo && this.selectedClubImage) {
        this.apiService.uploadClubLogo(this.selectedClubLogo).subscribe({
          next: (logoResponse) => {
            if (logoResponse.success && logoResponse.filename) {
              // Logo uploaded, now upload image
              this.apiService.uploadClubImage(this.selectedClubImage!).subscribe({
                next: (imageResponse) => {
                  if (imageResponse.success && imageResponse.filename) {
                    saveDetails(logoResponse.filename, imageResponse.filename);
                  } else {
                    this.toastService.error(imageResponse.message || APP_MESSAGES.FILE_UPLOAD.CLUB_IMAGE_UPLOAD_FAILED);
                    this.isSavingClubDetails = false;
                  }
                },
                error: (error) => {
                  console.error('Error uploading club image:', error);
                  this.toastService.error(APP_MESSAGES.FILE_UPLOAD.CLUB_IMAGE_UPLOAD_FAILED);
                  this.isSavingClubDetails = false;
                }
              });
            } else {
              this.toastService.error(logoResponse.message || APP_MESSAGES.FILE_UPLOAD.CLUB_LOGO_UPLOAD_FAILED);
              this.isSavingClubDetails = false;
            }
          },
          error: (error) => {
            console.error('Error uploading club logo:', error);
            this.toastService.error(APP_MESSAGES.FILE_UPLOAD.CLUB_LOGO_UPLOAD_FAILED);
            this.isSavingClubDetails = false;
          }
        });
      } else if (this.selectedClubLogo) {
        // Only logo selected
        this.apiService.uploadClubLogo(this.selectedClubLogo).subscribe({
          next: (logoResponse) => {
            if (logoResponse.success && logoResponse.filename) {
              saveDetails(logoResponse.filename);
            } else {
              this.toastService.error(logoResponse.message || APP_MESSAGES.FILE_UPLOAD.CLUB_LOGO_UPLOAD_FAILED);
              this.isSavingClubDetails = false;
            }
          },
          error: (error) => {
            console.error('Error uploading club logo:', error);
            this.toastService.error(APP_MESSAGES.FILE_UPLOAD.CLUB_LOGO_UPLOAD_FAILED);
            this.isSavingClubDetails = false;
          }
        });
      } else if (this.selectedClubImage) {
        // Only image selected
        this.apiService.uploadClubImage(this.selectedClubImage).subscribe({
          next: (imageResponse) => {
            if (imageResponse.success && imageResponse.filename) {
              saveDetails(undefined, imageResponse.filename);
            } else {
              this.toastService.error(imageResponse.message || APP_MESSAGES.FILE_UPLOAD.CLUB_IMAGE_UPLOAD_FAILED);
              this.isSavingClubDetails = false;
            }
          },
          error: (error) => {
            console.error('Error uploading club image:', error);
            this.toastService.error(APP_MESSAGES.FILE_UPLOAD.CLUB_IMAGE_UPLOAD_FAILED);
            this.isSavingClubDetails = false;
          }
        });
      } else {
        // No new files, save directly
        saveDetails();
      }
    } else {
      // Mark all fields as touched to show validation errors
      if (this.clubDetailsForm && this.clubDetailsForm.controls) {
        Object.keys(this.clubDetailsForm.controls).forEach(key => {
          this.clubDetailsForm?.get(key)?.markAsTouched();
        });
      }
    }
  }
  
  private saveClubDetailsRequest(request: ClubDetailsRequest): void {
    this.apiService.updateClubDetails(request).subscribe({
        next: (response: ClubDetails) => {
          if (this.clubDetails) {
            this.clubDetails = response;
          }
          if (this.originalClubDetails !== null) {
            this.originalClubDetails = { ...response };
          }
          // Update image preview with the saved image path (with cache busting)
          if (response.clubImage) {
            const imageUrl = this.getClubImagePath(response.clubImage);
            // Add cache busting parameter to force reload
            this.clubImagePreview = imageUrl + '?t=' + Date.now();
          } else {
            this.clubImagePreview = null;
          }
          // Update logo preview with the saved logo path (with cache busting)
          if (response.clubLogo) {
            const logoUrl = this.getClubLogoPath(response.clubLogo);
            this.clubLogoPreview = logoUrl + '?t=' + Date.now();
          } else {
            this.clubLogoPreview = null;
          }
          
          // Notify other components (like AppComponent) that club details have been updated
          this.apiService.notifyClubDetailsUpdated(response);
          // Clear selected files after save
          this.selectedClubImage = null;
          this.selectedClubLogo = null;
          // Update form with the response data
          if (this.clubDetailsForm) {
            this.clubDetailsForm.patchValue({
              clubImage: response.clubImage || '',
              clubLogo: response.clubLogo || ''
            });
          }
          this.isEditingClubDetails = false;
          if (this.clubDetailsForm) {
            this.clubDetailsForm.disable();
          }
          if (this.toastService) {
            this.toastService.success(APP_MESSAGES.SUCCESS.CLUB_DETAILS_SAVED);
          }
          this.isSavingClubDetails = false;
        },
        error: (error: any) => {
          console.error('Error saving club details:', error);
          if (this.toastService) {
            this.toastService.error(APP_MESSAGES.ERROR.CLUB_DETAILS_SAVE_FAILED);
          }
          this.isSavingClubDetails = false;
        }
      });
  }

  /**
   * Load audit logs with pagination and filters
   */
  loadAuditLogs(page: number = 0): void {
    this.isLoadingAuditLogs = true;
    this.auditLogCurrentPage = page;
    
    // Format dates for API (ISO format)
    const startDate = this.auditLogStartDate ? new Date(this.auditLogStartDate + 'T00:00:00').toISOString() : undefined;
    const endDate = this.auditLogEndDate ? new Date(this.auditLogEndDate + 'T23:59:59').toISOString() : undefined;
    
    this.apiService.getAuditLogs(
      this.auditLogActionTypeFilter || undefined,
      startDate,
      endDate,
      page,
      this.auditLogPageSize
    ).subscribe({
      next: (response) => {
        this.auditLogPageResponse = response;
        this.auditLogs = response.content;
        this.auditLogCurrentPage = response.page;
        this.auditLogTotalPages = response.totalPages;
        this.auditLogTotalElements = response.totalElements;
        this.isLoadingAuditLogs = false;
      },
      error: (error) => {
        console.error('Error loading audit logs:', error);
        this.isLoadingAuditLogs = false;
        this.toastService.error('Failed to load audit logs. Please try again.');
      }
    });
  }

  /**
   * Apply filters and reload audit logs
   */
  applyAuditLogFilters(): void {
    // Validate end date is not in the future
    if (this.auditLogEndDate) {
      const endDate = new Date(this.auditLogEndDate);
      const today = new Date();
      today.setHours(23, 59, 59, 999); // End of today
      
      if (endDate > today) {
        this.toastService.error('End date cannot be in the future');
        return;
      }
    }
    
    this.loadAuditLogs(0); // Reset to first page when applying filters
  }

  /**
   * Clear audit log filters
   */
  clearAuditLogFilters(): void {
    this.auditLogActionTypeFilter = '';
    this.auditLogStartDate = '';
    this.auditLogEndDate = '';
    this.loadAuditLogs(0);
  }

  /**
   * Go to specific page
   */
  goToAuditLogPage(page: number): void {
    if (page >= 0 && page < this.auditLogTotalPages) {
      this.loadAuditLogs(page);
    }
  }

  /**
   * Get available action types for filter
   */
  getActionTypes(): string[] {
    return [
      'APPROVE',
      'REJECT',
      'REMOVE',
      'ASSIGN_ADMIN',
      'ASSIGN_MANAGER',
      'DEMOTE_MANAGER',
      'PROMOTE_MANAGER',
      'LOGIN'
    ];
  }

  /**
   * Format timestamp for display
   */
  formatTimestamp(timestamp: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Format action type for display
   */
  formatActionType(actionType: string): string {
    if (!actionType) return '';
    return actionType.replace(/_/g, ' ').toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get maximum date for end date filter (today's date)
   */
  getMaxDate(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Load contact messages with pagination
   */
  loadContactMessages(page: number = 0): void {
    if (!this.authService.canApproveReject()) { // Only admin and manager can view contact messages
      this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
      this.contactMessages = [];
      return;
    }

    this.isLoadingContactMessages = true;
    this.contactMessageCurrentPage = page;
    this.apiService.getContactMessagesPaginated(page, this.contactMessagePageSize).subscribe({
      next: (pageResponse) => {
        this.contactMessagePageResponse = pageResponse;
        this.contactMessages = pageResponse.content;
        this.contactMessageTotalPages = pageResponse.totalPages;
        this.contactMessageTotalElements = pageResponse.totalElements;
        this.isLoadingContactMessages = false;
        // Clear selection when loading new page
        this.selectedContactMessageIds.clear();
      },
      error: (error) => {
        console.error('Error loading contact messages:', error);
        this.isLoadingContactMessages = false;
        if (error.status === 403) {
          this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
        } else {
          this.toastService.error('Failed to load contact messages');
        }
        this.contactMessages = [];
        this.selectedContactMessageIds.clear();
      }
    });
  }

  /**
   * Toggle selection of a contact message
   */
  toggleContactMessageSelection(messageId: number): void {
    if (this.selectedContactMessageIds.has(messageId)) {
      this.selectedContactMessageIds.delete(messageId);
    } else {
      this.selectedContactMessageIds.add(messageId);
    }
  }

  /**
   * Check if a contact message is selected
   */
  isContactMessageSelected(messageId: number): boolean {
    return this.selectedContactMessageIds.has(messageId);
  }

  /**
   * Toggle mark all contact messages on current page
   */
  toggleMarkAllContactMessages(): void {
    const allSelected = this.areAllContactMessagesSelected();
    if (allSelected) {
      // Unmark all on current page
      this.contactMessages.forEach(message => {
        this.selectedContactMessageIds.delete(message.id);
      });
    } else {
      // Mark all on current page
      this.contactMessages.forEach(message => {
        this.selectedContactMessageIds.add(message.id);
      });
    }
  }

  /**
   * Check if all contact messages on current page are selected
   */
  areAllContactMessagesSelected(): boolean {
    if (this.contactMessages.length === 0) return false;
    return this.contactMessages.every(message => this.selectedContactMessageIds.has(message.id));
  }

  /**
   * Check if some (but not all) contact messages on current page are selected
   */
  areSomeContactMessagesSelected(): boolean {
    if (this.contactMessages.length === 0) return false;
    const selectedCount = this.contactMessages.filter(message => 
      this.selectedContactMessageIds.has(message.id)
    ).length;
    return selectedCount > 0 && selectedCount < this.contactMessages.length;
  }

  /**
   * Handle delete button click - shows toast if no messages selected
   */
  handleDeleteButtonClick(): void {
    if (this.selectedContactMessageIds.size === 0) {
      this.toastService.warning(APP_MESSAGES.UI.CONTACT_MESSAGES.SELECT_TO_DELETE);
      return;
    }
    this.deleteSelectedContactMessages();
  }

  /**
   * Delete selected contact messages
   */
  deleteSelectedContactMessages(): void {
    if (this.selectedContactMessageIds.size === 0) {
      this.toastService.warning(APP_MESSAGES.UI.CONTACT_MESSAGES.SELECT_AT_LEAST_ONE);
      return;
    }

    const messageIds = Array.from(this.selectedContactMessageIds);
    const count = messageIds.length;
    
    this.confirmationDialog.show({
      title: APP_MESSAGES.UI.CONTACT_MESSAGES.DELETE_CONFIRM_TITLE,
      message: APP_MESSAGES.UI.CONTACT_MESSAGES.DELETE_CONFIRM_MESSAGE(count),
      confirmText: APP_MESSAGES.CONFIRMATION.BUTTON_REMOVE,
      cancelText: APP_MESSAGES.CONFIRMATION.BUTTON_CANCEL,
      type: 'danger'
    }).then((confirmed: boolean) => {
      if (confirmed) {
        this.isLoadingContactMessages = true;
        this.apiService.deleteContactMessages(messageIds).subscribe({
          next: () => {
            this.toastService.success(APP_MESSAGES.UI.CONTACT_MESSAGES.DELETE_SUCCESS(count));
            this.selectedContactMessageIds.clear();
            // Reload current page
            this.loadContactMessages(this.contactMessageCurrentPage);
          },
          error: (error) => {
            this.isLoadingContactMessages = false;
            if (error.status === 403) {
              this.toastService.error(APP_MESSAGES.ERROR.PERMISSION_DENIED);
            } else {
              this.toastService.error(APP_MESSAGES.UI.CONTACT_MESSAGES.DELETE_FAILED);
            }
          }
        });
      }
    });
  }

  /**
   * Get audit log info text
   */
  getAuditLogInfoText(): string {
    const start = (this.auditLogCurrentPage * this.auditLogPageSize) + 1;
    const end = Math.min((this.auditLogCurrentPage + 1) * this.auditLogPageSize, this.auditLogTotalElements);
    return APP_MESSAGES.UI.AUDIT_LOGS.SHOWING_LOGS(start, end, this.auditLogTotalElements);
  }

  /**
   * Navigate to previous page of contact messages
   */
  previousContactMessagePage(): void {
    if (this.contactMessageCurrentPage > 0) {
      this.loadContactMessages(this.contactMessageCurrentPage - 1);
    }
  }

  /**
   * Navigate to next page of contact messages
   */
  nextContactMessagePage(): void {
    if (this.contactMessageCurrentPage < this.contactMessageTotalPages - 1) {
      this.loadContactMessages(this.contactMessageCurrentPage + 1);
    }
  }

  /**
   * Format timestamp for contact messages display
   */
  formatContactTimestamp(timestamp: string): string {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  }

  /**
   * Truncate message text for table display
   */
  truncateMessage(message: string, maxLength: number = 100): string {
    if (!message) return '';
    if (message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  }

  /**
   * Get profile picture alt text
   */
  getProfilePictureAlt(name?: string): string {
    if (!name) return APP_MESSAGES.UI.IMAGE_ALT.PROFILE_PREVIEW;
    return APP_MESSAGES.UI.IMAGE_ALT.PROFILE_PICTURE(name);
  }
}

