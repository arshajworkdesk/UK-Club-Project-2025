import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Strong password validator
 * Validates that password meets the following requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter (A-Z)
 * - At least one lowercase letter (a-z)
 * - At least one number (0-9)
 */
export function strongPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) {
      // Don't validate empty values (let required validator handle that)
      return null;
    }

    const password = control.value as string;
    const errors: ValidationErrors = {};

    // Check minimum length
    if (password.length < 8) {
      errors['passwordMinLength'] = true;
    }

    // Check for at least one uppercase letter
    if (!/[A-Z]/.test(password)) {
      errors['passwordUppercase'] = true;
    }

    // Check for at least one lowercase letter
    if (!/[a-z]/.test(password)) {
      errors['passwordLowercase'] = true;
    }

    // Check for at least one number
    if (!/[0-9]/.test(password)) {
      errors['passwordNumber'] = true;
    }

    // Return null if no errors, otherwise return the errors object
    return Object.keys(errors).length > 0 ? { weakPassword: errors } : null;
  };
}

