let controlMode = null;
let playerName = null;
let playerCount = JSON.parse(localStorage.getItem("pongPlayerCount")) || 1;
let paddleLeftY = 210;
let keysPressed = { ArrowUp: false, ArrowDown: false };
const paddleSpeed = 7;
let isPaused = false;

const client = supabase.createClient(
  "https://shnjtccaqhqiuwjukszf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNobmp0Y2NhcWhxaXV3anVrc3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDc3OTksImV4cCI6MjA2MjE4Mzc5OX0.EEn6yXXolKowQmwiC4YzkT-o2MmUO3T3-igveXt3k0M"
);

function getGameDimensions() {
  const game = document.getElementById("game");
  return { w: game.clientWidth, h: game.clientHeight };
}

async function saveScore(name, hits) {
  const { error } = await client.from("leaderboard").insert([{ name, hits }]);
  if (error) console.error("Error saving score:", error.message);
}

async function fetchLeaderboard() {
  const { data, error } = await client
    .from("leaderboard")
    .select("*")
    .order("hits", { ascending: false })
    .limit(5);
  if (error) return [];
  return data;
}

function startGame(selectedControl) {
  const nameInput = document.getElementById("player-name").value.trim();
  playerName = nameInput || `Player ${playerCount}`;
  if (!nameInput) {
    playerCount++;
    localStorage.setItem("pongPlayerCount", JSON.stringify(playerCount));
  }

  controlMode = selectedControl;
  document.getElementById("setup-overlay").style.display = "none";
  initGame();
}

function initGame() {
  const game = document.getElementById("game");
  let { w: gameWidth, h: gameHeight } = getGameDimensions();

  const ball = document.getElementById("ball");
  const paddleLeft = document.getElementById("paddle-left");
  const paddleRight = document.getElementById("paddle-right");

  const hitDisplay = document.createElement("div");
  hitDisplay.className = "hit-display";
  hitDisplay.textContent = "Hits: 0";
  game.appendChild(hitDisplay);

  const highScoreDisplay = document.createElement("div");
  highScoreDisplay.className = "high-score";
  highScoreDisplay.textContent = "High Score: 0";
  game.appendChild(highScoreDisplay);

  const leaderboard = document.createElement("div");
  leaderboard.className = "leaderboard";
  leaderboard.innerHTML = "<strong>Leaderboard</strong><br>(Top 5 Hits)";
  game.appendChild(leaderboard);

  const pauseDisplay = document.createElement("div");
  pauseDisplay.className = "pause-display";
  pauseDisplay.textContent = "Paused";
  game.appendChild(pauseDisplay);

  const newHighDisplay = document.createElement("div");
  newHighDisplay.className = "new-high";
  newHighDisplay.textContent = "🎉 New High Score!";
  game.appendChild(newHighDisplay);

  let hasShownNewHighScore = false;
  let playerHits = 0;
  let highScore = 0;

  let ballX = gameWidth / 2;
  let ballY = gameHeight / 2;
  let ballSpeedX = 4;
  let ballSpeedY = 4;

  const maxBallSpeed = 12;
  const speedIncrement = 0.3;

  function updateSizes() {
    ({ w: gameWidth, h: gameHeight } = getGameDimensions());

    const isMobile = window.innerWidth < 800;
    const paddleW = isMobile ? gameWidth * 0.0125 : 10;
    const paddleH = isMobile ? gameHeight * 0.16 : 80;
    const ballSize = isMobile ? gameWidth * 0.01875 : 15;

    paddleLeft.style.width = paddleRight.style.width = `${paddleW}px`;
    paddleLeft.style.height = paddleRight.style.height = `${paddleH}px`;
    ball.style.width = ball.style.height = `${ballSize}px`;

    return { paddleW, paddleH, ballSize };
  }

  async function resetBall() {
    
    ({ w: gameWidth, h: gameHeight } = getGameDimensions());
    ballX = gameWidth / 2;
    ballY = gameHeight / 2;
    ballSpeedX = 4 * Math.sign(ballSpeedX || 1);
    ballSpeedY = 4 * Math.sign(ballSpeedY || 1);

    if (playerHits > 0) {
      let shouldSave = false;
      hasShownNewHighScore = false;

      const topScores = await fetchLeaderboard();
      const lowestTop = topScores[topScores.length - 1]?.hits || 0;
      if (playerHits > lowestTop || topScores.length < 5) shouldSave = true;

      const { data: scores, error } = await client
        .from("leaderboard")
        .select("hits")
        .eq("name", playerName)
        .order("hits", { ascending: false })
        .limit(1);

      if (!error) {
        if (scores.length === 0 || playerHits > scores[0].hits) {
          shouldSave = true;
          isNewPersonalBest = true;
        }
      }

      if (shouldSave) {
        await saveScore(playerName, playerHits);
        await renderLeaderboard();
      } else {
        console.log("❌ Score not saved (not high enough or duplicate)");
      }
    }

    playerHits = 0;
    hitDisplay.textContent = `Hits: ${playerHits}`;
  }

  function showNewHighScore() {
    newHighDisplay.style.display = "block";
    newHighDisplay.style.opacity = "1";
    setTimeout(() => {
      newHighDisplay.style.opacity = "0";
      setTimeout(() => {
        newHighDisplay.style.display = "none";
      }, 1000);
    }, 2000);
  }

  async function renderLeaderboard() {
    const scores = await fetchLeaderboard();
    let html = "<strong>Leaderboard</strong><br>(Top 5 Hits)<br>";
    scores.forEach((entry, i) => {
      html += `${i + 1}. ${entry.name}: ${entry.hits} hits<br>`;
    });
    leaderboard.innerHTML = html;
  }

  function update() {
    const { paddleW, paddleH, ballSize } = updateSizes();

    if (isPaused) {
      requestAnimationFrame(update);
      return;
    }

    if (controlMode === "keyboard") {
      if (keysPressed.ArrowUp) paddleLeftY = Math.max(paddleLeftY - paddleSpeed, 0);
      if (keysPressed.ArrowDown) paddleLeftY = Math.min(paddleLeftY + paddleSpeed, gameHeight - paddleH);
      paddleLeft.style.top = `${paddleLeftY}px`;
    }

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY <= 0 || ballY + ballSize >= gameHeight) ballSpeedY *= -1;

    const paddleLeftTop = parseInt(paddleLeft.style.top);
    const paddleRightTop = parseInt(paddleRight.style.top);

    if (
      ballX <= paddleW + 10 &&
      ballY + ballSize >= paddleLeftTop &&
      ballY <= paddleLeftTop + paddleH
    ) {
      ballSpeedX *= -1;
      ballX = paddleW + 10;
      if (Math.abs(ballSpeedX) < maxBallSpeed) ballSpeedX += (ballSpeedX > 0 ? speedIncrement : -speedIncrement);
      if (Math.abs(ballSpeedY) < maxBallSpeed) ballSpeedY += (ballSpeedY > 0 ? speedIncrement : -speedIncrement);
      playerHits++;
      hitDisplay.textContent = `Hits: ${playerHits}`;
      if (playerHits > highScore) {
        highScore = playerHits;
        highScoreDisplay.textContent = `High Score: ${highScore}`;
        if (!hasShownNewHighScore) {
          showNewHighScore();
          hasShownNewHighScore = true;
        }
      }
    }

    if (
      ballX + ballSize >= gameWidth - (paddleW + 10) &&
      ballY + ballSize >= paddleRightTop &&
      ballY <= paddleRightTop + paddleH
    ) {
      ballSpeedX *= -1;
      ballX = gameWidth - (paddleW + 10) - ballSize;
    }

    if (ballX < 0) resetBall();

    paddleRight.style.top = `${Math.min(Math.max(ballY - paddleH / 2, 0), gameHeight - paddleH)}px`;
    ball.style.left = `${ballX}px`;
    ball.style.top = `${ballY}px`;

    requestAnimationFrame(update);
  }

  if (controlMode === "mouse") {
    document.addEventListener("mousemove", (e) => {
      const gameTop = game.getBoundingClientRect().top;
      let mouseY = e.clientY - gameTop;
      if (mouseY >= 0 && mouseY <= gameHeight - 80)
        paddleLeft.style.top = `${mouseY}px`;
    });
  } else {
    document.addEventListener("keydown", (e) => {
      if (e.code === "Space") {
        isPaused = !isPaused;
        pauseDisplay.style.display = isPaused ? "block" : "none";
        return;
      }
      if (e.key === "ArrowUp" || e.key === "ArrowDown") keysPressed[e.key] = true;
    });
    document.addEventListener("keyup", (e) => {
      if (e.key === "ArrowUp" || e.key === "ArrowDown") keysPressed[e.key] = false;
    });
  }

  paddleLeft.style.top = "210px";
  paddleRight.style.top = "210px";

  renderLeaderboard();
  update();
}

document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('dark-mode') === 'enabled') {
    document.body.classList.add('dark-mode');
  }

  document.getElementById('darkModeToggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('dark-mode',
      document.body.classList.contains('dark-mode') ? 'enabled' : 'disabled');
  });

  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');
  burger?.addEventListener('click', () => {
    burger.classList.toggle('active');
    navMenu.classList.toggle('open');
  });
});
