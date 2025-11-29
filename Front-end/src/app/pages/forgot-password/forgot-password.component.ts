import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { ToastService } from '../../services/toast.service';
import { APP_MESSAGES } from '../../constants/app.messages';
import { trigger, transition, animate, style } from '@angular/animations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('0.5s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ]),
    trigger('slideIn', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('0.4s ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ])
    ])
  ]
})
export class ForgotPasswordComponent implements OnInit, OnDestroy {
  step: number = 1; // 1: Enter email, 2: Enter OTP, 3: Enter new password
  email: string = '';
  otpCode: string = '';
  newPassword: string = '';
  confirmPassword: string = '';
  
  emailForm: FormGroup;
  otpForm: FormGroup;
  passwordForm: FormGroup;
  
  isSendingOtp = false;
  isVerifyingOtp = false;
  isResettingPassword = false;
  isResendingOtp = false;
  resendCooldown = 0;
  errorMessage = '';
  successMessage = '';
  showNewPassword = false;
  showConfirmPassword = false;
  
  private resendCooldownInterval: any = null;
  
  readonly APP_MESSAGES = APP_MESSAGES;

  constructor(
    private router: Router,
    private apiService: ApiService,
    private toastService: ToastService,
    private fb: FormBuilder
  ) {
    // Initialize forms
    this.emailForm = this.fb.group({
      email: ['', [Validators.required, Validators.email, Validators.maxLength(50)]]
    });
    
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.pattern(/^\d{6}$/)]]
    });
    
    this.passwordForm = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(100)]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {
    // Check if we're returning from a previous step
    const storedEmail = sessionStorage.getItem('forgot_password_email');
    const storedStep = sessionStorage.getItem('forgot_password_step');
    
    if (storedEmail && storedStep) {
      this.email = storedEmail;
      this.step = parseInt(storedStep, 10);
      
      // Restore form values
      this.emailForm.patchValue({ email: this.email });
    }
  }

  ngOnDestroy(): void {
    if (this.resendCooldownInterval) {
      clearInterval(this.resendCooldownInterval);
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  onEmailSubmit(): void {
    if (this.emailForm.invalid) {
      this.toastService.error(APP_MESSAGES.VALIDATION.REQUIRED(APP_MESSAGES.FORM_LABELS.EMAIL), 4000);
      return;
    }
    
    this.email = this.emailForm.get('email')?.value;
    this.errorMessage = '';
    this.isSendingOtp = true;
    
    // Store email in sessionStorage
    sessionStorage.setItem('forgot_password_email', this.email);
    sessionStorage.setItem('forgot_password_step', '1');
    
    this.apiService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.isSendingOtp = false;
        if (response.success) {
          this.toastService.success(APP_MESSAGES.SUCCESS.OTP_SENT, 3000);
          this.step = 2;
          sessionStorage.setItem('forgot_password_step', '2');
          this.startResendCooldown();
        } else {
          this.toastService.error(response.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED, 5000);
        }
      },
      error: (error) => {
        this.isSendingOtp = false;
        this.toastService.error(error.error?.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED, 5000);
      }
    });
  }

  onOtpSubmit(): void {
    if (this.otpForm.invalid) {
      this.toastService.error(APP_MESSAGES.ERROR.OTP_INVALID, 4000);
      return;
    }
    
    this.otpCode = this.otpForm.get('otp')?.value;
    this.errorMessage = '';
    this.isVerifyingOtp = true;
    
    this.apiService.verifyPasswordResetOtp(this.email, this.otpCode).subscribe({
      next: (response) => {
        this.isVerifyingOtp = false;
        if (response.success && response.verified) {
          this.toastService.success(APP_MESSAGES.SUCCESS.OTP_VERIFIED, 3000);
          this.step = 3;
          sessionStorage.setItem('forgot_password_step', '3');
        } else {
          this.toastService.error(response.message || APP_MESSAGES.ERROR.OTP_INVALID, 5000);
        }
      },
      error: (error) => {
        this.isVerifyingOtp = false;
        this.toastService.error(error.error?.message || APP_MESSAGES.ERROR.OTP_VERIFY_FAILED, 5000);
      }
    });
  }

  onPasswordSubmit(): void {
    if (this.passwordForm.invalid) {
      if (this.passwordForm.hasError('passwordMismatch')) {
        this.toastService.error(APP_MESSAGES.VALIDATION.PASSWORD_MISMATCH, 4000);
      } else {
        this.toastService.error(APP_MESSAGES.VALIDATION.REQUIRED(APP_MESSAGES.FORM_LABELS.NEW_PASSWORD), 4000);
      }
      return;
    }
    
    this.newPassword = this.passwordForm.get('newPassword')?.value;
    this.errorMessage = '';
    this.isResettingPassword = true;
    
    this.apiService.resetPassword(this.email, this.newPassword).subscribe({
      next: (response) => {
        this.isResettingPassword = false;
        if (response.success) {
          this.toastService.success(response.message || APP_MESSAGES.SUCCESS.PASSWORD_RESET_SUCCESS, 3000);
          // Clear sessionStorage
          sessionStorage.removeItem('forgot_password_email');
          sessionStorage.removeItem('forgot_password_step');
          // Redirect to login immediately (toast will persist after navigation)
          setTimeout(() => {
            this.router.navigate(['/admin/login']);
          }, 100);
        } else {
          this.toastService.error(response.message || APP_MESSAGES.ERROR.PASSWORD_RESET_FAILED_GENERIC, 5000);
        }
      },
      error: (error) => {
        this.isResettingPassword = false;
        const errorMsg = error.error?.message || APP_MESSAGES.ERROR.PASSWORD_RESET_FAILED_GENERIC;
        this.toastService.error(errorMsg, 5000);
      }
    });
  }

  resendOtp(): void {
    if (this.resendCooldown > 0) {
      return;
    }
    
    this.errorMessage = '';
    this.isResendingOtp = true;
    
    this.apiService.forgotPassword(this.email).subscribe({
      next: (response) => {
        this.isResendingOtp = false;
        if (response.success) {
          this.toastService.success(APP_MESSAGES.SUCCESS.OTP_RESENT, 3000);
          this.startResendCooldown();
        } else {
          this.toastService.error(response.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED, 5000);
        }
      },
      error: (error) => {
        this.isResendingOtp = false;
        this.toastService.error(error.error?.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED, 5000);
      }
    });
  }

  startResendCooldown(): void {
    this.resendCooldown = 60; // 60 seconds
    this.resendCooldownInterval = setInterval(() => {
      this.resendCooldown--;
      if (this.resendCooldown <= 0) {
        clearInterval(this.resendCooldownInterval);
        this.resendCooldownInterval = null;
      }
    }, 1000);
  }

  goBack(): void {
    if (this.step > 1) {
      this.step--;
      sessionStorage.setItem('forgot_password_step', this.step.toString());
      this.errorMessage = '';
      this.successMessage = '';
    } else {
      this.router.navigate(['/admin/login']);
    }
  }

  goToLogin(): void {
    // Clear sessionStorage
    sessionStorage.removeItem('forgot_password_email');
    sessionStorage.removeItem('forgot_password_step');
    this.router.navigate(['/admin/login']);
  }

  toggleNewPasswordVisibility(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}

