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
let isPaused = false;

// Supabase setup
const supabase = supabase.createClient(
  "https://your-project-id.supabase.co", // ← replace with your API URL
  "your-anon-key" // ← replace with your anon key
);

async function saveScore(name, hits) {
  const { error } = await supabase
    .from("leaderboard")
    .insert([{ name, hits }]);
  if (error) console.error("Error saving score:", error.message);
}

async function fetchLeaderboard() {
  const { data, error } = await supabase
    .from("leaderboard")
    .select("*")
    .order("hits", { ascending: false })
    .limit(5);
  if (error) {
    console.error("Error fetching leaderboard:", error.message);
    return [];
  }
  return data;
}

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

  const hitDisplay = document.createElement("div");
  hitDisplay.style = "color:white; font-size:20px; position:absolute; bottom:20px; left:20px;";
  hitDisplay.textContent = "Hits: 0";
  game.appendChild(hitDisplay);

  const highScoreDisplay = document.createElement("div");
  highScoreDisplay.style = "color:white; font-size:20px; position:absolute; bottom:20px; right:20px;";
  highScoreDisplay.textContent = "High Score: 0";
  game.appendChild(highScoreDisplay);

  const leaderboard = document.createElement("div");
  leaderboard.style = "color:white; font-size:16px; position:absolute; top:20px; right:20px;";
  leaderboard.innerHTML = "<strong>Leaderboard</strong><br>(Top 5 Hits)";
  game.appendChild(leaderboard);

  const pauseDisplay = document.createElement("div");
  pauseDisplay.style = "position:absolute; top:50%; left:50%; transform:translate(-50%,-50%); color:white; font-size:32px; display:none;";
  pauseDisplay.textContent = "Paused";
  game.appendChild(pauseDisplay);

  async function renderLeaderboard() {
    const scores = await fetchLeaderboard();
    let html = "<strong>Leaderboard</strong><br>(Top 5 Hits)<br>";
    scores.forEach((entry, i) => {
      html += `${i + 1}. ${entry.name}: ${entry.hits} hits<br>`;
    });
    leaderboard.innerHTML = html;
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
  const maxBallSpeed = 12;
  const speedIncrement = 0.3;

  async function resetBall() {
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballSpeedX = 4 * Math.sign(ballSpeedX || 1);
    ballSpeedY = 4 * Math.sign(ballSpeedY || 1);

    if (playerHits > 0) {
      await saveScore(playerName, playerHits);
      await renderLeaderboard();
    }

    playerHits = 0;
    hitDisplay.textContent = `Hits: ${playerHits}`;
  }

  function update() {
    if (isPaused) {
      requestAnimationFrame(update);
      return;
    }

    if (controlMode === "keyboard") {
      if (keysPressed.ArrowUp) paddleLeftY = Math.max(paddleLeftY - paddleSpeed, 0);
      if (keysPressed.ArrowDown) paddleLeftY = Math.min(paddleLeftY + paddleSpeed, gameHeight - paddleHeight);
      paddleLeft.style.top = `${paddleLeftY}px`;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + 15 >= gameHeight) ballSpeedY *= -1;

    const paddleLeftTop = parseInt(paddleLeft.style.top);
    const paddleRightTop = parseInt(paddleRight.style.top);

    if (
      ballX <= paddleWidth + 10 &&
      ballY + 15 >= paddleLeftTop &&
      ballY <= paddleLeftTop + paddleHeight
    ) {
      ballSpeedX *= -1;
      ballX = paddleWidth + 10;

      if (Math.abs(ballSpeedX) < maxBallSpeed)
        ballSpeedX += ballSpeedX > 0 ? speedIncrement : -speedIncrement;
      if (Math.abs(ballSpeedY) < maxBallSpeed)
        ballSpeedY += ballSpeedY > 0 ? speedIncrement : -speedIncrement;

      playerHits++;
      hitDisplay.textContent = `Hits: ${playerHits}`;
      if (playerHits > highScore) {
        highScore = playerHits;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
      }
    }

    if (
      ballX + 15 >= gameWidth - (paddleWidth + 10) &&
      ballY + 15 >= paddleRightTop &&
      ballY <= paddleRightTop + paddleHeight
    ) {
      ballSpeedX *= -1;
      ballX = gameWidth - (paddleWidth + 10) - 15;
    }

    if (ballX < 0) resetBall();

    paddleRight.style.top = `${Math.min(Math.max(ballY - paddleHeight / 2, 0), gameHeight - paddleHeight)}px`;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(update);
  }

  if (controlMode === "mouse") {
    document.addEventListener("mousemove", (e) => {
      const gameTop = game.getBoundingClientRect().top;
      let mouseY = e.clientY - gameTop;
      if (mouseY >= 0 && mouseY <= gameHeight - paddleHeight)
        paddleLeft.style.top = `${mouseY}px`;
    });
  } else if (controlMode === "keyboard") {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        isPaused = !isPaused;
        pauseDisplay.style.display = isPaused ? "block" : "none";
        return;
      }
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

  paddleLeft.style.top = "210px";
  paddleRight.style.top = "210px";

  update();
}
