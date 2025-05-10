const board = document.getElementById('chessboard');

let currentTurn = 'white';
let draggedPiece = null;

// Startoppsett
const initialPosition = [
  ['rook2', 'knight2', 'bishop2', 'queen2', 'king2', 'bishop2', 'knight2', 'rook2'],
  ['pawn2', 'pawn2', 'pawn2', 'pawn2', 'pawn2', 'pawn2', 'pawn2', 'pawn2'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn', 'pawn'],
  ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'],
];

// Generer brett og legg til brikker
for (let row = 0; row < 8; row++) {
  for (let col = 0; col < 8; col++) {
    const square = document.createElement('div');
    square.classList.add('square');
    square.classList.add((row + col) % 2 === 0 ? 'light' : 'dark');
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

      // Drag start
      img.addEventListener('dragstart', (e) => {
        const isWhite = !piece.endsWith('2');
        const isWhitesTurn = currentTurn === 'white';

        if ((isWhite && isWhitesTurn) || (!isWhite && !isWhitesTurn)) {
          draggedPiece = e.target;
          setTimeout(() => draggedPiece.style.display = 'none', 0);
        } else {
          e.preventDefault();
        }
      });

      // Drag end
      img.addEventListener('dragend', () => {
        if (draggedPiece) draggedPiece.style.display = 'block';
        draggedPiece = null;
      });

      square.appendChild(img);
    }

    // Drag over
    square.addEventListener('dragover', (e) => {
      e.preventDefault();
      square.classList.add('drag-over');
    });

    square.addEventListener('dragleave', () => {
      square.classList.remove('drag-over');
    });

    // Drop
    square.addEventListener('drop', (e) => {
      e.preventDefault();
      square.classList.remove('drag-over');

      if (draggedPiece) {
        const fromSquare = draggedPiece.parentElement;
        fromSquare.innerHTML = '';
        square.appendChild(draggedPiece);

        // Bytt tur
        currentTurn = currentTurn === 'white' ? 'black' : 'white';
      }
    });

    board.appendChild(square);
  }
}
