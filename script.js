function setLang(lang) {
    document.body.className = 'lang-' + lang;
    document.getElementById('btn-ro').classList.toggle('active', lang === 'ro');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');
}

function activateIframe() {
    document.getElementById('overlay').classList.add('active');
}

const phoneBox = document.getElementById('phone-box');

if (phoneBox) {
    phoneBox.addEventListener('mouseleave', function() {
        document.getElementById('overlay').classList.remove('active');
    });

    phoneBox.addEventListener('wheel', function(e) {
        if (document.getElementById('overlay').classList.contains('active')) {
            e.stopPropagation();
        }
    }, { passive: true });
}

// Model pentru simulator robot (4 x 6, 4 cols, 6 rows)
const matrixRows = 6;
const matrixCols = 4;
let robotX = 0; // coloana curentă (0 to 3)
let robotY = matrixRows - 1; // rândul curent (începem de jos stânga de ex)

function initMatrix() {
    const container = document.getElementById('matrix-container');
    if (!container) return;
    
    container.innerHTML = '';
    for (let r = 0; r < matrixRows; r++) {
        for (let c = 0; c < matrixCols; c++) {
            const cell = document.createElement('div');
            cell.className = 'matrix-cell';
            cell.id = `cell-${r}-${c}`;
            container.appendChild(cell);
        }
    }
    updateRobotPosition();
}

function updateRobotPosition() {
    // Clear all cells
    for (let r = 0; r < matrixRows; r++) {
        for (let c = 0; c < matrixCols; c++) {
            const cell = document.getElementById(`cell-${r}-${c}`);
            if (cell) {
                cell.innerHTML = '';
                cell.classList.remove('has-robot');
            }
        }
    }
    
    // Set robot in current cell
    const robotCell = document.getElementById(`cell-${robotY}-${robotX}`);
    if (robotCell) {
        robotCell.innerHTML = '🤖';
        robotCell.classList.add('has-robot');
    }
}

// Expunem comenzile la un nivel global ca să poată fi apelați din consolă
window.sendCommand = function(cmd) {
    console.log("Comandă executată în simulator:", cmd);
    
    if (cmd === "UP" && robotY > 0) {
        robotY--;
    } else if (cmd === "DOWN" && robotY < matrixRows - 1) {
        robotY++;
    } else if (cmd === "LEFT" && robotX > 0) {
        robotX--;
    } else if (cmd === "RIGHT" && robotX < matrixCols - 1) {
        robotX++;
    }
    
    updateRobotPosition();
};

window.UP = () => window.sendCommand("UP");
window.DOWN = () => window.sendCommand("DOWN");
window.LEFT = () => window.sendCommand("LEFT");
window.RIGHT = () => window.sendCommand("RIGHT");

// Initializare la start
document.addEventListener('DOMContentLoaded', initMatrix);