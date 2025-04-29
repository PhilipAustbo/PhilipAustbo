const gameWidth = 800;
const gameHeight = 500;

let controlMode = null;
let playerName = null;
let playerCount = JSON.parse(localStorage.getItem("pongPlayerCount")) || 1;

function startGame(selectedControl) {
  // Get player name or assign default
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
  const ball = document.getElementById("ball");
  const paddleLeft = document.getElementById("paddle-left");
  const paddleRight = document.getElementById("paddle-right");

  // Hit counter display
  const hitDisplay = document.createElement("div");
  hitDisplay.style.color = "white";
  hitDisplay.style.fontSize = "20px";
  hitDisplay.style.position = "absolute";
  hitDisplay.style.bottom = "20px";
  hitDisplay.style.left = "20px";
  hitDisplay.textContent = "Hits: 0";
  document.getElementById("game").appendChild(hitDisplay);

  // High score display
  const highScoreDisplay = document.createElement("div");
  highScoreDisplay.style.color = "white";
  highScoreDisplay.style.fontSize = "20px";
  highScoreDisplay.style.position = "absolute";
  highScoreDisplay.style.bottom = "20px";
  highScoreDisplay.style.right = "20px";
  highScoreDisplay.textContent = "High Score: 0";
  document.getElementById("game").appendChild(highScoreDisplay);

  // Leaderboard display
  const leaderboard = document.createElement("div");
  leaderboard.style.color = "white";
  leaderboard.style.fontSize = "16px";
  leaderboard.style.position = "absolute";
  leaderboard.style.top = "20px";
  leaderboard.style.right = "20px";
  leaderboard.innerHTML = "<strong>Leaderboard</strong><br>(Top 5 Hits)";
  document.getElementById("game").appendChild(leaderboard);

  // Load leaderboard from localStorage
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

    // Update leaderboard if player had hits
    if (playerHits > 0) {
      leaderboardScores.push({ name: playerName, hits: playerHits });
      leaderboardScores.sort((a, b) => b.hits - a.hits);
      leaderboardScores = leaderboardScores.slice(0, 5); // keep top 5

      // Save to localStorage
      localStorage.setItem("pongLeaderboard", JSON.stringify(leaderboardScores));
      renderLeaderboard();
    }

    // Reset hit streak
    playerHits = 0;
    hitDisplay.textContent = `Hits: ${playerHits}`;
  }

  function update() {
    // Move ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off top and bottom
    if (ballY <= 0 || ballY + 15 >= gameHeight) {
      ballSpeedY *= -1;
    }

    const paddleLeftY = parseInt(paddleLeft.style.top);
    const paddleRightY = parseInt(paddleRight.style.top);

    // Left paddle collision
    if (
      ballX <= paddleWidth + 10 &&
      ballY + 15 >= paddleLeftY &&
      ballY <= paddleLeftY + paddleHeight
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
      ballY + 15 >= paddleRightY &&
      ballY <= paddleRightY + paddleHeight
    ) {
      ballSpeedX *= -1;
      ballX = gameWidth - (paddleWidth + 10) - 15;
    }

    // Reset if player misses
    if (ballX < 0) {
      resetBall();
    }

    // AI unbeatable: follow ball
    paddleRight.style.top = `${Math.min(Math.max(ballY - paddleHeight / 2, 0), gameHeight - paddleHeight)}px`;

    // Ball position
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(update);
  }

  // Paddle control setup
  let paddleLeftY = 210;

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
      if (e.key === "ArrowUp") {
        paddleLeftY = Math.max(paddleLeftY - 10, 0);
      } else if (e.key === "ArrowDown") {
        paddleLeftY = Math.min(paddleLeftY + 10, gameHeight - paddleHeight);
      }
      paddleLeft.style.top = `${paddleLeftY}px`;
    });
  }

  // Set initial paddle positions
  paddleLeft.style.top = "210px";
  paddleRight.style.top = "210px";

  update();
}
