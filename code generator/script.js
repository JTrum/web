// Character sets for password generation
const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
const numberCharacters = "0123456789";
const symbolCharacters = "!@#$%^&*()-_=+[]{}|;:,.<>?/";

// Get DOM elements
const passwordInput = document.getElementById("password");
const lengthSlider = document.getElementById("length");
const lengthDisplay = document.getElementById("length-value");
const uppercaseCheckbox = document.getElementById("uppercase");
const lowercaseCheckbox = document.getElementById("lowercase");
const numbersCheckbox = document.getElementById("numbers");
const symbolsCheckbox = document.getElementById("symbols");
const generateButton = document.getElementById("generate-btn");
const copyButton = document.getElementById("copy-btn");
const successCheckmark = document.getElementById("success-checkmark");
const strengthBar = document.querySelector(".strength-bar");
const strengthText = document.querySelector(".strength-container p");
const strengthLabel = document.getElementById("strength-label");

// Update length display when slider changes
lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
});

// Add click event to generate button
generateButton.addEventListener("click", makePassword);

// Generate password function
function makePassword() {
  const length = Number(lengthSlider.value);
  const includeUppercase = uppercaseCheckbox.checked;
  const includeLowercase = lowercaseCheckbox.checked;
  const includeNumbers = numbersCheckbox.checked;
  const includeSymbols = symbolsCheckbox.checked;

  // Check if at least one character type is selected
  if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
    alert("Please select at least one character type.");
    return;
  }

  // Generate password
  const newPassword = createRandomPassword(
    length,
    includeUppercase,
    includeLowercase,
    includeNumbers,
    includeSymbols
  );

  passwordInput.value = newPassword;
  
  // Update password strength meter
  updateStrengthMeter(newPassword);
}

// Create random password function
function createRandomPassword(
  length,
  includeUppercase,
  includeLowercase,
  includeNumbers,
  includeSymbols
) {
  let allCharacters = "";

  if (includeUppercase) allCharacters += uppercaseLetters;
  if (includeLowercase) allCharacters += lowercaseLetters;
  if (includeNumbers) allCharacters += numberCharacters;
  if (includeSymbols) allCharacters += symbolCharacters;

  let password = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    password += allCharacters[randomIndex];
  }

  return password;
}

// Update password strength meter
function updateStrengthMeter(password) {
  const passwordLength = password.length;
  
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumbers = /[0-9]/.test(password);
  const hasSymbols = /[!@#$%^&*()-_=+[\]{}|;:,.<>?]/.test(password);

  let strengthScore = 0;
  
  // Length contributes to strength (max 40 points)
  strengthScore += Math.min(passwordLength * 2, 40);

  // Character variety contributes to strength
  if (hasUppercase) strengthScore += 15;
  if (hasLowercase) strengthScore += 15;
  if (hasNumbers) strengthScore += 15;
  if (hasSymbols) strengthScore += 15;

  // Count character types for more accurate assessment
  let characterTypes = 0;
  if (hasUppercase) characterTypes++;
  if (hasLowercase) characterTypes++;
  if (hasNumbers) characterTypes++;
  if (hasSymbols) characterTypes++;

  let strengthLabelText = "";
  let fillPercentage = 0;

  // More precise strength calculation
  if (passwordLength < 6 || characterTypes < 2) {
    // Very weak - short password or only one character type
    fillPercentage = 20;
    strengthLabelText = "Weak";
  } else if (passwordLength < 8 || characterTypes < 3) {
    // Weak - medium length but limited character variety
    fillPercentage = 30;
    strengthLabelText = "Weak";
  } else if (passwordLength < 12 || characterTypes < 4) {
    // Medium - good length or good variety
    fillPercentage = 60;
    strengthLabelText = "Medium";
  } else {
    // Strong - long password with all character types
    fillPercentage = 100;
    strengthLabelText = "Strong";
  }

  // Update the strength bar fill using CSS custom property
  strengthBar.style.setProperty('--fill-width', fillPercentage + '%');
  strengthLabel.textContent = strengthLabelText;
}

// Copy password to clipboard
copyButton.addEventListener("click", () => {
  if (!passwordInput.value) return;

  navigator.clipboard
    .writeText(passwordInput.value)
    .then(() => showCopySuccess())
    .catch((error) => console.log("Could not copy:", error));
});

// Show copy success feedback
function showCopySuccess() {
  // Add success class to copy button (makes it green)
  copyButton.classList.add("success");
  
  // Show the success checkmark
  successCheckmark.classList.add("show");

  setTimeout(() => {
    // Remove success class from copy button
    copyButton.classList.remove("success");
    
    // Hide the success checkmark
    successCheckmark.classList.remove("show");
  }, 1000);
}

// Update length display when slider changes
lengthSlider.addEventListener("input", () => {
  lengthDisplay.textContent = lengthSlider.value;
  updateSliderProgress();
});

// Update slider progress fill
function updateSliderProgress() {
  const value = lengthSlider.value;
  const min = lengthSlider.min;
  const max = lengthSlider.max;
  const percentage = ((value - min) / (max - min)) * 100;
  
  // Create progress fill effect: colored left part, gray right part
  lengthSlider.style.background = `linear-gradient(to right, #667eea 0%, #667eea ${percentage}%, #e2e8f0 ${percentage}%, #e2e8f0 100%)`;
}

// Initialize slider progress on page load
window.addEventListener("DOMContentLoaded", () => {
  makePassword();
  updateSliderProgress();
});
