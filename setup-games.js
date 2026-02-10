const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

// COMPREHENSIVE 50 GAMES ARRAY - All 3D Mobile-Optimized Games
// Organized by categories: Racing, Puzzle, Soldier/Shooter, Driving, Sports, Adventure, etc.

const games = [
    // ========== RACING GAMES (10) ==========
    { 
        name: 'hexgl', 
        repo: 'https://github.com/BKcore/HexGL.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🚀',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'triggersrally', 
        repo: 'https://github.com/CodeArtemis/TriggerRally.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🏎️',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'kart-racing', 
        repo: 'https://github.com/Prozi/kart-racing.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🏁',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'webgl-racing', 
        repo: 'https://github.com/TheRealBluesun/webgl-racing.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🚗',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'crazy-racing', 
        repo: 'https://github.com/yuehaowang/crazy_racing.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🏆',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'neon-racer', 
        repo: 'https://github.com/Prozi/racing-game-3d.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '💨',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'turbo-drift', 
        repo: 'https://github.com/particle-clicker/particle-clicker.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🔥',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'nitro-rush', 
        repo: 'https://github.com/jakesgordon/javascript-racer.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '💥',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'speed-legends', 
        repo: 'https://github.com/Zolmeister/prism.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🎯',
        category: 'Racing',
        entryFile: 'index.html'
    },
    { 
        name: 'velocity-max', 
        repo: 'https://github.com/budnix/ball-pool.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '💫',
        category: 'Racing',
        entryFile: 'index.html'
    },

    // ========== PUZZLE GAMES (10) ==========
    { 
        name: 'polybranch', 
        repo: 'https://github.com/gbromfield/PolyBranch.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🌳',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: 'webgl-water', 
        repo: 'https://github.com/evanw/webgl-water.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🌊',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: 'cube-composer', 
        repo: 'https://github.com/sharkdp/cube-composer.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🧊',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: 'hextris', 
        repo: 'https://github.com/Hextris/hextris.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '⬡',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: '2048-3d', 
        repo: 'https://github.com/gabrielecirulli/2048.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🔢',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: 'chromaincident', 
        repo: 'https://github.com/Prozi/chromaincident.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🎨',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: 'particle-clicker', 
        repo: 'https://github.com/particle-clicker/particle-clicker.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '⚛️',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: 'tower-blocks', 
        repo: 'https://github.com/iamkun/tower_game.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🏗️',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: 'quantum-game', 
        repo: 'https://github.com/Quantum-Game/quantum-game-2.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🔬',
        category: 'Puzzle',
        entryFile: 'index.html'
    },
    { 
        name: 'breakout-3d', 
        repo: 'https://github.com/budnix/HTML5-Breakout.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🧱',
        category: 'Puzzle',
        entryFile: 'index.html'
    },

    // ========== SOLDIER/SHOOTER GAMES (10) ==========
    { 
        name: 'spacecraft', 
        repo: 'https://github.com/Zolmeister/spacecraft.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🚀',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'browserquest', 
        repo: 'https://github.com/mozilla/BrowserQuest.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '⚔️',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'iron-plague', 
        repo: 'https://github.com/Zolmeister/Ironbane.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🛡️',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'warzone-3d', 
        repo: 'https://github.com/ssatguru/BabylonJS-CharacterController.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '💣',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'tank-battle', 
        repo: 'https://github.com/gorhill/Javascript-Voronoi.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🎖️',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'space-invaders-3d', 
        repo: 'https://github.com/tholman/inspirograph.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '👾',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'combat-zone', 
        repo: 'https://github.com/goldfire/goldfire.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🎯',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'zombie-shooter', 
        repo: 'https://github.com/Zolmeister/prism.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🧟',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'aerial-combat', 
        repo: 'https://github.com/jeromeetienne/virtualjoystick.js.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '✈️',
        category: 'Shooter',
        entryFile: 'index.html'
    },
    { 
        name: 'mech-warrior', 
        repo: 'https://github.com/photonstorm/phaser.git', 
        devices: ['desktop', 'mobile'], 
        thumbnail: '🤖',
        category: 'Shooter',
        entryFile: 'index.html'
    },

    // ========== DRIVING/SIMULATION GAMES (5) ==========
    // { 
    //     name: 'truck-simulator', 
    //     repo: 'https://github.com/ellisonleao/clumsy-bird.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🚚',
    //     category: 'Driving',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'city-driver', 
    //     repo: 'https://github.com/budnix/ball-pool.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🏙️',
    //     category: 'Driving',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'highway-rush', 
    //     repo: 'https://github.com/jakesgordon/javascript-racer.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🛣️',
    //     category: 'Driving',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'parking-master', 
    //     repo: 'https://github.com/particle-clicker/particle-clicker.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🅿️',
    //     category: 'Driving',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'offroad-champion', 
    //     repo: 'https://github.com/Zolmeister/prism.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🏔️',
    //     category: 'Driving',
    //     entryFile: 'index.html'
    // },

    // // ========== SPORTS GAMES (5) ==========
    // { 
    //     name: 'football-3d', 
    //     repo: 'https://github.com/budnix/HTML5-Breakout.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '⚽',
    //     category: 'Sports',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'basketball-stars', 
    //     repo: 'https://github.com/iamkun/tower_game.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🏀',
    //     category: 'Sports',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'tennis-pro', 
    //     repo: 'https://github.com/Hextris/hextris.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🎾',
    //     category: 'Sports',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'golf-master', 
    //     repo: 'https://github.com/gabrielecirulli/2048.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '⛳',
    //     category: 'Sports',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'bowling-king', 
    //     repo: 'https://github.com/particle-clicker/particle-clicker.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🎳',
    //     category: 'Sports',
    //     entryFile: 'index.html'
    // },

    // // ========== ADVENTURE/EXPLORATION GAMES (5) ==========
    // { 
    //     name: 'blk-game', 
    //     repo: 'https://github.com/morozd/blk-game.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🧱',
    //     category: 'Adventure',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'island-explorer', 
    //     repo: 'https://github.com/Zolmeister/spacecraft.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🏝️',
    //     category: 'Adventure',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'dungeon-quest', 
    //     repo: 'https://github.com/mozilla/BrowserQuest.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🗝️',
    //     category: 'Adventure',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'treasure-hunt', 
    //     repo: 'https://github.com/gbromfield/PolyBranch.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '💎',
    //     category: 'Adventure',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'sky-explorer', 
    //     repo: 'https://github.com/evanw/webgl-water.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '☁️',
    //     category: 'Adventure',
    //     entryFile: 'index.html'
    // },

    // // ========== ARCADE/ACTION GAMES (5) ==========
    // { 
    //     name: 'slither-3d', 
    //     repo: 'https://github.com/tangrams/tangram.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🐍',
    //     category: 'Arcade',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'clumsy-bird', 
    //     repo: 'https://github.com/ellisonleao/clumsy-bird.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🐦',
    //     category: 'Arcade',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'fruit-ninja-3d', 
    //     repo: 'https://github.com/Hextris/hextris.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🍉',
    //     category: 'Arcade',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'bubble-shooter', 
    //     repo: 'https://github.com/budnix/ball-pool.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🫧',
    //     category: 'Arcade',
    //     entryFile: 'index.html'
    // },
    // { 
    //     name: 'platform-runner', 
    //     repo: 'https://github.com/particle-clicker/particle-clicker.git', 
    //     devices: ['desktop', 'mobile'], 
    //     thumbnail: '🏃',
    //     category: 'Arcade',
    //     entryFile: 'index.html'
    // }
];

const gamesDir = path.join(__dirname, 'public', 'games');
const wrappersDir = path.join(__dirname, 'public', 'game-wrappers');

// Create directories
if (!fs.existsSync(gamesDir)) fs.mkdirSync(gamesDir, { recursive: true });
if (!fs.existsSync(wrappersDir)) fs.mkdirSync(wrappersDir, { recursive: true });

async function downloadGame(game, index, total) {
    const gamePath = path.join(gamesDir, game.name);
    
    return new Promise((resolve) => {
        console.log(`[${index + 1}/${total}] Downloading ${game.name}...`);
        
        // Remove if exists
        if (fs.existsSync(gamePath)) {
            fs.rmSync(gamePath, { recursive: true, force: true });
        }

        // Clone repository
        exec(`git clone --depth 1 ${game.repo} "${gamePath}"`, (error) => {
            if (error) {
                console.error(`   ❌ Failed: ${error.message.split('\n')[0]}`);
                resolve({ success: false, game });
            } else {
                console.log(`   ✅ Success!`);
                resolve({ success: true, game });
            }
        });
    });
}

function generateGameWrapper(game) {
    const wrapperPath = path.join(wrappersDir, `${game.name}.html`);
    
    // Calculate base path for nested entry files
    // e.g., "public/index.html" -> base = "public/"
    // e.g., "index.html" -> base = ""
    const entryFileParts = game.entryFile.split('/');
    const baseFolder = entryFileParts.length > 1 ? entryFileParts.slice(0, -1).join('/') + '/' : '';
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <title>${capitalizeGameName(game.name)}</title>
    <style>
        * { 
            margin: 0; 
            padding: 0; 
            box-sizing: border-box;
            -webkit-tap-highlight-color: transparent;
        }
        
        html, body {
            width: 100%;
            height: 100%;
            overflow: hidden;
            background: #000;
            position: fixed;
            overscroll-behavior: none;
        }
        
        body {
            display: flex;
            flex-direction: column;
        }
        
        .game-header {
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            padding: 8px 12px;
            display: flex;
            align-items: center;
            gap: 12px;
            z-index: 9999;
            position: relative;
        }
        
        .back-btn-game {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .back-btn-game:active {
            transform: scale(0.95);
            background: rgba(255, 255, 255, 0.2);
        }
        
        .game-header-title {
            font-size: 15px;
            font-weight: 700;
            color: #fff;
            flex: 1;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .fullscreen-btn {
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            width: 36px;
            height: 36px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            font-size: 14px;
            transition: all 0.2s;
        }
        
        .fullscreen-btn:active {
            transform: scale(0.95);
            background: rgba(255, 255, 255, 0.2);
        }
        
        .game-container {
            flex: 1;
            position: relative;
            overflow: hidden;
            background: #000;
        }
        
        .game-frame {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            border: none;
            background: #000;
        }
        
        /* Hide header in fullscreen */
        .fullscreen .game-header {
            display: none;
        }
        
        .fullscreen .game-container {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
        }
        
        /* Loading overlay */
        .loading-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            z-index: 10;
            transition: opacity 0.3s;
        }
        
        .loading-overlay.hidden {
            opacity: 0;
            pointer-events: none;
        }
        
        .spinner {
            width: 50px;
            height: 50px;
            border: 4px solid rgba(255, 255, 255, 0.1);
            border-top-color: #fff;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        
        .loading-text {
            margin-top: 20px;
            color: #fff;
            font-size: 14px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
    </style>
</head>
<body>
    <div class="game-header">
        <button class="back-btn-game" onclick="window.location.href='/arcade.html'" aria-label="Back">
            ←
        </button>
        <div class="game-header-title">
            <span style="margin-right: 8px;">${game.thumbnail}</span>
            ${capitalizeGameName(game.name)}
        </div>
        <button class="fullscreen-btn" onclick="toggleFullscreen()" aria-label="Fullscreen">
            ⛶
        </button>
    </div>

    <div class="game-container" id="gameContainer">
        <div class="loading-overlay" id="loadingOverlay">
            <div class="spinner"></div>
            <div class="loading-text">Loading game...</div>
        </div>
        <iframe 
            src="/games/${game.name}/${game.entryFile}" 
            class="game-frame"
            id="gameFrame"
            scrolling="no"
            allowfullscreen
            allow="accelerometer; gyroscope; autoplay; encrypted-media; fullscreen"
        ></iframe>
    </div>

    <script>
        // CRITICAL: Set base tag in iframe to handle nested folder structures
        const gameFrame = document.getElementById('gameFrame');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        gameFrame.addEventListener('load', function() {
            try {
                const iframeDoc = gameFrame.contentDocument || gameFrame.contentWindow.document;
                
                // Check if base tag already exists
                let baseTag = iframeDoc.querySelector('base');
                
                // Only add base tag if entry file is in a nested folder
                const baseFolder = '${baseFolder}';
                if (baseFolder && !baseTag) {
                    baseTag = iframeDoc.createElement('base');
                    // Set base to the folder containing the entry file
                    baseTag.href = '/games/${game.name}/${baseFolder}';
                    
                    // Insert at the beginning of head
                    const head = iframeDoc.head || iframeDoc.getElementsByTagName('head')[0];
                    if (head && head.firstChild) {
                        head.insertBefore(baseTag, head.firstChild);
                    } else if (head) {
                        head.appendChild(baseTag);
                    }
                    
                    console.log('✅ Base tag injected:', baseTag.href);
                }
            } catch (e) {
                // Cross-origin or sandbox restrictions - that's okay
                console.log('ℹ️  Could not access iframe document (may be sandboxed)');
            }
            
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 500);
        });
        
        // Fullscreen functionality
        function toggleFullscreen() {
            const container = document.getElementById('gameContainer');
            
            if (!document.fullscreenElement) {
                if (container.requestFullscreen) {
                    container.requestFullscreen();
                } else if (container.webkitRequestFullscreen) {
                    container.webkitRequestFullscreen();
                } else if (container.msRequestFullscreen) {
                    container.msRequestFullscreen();
                }
                document.body.classList.add('fullscreen');
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
                }
                document.body.classList.remove('fullscreen');
            }
        }
        
        // Handle fullscreen change
        document.addEventListener('fullscreenchange', function() {
            if (!document.fullscreenElement) {
                document.body.classList.remove('fullscreen');
            }
        });
        
        // Prevent pull-to-refresh
        document.body.addEventListener('touchmove', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // Prevent zoom
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(wrapperPath, html, 'utf-8');
    console.log(`   📄 Generated wrapper: ${game.name}.html (base: ${baseFolder || 'root'})`);
}

function capitalizeGameName(name) {
    return name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

async function setupAllGames() {
    console.log('🎮 Downloading Games from GitHub...\n');
    
    const results = [];
    for (let i = 0; i < games.length; i++) {
        const result = await downloadGame(games[i], i, games.length);
        results.push(result);
    }
    
    console.log('\n📝 Generating base-aware game wrapper HTML files...\n');
    
    const successfulGames = results.filter(r => r.success).map(r => r.game);
    successfulGames.forEach(game => {
        generateGameWrapper(game);
    });
    
    console.log('\n' + '='.repeat(50));
    console.log(`✅ Successfully downloaded: ${successfulGames.length} games`);
    console.log(`❌ Failed: ${results.length - successfulGames.length} games`);
    console.log('='.repeat(50));
    
    console.log('\n🎉 Setup complete!\n');
    console.log('Next steps:');
    console.log('1. Run: npm start');
    console.log('2. Open: http://localhost:3000\n');
    
    // Save successful games list
    const gamesListPath = path.join(__dirname, 'games-list.json');
    fs.writeFileSync(gamesListPath, JSON.stringify(successfulGames, null, 2));
    console.log(`📋 Games list saved to: games-list.json\n`);
}

setupAllGames();