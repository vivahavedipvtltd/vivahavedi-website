/**
 * Zod Validation Schemas
 * Centralized validation schemas for all forms
 */

import { z } from 'zod';
import {
  VALIDATION_PATTERNS,
  LENGTH_CONSTRAINTS,
  NUMERIC_CONSTRAINTS,
  VALIDATION_MESSAGES,
  GENDER_OPTIONS,
  INTEREST_STATUS,
  REPORT_TYPES,
  CREATED_FOR_OPTIONS,
} from './constants';

// ============================================================================
// AUTHENTICATION SCHEMAS
// ============================================================================

export const loginSchema = z.object({
  login: z.string().min(1, VALIDATION_MESSAGES.REQUIRED),
  password: z.string()
    .min(LENGTH_CONSTRAINTS.PASSWORD_MIN, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    .max(LENGTH_CONSTRAINTS.PASSWORD_MAX, VALIDATION_MESSAGES.PASSWORD_TOO_LONG),
});

export const mobileSchema = z.object({
  mobile: z.string()
    .regex(VALIDATION_PATTERNS.MOBILE, VALIDATION_MESSAGES.MOBILE_INVALID),
});

export const otpSchema = z.object({
  otp: z.string()
    .regex(VALIDATION_PATTERNS.OTP, VALIDATION_MESSAGES.OTP_INVALID),
});

export const loginWithOtpSchema = mobileSchema.merge(otpSchema);

export const sendOtpSchema = mobileSchema;

export const verifyOtpSchema = mobileSchema.merge(otpSchema);

export const resetPasswordSchema = z.object({
  mobile: z.string()
    .regex(VALIDATION_PATTERNS.MOBILE, VALIDATION_MESSAGES.MOBILE_INVALID),
  otp: z.string()
    .regex(VALIDATION_PATTERNS.OTP, VALIDATION_MESSAGES.OTP_INVALID),
  password: z.string()
    .min(LENGTH_CONSTRAINTS.PASSWORD_MIN, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    .max(LENGTH_CONSTRAINTS.PASSWORD_MAX, VALIDATION_MESSAGES.PASSWORD_TOO_LONG),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  old_password: z.string()
    .min(LENGTH_CONSTRAINTS.PASSWORD_MIN, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    .max(LENGTH_CONSTRAINTS.PASSWORD_MAX, VALIDATION_MESSAGES.PASSWORD_TOO_LONG),
  new_password: z.string()
    .min(LENGTH_CONSTRAINTS.PASSWORD_MIN, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    .max(LENGTH_CONSTRAINTS.PASSWORD_MAX, VALIDATION_MESSAGES.PASSWORD_TOO_LONG),
}).refine((data) => data.new_password !== data.old_password, {
  message: VALIDATION_MESSAGES.PASSWORD_SAME_AS_OLD,
  path: ['new_password'],
});

// ============================================================================
// REGISTRATION SCHEMAS
// ============================================================================

export const registrationStepOneSchema = z.object({
  mobile: z.string()
    .regex(VALIDATION_PATTERNS.MOBILE, VALIDATION_MESSAGES.MOBILE_INVALID),
  email: z.string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .max(LENGTH_CONSTRAINTS.EMAIL_MAX),
  password: z.string()
    .min(LENGTH_CONSTRAINTS.PASSWORD_MIN, VALIDATION_MESSAGES.PASSWORD_TOO_SHORT)
    .max(LENGTH_CONSTRAINTS.PASSWORD_MAX, VALIDATION_MESSAGES.PASSWORD_TOO_LONG),
  confirmPassword: z.string(),
  name: z.string()
    .min(1, VALIDATION_MESSAGES.NAME_REQUIRED)
    .max(LENGTH_CONSTRAINTS.NAME_MAX, VALIDATION_MESSAGES.NAME_TOO_LONG),
  last_name: z.string()
    .min(1, VALIDATION_MESSAGES.NAME_REQUIRED)
    .max(LENGTH_CONSTRAINTS.NAME_MAX, VALIDATION_MESSAGES.NAME_TOO_LONG),
}).refine((data) => data.password === data.confirmPassword, {
  message: VALIDATION_MESSAGES.PASSWORD_MISMATCH,
  path: ['confirmPassword'],
});

export const registrationStepTwoSchema = z.object({
  gender: z.enum(GENDER_OPTIONS, {
    message: VALIDATION_MESSAGES.INVALID_SELECTION,
  }),
  birth_day: z.number()
    .min(NUMERIC_CONSTRAINTS.BIRTH_DAY_MIN, VALIDATION_MESSAGES.BIRTH_DAY_INVALID)
    .max(NUMERIC_CONSTRAINTS.BIRTH_DAY_MAX, VALIDATION_MESSAGES.BIRTH_DAY_INVALID),
  birth_month: z.number()
    .min(NUMERIC_CONSTRAINTS.BIRTH_MONTH_MIN, VALIDATION_MESSAGES.BIRTH_MONTH_INVALID)
    .max(NUMERIC_CONSTRAINTS.BIRTH_MONTH_MAX, VALIDATION_MESSAGES.BIRTH_MONTH_INVALID),
  birth_year: z.number()
    .min(NUMERIC_CONSTRAINTS.BIRTH_YEAR_MIN)
    .max(NUMERIC_CONSTRAINTS.BIRTH_YEAR_MAX, VALIDATION_MESSAGES.AGE_REQUIREMENT),
  religion: z.number().min(1, VALIDATION_MESSAGES.INVALID_SELECTION),
  caste: z.number().min(1, VALIDATION_MESSAGES.INVALID_SELECTION),
});

export const registrationStepThreeSchema = z.object({
  country: z.number().min(1, VALIDATION_MESSAGES.INVALID_SELECTION),
  state: z.number().min(1, VALIDATION_MESSAGES.INVALID_SELECTION),
  district: z.number().min(1, VALIDATION_MESSAGES.INVALID_SELECTION),
  location: z.number().min(1, VALIDATION_MESSAGES.INVALID_SELECTION),
  created_for: z.enum(CREATED_FOR_OPTIONS, {
    message: VALIDATION_MESSAGES.INVALID_SELECTION,
  }),
});

// ============================================================================
// PROFILE UPDATE SCHEMAS
// ============================================================================

export const updateBasicProfileSchema = z.object({
  profile_created: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
  marital_status: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  children: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  height: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  weight: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  body_type: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  complexion: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  physical_status: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  mother_tongue: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  personal_values: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
  eating_habits: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  drinking_habits: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
  smoking_habits: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
});

export const updateEducationProfileSchema = z.object({
  highest_education: z.number().optional(),
  employed_in: z.number().optional(),
  occupation: z.number().optional(),
  annual_income: z.number().optional(),
  college_name: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
  company_name: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
  designation: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
  work_location: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
});

export const updateFamilyProfileSchema = z.object({
  family_type: z.number().optional(),
  family_status: z.number().optional(),
  family_value: z.number().optional(),
  father_occupation: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
  mother_occupation: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
  no_of_brothers: z.number().min(0).max(NUMERIC_CONSTRAINTS.SIBLINGS_MAX).optional(),
  no_of_sisters: z.number().min(0).max(NUMERIC_CONSTRAINTS.SIBLINGS_MAX).optional(),
  brothers_married: z.number().min(0).max(NUMERIC_CONSTRAINTS.SIBLINGS_MAX).optional(),
  sisters_married: z.number().min(0).max(NUMERIC_CONSTRAINTS.SIBLINGS_MAX).optional(),
  family_income: z.string().max(LENGTH_CONSTRAINTS.TEXT_SHORT_MAX).optional(),
});

export const updateAstrologicalProfileSchema = z.object({
  star: z.number().optional(),
  raasi: z.number().optional(),
  dhosam: z.number().optional(),
  birth_place: z.string().max(LENGTH_CONSTRAINTS.TEXT_MEDIUM_MAX).optional(),
  birth_time_hour: z.number()
    .min(NUMERIC_CONSTRAINTS.HOUR_MIN)
    .max(NUMERIC_CONSTRAINTS.HOUR_MAX)
    .optional(),
  birth_time_minute: z.number()
    .min(NUMERIC_CONSTRAINTS.MINUTE_MIN)
    .max(NUMERIC_CONSTRAINTS.MINUTE_MAX)
    .optional(),
  birth_time_second: z.number()
    .min(NUMERIC_CONSTRAINTS.SECOND_MIN)
    .max(NUMERIC_CONSTRAINTS.SECOND_MAX)
    .optional(),
});

export const updateAboutProfileSchema = z.object({
  about_myself: z.string().max(LENGTH_CONSTRAINTS.ABOUT_MAX).optional(),
});

// ============================================================================
// COMMUNICATION SCHEMAS
// ============================================================================

export const sendMessageSchema = z.object({
  match_id: z.number().min(1, VALIDATION_MESSAGES.REQUIRED),
  message: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .max(LENGTH_CONSTRAINTS.MESSAGE_MAX, VALIDATION_MESSAGES.TEXT_TOO_LONG),
});

export const respondToInterestSchema = z.object({
  match_id: z.number().min(1, VALIDATION_MESSAGES.REQUIRED),
  status: z.enum(INTEREST_STATUS, {
    message: VALIDATION_MESSAGES.INVALID_SELECTION,
  }),
});

export const reportProfileSchema = z.object({
  match_id: z.number().min(1, VALIDATION_MESSAGES.REQUIRED),
  report_type: z.enum(REPORT_TYPES, {
    message: VALIDATION_MESSAGES.INVALID_SELECTION,
  }),
  reason: z.string().max(LENGTH_CONSTRAINTS.REASON_MAX).optional(),
});

// ============================================================================
// CONTACT FORM SCHEMA
// ============================================================================

export const contactUsSchema = z.object({
  name: z.string()
    .min(1, VALIDATION_MESSAGES.NAME_REQUIRED)
    .max(LENGTH_CONSTRAINTS.NAME_MAX, VALIDATION_MESSAGES.NAME_TOO_LONG),
  email: z.string()
    .email(VALIDATION_MESSAGES.EMAIL_INVALID)
    .max(LENGTH_CONSTRAINTS.EMAIL_MAX),
  mobile: z.string()
    .regex(VALIDATION_PATTERNS.MOBILE, VALIDATION_MESSAGES.MOBILE_INVALID)
    .optional()
    .or(z.literal('')),
  message: z.string()
    .min(1, VALIDATION_MESSAGES.REQUIRED)
    .max(LENGTH_CONSTRAINTS.MESSAGE_MAX, VALIDATION_MESSAGES.TEXT_TOO_LONG),
});

// ============================================================================
// TYPE EXPORTS
// ============================================================================

export type LoginFormData = z.infer<typeof loginSchema>;
export type LoginWithOtpFormData = z.infer<typeof loginWithOtpSchema>;
export type SendOtpFormData = z.infer<typeof sendOtpSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type RegistrationStepOneFormData = z.infer<typeof registrationStepOneSchema>;
export type RegistrationStepTwoFormData = z.infer<typeof registrationStepTwoSchema>;
export type RegistrationStepThreeFormData = z.infer<typeof registrationStepThreeSchema>;
export type UpdateBasicProfileFormData = z.infer<typeof updateBasicProfileSchema>;
export type UpdateEducationProfileFormData = z.infer<typeof updateEducationProfileSchema>;
export type UpdateFamilyProfileFormData = z.infer<typeof updateFamilyProfileSchema>;
export type UpdateAstrologicalProfileFormData = z.infer<typeof updateAstrologicalProfileSchema>;
export type UpdateAboutProfileFormData = z.infer<typeof updateAboutProfileSchema>;
export type SendMessageFormData = z.infer<typeof sendMessageSchema>;
export type RespondToInterestFormData = z.infer<typeof respondToInterestSchema>;
export type ReportProfileFormData = z.infer<typeof reportProfileSchema>;
export type ContactUsFormData = z.infer<typeof contactUsSchema>;
