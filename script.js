// --- Screen Switching Utility ---
function showScreen(screenId) {
  document.querySelectorAll(".screen").forEach((screen) => {
    screen.style.display = "none";
  });

  const screen = document.getElementById(screenId);

  if (screen.id === "greeting-screen") {
    screen.style.display = "flex";
  } else {
    screen.style.display = "block";
  }
}

// --- Button Event Listeners ---
// Show nickname/greeting screen after title
document.getElementById("start-btn").onclick = function () {
  document.getElementById("title-screen").style.display = "none";
  const storedNickname = localStorage.getItem("nickname");
  const nicknameScreen = document.getElementById("nickname-screen");
  const greetingDiv = document.getElementById("greeting-message");
  const greetingContinue = document.getElementById("greeting-continue-btn");
  const nicknameTitle = document.getElementById("nickname-title");
  const nicknameInput = document.getElementById("nickname-input");

  if (storedNickname) {
    // Show greeting, hide nickname screen
    showScreen("greeting-screen");
    // Show the continue button
    greetingDiv.innerHTML = `<b>Welcome back, ${storedNickname}!</b><br>`;
  } else {
    // Show nickname input screen
    showScreen("nickname-screen");
  }

  // Handle nickname submission
  document.getElementById("nickname-submit-btn").onclick = function () {
    const nickname = nicknameInput.value.trim();
    if (!nickname) {
      alert("Please enter your nickname!");
      return;
    }
    localStorage.setItem("nickname", nickname);
    greetingDiv.innerHTML = `Welcome, <b>${nickname}</b>!<br>`;
    greetingDiv.appendChild(greetingContinue);
    greetingDiv.style.display = "block";
    greetingContinue.style.display = "inline-block";
    nicknameScreen.style.display = "none";
    // Proceed to next screen if you want, e.g. showScreen('mode-screen');
  };
};
document.getElementById("leaderboard-btn").onclick = () => {
  showScreen("leaderboard-screen");
  showLeaderboard();
};
document.getElementById("end-replay-btn").onclick = () => {
  showScreen("game-screen");
  startGame();
};
document.getElementById("end-leaderboard-btn").onclick = () => {
  showScreen("leaderboard-screen"); // or whatever your leaderboard screen's id is
  showLeaderboard(); // your leaderboard rendering function
};

// Handle nickname submission
document.getElementById("greeting-continue-btn").onclick = () => {
  showTutorial();
};
document.getElementById("easy-btn").onclick = () => {
  showDifficultyPopup("easy");
};
document.getElementById("normal-btn").onclick = () => {
  showDifficultyPopup("normal");
};
document.getElementById("hard-btn").onclick = () => {
  showDifficultyPopup("hard");
};
document.getElementById("expert-btn").onclick = () => {
  showDifficultyPopup("expert");
};

document.getElementById("back-to-title-btn").onclick = () =>
  showScreen("title-screen");
document.getElementById("nickname-to-title-btn").onclick = () =>
  showScreen("title-screen");
document.getElementById("back-to-mode-btn").onclick = () =>
  showScreen("mode-screen");
document.getElementById("back-to-mode-btn2").onclick = () =>
  showScreen("mode-screen");
document.getElementById("end-mode-btn").onclick = () =>
  showScreen("mode-screen");
document.getElementById("leaderboard-prev").onclick = () => {
  if (!leaderboardDifficulties.length) return;

  currentLeaderboardIndex--;
  if (currentLeaderboardIndex < 0) {
    currentLeaderboardIndex = leaderboardDifficulties.length - 1;
  }

  renderCurrentLeaderboard();
};

document.getElementById("leaderboard-next").onclick = () => {
  if (!leaderboardDifficulties.length) return;

  currentLeaderboardIndex++;
  if (currentLeaderboardIndex >= leaderboardDifficulties.length) {
    currentLeaderboardIndex = 0;
  }

  renderCurrentLeaderboard();
};

document.getElementById("tutorial-prev").onclick = () => {
  if (currentTutorialIndex > 0) {
    currentTutorialIndex--;
    renderTutorialPage();
  }
};

document.getElementById("tutorial-next").onclick = () => {
  if (currentTutorialIndex < tutorialPages.length - 1) {
    currentTutorialIndex++;
    renderTutorialPage();
  }
};

document.getElementById("tutorial-skip-btn").onclick = () => {
  showScreen("mode-screen");
  // or wherever you want them to go after skipping
};

document.getElementById("tutorial-btn").onclick = () => {
  showTutorial();
};

// On page load, show the title screen
showScreen("loading-screen");

// --- Game Data: Multi-Tier Questions ---
const gameData = {
  easy: {
    questions: [
      {
        text: "1. How many signals are there?",
        tier: "primary",
        unlocks: [
          {
            text: "1.1. How many singlets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text: "1.2. How many doublets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text: "1.3. How many triplets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text:
              "1.4. How many signals with higher than triplet multiplicity are there?",
            tier: "secondary",
            unlocks: []
          }
        ]
      },
      {
        text: "2. What’s the total integration of all signals?",
        tier: "primary",
        unlocks: [
          {
            text: "2.1a. What’s the smallest integration of any one signal?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "2.1b. What’s the largest integration of any one signal?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "2.1c. How many different integration values are there?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3a. How many signals have chemical shift<6 ppm?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3b. How many signals have 6 ppm<chemical shift<9 ppm?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3c. How many signals have 9 ppm<chemical shift?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "4a. What’s the lowest multiplicity in one signal?",
        tier: "primary",
        unlocks: [
          {
            text: "4.1. How many signals have only 1 J-value?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "4.2. How many signals have more than 1 J-values?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.2.1 What’s the smallest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.2.2 What’s the largest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "4b. What’s the highest multiplicity in one signal?",
        tier: "primary",
        unlocks: [
          {
            text: "4.1. How many signals have only 1 J-value?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "4.2. How many signals have more than 1 J-values?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.2.1 What’s the smallest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.2.2 What’s the largest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      }
    ],
    suspects: [
      { name: "easy-suspect-1", image: "images/easy-suspect1-front.png" },
      { name: "easy-suspect-2", image: "images/easy-suspect2-front.png" },
      { name: "easy-suspect-3", image: "images/easy-suspect3-front.png" },
      { name: "easy-suspect-4", image: "images/easy-suspect4-front.png" },
      { name: "easy-suspect-5", image: "images/easy-suspect5-front.png" },
      { name: "easy-suspect-6", image: "images/easy-suspect6-front.png" },
      { name: "easy-suspect-7", image: "images/easy-suspect7-front.png" },
      { name: "easy-suspect-8", image: "images/easy-suspect8-front.png" }
    ]
  },
  normal: {
    questions: [
      {
        text: "1. How many signals are there?",
        tier: "primary",
        unlocks: [
          {
            text: "1.1. How many singlets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text: "1.2. How many doublets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text: "1.3. How many triplets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text:
              "1.4. How many signals with higher than triplet multiplicity are there?",
            tier: "secondary",
            unlocks: []
          }
        ]
      },
      {
        text: "2. What’s the total integration of all signals?",
        tier: "primary",
        unlocks: [
          {
            text: "2.1a. What’s the smallest integration of any one signal?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "2.1b. What’s the largest integration of any one signal?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "2.1c. How many different integration values are there?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3a. How many signals have chemical shift<6 ppm?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3b. How many signals have 6 ppm<chemical shift<9 ppm?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3c. How many signals have 9 ppm<chemical shift?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "4a. What’s the lowest multiplicity in one signal?",
        tier: "primary",
        unlocks: [
          {
            text: "4.1. How many signals have only 1 J-value?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "4.2. How many signals have more than 1 J-values?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.2.1 What’s the smallest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.2.2 What’s the largest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "4b. What’s the highest multiplicity in one signal?",
        tier: "primary",
        unlocks: [
          {
            text: "4.1. How many signals have only 1 J-value?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "4.2. How many signals have more than 1 J-values?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.2.1 What’s the smallest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.2.2 What’s the largest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      }
    ],
    suspects: [
      { name: "normal-suspect-1", image: "images/normal-suspect1-front.png" },
      { name: "normal-suspect-2", image: "images/normal-suspect2-front.png" },
      { name: "normal-suspect-3", image: "images/normal-suspect3-front.png" },
      { name: "normal-suspect-4", image: "images/normal-suspect4-front.png" },
      { name: "normal-suspect-5", image: "images/normal-suspect5-front.png" },
      { name: "normal-suspect-6", image: "images/normal-suspect6-front.png" },
      { name: "normal-suspect-7", image: "images/normal-suspect7-front.png" },
      { name: "normal-suspect-8", image: "images/normal-suspect8-front.png" }
    ]
  },
  hard: {
    questions: [
      {
        text: "1. How many signals are there?",
        tier: "primary",
        unlocks: [
          {
            text: "1.1. How many singlets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text: "1.2. How many doublets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text: "1.3. How many triplets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text:
              "1.4. How many signals with higher than triplet multiplicity are there?",
            tier: "secondary",
            unlocks: []
          }
        ]
      },
      {
        text: "2. What’s the total integration of all signals?",
        tier: "primary",
        unlocks: [
          {
            text: "2.1a. What’s the smallest integration of any one signal?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "2.1b. What’s the largest integration of any one signal?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "2.1c. How many different integration values are there?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3a. How many signals have chemical shift<6 ppm?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3b. How many signals have 6 ppm<chemical shift<9 ppm?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3c. How many signals have 9 ppm<chemical shift?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "4a. What’s the lowest multiplicity in one signal?",
        tier: "primary",
        unlocks: [
          {
            text: "4.1. How many signals have only 1 J-value?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "4.2. How many signals have more than 1 J-values?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.2.1 What’s the smallest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.2.2 What’s the largest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "4b. What’s the highest multiplicity in one signal?",
        tier: "primary",
        unlocks: [
          {
            text: "4.1. How many signals have only 1 J-value?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "4.2. How many signals have more than 1 J-values?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.2.1 What’s the smallest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.2.2 What’s the largest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      }
    ],
    suspects: [
      { name: "hard-suspect-1", image: "images/hard-suspect1-front.png" },
      { name: "hard-suspect-2", image: "images/hard-suspect2-front.png" },
      { name: "hard-suspect-3", image: "images/hard-suspect3-front.png" },
      { name: "hard-suspect-4", image: "images/hard-suspect4-front.png" },
      { name: "hard-suspect-5", image: "images/hard-suspect5-front.png" },
      { name: "hard-suspect-6", image: "images/hard-suspect6-front.png" },
      { name: "hard-suspect-7", image: "images/hard-suspect7-front.png" },
      { name: "hard-suspect-8", image: "images/hard-suspect8-front.png" }
    ]
  },
  expert: {
    questions: [
      {
        text: "1. How many signals are there?",
        tier: "primary",
        unlocks: [
          {
            text: "1.1. How many singlets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text: "1.2. How many doublets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text: "1.3. How many triplets are there?",
            tier: "secondary",
            unlocks: []
          },
          {
            text:
              "1.4. How many signals with higher than triplet multiplicity are there?",
            tier: "secondary",
            unlocks: []
          }
        ]
      },
      {
        text: "2. What’s the total integration of all signals?",
        tier: "primary",
        unlocks: [
          {
            text: "2.1a. What’s the smallest integration of any one signal?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "2.1b. What’s the largest integration of any one signal?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "2.1c. How many different integration values are there?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "2.1.1 How many signals have the smallest integration value?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "2.1.2 How many signals have the largest integration value?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3a. How many signals have chemical shift<6 ppm?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3b. How many signals have 6 ppm<chemical shift<9 ppm?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "3c. How many signals have 9 ppm<chemical shift?",
        tier: "primary",
        unlocks: [
          {
            text: "3.1a. What’s the lowest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "3.1b. What’s the highest chemical shift of any signal?",
            tier: "secondary",
            unlocks: [
              {
                text: "3.1.1. How many signals have chemical shift<2 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text: "3.1.11. How many signals have 11 ppm<chemical shift?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "4a. What’s the lowest multiplicity in one signal?",
        tier: "primary",
        unlocks: [
          {
            text: "4.1. How many signals have only 1 J-value?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "4.2. How many signals have more than 1 J-values?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.2.1 What’s the smallest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.2.2 What’s the largest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      },
      {
        text: "4b. What’s the highest multiplicity in one signal?",
        tier: "primary",
        unlocks: [
          {
            text: "4.1. How many signals have only 1 J-value?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          },
          {
            text: "4.2. How many signals have more than 1 J-values?",
            tier: "secondary",
            unlocks: [
              {
                text:
                  "4.2.1 What’s the smallest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              },
              {
                text:
                  "4.2.2 What’s the largest number of J-Values in one signal?",
                tier: "tertiary",
                unlocks: []
              }
            ]
          }
        ]
      }
    ],
    suspects: [
      { name: "expert-suspect-1", image: "images/expert-suspect1-front.png" },
      { name: "expert-suspect-2", image: "images/expert-suspect2-front.png" },
      { name: "expert-suspect-3", image: "images/expert-suspect3-front.png" },
      { name: "expert-suspect-4", image: "images/expert-suspect4-front.png" },
      { name: "expert-suspect-5", image: "images/expert-suspect5-front.png" },
      { name: "expert-suspect-6", image: "images/expert-suspect6-front.png" },
      { name: "expert-suspect-7", image: "images/expert-suspect7-front.png" },
      { name: "expert-suspect-8", image: "images/expert-suspect8-front.png" }
    ]
  }
};
const clueTemplates = {
  easy: {
    "1. How many signals are there?": {
      type: "count",
      values: [3, 2, 1, 2, 3, 4, 1, 2],
      template: "1. There {isAre} {n} signal{s} in total."
    },
    "2. What’s the total integration of all signals?": {
      type: "count",
      values: [6, 8, 6, 10, 8, 9, 3, 4],
      template: "2. The total integration of all signal{s} is {n}."
    },
    "3a. How many signals have chemical shift<6 ppm?": {
      type: "count",
      values: [3, 2, 1, 1, 3, 4, 0, 1],
      template: "3a. {n} signal{s} {hasHave} chemical shift<6 ppm."
    },
    "3b. How many signals have 6 ppm<chemical shift<9 ppm?": {
      type: "count",
      values: [0, 0, 0, 1, 0, 0, 0, 0],
      template: "3b. {n} signal{s} {hasHave} 6 ppm<chemical shift<9 ppm."
    },
    "3c. How many signals have 9 ppm<chemical shift?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 1, 1],
      template: "3c. {n} signal{s} {hasHave} 9 ppm<chemical shift."
    },
    "4a. What’s the lowest multiplicity in one signal?": {
      type: "count",
      values: [1, 3, 1, 1, 1, 3, 1, 1],
      template: "4a. The lowest multiplicity in one signal is {n}."
    },
    "4b. What’s the highest multiplicity in one signal?": {
      type: "count",
      values: [4, 7, 1, 1, 4, 12, 1, 1],
      template: "4b. The highest multiplicity in one signal is {n}."
    },
    "1.1. How many singlets are there?": {
      type: "count",
      values: [1, 0, 1, 2, 1, 0, 1, 2],
      template: "1.1. There {isAre} {n} singlet{s}."
    },
    "1.2. How many doublets are there?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "1.2. There {isAre} {n} doublet{s}."
    },
    "1.3. How many triplets are there?": {
      type: "count",
      values: [1, 1, 0, 0, 1, 2, 0, 0],
      template: "1.3. There {isAre} {n} triplet{s}."
    },
    "1.4. How many signals with higher than triplet multiplicity are there?": {
      type: "count",
      values: [1, 1, 0, 0, 1, 2, 0, 0],
      template:
        "1.4. There {isAre} {n} signal{s} with higher than triplet multiplicity."
    },
    "2.1a. What’s the smallest integration of any one signal?": {
      type: "count",
      values: [1, 2, 6, 1, 2, 2, 3, 1],
      template: "2.1a. The smallest integration of any one signal is {n}. "
    },
    "2.1b. What’s the largest integration of any one signal?": {
      type: "count",
      values: [3, 6, 6, 9, 3, 3, 3, 3],
      template: "2.1b. The largest integration of any one signal is {n}. "
    },
    "2.1c. How many different integration values are there?": {
      type: "count",
      values: [3, 2, 1, 2, 2, 2, 1, 2],
      template: "2.1c. There {isAre} {n} different integration value{s}."
    },
    "3.1a. What’s the lowest chemical shift of any signal?": {
      type: "count",
      values: [1.2, 0.9, 2.2, 1.4, 1.3, 0.9, 9.2, 2.1],
      template: "3.1a. The lowest chemical shift of any signal is {n} ppm."
    },
    "3.1b. What’s the highest chemical shift of any signal?": {
      type: "count",
      values: [4.7, 1.3, 2.2, 8.1, 4.1, 3.6, 9.2, 11.0],
      template: "3.1b. The highest chemical shift of any signal is {n} ppm."
    },
    "4.1. How many signals have only 1 J-value?": {
      type: "count",
      values: [2, 2, 0, 0, 2, 2, 0, 0],
      template: "4.1. {n} signal{s} {hasHave} only 1 J-value."
    },
    "4.2. How many signals have more than 1 J-values?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 2, 0, 0],
      template: "4.2. {n} signal{s} {hasHave} more than 1 J-values."
    },
    "2.1.1 How many signals have the smallest integration value?": {
      type: "count",
      values: [1, 1, 1, 1, 1, 3, 1, 1],
      template: "2.1.1 {n} signal{s} {hasHave} the smallest integration value."
    },
    "2.1.2 How many signals have the largest integration value?": {
      type: "count",
      values: [1, 1, 1, 1, 2, 1, 1, 1],
      template: "2.1.2 {n} signal{s} {hasHave} the largest integration value."
    },
    "3.1.1. How many signals have chemical shift<2 ppm?": {
      type: "count",
      values: [1, 2, 0, 1, 1, 3, 0, 0],
      template: "3.1.1. {n} signal{s} {hasHave} chemical shift<2 ppm."
    },
    "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?": {
      type: "count",
      values: [0, 0, 1, 0, 1, 0, 0, 1],
      template: "3.1.2. {n} signal{s} {hasHave} 2 ppm<chemical shift<3 ppm."
    },
    "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?": {
      type: "count",
      values: [1, 0, 0, 0, 0, 1, 0, 0],
      template: "3.1.3. {n} signal{s} {hasHave} 3 ppm<chemical shift<4 ppm."
    },
    "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 1, 0, 0, 0],
      template: "3.1.4. {n} signal{s} {hasHave} 4 ppm<chemical shift<5 ppm."
    },
    "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.5. {n} signal{s} {hasHave} 5 ppm<chemical shift<6 ppm."
    },
    "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.6. {n} signal{s} {hasHave} 6 ppm<chemical shift<7 ppm."
    },
    "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.7. {n} signal{s} {hasHave} 7 ppm<chemical shift<8 ppm."
    },
    "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?": {
      type: "count",
      values: [0, 0, 0, 1, 0, 0, 0, 0],
      template: "3.1.8. {n} signal{s} {hasHave} 8 ppm<chemical shift<9 ppm."
    },
    "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 1, 0],
      template: "3.1.9. {n} signal{s} {hasHave} 9 ppm<chemical shift<10 ppm."
    },
    "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.10. {n} signal{s} {hasHave} 10 ppm<chemical shift<11 ppm."
    },
    "3.1.11. How many signals have 11 ppm<chemical shift?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 1],
      template: "3.1.11. {n} signal{s} {hasHave} 11 ppm<chemical shift."
    },
    "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?": {
      type: "count",
      values: [3, 3, 1, 1, 3, 3, 1, 1],
      template:
        "4.1.1 The lowest order of multiplicity for coupling to proton{s} in one environment in one signal is {n}."
    },
    "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?": {
      type: "count",
      values: [4, 7, 1, 1, 4, 4, 1, 1],
      template:
        "4.1.2 The highest order of multiplicity for coupling to proton{s} in one environment in one signal is {n}."
    },
    "4.2.1 What’s the smallest number of J-Values in one signal?": {
      type: "count",
      values: [0, 1, 0, 0, 0, 1, 0, 0],
      template: "4.2.1 The smallest number of J-Values in one signal is {n}."
    },
    "4.2.2 What’s the largest number of J-Values in one signal?": {
      type: "count",
      values: [1, 1, 0, 0, 1, 2, 0, 0],
      template: "4.2.2 The largest number of J-Values in one signal is {n}."
    }
  },
  normal: {
    "1. How many signals are there?": {
      type: "count",
      values: [4, 3, 1, 2, 3, 3, 4, 3],
      template: "1. There {isAre} {n} signal{s} in total."
    },
    "2. What’s the total integration of all signals?": {
      type: "count",
      values: [10, 7, 8, 10, 8, 10, 8, 8],
      template: "2. The total integration of all signal{s} is {n}."
    },
    "3a. How many signals have chemical shift<6 ppm?": {
      type: "count",
      values: [1, 3, 1, 1, 3, 1, 4, 3],
      template: "3a. {n} signal{s} {hasHave} chemical shift<6 ppm."
    },
    "3b. How many signals have 6 ppm<chemical shift<9 ppm?": {
      type: "count",
      values: [3, 0, 0, 1, 0, 2, 0, 0],
      template: "3b. {n} signal{s} {hasHave} 6 ppm<chemical shift<9 ppm."
    },
    "3c. How many signals have 9 ppm<chemical shift?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3c. {n} signal{s} {hasHave} 9 ppm<chemical shift."
    },
    "4a. What’s the lowest multiplicity in one signal?": {
      type: "count",
      values: [1, 1, 1, 1, 1, 1, 1, 1],
      template: "4a. The lowest multiplicity in one signal is {n}."
    },
    "4b. What’s the highest multiplicity in one signal?": {
      type: "count",
      values: [3, 4, 1, 1, 4, 2, 6, 5],
      template: "4b. The highest multiplicity in one signal is {n}."
    },
    "1.1. How many singlets are there?": {
      type: "count",
      values: [2, 1, 1, 2, 1, 1, 1, 1],
      template: "1.1. There {isAre} {n} singlet{s}."
    },
    "1.2. How many doublets are there?": {
      type: "count",
      values: [1, 0, 0, 0, 0, 2, 0, 0],
      template: "1.2. There {isAre} {n} doublet{s}."
    },
    "1.3. How many triplets are there?": {
      type: "count",
      values: [1, 1, 0, 0, 1, 0, 2, 1],
      template: "1.3. There {isAre} {n} triplet{s}."
    },
    "1.4. How many signals with higher than triplet multiplicity are there?": {
      type: "count",
      values: [0, 1, 0, 0, 1, 0, 1, 1],
      template:
        "1.4. There {isAre} {n} signal{s} with higher than triplet multiplicity."
    },
    "2.1a. What’s the smallest integration of any one signal?": {
      type: "count",
      values: [1, 2, 8, 4, 2, 2, 1, 2],
      template: "2.1a. The smallest integration of any one signal is {n}. "
    },
    "2.1b. What’s the largest integration of any one signal?": {
      type: "count",
      values: [6, 3, 8, 6, 3, 6, 3, 4],
      template: "2.1b. The largest integration of any one signal is {n}. "
    },
    "2.1c. How many different integration values are there?": {
      type: "count",
      values: [3, 2, 1, 2, 2, 2, 3, 2],
      template: "2.1c. There {isAre} {n} different integration value{s}."
    },
    "3.1a. What’s the lowest chemical shift of any signal?": {
      type: "count",
      values: [2.3, 1.2, 3.7, 2.2, 1.2, 2.2, 2.2, 1.7],
      template: "3.1a. The lowest chemical shift of any signal is {n} ppm."
    },
    "3.1b. What’s the highest chemical shift of any signal?": {
      type: "count",
      values: [7.4, 4.3, 3.7, 7.0, 3.6, 7.2, 3.9, 4.7],
      template: "3.1b. The highest chemical shift of any signal is {n} ppm."
    },
    "4.1. How many signals have only 1 J-value?": {
      type: "count",
      values: [2, 2, 0, 0, 2, 2, 2, 2],
      template: "4.1. {n} signal{s} {hasHave} only 1 J-value."
    },
    "4.2. How many signals have more than 1 J-values?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 1, 0],
      template: "4.2. {n} signal{s} {hasHave} more than 1 J-values."
    },
    "2.1.1 How many signals have the smallest integration value?": {
      type: "count",
      values: [2, 2, 1, 1, 1, 2, 1, 2],
      template: "2.1.1 {n} signal{s} {hasHave} the smallest integration value."
    },
    "2.1.2 How many signals have the largest integration value?": {
      type: "count",
      values: [1, 1, 1, 1, 2, 1, 1, 1],
      template: "2.1.2 {n} signal{s} {hasHave} the largest integration value."
    },
    "3.1.1. How many signals have chemical shift<2 ppm?": {
      type: "count",
      values: [0, 1, 0, 0, 1, 0, 0, 1],
      template: "3.1.1. {n} signal{s} {hasHave} chemical shift<2 ppm."
    },
    "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?": {
      type: "count",
      values: [1, 0, 0, 1, 1, 1, 2, 0],
      template: "3.1.2. {n} signal{s} {hasHave} 2 ppm<chemical shift<3 ppm."
    },
    "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?": {
      type: "count",
      values: [0, 0, 1, 0, 1, 0, 2, 1],
      template: "3.1.3. {n} signal{s} {hasHave} 3 ppm<chemical shift<4 ppm."
    },
    "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?": {
      type: "count",
      values: [0, 2, 0, 0, 0, 0, 0, 1],
      template: "3.1.4. {n} signal{s} {hasHave} 4 ppm<chemical shift<5 ppm."
    },
    "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.5. {n} signal{s} {hasHave} 5 ppm<chemical shift<6 ppm."
    },
    "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?": {
      type: "count",
      values: [1, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.6. {n} signal{s} {hasHave} 6 ppm<chemical shift<7 ppm."
    },
    "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?": {
      type: "count",
      values: [2, 0, 0, 1, 0, 2, 0, 0],
      template: "3.1.7. {n} signal{s} {hasHave} 7 ppm<chemical shift<8 ppm."
    },
    "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.8. {n} signal{s} {hasHave} 8 ppm<chemical shift<9 ppm."
    },
    "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.9. {n} signal{s} {hasHave} 9 ppm<chemical shift<10 ppm."
    },
    "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.10. {n} signal{s} {hasHave} 10 ppm<chemical shift<11 ppm."
    },
    "3.1.11. How many signals have 11 ppm<chemical shift?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.11. {n} signal{s} {hasHave} 11 ppm<chemical shift."
    },
    "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?": {
      type: "count",
      values: [2, 3, 1, 1, 3, 2, 2, 3],
      template:
        "4.1.1 The lowest order of multiplicity for coupling to proton{s} in one environment in one signal is {n}."
    },
    "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?": {
      type: "count",
      values: [3, 4, 1, 1, 4, 2, 3, 5],
      template:
        "4.1.2 The highest order of multiplicity for coupling to proton{s} in one environment in one signal is {n}."
    },
    "4.2.1 What’s the smallest number of J-Values in one signal?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "4.2.1 The smallest number of J-Values in one signal is {n}."
    },
    "4.2.2 What’s the largest number of J-Values in one signal?": {
      type: "count",
      values: [1, 1, 0, 0, 1, 1, 2, 1],
      template: "4.2.2 The largest number of J-Values in one signal is {n}."
    }
  },
  hard: {
    "1. How many signals are there?": {
      type: "count",
      values: [3, 3, 3, 3, 4, 3, 4, 3],
      template: "1. There {isAre} {n} signal{s} in total."
    },
    "2. What’s the total integration of all signals?": {
      type: "count",
      values: [8, 4, 10, 3, 8, 17, 13, 14],
      template: "2. The total integration of all signal{s} is {n}."
    },
    "3a. How many signals have chemical shift<6 ppm?": {
      type: "count",
      values: [2, 1, 3, 0, 1, 3, 2, 3],
      template: "3a. {n} signal{s} {hasHave} chemical shift<6 ppm."
    },
    "3b. How many signals have 6 ppm<chemical shift<9 ppm?": {
      type: "count",
      values: [0, 2, 0, 3, 2, 0, 2, 0],
      template: "3b. {n} signal{s} {hasHave} 6 ppm<chemical shift<9 ppm."
    },
    "3c. How many signals have 9 ppm<chemical shift?": {
      type: "count",
      values: [1, 0, 0, 0, 1, 0, 0, 0],
      template: "3c. {n} signal{s} {hasHave} 9 ppm<chemical shift."
    },
    "4a. What’s the lowest multiplicity in one signal?": {
      type: "count",
      values: [1, 1, 7, 1, 1, 1, 1, 1],
      template: "4a. The lowest multiplicity in one signal is {n}."
    },
    "4b. What’s the highest multiplicity in one signal?": {
      type: "count",
      values: [7, 2, 1, 2, 2, 1, 2, 4],
      template: "4b. The highest multiplicity in one signal is {n}."
    },
    "1.1. How many singlets are there?": {
      type: "count",
      values: [1, 1, 1, 1, 2, 3, 2, 1],
      template: "1.1. There {isAre} {n} singlet{s}."
    },
    "1.2. How many doublets are there?": {
      type: "count",
      values: [1, 2, 1, 2, 2, 0, 2, 0],
      template: "1.2. There {isAre} {n} doublet{s}."
    },
    "1.3. How many triplets are there?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 1],
      template: "1.3. There {isAre} {n} triplet{s}."
    },
    "1.4. How many signals with higher than triplet multiplicity are there?": {
      type: "count",
      values: [1, 0, 1, 0, 0, 0, 0, 1],
      template:
        "1.4. There {isAre} {n} signal{s} with higher than triplet multiplicity."
    },
    "2.1a. What’s the smallest integration of any one signal?": {
      type: "count",
      values: [1, 2, 1, 1, 1, 1, 2, 2],
      template: "2.1a. The smallest integration of any one signal is {n}. "
    },
    "2.1b. What’s the largest integration of any one signal?": {
      type: "count",
      values: [6, 2, 6, 1, 3, 12, 6, 9],
      template: "2.1b. The largest integration of any one signal is {n}. "
    },
    "2.1c. How many different integration values are there?": {
      type: "count",
      values: [2, 1, 3, 1, 3, 3, 3, 3],
      template: "2.1c. There {isAre} {n} different integration value{s}."
    },
    "3.1a. What’s the lowest chemical shift of any signal?": {
      type: "count",
      values: [1.1, 5.5, 1.0, 7.6, 2.4, 1.1, 2.3, 1.2],
      template: "3.1a. The lowest chemical shift of any signal is {n} ppm."
    },
    "3.1b. What’s the highest chemical shift of any signal?": {
      type: "count",
      values: [10.7, 7.1, 2.6, 8.2, 12.7, 2.5, 7.0, 4.2],
      template: "3.1b. The highest chemical shift of any signal is {n} ppm."
    },
    "4.1. How many signals have only 1 J-value?": {
      type: "count",
      values: [2, 2, 2, 2, 2, 0, 2, 2],
      template: "4.1. {n} signal{s} {hasHave} only 1 J-value."
    },
    "4.2. How many signals have more than 1 J-values?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "4.2. {n} signal{s} {hasHave} more than 1 J-values."
    },
    "2.1.1 How many signals have the smallest integration value?": {
      type: "count",
      values: [2, 3, 1, 3, 1, 1, 2, 1],
      template: "2.1.1 {n} signal{s} {hasHave} the smallest integration value."
    },
    "2.1.2 How many signals have the largest integration value?": {
      type: "count",
      values: [1, 3, 1, 3, 1, 1, 1, 1],
      template: "2.1.2 {n} signal{s} {hasHave} the largest integration value."
    },
    "3.1.1. How many signals have chemical shift<2 ppm?": {
      type: "count",
      values: [1, 0, 2, 0, 0, 2, 0, 2],
      template: "3.1.1. {n} signal{s} {hasHave} chemical shift<2 ppm."
    },
    "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?": {
      type: "count",
      values: [1, 0, 1, 0, 1, 1, 1, 0],
      template: "3.1.2. {n} signal{s} {hasHave} 2 ppm<chemical shift<3 ppm."
    },
    "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 1, 0],
      template: "3.1.3. {n} signal{s} {hasHave} 3 ppm<chemical shift<4 ppm."
    },
    "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 1],
      template: "3.1.4. {n} signal{s} {hasHave} 4 ppm<chemical shift<5 ppm."
    },
    "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?": {
      type: "count",
      values: [0, 1, 0, 0, 0, 0, 0, 0],
      template: "3.1.5. {n} signal{s} {hasHave} 5 ppm<chemical shift<6 ppm."
    },
    "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?": {
      type: "count",
      values: [0, 1, 0, 0, 0, 0, 0, 0],
      template: "3.1.6. {n} signal{s} {hasHave} 6 ppm<chemical shift<7 ppm."
    },
    "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?": {
      type: "count",
      values: [0, 1, 0, 2, 1, 0, 0, 0],
      template: "3.1.7. {n} signal{s} {hasHave} 7 ppm<chemical shift<8 ppm."
    },
    "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?": {
      type: "count",
      values: [0, 0, 0, 1, 1, 0, 0, 0],
      template: "3.1.8. {n} signal{s} {hasHave} 8 ppm<chemical shift<9 ppm."
    },
    "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.9. {n} signal{s} {hasHave} 9 ppm<chemical shift<10 ppm."
    },
    "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?": {
      type: "count",
      values: [1, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.10. {n} signal{s} {hasHave} 10 ppm<chemical shift<11 ppm."
    },
    "3.1.11. How many signals have 11 ppm<chemical shift?": {
      type: "count",
      values: [0, 0, 0, 0, 1, 0, 0, 0],
      template: "3.1.11. {n} signal{s} {hasHave} 11 ppm<chemical shift."
    },
    "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?": {
      type: "count",
      values: [2, 2, 2, 2, 2, 1, 2, 3],
      template:
        "4.1.1 The lowest order of multiplicity for coupling to proton{s} in one environment in one signal is {n}."
    },
    "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?": {
      type: "count",
      values: [7, 2, 7, 2, 2, 1, 2, 4],
      template:
        "4.1.2 The highest order of multiplicity for coupling to proton{s} in one environment in one signal is {n}."
    },
    "4.2.1 What’s the smallest number of J-Values in one signal?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "4.2.1 The smallest number of J-Values in one signal is {n}."
    },
    "4.2.2 What’s the largest number of J-Values in one signal?": {
      type: "count",
      values: [1, 1, 1, 1, 1, 0, 1, 1],
      template: "4.2.2 The largest number of J-Values in one signal is {n}."
    }
  },
  expert: {
    "1. How many signals are there?": {
      type: "count",
      values: [5, 5, 4, 2, 4, 5, 5, 4],
      template: "1. There {isAre} {n} signal{s} in total."
    },
    "2. What’s the total integration of all signals?": {
      type: "count",
      values: [8, 9, 7, 7, 9, 11, 10, 8],
      template: "2. The total integration of all signal{s} is {n}."
    },
    "3a. How many signals have chemical shift<6 ppm?": {
      type: "count",
      values: [5, 4, 3, 2, 2, 3, 5, 4],
      template: "3a. {n} signal{s} {hasHave} chemical shift<6 ppm."
    },
    "3b. How many signals have 6 ppm<chemical shift<9 ppm?": {
      type: "count",
      values: [0, 1, 1, 0, 2, 2, 0, 0],
      template: "3b. {n} signal{s} {hasHave} 6 ppm<chemical shift<9 ppm."
    },
    "3c. How many signals have 9 ppm<chemical shift?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3c. {n} signal{s} {hasHave} 9 ppm<chemical shift."
    },
    "4a. What’s the lowest multiplicity in one signal?": {
      type: "count",
      values: [3, 3, 3, 4, 1, 1, 2, 3],
      template: "4a. The lowest multiplicity in one signal is {n}."
    },
    "4b. What’s the highest multiplicity in one signal?": {
      type: "count",
      values: [12, 6, 4, 14, 2, 4, 9, 9],
      template: "4b. The highest multiplicity in one signal is {n}."
    },
    "1.1. How many singlets are there?": {
      type: "count",
      values: [0, 0, 0, 0, 1, 1, 0, 0],
      template: "1.1. There {isAre} {n} singlet{s}."
    },
    "1.2. How many doublets are there?": {
      type: "count",
      values: [0, 0, 0, 0, 3, 2, 1, 0],
      template: "1.2. There {isAre} {n} doublet{s}."
    },
    "1.3. How many triplets are there?": {
      type: "count",
      values: [1, 2, 1, 0, 0, 1, 2, 1],
      template: "1.3. There {isAre} {n} triplet{s}."
    },
    "1.4. How many signals with higher than triplet multiplicity are there?": {
      type: "count",
      values: [4, 3, 3, 2, 0, 1, 2, 3],
      template:
        "1.4. There {isAre} {n} signal{s} with higher than triplet multiplicity."
    },
    "2.1a. What’s the smallest integration of any one signal?": {
      type: "count",
      values: [1, 1, 1, 1, 2, 2, 1, 1],
      template: "2.1a. The smallest integration of any one signal is {n}. "
    },
    "2.1b. What’s the largest integration of any one signal?": {
      type: "count",
      values: [3, 3, 3, 6, 3, 3, 3, 3],
      template: "2.1b. The largest integration of any one signal is {n}. "
    },
    "2.1c. How many different integration values are there?": {
      type: "count",
      values: [3, 3, 3, 2, 2, 2, 3, 3],
      template: "2.1c. There {isAre} {n} different integration value{s}."
    },
    "3.1a. What’s the lowest chemical shift of any signal?": {
      type: "count",
      values: [0.8, 1.7, 1.2, 1.1, 2.2, 1.3, 1.6, 1.1],
      template: "3.1a. The lowest chemical shift of any signal is {n} ppm."
    },
    "3.1b. What’s the highest chemical shift of any signal?": {
      type: "count",
      values: [5.8, 7.4, 7.4, 3.1, 7.3, 7.7, 5.6, 5.4],
      template: "3.1b. The highest chemical shift of any signal is {n} ppm."
    },
    "4.1. How many signals have only 1 J-value?": {
      type: "count",
      values: [1, 2, 2, 0, 3, 4, 4, 2],
      template: "4.1. {n} signal{s} {hasHave} only 1 J-value."
    },
    "4.2. How many signals have more than 1 J-values?": {
      type: "count",
      values: [4, 3, 2, 2, 0, 0, 1, 2],
      template: "4.2. {n} signal{s} {hasHave} more than 1 J-values."
    },
    "2.1.1 How many signals have the smallest integration value?": {
      type: "count",
      values: [3, 2, 2, 1, 3, 4, 1, 1],
      template: "2.1.1 {n} signal{s} {hasHave} the smallest integration value."
    },
    "2.1.2 How many signals have the largest integration value?": {
      type: "count",
      values: [1, 1, 1, 1, 1, 1, 1, 1],
      template: "2.1.2 {n} signal{s} {hasHave} the largest integration value."
    },
    "3.1.1. How many signals have chemical shift<2 ppm?": {
      type: "count",
      values: [1, 1, 1, 1, 0, 1, 2, 1],
      template: "3.1.1. {n} signal{s} {hasHave} chemical shift<2 ppm."
    },
    "3.1.2. How many signals have 2 ppm<chemical shift<3 ppm?": {
      type: "count",
      values: [1, 0, 0, 0, 1, 0, 0, 2],
      template: "3.1.2. {n} signal{s} {hasHave} 2 ppm<chemical shift<3 ppm."
    },
    "3.1.3. How many signals have 3 ppm<chemical shift<4 ppm?": {
      type: "count",
      values: [0, 0, 0, 1, 0, 0, 1, 0],
      template: "3.1.3. {n} signal{s} {hasHave} 3 ppm<chemical shift<4 ppm."
    },
    "3.1.4. How many signals have 4 ppm<chemical shift<5 ppm?": {
      type: "count",
      values: [1, 1, 1, 0, 0, 1, 0, 0],
      template: "3.1.4. {n} signal{s} {hasHave} 4 ppm<chemical shift<5 ppm."
    },
    "3.1.5. How many signals have 5 ppm<chemical shift<6 ppm?": {
      type: "count",
      values: [2, 0, 2, 0, 1, 1, 1, 1],
      template: "3.1.5. {n} signal{s} {hasHave} 5 ppm<chemical shift<6 ppm."
    },
    "3.1.6. How many signals have 6 ppm<chemical shift<7 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 1, 0, 0],
      template: "3.1.6. {n} signal{s} {hasHave} 6 ppm<chemical shift<7 ppm."
    },
    "3.1.7. How many signals have 7 ppm<chemical shift<8 ppm?": {
      type: "count",
      values: [0, 3, 1, 0, 2, 1, 0, 0],
      template: "3.1.7. {n} signal{s} {hasHave} 7 ppm<chemical shift<8 ppm."
    },
    "3.1.8. How many signals have 8 ppm<chemical shift<9 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.8. {n} signal{s} {hasHave} 8 ppm<chemical shift<9 ppm."
    },
    "3.1.9. How many signals have 9 ppm<chemical shift<10 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.9. {n} signal{s} {hasHave} 9 ppm<chemical shift<10 ppm."
    },
    "3.1.10. How many signals have 10 ppm<chemical shift<11 ppm?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.10. {n} signal{s} {hasHave} 10 ppm<chemical shift<11 ppm."
    },
    "3.1.11. How many signals have 11 ppm<chemical shift?": {
      type: "count",
      values: [0, 0, 0, 0, 0, 0, 0, 0],
      template: "3.1.11. {n} signal{s} {hasHave} 11 ppm<chemical shift."
    },
    "4.1.1 What’s the lowest order of multiplicity for coupling to proton(s) in one environment in one signal?": {
      type: "count",
      values: [2, 2, 2, 2, 2, 2, 2, 2],
      template:
        "4.1.1 The lowest order of multiplicity for coupling to proton{s} in one environment in one signal is {n}."
    },
    "4.1.2 What’s the highest order of multiplicity for coupling to proton(s) in one environment in one signal?": {
      type: "count",
      values: [4, 4, 4, 7, 2, 4, 4, 4],
      template:
        "4.1.2 The highest order of multiplicity for coupling to proton{s} in one environment in one signal is {n}."
    },
    "4.2.1 What’s the smallest number of J-Values in one signal?": {
      type: "count",
      values: [1, 1, 1, 2, 0, 0, 1, 1],
      template: "4.2.1 The smallest number of J-Values in one signal is {n}."
    },
    "4.2.2 What’s the largest number of J-Values in one signal?": {
      type: "count",
      values: [3, 2, 2, 2, 1, 1, 2, 2],
      template: "4.2.2 The largest number of J-Values in one signal is {n}."
    }
  }
};
const starRequirements = {
  easy: {
    maxTime: 180, // 3 minutes
    maxQuestions: 3,
    attempts: 3
  },
  normal: {
    maxTime: 240, // 4 minutes
    maxQuestions: 4,
    attempts: 2
  },
  hard: {
    maxTime: 300, // 5 minutes
    maxQuestions: 5,
    attempts: 2
  },
  expert: {
    maxTime: 360, // 6 minutes
    maxQuestions: 6,
    attempts: 1
  }
};

// for future expansion

// --- Game State ---
let playerNickname = "";
let availableQuestions = [];
let currentQuestions = [];
let currentSuspects = [];
let clues = [];
let questionsAsked = 0;
let gameOver = false;
let startTime = Date.now();
let correctSuspectIndex = Math.floor(Math.random() * currentSuspects.length);
let questionSequence = [];
let gameResult = "";
let starsEarned = 0;
let attempts = 3;
let checkedSuspects = new Array(currentSuspects.length).fill(false);
let disabledSuspects = new Array(currentSuspects.length).fill(false);
let difficulty = "easy";
let leaderboardData = {};
let leaderboardDifficulties = [];
let currentLeaderboardIndex = 0;
let tutorialPages = [
  "images/tutorial-1.png",
  "images/tutorial-2.png",
  "images/tutorial-3.png",
  "images/tutorial-4.png",
  "images/tutorial-5.png"
];
let currentTutorialIndex = 0;

// --- UI Elements ---
const questionsDiv = document.getElementById("questions");
const answersDiv = document.getElementById("suspects-grid");
const cluesDiv = document.getElementById("clues");
const scoreDiv = document.getElementById("score");
const timerDiv = document.getElementById("timer");
const attemptsDiv = document.getElementById("attempts");
const replayBtn = document.getElementById("replay-btn");

// --- Helper: Add Questions to Available If Not Already There ---
function addQuestionsToAvailable(unlocks) {
  unlocks.forEach((q) => {
    if (!availableQuestions.some((existing) => existing.text === q.text)) {
      availableQuestions.push(q);
    }
  });
}

// --- Render Questions ---
function renderQuestions() {
  questionsDiv.innerHTML = "";
  availableQuestions.forEach((qObj) => {
    const btn = document.createElement("button");
    const unlockCount = qObj.unlocks ? qObj.unlocks.length : 0;
    const stars = unlockCount > 0 ? "✦".repeat(unlockCount) + " " : "";
    btn.textContent = stars + qObj.text;
    btn.className = "question-btn";
    // Add a class for the tier
    if (qObj.tier === "primary") btn.classList.add("primary");
    if (qObj.tier === "secondary") btn.classList.add("secondary");
    if (qObj.tier === "tertiary") btn.classList.add("tertiary");

    btn.onclick = () => askQuestion(qObj, btn);
    questionsDiv.appendChild(btn);
  });
}

// --- Render Suspects ---
function renderSuspects() {
  answersDiv.innerHTML = "";

  currentSuspects.forEach((suspect, idx) => {
    const isDisabled = disabledSuspects[idx];
    const isChecked = checkedSuspects[idx];
    const shouldFlip = isDisabled || isChecked;

    const wrapper = document.createElement("div");
    wrapper.className = "suspect-card-wrapper";

    const cardButton = document.createElement("button");
    cardButton.className = "suspect-card";

    if (shouldFlip) {
      cardButton.classList.add("flipped");
    }

    if (isDisabled || isChecked) {
      cardButton.disabled = true;
    } else {
      cardButton.onclick = () => guessSuspect(idx, cardButton);
    }

    const inner = document.createElement("div");
    inner.className = "suspect-card-inner";

    const front = document.createElement("div");
    front.className = "suspect-face suspect-front";

    const frontImg = document.createElement("img");
    frontImg.src = suspect.image;
    frontImg.alt = suspect.name;
    front.appendChild(frontImg);

    const back = document.createElement("div");
    back.className = "suspect-face suspect-back";

    const backImg = document.createElement("img");

    const cardBackImages = {
      easy: "images/card-back-easy.png",
      normal: "images/card-back-normal.png",
      hard: "images/card-back-hard.png",
      expert: "images/card-back-expert.png"
    };

    backImg.src = cardBackImages[difficulty] || "images/card-back.png";
    backImg.alt = "Card back";
    back.appendChild(backImg);

    inner.appendChild(front);
    inner.appendChild(back);
    cardButton.appendChild(inner);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "suspect-checkbox";
    checkbox.checked = isChecked;

    /* Disable checkbox permanently if wrong guess */
    if (isDisabled) {
      checkbox.disabled = true;
    }

    checkbox.onchange = function () {
      if (disabledSuspects[idx]) return;

      checkedSuspects[idx] = checkbox.checked;

      const cardButton = document.querySelectorAll(".suspect-card")[idx];

      if (checkbox.checked) {
        cardButton.classList.add("flipped");
        cardButton.disabled = true;
      } else {
        cardButton.classList.remove("flipped");
        cardButton.disabled = false;
      }
    };

    wrapper.appendChild(cardButton);
    wrapper.appendChild(checkbox);
    answersDiv.appendChild(wrapper);
  });
}

// --- Ask Question Logic (Handles All Tiers) ---
function askQuestion(qObj, btn) {
  if (gameOver) return;
  questionsAsked++;
  questionSequence.push(qObj.text);

  // Generate and store clue
  let clue = getClue(qObj.text, correctSuspectIndex);
  clues.push({ question: qObj.text, clue: clue });

  // Show clue on button, turn grey
  btn.textContent = clue;
  btn.classList.add("greyed");
  btn.disabled = true;

  updateScore();
  updateClues();

  // After 1 second, unlock sub-questions and remove button from list and re-render questions
  setTimeout(() => {
    // Unlock sub-questions (if any)
    if (qObj.unlocks && qObj.unlocks.length > 0) {
      addQuestionsToAvailable(qObj.unlocks);
    }
    // Remove this question from availableQuestions
    availableQuestions = availableQuestions.filter((q) => q.text !== qObj.text);
    renderQuestions();
  }, 1000);
}

// --- Get Clue Logic (No suspect name revealed) ---
function getClue(questionText, suspectIdx) {
  if (!clueTemplates[difficulty]) {
    return `Clue: [invalid difficulty]`;
  }

  const difficultySet = clueTemplates[difficulty];

  const clueData = difficultySet[questionText];
  if (!clueData) return `Clue: [generic answer to "${questionText}"]`;

  // 🔥 CASE 1: Normal array (your current structure)
  if (Array.isArray(clueData)) {
    return `Clue: ${clueData[suspectIdx]}`;
  }

  // 🔥 CASE 2: Count template structure
  if (clueData.type === "count") {
    const n = clueData.values[suspectIdx];
    let sentence = clueData.template
      .replace("{n}", n)
      .replace("{isAre}", n === 1 ? "is" : "are")
      .replace("{hasHave}", n === 1 ? "has" : "have")
      .replace("{s}", n === 1 ? "" : "s");

    return `Clue: ${sentence}`;
  }

  return `Clue: [unknown clue format]`;
}

// --- Guess Suspect Logic ---
function guessSuspect(idx) {
  if (gameOver || attempts <= 0) return;

  let endTime = Date.now();

  const cardButton = document.querySelectorAll(".suspect-card")[idx];

  if (!cardButton) return;

  questionSequence.push(`GUESS:${currentSuspects[idx].name}`);

  if (idx === correctSuspectIndex) {
    attempts -= 1;
    gameOver = true;
    gameResult = "1";
    showEndScreen(true); // win
    sendGameData(); // or whatever you use to send results
  } else {
    attempts -= 1;
    // Add shake animation
    cardButton.classList.add("shake");

    setTimeout(() => {
      cardButton.classList.remove("shake");

      // 2️⃣ Flip smoothly (no re-render)
      cardButton.classList.add("flipped");
      cardButton.disabled = true;

      // 3️⃣ Disable checkbox
      const checkbox = document.querySelectorAll(".suspect-checkbox")[idx];
      if (checkbox) checkbox.disabled = true;
      disabledSuspects[idx] = true;
      updateAttempts();
    }, 400);
    if (attempts <= 0) {
      gameOver = true;
      gameResult = "0";
      showEndScreen(false); // lose
      sendGameData();
    } else {
      attemptsDiv.textContent = `Attempts left: ${attempts} Sorry, wrong suspect!`;
    }
  }
}

// --- Always-Visible Clues Logic ---
function updateClues() {
  cluesDiv.innerHTML = clues.map((c) => `<div>${c.clue}</div>`).join("");
}

// --- Update Score ---
function updateScore() {
  scoreDiv.textContent = `Questions asked: ${questionsAsked}`;
}

// --- Real-Time Timer ---
function updateTimer() {
  if (
    !gameOver &&
    document.getElementById("game-screen").style.display === "block"
  ) {
    let elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    timerDiv.textContent = `Timer: ${elapsed} s`;
  }
}
setInterval(updateTimer, 100);

// --- Update Attempts ---
function updateAttempts() {
  attemptsDiv.textContent = `Attempts left: ${attempts} Click any card to take a guess!`;
}

// --- Replay Button Logic ---
replayBtn.onclick = () => startGame();

// --- Game Setup ---
function startGame() {
  attempts = starRequirements[difficulty].attempts;
  clues = [];
  questionsAsked = 0;
  gameOver = false;
  startTime = Date.now();

  scoreDiv.textContent = "";
  timerDiv.textContent = "";
  attemptsDiv.textContent = "";
  cluesDiv.innerHTML = "";

  currentQuestions = gameData[difficulty].questions;
  currentSuspects = gameData[difficulty].suspects;

  // Only primary questions at start
  availableQuestions = currentQuestions.map((q) => ({
    ...q,
    unlocks: q.unlocks
  }));

  correctSuspectIndex = Math.floor(Math.random() * currentSuspects.length);

  checkedSuspects = Array(currentSuspects.length).fill(false);
  disabledSuspects = Array(currentSuspects.length).fill(false);
  questionSequence = [];

  renderQuestions();
  renderSuspects();
  updateClues();
  updateScore();
  updateAttempts();
}

// !!End Stars Screen!!
function showEndScreen(win) {
  // Calculate stars
  const settings = starRequirements[difficulty];
  const storedNickname = localStorage.getItem("nickname");

  starsEarned = 0;

  const timeTaken = (Date.now() - startTime) / 1000;

  if (timeTaken <= settings.maxTime) starsEarned += 1;
  if (questionsAsked <= settings.maxQuestions) starsEarned += 1;

  if (win) {
    starsEarned += 1;
  } else {
    starsEarned = 0;
  }

  // Display stars
  document.getElementById("end-stars").textContent =
    "⭐".repeat(starsEarned) + "☆".repeat(3 - starsEarned);

  // Summary
  document.getElementById("end-summary").innerHTML =
    (win
      ? `<b>Yay! Congratulations ${storedNickname}, you found the correct answer!</b>`
      : `<b>Sorry ${storedNickname}, you ran out of attempts :( </b>`) +
    `<br>Questions asked: <b>${questionsAsked}</b>` +
    `<br>Time taken: <b>${((Date.now() - startTime) / 1000).toFixed(1)}s</b>` +
    `<br>Attempts left: <b>${attempts}</b>`;

  // Show the end screen
  showScreen("end-screen");
  showCorrectSuspectImages();
}

// Send data at end of game
function sendGameData() {
  console.log("sendGameData called");

  const formData = new URLSearchParams();
  const maxAttempts = starRequirements[difficulty].attempts;
  const attemptsUsed = maxAttempts - attempts;

  formData.append("nickname", playerNickname);
  formData.append("score", questionsAsked);
  formData.append("timetaken", ((Date.now() - startTime) / 1000).toFixed(1));
  formData.append("question_sequence", questionSequence.join(" | "));
  formData.append("result", gameResult);
  formData.append("attempts_used", attemptsUsed);
  formData.append("stars", starsEarned);
  formData.append("difficulty", difficulty);

  fetch(
    "https://script.google.com/macros/s/AKfycby_usngx_rt-2sXS29tMLsnBdP6LR2EDLY1pAcAQtk6DogQwdIwu9aEhmNK-p0AoJJW/exec",
    {
      method: "POST",
      body: formData
    }
  )
    .then((res) => res.json())
    .then((resp) => console.log("Data sent:", resp))
    .catch((err) => console.error("Send error:", err));
}

// Fetch leaderboard data
function fetchLeaderboard(callback) {
  fetch(
    "https://script.google.com/macros/s/AKfycby_usngx_rt-2sXS29tMLsnBdP6LR2EDLY1pAcAQtk6DogQwdIwu9aEhmNK-p0AoJJW/exec"
  )
    .then((res) => res.json())
    .then((data) => callback(data));
}
const difficultyOrder = ["easy", "normal", "hard", "expert"];

function showLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");
  leaderboardDiv.innerHTML =
    "<div style='padding: 30px 0; font-size: 1.2em; color: #888;'>Loading...</div>";

  fetchLeaderboard(function (data) {
    if (!data || !data.length) {
      leaderboardDiv.innerHTML =
        "<div style='padding: 30px 0; font-size: 1.1em; color: #b00;'>No leaderboard data yet.</div>";
      return;
    }

    // 🔥 Group by difficulty
    leaderboardData = {};

    data.forEach((entry) => {
      const diff = entry.difficulty || "unknown";

      if (!leaderboardData[diff]) {
        leaderboardData[diff] = [];
      }

      leaderboardData[diff].push(entry);
    });

    // 🔥 Force proper order instead of Object.keys()
    leaderboardDifficulties = difficultyOrder.filter(
      (diff) => leaderboardData[diff]
    );

    if (!leaderboardDifficulties.length) {
      leaderboardDiv.innerHTML = "No difficulty data found.";
      return;
    }

    currentLeaderboardIndex = 0;

    renderCurrentLeaderboard();
  });
}

function renderCurrentLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");
  const label = document.getElementById("leaderboard-difficulty-label");

  const currentDifficulty = leaderboardDifficulties[currentLeaderboardIndex];
  label.textContent = currentDifficulty.toUpperCase();

  const entries = leaderboardData[currentDifficulty];

  if (!entries || !entries.length) {
    leaderboardDiv.innerHTML = "<div>No players in this difficulty yet.</div>";
    return;
  }
  // 🔥 Remove duplicate players (keep best one only)
  const bestPerPlayer = [];
  const seenPlayers = new Set();

  entries.forEach((entry) => {
    if (!seenPlayers.has(entry.nickname)) {
      seenPlayers.add(entry.nickname);
      bestPerPlayer.push(entry); // first occurrence = best (already sorted server-side)
    }
  });

  let html = "<ol>";

  bestPerPlayer.slice(0, 10).forEach((entry) => {
    const filled = "⭐".repeat(entry.stars);
    const empty = "☆".repeat(3 - entry.stars);
    const starsDisplay = filled + empty;

    html += `
      <li>
        <b>${entry.nickname}</b> 
        - ${starsDisplay} 
        - ${entry.score} questions 
        - ${entry.timetaken}s 
        - in ${entry.attempts_used} attempt(s)
      </li>`;
  });

  html += "</ol>";

  leaderboardDiv.innerHTML = html;
}

function showTutorial() {
  currentTutorialIndex = 0;
  showScreen("tutorial-screen"); // assuming you already use this
  renderTutorialPage();
}

function renderTutorialPage() {
  const img = document.getElementById("tutorial-image");
  const indicator = document.getElementById("tutorial-page-indicator");

  img.src = tutorialPages[currentTutorialIndex];

  indicator.textContent = `${currentTutorialIndex + 1} / ${
    tutorialPages.length
  }`;

  // Disable arrows at edges (optional but nice UX)
  document.getElementById("tutorial-prev").disabled =
    currentTutorialIndex === 0;

  document.getElementById("tutorial-next").disabled =
    currentTutorialIndex === tutorialPages.length - 1;
}

function showCorrectSuspectImages() {
  const correct = currentSuspects[correctSuspectIndex];

  const normalImg = document.getElementById("correct-normal-img");
  const caughtImg = document.getElementById("correct-caught-img");

  normalImg.src = correct.image;

  // Auto-generate caught image path
  caughtImg.src = correct.image.replace("-front", "-caught");

  normalImg.alt = correct.name;
  caughtImg.alt = correct.name + " caught";
}

function showDifficultyPopup(selectedDifficulty) {
  const settings = starRequirements[selectedDifficulty];

  const minutes = settings.maxTime / 60;

  document.getElementById("popup-title").textContent =
    selectedDifficulty.toUpperCase() + " Mode - Goals to 3 Star";

  document.getElementById("popup-requirements").innerHTML = `
    ⭐ Correctly identify the molecule<br>
    ⭐ Finish under <b>${minutes} minutes</b><br>
    ⭐ Ask no more than <b>${settings.maxQuestions} questions</b><br>
    you have <b>${settings.attempts} attempt(s)</b>!
  `;

  document.getElementById("difficulty-popup").style.display = "flex";

  document.getElementById("popup-start-btn").onclick = () => {
    difficulty = selectedDifficulty;
    document.getElementById("difficulty-popup").style.display = "none";
    showScreen("game-screen");
    startGame();
  };

  document.getElementById("popup-cancel-btn").onclick = () => {
    document.getElementById("difficulty-popup").style.display = "none";
  };
}

function preloadImages(imagePaths) {
  return Promise.all(
    imagePaths.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        img.onload = resolve;
        img.onerror = resolve; // prevent hanging
      });
    })
  );
}

function getAllGameImages() {
  const paths = [];

  Object.values(gameData).forEach((difficultyData) => {
    difficultyData.suspects.forEach((suspect) => {
      if (suspect.image) {
        paths.push(suspect.image);
      }

      if (suspect.caughtImage) {
        paths.push(suspect.caughtImage);
      } else if (suspect.image) {
        // Auto-generate caught version if you use that pattern
        paths.push(suspect.image.replace("-front", "-caught"));
      }
    });
  });

  // Card backs
  paths.push("images/card-back-easy.png");
  paths.push("images/card-back-normal.png");
  paths.push("images/card-back-hard.png");
  paths.push("images/card-back-expert.png");

  return paths.filter(Boolean);
}

window.addEventListener("load", async () => {
  // Show loading screen first
  showScreen("loading-screen");

  // Preload everything
  await preloadImages(getAllGameImages());

  // After everything is cached, show mode selection
  showScreen("title-screen");
});