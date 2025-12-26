const signupForm = document.getElementById('registerForm')
const tabButtons = document.querySelectorAll('.switch-btn')
const userNameField = document.getElementById('username')
const fullNameField = document.getElementById('fullName')
const emailField = document.getElementById('email')
const passwordField = document.getElementById('password')
const submitButton = document.getElementById('registerBtn')

const userNameError = document.getElementById('usernameError')
const fullNameError = document.getElementById('fullNameError')
const emailError = document.getElementById('emailError')

const strengthRule = document.getElementById('ruleStrength')
const strengthText = document.getElementById('strengthLabel')
const noNameEmailRule = document.getElementById('ruleNoNameEmail')
const minLengthRule = document.getElementById('ruleMinLength')
const numberSymbolRule = document.getElementById('ruleNumberSymbol')

const confirmationMsg = document.getElementById('successMessage')

// Utility functions
function updateFieldStatus(field, isCorrect, errorDisplay, errorMsg = '') {
  if (isCorrect) {
    field.classList.remove('invalid')
    field.classList.add('valid')
    if (errorDisplay) errorDisplay.textContent = ''
  } else {
    field.classList.remove('valid')
    field.classList.add('invalid')
    if (errorDisplay) errorDisplay.textContent = errorMsg
  }
}

function updateRuleStatus(ruleElement, isCorrect) {
  ruleElement.classList.remove('valid', 'invalid')
  ruleElement.classList.add(isCorrect ? 'valid' : 'invalid')
}

// Validate username
function checkUserName() {
  const inputValue = userNameField.value.trim()
  let isValid = true
  let errorText = ''

  if (inputValue.length < 3 || inputValue.length > 15) {
    isValid = false
    errorText = 'Username must be between 3 and 15 characters'
  } else if (!/^[a-zA-Z0-9]+$/.test(inputValue)) {
    isValid = false
    errorText = 'Username can only contain letters and numbers'
  }

  updateFieldStatus(userNameField, isValid, userNameError, errorText)
  return isValid
}

// Validate full name
function checkFullName() {
  const inputValue = fullNameField.value.trim()
  let isValid = true
  let errorText = ''

  if (!inputValue) {
    isValid = false
    errorText = 'Please enter your full name'
  } else if (!/^[A-Za-z\s]+$/.test(inputValue)) {
    isValid = false
    errorText = 'Full name must contain only letters and spaces'
  } else {
    const nameParts = inputValue.split(/\s+/).filter(Boolean)
    if (nameParts.length < 2) {
      isValid = false
      errorText = 'Please enter your full name'
    }
  }

  updateFieldStatus(fullNameField, isValid, fullNameError, errorText)
  return isValid
}

// Validate email
function checkEmail() {
  const inputValue = emailField.value.trim()
  let isValid = true
  let errorText = ''

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

  if (!emailPattern.test(inputValue)) {
    isValid = false
    errorText = 'Please enter a valid email address'
  }

  updateFieldStatus(emailField, isValid, emailError, errorText)
  return isValid
}

// Check if password contains name or email
function hasNameOrEmailInPassword(pwd, name, email) {
  const lowerPwd = pwd.toLowerCase()

  if (name) {
    const nameParts = name
      .toLowerCase()
      .split(/\s+/)
      .filter((part) => part.length > 1)
    for (const part of nameParts) {
      if (lowerPwd.includes(part)) return true
    }
  }

  if (email) {
    const lowerEmail = email.toLowerCase()
    const [localPart] = lowerEmail.split('@')
    const emailParts = [localPart, ...lowerEmail.split(/[.@_+-]/)].filter((part) => part.length > 1)
    for (const part of emailParts) {
      if (lowerPwd.includes(part)) return true
    }
  }

  return false
}

// Validate password and strength
function checkPassword() {
  const pwd = passwordField.value
  const name = fullNameField.value.trim()
  const email = emailField.value.trim()

  if (pwd.length === 0) {
    minLengthRule.classList.remove('valid', 'invalid')
    numberSymbolRule.classList.remove('valid', 'invalid')
    noNameEmailRule.classList.remove('valid', 'invalid')
    strengthRule.classList.remove('valid', 'invalid')
    strengthText.textContent = 'Weak'
    passwordField.classList.remove('valid', 'invalid')
    return false
  }

  const lengthOk = pwd.length >= 8
  const hasDigit = /\d/.test(pwd)
  const hasSpecial = /[!@#$%^&*()\-_=+[{\]}\\|;:'",<.>/?`~]/.test(pwd)
  const digitOrSpecialOk = hasDigit || hasSpecial
  const nameEmailInPwd = hasNameOrEmailInPassword(pwd, name, email)
  const noNameEmailOk = !nameEmailInPwd

  let rulesPassed = 0
  if (lengthOk) rulesPassed++
  if (digitOrSpecialOk) rulesPassed++
  if (noNameEmailOk) rulesPassed++

  let strength = 'Weak'
  if (rulesPassed === 3 && pwd.length >= 10) {
    strength = 'Strong'
  } else if (rulesPassed >= 2) {
    strength = 'Medium'
  }

  strengthText.textContent = strength

  updateRuleStatus(minLengthRule, lengthOk)
  updateRuleStatus(numberSymbolRule, digitOrSpecialOk)
  updateRuleStatus(noNameEmailRule, noNameEmailOk)

  const allRulesOk = lengthOk && digitOrSpecialOk && noNameEmailOk
  updateRuleStatus(strengthRule, allRulesOk)

  updateFieldStatus(passwordField, allRulesOk, null, '')

  return allRulesOk
}

// Update submit button state
function refreshSubmitButton() {
  const allFieldsValid =
    userNameField.classList.contains('valid') &&
    fullNameField.classList.contains('valid') &&
    emailField.classList.contains('valid') &&
    passwordField.classList.contains('valid')

  submitButton.disabled = !allFieldsValid
}

// Event listeners
userNameField.addEventListener('input', () => {
  checkUserName()
  refreshSubmitButton()
})

fullNameField.addEventListener('input', () => {
  checkFullName()
  checkPassword()
  refreshSubmitButton()
})

emailField.addEventListener('input', () => {
  checkEmail()
  checkPassword()
  refreshSubmitButton()
})

passwordField.addEventListener('input', () => {
  checkPassword()
  refreshSubmitButton()
})

// Form submission
signupForm.addEventListener('submit', async (event) => {
  event.preventDefault()

  if (submitButton.disabled) {
    confirmationMsg.style.opacity = '0'
    return
  }

  const formData = {
    username: userNameField.value.trim(),
    fullName: fullNameField.value.trim(),
    email: emailField.value.trim(),
    password: '*'.repeat(passwordField.value.trim().length)
  }

  console.log('data:', formData)

  confirmationMsg.style.opacity = '1'

  signupForm.reset()
  userNameField.classList.remove('valid', 'invalid')
  fullNameField.classList.remove('valid', 'invalid')
  emailField.classList.remove('valid', 'invalid')
  passwordField.classList.remove('valid', 'invalid')

  userNameError.textContent = ''
  fullNameError.textContent = ''
  emailError.textContent = ''

  minLengthRule.classList.remove('valid', 'invalid')
  numberSymbolRule.classList.remove('valid', 'invalid')
  noNameEmailRule.classList.remove('valid', 'invalid')
  strengthRule.classList.remove('valid', 'invalid')
  strengthText.textContent = 'Weak'
  passwordField.classList.remove('valid', 'invalid')

  submitButton.disabled = true
})
