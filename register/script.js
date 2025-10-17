const form = document.getElementById("registration-form");
const username = document.getElementById("username");
const email = document.getElementById("email");
const password = document.getElementById("password");
const confirmPassword = document.getElementById("confirmPassword");

// 为所有输入框添加实时验证
[username, email, password, confirmPassword].forEach(input => {
  input.addEventListener('input', function() {
    validateField(this);
    // 如果当前字段是密码，也要重新验证确认密码
    if (this.id === 'password' && confirmPassword.value.trim() !== '') {
      validateField(confirmPassword);
    }
  });
  
  input.addEventListener('blur', function() {
    validateField(this);
  });
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const isRequiredValid = checkRequired([username, email, password, confirmPassword]);
  let isFormValid = isRequiredValid;
  if (isRequiredValid) {
    const isUsernameValid = checkLength(username, 3, 15);
    const isEmailValid = checkEmail(email);
    const isPasswordValid = checkLength(password, 6, 15);
    const isPasswordsMatch = checkPasswordsMatch(password, confirmPassword);

    isFormValid = isUsernameValid && isEmailValid && isPasswordValid && isPasswordsMatch;
  }

  if (isFormValid) {
    alert("Registration successful!");
    form.reset();
    document.querySelectorAll(".form-item").forEach((group) => {
      group.className = "form-item";
      const small = group.querySelector("small");
      if (small) small.innerText = "";
    }); 
  }
});

function checkRequired(inputArray) {
  let isValid = true;
  inputArray.forEach((input) => {
    if (input.value.trim() === "") {
      showError(input, `${formatFieldName(input)} is required`);
      isValid = false;
    } else {
      showSuccess(input);
    }
  });
  return isValid;
}

function checkLength(input, min, max) {
  if (input.value.length < min) {
    showError(input, `${formatFieldName(input)} must be at least ${min} characters`);
    return false;
  } else if (input.value.length > max) {
    showError(input, `${formatFieldName(input)} cannot exceed ${max} characters`);
    return false;
  } else {
    showSuccess(input);
    return true;
  }
}

function checkEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (emailRegex.test(email.value.trim())) {
    showSuccess(email);
    return true;
  } else {
    showError(email, "Invalid email format");
    return false;
  }
}

function checkPasswordsMatch(input1, input2) {
  if (input1.value !== input2.value) {
    showError(input2, "Passwords do not match");
    return false;
  }
  showSuccess(input2);
  return true;
}

function showError(input, message) {
  const formGroup = input.parentElement;
  formGroup.className = "form-item error";
  const small = formGroup.querySelector("small");
  small.innerText = message;
}

function showSuccess(input) {
  const formGroup = input.parentElement;
  formGroup.className = "form-item success";
  const small = formGroup.querySelector("small");
  if (small) small.innerText = "";
}

function validateField(input) {
  const value = input.value.trim();
  
  // 清除之前的错误状态
  const formGroup = input.parentElement;
  formGroup.className = "form-item";
  
  // 检查必填项
  if (value === "") {
    showError(input, `${formatFieldName(input)} is required`);
    return false;
  }
  
  // 根据字段类型进行特定验证
  switch (input.id) {
    case "username":
      if (value.length < 3) {
        showError(input, "Username must be at least 3 characters");
        return false;
      } else if (value.length > 15) {
        showError(input, "Username cannot exceed 15 characters");
        return false;
      }
      break;
      
    case "email":
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        showError(input, "Invalid email format");
        return false;
      }
      break;
      
    case "password":
      if (value.length < 6) {
        showError(input, "Password must be at least 6 characters");
        return false;
      } else if (value.length > 15) {
        showError(input, "Password cannot exceed 15 characters");
        return false;
      }
      break;
      
    case "confirmPassword":
      if (password.value !== value) {
        showError(input, "Passwords do not match");
        return false;
      }
      break;
  }
  
  // 如果所有验证都通过，显示成功状态
  showSuccess(input);
  return true;
}

function formatFieldName(input) {
  switch (input.id) {
    case "username":
      return "Username";
    case "email":
      return "Email";
    case "password":
      return "Password";
    case "confirmPassword":
      return "Confirm Password";
    default:
      return input.id;
  }
}
