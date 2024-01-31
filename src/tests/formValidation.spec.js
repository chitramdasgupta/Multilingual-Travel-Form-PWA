import { describe, it, expect } from 'vitest'
import {
  isDateInFuture,
  validatePANCardNumber,
  validatePincode,
  validateField
} from '@/helpers/formValidation'

describe('isDateInFuture', () => {
  it('returns true for a future date', () => {
    expect(isDateInFuture('2050-01-01')).toBe(true)
  })

  it('returns false for a past date', () => {
    expect(isDateInFuture('2000-01-01')).toBe(false)
  })
})

describe('validatePANCardNumber', () => {
  it('returns true for a valid PAN number', () => {
    expect(validatePANCardNumber('ABCDE1234F')).toBe(true)
  })

  it('returns false for an invalid PAN number', () => {
    expect(validatePANCardNumber('AB12')).toBe(false)
  })
})

describe('validatePincode', () => {
  it('returns true for a valid pincode', () => {
    expect(validatePincode('123456')).toBe(true)
  })

  it('returns false for an invalid pincode', () => {
    expect(validatePincode('1234')).toBe(false)
  })
})

describe('validateField', () => {
  it('returns an error message for a required field with empty value', () => {
    const field = { is_required: 1, value: '', code: 'testField' }
    expect(validateField(field)).toContain('Please fill this field.')
  })

  it('validates a specific field correctly', () => {
    const futureDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1))
    const field = { is_required: 1, value: futureDate, code: 'date_of_birth' }
    expect(validateField(field)).toContain('Date of birth cannot be in the future.')
  })
})
