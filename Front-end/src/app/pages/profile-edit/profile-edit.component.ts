import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { APP_MESSAGES } from '../../constants/app.messages';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-profile-edit',
  templateUrl: './profile-edit.component.html',
  styleUrls: ['./profile-edit.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ProfileEditComponent implements OnInit {
  profileForm: FormGroup;
  isSubmitting = false;
  isUploadingProfilePicture = false;
  selectedFile: File | null = null;
  profilePicturePreview: string | null = null;
  currentProfilePictureUrl: string | null = null;
  userProfile: any = null;
  showCropper = false;
  fileForCropping: File | null = null;
  
  readonly APP_MESSAGES = APP_MESSAGES;
  
  genderOptions = [
    { value: 'male', label: APP_MESSAGES.UI.REGISTRATION.GENDER_OPTIONS.MALE },
    { value: 'female', label: APP_MESSAGES.UI.REGISTRATION.GENDER_OPTIONS.FEMALE },
    { value: 'other', label: APP_MESSAGES.UI.REGISTRATION.GENDER_OPTIONS.OTHER },
    { value: 'prefer-not-to-say', label: APP_MESSAGES.UI.REGISTRATION.GENDER_OPTIONS.PREFER_NOT_TO_SAY }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: [{ value: '', disabled: true }], // Read-only - disabled at form creation
      dateOfBirth: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }
    
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    const currentUser = this.authService.getCurrentUser();
    if (currentUser && currentUser.id) {
      // Fetch full member details including profile picture
      this.apiService.getApprovedMembers().subscribe({
        next: (members) => {
          this.userProfile = members.find(m => m.id === currentUser.id) || null;
          if (this.userProfile) {
            // Populate form with current user data
            this.profileForm.patchValue({
              fullName: this.userProfile.fullName || '',
              email: this.userProfile.email || '',
              dateOfBirth: this.userProfile.dateOfBirth ? this.formatDateForInput(this.userProfile.dateOfBirth) : '',
              gender: this.userProfile.gender || ''
            });
            
            // Set current profile picture URL
            if (this.userProfile.profilePictureUrl) {
              if (this.userProfile.profilePictureUrl.startsWith('http://') || 
                  this.userProfile.profilePictureUrl.startsWith('https://')) {
                this.currentProfilePictureUrl = this.userProfile.profilePictureUrl;
              } else {
                this.currentProfilePictureUrl = this.apiService.getProfilePictureUrl(this.userProfile.profilePictureUrl);
              }
            }
          }
        },
        error: (error) => {
          console.error('Error loading user profile:', error);
          this.toastService.error(APP_MESSAGES.ERROR.GENERIC_ERROR, 5000);
        }
      });
    }
  }

  formatDateForInput(date: string | Date): string {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  onProfilePictureSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.toastService.error(APP_MESSAGES.FILE_UPLOAD.INVALID_TYPE, 5000);
        return;
      }
      
      // Validate file size (max 2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        this.toastService.error('File size must be less than 2MB', 5000);
        return;
      }
      
      // Store file for cropping and open cropper
      this.fileForCropping = file;
      this.showCropper = true;
    }
  }

  onImageCropped(event: { file: File; base64: string }): void {
    console.log('Profile Edit: Image cropped event received:', event);
    if (event && event.file && event.base64) {
      this.selectedFile = event.file;
      this.profilePicturePreview = event.base64;
      this.showCropper = false;
      this.fileForCropping = null;
      // Force change detection
      setTimeout(() => {
        console.log('Profile Edit: Preview updated, file:', this.selectedFile?.name, 'preview length:', this.profilePicturePreview?.length);
      }, 0);
    } else {
      console.error('Profile Edit: Invalid cropped image event:', event);
    }
  }

  onCropperCancel(): void {
    this.showCropper = false;
    this.fileForCropping = null;
    // Reset file input
    const fileInput = document.getElementById('profilePictureInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  uploadProfilePicture(): void {
    if (!this.selectedFile) {
      return;
    }
    
    this.isUploadingProfilePicture = true;
    
    this.apiService.updateProfilePicture(this.selectedFile).subscribe({
      next: (response) => {
        if (response.success) {
          this.toastService.success(APP_MESSAGES.SUCCESS.PROFILE_PICTURE_UPDATED_SUCCESS, 3000);
          // Update current picture URL immediately to avoid gap
          if (response.url) {
            this.currentProfilePictureUrl = response.url;
            this.profilePicturePreview = null;
            this.selectedFile = null;
            // Reset file input
            const fileInput = document.getElementById('profilePictureInput') as HTMLInputElement;
            if (fileInput) {
              fileInput.value = '';
            }
            // Reload user profile to get updated data (but keep current picture visible)
            setTimeout(() => {
              this.loadUserProfile();
            }, 100);
          }
        } else {
          this.toastService.error(response.message || APP_MESSAGES.ERROR.PROFILE_PICTURE_UPDATE_FAILED, 5000);
        }
        this.isUploadingProfilePicture = false;
      },
      error: (error) => {
        this.isUploadingProfilePicture = false;
        const errorMsg = error.error?.message || APP_MESSAGES.ERROR.PROFILE_PICTURE_UPDATE_FAILED;
        this.toastService.error(errorMsg, 5000);
      }
    });
  }

  removeProfilePictureSelection(): void {
    this.selectedFile = null;
    this.profilePicturePreview = null;
    // Reset file input
    const fileInput = document.getElementById('profilePictureInput') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.profileForm.controls).forEach(key => {
        this.profileForm.get(key)?.markAsTouched();
      });
      return;
    }
    
    this.isSubmitting = true;
    // Disable only editable form controls during submission (not email)
    this.profileForm.get('fullName')?.disable();
    this.profileForm.get('dateOfBirth')?.disable();
    this.profileForm.get('gender')?.disable();
    
    const formValue = this.profileForm.getRawValue(); // Use getRawValue() to get disabled field values
    const updateData = {
      fullName: formValue.fullName,
      dateOfBirth: formValue.dateOfBirth,
      gender: formValue.gender,
      profilePictureUrl: this.userProfile?.profilePictureUrl || null // Keep existing if not updated
    };
    
    this.apiService.updateProfile(updateData).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        // Re-enable only editable form controls
        this.profileForm.get('fullName')?.enable();
        this.profileForm.get('dateOfBirth')?.enable();
        this.profileForm.get('gender')?.enable();
        // Email remains disabled (was disabled at form creation)
        
        if (response.success) {
          this.toastService.success(APP_MESSAGES.SUCCESS.PROFILE_UPDATED_SUCCESS, 3000);
          // Redirect to dashboard immediately
          this.router.navigate(['/admin/dashboard']);
        } else {
          this.toastService.error(response.message || APP_MESSAGES.ERROR.PROFILE_UPDATE_FAILED, 5000);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        // Re-enable only editable form controls on error
        this.profileForm.get('fullName')?.enable();
        this.profileForm.get('dateOfBirth')?.enable();
        this.profileForm.get('gender')?.enable();
        // Email remains disabled (was disabled at form creation)
        
        const errorMsg = error.error?.message || APP_MESSAGES.ERROR.PROFILE_UPDATE_FAILED;
        this.toastService.error(errorMsg, 5000);
      }
    });
  }

  cancel(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  getErrorMessage(fieldName: string): string {
    const control = this.profileForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return APP_MESSAGES.VALIDATION.REQUIRED(this.getFieldLabel(fieldName));
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return APP_MESSAGES.VALIDATION.MIN_LENGTH(this.getFieldLabel(fieldName), minLength);
    }
    
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return APP_MESSAGES.VALIDATION.MAX_LENGTH(this.getFieldLabel(fieldName), maxLength);
    }
    
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: APP_MESSAGES.FORM_LABELS.FULL_NAME,
      email: APP_MESSAGES.FORM_LABELS.EMAIL,
      dateOfBirth: APP_MESSAGES.FORM_LABELS.DATE_OF_BIRTH,
      gender: APP_MESSAGES.FORM_LABELS.GENDER
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.profileForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

