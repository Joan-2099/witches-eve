
const players = [
    {
        name: "Luna", 
        score: 12450,
        level: 8
    },
    {
        name: "Amara",
        score: 11820,
        level: 7
    },
    {
        name: "Zara",
        score: 10900,
        level: 7
    },
    {
        name: "Maya",
        score: 9740,
        level: 6
    },
    {
        name: "Nia",
        score: 8650,
        level: 5
    }
];


// Sort players score(highet to lowest)
players.sort((a, b) => b.score - a.score);


// Get table body
const leaderboardBody = document.getElementById("leaderboard-body");


//calculate the impact bar
const highestScore = players[0].score;


// Create each leaderboard row
players.forEach((player, index) => {

    const row = document.createElement("tr");
    // Ranking
    let rank;
    if (index === 0) {
        rank = "🥇";
        row.classList.add("rank-one");

    } else if (index === 1) {
        rank = "🥈";
        row.classList.add("rank-two");

    } else if (index === 2) {
        rank = "🥉";
        row.classList.add("rank-three");

    } else {
        rank = `#${index + 1}`;//called template literal
    }


    // Score
    const impact = (player.score / highestScore) * 100;
    // Player
    const initial = player.name.charAt(0).toUpperCase();

    // Trophy
    let trophy = "";

    if (index === 0) {
        trophy = `
            <img 
                src="../images/trophy.png" 
                alt="Winner trophy" 
                class="winner-trophy"
            >
        `;
    }

        // Create Row
        row.innerHTML = `
            
            <td>
                <span class="rank-badge">
                    ${rank}
                </span>
            </td>


            <td class="player-cell">

                ${trophy}

                <span class="avatar">
                    ${initial}
                </span>
                <span class="player-name">
                    ${player.name}
                </span>
            </td>


            <td class="score-cell">

                <div class="score-info">
                    <span>
                        ${player.score.toLocaleString()}
                    </span>
                </div>

                <div class="impact-bar">
                    <div 
                        class="impact-fill"
                        style="width: ${impact}%;">
                    </div>
                </div>

            </td>


            <td>
                <span class="level-badge">
                    LVL ${player.level}
                </span>

            </td>

        `;


        // Add row to table
        leaderboardBody.appendChild(row);

});