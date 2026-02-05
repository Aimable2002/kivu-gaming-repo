const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const axios = require('axios');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';

// Game configurations - Using embedded versions and live URLs
const gameRepos = [
    {
        id: 1,
        name: '2048',
        description: 'Join the numbers and get to the 2048 tile!',
        repo: 'gabrielecirulli/2048',
        stars: '12000+',
        path: '/games/2048-game.html',
        thumbnail: '🎯',
        category: 'Puzzle',
        difficulty: 'Easy',
        players: '1 Player',
        embedUrl: 'https://play2048.co/'
    },
    {
        id: 2,
        name: 'Hextris',
        description: 'Fast paced puzzle game inspired by Tetris',
        repo: 'Hextris/hextris',
        stars: '2000+',
        path: '/games/hextris-game.html',
        thumbnail: '⬡',
        category: 'Puzzle',
        difficulty: 'Medium',
        players: '1 Player',
        embedUrl: 'https://hextris.io/'
    },
    {
        id: 3,
        name: 'Pacman',
        description: 'Classic Pacman game in JavaScript',
        repo: 'daleharvey/pacman',
        stars: '800+',
        path: '/games/pacman-game.html',
        thumbnail: '👻',
        category: 'Arcade',
        difficulty: 'Medium',
        players: '1 Player',
        embedUrl: 'https://pacman.platzh1rsch.ch/'
    },
    {
        id: 4,
        name: 'HexGL',
        description: 'Futuristic HTML5 racing game',
        repo: 'BKcore/HexGL',
        stars: '1500+',
        path: '/games/hexgl-game.html',
        thumbnail: '🏎️',
        category: 'Racing',
        difficulty: 'Hard',
        players: '1 Player',
        embedUrl: 'https://hexgl.bkcore.com/'
    },
    {
        id: 5,
        name: 'Astray',
        description: '3D Maze game built with Three.js',
        repo: 'wwwtyro/Astray',
        stars: '500+',
        path: '/games/astray-game.html',
        thumbnail: '🌀',
        category: '3D',
        difficulty: 'Medium',
        players: '1 Player',
        embedUrl: 'https://wwwtyro.github.io/Astray/'
    },
    {
        id: 6,
        name: 'Multiplayer Tanks',
        description: 'Real-time multiplayer tank battle',
        repo: 'custom/multiplayer-tanks',
        stars: 'Custom',
        path: '/games/multiplayer-tanks.html',
        thumbnail: '🎮',
        category: 'Multiplayer',
        difficulty: 'Medium',
        players: '2+ Players'
    }
];

// API Routes

// Health check for Render
app.get('/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Get all games with GitHub stats
app.get('/api/games', async (req, res) => {
    try {
        const gamesWithStats = await Promise.all(
            gameRepos.map(async (game) => {
                // Skip GitHub API for custom games
                if (game.repo.startsWith('custom/')) {
                    return game;
                }

                try {
                    // Fetch GitHub stats
                    const response = await axios.get(
                        `https://api.github.com/repos/${game.repo}`,
                        {
                            headers: GITHUB_TOKEN ? { Authorization: `token ${GITHUB_TOKEN}` } : {},
                            timeout: 5000 // 5 second timeout
                        }
                    );

                    return {
                        ...game,
                        realStars: response.data.stargazers_count,
                        forks: response.data.forks_count,
                        lastUpdated: response.data.updated_at,
                        githubUrl: response.data.html_url,
                        language: response.data.language,
                        description: response.data.description || game.description
                    };
                } catch (error) {
                    console.log(`Failed to fetch GitHub data for ${game.repo}:`, error.message);
                    // Return game with default data if GitHub API fails
                    return {
                        ...game,
                        githubUrl: `https://github.com/${game.repo}`
                    };
                }
            })
        );

        res.json({
            success: true,
            games: gamesWithStats,
            totalGames: gamesWithStats.length
        });
    } catch (error) {
        console.error('Error fetching games:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Get single game details
app.get('/api/games/:id', async (req, res) => {
    const game = gameRepos.find(g => g.id === parseInt(req.params.id));
    
    if (!game) {
        return res.status(404).json({ success: false, error: 'Game not found' });
    }

    res.json({ success: true, game });
});

// Serve game pages
app.get('/games/:gameName', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'games', req.params.gameName));
});

// WebSocket for multiplayer
const rooms = {};

io.on('connection', (socket) => {
    console.log('Player connected:', socket.id);

    socket.on('joinRoom', (roomId) => {
        if (!rooms[roomId]) {
            rooms[roomId] = {
                players: [],
                tanks: {}
            };
        }

        socket.join(roomId);
        rooms[roomId].players.push(socket.id);
        rooms[roomId].tanks[socket.id] = {
            x: Math.random() * 700 + 50,
            y: Math.random() * 500 + 50,
            angle: 0,
            health: 100,
            score: 0
        };

        socket.emit('joined', {
            playerId: socket.id,
            roomState: rooms[roomId]
        });

        io.to(roomId).emit('playerJoined', {
            playerId: socket.id,
            playerCount: rooms[roomId].players.length
        });

        console.log(`Player ${socket.id} joined room ${roomId}`);
    });

    socket.on('move', (data) => {
        const room = findPlayerRoom(socket.id);
        if (room && rooms[room].tanks[socket.id]) {
            rooms[room].tanks[socket.id].x = data.x;
            rooms[room].tanks[socket.id].y = data.y;
            rooms[room].tanks[socket.id].angle = data.angle;
            
            io.to(room).emit('gameState', rooms[room]);
        }
    });

    socket.on('shoot', (data) => {
        const room = findPlayerRoom(socket.id);
        if (room) {
            io.to(room).emit('bulletFired', {
                playerId: socket.id,
                bullet: data
            });
        }
    });

    socket.on('hit', (data) => {
        const room = findPlayerRoom(socket.id);
        if (room && rooms[room].tanks[data.targetId]) {
            rooms[room].tanks[data.targetId].health -= 10;
            rooms[room].tanks[socket.id].score += 10;

            if (rooms[room].tanks[data.targetId].health <= 0) {
                rooms[room].tanks[data.targetId].health = 100;
                rooms[room].tanks[data.targetId].x = Math.random() * 700 + 50;
                rooms[room].tanks[data.targetId].y = Math.random() * 500 + 50;
            }

            io.to(room).emit('gameState', rooms[room]);
        }
    });

    socket.on('disconnect', () => {
        const room = findPlayerRoom(socket.id);
        if (room && rooms[room]) {
            rooms[room].players = rooms[room].players.filter(p => p !== socket.id);
            delete rooms[room].tanks[socket.id];

            if (rooms[room].players.length === 0) {
                delete rooms[room];
            } else {
                io.to(room).emit('playerLeft', { playerId: socket.id });
            }
        }
        console.log('Player disconnected:', socket.id);
    });
});

function findPlayerRoom(playerId) {
    for (let room in rooms) {
        if (rooms[room].players.includes(playerId)) {
            return room;
        }
    }
    return null;
}

server.listen(PORT, () => {
    console.log(`

Server: http://localhost:${PORT}
API: http://localhost:${PORT}/api/games
Environment: ${process.env.NODE_ENV || 'development'}
    `);
});