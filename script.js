const resetBtn = document.getElementById("resetBoard");
resetBtn.addEventListener("click", resetLeaderboard);

const playerInput = document.getElementById("playerName");

const leaderboardUI = document.getElementById("leaderboard");

function getScores() {
  return JSON.parse(localStorage.getItem(`scores_${level}`)) || [];
}

function saveScore(time) {
  const name = playerInput.value || "Player";

  let scores = JSON.parse(localStorage.getItem(`scores_${level}`)) || [];

  scores.push({ name, time });

  scores.sort((a, b) => a.time - b.time);
  scores = scores.slice(0, 5);

  localStorage.setItem(`scores_${level}`, JSON.stringify(scores));
  renderLeaderboard();
}

function renderLeaderboard() {
  const scores = JSON.parse(localStorage.getItem(`scores_${level}`)) || [];
  leaderboardUI.innerHTML = "";

  scores.forEach((item, index) => {
    leaderboardUI.innerHTML += 
      `<li>#${index + 1} — ${item.name} : ${item.time} ms</li>`;
  });
}


let level = "easy";

const levelSettings = {
  easy: [3000, 5000],
  hard: [2000, 4000],
  insane: [1000, 2000]
};

function setLevel(selected) {
  level = selected;
  document.querySelectorAll(".levels button").forEach(btn => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
  renderLeaderboard();

}

const gameBox = document.getElementById("gameBox");
const startBtn = document.getElementById("startBtn");
const result = document.getElementById("result");
const bestText = document.getElementById("best");

let startTime;
let timeout;
let waiting = false;
let bestScore = localStorage.getItem("bestScore");

if (bestScore) {
  bestText.innerText = `Best: ${bestScore} ms`;
}

startBtn.addEventListener("click", startGame);
gameBox.addEventListener("click", boxClicked);

function startGame() {
  result.innerText = "";
  gameBox.style.background = "#ef4444";
  gameBox.innerText = "WAIT...";
  waiting = true;

const [min, max] = levelSettings[level];
const delay = Math.random() * (max - min) + min;

  timeout = setTimeout(() => {
    gameBox.style.background = "#22c55e";
    gameBox.innerText = "CLICK NOW!";
    startTime = Date.now();
    waiting = false;
  }, delay);
}

function boxClicked() {
  if (waiting) {
    clearTimeout(timeout);
    gameBox.innerText = "Too Early ❌";
    result.innerText = "Clicked too soon!";
    waiting = false;
  } else if (startTime) {
    const reactionTime = Date.now() - startTime;
    result.innerText = `Your Reaction Time: ${reactionTime} ms`;
saveScore(reactionTime);

    if (!bestScore || reactionTime < bestScore) {
      bestScore = reactionTime;
      localStorage.setItem("bestScore", bestScore);
      bestText.innerText = `Best: ${bestScore} ms`;
    }

    gameBox.innerText = "Click START Again";
    startTime = null;
  }
}
renderLeaderboard();
function resetLeaderboard() {
  const confirmReset = confirm(
    `Reset leaderboard for ${level.toUpperCase()} level?`
  );

  if (confirmReset) {
    localStorage.removeItem(`scores_${level}`);
    renderLeaderboard();
  }
}
