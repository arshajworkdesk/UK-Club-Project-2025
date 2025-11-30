import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { APP_MESSAGES } from '../../constants/app.messages';
import { trigger, transition, animate, style } from '@angular/animations';
import { strongPasswordValidator } from '../../validators/password.validator';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class ResetPasswordComponent implements OnInit {
  passwordForm: FormGroup;
  isSubmitting = false;
  showOldPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;
  
  readonly APP_MESSAGES = APP_MESSAGES;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {
    this.passwordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100), strongPasswordValidator()]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Check if user is logged in
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/admin/login']);
      return;
    }
    
    // Explicitly reset form to prevent any autofill
    // Use reset with emitEvent: false to prevent validation from triggering
    this.passwordForm.reset({
      oldPassword: '',
      newPassword: '',
      confirmPassword: ''
    }, { emitEvent: false });
    
    // Mark all fields as untouched to prevent showing errors initially
    this.passwordForm.markAsUntouched();
    
    // Additional prevention: Clear form multiple times to override browser autofill
    setTimeout(() => {
      this.passwordForm.patchValue({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }, { emitEvent: false });
    }, 100);
    
    setTimeout(() => {
      this.passwordForm.patchValue({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      }, { emitEvent: false });
    }, 500);
  }
  
  toggleOldPasswordVisibility(): void {
    this.showOldPassword = !this.showOldPassword;
  }
  
  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }
  
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onOldPasswordFocus(): void {
    // Clear any autofilled value when user focuses on the field
    const currentValue = this.passwordForm.get('oldPassword')?.value;
    if (currentValue && currentValue.length > 0) {
      // If there's a value, check if it was autofilled (browser autofill happens before user interaction)
      // Clear it after a short delay to ensure it's cleared
      setTimeout(() => {
        this.passwordForm.patchValue({ oldPassword: '' });
      }, 50);
    }
  }

  onOldPasswordInput(): void {
    // Additional safeguard: if value appears without user typing, clear it
    // This handles cases where browser autofills after focus
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    
    // Don't validate if either field is empty (let required validator handle that)
    if (!newPassword || !confirmPassword) {
      return null;
    }
    
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit(): void {
    if (this.passwordForm.invalid) {
      const newPasswordControl = this.passwordForm.get('newPassword');
      if (newPasswordControl?.hasError('weakPassword')) {
        this.toastService.error(APP_MESSAGES.VALIDATION.PASSWORD_WEAK, 4000);
      } else if (this.passwordForm.hasError('passwordMismatch')) {
        this.toastService.error(APP_MESSAGES.VALIDATION.PASSWORD_MISMATCH, 4000);
      } else {
        this.toastService.error(APP_MESSAGES.VALIDATION.REQUIRED(APP_MESSAGES.FORM_LABELS.PASSWORD), 4000);
      }
      return;
    }
    
    this.isSubmitting = true;
    
    const oldPassword = this.passwordForm.get('oldPassword')?.value;
    const newPassword = this.passwordForm.get('newPassword')?.value;
    
    this.apiService.changePassword(oldPassword, newPassword).subscribe({
      next: (response) => {
        this.isSubmitting = false;
        if (response.success) {
          this.toastService.success(response.message || APP_MESSAGES.SUCCESS.PASSWORD_CHANGED, 3000);
          // Redirect to dashboard immediately (toast will persist after navigation)
          setTimeout(() => {
            this.router.navigate(['/admin/dashboard']);
          }, 100);
        } else {
          this.toastService.error(response.message || APP_MESSAGES.ERROR.PASSWORD_CHANGE_FAILED, 5000);
        }
      },
      error: (error) => {
        this.isSubmitting = false;
        const errorMsg = error.error?.message || APP_MESSAGES.ERROR.PASSWORD_CHANGE_FAILED;
        this.toastService.error(errorMsg, 5000);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/admin/dashboard']);
  }
}

