
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
