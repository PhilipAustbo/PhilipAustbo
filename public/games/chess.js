// === Globals ===
const board = document.getElementById('chessboard');
let currentTurn = 'white';
let draggedPiece = null;
let selectedSquare = null;
let enPassantTarget = null;

const hasMoved = {
    whiteKing: false,
    whiteRookLeft: false,
    whiteRookRight: false,
    blackKing: false,
    blackRookLeft: false,
    blackRookRight: false
  };
  

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

// === Setup Board ===
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

      img.addEventListener('dragstart', (e) => {
        const isWhite = !piece.endsWith('2');
        if ((isWhite && currentTurn === 'white') || (!isWhite && currentTurn === 'black')) {
          draggedPiece = e.target;
          const ghost = draggedPiece.cloneNode(true);
          ghost.style.width = '60px';
          ghost.style.height = '60px';
          e.dataTransfer.setDragImage(ghost, 30, 30);
          setTimeout(() => draggedPiece.style.opacity = '0.5', 0);
        } else {
          e.preventDefault();
        }
      });

      img.addEventListener('dragend', () => {
        if (draggedPiece) draggedPiece.style.opacity = '1';
        draggedPiece = null;
      });

      square.appendChild(img);
    }

    square.addEventListener('click', () => {
      const selectedPiece = square.querySelector('img');

      // Select piece
      if (selectedPiece && ((currentTurn === 'white' && !selectedPiece.alt.endsWith('2')) || (currentTurn === 'black' && selectedPiece.alt.endsWith('2')))) {
        selectedSquare = square;
        return;
      }

      // Attempt to move to clicked square
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

        const originContent = fromSquare.innerHTML;
        const targetContent = toSquare.innerHTML;

        fromSquare.innerHTML = '';
        if (toSquare.firstChild) toSquare.removeChild(toSquare.firstChild);

        toSquare.appendChild(dragged);

        // En passant capture
    if (piece.startsWith('pawn') && enPassantTarget && toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
        const captureRow = currentTurn === 'white' ? toRow + 1 : toRow - 1;
        const captureSquare = document.querySelector(`.square[data-row="${captureRow}"][data-col="${toCol}"]`);
        if (captureSquare) captureSquare.innerHTML = '';
    } 
    // Oppdater enPassantTarget
if (piece.startsWith('pawn') && Math.abs(toRow - fromRow) === 2) {
    enPassantTarget = { row: (fromRow + toRow) / 2, col: fromCol };
  } else {
    enPassantTarget = null;
  }
  
  

          // === Utfør rokade ===
if (piece.startsWith('king') && Math.abs(toCol - fromCol) === 2) {
    const rookFromCol = toCol > fromCol ? 7 : 0;
    const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
  
    const rookFromSquare = document.querySelector(`.square[data-row="${fromRow}"][data-col="${rookFromCol}"]`);
    const rookToSquare = document.querySelector(`.square[data-row="${fromRow}"][data-col="${rookToCol}"]`);
    const rook = rookFromSquare.querySelector('img');
  
    if (rook) {
      rookFromSquare.innerHTML = '';
      rookToSquare.appendChild(rook);
    }
  }

  // Marker at konge eller tårn har flyttet
if (piece === 'king') hasMoved.whiteKing = true;
if (piece === 'king2') hasMoved.blackKing = true;
if (piece === 'rook' && fromCol === 0) hasMoved.whiteRookLeft = true;
if (piece === 'rook' && fromCol === 7) hasMoved.whiteRookRight = true;
if (piece === 'rook2' && fromCol === 0) hasMoved.blackRookLeft = true;
if (piece === 'rook2' && fromCol === 7) hasMoved.blackRookRight = true;

  

        if (isKingInCheck(currentTurn === 'white')) {
          fromSquare.innerHTML = originContent;
          toSquare.innerHTML = targetContent;
          dragged.style.opacity = '1';
          selectedSquare = null;
          return;
        }

        document.querySelectorAll('.square.in-check').forEach(sq => sq.classList.remove('in-check'));
        const opponentIsWhite = currentTurn === 'white'; // fordi du ikke har byttet tur enda
const kingSq = findKing(opponentIsWhite);
if (isKingInCheck(opponentIsWhite) && kingSq) {
  kingSq.classList.add('in-check');
  if (isCheckmate(opponentIsWhite)) {
    setTimeout(() => alert(`${opponentIsWhite ? 'White' : 'Black'} is checkmated! Game over.`), 100);
  }
}

currentTurn = currentTurn === 'white' ? 'black' : 'white';


        dragged.draggable = true;
        dragged.style.opacity = '1';
        selectedSquare = null;
      }
    });

    square.addEventListener('dragover', (e) => e.preventDefault());

    square.addEventListener('drop', (e) => {
      e.preventDefault();
      if (!draggedPiece) return;

      const fromSquare = draggedPiece.parentElement;
      const toSquare = square;
      const fromRow = parseInt(fromSquare.dataset.row);
      const fromCol = parseInt(fromSquare.dataset.col);
      const toRow = parseInt(toSquare.dataset.row);
      const toCol = parseInt(toSquare.dataset.col);
      const piece = draggedPiece.alt;

      if (!isLegalMove(piece, fromRow, fromCol, toRow, toCol)) {
        draggedPiece.style.opacity = '1';
        draggedPiece = null;
        return;
      }

      const originContent = fromSquare.innerHTML;
      const targetContent = toSquare.innerHTML;

      fromSquare.innerHTML = '';
      if (toSquare.firstChild) toSquare.removeChild(toSquare.firstChild);
      toSquare.appendChild(draggedPiece);
      // En passant capture
if (piece.startsWith('pawn') && enPassantTarget && toRow === enPassantTarget.row && toCol === enPassantTarget.col) {
    const captureRow = currentTurn === 'white' ? toRow + 1 : toRow - 1;
    const captureSquare = document.querySelector(`.square[data-row="${captureRow}"][data-col="${toCol}"]`);
    if (captureSquare) captureSquare.innerHTML = '';
  }

  // Oppdater enPassantTarget
if (piece.startsWith('pawn') && Math.abs(toRow - fromRow) === 2) {
    enPassantTarget = { row: (fromRow + toRow) / 2, col: fromCol };
  } else {
    enPassantTarget = null;
  }
  
  

        // === Utfør rokade ===
if (piece.startsWith('king') && Math.abs(toCol - fromCol) === 2) {
    const rookFromCol = toCol > fromCol ? 7 : 0;
    const rookToCol = toCol > fromCol ? toCol - 1 : toCol + 1;
  
    const rookFromSquare = document.querySelector(`.square[data-row="${fromRow}"][data-col="${rookFromCol}"]`);
    const rookToSquare = document.querySelector(`.square[data-row="${fromRow}"][data-col="${rookToCol}"]`);
    const rook = rookFromSquare.querySelector('img');
  
    if (rook) {
      rookFromSquare.innerHTML = '';
      rookToSquare.appendChild(rook);
    }
  }

  // Marker at konge eller tårn har flyttet
if (piece === 'king') hasMoved.whiteKing = true;
if (piece === 'king2') hasMoved.blackKing = true;
if (piece === 'rook' && fromCol === 0) hasMoved.whiteRookLeft = true;
if (piece === 'rook' && fromCol === 7) hasMoved.whiteRookRight = true;
if (piece === 'rook2' && fromCol === 0) hasMoved.blackRookLeft = true;
if (piece === 'rook2' && fromCol === 7) hasMoved.blackRookRight = true;

  

      if (isKingInCheck(currentTurn === 'white')) {
        fromSquare.innerHTML = originContent;
        toSquare.innerHTML = targetContent;
        draggedPiece = fromSquare.querySelector('img');
        if (draggedPiece) draggedPiece.style.opacity = '1';
        draggedPiece = null;
        return;
      }

      document.querySelectorAll('.square.in-check').forEach(sq => sq.classList.remove('in-check'));
      const opponentIsWhite = currentTurn === 'white'; // fordi du ikke har byttet tur enda
const kingSq = findKing(opponentIsWhite);
if (isKingInCheck(opponentIsWhite) && kingSq) {
  kingSq.classList.add('in-check');
  if (isCheckmate(opponentIsWhite)) {
    setTimeout(() => alert(`${opponentIsWhite ? 'White' : 'Black'} is checkmated! Game over.`), 100);
  }
}

currentTurn = currentTurn === 'white' ? 'black' : 'white';


      draggedPiece.draggable = true;
      draggedPiece.style.opacity = '1';
      draggedPiece = null;
    });

    board.appendChild(square);
  }
}

function isStalemate(isWhite) {
    if (isKingInCheck(isWhite)) return false;
    const pieces = Array.from(document.querySelectorAll('#chessboard img')).filter(p =>
      isWhite ? !p.alt.endsWith('2') : p.alt.endsWith('2')
    );
  
    for (const piece of pieces) {
      const from = piece.parentElement;
      const fromRow = parseInt(from.dataset.row);
      const fromCol = parseInt(from.dataset.col);
  
      for (let toRow = 0; toRow < 8; toRow++) {
        for (let toCol = 0; toCol < 8; toCol++) {
          const toSquare = document.querySelector(`.square[data-row="${toRow}"][data-col="${toCol}"]`);
          const pieceType = piece.alt;
  
          if (isLegalMove(pieceType, fromRow, fromCol, toRow, toCol, true)) {
            const originalFrom = from.innerHTML;
            const originalTo = toSquare.innerHTML;
  
            from.innerHTML = '';
            toSquare.appendChild(piece);
  
            const stillInCheck = isKingInCheck(isWhite);
  
            from.innerHTML = originalFrom;
            toSquare.innerHTML = originalTo;
  
            if (!stillInCheck) return false;
          }
        }
      }
    }
  
    return true;
  }

function findKing(isWhite) {
  const pieces = document.querySelectorAll('#chessboard img');
  for (const piece of pieces) {
    if (piece.alt.startsWith('king') && (isWhite ? !piece.alt.endsWith('2') : piece.alt.endsWith('2'))) {
      return piece.parentElement;
    }
  }
  return null;
}

function isKingInCheck(isWhite) {
  const kingSquare = findKing(isWhite);
  if (!kingSquare) return false;
  const kingRow = parseInt(kingSquare.dataset.row);
  const kingCol = parseInt(kingSquare.dataset.col);
  const enemyPieces = Array.from(document.querySelectorAll('#chessboard img')).filter(p =>
    isWhite ? p.alt.endsWith('2') : !p.alt.endsWith('2')
  );
  for (const enemy of enemyPieces) {
    const from = enemy.parentElement;
    const fromRow = parseInt(from.dataset.row);
    const fromCol = parseInt(from.dataset.col);
    if (isLegalMove(enemy.alt, fromRow, fromCol, kingRow, kingCol, true)) {
      return true;
    }
  }
  return false;
}

function isCheckmate(isWhite) {
  const pieces = Array.from(document.querySelectorAll('#chessboard img')).filter(p =>
    isWhite ? !p.alt.endsWith('2') : p.alt.endsWith('2')
  );

  for (const piece of pieces) {
    const from = piece.parentElement;
    const fromRow = parseInt(from.dataset.row);
    const fromCol = parseInt(from.dataset.col);

    for (let toRow = 0; toRow < 8; toRow++) {
      for (let toCol = 0; toCol < 8; toCol++) {
        const toSquare = document.querySelector(`.square[data-row="${toRow}"][data-col="${toCol}"]`);
        const pieceType = piece.alt;

        if (isLegalMove(pieceType, fromRow, fromCol, toRow, toCol, true)) {
          const originalFrom = from.innerHTML;
          const originalTo = toSquare.innerHTML;

          from.innerHTML = '';
          toSquare.appendChild(piece);

          const stillInCheck = isKingInCheck(isWhite);

          from.innerHTML = originalFrom;
          toSquare.innerHTML = originalTo;

          if (!stillInCheck) return false;
        }
      }
    }
  }

  return true;
}

function isLegalMove(piece, fromRow, fromCol, toRow, toCol, skipTurnCheck = false) {
  const rowDiff = toRow - fromRow;
  const colDiff = toCol - fromCol;
  const absRow = Math.abs(rowDiff);
  const absCol = Math.abs(colDiff);

  const fromSquare = document.querySelector(`.square[data-row="${fromRow}"][data-col="${fromCol}"]`);
  const toSquare = document.querySelector(`.square[data-row="${toRow}"][data-col="${toCol}"]`);
  const targetPiece = toSquare.querySelector('img');
  const isWhite = !piece.endsWith('2');
  const isTargetWhite = targetPiece && !targetPiece.alt.endsWith('2');
  const sameSide = targetPiece && isWhite === isTargetWhite;

// === Castling ===
if (piece.startsWith('king') && fromRow === toRow && Math.abs(toCol - fromCol) === 2) {
    const isWhite = !piece.endsWith('2');
    if (!skipTurnCheck && ((isWhite && currentTurn !== 'white') || (!isWhite && currentTurn !== 'black'))) return false;
  
    const rookCol = toCol > fromCol ? 7 : 0;
    const path = toCol > fromCol ? [fromCol + 1, fromCol + 2] : [fromCol - 1, fromCol - 2, fromCol - 3];
    for (let col of path) {
      const square = document.querySelector(`.square[data-row="${fromRow}"][data-col="${col}"]`);
      if (square.querySelector('img')) return false;
    }
  
    const rookSquare = document.querySelector(`.square[data-row="${fromRow}"][data-col="${rookCol}"]`);
    const rook = rookSquare?.querySelector('img');
    if (!rook || !rook.alt.startsWith('rook')) return false;

    const isRookWhite = !rook.alt.endsWith('2');
    if (isWhite !== isRookWhite) return false;

    // Konge og tårn må ikke ha flyttet
if (isWhite) {
    if (hasMoved.whiteKing) return false;
    if (toCol > fromCol && hasMoved.whiteRookRight) return false;
    if (toCol < fromCol && hasMoved.whiteRookLeft) return false;
  } else {
    if (hasMoved.blackKing) return false;
    if (toCol > fromCol && hasMoved.blackRookRight) return false;
    if (toCol < fromCol && hasMoved.blackRookLeft) return false;
  }
  
  
    return true;
  }

  if (!skipTurnCheck && ((isWhite && currentTurn !== 'white') || (!isWhite && currentTurn !== 'black'))) return false;
  if (sameSide) return false;

  if (piece.startsWith('pawn')) {
    const direction = isWhite ? -1 : 1;
    const startRow = isWhite ? 6 : 1;
  
    // 1 frem
    if (colDiff === 0 && rowDiff === direction && !targetPiece) return true;
  
    // 2 frem
    if (colDiff === 0 && rowDiff === 2 * direction && fromRow === startRow) {
      const midRow = fromRow + direction;
      const midSquare = document.querySelector(`.square[data-row="${midRow}"][data-col="${fromCol}"]`);
      if (!targetPiece && !midSquare.querySelector('img')) return true;
    }
  
    // Slag diagonalt
    if (absCol === 1 && rowDiff === direction && targetPiece && !sameSide) return true;
  
    // En passant
    if (absCol === 1 && rowDiff === direction && !targetPiece &&
        enPassantTarget && enPassantTarget.row === toRow && enPassantTarget.col === toCol) {
      return true;
    }
  
    return false;
  }
  

  if (piece.startsWith('rook')) {
    if (fromRow === toRow || fromCol === toCol) {
      const rowStep = rowDiff === 0 ? 0 : rowDiff / absRow;
      const colStep = colDiff === 0 ? 0 : colDiff / absCol;
      for (let i = 1; i < Math.max(absRow, absCol); i++) {
        const checkRow = fromRow + rowStep * i;
        const checkCol = fromCol + colStep * i;
        const checkSquare = document.querySelector(`.square[data-row="${checkRow}"][data-col="${checkCol}"]`);
        if (checkSquare.querySelector('img')) return false;
      }
      return true;
    }
    return false;
  }

  if (piece.startsWith('knight')) {
    return (absRow === 2 && absCol === 1) || (absRow === 1 && absCol === 2);
  }

  if (piece.startsWith('bishop')) {
    if (absRow === absCol) {
      const rowStep = rowDiff / absRow;
      const colStep = colDiff / absCol;
      for (let i = 1; i < absRow; i++) {
        const checkRow = fromRow + rowStep * i;
        const checkCol = fromCol + colStep * i;
        const checkSquare = document.querySelector(`.square[data-row="${checkRow}"][data-col="${checkCol}"]`);
        if (checkSquare.querySelector('img')) return false;
      }
      return true;
    }
    return false;
  }

  if (piece.startsWith('queen')) {
    if (absRow === absCol || fromRow === toRow || fromCol === toCol) {
      const rowStep = rowDiff === 0 ? 0 : rowDiff / Math.abs(rowDiff);
      const colStep = colDiff === 0 ? 0 : colDiff / Math.abs(colDiff);
      let steps = Math.max(absRow, absCol);
      for (let i = 1; i < steps; i++) {
        const checkRow = fromRow + rowStep * i;
        const checkCol = fromCol + colStep * i;
        const checkSquare = document.querySelector(`.square[data-row="${checkRow}"][data-col="${checkCol}"]`);
        if (checkSquare.querySelector('img')) return false;
      }
      return true;
    }
    return false;
  }

  if (piece.startsWith('king')) {
    return absRow <= 1 && absCol <= 1;
  }

  return false;
}
