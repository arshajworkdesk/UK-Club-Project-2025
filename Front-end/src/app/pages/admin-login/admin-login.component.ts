import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { fadeIn } from '../../animations/route.animations';
import { APP_MESSAGES } from '../../constants/app.messages';

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.scss'],
  animations: [fadeIn]
})
export class AdminLoginComponent implements OnInit {
  loginForm!: FormGroup;
  isSubmitting = false;
  errorMessage = '';

  // Expose constants for template
  readonly APP_MESSAGES = APP_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // TESTING MODE: Allow access to login page even if already logged in
    // TODO: Restore redirect in production
    // if (this.authService.isAdmin()) {
    //   this.router.navigate(['/admin/dashboard']);
    // }

    this.initializeForm();
  }

  initializeForm(): void {
    // TESTING MODE: Reduced validation for easier testing
    // TODO: Restore full validation in production
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]] // Removed minLength for testing
    });
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.errorMessage = '';

      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.success && response.admin) {
            // Redirect to admin dashboard
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.errorMessage = response.message || APP_MESSAGES.ERROR.LOGIN_FAILED;
            this.isSubmitting = false;
          }
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = APP_MESSAGES.ERROR.LOGIN_ERROR;
          this.isSubmitting = false;
        }
      });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        this.loginForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    
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
    
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      email: APP_MESSAGES.FORM_LABELS.EMAIL,
      password: APP_MESSAGES.FORM_LABELS.PASSWORD
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}

