// 15 Puzzle Game
let tiles = [];
let emptyCell = null;
let moveCount = 0;
let draggedTile = null;
let draggedFrom = null;

// Initialize the game
function initGame() {
    createTiles();
    setupBoard();
    resetGame();
}

// Create tile elements
function createTiles() {
    for (let i = 1; i <= 15; i++) {
        const tile = document.createElement('div');
        tile.className = 'tile';
        tile.id = `tile-${i}`;
        tile.draggable = true;
        tile.style.backgroundColor = getColorForTile(i);
        tile.style.display = 'flex';
        tile.style.alignItems = 'center';
        tile.style.justifyContent = 'center';
        tile.style.fontSize = '24px';
        tile.style.fontWeight = 'bold';
        tile.style.color = 'white';
        tile.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
        tile.textContent = i;

        tile.addEventListener('dragstart', handleDragStart);
        tile.addEventListener('dragend', handleDragEnd);

        tiles.push(tile);
    }
}

// Get a color for each tile
function getColorForTile(num) {
    const colors = [
        '#e74c3c', '#e67e22', '#f39c12', '#f1c40f',
        '#2ecc71', '#1abc9c', '#3498db', '#9b59b6',
        '#34495e', '#e84393', '#00b894', '#fdcb6e',
        '#6c5ce7', '#fd79a8', '#a29bfe'
    ];
    return colors[num - 1];
}

// Setup the board cells
function setupBoard() {
    const cells = document.querySelectorAll('.cell');
    cells.forEach((cell, index) => {
        cell.addEventListener('dragover', handleDragOver);
        cell.addEventListener('drop', handleDrop);

        // Also handle click-to-move
        cell.addEventListener('click', handleCellClick);
    });
}

// Handle drag start
function handleDragStart(e) {
    draggedTile = e.target;
    draggedFrom = e.target.parentNode;
    e.target.style.opacity = '0.5';
}

// Handle drag end
function handleDragEnd(e) {
    e.target.style.opacity = '1';
}

// Handle drag over
function handleDragOver(e) {
    const fromCell = draggedFrom;
    const toCell = e.currentTarget;

    if (toCell.children.length === 0 && isAdjacent(fromCell, toCell)) {
        e.preventDefault();
        toCell.style.backgroundColor = 'rgba(255, 255, 255, 0.7)';
    }
}

// Handle drop
function handleDrop(e) {
    e.preventDefault();
    const toCell = e.currentTarget;

    // Reset background
    toCell.style.backgroundColor = '';

    if (toCell.children.length === 0 && isAdjacent(draggedFrom, toCell)) {
        toCell.appendChild(draggedTile);
        emptyCell = draggedFrom;
        moveCount++;
        updateMoveCounter();
        checkWin();
    }
}

// Handle click to move tile
function handleCellClick(e) {
    const cell = e.currentTarget;

    // If clicking on the tile itself
    let targetCell = cell;
    if (e.target.classList.contains('tile')) {
        targetCell = e.target.parentNode;
    }

    // Find the empty cell
    const cells = Array.from(document.querySelectorAll('.cell'));
    emptyCell = cells.find(c => c.children.length === 0);

    // If clicked cell has a tile and is adjacent to empty cell
    if (targetCell.children.length > 0 && isAdjacent(targetCell, emptyCell)) {
        const tile = targetCell.children[0];
        emptyCell.appendChild(tile);
        emptyCell = targetCell;
        moveCount++;
        updateMoveCounter();
        checkWin();
    }
}

// Check if two cells are adjacent
function isAdjacent(cell1, cell2) {
    if (!cell1 || !cell2) return false;

    const id1 = cell1.id;
    const id2 = cell2.id;

    const row1 = parseInt(id1[0]);
    const col1 = parseInt(id1[1]);
    const row2 = parseInt(id2[0]);
    const col2 = parseInt(id2[1]);

    // Check if horizontally adjacent
    if (row1 === row2 && Math.abs(col1 - col2) === 1) return true;

    // Check if vertically adjacent
    if (col1 === col2 && Math.abs(row1 - row2) === 1) return true;

    return false;
}

// Update move counter display
function updateMoveCounter() {
    document.getElementById('move-count').textContent = moveCount;
}

// Check if puzzle is solved
function checkWin() {
    const cells = document.querySelectorAll('.cell');
    let correct = true;

    for (let i = 0; i < 15; i++) {
        const cell = cells[i];
        const tile = cell.children[0];

        if (!tile || tile.textContent != (i + 1)) {
            correct = false;
            break;
        }
    }

    if (correct) {
        document.getElementById('win-message').classList.add('show');
        setTimeout(() => {
            alert(`Congratulations! You solved the puzzle in ${moveCount} moves!`);
        }, 500);
    }
}

// Shuffle the puzzle
function shufflePuzzle() {
    document.getElementById('win-message').classList.remove('show');

    // Get all cells
    const cells = Array.from(document.querySelectorAll('.cell'));

    // Perform random valid moves
    const numMoves = 100 + Math.floor(Math.random() * 100);

    for (let i = 0; i < numMoves; i++) {
        // Find empty cell
        emptyCell = cells.find(c => c.children.length === 0);

        // Get adjacent cells with tiles
        const adjacentCells = cells.filter(cell =>
            cell.children.length > 0 && isAdjacent(cell, emptyCell)
        );

        if (adjacentCells.length > 0) {
            // Pick a random adjacent cell
            const randomCell = adjacentCells[Math.floor(Math.random() * adjacentCells.length)];

            // Move its tile to empty cell
            const tile = randomCell.children[0];
            emptyCell.appendChild(tile);
        }
    }

    moveCount = 0;
    updateMoveCounter();
}

// Reset the game to initial state
function resetGame() {
    document.getElementById('win-message').classList.remove('show');

    // Place tiles in order
    const cells = document.querySelectorAll('.cell');

    for (let i = 0; i < 15; i++) {
        cells[i].innerHTML = '';
        cells[i].appendChild(tiles[i]);
    }

    // Last cell is empty
    cells[15].innerHTML = '';
    emptyCell = cells[15];

    moveCount = 0;
    updateMoveCounter();
}

// Event listeners for buttons
document.addEventListener('DOMContentLoaded', () => {
    initGame();

    document.getElementById('shuffle-btn').addEventListener('click', shufflePuzzle);
    document.getElementById('reset-btn').addEventListener('click', resetGame);
});
