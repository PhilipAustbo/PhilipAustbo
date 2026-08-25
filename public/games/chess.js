const boardElement = document.getElementById('chessboard');
const statusElement = document.getElementById('game-status');
const resetButton = document.getElementById('reset-game');

const startingPosition = [
  ['rook2', 'knight2', 'bishop2', 'queen2', 'king2', 'bishop2', 'knight2', 'rook2'],
  Array(8).fill('pawn2'),
  ...Array.from({ length: 4 }, () => Array(8).fill(null)),
  Array(8).fill('pawn'),
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
];

let position;
let turn;
let selected;
let legalTargets;
let enPassant;
let castling;
let gameOver;

const clonePosition = source => source.map(row => [...row]);
const colorOf = piece => piece ? (piece.endsWith('2') ? 'black' : 'white') : null;
const typeOf = piece => piece?.replace('2', '') || null;
const opponent = color => color === 'white' ? 'black' : 'white';
const inside = (row, col) => row >= 0 && row < 8 && col >= 0 && col < 8;
const key = (row, col) => `${row},${col}`;

function resetGame() {
  position = clonePosition(startingPosition);
  turn = 'white';
  selected = null;
  legalTargets = [];
  enPassant = null;
  castling = { white: { king: true, queen: true }, black: { king: true, queen: true } };
  gameOver = false;
  render();
  updateStatus();
}

function squareIsAttacked(state, row, col, byColor) {
  for (let fromRow = 0; fromRow < 8; fromRow++) {
    for (let fromCol = 0; fromCol < 8; fromCol++) {
      const piece = state[fromRow][fromCol];
      if (colorOf(piece) !== byColor) continue;
      if (pseudoMoves(state, fromRow, fromCol, true).some(move => move.row === row && move.col === col)) return true;
    }
  }
  return false;
}

function kingInCheck(state, color) {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if (typeOf(state[row][col]) === 'king' && colorOf(state[row][col]) === color) {
        return squareIsAttacked(state, row, col, opponent(color));
      }
    }
  }
  return true;
}

function rayMoves(state, row, col, directions) {
  const moves = [];
  const color = colorOf(state[row][col]);
  directions.forEach(([rowStep, colStep]) => {
    let nextRow = row + rowStep;
    let nextCol = col + colStep;
    while (inside(nextRow, nextCol)) {
      if (!state[nextRow][nextCol]) moves.push({ row: nextRow, col: nextCol });
      else {
        if (colorOf(state[nextRow][nextCol]) !== color) moves.push({ row: nextRow, col: nextCol });
        break;
      }
      nextRow += rowStep;
      nextCol += colStep;
    }
  });
  return moves;
}

function pseudoMoves(state, row, col, attacksOnly = false) {
  const piece = state[row][col];
  if (!piece) return [];
  const color = colorOf(piece);
  const enemy = opponent(color);
  const type = typeOf(piece);
  const moves = [];

  if (type === 'pawn') {
    const step = color === 'white' ? -1 : 1;
    const start = color === 'white' ? 6 : 1;
    for (const colStep of [-1, 1]) {
      const targetRow = row + step;
      const targetCol = col + colStep;
      if (inside(targetRow, targetCol) && (attacksOnly || colorOf(state[targetRow][targetCol]) === enemy || enPassant?.row === targetRow && enPassant?.col === targetCol)) {
        moves.push({ row: targetRow, col: targetCol, enPassant: !state[targetRow][targetCol] });
      }
    }
    if (!attacksOnly && inside(row + step, col) && !state[row + step][col]) {
      moves.push({ row: row + step, col });
      if (row === start && !state[row + step * 2][col]) moves.push({ row: row + step * 2, col, doublePawn: true });
    }
    return moves;
  }

  if (type === 'rook') return rayMoves(state, row, col, [[1, 0], [-1, 0], [0, 1], [0, -1]]);
  if (type === 'bishop') return rayMoves(state, row, col, [[1, 1], [1, -1], [-1, 1], [-1, -1]]);
  if (type === 'queen') return rayMoves(state, row, col, [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]]);

  const offsets = type === 'knight'
    ? [[2, 1], [2, -1], [-2, 1], [-2, -1], [1, 2], [1, -2], [-1, 2], [-1, -2]]
    : [[1, 0], [-1, 0], [0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  offsets.forEach(([rowStep, colStep]) => {
    const targetRow = row + rowStep;
    const targetCol = col + colStep;
    if (inside(targetRow, targetCol) && colorOf(state[targetRow][targetCol]) !== color) moves.push({ row: targetRow, col: targetCol });
  });

  if (type === 'king' && !attacksOnly && !kingInCheck(state, color)) {
    const homeRow = color === 'white' ? 7 : 0;
    if (row === homeRow && col === 4) {
      if (castling[color].king && typeOf(state[homeRow][7]) === 'rook' && colorOf(state[homeRow][7]) === color && !state[homeRow][5] && !state[homeRow][6] && !squareIsAttacked(state, homeRow, 5, enemy) && !squareIsAttacked(state, homeRow, 6, enemy)) moves.push({ row: homeRow, col: 6, castle: 'king' });
      if (castling[color].queen && typeOf(state[homeRow][0]) === 'rook' && colorOf(state[homeRow][0]) === color && !state[homeRow][1] && !state[homeRow][2] && !state[homeRow][3] && !squareIsAttacked(state, homeRow, 3, enemy) && !squareIsAttacked(state, homeRow, 2, enemy)) moves.push({ row: homeRow, col: 2, castle: 'queen' });
    }
  }
  return moves;
}

function applyMove(state, from, move, simulation = false) {
  const next = clonePosition(state);
  const piece = next[from.row][from.col];
  const color = colorOf(piece);
  next[from.row][from.col] = null;
  if (move.enPassant) next[move.row + (color === 'white' ? 1 : -1)][move.col] = null;
  next[move.row][move.col] = piece;
  if (move.castle) {
    const rookFrom = move.castle === 'king' ? 7 : 0;
    const rookTo = move.castle === 'king' ? 5 : 3;
    next[move.row][rookTo] = next[move.row][rookFrom];
    next[move.row][rookFrom] = null;
  }
  if (typeOf(piece) === 'pawn' && (move.row === 0 || move.row === 7)) next[move.row][move.col] = color === 'white' ? 'queen' : 'queen2';
  if (!simulation) updateRights(piece, from, move, state[move.row][move.col]);
  return next;
}

function legalMoves(state, row, col) {
  const color = colorOf(state[row][col]);
  return pseudoMoves(state, row, col).filter(move => !kingInCheck(applyMove(state, { row, col }, move, true), color));
}

function updateRights(piece, from, move, capturedPiece) {
  const color = colorOf(piece);
  if (typeOf(piece) === 'king') castling[color] = { king: false, queen: false };
  if (typeOf(piece) === 'rook') {
    if (from.col === 0) castling[color].queen = false;
    if (from.col === 7) castling[color].king = false;
  }
  if (typeOf(capturedPiece) === 'rook') {
    const capturedColor = colorOf(capturedPiece);
    if (move.col === 0) castling[capturedColor].queen = false;
    if (move.col === 7) castling[capturedColor].king = false;
  }
}

function allLegalMoves(color) {
  const moves = [];
  for (let row = 0; row < 8; row++) for (let col = 0; col < 8; col++) {
    if (colorOf(position[row][col]) === color) legalMoves(position, row, col).forEach(move => moves.push({ from: { row, col }, move }));
  }
  return moves;
}

function chooseSquare(row, col) {
  if (gameOver) return;
  const piece = position[row][col];
  const destination = legalTargets.find(move => move.row === row && move.col === col);
  if (selected && destination) {
    const movingPiece = position[selected.row][selected.col];
    position = applyMove(position, selected, destination);
    enPassant = destination.doublePawn ? { row: (selected.row + destination.row) / 2, col } : null;
    turn = opponent(turn);
    selected = null;
    legalTargets = [];
    render();
    updateStatus(movingPiece);
    return;
  }
  if (piece && colorOf(piece) === turn) {
    selected = { row, col };
    legalTargets = legalMoves(position, row, col);
  } else {
    selected = null;
    legalTargets = [];
  }
  render();
}

function updateStatus() {
  const moves = allLegalMoves(turn);
  const check = kingInCheck(position, turn);
  if (!moves.length) {
    gameOver = true;
    const winner = opponent(turn);
    statusElement.textContent = check ? `${winner[0].toUpperCase() + winner.slice(1)} wins by checkmate.` : 'Draw by stalemate.';
  } else {
    statusElement.textContent = `${turn[0].toUpperCase() + turn.slice(1)} to move${check ? '. Check!' : ''}`;
  }
}

function render() {
  boardElement.innerHTML = '';
  const targets = new Set(legalTargets.map(move => key(move.row, move.col)));
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement('button');
      square.type = 'button';
      square.className = `square ${(row + col) % 2 ? 'dark' : 'light'}`;
      square.dataset.row = row;
      square.dataset.col = col;
      square.setAttribute('aria-label', `${String.fromCharCode(97 + col)}${8 - row}${position[row][col] ? `, ${position[row][col]}` : ''}`);
      if (selected?.row === row && selected?.col === col) square.classList.add('selected');
      if (targets.has(key(row, col))) square.classList.add(position[row][col] ? 'capture' : 'highlight');
      if (typeOf(position[row][col]) === 'king' && kingInCheck(position, colorOf(position[row][col]))) square.classList.add('in-check');
      square.addEventListener('click', () => chooseSquare(row, col));
      square.addEventListener('dragover', event => event.preventDefault());
      square.addEventListener('drop', event => {
        event.preventDefault();
        if (!selected) return;
        chooseSquare(row, col);
      });
      const piece = position[row][col];
      if (piece) {
        const image = document.createElement('img');
        image.src = `../images/${piece}.svg`;
        image.alt = '';
        image.draggable = colorOf(piece) === turn;
        image.addEventListener('dragstart', event => {
          if (colorOf(piece) !== turn) return event.preventDefault();
          selected = { row, col };
          legalTargets = legalMoves(position, row, col);
          event.dataTransfer.effectAllowed = 'move';
          requestAnimationFrame(render);
        });
        square.appendChild(image);
      }
      boardElement.appendChild(square);
    }
  }
}

resetButton.addEventListener('click', resetGame);
resetGame();
