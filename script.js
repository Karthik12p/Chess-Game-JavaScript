const chessboard = document.getElementById('chessboard');
const resetButton = document.getElementById('reset-button');
const blackCaptured = document.getElementById('black-pieces');
const whiteCaptured = document.getElementById('white-pieces');
const turnIndicator = document.getElementById('turn-indicator');

const initialBoard = [
  ["♜", "♞", "♝", "♛", "♚", "♝", "♞", "♜"],
  ["♟", "♟", "♟", "♟", "♟", "♟", "♟", "♟"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["♙", "♙", "♙", "♙", "♙", "♙", "♙", "♙"],
  ["♖", "♘", "♗", "♕", "♔", "♗", "♘", "♖"]
];

let currentBoard = [];
let selectedSquare = null;
let capturedBlackPieces = [];
let capturedWhitePieces = [];
let isWhiteTurn = true;
let gameActive = true;

function initializeBoard() {
  currentBoard = JSON.parse(JSON.stringify(initialBoard));
  capturedBlackPieces = [];
  capturedWhitePieces = [];
  isWhiteTurn = true;
  gameActive = true;
  updateCapturedPieces();
  renderBoard();
  updateTurnIndicator();
}

function renderBoard() {
  chessboard.innerHTML = '';
  currentBoard.forEach((row, rowIndex) => {
    row.forEach((piece, colIndex) => {
      const square = document.createElement('div');
      square.classList.add('square', (rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark');
      square.dataset.row = rowIndex;
      square.dataset.col = colIndex;
      if (piece) square.textContent = piece;
      square.addEventListener('click', () => handleSquareClick(rowIndex, colIndex));
      chessboard.appendChild(square);
    });
  });
}

function handleSquareClick(row, col) {
  if (!gameActive) return; // Prevent further moves if the game is over

  if (selectedSquare) {
    movePiece(selectedSquare, { row, col });
    selectedSquare = null;
  } else {
    if (currentBoard[row][col]) {
      const piece = currentBoard[row][col];
      const isWhitePiece = piece.charCodeAt(0) >= 9812 && piece.charCodeAt(0) <= 9817;
      if (isWhiteTurn === isWhitePiece) {
        selectedSquare = { row, col };
      }
    }
  }
  renderBoard();
}

function movePiece(from, to) {
  const piece = currentBoard[from.row][from.col];
  const targetPiece = currentBoard[to.row][to.col];

  if (targetPiece) {
    const isWhitePiece = targetPiece.charCodeAt(0) >= 9812 && targetPiece.charCodeAt(0) <= 9817;
    if (isWhitePiece) {
      capturedWhitePieces.push(targetPiece);
    } else {
      capturedBlackPieces.push(targetPiece);
    }
    updateCapturedPieces();

    // Check if the captured piece is a king
    if (targetPiece === "♔" || targetPiece === "♚") {
      endGame(targetPiece === "♔" ? "Black" : "White");
      return;
    }
  }

  currentBoard[from.row][from.col] = null;
  currentBoard[to.row][to.col] = piece;

  isWhiteTurn = !isWhiteTurn;
  updateTurnIndicator();
}

function updateCapturedPieces() {
  blackCaptured.innerHTML = capturedBlackPieces.join(' ');
  whiteCaptured.innerHTML = capturedWhitePieces.join(' ');
}

function updateTurnIndicator() {
  turnIndicator.textContent = `Current Turn: ${isWhiteTurn ? 'White' : 'Black'}`;
}

function endGame(winner) {
  gameActive = false; // Stop further moves
  alert(`Game Over! ${winner} wins!`);
}

resetButton.addEventListener('click', initializeBoard);

initializeBoard();
