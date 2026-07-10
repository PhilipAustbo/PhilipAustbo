// === Globals ===
const board = document.getElementById('chessboard');
let currentTurn = 'white';
let draggedPiece = null;
let selectedSquare = null;
let enPassantTarget = null;
let draggedFromSquare = null;

const hasMoved = {
  whiteKing: false,
  whiteRookLeft: false,
  whiteRookRight: false,
  blackKing: false,
  blackRookLeft: false,
  blackRookRight: false
};

function clearHighlights() {
  document.querySelectorAll('.highlight').forEach(sq => sq.classList.remove('highlight'));
}

function attachDragListeners(img) {
  img.addEventListener('dragstart', (e) => {
    const current = e.target;
    const pieceType = current.alt;
    const isWhite = !pieceType.endsWith('2');

    if ((isWhite && currentTurn === 'white') || (!isWhite && currentTurn === 'black')) {
      selectedSquare = null;
      clearHighlights();
      draggedPiece = current;
      draggedFromSquare = current.parentElement;

      const ghost = current.cloneNode(true);
      ghost.style.width = '60px';
      ghost.style.height = '60px';
      e.dataTransfer.setDragImage(ghost, 30, 30);
    } else {
      e.preventDefault();
    }
  });

  img.addEventListener('dragend', () => {
    if (draggedPiece) draggedPiece.style.opacity = '1';
    clearHighlights();
    draggedPiece = null;
    draggedFromSquare = null;
  });
}

function isLegalMove(piece, fromRow, fromCol, toRow, toCol) {
  // Simplified example logic (you can extend this)
  return true;
}

function isKingInCheck(isWhite) {
  // Dummy implementation
  return false;
}

function handleSquareClick(square) {
  const selectedPiece = square.querySelector('img');

  if (selectedPiece && ((currentTurn === 'white' && !selectedPiece.alt.endsWith('2')) || (currentTurn === 'black' && selectedPiece.alt.endsWith('2')))) {
    selectedSquare = square;
    clearHighlights();
    return;
  }

  if (selectedSquare && selectedSquare !== square) {
    const fromSquare = selectedSquare;
    const toSquare = square;
    const fromRow = parseInt(fromSquare.dataset.row);
    const fromCol = parseInt(fromSquare.dataset.col);
    const toRow = parseInt(toSquare.dataset.row);
    const toCol = parseInt(toSquare.dataset.col);
    const piece = fromSquare.querySelector('img')?.alt;
    const dragged = fromSquare.querySelector('img');

    if (!piece || !isLegalMove(piece, fromRow, fromCol, toRow, toCol)) {
      selectedSquare = null;
      return;
    }

    fromSquare.innerHTML = '';
    if (toSquare.firstChild) toSquare.removeChild(toSquare.firstChild);
    toSquare.appendChild(dragged);

    currentTurn = currentTurn === 'white' ? 'black' : 'white';
    selectedSquare = null;
    clearHighlights();
  }
}

function handleDrop(e, square) {
  e.preventDefault();
  if (!draggedPiece) return;

  const fromSquare = draggedFromSquare;
  const toSquare = square;
  const fromRow = parseInt(fromSquare.dataset.row);
  const fromCol = parseInt(fromSquare.dataset.col);
  const toRow = parseInt(toSquare.dataset.row);
  const toCol = parseInt(toSquare.dataset.col);
  const piece = draggedPiece.alt;

  if (!isLegalMove(piece, fromRow, fromCol, toRow, toCol)) {
    draggedPiece.style.opacity = '1';
    draggedPiece = null;
    clearHighlights();
    return;
  }

  fromSquare.innerHTML = '';
  if (toSquare.firstChild) toSquare.removeChild(toSquare.firstChild);
  toSquare.appendChild(draggedPiece);

  currentTurn = currentTurn === 'white' ? 'black' : 'white';
  draggedPiece.style.opacity = '1';
  draggedPiece = null;
  clearHighlights();
}

// === Initialize Board ===
const initialPosition = [
  ['rook2', 'knight2', 'bishop2', 'queen2', 'king2', 'bishop2', 'knight2', 'rook2'],
  ['pawn2', 'pawn2', 'pawn2', 'pawn2', 'pawn2', 'pawn2', 'pawn2', 'pawn2'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook']
];

for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    square.classList.add('square', (row + col) % 2 === 0 ? 'light' : 'dark');
    square.dataset.row = row;
    square.dataset.col = col;

    const piece = initialPosition[row][col];
    if (piece) {
      const img = document.createElement('img');
      img.src = `../images/${piece}.svg`;
      img.alt = piece;
      img.draggable = true;
      img.style.width = '100%';
      img.style.height = '100%';
      attachDragListeners(img);
      square.appendChild(img);
    }

    square.addEventListener('click', () => handleSquareClick(square));
    square.addEventListener('dragover', (e) => e.preventDefault());
    square.addEventListener('drop', (e) => handleDrop(e, square));

    board.appendChild(square);
  }
}
