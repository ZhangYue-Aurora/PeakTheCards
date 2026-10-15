// --- Local Storage Shit ---
let storedNickname = localStorage.getItem("nickname");

// --- Pregame States ---
let isReturningUser = false;

// --- Screen Switching Utility (hides all screens then shows the screen called in the function) ---
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

// window event listener: preload all images on page load
window.addEventListener("load", async () => {
  // Show loading screen first
  document.getElementById("title-screen").style.display = "none";  
  document.getElementById("greeting-screen").style.display = "none";
  showScreen("loading-screen");

  // Preload everything
  await preloadImages(getAllGameImages());

  // After everything is cached, show mode selection
  showScreen("title-screen");
  sendVisitorData();
});

//
//
// --- All Button Event Listeners ---
// Title Screen Buttons
document.getElementById("start-btn").onclick = function () {
  document.getElementById("title-screen").style.display = "none";
  const greetingDiv = document.getElementById("greeting-message");

  if (storedNickname) {
    isReturningUser = true;
    // Show greeting, hide nickname screen
    showScreen("greeting-screen");
    // Show the continue button
    greetingDiv.innerHTML = `<b>Welcome back, ${storedNickname}!</b><br>`;
  } else {
    isReturningUser = false;
    // Show nickname input screen
    showScreen("nickname-screen");
  }
};

// Nickname Screen Buttons
document.getElementById("nickname-submit-btn").onclick = function () {
  const nicknameInput = document.getElementById("nickname-input");
  const greetingDiv = document.getElementById("greeting-message");
  const nickname = nicknameInput.value.trim();
  if (!nickname) {
    alert("Please enter your nickname!");
    return;
  }
  localStorage.setItem("nickname", nickname);
  isReturningUser = false;
  storedNickname = nickname;
  showScreen("greeting-screen");
  greetingDiv.innerHTML = `<b>Welcome, ${nickname}!</b><br>`;
  // Proceed to next screen if you want, e.g. showScreen('mode-screen');
};
document.getElementById("nickname-to-title-btn").onclick = () =>
  showScreen("title-screen");

// Greeting Screen Buttons
document.getElementById("greeting-continue-btn").onclick = () => {
  if (isReturningUser) {
    showScreen("mode-screen");
  } else {
    showTutorial();
  }
};
document.getElementById("greeting-nickname-btn").onclick = () => {
  showScreen("nickname-screen");
};

// Mode Screen Buttons
document.getElementById("tutorial-btn").onclick = () => {
  showTutorial();
};
document.getElementById("easy-btn").onclick = () => {
  showDifficultyPopup(1);
};
document.getElementById("normal-btn").onclick = () => {
  showDifficultyPopup(2);
};
document.getElementById("hard-btn").onclick = () => {
  showDifficultyPopup(3);
};
document.getElementById("expert-btn").onclick = () => {
  showDifficultyPopup(4);
};
document.getElementById("leaderboard-btn").onclick = () => {
  showScreen("leaderboard-screen");
  showLeaderboard();
};
document.getElementById("back-to-title-btn").onclick = () =>
  showScreen("title-screen");

// Game Screen Buttons
document.getElementById("back-to-mode-btn").onclick = () => {
  gameOver = true;
  gameResult = "0";
  questionSequence.push(`BackToMode`);
  sendGameData();
  showScreen("mode-screen");
};
document.getElementById("replay-btn").onclick = () => {
  gameOver = true;
  gameResult = "0";
  questionSequence.push(`ReplayGame`);
  sendGameData();
  startGame();
};

// End Screen Button
document.getElementById("end-mode-btn").onclick = () =>
  showScreen("mode-screen");
document.getElementById("end-replay-btn").onclick = () => {
  showScreen("game-screen");
  startGame();
};
document.getElementById("end-leaderboard-btn").onclick = () => {
  showScreen("leaderboard-screen"); // or whatever your leaderboard screen's id is
  showLeaderboard(); // your leaderboard rendering function
};

// Leaderboard Screen Buttons
document.getElementById("leaderboard-to-mode-btn").onclick = () =>
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

// Tutorial Screen Buttons
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

//
//
// --- Game Data: Multi-Tier Questions ---
// --- questions with tiers and unlocks
const questionData = {
  q1: {
    id: "q1",
    repeatable: true,

    tier: "primary",
    category: "signal",

    text: "Is the total No. of signals",
    label: "total No. of signals",

    guess: {
      unit: "",
      operators: ["=", "≥", "≤", "between"]
    },

    calculator: "signalCount",

    //unlocks: ["q1_1", "q1_2", "q1_3", "q1_4"]
  },

  q2: {
    id: "q2",
    repeatable: true,

    tier: "primary",
    category: "integration",

    text: "Is the total integration of all signals",
    label: "total integration of all signals",

    guess: {
      unit: "",
      operators: ["=", "≥", "≤", "between"]
    },

    calculator: "totalIntegration",

    //unlocks: ["q2_1", "q2_2", "q2_3"]
  },

  q3: {
    id: "q3",
    repeatable: true,

    tier: "primary",
    category: "shift",

    text: "Is the No. of signals with chemical shift",
    label: "No. of signals with chemical shift",

    range: {
      unit: " ppm",
      operators: [">", "<", "≥", "≤", "between"]
    },
    guess: {
      unit: "",
      operators: ["=", "≥", "≤", "between"]
    },

    calculator: "signalCount",

    //unlocks: ["q1_1", "q1_2", "q1_3", "q1_4"]
  },

  q4: {
    id: "q4",
    repeatable: true,

    tier: "primary",
    category: "multiplicity",

    text: "Is the",
    label: "",

    range: {
      unit: " multiplicity in one signal",
      operators: ["min", "max"]
    },
    guess: {
      unit: "",
      operators: ["=", "≥", "≤", "between"]
    },

    calculator: "minMax",

   // unlocks: ["q4_1", "q4_2"]
  },

  q4b: {
    id: "q4b",
    tier: 1,

    text: "Is the highest multiplicity in one signal __ ?",
    label: "highest multiplicity in one signal",

    type: "integer",
    inputCount: 1,
    min: 1,
    max: 99,

    unlocks: ["q4_1", "q4_2"]
  },

  q1_1: {
    id: "q1_1",
    tier: 2,

    text: "Is the No. of singlets __ ?",
    label: "No. of singlets",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: []
  },

  q1_2: {
    id: "q1_2",
    tier: 2,

    text: "Is the No. of doublets __ ?",
    label: "No. of doublets",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: []
  },

  q1_3: {
    id: "q1_3",
    tier: 2,

    text: "Is the No. of triplets __ ?",
    label: "No. of triplets",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: []
  },

  q1_4: {
    id: "q1_4",
    tier: 2,

    text: "Is the No. of signals with higher than triplet multiplicity __ ?",
    label: "No. of signals with higher than triplet multiplicity",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: []
  },

  q2_1a: {
    id: "q2_1a",
    tier: 2,

    text: "Is the smallest integration of any one signal __ ?",
    label: "smallest integration of any one signal",

    type: "integer",
    inputCount: 1,
    min: 1,
    max: 99,

    unlocks: ["q2_1_1", "q2_1_2"]
  },

  q2_1b: {
    id: "q2_1b",
    tier: 2,

    text: "Is the largest integration of any one signal __ ?",
    label: "largest integration of any one signal",

    type: "integer",
    inputCount: 1,
    min: 1,
    max: 99,

    unlocks: ["q2_1_1", "q2_1_2"]
  },

  q2_1c: {
    id: "q2_1c",
    tier: 2,

    text: "Is the No. of different integration values __ ?",
    label: "No. of different integration values",

    type: "integer",
    inputCount: 1,
    min: 1,
    max: 99,

    unlocks: ["q2_1_1", "q2_1_2"]
  },

  q3_1a: {
    id: "q3_1a",
    tier: 2,

    text: "Is the lowest chemical shift of any signal __ ?(1 decimal place)",
    label: "lowest chemical shift of any signal",

    type: "decimal",
    inputCount: 1,
    min: 0,
    max: 20,

    unlocks: [
      "q3_1_1",
      "q3_1_2",
      "q3_1_3",
      "q3_1_4",
      "q3_1_5",
      "q3_1_6",
      "q3_1_7",
      "q3_1_8",
      "q3_1_9",
      "q3_1_10",
      "q3_1_11"
    ]
  },

  q3_1b: {
    id: "q3_1b",
    tier: 2,

    text: "Is the highest chemical shift of any signal __ ?(1 decimal place)",
    label: "highest chemical shift of any signal",

    type: "decimal",
    inputCount: 1,
    min: 0,
    max: 20,

    unlocks: [
      "q3_1_1",
      "q3_1_2",
      "q3_1_3",
      "q3_1_4",
      "q3_1_5",
      "q3_1_6",
      "q3_1_7",
      "q3_1_8",
      "q3_1_9",
      "q3_1_10",
      "q3_1_11"
    ]
  },

  q4_1: {
    id: "q4_1",
    tier: 2,

    text: "Is the No. of signals with only 1 J-value __ ?",
    label: "No. of signals with only 1 J-value",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: ["q4_1_1", "q4_1_2"]
  },

  q4_2: {
    id: "q4_2",
    tier: 2,

    text: "Is the No. of signals with more than 1 J-value __ ?",
    label: "No. of signals with more than 1 J-value",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: ["q4_2_1", "q4_2_2"]
  },

  q2_1_1: {
    id: "q2_1_1",
    tier: 3,

    text: "Is the No. of signals with the smallest integration value __ ?",
    label: "No. of signals with the smallest integration value",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: []
  },

  q2_1_2: {
    id: "q2_1_2",
    tier: 3,

    text: "Is the No. of signals with the largest integration value __ ?",
    label: "No. of signals with the largest integration value",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: []
  },

  q4_1_1: {
    id: "q4_1_1",
    tier: 3,

    text:
      "Is the lowest order of multiplicity for coupling to proton(s) in one environment in one signal __ ?",
    label:
      "lowest order of multiplicity for coupling to proton(s) in one environment in one signal",

    type: "integer",
    inputCount: 1,
    min: 1,
    max: 99,

    unlocks: []
  },

  q4_1_2: {
    id: "q4_1_2",
    tier: 3,

    text:
      "Is the highest order of multiplicity for coupling to proton(s) in one environment in one signal __ ?",
    label:
      "highest order of multiplicity for coupling to proton(s) in one environment in one signal",

    type: "integer",
    inputCount: 1,
    min: 1,
    max: 99,

    unlocks: []
  },

  q4_2_1: {
    id: "q4_2_1",
    tier: 3,

    text: "Is the smallest number of J-Values in one signal __ ?",
    label: "smallest number of J-Values in one signal",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: []
  },

  q4_2_2: {
    id: "q4_2_2",
    tier: 3,

    text: "Is the largest number of J-Values in one signal __ ?",
    label: "largest number of J-Values in one signal",

    type: "integer",
    inputCount: 1,
    min: 0,
    max: 99,

    unlocks: []
  }
};

// --- suspect data with direct raw data of the signals
const suspectData = {
  s1_1: {
    id: "s1_1",
    name: "ethanol",
    difficulty: 1,
    image: "images/s1_1_front.png",
    signals: {
      sig1: {
        shift: 4.7,
        integration: 1,
        multiplicity: [1]
      },

      sig2: {
        shift: 3.6,
        integration: 2,
        multiplicity: [4]
      },

      sig3: {
        shift: 1.2,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s1_2: {
    id: "s1_2",
    name: "propane",
    difficulty: 1,
    image: "images/s1_2_front.png",
    signals: {
      sig1: {
        shift: 1.3,
        integration: 2,
        multiplicity: [7]
      },

      sig2: {
        shift: 0.9,
        integration: 6,
        multiplicity: [3]
      },
    }
  },

  s1_3: {
    id: "s1_3",
    name: "acetone",
    difficulty: 1,
    image: "images/s1_3_front.png",
    signals: {
      sig1: {
        shift: 2.2,
        integration: 6,
        multiplicity: [1]
      },
    }
  },

  s1_4: {
    id: "s1_4",
    name: "tert-butyl formate",
    difficulty: 1,
    image: "images/s1_4_front.png",
    signals: {
      sig1: {
        shift: 8.1,
        integration: 1,
        multiplicity: [1]
      },

      sig2: {
        shift: 1.4,
        integration: 9,
        multiplicity: [1]
      },
    }
  },

  s1_5: {
    id: "s1_5",
    name: "ethyl acetate",
    difficulty: 1,
    image: "images/s1_5_front.png",
    signals: {
      sig1: {
        shift: 4.2,
        integration: 2,
        multiplicity: [4]
      },

      sig2: {
        shift: 2.0,
        integration: 1,
        multiplicity: [1]
      },

      sig3: {
        shift: 1.3,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s1_6: {
    id: "s1_6",
    name: "1-chlorobutane",
    difficulty: 1,
    image: "images/s1_6_front.png",
    signals: {
      sig1: {
        shift: 3.6,
        integration: 2,
        multiplicity: [3]
      },

      sig2: {
        shift: 1.8,
        integration: 2,
        multiplicity: [3,3]
      },

      sig3: {
        shift: 1.5,
        integration: 2,
        multiplicity: [3,4]
      },

      sig4: {
        shift: 0.9,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s1_7: {
    id: "s1_7",
    name: "1,3,5-triazine",
    difficulty: 1,
    image: "images/s1_7_front.png",
    signals: {
      sig1: {
        shift: 9.3,
        integration: 3,
        multiplicity: [1]
      },
    }
  },

  s1_8: {
    id: "s1_8",
    name: "acetic acid",
    difficulty: 1,
    image: "images/s1_8_front.png",
    signals: {
      sig1: {
        shift: 11.0,
        integration: 1,
        multiplicity: [1]
      },

      sig2: {
        shift: 2.1,
        integration: 3,
        multiplicity: [1]
      },
    }
  },

  s2_1: {
    id: "s2_1",
    name: "m-xylene",
    difficulty: 2,
    image: "images/s2_1_front.png",
    signals: {
      sig1: {
        shift: 7.4,
        integration: 1,
        multiplicity: [3]
      },

      sig2: {
        shift: 7.3,
        integration: 1,
        multiplicity: [1]
      },

      sig3: {
        shift: 7.0,
        integration: 2,
        multiplicity: [2]
      },

      sig4: {
        shift: 2.3,
        integration: 6,
        multiplicity: [1]
      },
    }
  },

  s2_2: {
    id: "s2_2",
    name: "ethyl 2-chloroacetate",
    difficulty: 2,
    image: "images/s2_2_front.png",
    signals: {
      sig1: {
        shift: 4.4,
        integration: 2,
        multiplicity: [1]
      },

      sig2: {
        shift: 4.2,
        integration: 2,
        multiplicity: [4]
      },

      sig3: {
        shift: 1.2,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s2_3: {
    id: "s2_3",
    name: "1,4-dioxane",
    difficulty: 2,
    image: "images/s2_3_front.png",
    signals: {
      sig1: {
        shift: 3.7,
        integration: 8,
        multiplicity: [1]
      },
    }
  },

  s2_4: {
    id: "s2_4",
    name: "p-xylene",
    difficulty: 2,
    image: "images/s2_4_front.png",
    signals: {
      sig1: {
        shift: 7.0,
        integration: 4,
        multiplicity: [1]
      },

      sig2: {
        shift: 2.2,
        integration: 6,
        multiplicity: [1]
      },
    }
  },

  s2_5: {
    id: "s2_5",
    name: "methyl propionate",
    difficulty: 2,
    image: "images/s2_5_front.png",
    signals: {
      sig1: {
        shift: 3.6,
        integration: 3,
        multiplicity: [1]
      },

      sig2: {
        shift: 2.4,
        integration: 2,
        multiplicity: [4]
      },

      sig3: {
        shift: 1.2,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s2_6: {
    id: "s2_6",
    name: "o-xylene",
    difficulty: 2,
    image: "images/s2_6_front.png",
    signals: {
      sig1: {
        shift: 7.2,
        integration: 2,
        multiplicity: [3]
      },

      sig2: {
        shift: 7.0,
        integration: 2,
        multiplicity: [3]
      },

      sig3: {
        shift: 2.2,
        integration: 6,
        multiplicity: [1]
      },
    }
  },

  s2_7: {
    id: "s2_7",
    name: "4-hydroxybutan-2-one",
    difficulty: 2,
    image: "images/s2_7_front.png",
    signals: {
      sig1: {
        shift: 3.8,
        integration: 2,
        multiplicity: [3]
      },

      sig2: {
        shift: 3.4,
        integration: 1,
        multiplicity: [1]
      },

      sig3: {
        shift: 2.7,
        integration: 2,
        multiplicity: [3]
      },

      sig4: {
        shift: 2.2,
        integration: 3,
        multiplicity: [1]
      },
    }
  },

  s2_8: {
    id: "s2_8",
    name: "1,3-dioxane",
    difficulty: 2,
    image: "images/s2_8_front.png",
    signals: {
      sig1: {
        shift: 4.7,
        integration: 2,
        multiplicity: [1]
      },

      sig2: {
        shift: 3.8,
        integration: 4,
        multiplicity: [3]
      },

      sig3: {
        shift: 1.7,
        integration: 2,
        multiplicity: [5]
      },
    }
  },

  s3_1: {
    id: "s3_1",
    name: "isobutyric acid",
    difficulty: 3,
    image: "images/s3_1_front.png",
    signals: {
      sig1: {
        shift: 10.7,
        integration: 1,
        multiplicity: [1]
      },

      sig2: {
        shift: 2.6,
        integration: 1,
        multiplicity: [7]
      },

      sig3: {
        shift: 1.1,
        integration: 6,
        multiplicity: [2]
      },
    }
  },

  s3_2: {
    id: "s3_2",
    name: "4-chloroaniline",
    difficulty: 3,
    image: "images/s3_2_front.png",
    signals: {
      sig1: {
        shift: 7.2,
        integration: 2,
        multiplicity: [3]
      },

      sig2: {
        shift: 6.7,
        integration: 2,
        multiplicity: [3]
      },

      sig3: {
        shift: 5.5,
        integration: 2,
        multiplicity: [1]
      },
    }
  },

  s3_3: {
    id: "s3_3",
    name: "3-methylbutan-2-one",
    difficulty: 3,
    image: "images/s3_3_front.png",
    signals: {
      sig1: {
        shift: 2.6,
        integration: 1,
        multiplicity: [7]
      },

      sig2: {
        shift: 2.0,
        integration: 3,
        multiplicity: [1]
      },

      sig3: {
        shift: 1.1,
        integration: 6,
        multiplicity: [2]
      },
    }
  },

  s3_4: {
    id: "s3_4",
    name: "1,4-dichloro-2-nitrobenzene",
    difficulty: 3,
    image: "images/s3_4_front.png",
    signals: {
      sig1: {
        shift: 8.2,
        integration: 1,
        multiplicity: [1]
      },

      sig2: {
        shift: 7.8,
        integration: 1,
        multiplicity: [2]
      },

      sig3: {
        shift: 7.6,
        integration: 1,
        multiplicity: [2]
      },
    }
  },

  s3_5: {
    id: "s3_5",
    name: "4-methylbenzoic acid",
    difficulty: 3,
    image: "images/s3_5_front.png",
    signals: {
      sig1: {
        shift: 12.7,
        integration: 1,
        multiplicity: [1]
      },

      sig2: {
        shift: 8.0,
        integration: 2,
        multiplicity: [3]
      },

      sig3: {
        shift: 7.3,
        integration: 2,
        multiplicity: [3]
      },

      sig4: {
        shift: 2.4,
        integration: 3,
        multiplicity: [1]
      },
    }
  },

  s3_6: {
    id: "s3_6",
    name: "2,2,6,6-tetramethylpiperidin-4-one",
    difficulty: 3,
    image: "images/s3_6_front.png",
    signals: {
      sig1: {
        shift: 2.5,
        integration: 4,
        multiplicity: [1]
      },

      sig2: {
        shift: 1.3,
        integration: 12,
        multiplicity: [1]
      },

      sig3: {
        shift: 1.1,
        integration: 1,
        multiplicity: [1]
      },
    }
  },

  s3_7: {
    id: "s3_7",
    name: "N,N,4-trimethylaniline",
    difficulty: 3,
    image: "images/s3_7_front.png",
    signals: {
      sig1: {
        shift: 7.0,
        integration: 2,
        multiplicity: [3]
      },

      sig2: {
        shift: 6.2,
        integration: 2,
        multiplicity: [3]
      },

      sig3: {
        shift: 3.0,
        integration: 6,
        multiplicity: [1]
      },

      sig4: {
        shift: 2.3,
        integration: 3,
        multiplicity: [1]
      },
    }
  },

  s3_8: {
    id: "s3_8",
    name: "ethyl pivalate",
    difficulty: 3,
    image: "images/s3_8_front.png",
    signals: {
      sig1: {
        shift: 4.2,
        integration: 2,
        multiplicity: [4]
      },

      sig2: {
        shift: 1.3,
        integration: 9,
        multiplicity: [1]
      },

      sig3: {
        shift: 1.2,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s4_1: {
    id: "s4_1",
    name: "but-1-ene",
    difficulty: 4,
    image: "images/s4_1_front.png",
    signals: {
      sig1: {
        shift: 5.8,
        integration: 1,
        multiplicity: [2,2,3]
      },

      sig2: {
        shift: 5.2,
        integration: 1,
        multiplicity: [2,2]
      },

      sig3: {
        shift: 4.9,
        integration: 1,
        multiplicity: [2,2]
      },

      sig4: {
        shift: 2.0,
        integration: 2,
        multiplicity: [2,4]
      },

      sig5: {
        shift: 0.7,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s4_2: {
    id: "s4_2",
    name: "(1-fluoroethyl)benzene",
    difficulty: 4,
    image: "images/s4_2_front.png",
    signals: {
      sig1: {
        shift: 7.3,
        integration: 1,
        multiplicity: [3]
      },

      sig2: {
        shift: 7.3,
        integration: 2,
        multiplicity: [2,3]
      },

      sig3: {
        shift: 7.3,
        integration: 2,
        multiplicity: [3]
      },

      sig4: {
        shift: 4.7,
        integration: 1,
        multiplicity: [2,4]
      },

      sig5: {
        shift: 1.7,
        integration: 3,
        multiplicity: [2,2]
      },
    }
  },

  s4_3: {
    id: "s4_3",
    name: "ethyl (Z)-3-fluoroacrylate",
    difficulty: 4,
    image: "images/s4_3_front.png",
    signals: {
      sig1: {
        shift: 7.3,
        integration: 1,
        multiplicity: [2,2]
      },

      sig2: {
        shift: 5.0,
        integration: 3,
        multiplicity: [2,2]
      },

      sig3: {
        shift: 4.1,
        integration: 2,
        multiplicity: [4]
      },

      sig4: {
        shift: 1.2,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s4_4: {
    id: "s4_4",
    name: "dimethylphosphane",
    difficulty: 4,
    image: "images/s4_4_front.png",
    signals: {
      sig1: {
        shift: 3.1,
        integration: 1,
        multiplicity: [2,7]
      },

      sig2: {
        shift: 1.1,
        integration: 6,
        multiplicity: [2,2]
      },
    }
  },

  s4_5: {
    id: "s4_5",
    name: "1-(fluoromethyl)-4-methylbenzene",
    difficulty: 4,
    image: "images/s4_5_front.png",
    signals: {
      sig1: {
        shift: 7.3,
        integration: 2,
        multiplicity: [3]
      },

      sig2: {
        shift: 7.1,
        integration: 2,
        multiplicity: [3]
      },

      sig3: {
        shift: 5.3,
        integration: 2,
        multiplicity: [2]
      },

      sig4: {
        shift: 2.2,
        integration: 3,
        multiplicity: [1]
      },
    }
  },

  s4_6: {
    id: "s4_6",
    name: "ethyl 4-aminobenzoate",
    difficulty: 4,
    image: "images/s4_6_front.png",
    signals: {
      sig1: {
        shift: 7.6,
        integration: 2,
        multiplicity: [3]
      },

      sig2: {
        shift: 6.5,
        integration: 2,
        multiplicity: [3]
      },

      sig3: {
        shift: 5.5,
        integration: 2,
        multiplicity: [1]
      },

      sig4: {
        shift: 4.3,
        integration: 2,
        multiplicity: [4]
      },

      sig5: {
        shift: 1.3,
        integration: 3,
        multiplicity: [3]
      },
    }
  },

  s4_7: {
    id: "s4_7",
    name: "(E)-3,6-dichloro-2-hexene",
    difficulty: 4,
    image: "images/s4_7_front.png",
    signals: {
      sig1: {
        shift: 5.6,
        integration: 1,
        multiplicity: [4]
      },

      sig2: {
        shift: 3.5,
        integration: 2,
        multiplicity: [3]
      },

      sig3: {
        shift: 1.9,
        integration: 2,
        multiplicity: [3]
      },

      sig4: {
        shift: 1.6,
        integration: 3,
        multiplicity: [2]
      },

      sig5: {
        shift: 1.6,
        integration: 2,
        multiplicity: [3,3]
      },
    }
  },

  s4_8: {
    id: "s4_8",
    name: "1,1-difluoropentan-3-one",
    difficulty: 4,
    image: "images/s4_8_front.png",
    signals: {
      sig1: {
        shift: 5.4,
        integration: 1,
        multiplicity: [3,3]
      },

      sig2: {
        shift: 2.7,
        integration: 2,
        multiplicity: [2,3]
      },

      sig3: {
        shift: 2.5,
        integration: 2,
        multiplicity: [4]
      },

      sig4: {
        shift: 1.1,
        integration: 3,
        multiplicity: [3]
      },
    }
  },
};
// --- calculators to convert suspect spectrum signal data to actual values corresponding to questions
const calculators = {
  signalCount(signals, guesses, question) {
    // If there is no range block at all → return total count
    if (!guesses.range || !question.range) {
      return Object.values(signals).length;
    }

    const opName = guesses.range.operator;
    const op = operators[opName];

    const values = op.normalise(guesses.range);

    /*
    const upper = guesses?.range?.upper ?? Infinity;
    const lower = guesses?.range?.lower ?? -Infinity;
    */
    return Object.values(signals).filter((signal) => {
      const actual = signal[question.category] ?? 0;
      return op.evaluate(actual, values);
    }).length;
  },

  totalIntegration(signals) {
    return Object.values(signals).reduce((sum, s) => sum + s.integration, 0);
  },

  minMax(signals, guesses, question) {
    // If no range block, just return null or 0
    if (!guesses.range || !question.range) {
      return 0;
    }

    const opName = guesses.range.operator;
    const op = operators[opName];

    // Extract all values for this category
    const allValues = Object.values(signals).map(
      (sig) => sig[question.category]
    );

    // Normalise (min/max don't need inputs)
    const values = op.normalise(guesses.range);

    // Find the actual extreme value
    const actual =
      opName === "min" ? Math.min(...allValues) : Math.max(...allValues);

    return actual;
  }
};

// --- operators to compare player inputs & actual values
const operators = {
  between: {
    label: "between",
    inputs: ["lower", "upper"],

    normalise(guesses) {
      const a = Number(guesses.lower);
      const b = Number(guesses.upper);
      return {
        lower: Math.min(a, b),
        upper: Math.max(a, b)
      };
    },

    evaluate(actual, values) {
      return actual >= values.lower && actual <= values.upper;
    },

    clueText(values) {
      return `between ${values.lower} and ${values.upper}`;
    }
  },

  "=": {
    label: "=",
    inputs: ["singular"],

    normalise(guesses) {
      return { singular: Number(guesses.singular) };
    },

    evaluate(actual, values) {
      return actual === values.singular;
    },

    //description that gets used in the actual clue, along with the yes/no verdict from inside getTrueFalseClue.
    clueText(values) {
      return `${values.singular}`;
    }
  },

  ">": {
    label: ">",
    inputs: ["singular"],

    normalise(guesses) {
      return { singular: Number(guesses.singular) };
    },

    evaluate(actual, values) {
      return actual > values.singular;
    },

    clueText(values) {
      return `> ${values.singular}`;
    }
  },

  "<": {
    label: "<",
    inputs: ["singular"],

    normalise(guesses) {
      return { singular: Number(guesses.singular) };
    },

    evaluate(actual, values) {
      return actual < values.singular;
    },

    clueText(values) {
      return `< ${values.singular}`;
    }
  },

  "≥": {
    label: "≥",
    inputs: ["singular"],

    normalise(guesses) {
      return { singular: Number(guesses.singular) };
    },

    evaluate(actual, values) {
      return actual >= values.singular;
    },

    clueText(values) {
      return `≥ ${values.singular}`;
    }
  },

  "≤": {
    label: "≤",
    inputs: ["singular"],

    normalise(guesses) {
      return { singular: Number(guesses.singular) };
    },

    evaluate(actual, values) {
      return actual <= values.singular;
    },

    clueText(values) {
      return `≤ ${values.singular}`;
    }
  },

  min: {
    label: "lowest",
    inputs: [],

    normalise() {
      return {}; // no inputs needed
    },

    evaluate(actual, values, allValues) {
      return actual === Math.min(...allValues);
    },

    clueText() {
      return "the lowest";
    }
  },

  max: {
    label: "highest",
    inputs: [],

    normalise() {
      return {}; // no inputs needed
    },

    evaluate(actual, values, allValues) {
      return actual === Math.max(...allValues);
    },

    clueText() {
      return "the highest";
    }
  }
};

// --- different difficulty requirements
const starRequirements = {
  1: {
    maxTime: 90, // 1.5 minutes
    maxQuestions: 3,
    attempts: 3
  },
  2: {
    maxTime: 120, // 2 minutes
    maxQuestions: 4,
    attempts: 2
  },
  3: {
    maxTime: 150, // 2.5 minutes
    maxQuestions: 5,
    attempts: 2
  },
  4: {
    maxTime: 180, // 6 minutes
    maxQuestions: 6,
    attempts: 1
  }
};

//
//
// --- Game State ---
let availableQuestions = [];
let currentQuestions = [];
let currentSuspects = [];
let clues = [];
let questionsAsked = 0;
let gameOver = false;
let startTime = Date.now();
let questionSequence = [];
let gameResult = "";
let starsEarned = 0;
let attempts = 3;
let checkedSuspects = new Array(currentSuspects.length).fill(false);
let disabledSuspects = new Array(currentSuspects.length).fill(false);
let difficulty = "1";
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

//
//
// --- UI Elements ---
const questionsDiv = document.getElementById("questions");
const answersDiv = document.getElementById("suspects-grid");
const cluesDiv = document.getElementById("clues");
const scoreDiv = document.getElementById("score");
const timerDiv = document.getElementById("timer");
const attemptsDiv = document.getElementById("attempts");

//
//
// Question Section //
//--- Helper: Add Questions to Available If Not Already There ---
function addQuestionsToAvailable(questionIds) {
  questionIds.forEach((id) => {
    const question = questionData[id];

    if (!question) return;

    if (!availableQuestions.some((q) => q.id === id)) {
      availableQuestions.push(question);
    }
  });
}

// --- Render Question Cards (generated html elements, including inputs and buttons) ---
function renderQuestions() {
  // puts a bit of nothing inside question division
  questionsDiv.innerHTML = "";

  // builds a question card for each available question
  availableQuestions.forEach((qObj) => {
    const card = document.createElement("div");

    // Add a class for being a card, the tier and category of the question
    card.classList.add("question-card", qObj.tier, qObj.category);

    // builds the text part of the card (with stars)
    const label = document.createElement("span");
    const unlockCount = qObj.unlocks ? qObj.unlocks.length : 0;
    const stars = unlockCount > 0 ? "✦".repeat(unlockCount) + " " : "";
    label.textContent = stars + qObj.text + " ";

    // --- range block ---
    let rangeBlock = null;
    if (qObj.range) {
      rangeBlock = buildOperatorBlock("range", qObj.range);
    }
    if (rangeBlock) {
      label.appendChild(rangeBlock.container);
    }

    // --- guess block ---
    // its 3am wtf am i doing im so going to kms bruh who tf is going to see this even
    const guessBlock = buildOperatorBlock("guess", qObj.guess);
    label.appendChild(document.createTextNode(" "));
    label.appendChild(guessBlock.container);

    // --- Ask button to submit question ---
    const askBtn = document.createElement("button");
    askBtn.textContent = "ASK";

    askBtn.onclick = () => {
      const guesses = collectAllInputs(rangeBlock, guessBlock);
      askQuestion(qObj, card, guesses);
    };

    // puts all elements in the card
    card.appendChild(label);
    card.appendChild(askBtn);

    // puts the card in the questions division
    questionsDiv.appendChild(card);
  });
}

// --- Block builder helper function ---
function buildOperatorBlock(blockName, blockConfig) {
  if (!blockConfig) return null; // ← prevents crashes
  // If this block has no operators, skip the entire block
  if (!blockConfig.operators || blockConfig.operators.length === 0) {
    return null; // or return an empty container if you prefer
  }
  const container = document.createElement("span");

  // operator selector
  const select = document.createElement("select");
  blockConfig.operators.forEach((opName) => {
    const opt = document.createElement("option");
    opt.value = opName;
    opt.textContent = operators[opName].label;
    select.appendChild(opt);
  });
  function resizeSelect(select) {
    const temp = document.createElement("span");
    temp.style.visibility = "hidden";
    temp.style.position = "fixed";
    temp.style.whiteSpace = "pre";
    temp.textContent = select.options[select.selectedIndex].textContent;

    document.body.appendChild(temp);
    select.style.width = temp.offsetWidth + 35 + "px"; // +30 for dropdown arrow
    temp.remove();
  }

  // Call after building:
  resizeSelect(select);

  container.appendChild(select);
  container.appendChild(document.createTextNode(" "));

  // input container
  const inputsContainer = document.createElement("span");
  container.appendChild(inputsContainer);

  function rebuildInputs() {
    inputsContainer.innerHTML = "";

    // If this block has no operators (e.g., no range block), skip
    if (!blockConfig.operators || blockConfig.operators.length === 0) {
      return;
    }

    const op = operators[select.value];
    if (!op) return; // extra safety
    if (blockConfig.unit && op.inputs.length === 0) {
      // No inputs → append unit right after the select
      inputsContainer.appendChild(document.createTextNode(blockConfig.unit));
    }

    op.inputs.forEach((key, index) => {
      const input = document.createElement("input");
      input.type = "number";
      input.dataset.key = `${blockName}.${key}`;
      inputsContainer.appendChild(input);

      if (index < op.inputs.length - 1) {
        inputsContainer.appendChild(document.createTextNode(" & "));
      }

      if (blockConfig.unit && index === op.inputs.length - 1) {
        // Inputs exist → append unit after the last input
        inputsContainer.appendChild(document.createTextNode(blockConfig.unit));
      }
    });
  }

  blockConfig.selectedOperator = select.value;
  rebuildInputs();
  // on select change:
  select.addEventListener("change", () => {
    blockConfig.selectedOperator = select.value;
    resizeSelect(select);
    rebuildInputs();
  });

  return { container, select, inputsContainer };
}

// --- Input collector helper function ---
function collectAllInputs(rangeBlock, guessBlock) {
  const inputs = [];
  const values = {};

  // Helper to process any block safely
  function processBlock(block, blockName) {
    if (!block) return;

    // 1. Collect inputs
    const blockInputs = block.inputsContainer.querySelectorAll("input");
    blockInputs.forEach((input) => {
      const [, key] = input.dataset.key.split("."); // "range.lower" → ["range", "lower"]

      if (!values[blockName]) values[blockName] = {};
      values[blockName][key] = Number(input.value);
    });

    // 2. Collect operator
    if (block.select) {
      if (!values[blockName]) values[blockName] = {};
      values[blockName].operator = block.select.value;
    }
  }

  processBlock(rangeBlock, "range");
  processBlock(guessBlock, "guess");

  /*
  if (rangeBlock) {
    inputs.push(...rangeBlock.inputsContainer.querySelectorAll("input"));
  }

  if (guessBlock) {
    inputs.push(...guessBlock.inputsContainer.querySelectorAll("input"));
  }

  

  inputs.forEach((input) => {
    const [block, key] = input.dataset.key.split("."); // "range.lower" → ["range", "lower"]

    if (!values[block]) {
      values[block] = {};
    }

    values[block][key] = Number(input.value);
  });
*/
  return values;
}

// --- Ask Question Logic (Handles All Tiers) ---
function askQuestion(qObj, card, guesses) {
  if (gameOver) return;
  /*
  const guesses = inputs.map((input) => Number(input.value));
*/
  // input validation
  // Convert guesses object → array of numeric values
  const guessValues = Object.values(guesses);

  // Validate: all inputs filled
  if (guessValues.some((v) => Number.isNaN(v))) {
    alert("Please enter all required values.");
    return;
  }
  // Validate: within 0-99
  if (guessValues.some((v) => v < 0 || v > 99)) {
    alert(`Please enter values between 0 and 99.`);
    /*
  // Validate: within min/max
  if (guessValues.some((v) => v < qObj.min || v > qObj.max)) {
    alert(`Please enter values between ${qObj.min} and ${qObj.max}.`);
    */
    return;
  }

  questionsAsked++;

  const suspect = currentSuspects[correctSuspectIndex];

  const clue = getTrueFalseClue(qObj, suspect, guesses);
  clues.push({
    questionId: qObj.id,
    guesses,
    clue
  });

  // player action data collection
  function formatBlock(blockObj) {
    const { operator, ...inputs } = blockObj;
    const inputKeys = Object.keys(inputs);

    // CASE 1: operator only
    if (inputKeys.length === 0) {
      return operator;
    }

    // CASE 2: two numeric inputs → format as min~max
    if (inputKeys.length === 2) {
      const nums = Object.values(inputs).map(Number);
      const min = Math.min(...nums);
      const max = Math.max(...nums);
      return `${min}~${max}`;
    }

    // CASE 3: one numeric input + operator
    if (inputKeys.length === 1 && operator) {
      const key = inputKeys[0];
      return `${operator}${inputs[key]}`;
    }

    // CASE 4: one numeric input only
    if (inputKeys.length === 1) {
      const key = inputKeys[0];
      return `${inputs[key]}`;
    }

    // fallback (should never happen)
    return JSON.stringify(blockObj);
  }
  /*
  function formatBlock(blockObj) {
    const values = Object.values(blockObj);

    if (values.length === 2) {
      // two values → join with ~
      const max = Math.max(values[0], values[1]);
      const min = Math.min(values[0], values[1]);
      return `${min}~${max}`;
    }

    // one value → just the number
    return `${values[0]}`;
  }
*/
  const playerGuess = Object.entries(guesses)
    .map(([blockName, blockObj]) => `${blockName}.${formatBlock(blockObj)}`)
    .join(", ");
  const logEntry = `${qObj.id} : ${playerGuess}`;
  questionSequence.push(logEntry);

  updateScore();
  updateClues();
  if (qObj.unlocks && qObj.unlocks.length) {
    addQuestionsToAvailable(qObj.unlocks);
  }

  if (!qObj.repeatable) {
    card.textContent = clue;
    card.disabled = true;
    card.classList.add("greyed");

    setTimeout(() => {
      availableQuestions = availableQuestions.filter((q) => q.id !== qObj.id);
      renderQuestions();
    }, 1000);
  }
}

// --- Get Clue Logic (No suspect name revealed) ---
function getTrueFalseClue(qObj, suspect, guesses) {
  const question = questionData[qObj.id];

  // VVV DELETE LATER AFTER SYSTEM IS OVERHAULED TO SIGNAL DATA QUERY VVV
  //const clueData = suspect.clues[questionId];

  const actualValue = calculators[question.calculator](
    suspect.signals,
    guesses,
    question
  );

  function buildRangeText(question, guesses) {
    if (!question.range || !guesses.range) {
      return ""; // no range block → no range text
    }

    const opName = question.range.selectedOperator; // we’ll set this in render
    const op = operators[opName];

    // Extract only the keys belonging to the range block
    const raw = {};
    op.inputs.forEach((key) => {
      raw[key] = guesses.range[key];
    });

    const normalised = op.normalise(raw);
    return op.clueText(normalised) + (question.range.unit || "");
  }

  function buildGuessText(question, guesses) {
    const opName = question.guess.selectedOperator;
    const op = operators[opName];

    const raw = {};
    op.inputs.forEach((key) => {
      raw[key] = guesses.guess[key];
    });

    const normalised = op.normalise(raw);
    const result = op.evaluate(actualValue, normalised);
    const guessText = op.clueText(normalised);
    return {
      guessText: guessText,
      result: result
    };
  }

  const rangeText = buildRangeText(question, guesses);
  const guessText = buildGuessText(question, guesses).guessText;
  const result = buildGuessText(question, guesses).result;

  return result
    ? `Yes, the <b>${question.label} ${rangeText} is ${guessText}.</b>`
    : `No, the <b>${question.label} ${rangeText} is NOT ${guessText}.</b>`;
}

//
//
// Suspect Section //
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
      1: "images/card-back-easy.png",
      2: "images/card-back-normal.png",
      3: "images/card-back-hard.png",
      4: "images/card-back-expert.png"
    };

    backImg.src = cardBackImages[difficulty] || "images/card-back.png";
    backImg.alt = "Card Back";
    back.appendChild(backImg);

    inner.appendChild(front);
    inner.appendChild(back);
    cardButton.appendChild(inner);

    const checkbox = document.createElement("button");
    checkbox.type = "button";
    checkbox.className = "suspect-checkbox";
	checkbox.textContent = 'Flip';
    /*checkbox.checked = isChecked;*/
	//Checked State
	checkbox.classList.toggle("flipped", isChecked);

    /* Disable checkbox permanently if wrong guess */
    /*if (isDisabled) {
      checkbox.disabled = true;
    }*/
	// Disable Button if wrong
	if (isDisabled) {
		checkbox.disabled = true;
	}
	
	checkbox.onclick = function () {
		if (disabledSuspects[idx]) return;
		
		//toggle the original checked State
		checkedSuspects[idx] = !checkedSuspects[idx];
		
		/*const cardButton = document.querySelectorAll(".suspect-card")[idx];*/
		
		if (checkedSuspects[idx]) {
			cardButton.classList.add("flipped");
			cardButton.disabled = true;
		} else {
			cardButton.classList.remove("flipped");
			cardButton.disabled = false;
		}
	};

    /*checkbox.onchange = function () {
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
    };*/

    wrapper.appendChild(cardButton);
    wrapper.appendChild(checkbox);
    answersDiv.appendChild(wrapper);
  });
}

// --- Guess Suspect Logic ---
function guessSuspect(idx) {
  if (gameOver || attempts <= 0) return;

  let endTime = Date.now();

  const cardButton = document.querySelectorAll(".suspect-card")[idx];

  if (!cardButton) return;

  questionSequence.push(`Guess:${currentSuspects[idx].id}`);

  if (idx === correctSuspectIndex) {
    attempts -= 1;
    gameOver = true;
    gameResult = "1";
    questionSequence.push(
      `TrueSuspect:${currentSuspects[correctSuspectIndex].id}`
    );
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
      questionSequence.push(`${correctSuspectIndex}`);
      showEndScreen(false); // lose
      sendGameData();
    } else {
      attemptsDiv.textContent = `Attempts left: ${attempts} Sorry, wrong suspect!`;
    }
  }
}

//
//
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

  currentQuestions = Object.values(questionData).filter(
    (q) => q.tier === "primary"
  );

  const suspectPool = Object.values(suspectData).filter(
    (q) => q.difficulty === difficulty
  ); //All suspects in selected difficulty

  currentSuspects = shuffle(suspectPool).slice(0, 8); //Randomise 8 suspects

  // Only primary questions at start
  availableQuestions = currentQuestions.map((q) => ({
    ...q,
    unlocks: q.unlocks
  }));

  correctSuspectIndex = Math.floor(Math.random() * currentSuspects.length);

  checkedSuspects = Array(currentSuspects.length).fill(false);
  disabledSuspects = Array(currentSuspects.length).fill(false);
  questionSequence = [];

  renderSuspects();
  renderQuestions();

  updateClues();
  updateScore();
  updateAttempts();
}

// !!End Stars Screen!!
function showEndScreen(win) {
  // Calculate stars
  const settings = starRequirements[difficulty];

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

//
//
// DATA COLLECTION & RETRIEVAL
// Send data at end of game
function sendGameData() {
  const formData = new URLSearchParams();
  const maxAttempts = starRequirements[difficulty].attempts;
  const attemptsUsed = maxAttempts - attempts;

  formData.append("nickname", storedNickname);
  formData.append("score", questionsAsked);
  formData.append("timetaken", ((Date.now() - startTime) / 1000).toFixed(1));
  formData.append("question_sequence", questionSequence.join(" | "));
  formData.append("result", gameResult);
  formData.append("attempts_used", attemptsUsed);
  formData.append("stars", starsEarned);
  formData.append("difficulty", difficulty);

  fetch("https://peakthecards.aurorazhang.workers.dev/", {
    method: "POST",
    body: formData
  })
    .then(async (res) => {
      const text = await res.text();

      try {
        // Try to parse JSON normally
        return JSON.parse(text);
      } catch (err) {
        // If JSON parsing fails, log the raw HTML/text
        console.error("Non‑JSON response received:");
        console.error(text);

        throw new Error("Server returned non‑JSON response");
      }
    }) // ← back to JSON
    .then((data) => {
      console.log("Response:", data);
    })
    .catch((err) => {
      console.error("Send error:", err);
      console.error(String(err));
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
    });
}

function sendVisitorData() {
  const formData = new URLSearchParams();

  formData.append("visitor", 'Visitor');

  fetch("https://peakthecards.aurorazhang.workers.dev/", {
    method: "POST",
    body: formData
  })
    .then(async (res) => {
      const text = await res.text();

      try {
        // Try to parse JSON normally
        return JSON.parse(text);
      } catch (err) {
        // If JSON parsing fails, log the raw HTML/text
        console.error("Non‑JSON response received:");
        console.error(text);

        throw new Error("Server returned non‑JSON response");
      }
    }) // ← back to JSON
    .then((data) => {
      console.log("Response:", data);
    })
    .catch((err) => {
      console.error("Send error:", err);
      console.error(String(err));
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
    });
}

//ordering difficulties from easiest to hardest
const difficultyOrder = {
  1: "easy",
  2: "normal",
  3: "hard",
  4: "expert"
};

// Fetch leaderboard data
function fetchLeaderboard(callback) {
  fetch("https://peakthecards.aurorazhang.workers.dev/")
    .then(async (res) => {
      const text = await res.text();

      try {
        // Try to parse JSON normally
        return JSON.parse(text);
      } catch (err) {
        // If JSON parsing fails, log the raw HTML/text
        console.error("Non‑JSON response received:");
        console.error(text);

        throw new Error("Server returned non‑JSON response");
      }
    })
    .then((data) => callback(data))
    .catch((err) => {
      console.error("Retrieve error:", err);
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);
    });
}

// builds the text in one leaderboard page
function renderCurrentLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");
  const label = document.getElementById("leaderboard-difficulty-label");

  const currentDifficulty = leaderboardDifficulties[currentLeaderboardIndex];
  label.textContent = difficultyOrder[currentDifficulty].toUpperCase();

  const entries = leaderboardData[currentDifficulty];

  if (!entries || !entries.length) {
    leaderboardDiv.innerHTML = "<div>No players in this difficulty yet.</div>";
    return;
  }
  // 🔥 Remove duplicate players (keep best one only)

  let html = "<ol>";

  entries.forEach((entry) => {
    const filled = "⭐".repeat(entry.stars);
    const empty = "☆".repeat(3 - entry.stars);
    const starsDisplay = filled + empty;

    html += `
      <li>
        <b>${entry.nickname}</b> 
        - ${starsDisplay} 
        - ${entry.score} question(s) 
        - ${entry.timetaken}s 
        - in ${entry.attempts_used} attempt(s)
        - ${entry.date}
      </li>`;
  });

  html += "</ol>";

  leaderboardDiv.innerHTML = html;
}

// creates html element for the leaderboard, separates difficulties
function showLeaderboard() {
  const leaderboardDiv = document.getElementById("leaderboard");
  leaderboardDiv.innerHTML =
    "<div style='padding: 30px 0; font-size: 1.2em; color: #888;'>Loading...</div>";

  fetchLeaderboard(function (data) {
    if (!data || Object.keys(data).length === 0) {
      leaderboardDiv.innerHTML =
        "<div style='padding: 30px 0; font-size: 1.1em; color: #b00;'>No leaderboard data yet.</div>";
      return;
    }

    // 🔥 Group by difficulty
    leaderboardData = data;
    // 🔥 Force proper order instead of Object.keys()
    leaderboardDifficulties = [1, 2, 3, 4].filter(
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

//
//
// miscellaneous functions
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
  caughtImg.src = correct.image.replace("_front", "_caught");

  normalImg.alt = correct.name;
  caughtImg.alt = correct.name + " spectra";
}

function showDifficultyPopup(selectedDifficulty) {
  const settings = starRequirements[selectedDifficulty];

  const minutes = settings.maxTime / 60;
  const seconds = settings.maxTime;
  document.getElementById("popup-title").textContent =
    difficultyOrder[selectedDifficulty].toUpperCase() +
    " Mode - Goals to 3 Star";
  document.getElementById("popup-requirements").innerHTML = `
    ⭐ Correctly identify the molecule<br>
    ⭐ Finish under <b>${seconds} seconds</b><br>
    ⭐ Ask no more than <b>${settings.maxQuestions} questions</b><br>
    you have <b>${settings.attempts} attempt${settings.attempts === 1 ? '' : 's'}</b>!
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

  Object.values(suspectData).forEach((q) => {
    if (q.image) {
      paths.push(q.image);
    }

    if (q.caughtImage) {
      paths.push(q.caughtImage);
    } else if (q.image) {
      // Auto-generate caught version if you use that pattern
      paths.push(q.image.replace("_front", "_caught"));
    }
  });

  // title
  paths.push("images/title.png");
	
  // Card backs
  paths.push("images/card-back-easy.png");
  paths.push("images/card-back-normal.png");
  paths.push("images/card-back-hard.png");
  paths.push("images/card-back-expert.png");

  // tutorials
  paths.push("images/tutorial-1.png");
  paths.push("images/tutorial-2.png");
  paths.push("images/tutorial-3.png");
  paths.push("images/tutorial-4.png");
  paths.push("images/tutorial-5.png");
	
  return paths.filter(Boolean);
}

function shuffle(array) {
  const arr = [...array];

  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr;
}
