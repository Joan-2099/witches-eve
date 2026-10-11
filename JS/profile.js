
import { getUsers, getCurrentUser } from "./auth.js";

// Check if logged in
const currentUser = getCurrentUser();

if (!currentUser) {
    // Change this if your login page has a different filename
    window.location.replace("login.html");
} else {
    displayProfile();
}


//Find the current user's records
function displayProfile() {
    const users = getUsers();

    const player = users.find(user => user.id === currentUser.id);

    // The session may exist even if the user record was deleted
    if (!player) {
        sessionStorage.removeItem("witchesEveCurrentUser");
        window.location.replace("login.html");
        return;
    }

    //Display the player's personal information
    document.getElementById("profileUsername").textContent =
        player.username;

    document.getElementById("profileEmail").textContent =
        player.email;

    document.getElementById("profileBio").textContent =
        player.bio || "No bio added yet.";

    // Display the profile picture, if one has been saved
    if (player.profilePicture) {
        document.getElementById("profilePicture").src =
            player.profilePicture;
    }

    // Display game statistics
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

    // Calculate leaderboard rank from saved users
    const rankedPlayers = [...users].sort(
        (a, b) => (b.highScore || 0) - (a.highScore || 0)
    );

    const rank = rankedPlayers.findIndex(
        user => user.id === player.id
    );

    document.getElementById("playerRank").textContent =
        player.highScore > 0
            ? `#${rank + 1}`
            : "Unranked";

    //  Recent activity
    document.getElementById("lastPlayed").textContent =
        player.lastPlayed
            ? `Last played: ${player.lastPlayed}`
            : "No games played yet.";

    //Achievements
    const achievements = document.getElementById(
        "playerAchievements"
    );

    achievements.replaceChildren();

    if (player.awards && player.awards.length > 0) {
        player.awards.forEach(award => {
            const item = document.createElement("p");
            item.textContent = award;
            achievements.appendChild(item);
        });
    } else {
        achievements.textContent =
            "Your achievements will appear here.";
    }
}
