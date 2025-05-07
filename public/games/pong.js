const gameWidth = 800;
const gameHeight = 500;

let controlMode = null;
let playerName = null;
let playerCount = JSON.parse(localStorage.getItem("pongPlayerCount")) || 1;

let paddleLeftY = 210;
let keysPressed = {
  ArrowUp: false,
  ArrowDown: false,
};
const paddleSpeed = 7;

function startGame(selectedControl) {
  const nameInput = document.getElementById("player-name").value.trim();
  if (nameInput) {
    playerName = nameInput;
  } else {
    playerName = `Player ${playerCount}`;
    playerCount++;
    localStorage.setItem("pongPlayerCount", JSON.stringify(playerCount));
  }

  controlMode = selectedControl;
  document.getElementById("setup-overlay").style.display = "none";
  initGame();
}

function initGame() {
  const game = document.getElementById("game");
  const ball = document.getElementById("ball");
  const paddleLeft = document.getElementById("paddle-left");
  const paddleRight = document.getElementById("paddle-right");

  // Displays
  const hitDisplay = document.createElement("div");
  hitDisplay.style.color = "white";
  hitDisplay.style.fontSize = "20px";
  hitDisplay.style.position = "absolute";
  hitDisplay.style.bottom = "20px";
  hitDisplay.style.left = "20px";
  hitDisplay.textContent = "Hits: 0";
  game.appendChild(hitDisplay);

  const highScoreDisplay = document.createElement("div");
  highScoreDisplay.style.color = "white";
  highScoreDisplay.style.fontSize = "20px";
  highScoreDisplay.style.position = "absolute";
  highScoreDisplay.style.bottom = "20px";
  highScoreDisplay.style.right = "20px";
  highScoreDisplay.textContent = "High Score: 0";
  game.appendChild(highScoreDisplay);

  const leaderboard = document.createElement("div");
  leaderboard.style.color = "white";
  leaderboard.style.fontSize = "16px";
  leaderboard.style.position = "absolute";
  leaderboard.style.top = "20px";
  leaderboard.style.right = "20px";
  leaderboard.innerHTML = "<strong>Leaderboard</strong><br>(Top 5 Hits)";
  game.appendChild(leaderboard);

  let leaderboardScores = JSON.parse(localStorage.getItem("pongLeaderboard")) || [];

  function renderLeaderboard() {
    let leaderboardHTML = "<strong>Leaderboard</strong><br>(Top 5 Hits)<br>";
    leaderboardScores.forEach((entry, index) => {
      leaderboardHTML += `${index + 1}. ${entry.name}: ${entry.hits} hits<br>`;
    });
    leaderboard.innerHTML = leaderboardHTML;
  }
  renderLeaderboard();

  // Game variables
  let playerHits = 0;
  let highScore = 0;
  let ballX = gameWidth / 2;
  let ballY = gameHeight / 2;
  let ballSpeedX = 4;
  let ballSpeedY = 4;
  const paddleWidth = 10;
  const paddleHeight = 80;

  function resetBall() {
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballSpeedX *= -1;

    if (playerHits > 0) {
      leaderboardScores.push({ name: playerName, hits: playerHits });
      leaderboardScores.sort((a, b) => b.hits - a.hits);
      leaderboardScores = leaderboardScores.slice(0, 5);
      localStorage.setItem("pongLeaderboard", JSON.stringify(leaderboardScores));
      renderLeaderboard();
    }

    playerHits = 0;
    hitDisplay.textContent = `Hits: ${playerHits}`;
  }

  function update() {
    // Update paddle movement for keyboard
    if (controlMode === "keyboard") {
      if (keysPressed.ArrowUp) {
        paddleLeftY = Math.max(paddleLeftY - paddleSpeed, 0);
      }
      if (keysPressed.ArrowDown) {
        paddleLeftY = Math.min(paddleLeftY + paddleSpeed, gameHeight - paddleHeight);
      }
      paddleLeft.style.top = `${paddleLeftY}px`;
    }

    // Ball movement
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce top/bottom
    if (ballY <= 0 || ballY + 15 >= gameHeight) {
      ballSpeedY *= -1;
    }

    const paddleLeftTop = parseInt(paddleLeft.style.top);
    const paddleRightTop = parseInt(paddleRight.style.top);

    // Left paddle collision
    if (
      ballX <= paddleWidth + 10 &&
      ballY + 15 >= paddleLeftTop &&
      ballY <= paddleLeftTop + paddleHeight
    ) {
      ballSpeedX *= -1;
      ballX = paddleWidth + 10;

      playerHits++;
      hitDisplay.textContent = `Hits: ${playerHits}`;

      if (playerHits > highScore) {
        highScore = playerHits;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
      }
    }

    // Right paddle collision (AI)
    if (
      ballX + 15 >= gameWidth - (paddleWidth + 10) &&
      ballY + 15 >= paddleRightTop &&
      ballY <= paddleRightTop + paddleHeight
    ) {
      ballSpeedX *= -1;
      ballX = gameWidth - (paddleWidth + 10) - 15;
    }

    // Missed ball
    if (ballX < 0) {
      resetBall();
    }

    // AI paddle follows ball
    paddleRight.style.top = `${Math.min(Math.max(ballY - paddleHeight / 2, 0), gameHeight - paddleHeight)}px`;

    // Ball position update
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(update);
  }

  // Mouse or keyboard control setup
  if (controlMode === "mouse") {
    document.addEventListener("mousemove", (e) => {
      const gameTop = game.getBoundingClientRect().top;
      let mouseY = e.clientY - gameTop;

      if (mouseY >= 0 && mouseY <= gameHeight - paddleHeight) {
        paddleLeft.style.top = `${mouseY}px`;
      }
    });
  } else if (controlMode === "keyboard") {
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keysPressed[e.key] = true;
      }
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") {
        keysPressed[e.key] = false;
      }
    });
  }

  // Initial paddle positions
  paddleLeft.style.top = "210px";
  paddleRight.style.top = "210px";

  update();
}
