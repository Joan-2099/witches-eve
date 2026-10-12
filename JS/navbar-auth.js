import { getCurrentUser, logoutUser } from "./auth.js";

const profileLink = document.getElementById("profileLink");
const logoutLink = document.getElementById("logoutLink");
const logoutModal = document.getElementById("logoutModal");
const cancelLogout = document.getElementById("cancelLogout");
const confirmLogout = document.getElementById("confirmLogout");
const logoutBackdrop = document.querySelector(".logout-backdrop");


function updateNavbar() {
    const loggedIn = Boolean(getCurrentUser());

    if (profileLink) {
        profileLink.href = loggedIn ? "profile.html" : "login.html";
    }

    if (logoutLink) {
        logoutLink.hidden = false;
        logoutLink.style.display = "inline-block";
    }
}

updateNavbar();


function closeLogoutModal() {
    logoutModal.hidden = true;
    logoutLink.focus();
}

if (logoutLink && logoutModal) {
    logoutLink.addEventListener("click", (event) => {
        event.preventDefault();

        if (!getCurrentUser()) {
            window.location.href = "login.html";
            return;
        }

        logoutModal.hidden = false;
        confirmLogout.focus();
    });

    cancelLogout.addEventListener("click", closeLogoutModal);
    logoutBackdrop.addEventListener("click", closeLogoutModal);

    confirmLogout.addEventListener("click", () => {
        logoutUser();
        window.location.href = "login.html";
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !logoutModal.hidden) {
            closeLogoutModal();
        }
    });
}

