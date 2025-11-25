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
    ADMIN_ASSIGNED: 'Admin role assigned successfully',
    MANAGER_ASSIGNED: 'Manager role assigned successfully',
    MEMBER_REMOVED: 'Member removed successfully',
    MANAGER_DEMOTED: 'Manager demoted to member successfully',
    MANAGER_PROMOTED: 'Manager promoted to admin successfully',
    CLUB_DETAILS_SAVED: 'Club details saved successfully'
  },

  // Error Messages
  ERROR: {
    REGISTRATION_FAILED: 'Failed to submit membership request. Please try again.',
    CONTACT_MESSAGE_FAILED: 'Failed to send message. Please try again later.',
    LOGIN_FAILED: 'Login failed. Please check your credentials.',
    LOGIN_ERROR: 'An error occurred during login. Please try again.',
    GENERIC_ERROR: 'An error occurred. Please try again.',
    LOADING_MEMBERS_ERROR: 'Error loading members',
    PERMISSION_DENIED_APPROVE_REJECT: 'Only admin or manager can do this operation',
    PERMISSION_DENIED: 'You do not have permission to perform this action',
    ADMIN_CANNOT_BE_REMOVED: 'Admin members cannot be removed',
    CAN_ONLY_REMOVE_MEMBERS: 'You can only remove regular members',
    PERMISSION_DENIED_REMOVE: 'You do not have permission to remove members',
    PERMISSION_DENIED_REMOVE_MEMBER: 'You do not have permission to remove this member',
    CLUB_DETAILS_SAVE_FAILED: 'Failed to save club details. Please try again.'
  },

  // Confirmation Messages
  CONFIRMATION: {
    APPROVE_MEMBER: 'Are you sure you want to approve this member?',
    REJECT_MEMBER: 'Are you sure you want to reject this member?',
    ASSIGN_ADMIN: 'Are you sure you want to assign admin role to this member?',
    ASSIGN_MANAGER: 'Are you sure you want to assign manager role to this member?',
    REMOVE_MEMBER: 'Are you sure you want to remove this member? They will not be able to login but can re-register.',
    DEMOTE_MANAGER: 'Are you sure you want to demote this manager to a regular member?',
    PROMOTE_MANAGER: 'Are you sure you want to promote this manager to admin?',
    APPROVE_TITLE: 'Approve Member',
    REJECT_TITLE: 'Reject Member',
    ASSIGN_ADMIN_TITLE: 'Assign Admin Role',
    ASSIGN_MANAGER_TITLE: 'Assign Manager Role',
    REMOVE_MEMBER_TITLE: 'Remove Member',
    DEMOTE_MANAGER_TITLE: 'Demote Manager',
    PROMOTE_MANAGER_TITLE: 'Promote Manager to Admin',
    BUTTON_APPROVE: 'Approve',
    BUTTON_REJECT: 'Reject',
    BUTTON_ASSIGN: 'Assign',
    BUTTON_REMOVE: 'Remove',
    BUTTON_DEMOTE: 'Demote to Member',
    BUTTON_PROMOTE: 'Promote to Admin',
    BUTTON_CANCEL: 'Cancel',
    BUTTON_CONFIRM: 'Confirm'
  },

  // File Upload Error Messages
  FILE_UPLOAD: {
    INVALID_TYPE: 'Please select a JPG or PNG image file',
    FILE_TOO_LARGE: 'File size must be less than 2MB',
    FILE_TOO_LARGE_LOGO: 'Logo file size must be less than 2MB',
    UPLOAD_FAILED: 'Failed to upload file. Please try again.',
    CLUB_IMAGE_UPLOAD_FAILED: 'Failed to upload club image. Please try again.',
    CLUB_LOGO_UPLOAD_FAILED: 'Failed to upload club logo. Please try again.'
  },

  // Validation Messages
  VALIDATION: {
    REQUIRED: (fieldName: string) => `${fieldName} is required`,
    INVALID_EMAIL: 'Please enter a valid email address',
    INVALID_PHONE: 'Phone number must be exactly 10 digits',
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
    YOUR_NAME: 'Your Name / Organization',
    YOUR_EMAIL: 'Your Email',
    PHONE: 'Phone',
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
    PLACEHOLDER_ENTER_FULL_NAME: 'Enter your name or organization name',
    PLACEHOLDER_ENTER_EMAIL: 'Enter your email address',
    PLACEHOLDER_ENTER_PHONE: 'Enter 10-digit phone number',
    PLACEHOLDER_ENTER_ADMIN_EMAIL: 'Enter your email address',
    PLACEHOLDER_ENTER_PASSWORD: 'Enter your password',
    PLACEHOLDER_SUBJECT: 'What is this regarding?',
    PLACEHOLDER_MESSAGE: 'Tell us how we can help you...',
    
    // Page Titles and Subtitles
    MEMBERS_TITLE: 'Our Members',
    MEMBERS_SUBTITLE: (clubName: string) => `Meet the amazing members of ${clubName}`,
    MEMBERS_SORT: {
      LABEL: 'Sort by:',
      NAME: 'Name',
      EMAIL: 'Email'
    },
    CONTACT_TITLE: 'Contact Us',
    CONTACT_SUBTITLE: (clubName: string) => `Get in touch with ${clubName} - We'd love to hear from you!`,
    CONTACT_FORM_TITLE: 'Send us a Message',
    CONTACT_INFO: {
      EMAIL: 'Email',
      PHONE: 'Phone',
      ADDRESS: 'Address',
      BUSINESS_HOURS: 'Business Hours'
    },
    ADMIN_LOGIN_TITLE: 'Member Login',
    ADMIN_LOGIN_SUBTITLE: 'Sign in to access your dashboard',
    ADMIN_DASHBOARD_TITLE: 'Dashboard',
    ADMIN_DASHBOARD_SUBTITLE: 'View and manage members',
    MEMBER_DASHBOARD_SUBTITLE: 'View members',
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
    ADMINS_AND_MANAGERS: 'Admins & Managers',
    CLUB_INFO: 'Club Info',
    AUDIT_LOG: 'Audit Log',
    
    // Navigation Menu
    NAV_HOME: 'Home',
    NAV_MEMBERSHIP: 'Membership',
    NAV_MEMBERS: 'Members',
    NAV_CONTACT_US: 'Contact Us',
    NAV_CONTACT_MESSAGES: 'Contact Messages',
    NAV_ADMIN_LOGIN: 'Login',
    NAV_DASHBOARD: 'Dashboard',
    
    // Contact Messages
    CONTACT_MESSAGES: {
      LOADING: 'Loading contact messages...',
      NO_MESSAGES: 'No contact messages found.',
      TOTAL_MESSAGES: 'Total messages:',
      SELECTED: 'selected',
      DELETE_SELECTED: 'Delete Selected',
      DELETE_SELECTED_COUNT: (count: number) => `Delete Selected (${count})`,
      SELECT_TO_DELETE: 'Please select messages using checkboxes to delete them',
      SELECT_AT_LEAST_ONE: 'Please select at least one message to delete',
      DELETE_CONFIRM_TITLE: 'Delete Contact Messages',
      DELETE_CONFIRM_MESSAGE: (count: number) => `Are you sure you want to delete ${count} selected message(s)?`,
      DELETE_SUCCESS: (count: number) => `Successfully deleted ${count} message(s)`,
      DELETE_FAILED: 'Failed to delete contact messages',
      TABLE_HEADERS: {
        TIMESTAMP: 'Timestamp',
        NAME: 'Name',
        EMAIL: 'Email',
        PHONE: 'Phone',
        SUBJECT: 'Subject',
        MESSAGE: 'Message',
        SELECT: 'Select'
      }
    },
    
    // Audit Logs
    AUDIT_LOGS: {
      LOADING: 'Loading audit logs...',
      NO_LOGS: 'No audit logs found',
      SHOWING_LOGS: (start: number, end: number, total: number) => 
        `Showing ${start} - ${end} of ${total} logs`,
      FILTERS: {
        ACTION_TYPE: 'Action Type:',
        START_DATE: 'Start Date:',
        END_DATE: 'End Date:',
        ALL_ACTIONS: 'All Actions',
        APPLY: 'Apply Filters',
        CLEAR: 'Clear'
      },
      TABLE_HEADERS: {
        TIMESTAMP: 'Timestamp',
        USER: 'User',
        ACTION: 'Action',
        DESCRIPTION: 'Description'
      },
      PAGINATION: {
        FIRST: 'First',
        PREVIOUS: 'Previous',
        NEXT: 'Next',
        LAST: 'Last',
        PAGE: (current: number, total: number) => `Page ${current} of ${total}`
      }
    },
    
    // Pagination
    PAGINATION: {
      PREVIOUS: 'Previous',
      NEXT: 'Next',
      PAGE_INFO: (current: number, total: number, elements: number) => 
        `Page ${current} of ${total} (${elements} total)`
    },
    
    // Dashboard
    WELCOME_USER: 'Welcome,',
    USER_FALLBACK: 'User',
    VIEW_MEMBERS: 'View Members',
    
    // Club Details Form
    CLUB_DETAILS_FORM: {
      EDIT: 'Edit',
      LOADING: 'Loading...',
      CHANGE_LOGO: 'Change Logo',
      UPLOAD_LOGO: 'Upload Logo',
      CHANGE_IMAGE: 'Change Image',
      UPLOAD_IMAGE: 'Upload Image',
      NO_LOGO_SELECTED: 'No logo selected',
      NO_IMAGE_SELECTED: 'No image selected',
      REMOVE_LOGO: 'Remove logo',
      REMOVE_IMAGE: 'Remove image',
      LOGO_HINT: 'Logo will be used as browser favicon (JPG or PNG, max 2MB)',
      IMAGE_HINT: 'JPG or PNG format only (max 2MB)',
      CLEAR: 'Clear',
      CANCEL: 'Cancel',
      SAVE_CHANGES: 'Save Changes',
      SAVING: 'Saving...',
      FIX_VALIDATION_ERRORS: 'Please fix validation errors before saving',
      FIX_FOLLOWING_ERRORS: 'Please fix the following validation errors:'
    },
    
    // Home Page
    HOME: {
      WELCOME_TO: 'Welcome to',
      HERO_SUBTITLE: 'Your premier destination for exclusive networking, events, and community engagement',
      ABOUT: 'About',
      WHY_JOIN: 'Why Join',
      LOADING_CLUB_INFO: 'Loading club information...',
      CLUB_IMAGE: 'Club Image',
      READY_TO_JOIN: 'Ready to Join Our Community?',
      CTA_TEXT: 'Apply for membership and become part of something special',
      POWERED_BY: 'Powered by UK Technologies'
    },
    
    // Registration
    REGISTRATION: {
      TITLE: 'Join UK Sports Club',
      REMOVE_IMAGE: '×',
      GENDER_OPTIONS: {
        MALE: 'Male',
        FEMALE: 'Female',
        OTHER: 'Other',
        PREFER_NOT_TO_SAY: 'Prefer not to say'
      }
    },
    
    // Home Features
    HOME_FEATURES: [
      {
        icon: '👥',
        title: 'Growing Community',
        description: 'Connect with like-minded individuals and build meaningful relationships'
      },
      {
        icon: '🎯',
        title: 'Exclusive Events',
        description: 'Access to premium events and networking opportunities'
      },
      {
        icon: '🌟',
        title: 'Premium Benefits',
        description: 'Enjoy exclusive perks and member-only privileges'
      }
    ],
    
    // Gender Format
    GENDER_FORMAT: {
      MALE: 'Male',
      FEMALE: 'Female',
      OTHER: 'Other',
      PREFER_NOT_TO_SAY: 'Prefer not to say',
      NOT_AVAILABLE: 'N/A'
    },
    
    // Image Alt Text
    IMAGE_ALT: {
      PROFILE_PICTURE: (name: string) => `${name} profile picture`,
      PROFILE_PREVIEW: 'Profile preview',
      CLUB_LOGO: 'Club Logo',
      CLUB_IMAGE: 'Club Image',
      CLUB_LOGO_NAV: (clubName: string) => `${clubName} logo`
    },
    
    // Club Details Section Titles
    CLUB_DETAILS_SECTIONS: {
      CLUB_LOGO: 'Club Logo',
      CLUB_IMAGE: 'Club Image'
    }
  },
  
  // Club Details Default Description
  CLUB_DETAILS: {
    DEFAULT_DESCRIPTION: (clubName: string) => 
      `${clubName} is a prestigious community organization dedicated to bringing together ` +
      `like-minded individuals from across the United Kingdom. Since our establishment, ` +
      `we have been committed to fostering connections, organizing exclusive events, and ` +
      `providing our members with unparalleled opportunities for growth and networking. ` +
      `Our mission is to create a vibrant ecosystem where members can thrive, share ` +
      `experiences, and build lasting relationships. Whether you're looking to expand your ` +
      `professional network, participate in exciting events, or simply be part of an ` +
      `exclusive community, ${clubName} is the place for you.`
  },
  
  // Form Validation Messages
  FORM_VALIDATION: {
    CLUB_NAME_REQUIRED: 'Club name is required (max 255 characters)',
    YEAR_REQUIRED: (maxYear?: number) => `Valid year is required (1800-${maxYear || new Date().getFullYear()})`,
    YEAR_FUTURE: 'Established year cannot be in the future',
    DESCRIPTION_REQUIRED: 'Description is required (minimum 50 characters)',
    EMAIL_REQUIRED: 'Valid email is required',
    PHONE_REQUIRED: 'Phone number must be exactly 10 digits',
    ADDRESS_REQUIRED: 'Address is required',
    BUSINESS_HOURS_REQUIRED: 'Business hours is required (max 255 characters)'
  },
  
  // Form Placeholders
  PLACEHOLDERS: {
    ENTER_CLUB_NAME: 'Enter club name',
    ESTABLISHED_YEAR: 'e.g., 2020',
    CLUB_DESCRIPTION: 'Enter club description (minimum 50 characters)',
    CONTACT_EMAIL: 'contact@ukclub.com',
    CONTACT_PHONE: 'Enter 10-digit phone number',
    ENTER_ADDRESS: 'Enter full address',
    BUSINESS_HOURS: 'Monday - Friday: 9:00 AM - 6:00 PM'
  }
} as const;

