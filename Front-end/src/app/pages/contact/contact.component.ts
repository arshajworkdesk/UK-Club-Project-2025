import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { APP_CONSTANTS } from '../../constants/app.constants';
import { APP_MESSAGES } from '../../constants/app.messages';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = false;

  // Expose constants for template
  readonly APP_CONSTANTS = APP_CONSTANTS;
  readonly APP_MESSAGES = APP_MESSAGES;
  
  clubInfo: any = {
    email: '',
    phone: '',
    address: '',
    hours: '',
    clubName: APP_CONSTANTS.BRAND_NAME
  };
  isLoadingClubInfo = true;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadClubDetails();
  }
  
  loadClubDetails(): void {
    this.isLoadingClubInfo = true;
    this.apiService.getClubDetails().subscribe({
      next: (details) => {
        this.clubInfo = {
          email: details.email || '',
          phone: details.phone || '',
          address: details.address || '',
          hours: details.businessHours || '',
          clubName: details.clubName || APP_CONSTANTS.BRAND_NAME
        };
        this.isLoadingClubInfo = false;
      },
      error: (error) => {
        console.error('Error loading club details:', error);
        // Keep empty values if API fails - no dummy data
        this.clubInfo = {
          email: '',
          phone: '',
          address: '',
          hours: '',
          clubName: APP_CONSTANTS.BRAND_NAME
        };
        this.isLoadingClubInfo = false;
      }
    });
  }

  initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern(/^\d{10}$/), Validators.maxLength(10)]],
      subject: ['', [Validators.required]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  get name() {
    return this.contactForm.get('name');
  }

  get email() {
    return this.contactForm.get('email');
  }

  get phone() {
    return this.contactForm.get('phone');
  }

  get subject() {
    return this.contactForm.get('subject');
  }

  get message() {
    return this.contactForm.get('message');
  }

  onSubmit(): void {
    if (this.contactForm.valid && !this.isSubmitting) {
      this.isSubmitting = true;
      this.submitSuccess = false;
      this.submitError = false;

      const formData = this.contactForm.value;

      this.apiService.sendContactMessage(formData).subscribe({
        next: (response) => {
          this.isSubmitting = false;
          this.submitSuccess = true;
          this.contactForm.reset();
          setTimeout(() => {
            this.submitSuccess = false;
          }, 5000);
        },
        error: (error) => {
          console.error('Error sending message:', error);
          this.isSubmitting = false;
          this.submitError = true;
          setTimeout(() => {
            this.submitError = false;
          }, 5000);
        }
      });
    } else {
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
    }
  }

  getErrorMessage(fieldName: string): string {
    const control = this.contactForm.get(fieldName);
    
    if (control?.hasError('required')) {
      return APP_MESSAGES.VALIDATION.REQUIRED(this.getFieldLabel(fieldName));
    }
    
    if (control?.hasError('email')) {
      return APP_MESSAGES.VALIDATION.INVALID_EMAIL;
    }
    
    if (control?.hasError('pattern') && fieldName === 'phone') {
      return APP_MESSAGES.VALIDATION.INVALID_PHONE;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return APP_MESSAGES.VALIDATION.MIN_LENGTH(this.getFieldLabel(fieldName), minLength);
    }
    
    if (control?.hasError('maxlength') && fieldName === 'phone') {
      return APP_MESSAGES.VALIDATION.INVALID_PHONE;
    }
    
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: APP_MESSAGES.FORM_LABELS.YOUR_NAME,
      email: APP_MESSAGES.FORM_LABELS.EMAIL,
      subject: APP_MESSAGES.FORM_LABELS.SUBJECT,
      message: APP_MESSAGES.FORM_LABELS.MESSAGE
    };
    return labels[fieldName] || fieldName;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.contactForm.get(fieldName);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  getContactSubtitle(): string {
    return APP_MESSAGES.UI.CONTACT_SUBTITLE(this.clubInfo.clubName || APP_CONSTANTS.BRAND_NAME);
  }
}

