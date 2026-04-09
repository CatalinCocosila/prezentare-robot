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
    const container = document.getElementById('matrix-view');
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

// Coadă pentru a executa comenzile pas cu pas, cu întârziere (animație)
let commandQueue = [];
let isExecuting = false;

function showMatrix() {
    document.getElementById('blockly-view').style.display = 'none';
    document.getElementById('matrix-view').style.display = 'grid';
    // Oprim scroll-ul iframe-ului accidentele in timp ce ruleaza
    document.getElementById('overlay').classList.add('active');
}

function hideMatrix() {
    document.getElementById('matrix-view').style.display = 'none';
    document.getElementById('blockly-view').style.display = 'block';
    // Reactivam interacțiunea
    document.getElementById('overlay').classList.remove('active');
}

window.sendCommand = function(cmd) {
    console.log("Comandă adăugată în coadă:", cmd);
    commandQueue.push(cmd);
    
    if (!isExecuting) {
        isExecuting = true;
        showMatrix();
        
        // Un mic delay (300ms) înainte să înceapă miscarea, ca sa vadă utizatorul matricea apărând
        setTimeout(() => {
            processQueue();
        }, 300);
    }
};

function processQueue() {
    if (commandQueue.length === 0) {
        // Am terminat comenzile. Așteptăm puțin pe matrice finală curată, apoi ne întoarcem
        setTimeout(() => {
            hideMatrix();
            isExecuting = false;
        }, 1500); // 1.5s delay la final
        return;
    }
    
    const cmd = commandQueue.shift();
    
    if (cmd === "UP" && robotY > 0) robotY--;
    else if (cmd === "DOWN" && robotY < matrixRows - 1) robotY++;
    else if (cmd === "LEFT" && robotX > 0) robotX--;
    else if (cmd === "RIGHT" && robotX < matrixCols - 1) robotX++;
    
    updateRobotPosition();
    
    // Așteptăm 600ms înainte de a executa următoarea comandă pentru a vedea mutarea
    setTimeout(() => {
        processQueue();
    }, 600);
}

// Funcție ajutătoare pentru a prelua codul text din consolă
// Apeleează în consolă: executeConsoleCode(`...paste aici...`)
window.executeConsoleCode = function(codeString) {
    if(!codeString) return;
    try {
        eval(codeString);
        if (typeof window.runCommands === "function") {
            window.runCommands();
        }
    } catch (e) {
        console.error("Eroare la evaluarea codului:", e);
    }
};

window.UP = () => window.sendCommand("UP");
window.DOWN = () => window.sendCommand("DOWN");
window.LEFT = () => window.sendCommand("LEFT");
window.RIGHT = () => window.sendCommand("RIGHT");

// Initializare la start
document.addEventListener('DOMContentLoaded', initMatrix);