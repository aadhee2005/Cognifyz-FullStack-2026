const form = document.getElementById("registerForm");

const fields = {
  name: document.getElementById("fullName"),
  email: document.getElementById("email"),
  password: document.getElementById("password"),
  confirm: document.getElementById("confirmPassword"),
  course: document.getElementById("course"),
  terms: document.getElementById("terms")
};

const errors = {
  name: document.getElementById("nameError"),
  email: document.getElementById("emailError"),
  password: document.getElementById("passwordError"),
  confirm: document.getElementById("confirmError"),
  course: document.getElementById("courseError"),
  terms: document.getElementById("termsError")
};

// Password validation rules
function getPasswordRules(password) {
  return {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password)
  };
}

// Display password rules dynamically
function updatePasswordStrength() {
  const password = fields.password.value;
  const rules = getPasswordRules(password);
  const score = Object.values(rules).filter(Boolean).length;

  const ruleElements = {
    length: document.getElementById("ruleLength"),
    upper: document.getElementById("ruleUpper"),
    lower: document.getElementById("ruleLower"),
    number: document.getElementById("ruleNumber"),
    special: document.getElementById("ruleSpecial")
  };

  Object.entries(rules).forEach(([rule, passed]) => {
    ruleElements[rule].classList.toggle("met", passed);
    ruleElements[rule].textContent =
      (passed ? "✓ " : "○ ") +
      {
        length: "8+ characters",
        upper: "Uppercase letter",
        lower: "Lowercase letter",
        number: "Number",
        special: "Special character"
      }[rule];
  });

  const bar = document.getElementById("strengthBar");
  const text = document.getElementById("strengthText");

  const levels = [
    { label: "Not entered", color: "#e34b4b" },
    { label: "Very weak", color: "#e34b4b" },
    { label: "Weak", color: "#ed8b38" },
    { label: "Fair", color: "#e5b83e" },
    { label: "Strong", color: "#42a879" },
    { label: "Very strong", color: "#16865c" }
  ];

  bar.style.width = password ? `${score * 20}%` : "0";
  bar.style.background = levels[score].color;
  text.textContent = `Password strength: ${levels[score].label}`;

  // Update confirmation feedback as password changes
  if (fields.confirm.value) {
    validateField("confirm");
  }
}

// Show or clear a field's validation error
function showError(field, errorElement, message) {
  errorElement.textContent = message;
  field.classList.toggle("invalid", Boolean(message));
  field.classList.toggle("valid", !message && field.value.trim() !== "");
}

// Validate an individual field
function validateField(fieldName) {
  let message = "";
  const field = fields[fieldName];

  switch (fieldName) {
    case "name":
      if (!field.value.trim()) {
        message = "Please enter your full name.";
      } else if (field.value.trim().length < 3) {
        message = "Name must contain at least 3 characters.";
      } else if (!/^[A-Za-z][A-Za-z\s'-]*$/.test(field.value.trim())) {
        message = "Use letters, spaces, apostrophes, or hyphens only.";
      }
      break;

    case "email":
      if (!field.value.trim()) {
        message = "Email address is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(field.value.trim())) {
        message = "Enter a valid email address.";
      }
      break;

    case "password": {
      const rules = getPasswordRules(field.value);
      if (!field.value) {
        message = "Password is required.";
      } else if (!Object.values(rules).every(Boolean)) {
        message = "Your password must meet all 5 requirements.";
      }
      break;
    }

    case "confirm":
      if (!field.value) {
        message = "Please confirm your password.";
      } else if (field.value !== fields.password.value) {
        message = "Passwords do not match.";
      }
      break;

    case "course":
      if (!field.value) {
        message = "Please select an area of interest.";
      }
      break;

    case "terms":
      if (!field.checked) {
        message = "Please accept the terms to continue.";
      }
      errors.terms.textContent = message;
      return !message;
  }

  showError(field, errors[fieldName], message);
  return !message;
}

// Live validation as users interact with the form
fields.name.addEventListener("input", () => validateField("name"));
fields.email.addEventListener("input", () => validateField("email"));

fields.password.addEventListener("input", () => {
  updatePasswordStrength();
  validateField("password");
});

fields.confirm.addEventListener("input", () => validateField("confirm"));
fields.course.addEventListener("change", () => validateField("course"));
fields.terms.addEventListener("change", () => validateField("terms"));

// Validate all fields when submitted
form.addEventListener("submit", function (event) {
  event.preventDefault();

  const fieldNames = ["name", "email", "password", "confirm", "course", "terms"];
  const results = fieldNames.map(validateField);
  const isValid = results.every(Boolean);

  if (!isValid) {
    const firstInvalid = form.querySelector(".invalid");
    if (firstInvalid) firstInvalid.focus();
    return;
  }

  // Update success page using submitted form data
  document.getElementById("successName").textContent =
    fields.name.value.trim().split(/\s+/)[0];

  document.getElementById("successMessage").textContent =
    "Your registration details have passed validation.";

  const details = document.getElementById("successDetails");
  details.replaceChildren();

  [
    ["Name", fields.name.value.trim()],
    ["Email", fields.email.value.trim()],
    ["Area of interest", fields.course.value]
  ].forEach(([label, value]) => {
    const row = document.createElement("p");
    const strong = document.createElement("strong");

    strong.textContent = `${label}: `;
    row.append(strong, document.createTextNode(value));
    details.appendChild(row);
  });

  // Navigate to success page without reloading
  window.location.hash = "success";
});

// Simple client-side hash routing
function handleRoute() {
  const route = window.location.hash.slice(1) || "home";
  const validRoutes = ["home", "register", "success", "about", "help"];
  const activeRoute = validRoutes.includes(route) ? route : "home";

  document.querySelectorAll(".page").forEach(page => {
    page.style.display = page.id === activeRoute ? "block" : "none";
  });

  document.querySelectorAll("nav a").forEach(link => {
    link.classList.toggle(
      "active",
      link.getAttribute("href") === `#${activeRoute}`
    );
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

window.addEventListener("hashchange", handleRoute);

// Initialize the page and password meter
handleRoute();
updatePasswordStrength();