function isDateInFuture(date) {
  const selectedDate = new Date(date)
  const currentDate = new Date()
  return selectedDate > currentDate
}

function validatePANCardNumber(panNumber) {
  return panNumber.length === 10
}

function validatePincode(pincode) {
  const pincodeRegex = /^\d{6}$/
  return pincodeRegex.test(pincode)
}

function validateFileSize(file) {
  const maxFileSize = 5 * 1024 * 1024 // 5 MB
  return file.size <= maxFileSize
}

// Define a map of validation functions
const validationFunctions = {
  date_of_birth: (value) =>
    isDateInFuture(value) ? 'Date of birth cannot be in the future.' : null,
  pan_card_number: (value) =>
    !validatePANCardNumber(value) ? 'Invalid PAN (must be 10 characters).' : null,
  pincode: (value) => (!validatePincode(value) ? 'Invalid pincode (must be 6 digits).' : null),
  passport_issue_date: (value) =>
    isDateInFuture(value) ? 'Passport issue date cannot be in the future.' : null,
  passport_expiry_date: (value) =>
    !isDateInFuture(value) ? 'Expired passport is not accepted.' : null,
  file: (value) =>
    value && !validateFileSize(value) ? 'File size must be less than or equal to 5 MB.' : null
  // Add more validation functions as needed
}

export function validateField(field) {
  const errors = []

  // Required field validation
  if (field.is_required === 1 && !field.value) {
    errors.push('Please fill this field.')
  }

  // Specific field validation
  const validate = validationFunctions[field.code]
  if (validate) {
    const error = validate(field.value)
    if (error) errors.push(error)
  }

  return errors
}
