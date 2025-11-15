/**
 * Application-wide constants
 */

export const APP_CONSTANTS = {
  // Brand Information
  BRAND_NAME: 'UK Sports Club',
  APP_TITLE: 'UK Sports Club - Registration',

  // Club Contact Information
  CLUB_INFO: {
    email: 'contact@ukclub.com',
    phone: '+44 20 1234 1111',
    address: '123 Club Street, London, UK, SW1A 1AA',
    hours: 'Monday - Friday: 9:00 AM - 6:00 PM'
  },

  // File Upload Constraints
  FILE_UPLOAD: {
    MAX_SIZE: 2 * 1024 * 1024, // 2MB in bytes
    ALLOWED_TYPES: ['image/jpeg', 'image/jpg', 'image/png'],
    ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png']
  },

  // API Configuration
  API: {
    BASE_URL: 'http://localhost:8080/api'
  },

  // Image Assets
  IMAGES: {
    BACKGROUND: 'membershipPage.jpg',
    BACKGROUND_PATH: './assets/images/membershipPage.jpg',
    BACKGROUND_PATH_RELATIVE: '../../../assets/images/membershipPage.jpg'
  }
} as const;

