/**
 * Application-wide constants
 */

export const APP_CONSTANTS = {
  // Brand Information
  BRAND_NAME: 'Sports Club',
  APP_TITLE: 'Sports Club - Registration',

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
    BACKGROUND: 'appBackground.jpg',
    BACKGROUND_PATH: './assets/images/appBackground.jpg',
    BACKGROUND_PATH_RELATIVE: '../../../assets/images/appBackground.jpg'
  },

  // Default Values
  DEFAULTS: {
    ESTABLISHED_YEAR: 2020
  }
} as const;

