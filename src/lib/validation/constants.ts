/**
 * Validation Constants
 * Centralized validation rules and regex patterns
 */

// Regex Patterns
export const VALIDATION_PATTERNS = {
  // Mobile number: Exactly 10 digits
  MOBILE: /^[0-9]{10}$/,

  // OTP: Exactly 6 digits
  OTP: /^[0-9]{6}$/,

  // Email: RFC 5322 compliant email pattern
  EMAIL: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,

  // Name: Letters, spaces, and common name characters
  NAME: /^[a-zA-Z\s'-]+$/,

  // Only digits
  DIGITS_ONLY: /^[0-9]+$/,

  // Alphanumeric
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,
} as const;

// Length Constraints
export const LENGTH_CONSTRAINTS = {
  // Password constraints
  PASSWORD_MIN: 6,
  PASSWORD_MAX: 20,

  // Mobile number
  MOBILE_LENGTH: 10,

  // OTP
  OTP_LENGTH: 6,

  // Name constraints
  NAME_MIN: 1,
  NAME_MAX: 255,

  // Email
  EMAIL_MAX: 255,

  // Message/Text constraints
  MESSAGE_MAX: 1000,
  ABOUT_MAX: 1000,
  REASON_MAX: 500,

  // Other text fields
  TEXT_SHORT_MAX: 100,
  TEXT_MEDIUM_MAX: 255,
  TEXT_LONG_MAX: 500,
} as const;

// Numeric Constraints
export const NUMERIC_CONSTRAINTS = {
  // Date of birth
  BIRTH_DAY_MIN: 1,
  BIRTH_DAY_MAX: 31,
  BIRTH_MONTH_MIN: 1,
  BIRTH_MONTH_MAX: 12,
  BIRTH_YEAR_MIN: 1950,
  BIRTH_YEAR_MAX: new Date().getFullYear() - 18, // Must be 18+

  // Time constraints (24-hour format)
  HOUR_MIN: 0,
  HOUR_MAX: 23,
  MINUTE_MIN: 0,
  MINUTE_MAX: 59,
  SECOND_MIN: 0,
  SECOND_MAX: 59,

  // Family members
  SIBLINGS_MAX: 20,
} as const;

// File Upload Constraints
export const FILE_CONSTRAINTS = {
  // Image file types
  ACCEPTED_IMAGE_TYPES: ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/bmp', 'image/webp'],

  // Max file size (in bytes)
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB

  // Display string for accepted types
  ACCEPTED_IMAGE_TYPES_DISPLAY: 'JPG, PNG, GIF, BMP, or WEBP',
} as const;

// Validation Messages
export const VALIDATION_MESSAGES = {
  // Required fields
  REQUIRED: 'This field is required',

  // Mobile
  MOBILE_REQUIRED: 'Mobile number is required',
  MOBILE_INVALID: 'Mobile number must be exactly 10 digits',
  MOBILE_DIGITS_ONLY: 'Mobile number must contain only digits',

  // OTP
  OTP_REQUIRED: 'OTP is required',
  OTP_INVALID: 'OTP must be exactly 6 digits',

  // Email
  EMAIL_REQUIRED: 'Email is required',
  EMAIL_INVALID: 'Please enter a valid email address',

  // Password
  PASSWORD_REQUIRED: 'Password is required',
  PASSWORD_TOO_SHORT: `Password must be at least ${LENGTH_CONSTRAINTS.PASSWORD_MIN} characters`,
  PASSWORD_TOO_LONG: `Password must not exceed ${LENGTH_CONSTRAINTS.PASSWORD_MAX} characters`,
  PASSWORD_MISMATCH: 'Passwords do not match',
  PASSWORD_SAME_AS_OLD: 'New password must be different from old password',

  // Name
  NAME_REQUIRED: 'Name is required',
  NAME_TOO_LONG: `Name must not exceed ${LENGTH_CONSTRAINTS.NAME_MAX} characters`,
  NAME_INVALID: 'Name can only contain letters, spaces, hyphens, and apostrophes',

  // Date of birth
  AGE_REQUIREMENT: 'You must be at least 18 years old',
  BIRTH_DAY_INVALID: 'Please select a valid day',
  BIRTH_MONTH_INVALID: 'Please select a valid month',
  BIRTH_YEAR_INVALID: 'Please select a valid year',

  // File upload
  FILE_REQUIRED: 'Please select a file to upload',
  FILE_TOO_LARGE: 'File size must not exceed 10MB',
  FILE_TYPE_INVALID: `File must be ${FILE_CONSTRAINTS.ACCEPTED_IMAGE_TYPES_DISPLAY}`,

  // Generic
  INVALID_SELECTION: 'Please select a valid option',
  TEXT_TOO_LONG: 'Text is too long',
} as const;

// Gender options
export const GENDER_OPTIONS = ['male', 'female'] as const;
export type Gender = typeof GENDER_OPTIONS[number];

// Interest response statuses
export const INTEREST_STATUS = ['accepted', 'rejected'] as const;
export type InterestStatus = typeof INTEREST_STATUS[number];

// Report types
export const REPORT_TYPES = [
  'fake_profile',
  'inappropriate_content',
  'harassment',
  'spam',
  'other'
] as const;
export type ReportType = typeof REPORT_TYPES[number];

// Photo types
export const PHOTO_TYPES = ['1', '2', '3', '4', '5', 'horoscope', 'idproof'] as const;
export type PhotoType = typeof PHOTO_TYPES[number];

// Created for options
export const CREATED_FOR_OPTIONS = [
  'self',
  'brother',
  'sister',
  'son',
  'daughter',
  'relative',
  'friend'
] as const;
export type CreatedFor = typeof CREATED_FOR_OPTIONS[number];
