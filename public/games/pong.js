const game = document.getElementById('game');
const canvas = document.getElementById('pong-canvas');
const context = canvas.getContext('2d');
const startOverlay = document.getElementById('start-overlay');
const pauseOverlay = document.getElementById('pause-overlay');
const message = document.getElementById('game-message');
const playerScoreElement = document.getElementById('player-score');
const computerScoreElement = document.getElementById('computer-score');

const state = {
  width: 960, height: 540, running: false, paused: false, finished: false,
  playerScore: 0, computerScore: 0, lastTime: 0, serveAt: 0,
  keys: { up: false, down: false },
  player: { x: 25, y: 220, width: 12, height: 100 },
  computer: { x: 923, y: 220, width: 12, height: 100 },
  ball: { x: 472, y: 262, size: 16, vx: 360, vy: 100 }
};

function resize() {
  const rect = game.getBoundingClientRect();
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(rect.width * ratio);
  canvas.height = Math.round(rect.height * ratio);
  state.width = rect.width;
  state.height = rect.height;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  const paddleHeight = Math.max(62, state.height * .2);
  state.player.width = state.computer.width = Math.max(8, state.width * .012);
  state.player.height = state.computer.height = paddleHeight;
  state.player.x = state.width * .025;
  state.computer.x = state.width - state.width * .025 - state.computer.width;
  state.player.y = Math.min(state.player.y, state.height - paddleHeight);
  state.computer.y = Math.min(state.computer.y, state.height - paddleHeight);
  state.ball.size = Math.max(11, state.width * .016);
  draw();
}

function resetBall(direction = Math.random() > .5 ? 1 : -1) {
  state.ball.x = (state.width - state.ball.size) / 2;
  state.ball.y = (state.height - state.ball.size) / 2;
  const speed = Math.max(260, state.width * .39);
  const angle = (Math.random() * .7 - .35);
  state.ball.vx = Math.cos(angle) * speed * direction;
  state.ball.vy = Math.sin(angle) * speed;
  state.serveAt = performance.now() + 650;
}

function resetGame(autoStart = false) {
  state.playerScore = 0;
  state.computerScore = 0;
  state.finished = false;
  state.paused = false;
  state.player.y = (state.height - state.player.height) / 2;
  state.computer.y = (state.height - state.computer.height) / 2;
  updateScore();
  message.textContent = 'First to 7';
  pauseOverlay.hidden = true;
  resetBall(1);
  state.running = autoStart;
  startOverlay.style.display = autoStart ? 'none' : 'flex';
  state.lastTime = performance.now();
  game.dataset.state = autoStart ? 'playing' : 'ready';
  draw();
}

function startGame() {
  if (state.finished) resetGame(true);
  else {
    state.running = true;
    state.paused = false;
    state.lastTime = performance.now();
    startOverlay.style.display = 'none';
    game.dataset.state = 'playing';
  }
  game.focus();
}

function togglePause() {
  if (!state.running || state.finished) return;
  state.paused = !state.paused;
  pauseOverlay.hidden = !state.paused;
  game.dataset.state = state.paused ? 'paused' : 'playing';
  state.lastTime = performance.now();
}

function updateScore() {
  playerScoreElement.textContent = state.playerScore;
  computerScoreElement.textContent = state.computerScore;
  game.dataset.playerScore = state.playerScore;
  game.dataset.computerScore = state.computerScore;
}

function scorePoint(playerScored) {
  if (playerScored) state.playerScore += 1;
  else state.computerScore += 1;
  updateScore();
  const winner = state.playerScore >= 7 ? 'You win!' : state.computerScore >= 7 ? 'Computer wins' : null;
  if (winner) {
    state.finished = true;
    state.running = false;
    message.textContent = winner;
    startOverlay.querySelector('p').textContent = winner;
    startOverlay.querySelector('button').textContent = 'Play again';
    startOverlay.style.display = 'flex';
    game.dataset.state = 'finished';
  } else {
    message.textContent = playerScored ? 'Point to you' : 'Point to computer';
    resetBall(playerScored ? -1 : 1);
  }
}

function paddleCollision(paddle, leftPaddle) {
  const ball = state.ball;
  const overlapsY = ball.y + ball.size >= paddle.y && ball.y <= paddle.y + paddle.height;
  const overlapsX = leftPaddle
    ? ball.x <= paddle.x + paddle.width && ball.x + ball.size >= paddle.x
    : ball.x + ball.size >= paddle.x && ball.x <= paddle.x + paddle.width;
  const approaching = leftPaddle ? ball.vx < 0 : ball.vx > 0;
  if (!overlapsX || !overlapsY || !approaching) return;
  ball.x = leftPaddle ? paddle.x + paddle.width : paddle.x - ball.size;
  const relativeHit = ((ball.y + ball.size / 2) - (paddle.y + paddle.height / 2)) / (paddle.height / 2);
  const speed = Math.min(Math.hypot(ball.vx, ball.vy) * 1.045, state.width * .9);
  const angle = relativeHit * Math.PI * .33;
  ball.vx = Math.cos(angle) * speed * (leftPaddle ? 1 : -1);
  ball.vy = Math.sin(angle) * speed;
}

function update(delta, now) {
  if (!state.running || state.paused || state.finished || now < state.serveAt) return;
  const playerSpeed = state.height * 1.25;
  if (state.keys.up) state.player.y -= playerSpeed * delta;
  if (state.keys.down) state.player.y += playerSpeed * delta;
  state.player.y = Math.max(0, Math.min(state.height - state.player.height, state.player.y));

  const target = state.ball.y + state.ball.size / 2 - state.computer.height / 2;
  const aiSpeed = state.height * .72;
  const difference = target - state.computer.y;
  state.computer.y += Math.sign(difference) * Math.min(Math.abs(difference), aiSpeed * delta);
  state.computer.y = Math.max(0, Math.min(state.height - state.computer.height, state.computer.y));

  state.ball.x += state.ball.vx * delta;
  state.ball.y += state.ball.vy * delta;
  if (state.ball.y <= 0) { state.ball.y = 0; state.ball.vy = Math.abs(state.ball.vy); }
  if (state.ball.y + state.ball.size >= state.height) { state.ball.y = state.height - state.ball.size; state.ball.vy = -Math.abs(state.ball.vy); }
  paddleCollision(state.player, true);
  paddleCollision(state.computer, false);
  if (state.ball.x + state.ball.size < 0) scorePoint(false);
  else if (state.ball.x > state.width) scorePoint(true);
}

function draw() {
  context.clearRect(0, 0, state.width, state.height);
  context.fillStyle = '#1d1b19';
  context.fillRect(0, 0, state.width, state.height);
  context.strokeStyle = 'rgba(255,255,255,.38)';
  context.lineWidth = 2;
  context.setLineDash([12, 14]);
  context.beginPath(); context.moveTo(state.width / 2, 0); context.lineTo(state.width / 2, state.height); context.stroke();
  context.setLineDash([]);
  context.fillStyle = '#f3f0e8';
  context.fillRect(state.player.x, state.player.y, state.player.width, state.player.height);
  context.fillRect(state.computer.x, state.computer.y, state.computer.width, state.computer.height);
  context.beginPath();
  context.arc(state.ball.x + state.ball.size / 2, state.ball.y + state.ball.size / 2, state.ball.size / 2, 0, Math.PI * 2);
  context.fill();
}

function frame(now) {
  const delta = Math.min((now - state.lastTime) / 1000, .025);
  state.lastTime = now;
  update(delta, now);
  draw();
  requestAnimationFrame(frame);
}

function movePaddleTo(clientY) {
  const rect = game.getBoundingClientRect();
  state.player.y = Math.max(0, Math.min(state.height - state.player.height, clientY - rect.top - state.player.height / 2));
}

document.getElementById('start-game').addEventListener('click', startGame);
document.getElementById('new-game').addEventListener('click', () => resetGame(true));
window.addEventListener('resize', resize);
window.addEventListener('keydown', event => {
  if (['ArrowUp', 'ArrowDown', 'Space'].includes(event.code)) event.preventDefault();
  if (event.code === 'ArrowUp' || event.code === 'KeyW') state.keys.up = true;
  if (event.code === 'ArrowDown' || event.code === 'KeyS') state.keys.down = true;
  if (event.code === 'Space' && !event.repeat) togglePause();
});
window.addEventListener('keyup', event => {
  if (event.code === 'ArrowUp' || event.code === 'KeyW') state.keys.up = false;
  if (event.code === 'ArrowDown' || event.code === 'KeyS') state.keys.down = false;
});
game.addEventListener('pointermove', event => { if (state.running) movePaddleTo(event.clientY); });
game.addEventListener('pointerdown', event => { movePaddleTo(event.clientY); game.setPointerCapture?.(event.pointerId); });

resize();
resetGame(false);
requestAnimationFrame(frame);
