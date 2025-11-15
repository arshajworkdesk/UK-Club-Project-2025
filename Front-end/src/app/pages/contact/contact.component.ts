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
  
  clubInfo = APP_CONSTANTS.CLUB_INFO;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
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
          console.log('Message sent:', response);
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
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return APP_MESSAGES.VALIDATION.MIN_LENGTH(this.getFieldLabel(fieldName), minLength);
    }
    
    return '';
  }

  getFieldLabel(fieldName: string): string {
    const labels: { [key: string]: string } = {
      name: APP_MESSAGES.FORM_LABELS.NAME,
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
}

