const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const socket = io();

let myId = null;
let gameState = { tanks: {}, players: [] };
let keys = {};
let mouseAngle = 0;
let mouseX = 0;
let mouseY = 0;

const ROOM_ID = 'main-room';

// Join room
socket.emit('joinRoom', ROOM_ID);

socket.on('joined', (data) => {
    myId = data.playerId;
    gameState = data.roomState;
    updateStats();
});

socket.on('playerJoined', (data) => {
    document.getElementById('players').textContent = data.playerCount;
});

socket.on('gameState', (state) => {
    gameState = state;
    updateStats();
});

socket.on('bulletFired', (data) => {
    // Visual feedback for bullets
    drawBullet(data.bullet);
});

socket.on('playerLeft', () => {
    document.getElementById('players').textContent = gameState.players.length;
});

// Controls
document.addEventListener('keydown', (e) => {
    keys[e.key.toLowerCase()] = true;
});

document.addEventListener('keyup', (e) => {
    keys[e.key.toLowerCase()] = false;
});

canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    
    if (myId && gameState.tanks[myId]) {
        const tank = gameState.tanks[myId];
        mouseAngle = Math.atan2(mouseY - tank.y, mouseX - tank.x);
    }
});

canvas.addEventListener('click', () => {
    if (myId && gameState.tanks[myId]) {
        const tank = gameState.tanks[myId];
        socket.emit('shoot', {
            x: tank.x,
            y: tank.y,
            angle: mouseAngle
        });
    }
});

function updateStats() {
    if (myId && gameState.tanks[myId]) {
        document.getElementById('score').textContent = gameState.tanks[myId].score;
        document.getElementById('health').textContent = gameState.tanks[myId].health;
    }
}

function update() {
    if (!myId || !gameState.tanks[myId]) return;

    const tank = gameState.tanks[myId];
    let moved = false;
    const speed = 3;

    let newX = tank.x;
    let newY = tank.y;

    if (keys['w'] || keys['arrowup']) {
        newY -= speed;
        moved = true;
    }
    if (keys['s'] || keys['arrowdown']) {
        newY += speed;
        moved = true;
    }
    if (keys['a'] || keys['arrowleft']) {
        newX -= speed;
        moved = true;
    }
    if (keys['d'] || keys['arrowright']) {
        newX += speed;
        moved = true;
    }

    // Keep in bounds
    newX = Math.max(20, Math.min(780, newX));
    newY = Math.max(20, Math.min(580, newY));

    if (moved || mouseAngle !== tank.angle) {
        socket.emit('move', {
            x: newX,
            y: newY,
            angle: mouseAngle
        });
    }
}

function draw() {
    // Clear canvas
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw grid
    ctx.strokeStyle = 'rgba(0, 255, 136, 0.1)';
    ctx.lineWidth = 1;
    for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
    }
    for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
    }

    // Draw tanks
    for (let id in gameState.tanks) {
        const tank = gameState.tanks[id];
        const isMe = id === myId;

        ctx.save();
        ctx.translate(tank.x, tank.y);
        ctx.rotate(tank.angle);

        // Tank body
        ctx.fillStyle = isMe ? '#00ff88' : '#ff0080';
        ctx.fillRect(-20, -15, 40, 30);

        // Tank turret
        ctx.fillStyle = isMe ? '#00cc6a' : '#cc0066';
        ctx.fillRect(0, -5, 25, 10);

        ctx.restore();

        // Health bar
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.fillRect(tank.x - 20, tank.y - 25, 40, 5);
        ctx.fillStyle = tank.health > 50 ? '#00ff88' : '#ff0080';
        ctx.fillRect(tank.x - 20, tank.y - 25, (tank.health / 100) * 40, 5);

        // Player label
        ctx.fillStyle = '#fff';
        ctx.font = '12px Orbitron';
        ctx.textAlign = 'center';
        ctx.fillText(isMe ? 'YOU' : 'P' + gameState.players.indexOf(id), tank.x, tank.y - 30);
    }

    // Draw crosshair
    if (myId) {
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(mouseX, mouseY, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouseX - 15, mouseY);
        ctx.lineTo(mouseX - 5, mouseY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouseX + 5, mouseY);
        ctx.lineTo(mouseX + 15, mouseY);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY - 15);
        ctx.lineTo(mouseX, mouseY - 5);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(mouseX, mouseY + 5);
        ctx.lineTo(mouseX, mouseY + 15);
        ctx.stroke();
    }
}

function drawBullet(bullet) {
    ctx.fillStyle = '#ffff00';
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, 5, 0, Math.PI * 2);
    ctx.fill();
}

function gameLoop() {
    update();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();