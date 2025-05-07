const gameWidth = 800;
const gameHeight = 500;

let controlMode = null;
let playerName = null;
let playerCount = JSON.parse(localStorage.getItem("pongPlayerCount")) || 1;
let paddleLeftY = 210;
let keysPressed = { ArrowUp: false, ArrowDown: false };
const paddleSpeed = 7;
let isPaused = false;

// ✅ Supabase setup
const client = supabase.createClient(
  "https://shnjtccaqhqiuwjukszf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNobmp0Y2NhcWhxaXV3anVrc3pmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY2MDc3OTksImV4cCI6MjA2MjE4Mzc5OX0.EEn6yXXolKowQmwiC4YzkT-o2MmUO3T3-igveXt3k0M"
);

async function saveScore(name, hits) {
  const { error } = await client.from("leaderboard").insert([{ name, hits }]);
  if (error) console.error("Error saving score:", error.message);
  else console.log("✅ Score saved:", name, hits);
}

async function fetchLeaderboard() {
  const { data, error } = await client
    .from("leaderboard")
    .select("*")
    .order("hits", { ascending: false })
    .limit(5);
  if (error) {
    console.error("Error fetching leaderboard:", error.message);
    return [];
  }
  console.log("📊 Fetched leaderboard:", data);
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
  let hasShownNewHighScore = false;
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

  // 🎉 New High Score animation
  const newHighDisplay = document.createElement("div");
  newHighDisplay.style = `
    position: absolute;
    top: 40%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: gold;
    font-size: 36px;
    font-weight: bold;
    display: none;
    opacity: 1;
    transition: opacity 1s ease-out;
  `;
  newHighDisplay.textContent = "🎉 New High Score!";
  game.appendChild(newHighDisplay);

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

  // 🎮 Game variables
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
    hasShownNewHighScore = false;


  
    if (playerHits > 0) {
      let shouldSave = false;
  
      // 1. Fetch top 5 leaderboard
      const topScores = await fetchLeaderboard();
  
      // 2. Check if this score beats any of the top 5
      const lowestTopScore = topScores[topScores.length - 1]?.hits || 0;
      if (playerHits > lowestTopScore || topScores.length < 5) {
        shouldSave = true;
      }
  
      // 3. Check if it's the player's best score ever
      const { data: playerScores, error } = await client
        .from("leaderboard")
        .select("hits")
        .eq("name", playerName)
        .order("hits", { ascending: false })
        .limit(1);
  
      if (!error && playerScores.length > 0) {
        const best = playerScores[0].hits;
        if (playerHits > best) {
          shouldSave = true;
        }
      } else if (!error && playerScores.length === 0) {
        // First-time player
        shouldSave = true;
      }
  
      // 4. Save if relevant
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

    // Collision with left paddle
    if (
      ballX <= paddleWidth + 10 &&
      ballY + 15 >= paddleLeftTop &&
      ballY <= paddleLeftTop + paddleHeight
    ) {
      ballSpeedX *= -1;
      ballX = paddleWidth + 10;
      if (Math.abs(ballSpeedX) < maxBallSpeed) ballSpeedX += ballSpeedX > 0 ? speedIncrement : -speedIncrement;
      if (Math.abs(ballSpeedY) < maxBallSpeed) ballSpeedY += ballSpeedY > 0 ? speedIncrement : -speedIncrement;

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

    // Collision with right (AI)
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

  // Controls
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

  renderLeaderboard();
  update();
}

const burger = document.getElementById("burger");
const navMenu = document.getElementById("navMenu");

burger.addEventListener("click", () => {
  navMenu.classList.toggle("open");
  burger.classList.toggle("active");
  document.querySelector("header").classList.toggle("open");
});

// Optional: Dark Mode Toggle
const darkBtn = document.getElementById("darkModeToggle");
darkBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});