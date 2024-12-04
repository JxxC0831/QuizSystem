// Initiate the profile page with user data and history
// declare a variable to store the chart instance
let performanceChart;

document.addEventListener("DOMContentLoaded", async () => {
  try {
    // check login status of user
    const authResponse = await fetch("/api/check-auth");
    const authData = await authResponse.json();

    if (!authData.isLoggedIn) {
      window.location.href = "/login";// if not, redirect to login page
      return;
    }

    // update navigation
    updateNavigation();

    // update user info
    updateUserInfo(authData.user);

    // get user data
    const response = await fetch("/api/profile");
    const data = await response.json();

    // update stats
    updateStats(data.stats);

    // update history
    updateHistory(data.history);

    // create chart
    createPerformanceChart(data.history);
  } catch (error) {
    console.error("Error:", error);
  }
});

// update navigation bar
function updateNavigation() {
  const navItems = document.getElementById("navItems");
  navItems.innerHTML = `
        <li class="nav-item">
            <a class="nav-link" href="/quiz">Start Quiz</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="/rankings">Rankings</a>
        </li>
        <li class="nav-item">
            <a class="nav-link active" href="/profile">Profile</a>
        </li>
        <li class="nav-item">
            <a class="nav-link" href="#" onclick="logout()">Logout</a>
        </li>
    `;
}

//update the profile statistics
function updateStats(stats) {
  document.getElementById("totalQuizzes").textContent = stats.total_quizzes;
  document.getElementById("totalCorrect").textContent = stats.total_correct;
  document.getElementById("accuracyRate").textContent = `${stats.accuracy}%`;
}

//function to create or update the table
function updateHistory(history) {
  const historyTable = document.getElementById("historyTable");
  historyTable.innerHTML = history
    .map((record) => {
      const accuracy = Math.round(
        (record.score / record.total_questions) * 100
      );
      const accuracyClass = getAccuracyClass(accuracy);
      const categoryIcon = getCategoryIcon(record.category);
      const categoryClass = getCategoryClass(record.category);

      return `
            <div class="activity-item">
                <div class="activity-icon ${categoryClass}">
                    <i class="${categoryIcon}"></i>
                </div>
                <div class="activity-info">
                    <div class="activity-header">
                        <h5>${record.category}</h5>
                        <span class="activity-time">${formatDate(record.created_at)}</span>
                    </div>
                    <div class="activity-stats">
                        <div class="score-badge">
                            <i class="fas fa-star"></i>
                            <span>${record.score}/${
        record.total_questions
      }</span>
                        </div>
                        <div class="accuracy-badge ${accuracyClass}">
                            <i class="fas fa-bullseye"></i>
                            <span>${accuracy}%</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    })
    .join("");
}

//function to create the performance chart
function createPerformanceChart(history) {
  const ctx = document.getElementById("performanceChart").getContext("2d");

  // if chart exists, destroy it
  if (performanceChart) {
    performanceChart.destroy();
  }

  // reverse array to display in time order
  const chartData = history.reverse();

  // create chart
  performanceChart = new Chart(ctx, {
    type: "line",
    data: {
      // map the created_at date to the x-axis
      labels: chartData.map((record) => formatDate(record.created_at)),
      datasets: [
        {
          label: "Accuracy %",
          data: chartData.map((record) =>
            Math.round((record.score * 100) / record.total_questions)
          ),
          borderColor: "#6c5ce7",// set the line color
          tension: 0.1,
        },
      ],
    },
    options: {
      responsive: true,// make the chart responsive
      scales: {
        y: {
          beginAtZero: true,
          max: 100,
        },
      },
    },
  });
}

function getAccuracyClass(accuracy) {
  if (accuracy >= 70) return "high";
  if (accuracy >= 40) return "medium";
  return "low";
}

//function to get the category icon
function getCategoryIcon(category) {
  const icons = {
    "General Knowledge": "fas fa-globe",
    Art: "fas fa-palette",
    "Entertainment: Video Games": "fas fa-gamepad",
    "Entertainment: Film": "fas fa-film",
    Science: "fas fa-flask",
    // add more category icon mappings
  };
  return icons[category] || "fas fa-question";
}

//function to get the category class
function getCategoryClass(category) {
  const classes = {
    "General Knowledge": "general-knowledge",
    Art: "art",
    "Entertainment: Video Games": "entertainment",
    "Entertainment: Film": "entertainment",
    Science: "science",
    // add more category styles mappings
  };
  return classes[category] || "";
}

//function  to format the date
function formatDate(dateString) {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "long", day: "numeric" };
  return date.toLocaleDateString(undefined, options);
}

//function to logout
async function logout() {
  try {
    const response = await fetch("/api/logout", {
      method: "POST",
    });
    const data = await response.json();

    if (data.success) {
      // redirect to home page
      window.location.href = "/";
    }
  } catch (error) {
    // log error
    console.error("Error logging out:", error);
  }
}

//function to update the user info
function updateUserInfo(user) {
  document.getElementById("username").textContent = user.username;
  document.getElementById(
    "memberSince"
  ).textContent = `Member since: ${formatDate(user.created_at)}`;
}
