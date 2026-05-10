export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin',
} as const

export const JOB_SOURCES = {
  GOOGLE: 'google',
  LINKEDIN: 'linkedin',
  INDEED: 'indeed',
  WELLFOUND: 'wellfound',
} as const

export const PREPARATION_TYPES = {
  QUESTIONS: 'questions',
  TIPS: 'tips',
  COMPANY: 'company',
  RESUME_TAILORING: 'resume_tailoring',
} as const

export const AUTH_PROVIDERS = {
  EMAIL: 'email',
  GOOGLE: 'google',
  LINKEDIN: 'linkedin',
  GITHUB: 'github',
} as const

export const ERROR_MESSAGES = {
  USER_NOT_FOUND: 'User not found',
  INVALID_CREDENTIALS: 'Invalid credentials',
  EMAIL_ALREADY_EXISTS: 'Email already registered',
  TOKEN_EXPIRED: 'Token expired',
  TOKEN_INVALID: 'Invalid token',
  UNAUTHORIZED: 'Please log in to continue',
  FORBIDDEN: 'You do not have permission to perform this action',
  VALIDATION_ERROR: 'Validation error',
  INTERNAL_ERROR: 'Internal server error',
} as const

export const SUCCESS_MESSAGES = {
  REGISTER_SUCCESS: 'Registration successful',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  DATA_DELETED: 'Data deleted successfully',
  JOB_SAVED: 'Job saved successfully',
  JOB_APPLIED: 'Job marked as applied',
} as const

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const

export const FILE_LIMITS = {
  MAX_RESUME_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_RESUME_TYPES: ['application/pdf', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
} as const