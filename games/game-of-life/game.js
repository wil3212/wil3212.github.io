// Conway's Game of Life
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

// Configuration
let squareSize = 5;
let columnNumber = 250;
let lineNumber = 250;

let wi = columnNumber * squareSize;
let he = lineNumber * squareSize;

canvas.width = wi;
canvas.height = he;

// Game state
let isRunning = false;
let delay = 80;
let a = 2; // Min neighbors to survive
let b = 3; // Max neighbors to survive
let c = 3; // Neighbors to be born

// Create all cells
const square = [];

for (let i = 0; i < columnNumber * lineNumber; i++) {
    square.push({
        id: i,
        xi: squareSize * (i - columnNumber * Math.floor(i / columnNumber)),
        yi: squareSize * Math.floor(i / columnNumber),
        xf: squareSize,
        yf: squareSize,
        status: "dead"
    });
}

// Draw a single cell
function drawSquare(sq) {
    if (sq.status === "alive") {
        // Generate random RGB values for alive cells
        const r = Math.floor(Math.random() * 256);
        const g = Math.floor(Math.random() * 256);
        const b = Math.floor(Math.random() * 256);
        ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
    } else {
        ctx.fillStyle = "black";
    }
    ctx.fillRect(sq.xi, sq.yi, sq.xf, sq.yf);
}

// Toggle cell status
function toggleSquareStatus(sq) {
    sq.status = sq.status === "alive" ? "dead" : "alive";
}

// Get cell at canvas coordinates
function getSquare(x, y) {
    const i = Math.floor(x / squareSize);
    const j = Math.floor(y / squareSize);
    return square[j * columnNumber + i];
}

// Handle canvas click
function handleClick(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const sq = getSquare(x, y);
    if (sq) {
        toggleSquareStatus(sq);
        drawSquare(sq);
    }
}

// Count live neighbors
function CLN(x) {
    let count = 0;
    const row = Math.floor(x / columnNumber);
    const col = x % columnNumber;

    // Check all 8 neighbors
    const neighbors = [
        x - 1,                    // left
        x + 1,                    // right
        x - columnNumber,         // up
        x + columnNumber,         // down
        x - columnNumber - 1,     // up-left
        x - columnNumber + 1,     // up-right
        x + columnNumber - 1,     // down-left
        x + columnNumber + 1      // down-right
    ];

    // Check boundaries
    for (let n of neighbors) {
        if (n >= 0 && n < square.length) {
            const nRow = Math.floor(n / columnNumber);
            const nCol = n % columnNumber;

            // Make sure we don't wrap around edges
            if (Math.abs(nRow - row) <= 1 && Math.abs(nCol - col) <= 1) {
                if (square[n].status === "alive") {
                    count++;
                }
            }
        }
    }

    return count;
}

// Update all cells based on Game of Life rules
function updateSquares() {
    let square2 = [];

    for (let i = 0; i < square.length; i++) {
        let neighbors = CLN(i);

        if (square[i].status === "alive") {
            // Cell dies if too few or too many neighbors
            if (neighbors < a || neighbors > b) {
                square2.push({...square[i], status: "dead"});
            }
        } else {
            // Dead cell becomes alive with exactly c neighbors
            if (neighbors === c) {
                square2.push({...square[i], status: "alive"});
            }
        }
    }

    // Apply changes
    for (let i = 0; i < square2.length; i++) {
        square[square2[i].id] = square2[i];
        drawSquare(square2[i]);
    }
}

// Random population
function randomPopulate() {
    let square2 = [];
    const numCells = Math.floor(0.1 * square.length);

    for (let i = 0; i < numCells; i++) {
        const randomInt = Math.floor(Math.random() * square.length);
        let newS = {...square[randomInt], status: "alive"};
        square2.push(newS);
    }

    for (let i = 0; i < square2.length; i++) {
        square[square2[i].id] = square2[i];
        drawSquare(square2[i]);
    }
}

// Reset all cells
function resetSquare() {
    for (let i = 0; i < square.length; i++) {
        square[i].status = "dead";
    }
    square.forEach(drawSquare);
}

// Run simulation
function runSimulation() {
    updateSquares();
    if (isRunning) {
        setTimeout(runSimulation, delay);
    }
}

// Toggle simulation
function toggleSimulation() {
    isRunning = !isRunning;
    const toggleBtn = document.getElementById('toggle-button');

    if (isRunning) {
        toggleBtn.classList.add('running');
        toggleBtn.textContent = 'Stop';
        runSimulation();
    } else {
        toggleBtn.classList.remove('running');
        toggleBtn.textContent = 'Start';
    }
}

// Set delay time
function setDelayTime() {
    let input = document.getElementById("delayTime").value;
    if (!isNaN(input) && input.trim() !== "") {
        delay = parseInt(input);
    }
}

// Set game rules
function setAB() {
    let inputA = document.getElementById("a").value;
    if (inputA.trim() !== "" && !isNaN(inputA)) {
        a = parseInt(inputA);
    }

    let inputB = document.getElementById("b").value;
    if (inputB.trim() !== "" && !isNaN(inputB)) {
        b = parseInt(inputB);
    }

    let inputC = document.getElementById("c").value;
    if (inputC.trim() !== "" && !isNaN(inputC)) {
        c = parseInt(inputC);
    }
}

// Preset patterns
function createGlider() {
    const startX = Math.floor(columnNumber / 2);
    const startY = Math.floor(lineNumber / 2);

    const pattern = [
        [startX + 1, startY],
        [startX + 2, startY + 1],
        [startX, startY + 2],
        [startX + 1, startY + 2],
        [startX + 2, startY + 2]
    ];

    pattern.forEach(([x, y]) => {
        const index = y * columnNumber + x;
        if (index >= 0 && index < square.length) {
            square[index].status = "alive";
            drawSquare(square[index]);
        }
    });
}

function createBlinker() {
    const startX = Math.floor(columnNumber / 2);
    const startY = Math.floor(lineNumber / 2);

    for (let i = -1; i <= 1; i++) {
        const index = startY * columnNumber + (startX + i);
        if (index >= 0 && index < square.length) {
            square[index].status = "alive";
            drawSquare(square[index]);
        }
    }
}

function createPulsar() {
    const startX = Math.floor(columnNumber / 2) - 6;
    const startY = Math.floor(lineNumber / 2) - 6;

    const pattern = [
        // Top section
        [2,0],[3,0],[4,0],[8,0],[9,0],[10,0],
        [0,2],[5,2],[7,2],[12,2],
        [0,3],[5,3],[7,3],[12,3],
        [0,4],[5,4],[7,4],[12,4],
        [2,5],[3,5],[4,5],[8,5],[9,5],[10,5],
        // Bottom section
        [2,7],[3,7],[4,7],[8,7],[9,7],[10,7],
        [0,8],[5,8],[7,8],[12,8],
        [0,9],[5,9],[7,9],[12,9],
        [0,10],[5,10],[7,10],[12,10],
        [2,12],[3,12],[4,12],[8,12],[9,12],[10,12]
    ];

    pattern.forEach(([dx, dy]) => {
        const x = startX + dx;
        const y = startY + dy;
        const index = y * columnNumber + x;
        if (index >= 0 && index < square.length) {
            square[index].status = "alive";
            drawSquare(square[index]);
        }
    });
}

// ==================== PATTERN LAB ====================

// Lab canvas setup
const labCanvas = document.getElementById("lab-canvas");
const labCtx = labCanvas.getContext("2d");

let labSquareSize = 10;
let labColumnNumber = 40;
let labLineNumber = 40;

labCanvas.width = labColumnNumber * labSquareSize;
labCanvas.height = labLineNumber * labSquareSize;

// Create lab cells
const labSquare = [];

for (let i = 0; i < labColumnNumber * labLineNumber; i++) {
    labSquare.push({
        id: i,
        xi: labSquareSize * (i - labColumnNumber * Math.floor(i / labColumnNumber)),
        yi: labSquareSize * Math.floor(i / labColumnNumber),
        xf: labSquareSize,
        yf: labSquareSize,
        status: "dead"
    });
}

// Draw lab cell
function drawLabSquare(sq) {
    if (sq.status === "alive") {
        labCtx.fillStyle = "#8a2be2";
    } else {
        labCtx.fillStyle = "black";
    }
    labCtx.fillRect(sq.xi, sq.yi, sq.xf, sq.yf);
}

// Get lab cell at coordinates
function getLabSquare(x, y) {
    const i = Math.floor(x / labSquareSize);
    const j = Math.floor(y / labSquareSize);
    if (i >= 0 && i < labColumnNumber && j >= 0 && j < labLineNumber) {
        return labSquare[j * labColumnNumber + i];
    }
    return null;
}

// Handle lab canvas click
function handleLabClick(e) {
    const rect = labCanvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const sq = getLabSquare(x, y);
    if (sq) {
        sq.status = sq.status === "alive" ? "dead" : "alive";
        drawLabSquare(sq);
    }
}

// Clear lab canvas
function clearLab() {
    for (let i = 0; i < labSquare.length; i++) {
        labSquare[i].status = "dead";
    }
    labSquare.forEach(drawLabSquare);

    // Clear analysis result
    const resultDiv = document.getElementById('analysis-result');
    resultDiv.className = 'analysis-result';
    resultDiv.textContent = '';
}

// Count lab neighbors
function countLabNeighbors(x, labGrid, cols) {
    let count = 0;
    const row = Math.floor(x / cols);
    const col = x % cols;

    const neighbors = [
        x - 1, x + 1,
        x - cols, x + cols,
        x - cols - 1, x - cols + 1,
        x + cols - 1, x + cols + 1
    ];

    for (let n of neighbors) {
        if (n >= 0 && n < labGrid.length) {
            const nRow = Math.floor(n / cols);
            const nCol = n % cols;
            if (Math.abs(nRow - row) <= 1 && Math.abs(nCol - col) <= 1) {
                if (labGrid[n] === "alive") {
                    count++;
                }
            }
        }
    }

    return count;
}

// Simulate one generation for pattern analysis
function simulateGeneration(grid, cols) {
    const newGrid = [...grid];
    const changes = [];

    for (let i = 0; i < grid.length; i++) {
        const neighbors = countLabNeighbors(i, grid, cols);

        if (grid[i] === "alive") {
            if (neighbors < a || neighbors > b) {
                changes.push({index: i, status: "dead"});
            }
        } else {
            if (neighbors === c) {
                changes.push({index: i, status: "alive"});
            }
        }
    }

    changes.forEach(change => {
        newGrid[change.index] = change.status;
    });

    return newGrid;
}

// Get grid state as string for comparison
function gridToString(grid) {
    return grid.join('');
}

// Analyze pattern
function analyzePattern() {
    const resultDiv = document.getElementById('analysis-result');

    // Get current lab state
    let currentGrid = labSquare.map(sq => sq.status);

    // Check if empty
    const aliveCount = currentGrid.filter(s => s === "alive").length;
    if (aliveCount === 0) {
        resultDiv.className = 'analysis-result show extinct';
        resultDiv.innerHTML = '⚠️ No pattern detected! Draw some cells first.';
        return;
    }

    // Store generations for period detection
    const history = [];
    const maxGenerations = 500;

    for (let gen = 0; gen < maxGenerations; gen++) {
        const stateString = gridToString(currentGrid);

        // Check if all dead (extinct)
        const alive = currentGrid.filter(s => s === "alive").length;
        if (alive === 0) {
            resultDiv.className = 'analysis-result show extinct';
            resultDiv.innerHTML = `☠️ EXTINCT: Pattern dies out after ${gen} generation(s)`;
            return;
        }

        // Check if we've seen this state before
        const repeatIndex = history.findIndex(h => h.state === stateString);

        if (repeatIndex !== -1) {
            const period = gen - repeatIndex;

            if (period === 0) {
                resultDiv.className = 'analysis-result show stable';
                resultDiv.innerHTML = `✅ STABLE: Pattern is static (unchanging) after ${gen} generation(s)`;
            } else if (period === 1) {
                resultDiv.className = 'analysis-result show oscillating';
                resultDiv.innerHTML = `🔄 OSCILLATING: Pattern repeats with period 1 (blinker)`;
            } else {
                resultDiv.className = 'analysis-result show oscillating';
                resultDiv.innerHTML = `🔄 OSCILLATING: Pattern repeats with period ${period}`;
            }
            return;
        }

        // Store this generation
        history.push({
            generation: gen,
            state: stateString
        });

        // Simulate next generation
        currentGrid = simulateGeneration(currentGrid, labColumnNumber);
    }

    // If we get here, pattern didn't stabilize
    resultDiv.className = 'analysis-result show chaotic';
    resultDiv.innerHTML = `🌪️ CHAOTIC: Pattern does not stabilize or repeat within ${maxGenerations} generations!`;
}

// Copy pattern to main canvas
function copyToMain() {
    // Find center of main canvas
    const centerX = Math.floor(columnNumber / 2);
    const centerY = Math.floor(lineNumber / 2);

    // Find center of lab pattern
    const labCenterX = Math.floor(labColumnNumber / 2);
    const labCenterY = Math.floor(labLineNumber / 2);

    // Copy each alive cell
    for (let i = 0; i < labSquare.length; i++) {
        if (labSquare[i].status === "alive") {
            const labRow = Math.floor(i / labColumnNumber);
            const labCol = i % labColumnNumber;

            // Calculate offset from lab center
            const offsetX = labCol - labCenterX;
            const offsetY = labRow - labCenterY;

            // Apply to main canvas
            const mainCol = centerX + offsetX;
            const mainRow = centerY + offsetY;

            if (mainCol >= 0 && mainCol < columnNumber && mainRow >= 0 && mainRow < lineNumber) {
                const mainIndex = mainRow * columnNumber + mainCol;
                square[mainIndex].status = "alive";
                drawSquare(square[mainIndex]);
            }
        }
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Draw initial state
    square.forEach(drawSquare);
    labSquare.forEach(drawLabSquare);

    // Button listeners
    document.getElementById('update').addEventListener('click', updateSquares);
    document.getElementById('toggle-button').addEventListener('click', toggleSimulation);
    document.getElementById('random').addEventListener('click', randomPopulate);
    document.getElementById('resetSquare').addEventListener('click', resetSquare);
    document.getElementById('sab').addEventListener('click', setAB);

    // Preset buttons
    document.getElementById('glider-btn').addEventListener('click', createGlider);
    document.getElementById('blinker-btn').addEventListener('click', createBlinker);
    document.getElementById('pulsar-btn').addEventListener('click', createPulsar);

    // Lab buttons
    document.getElementById('analyze-btn').addEventListener('click', analyzePattern);
    document.getElementById('clear-lab-btn').addEventListener('click', clearLab);
    document.getElementById('copy-to-main-btn').addEventListener('click', copyToMain);

    // Canvas click
    canvas.addEventListener("click", handleClick);
    labCanvas.addEventListener("click", handleLabClick);
});
