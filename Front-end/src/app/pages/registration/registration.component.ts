import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { trigger, state, style, transition, animate, query, stagger } from '@angular/animations';
import { ApiService } from '../../services/api.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { APP_MESSAGES } from '../../constants/app.messages';

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
  showSuccessMessage = false;
  errorMessage = '';
  particles: Array<{x: number, y: number, delay: number}> = [];
  selectedFile: File | null = null;
  profilePicturePreview: string | null = null;
  profilePictureError: string = '';
  
  // Expose constants for template
  readonly APP_MESSAGES = APP_MESSAGES;
  
  genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.generateParticles();
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
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
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

    // Store the file
    this.selectedFile = file;

    // Create preview
    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      this.profilePicturePreview = e.target?.result as string;
    };
    reader.readAsDataURL(file);
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
      
      // Create FormData for multipart/form-data upload
      const formData = new FormData();
      formData.append('fullName', this.registrationForm.value.fullName);
      formData.append('email', this.registrationForm.value.email);
      formData.append('password', this.registrationForm.value.password);
      formData.append('dob', this.registrationForm.value.dob);
      formData.append('gender', this.registrationForm.value.gender);
      
      // Append profile picture if selected
      if (this.selectedFile) {
        formData.append('profilePicture', this.selectedFile, this.selectedFile.name);
      }

      // Placeholder for API call
      this.apiService.registerMembership(formData).subscribe({
        next: (response) => {
          console.log('Membership registration successful:', response);
          this.isSubmitting = false;
          this.showSuccessMessage = true;
          this.registrationForm.reset();
          this.removeProfilePicture();
          // Hide success message after 5 seconds
          setTimeout(() => {
            this.showSuccessMessage = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Membership registration failed:', error);
          this.isSubmitting = false;
          this.errorMessage = APP_MESSAGES.ERROR.REGISTRATION_FAILED;
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      });
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.registrationForm.controls).forEach(key => {
        this.registrationForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.registrationForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return APP_MESSAGES.VALIDATION.REQUIRED(this.getFieldLabel(fieldName));
    }
    
    if (control?.hasError('email')) {
      return APP_MESSAGES.VALIDATION.INVALID_EMAIL;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return APP_MESSAGES.VALIDATION.MIN_LENGTH(this.getFieldLabel(fieldName), minLength);
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

