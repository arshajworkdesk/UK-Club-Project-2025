import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { ApiService } from '../../services/api.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { APP_MESSAGES } from '../../constants/app.messages';
import { strongPasswordValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('cardEntrance', [
      transition(':enter', [
        style({ opacity: 0, transform: 'scale(0.9) translateY(50px) rotateX(10deg)' }),
        animate('1s cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ opacity: 1, transform: 'scale(1) translateY(0) rotateX(0deg)' }))
      ])
    ]),
    trigger('headerEntrance', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(-20px)' }),
        animate('0.8s 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('wordStagger', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(20px) scale(0.8)' }),
        animate('0.6s cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ])
    ]),
    trigger('subtitleEntrance', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-30px)' }),
        animate('0.6s 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ]),
    trigger('staggerAnimation', [
      transition(':enter', [
        query('.form-group, .submit-button', [
          style({ opacity: 0, transform: 'translateY(30px) scale(0.95)' }),
          stagger(120, [
            animate('0.5s cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
          ])
        ], { optional: true })
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px) scale(0.9)' }),
        animate('0.4s cubic-bezier(0.34, 1.56, 0.64, 1)', style({ opacity: 1, transform: 'translateX(0) scale(1)' }))
      ])
    ])
  ]
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  isSubmitting = false;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage = '';
  particles: Array<{x: number, y: number, delay: number}> = [];
  selectedFile: File | null = null;
  profilePicturePreview: string | null = null;
  profilePictureError: string = '';
  showCropper = false;
  fileForCropping: File | null = null;
  
  clubDetails: any = {
    clubName: APP_CONSTANTS.BRAND_NAME
  };
  isLoadingClubDetails = true;
  
  // Expose constants for template
  readonly APP_MESSAGES = APP_MESSAGES;
  readonly APP_CONSTANTS = APP_CONSTANTS;
  
  genderOptions = [
    { value: 'male', label: APP_MESSAGES.UI.REGISTRATION.GENDER_OPTIONS.MALE },
    { value: 'female', label: APP_MESSAGES.UI.REGISTRATION.GENDER_OPTIONS.FEMALE },
    { value: 'other', label: APP_MESSAGES.UI.REGISTRATION.GENDER_OPTIONS.OTHER },
    { value: 'prefer-not-to-say', label: APP_MESSAGES.UI.REGISTRATION.GENDER_OPTIONS.PREFER_NOT_TO_SAY }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.generateParticles();
    this.loadClubDetails();
  }

  loadClubDetails(): void {
    this.isLoadingClubDetails = true;
    this.apiService.getClubDetails().subscribe({
      next: (details) => {
        this.clubDetails = {
          clubName: details.clubName || APP_CONSTANTS.BRAND_NAME
        };
        this.isLoadingClubDetails = false;
      },
      error: (error) => {
        // Use default values if API fails
        this.clubDetails = {
          clubName: APP_CONSTANTS.BRAND_NAME
        };
        this.isLoadingClubDetails = false;
      }
    });
  }

  getRegistrationTitle(): string {
    return `Join ${this.clubDetails.clubName}`;
  }

  getRegistrationTitleWords(): string[] {
    return this.getRegistrationTitle().split(' ');
  }

  generateParticles(): void {
    // Generate 50 animated particles for cinematic effect
    for (let i = 0; i < 50; i++) {
      this.particles.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 5
      });
    }
  }

  initializeForm(): void {
    this.registrationForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30)]],
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required, Validators.maxLength(100)]],
      dob: ['', [Validators.required]],
      gender: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');
    
    if (!password || !confirmPassword) {
      return null;
    }
    
    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get fullName() {
    return this.registrationForm.get('fullName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get password() {
    return this.registrationForm.get('password');
  }

  get confirmPassword() {
    return this.registrationForm.get('confirmPassword');
  }

  get dob() {
    return this.registrationForm.get('dob');
  }

  get gender() {
    return this.registrationForm.get('gender');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (!file) {
      return;
    }

    // Reset error
    this.profilePictureError = '';

    // Validate file type
    if (!(APP_CONSTANTS.FILE_UPLOAD.ALLOWED_TYPES as readonly string[]).includes(file.type)) {
      this.profilePictureError = APP_MESSAGES.FILE_UPLOAD.INVALID_TYPE;
      input.value = '';
      return;
    }

    // Validate file size
    if (file.size > APP_CONSTANTS.FILE_UPLOAD.MAX_SIZE) {
      this.profilePictureError = APP_MESSAGES.FILE_UPLOAD.FILE_TOO_LARGE;
      input.value = '';
      return;
    }

    // Store file for cropping and open cropper
    this.fileForCropping = file;
    this.showCropper = true;
  }

  onImageCropped(event: { file: File; base64: string }): void {
    console.log('Registration: Image cropped event received:', event);
    if (event && event.file && event.base64) {
      this.selectedFile = event.file;
      this.profilePicturePreview = event.base64;
      this.showCropper = false;
      this.fileForCropping = null;
      // Force change detection
      setTimeout(() => {
        console.log('Registration: Preview updated, file:', this.selectedFile?.name, 'preview length:', this.profilePicturePreview?.length);
      }, 0);
    } else {
      console.error('Registration: Invalid cropped image event:', event);
    }
  }

  onCropperCancel(): void {
    this.showCropper = false;
    this.fileForCropping = null;
    // Reset file input
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  removeProfilePicture(): void {
    this.selectedFile = null;
    this.profilePicturePreview = null;
    this.profilePictureError = '';
    // Reset file input
    const fileInput = document.getElementById('profilePicture') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  onSubmit(): void {
    if (this.registrationForm.valid && !this.isSubmitting && !this.profilePictureError) {
      this.isSubmitting = true;
      
      // Store profile picture preview (base64 data URL) in sessionStorage if available
      // Will upload only after successful OTP verification
      if (this.profilePicturePreview && this.selectedFile) {
        sessionStorage.setItem('profile_picture_data', this.profilePicturePreview);
        sessionStorage.setItem('profile_picture_filename', this.selectedFile.name);
        sessionStorage.setItem('profile_picture_type', this.selectedFile.type);
      }
      
      // Navigate to OTP page (profile picture will be uploaded after OTP verification)
      this.prepareAndNavigateToOtp();
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  prepareAndNavigateToOtp(): void {
    const email = this.registrationForm.value.email;
    if (!email) {
      this.isSubmitting = false;
      return;
    }

    // Store registration data in sessionStorage (without profilePictureUrl - will be added after upload)
    const registrationData = {
      fullName: this.registrationForm.value.fullName,
      email: email,
      password: this.registrationForm.value.password,
      dateOfBirth: this.registrationForm.value.dob || null,
      gender: this.registrationForm.value.gender || null
    };

    sessionStorage.setItem('registration_data', JSON.stringify(registrationData));
    sessionStorage.setItem('registration_email', email);

    // Send OTP and navigate to verification page
    this.apiService.sendOtp(email).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          // Store OTP sent flag and cooldown
          sessionStorage.setItem('otp_sent', 'true');
          if (response.resendAllowedAt) {
            sessionStorage.setItem('otp_resend_cooldown', response.resendAllowedAt);
          }
          
          // Navigate to OTP verification page
          this.router.navigate(['/membership/verify-otp'], {
            queryParams: { email: email }
          });
        } else {
          this.isSubmitting = false;
          this.errorMessage = response.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED;
          // Clear stored data on error
          sessionStorage.removeItem('registration_data');
          sessionStorage.removeItem('registration_email');
          sessionStorage.removeItem('profile_picture_data');
          sessionStorage.removeItem('profile_picture_filename');
          sessionStorage.removeItem('profile_picture_type');
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        this.errorMessage = error.error?.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED;
        // Clear stored data on error
        sessionStorage.removeItem('registration_data');
        sessionStorage.removeItem('registration_email');
        sessionStorage.removeItem('profile_picture_data');
        sessionStorage.removeItem('profile_picture_filename');
        sessionStorage.removeItem('profile_picture_type');
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }


  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return APP_MESSAGES.VALIDATION.REQUIRED(this.getFieldLabel(fieldName));
    }
    
    if (control?.hasError('email')) {
      return APP_MESSAGES.VALIDATION.INVALID_EMAIL;
    }
    
    if (control?.hasError('weakPassword')) {
      return APP_MESSAGES.VALIDATION.PASSWORD_WEAK;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return APP_MESSAGES.VALIDATION.MIN_LENGTH(this.getFieldLabel(fieldName), minLength);
    }
    
    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength']?.requiredLength;
      return APP_MESSAGES.VALIDATION.MAX_LENGTH(this.getFieldLabel(fieldName), maxLength);
    }
    
    if (this.registrationForm.hasError('passwordMismatch') && fieldName === 'confirmPassword') {
      return APP_MESSAGES.VALIDATION.PASSWORD_MISMATCH;
    }
    
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      fullName: APP_MESSAGES.FORM_LABELS.FULL_NAME,
      email: APP_MESSAGES.FORM_LABELS.EMAIL,
      password: APP_MESSAGES.FORM_LABELS.PASSWORD,
      confirmPassword: APP_MESSAGES.FORM_LABELS.CONFIRM_PASSWORD,
      dob: APP_MESSAGES.FORM_LABELS.DATE_OF_BIRTH,
      gender: APP_MESSAGES.FORM_LABELS.GENDER
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.registrationForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

}

