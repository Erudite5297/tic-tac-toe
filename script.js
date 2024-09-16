const cells = document.querySelectorAll(".cell");
const gameStatus = document.getElementById("game-status");
const restartButton = document.getElementById("restartButton");
const winningLine = document.getElementById("winning-line");
let isXNext = true;  // Keep track of which player's turn it is
let board = Array(9).fill(null);  // Store the board state

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
];

function startGame() {
  cells.forEach((cell, index) => {
    cell.addEventListener("click", () => handleClick(index), { once: true });
  });
  restartButton.addEventListener("click", restartGame);
  gameStatus.textContent = "Player X's turn";
  winningLine.style.display = "none"; // Hide the winning line at start
}

function handleClick(index) {
  // Mark the cell based on the player's turn
  board[index] = isXNext ? "X" : "O";
  cells[index].textContent = isXNext ? "X" : "O";
  cells[index].classList.add(isXNext ? "x" : "o");
  
  if (checkWinner()) {
    gameStatus.textContent = ` ${isXNext ? "X" : "O"} na kagrehey`;
    endGame();
  } else if (isDraw()) {
    gameStatus.textContent = "Draw tare noigise!";
    endGame();
  } else {
    // Switch turns
    isXNext = !isXNext;
    gameStatus.textContent = `Player ${isXNext ? "X" : "O"}'s turn`;
  }
}

function checkWinner() {
  const winningCombination = WINNING_COMBINATIONS.find(combination => {
    return combination.every(index => {
      return board[index] && board[index] === board[combination[0]];
    });
  });

  if (winningCombination) {
    drawWinningLine(winningCombination);
    return true;
  }
  return false;
}

function drawWinningLine(combination) {
  const [a, b, c] = combination;
  const cellElements = [...cells];
  const xPos = cellElements[a].offsetLeft + cellElements[a].offsetWidth / 2;
  const yPos = cellElements[a].offsetTop + cellElements[a].offsetHeight / 2;
  const xEnd = cellElements[c].offsetLeft + cellElements[c].offsetWidth / 2;
  const yEnd = cellElements[c].offsetTop + cellElements[c].offsetHeight / 2;

  // Determine the angle and position for the line
  const angle = Math.atan2(yEnd - yPos, xEnd - xPos) * 180 / Math.PI;
  const length = Math.hypot(xEnd - xPos, yEnd - yPos);

  winningLine.style.width = `${length}px`;
  winningLine.style.transform = `rotate(${angle}deg)`;
  winningLine.style.top = `${yPos}px`;
  winningLine.style.left = `${xPos}px`;
  winningLine.style.display = "block"; // Show the winning line
}

function isDraw() {
  return board.every(cell => cell !== null);
}

function endGame() {
  // Prevent further clicks on cells
  cells.forEach(cell => {
    cell.removeEventListener("click", handleClick);
  });
}

function restartGame() {
  // Reset the game state
  board = Array(9).fill(null);
  isXNext = true;
  gameStatus.textContent = "Player X's turn";
  winningLine.style.display = "none"; // Hide the winning line

  cells.forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("x", "o");
    cell.addEventListener("click", () => handleClick([...cells].indexOf(cell)), { once: true });
  });
}

startGame();
