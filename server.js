const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Serve downloaded games
const gamesDir = path.join(__dirname, 'public', 'games');
if (fs.existsSync(gamesDir)) {
    fs.readdirSync(gamesDir).forEach(gameFolder => {
        app.use(`/games/${gameFolder}`, express.static(path.join(gamesDir, gameFolder)));
    });
}

// Load games from auto-generated list
let gameConfigs = [];
const gamesListPath = path.join(__dirname, 'games-list.json');

if (fs.existsSync(gamesListPath)) {
    const downloadedGames = JSON.parse(fs.readFileSync(gamesListPath, 'utf-8'));
    
    // Racing game descriptions
    const descriptionMap = {
        'hexgl': 'Futuristic anti-gravity racing at breakneck speeds',
        'crazy-racing': 'Fast-paced top-down racing with tight controls',
        'car-race': 'Competitive street racing with multiple modes',
        'street-racer': 'Urban racing through city streets',
        'neon-racer': 'Race through neon-lit cyberpunk circuits',
        'speed-dash': 'Lightning-fast arcade racing action',
        'turbo-drift': 'Master the art of drifting around corners',
        'nitro-rush': 'Boost-powered high-octane racing',
        'circuit-master': 'Professional circuit racing simulator',
        'speed-legends': 'Legendary racing through iconic tracks',
        'racing-elite': 'Elite racing competition experience',
        'velocity-max': 'Maximum velocity racing thrills'
    };

    const difficultyMap = {
        'hexgl': 'Hard',
        'crazy-racing': 'Medium',
        'car-race': 'Easy',
        'street-racer': 'Medium',
        'neon-racer': 'Hard',
        'speed-dash': 'Easy',
        'turbo-drift': 'Hard',
        'nitro-rush': 'Medium',
        'circuit-master': 'Hard',
        'speed-legends': 'Medium',
        'racing-elite': 'Hard',
        'velocity-max': 'Medium'
    };

    gameConfigs = downloadedGames.map((game, index) => ({
        id: index + 1,
        name: game.name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        description: descriptionMap[game.name] || 'Thrilling racing action',
        category: 'Racing',
        difficulty: difficultyMap[game.name] || 'Medium',
        devices: game.devices,
        thumbnail: game.thumbnail,
        path: `/game-wrappers/${game.name}.html`
    }));
}

// API: Get games filtered by device
app.get('/api/games', (req, res) => {
    const userAgent = req.headers['user-agent'] || '';
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
    
    const filteredGames = gameConfigs.filter(game => {
        if (isMobile) {
            return game.devices.includes('mobile');
        } else {
            return game.devices.includes('desktop');
        }
    });

    res.json({
        success: true,
        games: filteredGames,
        totalGames: filteredGames.length,
        deviceType: isMobile ? 'mobile' : 'desktop'
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.get('/arcade.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'arcade.html'));
});

server.listen(PORT, () => {
    console.log(`
╔═══════════════════════════════════════════╗
║   🏎️  RACING GAME ARCADE RUNNING 🏎️       ║
╚═══════════════════════════════════════════╝

🌐 Server: http://localhost:${PORT}
🏁 ${gameConfigs.length} Racing Games Loaded
🎯 Device-Aware Filtering Enabled
💨 Full-Screen Racing Experience
    `);
});