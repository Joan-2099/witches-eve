
import {
    getUsers,
    getCurrentUser,
    logoutUser
} from "./auth.js";

// Check whether the user is logged in
const currentUser = getCurrentUser();

if (!currentUser) {
    window.location.replace("login.html");
} else {
    displayProfile();
}

// Find and display the current user's information
function displayProfile() {
    const users = getUsers();

    const player = users.find(
        user => user.id === currentUser.id
    );

    // Handle deleted or missing accounts
    if (!player) {
        logoutUser();
        window.location.replace("login.html");
        return;
    }

    // Personal information
    document.getElementById("profileUsername").textContent =
        player.username;

    document.getElementById("profileEmail").textContent =
        player.email;

    document.getElementById("profileBio").textContent =
        player.bio || "No bio added yet.";

    // Profile picture
    if (player.profilePicture) {
        document.getElementById("profilePicture").src =
            player.profilePicture;
    }

    // Game statistics
    const scores = Array.isArray(player.scores)
        ? player.scores
        : [];

    const bestScore = Math.max(
        player.highScore || 0,
        ...scores,
        0
    );

    document.getElementById("best-score").textContent =
        bestScore.toLocaleString();

    document.getElementById("games-played").textContent =
        (player.gamesPlayed ?? scores.length).toString();

    // Leaderboard rank
    const rankedPlayers = [...users].sort(
        (a, b) => (b.highScore || 0) - (a.highScore || 0)
    );

    const rank = rankedPlayers.findIndex(
        user => user.id === player.id
    );

    document.getElementById("player-rank").textContent =
        player.highScore > 0
            ? `#${rank + 1}`
            : "Unranked";

    // Recent activity
    const lastPlayed = document.querySelector(".last-play");

    if (lastPlayed) {
        const activity = document.createElement("p");

        activity.textContent = player.lastPlayed
            ? `Last played: ${player.lastPlayed}`
            : "No games played yet.";

        lastPlayed.appendChild(activity);
    }

    // Achievements
    const achievements = document.querySelector(".player-awards");

    if (achievements) {
        if (player.awards && player.awards.length > 0) {
            player.awards.forEach(award => {
                const item = document.createElement("p");
                item.textContent = award;
                achievements.appendChild(item);
            });
        } else {
            const message = document.createElement("p");
            message.textContent =
                "Your achievements will appear here.";

            achievements.appendChild(message);
        }
    }
}


/* EDIT PROFILE FUNCTIONALITY*/

const editBtn = document.getElementById("editProfileBtn");
const modal = document.getElementById("editProfileModal");
const form = document.getElementById("editProfileForm");
const usernameInput = document.getElementById("editUsername");
const bioInput = document.getElementById("editBio");
const pictureInput = document.getElementById("pictureInput");
const picturePreview = document.getElementById("picturePreview");
const message = document.getElementById("editProfileMessage");

let selectedPicture = null;

function showMessage(text, isError = false) {
    message.textContent = text;
    message.classList.toggle("error", isError);
}

function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = "";
    selectedPicture = null;
    pictureInput.value = "";
    editBtn.focus();
}

// Open modal and load current details
editBtn.addEventListener("click", () => {
    const player = getUsers().find(user => user.id === currentUser?.id);

    if (!player) {
        window.location.replace("login.html");
        return;
    }

    usernameInput.value = player.username || "";
    bioInput.value = player.bio || "";
    picturePreview.src = player.profilePicture || "../images/default-avatar.png";
    pictureInput.value = "";
    selectedPicture = null;
    showMessage("");

    modal.hidden = false;
    document.body.style.overflow = "hidden";
    usernameInput.focus();
});

// Close modal
document.getElementById("closeEditModal").addEventListener("click", closeModal);
document.getElementById("cancelEdit").addEventListener("click", closeModal);
document.getElementById("editModalBackdrop").addEventListener("click", closeModal);

document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !modal.hidden) closeModal();
});

// Preview and validate uploaded picture
pictureInput.addEventListener("change", () => {
    const file = pictureInput.files[0];
    selectedPicture = null;
    showMessage("");

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
        showMessage("Choose a JPG, PNG, WEBP or GIF image.", true);
        pictureInput.value = "";
        return;
    }

    if (file.size > 2 * 1024 * 1024) {
        showMessage("Image must be smaller than 2 MB.", true);
        pictureInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        selectedPicture = reader.result;
        picturePreview.src = selectedPicture;
    };

    reader.onerror = () => {
        showMessage("Could not read the image. Please try another.", true);
        pictureInput.value = "";
    };

    reader.readAsDataURL(file);
});

// Save profile changes
form.addEventListener("submit", event => {
    event.preventDefault();

    const username = usernameInput.value.trim();
    const bio = bioInput.value.trim();

    if (!username || username.length > 30 || bio.length > 160) {
        showMessage("Enter a username (1–30 characters) and bio (up to 160 characters).", true);
        return;
    }

    const users = getUsers();
    const index = users.findIndex(user => user.id === currentUser?.id);

    if (index === -1) {
        showMessage("Account not found. Please log in again.", true);
        return;
    }

    const updatedUser = {
        ...users[index],
        username,
        bio,
        ...(selectedPicture && { profilePicture: selectedPicture })
    };

    users[index] = updatedUser;

    try {
        localStorage.setItem("witchesEveUsers", JSON.stringify(users));

        localStorage.setItem("witchesEveCurrentUser", JSON.stringify({
            ...currentUser,
            username
        }));

        document.getElementById("profileUsername").textContent = username;
        document.getElementById("profileBio").textContent = bio || "No bio added yet.";

        if (selectedPicture) {
            document.getElementById("profilePicture").src = selectedPicture;
        }

        closeModal();
    } catch {
        showMessage("Could not save changes. Browser storage may be full.", true);
    }
});
