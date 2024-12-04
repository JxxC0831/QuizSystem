document.addEventListener("DOMContentLoaded", async () => {
  try {
    // check login status and update navigation
    const authResponse = await fetch("/api/check-auth");
    const authData = await authResponse.json();

    if (!authData.isLoggedIn) {
      window.location.href = "/login";
      return;
    }

    // update navigation
    updateNavigation();

    // get rankings data
    const rankingsResponse = await fetch("/api/rankings");
    const rankings = await rankingsResponse.json();

    // display top three
    displayTopThree(rankings.slice(0, 3));

    // display full rankings
    displayRankings(rankings);
  } catch (error) {
    console.error("Error:", error);
  }
});

function updateNavigation() {
  const navItems = document.getElementById("navItems");
  navItems.innerHTML = `
        <li class="nav-item">
            <a class="nav-link" href="/quiz">Start Quiz</a>
        </li>
        <li class="nav-item">
            <a  class="nav-link active" href="/rankings">Rankings</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/profile">Profile</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" onclick="logout()">Logout</a>
        </li>
    `;
}

function displayTopThree(topThree) {
  const positions = ["first", "second", "third"];
  positions.forEach((pos, index) => {
    if (topThree[index]) {
      const player = topThree[index];
      const accuracy = Math.round(
        (player.score / player.total_questions) * 100
      );
      document
        .getElementById(`${pos}Place`)
        .querySelector(".user-info").innerHTML = `
                <h4>${player.username}</h4>
                <p class="score">${player.score}/${player.total_questions} (${accuracy}%)</p>
                <small class="text-muted">${player.category}</small>
            `;
    }
  });
}

function displayRankings(rankings) {
  const tbody = document.getElementById("rankingsBody");
  tbody.innerHTML = rankings
    .map((record, index) => {
      const accuracy = Math.round(
        (record.score / record.total_questions) * 100
      );
      const accuracyClass = getAccuracyClass(accuracy);

      return `
            <tr>
                <td>
                    <span class="rank">${index + 1}</span>
                </td>
                <td>
                    <strong>${record.username}</strong>
                </td>
                <td>
                    ${record.score}/${record.total_questions}
                </td>
                <td>${record.category}</td>
                <td>
                    <span class="accuracy-badge ${accuracyClass}">
                        ${accuracy}%
                    </span>
                </td>
                <td>${formatDate(record.created_at)}</td>
            </tr>
        `;
    })
    .join("");
}

function getAccuracyClass(accuracy) {
  if (accuracy >= 80) return "accuracy-high";
  if (accuracy >= 60) return "accuracy-medium";
  return "accuracy-low";
}

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
}

async function logout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    const data = await response.json();

    if (data.success) {
      window.location.href = "/";
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
}
