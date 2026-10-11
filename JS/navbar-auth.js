import { getCurrentUser, logoutUser } from "./auth.js";

const profileLink = document.getElementById("profileLink");
const logoutLink = document.getElementById("logoutLink");

const currentUser = getCurrentUser();

// Choose the correct destination for the profile icon
if (profileLink) {
    profileLink.href = currentUser ? "profile.html" : "login.html";
}

// Handle logout
if (logoutLink) {
    if (currentUser) {
        logoutLink.textContent = "Logout";

        logoutLink.addEventListener("click", function (event) {
            event.preventDefault();
            logoutUser();
            window.location.href = "login.html";
        });
    } else {
        logoutLink.textContent = "Login";
        logoutLink.href = "login.html";
    }
}