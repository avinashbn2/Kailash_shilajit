/**
 * Validation utility functions for Indian postal codes, email, and phone numbers
 */

/**
 * Validates Indian postal code (PIN code)
 * Indian PIN codes are 6-digit numbers
 * Format: XXXXX (where X is a digit from 0-9)
 * First digit: 1-9, Second digit: 0-9, Third digit: 0-9, Fourth digit: 0-9, Fifth digit: 1-9, Sixth digit: 0-9
 * Valid range: First 3 digits represent region, last 3 represent delivery office
 */
export const validateIndianPostalCode = (pinCode: string): boolean => {
  // Basic format check: 6 digits
  if (!/^\d{6}$/.test(pinCode)) {
    return false;
  }

  // More specific validation for Indian PIN codes
  // First digit should be between 1-9 (0 is not used as first digit in India)
  const firstDigit = parseInt(pinCode.charAt(0), 10);
  if (firstDigit < 1 || firstDigit > 9) {
    return false;
  }

  // Valid PIN code ranges for India
  const pinCodeNum = parseInt(pinCode, 10);
  return pinCodeNum >= 100000 && pinCodeNum <= 999999;
};

/**
 * Validates email address using RFC 5322 standard with common patterns
 */
export const validateEmail = (email: string): boolean => {
  // Comprehensive email regex pattern
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

/**
 * Validates Indian phone number
 * Indian phone numbers are 10 digits
 * Valid formats:
 * - 10-digit mobile numbers starting with 6, 7, 8, or 9
 * - Can optionally include country code (+91 or 91)
 * - Can have optional separators like spaces, hyphens, or parentheses
 */
export const validateIndianPhoneNumber = (phone: string): boolean => {
  // Remove all non-digit characters to get just the numbers
  const cleanPhone = phone.replace(/\D/g, '');

  // Check if it's a 10-digit Indian mobile number (6, 7, 8, or 9 as first digit)
  if (cleanPhone.length === 10) {
    const firstDigit = parseInt(cleanPhone.charAt(0), 10);
    return [6, 7, 8, 9].includes(firstDigit);
  }

  // Check if it's a 12-digit number with country code (+91 or 91)
  if (cleanPhone.length === 12) {
    // Check if it starts with 91 (India's country code)
    if (cleanPhone.startsWith('91')) {
      const mobileNumber = cleanPhone.substring(2); // Remove country code
      const firstDigit = parseInt(mobileNumber.charAt(0), 10);
      return [6, 7, 8, 9].includes(firstDigit);
    }
  }

  return false;
};

/**
 * Validates Indian phone number and returns a cleaned version (10 digits)
 */
export const formatIndianPhoneNumber = (phone: string): string | null => {
  const cleanPhone = phone.replace(/\D/g, '');
  
  if (cleanPhone.length === 10) {
    // Already in correct format
    return cleanPhone;
  } else if (cleanPhone.length === 12 && cleanPhone.startsWith('91')) {
    // Remove country code
    return cleanPhone.substring(2);
  }
  
  return null; // Invalid format
};

/**
 * Validates and formats Indian postal code
 */
export const formatIndianPostalCode = (pinCode: string): string | null => {
  // Remove any non-digit characters
  const cleanPinCode = pinCode.replace(/\D/g, '');
  
  if (cleanPinCode.length === 6 && validateIndianPostalCode(cleanPinCode)) {
    return cleanPinCode;
  }
  
  return null; // Invalid format
};

/**
 * Comprehensive validation function that returns an object with validation results
 */
export interface ValidationResults {
  email: boolean;
  phone: boolean;
  postalCode: boolean;
  errors: {
    email?: string;
    phone?: string;
    postalCode?: string;
  };
}

export const validateAll = (
  email: string,
  phone: string,
  postalCode: string
): ValidationResults => {
  const results: ValidationResults = {
    email: false,
    phone: false,
    postalCode: false,
    errors: {}
  };

  // Validate email
  if (!email.trim()) {
    results.errors.email = 'Email is required';
  } else if (!validateEmail(email)) {
    results.errors.email = 'Invalid email format';
  } else {
    results.email = true;
  }

  // Validate phone
  if (!phone.trim()) {
    results.errors.phone = 'Phone number is required';
  } else if (!validateIndianPhoneNumber(phone)) {
    results.errors.phone = 'Invalid Indian phone number (10 digits starting with 6-9)';
  } else {
    results.phone = true;
  }

  // Validate postal code
  if (!postalCode.trim()) {
    results.errors.postalCode = 'PIN code is required';
  } else if (!validateIndianPostalCode(postalCode)) {
    results.errors.postalCode = 'Invalid PIN code (6 digits)';
  } else {
    results.postalCode = true;
  }

  return results;
};