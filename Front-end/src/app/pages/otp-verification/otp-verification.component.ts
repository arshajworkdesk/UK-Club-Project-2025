import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { APP_MESSAGES } from '../../constants/app.messages';
import { trigger, transition, animate, style } from '@angular/animations';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-verification.component.html',
  styleUrls: ['./otp-verification.component.scss'],
  animations: [
    trigger('fadeInUp', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(30px)' }),
        animate('0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', style({ opacity: 1, transform: 'translateY(0)' }))
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
export class OtpVerificationComponent implements OnInit, OnDestroy {
  email: string = '';
  otpCode: string = '';
  isVerifyingOtp = false;
  isResendingOtp = false;
  isCompletingRegistration = false;
  resendCooldown = 0;
  verificationAttempts = 0;
  errorMessage = '';
  showSuccessMessage = false;
  private resendCooldownInterval: any = null;
  private registrationData: any = null;

  readonly APP_MESSAGES = APP_MESSAGES;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    // Get email from query params or sessionStorage
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || sessionStorage.getItem('registration_email') || '';
    });

    // Get registration data from sessionStorage
    const storedData = sessionStorage.getItem('registration_data');
    if (storedData) {
      try {
        this.registrationData = JSON.parse(storedData);
      } catch (e) {
        console.error('Failed to parse registration data:', e);
      }
    }

    // If no email or registration data, redirect to registration
    if (!this.email || !this.registrationData) {
      this.router.navigate(['/membership']);
      return;
    }

    // Check if OTP was already sent (should be sent from registration page)
    // If not, send it now
    this.checkAndSendOtp();
  }

  ngOnDestroy(): void {
    if (this.resendCooldownInterval) {
      clearInterval(this.resendCooldownInterval);
    }
  }

  checkAndSendOtp(): void {
    // OTP should already be sent from registration page, but we can verify
    // by checking if there's a recent OTP in sessionStorage
    const otpSent = sessionStorage.getItem('otp_sent');
    if (!otpSent) {
      // Send OTP if not already sent
      this.sendOtp();
    } else {
      // Get resend cooldown from sessionStorage
      const cooldownEnd = sessionStorage.getItem('otp_resend_cooldown');
      if (cooldownEnd) {
        this.startResendCooldown(cooldownEnd);
      }
    }
  }

  sendOtp(): void {
    if (!this.email) {
      return;
    }

    this.apiService.sendOtp(this.email).subscribe({
      next: (response) => {
        if (response.success) {
          this.errorMessage = '';
          sessionStorage.setItem('otp_sent', 'true');
          
          if (response.resendAllowedAt) {
            sessionStorage.setItem('otp_resend_cooldown', response.resendAllowedAt);
            this.startResendCooldown(response.resendAllowedAt);
          }
        } else {
          this.errorMessage = response.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED;
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      },
      error: (error) => {
        this.errorMessage = error.error?.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  verifyOtp(): void {
    if (!this.otpCode || this.otpCode.length !== 6) {
      this.errorMessage = 'Please enter a valid 6-digit OTP code';
      setTimeout(() => {
        this.errorMessage = '';
      }, 5000);
      return;
    }

    this.isVerifyingOtp = true;
    
    this.apiService.verifyOtp(this.email, this.otpCode).subscribe({
      next: (response) => {
        this.isVerifyingOtp = false;
        if (response.success && response.verified) {
          this.errorMessage = '';
          this.verificationAttempts = 0;
          
          // Clear cooldown timer
          if (this.resendCooldownInterval) {
            clearInterval(this.resendCooldownInterval);
            this.resendCooldownInterval = null;
          }
          
          // Complete registration
          this.completeRegistration();
        } else {
          this.errorMessage = response.message || APP_MESSAGES.ERROR.OTP_INVALID;
          this.verificationAttempts = response.attemptsRemaining !== undefined 
            ? 5 - (response.attemptsRemaining || 0) 
            : this.verificationAttempts + 1;
          
          if (response.attemptsRemaining === 0) {
            this.errorMessage = APP_MESSAGES.ERROR.OTP_MAX_ATTEMPTS;
          }
          
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      },
      error: (error) => {
        this.isVerifyingOtp = false;
        this.errorMessage = error.error?.message || APP_MESSAGES.ERROR.OTP_VERIFY_FAILED;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  resendOtp(): void {
    if (this.resendCooldown > 0 || this.isResendingOtp) {
      return;
    }

    this.isResendingOtp = true;
    
    this.apiService.resendOtp(this.email).subscribe({
      next: (response) => {
        this.isResendingOtp = false;
        if (response.success) {
          this.errorMessage = '';
          this.otpCode = '';
          sessionStorage.setItem('otp_sent', 'true');
          
          if (response.resendAllowedAt) {
            sessionStorage.setItem('otp_resend_cooldown', response.resendAllowedAt);
            this.startResendCooldown(response.resendAllowedAt);
          }
        } else {
          this.errorMessage = response.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED;
          if (response.resendAllowedAt) {
            sessionStorage.setItem('otp_resend_cooldown', response.resendAllowedAt);
            this.startResendCooldown(response.resendAllowedAt);
          }
          setTimeout(() => {
            this.errorMessage = '';
          }, 5000);
        }
      },
      error: (error) => {
        this.isResendingOtp = false;
        this.errorMessage = error.error?.message || APP_MESSAGES.ERROR.OTP_SEND_FAILED;
        if (error.error?.resendAllowedAt) {
          sessionStorage.setItem('otp_resend_cooldown', error.error.resendAllowedAt);
          this.startResendCooldown(error.error.resendAllowedAt);
        }
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  startResendCooldown(resendAllowedAt: string): void {
    if (this.resendCooldownInterval) {
      clearInterval(this.resendCooldownInterval);
    }

    const updateCooldown = () => {
      const now = new Date().getTime();
      const allowedTime = new Date(resendAllowedAt).getTime();
      const remaining = Math.max(0, Math.ceil((allowedTime - now) / 1000));
      
      this.resendCooldown = remaining;
      
      if (remaining <= 0) {
        if (this.resendCooldownInterval) {
          clearInterval(this.resendCooldownInterval);
          this.resendCooldownInterval = null;
        }
      }
    };

    updateCooldown();
    this.resendCooldownInterval = setInterval(updateCooldown, 1000);
  }

  completeRegistration(): void {
    if (!this.registrationData) {
        this.errorMessage = 'Registration data not found. Please try again.';
        this.router.navigate(['/membership']);
        return;
    }

    this.isCompletingRegistration = true;

    // First, upload profile picture if available (only after OTP verification)
    const profilePictureData = sessionStorage.getItem('profile_picture_data');
    if (profilePictureData) {
      // Convert base64 data URL to File
      const file = this.dataURLtoFile(
        profilePictureData,
        sessionStorage.getItem('profile_picture_filename') || 'profile-picture.jpg',
        sessionStorage.getItem('profile_picture_type') || 'image/jpeg'
      );

      // Upload profile picture
      this.apiService.uploadProfilePicture(file).subscribe({
        next: (uploadResponse) => {
          if (uploadResponse.success && uploadResponse.filename) {
            // Profile picture uploaded, now complete registration
            this.finalizeRegistration(uploadResponse.filename);
          } else if (uploadResponse.success && uploadResponse.url) {
            // Extract filename from URL
            const urlParts = uploadResponse.url.split('/');
            const filename = urlParts[urlParts.length - 1];
            this.finalizeRegistration(filename);
          } else {
            // Upload failed, proceed without profile picture (don't block registration)
            console.warn('Profile picture upload failed, proceeding without profile picture');
            this.finalizeRegistration(null);
          }
        },
        error: (error) => {
          // Upload error, proceed without profile picture (don't block registration)
          console.warn('Profile picture upload error, proceeding without profile picture:', error);
          this.finalizeRegistration(null);
        }
      });
    } else {
      // No profile picture, proceed directly with registration
      this.finalizeRegistration(null);
    }
  }

  private finalizeRegistration(profilePictureUrl: string | null): void {
    // Prepare registration data
    const registrationData: any = {
      fullName: this.registrationData.fullName,
      email: this.registrationData.email,
      password: this.registrationData.password,
      dateOfBirth: this.registrationData.dateOfBirth || null,
      gender: this.registrationData.gender || null,
      profilePictureUrl: profilePictureUrl
    };

    this.apiService.registerMembership(registrationData).subscribe({
      next: (response) => {
        this.isCompletingRegistration = false;
        this.showSuccessMessage = true;

        // Clear sessionStorage
        sessionStorage.removeItem('registration_data');
        sessionStorage.removeItem('registration_email');
        sessionStorage.removeItem('otp_sent');
        sessionStorage.removeItem('otp_resend_cooldown');
        sessionStorage.removeItem('profile_picture_data');
        sessionStorage.removeItem('profile_picture_filename');
        sessionStorage.removeItem('profile_picture_type');

        // Redirect to home after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error) => {
        this.isCompletingRegistration = false;
        this.errorMessage = error.error?.message || APP_MESSAGES.ERROR.REGISTRATION_FAILED;
        setTimeout(() => {
          this.errorMessage = '';
        }, 5000);
      }
    });
  }

  /**
   * Convert base64 data URL to File object
   */
  private dataURLtoFile(dataURL: string, filename: string, mimeType: string): File {
    const arr = dataURL.split(',');
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mimeType });
  }

  onOtpInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.otpCode = input.value.replace(/[^0-9]/g, '').slice(0, 6);
    input.value = this.otpCode;
  }

  getResendCooldownMessage(seconds: number): string {
    return APP_MESSAGES.UI.OTP.RESEND_COOLDOWN(seconds);
  }

  getAttemptsRemainingMessage(attempts: number): string {
    return APP_MESSAGES.UI.OTP.ATTEMPTS_REMAINING(attempts);
  }

  goBackToRegistration(): void {
    this.router.navigate(['/membership']);
  }
}

