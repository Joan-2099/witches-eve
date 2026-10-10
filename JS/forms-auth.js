import {
    registerUser,
    loginUser,
    logoutUser
} from "./auth.js";

// Get the forms and their message elements.
const loginForm = document.getElementById("loginForm");
const registerForm = document.getElementById("registerForm");

const loginMessage = document.getElementById("login-message");
const registerMessage = document.getElementById("register-message");

// Handle registration.
registerForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = document
        .getElementById("register-name-input").value.trim();

    const email = document
        .getElementById("email-input").value.trim();

    const password = document
        .getElementById("register-password-input").value;

    const confirmPassword = document
        .getElementById("confirm_password-input").value;

    // Check for empty fields.
    if (!username || !email || !password || !confirmPassword) {
        registerMessage.textContent = "Please complete all fields.";
        return;
    }

    // Check the email format using JavaScript.
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
        registerMessage.textContent =
            "Please enter a valid email address.";
        return;
    }

    if (password.length < 8) {
        registerMessage.textContent =
            "Your password must be at least 8 characters long.";
        return;
    }

    if (password !== confirmPassword) {
        registerMessage.textContent =
            "Your passwords do not match.";
        return;
    }

    // Attempt to register the player.
    const result = registerUser(username, email, password);

    registerMessage.textContent = result.message;

    if (result.success) {
        registerForm.reset();
    }
});

// Handle login.
loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document
        .getElementById("login-email-input").value.trim();

    const password = document
        .getElementById("password-input").value;

    if (!email || !password) {
        loginMessage.textContent =
            "Please enter both your email and password.";
        return;
    }

    const result = loginUser(email, password);

    loginMessage.textContent = result.message;

    if (result.success) {
        window.location.href = "game.html";
    }
});

const logoutLink = document.getElementById("logoutLink");

logoutLink.addEventListener("click", function (event) {
    event.preventDefault();

    logoutUser();
    window.location.href = "index.html";
});