// script.js
let towers = [[], [], []];
let numDisks = 3;
let moveCount = 0;

function initGame() {
    towers = [[], [], []];
    for (let i = numDisks; i > 0; i--) {
        towers[0].push(i);
    }
    moveCount = 0;
    document.getElementById('moveCount').textContent = moveCount;
    renderGame();
}

function renderGame() {
    const towerWidth = 200;               // タワーの幅
    const maxDiskWidth = towerWidth - 20; // ディスクの最大幅（余白10pxを左右に確保）
    const minDiskWidth = 55;              // ディスクの最小幅

    for (let i = 1; i <= 3; i++) {
        const tower = document.getElementById('tower' + i);
        tower.innerHTML = '';
        towers[i - 1].forEach((disk, index) => {
            const diskDiv = document.createElement('div');
            diskDiv.className = 'disk';
            const diskWidth = calculateDiskWidth(disk, numDisks, maxDiskWidth, minDiskWidth);
            diskDiv.style.width = diskWidth + 'px';
            diskDiv.style.bottom = (index * 20) + 'px';
            diskDiv.setAttribute('draggable', 'true');
            diskDiv.setAttribute('data-disk', disk);
            diskDiv.setAttribute('data-tower', i - 1);
            diskDiv.ondragstart = drag;
            tower.appendChild(diskDiv);
        });
    }
}

function calculateDiskWidth(disk, totalDisks, maxWidth, minWidth) {
    return minWidth + (maxWidth - minWidth) * (disk - 1) / (totalDisks - 1);
}

function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("disk", event.target.getAttribute('data-disk'));
    event.dataTransfer.setData("fromTower", event.target.getAttribute('data-tower'));
}

function drop(event) {
    event.preventDefault();
    const disk = parseInt(event.dataTransfer.getData("disk"));
    const fromTower = parseInt(event.dataTransfer.getData("fromTower"));
    const toTower = parseInt(event.target.getAttribute('data-id')) - 1;

    if (moveDisk(fromTower, toTower)) {
        renderGame();
    }
}

function moveDisk(from, to) {
    if (towers[from].length === 0 || (towers[to].length > 0 && towers[from][towers[from].length - 1] > towers[to][towers[to].length - 1])) {
        return false; // 無効な動き
    }
    towers[to].push(towers[from].pop());
    moveCount++;
    document.getElementById('moveCount').textContent = moveCount;
    return true;
}

function resetGame() {
    startGame();
}

function startGame() {
    numDisks = parseInt(document.getElementById('numDisks').value);
    fetch('/start', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ num_disks: numDisks }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            initGame();
        }
    });
}

let selectedDisk = null;
initGame();
