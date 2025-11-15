/**
 * Application-wide user-facing messages
 * Organized by category for easy maintenance and future localization
 */

export const APP_MESSAGES = {
  // Success Messages
  SUCCESS: {
    REGISTRATION_SUBMITTED: 'Your membership request has been submitted. Awaiting admin approval.',
    MEMBERSHIP_REQUEST_SUBMITTED: 'Membership request submitted successfully',
    CONTACT_MESSAGE_SENT: "Message sent successfully! We'll get back to you soon.",
    LOGIN_SUCCESS: 'Login successful',
    MEMBER_APPROVED: 'Member approved successfully',
    MEMBER_REJECTED: 'Member rejected',
    ADMIN_ASSIGNED: 'Admin role assigned successfully'
  },

  // Error Messages
  ERROR: {
    REGISTRATION_FAILED: 'Failed to submit membership request. Please try again.',
    CONTACT_MESSAGE_FAILED: 'Failed to send message. Please try again later.',
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    LOGIN_ERROR: 'An error occurred during login. Please try again.',
    GENERIC_ERROR: 'An error occurred. Please try again.',
    LOADING_MEMBERS_ERROR: 'Error loading members'
  },

  // Confirmation Messages
  CONFIRMATION: {
    APPROVE_MEMBER: 'Are you sure you want to approve this member?',
    REJECT_MEMBER: 'Are you sure you want to reject this member?',
    ASSIGN_ADMIN: 'Are you sure you want to assign admin role to this member?',
    APPROVE_TITLE: 'Approve Member',
    REJECT_TITLE: 'Reject Member',
    ASSIGN_ADMIN_TITLE: 'Assign Admin Role',
    BUTTON_APPROVE: 'Approve',
    BUTTON_REJECT: 'Reject',
    BUTTON_ASSIGN: 'Assign',
    BUTTON_CANCEL: 'Cancel',
    BUTTON_CONFIRM: 'Confirm'
  },

  // File Upload Error Messages
  FILE_UPLOAD: {
    INVALID_TYPE: 'Please select a JPG or PNG image file',
    FILE_TOO_LARGE: 'File size must be less than 2MB',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.'
  },

  // Validation Messages
  VALIDATION: {
    REQUIRED: (fieldName: string) => `${fieldName} is required`,
    INVALID_EMAIL: 'Please enter a valid email address',
    MIN_LENGTH: (fieldName: string, minLength: number) => 
      fieldName === 'Password' 
        ? `Password must be at least ${minLength} characters`
        : `${fieldName} must be at least ${minLength} characters`,
    PASSWORD_MISMATCH: 'Passwords do not match'
  },

  // Form Field Labels
  FORM_LABELS: {
    FULL_NAME: 'Full Name',
    EMAIL: 'Email',
    PASSWORD: 'Password',
    CONFIRM_PASSWORD: 'Confirm Password',
    DATE_OF_BIRTH: 'Date of Birth',
    GENDER: 'Gender',
    PROFILE_PICTURE: 'Profile Picture',
    NAME: 'Name',
    YOUR_NAME: 'Your Name',
    YOUR_EMAIL: 'Your Email',
    SUBJECT: 'Subject',
    MESSAGE: 'Message'
  },

  // UI Messages
  UI: {
    // Buttons
    SUBMIT_MEMBERSHIP: 'Submit Membership Application',
    SUBMITTING: 'Submitting...',
    SEND_MESSAGE: 'Send Message',
    SENDING: 'Sending...',
    LOGIN: 'Login',
    LOGGING_IN: 'Logging in...',
    APPLY_FOR_MEMBERSHIP: 'Apply for Membership',
    LOGOUT: 'Logout',
    
    // Placeholders and Hints
    PROFILE_PICTURE_OPTIONAL: 'Profile Picture (Optional)',
    PROFILE_PICTURE_HINT: 'JPG or PNG, max 2MB',
    SEARCH_MEMBERS: 'Search members by name or email...',
    SELECT_GENDER: 'Select Gender',
    PLACEHOLDER_ENTER_FULL_NAME: 'Enter your full name',
    PLACEHOLDER_ENTER_EMAIL: 'Enter your email address',
    PLACEHOLDER_ENTER_ADMIN_EMAIL: 'Enter your admin email',
    PLACEHOLDER_ENTER_PASSWORD: 'Enter your password',
    PLACEHOLDER_SUBJECT: 'What is this regarding?',
    PLACEHOLDER_MESSAGE: 'Tell us how we can help you...',
    
    // Page Titles and Subtitles
    MEMBERS_TITLE: 'Our Members',
    MEMBERS_SUBTITLE: 'Meet the amazing members of UK Sports Club',
    CONTACT_TITLE: 'Contact Us',
    CONTACT_SUBTITLE: "Get in touch with UK Sports Club - We'd love to hear from you!",
    CONTACT_FORM_TITLE: 'Send us a Message',
    ADMIN_LOGIN_TITLE: 'Admin Login',
    ADMIN_LOGIN_SUBTITLE: 'Sign in to access the admin dashboard',
    ADMIN_DASHBOARD_TITLE: 'Admin Dashboard',
    ADMIN_DASHBOARD_SUBTITLE: 'Manage members and admin assignments',
    REGISTRATION_SUBTITLE: 'Apply for Membership',
    
    // Loading States
    LOADING_MEMBERS: 'Loading members...',
    NO_MEMBERS_FOUND: 'No members found matching your search.',
    SHOWING_MEMBERS: (showing: number, total: number) => 
      `Showing ${showing} of ${total} members`,    
    // Tabs
    PENDING_MEMBERS: 'Pending Members',
    APPROVED_MEMBERS: 'Approved Members',
    ADMINS: 'Admins',
    
    // Navigation Menu
    NAV_HOME: 'Home',
    NAV_MEMBERSHIP: 'Membership',
    NAV_MEMBERS: 'Members',
    NAV_CONTACT_US: 'Contact Us',
    NAV_ADMIN_LOGIN: 'Admin Login',
    NAV_DASHBOARD: 'Dashboard'
  }
} as const;

