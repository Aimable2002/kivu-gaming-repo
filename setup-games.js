const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const games = [
    // ========== RACING GAMES (10) ==========
    { 
        name: 'crazy-car-online-racing', 
        repo: 'https://github.com/TastSong/CrazyCar.git', 
        devices: ['mobile'], 
        thumbnail: '🚗',
        category: 'Racing',
        description: 'Online multiplayer car racing for mobile with SpringBoot backend',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'unity-mario-kart-mobile', 
        repo: 'https://github.com/Ishaan35/Unity3D-Mario-Kart-Racing-Game.git', 
        devices: ['mobile'], 
        thumbnail: '🏎️',
        category: 'Racing',
        description: 'Mario Kart 3D with anti-gravity, items, AI opponents, mobile controls',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'mobile-racing-game', 
        repo: 'https://github.com/ramshabilal/3d-car-racing-game-unity.git', 
        devices: ['mobile'], 
        thumbnail: '🏁',
        category: 'Racing',
        description: '3D racing with terrain, AI opponents, mobile touch controls',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'car-racing-multiplayer-mobile', 
        repo: 'https://github.com/adrianmoo2/Car-Racing-Multiplayer.git', 
        devices: ['mobile'], 
        thumbnail: '🏆',
        category: 'Racing',
        description: 'Multiplayer car racing for mobile and web with leaderboards',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'simple-racing-mobile', 
        repo: 'https://github.com/CatOstrovsky/simple-racing.git', 
        devices: ['mobile'], 
        thumbnail: '🚙',
        category: 'Racing',
        description: 'Simple mobile racing game for Android/iOS',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'tap-drift-endless', 
        repo: 'https://github.com/lucaxue/Tap-Drift.git', 
        devices: ['mobile'], 
        thumbnail: '💨',
        category: 'Racing',
        description: 'Endless drifting racing game for iOS and Android',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'unity-car-game-mobile', 
        repo: 'https://github.com/ChadCSong/Unity3DCarGameSample.git', 
        devices: ['mobile'], 
        thumbnail: '🎮',
        category: 'Racing',
        description: 'Mobile touch control car racing with EasyTouch integration',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'race-car-mobile-rewards', 
        repo: 'https://github.com/MontaLabidi/Race-Car-Unity-3D.git', 
        devices: ['mobile'], 
        thumbnail: '🚘',
        category: 'Racing',
        description: 'Racing game with reward system to unlock cars on mobile',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'android-cars-racing', 
        repo: 'https://github.com/xtephan/Cars.git', 
        devices: ['mobile'], 
        thumbnail: '🚗',
        category: 'Racing',
        description: 'Car racing game for Android with touch controls',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'endless-traffic-racer', 
        repo: 'https://github.com/shhridoy/2D-Racing-Game.git', 
        devices: ['mobile'], 
        thumbnail: '🏙️',
        category: 'Racing',
        description: '2D racing game for Android mobile with traffic',
        quality: 'Medium',
        entryFile: 'index.html'
    },

    // ========== ENDLESS RUNNER/PLATFORMER (10) ==========
    { 
        name: 'infinite-runner-3d-mobile', 
        repo: 'https://github.com/dgkanatsios/InfiniteRunner3D.git', 
        devices: ['mobile'], 
        thumbnail: '🏃',
        category: 'Runner',
        description: 'Temple Run/Subway Surfers style 3D endless runner for mobile',
        quality: 'AAA',
        entryFile: 'index.html'
    },
    { 
        name: 'subway-surfers-unity', 
        repo: 'https://github.com/semahkadri/SubwaySurfers-unity.git', 
        devices: ['mobile'], 
        thumbnail: '🚇',
        category: 'Runner',
        description: 'Full Subway Surfers clone with 3D graphics and mobile controls',
        quality: 'AAA',
        entryFile: 'index.html'
    },
    { 
        name: 'subway-runner-mobile', 
        repo: 'https://github.com/wfei26/Unity-3D-Game.git', 
        devices: ['mobile'], 
        thumbnail: '🎯',
        category: 'Runner',
        description: '3D endless running for iOS with gestures: jump, slide, move',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'subway-surfers-remake', 
        repo: 'https://github.com/bfagiolo/Subway-Surfers-Remake.git', 
        devices: ['mobile'], 
        thumbnail: '🎨',
        category: 'Runner',
        description: '3D endless runner with custom Blender assets and animations',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'temple-run-mobile-clone', 
        repo: 'https://github.com/totai02/SoftwareEngineer_Game.git', 
        devices: ['mobile'], 
        thumbnail: '⛩️',
        category: 'Runner',
        description: 'Temple Run inspired game for Android/iOS',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'endless-runner-mobile-game', 
        repo: 'https://github.com/AkashDP28/Unity-Android-Game-Subway_Runner_2-D-.git', 
        devices: ['mobile'], 
        thumbnail: '🏃‍♂️',
        category: 'Runner',
        description: 'Subway runner style game for Android',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'lets-run-mobile', 
        repo: 'https://github.com/dgkanatsios/LetsRun.git', 
        devices: ['mobile'], 
        thumbnail: '🎪',
        category: 'Runner',
        description: 'Endless runner with power-ups, avatars, shop system for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'valley-of-cubes-mobile', 
        repo: 'https://github.com/muhammadtalhasultan/Valley-Of-Cubes.git', 
        devices: ['mobile'], 
        thumbnail: '🧊',
        category: 'Runner',
        description: '3D Bluk game replica for mobile devices',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'crossy-road-mobile-clone', 
        repo: 'https://github.com/lucaxue/Crossy-Road.git', 
        devices: ['mobile'], 
        thumbnail: '🐔',
        category: 'Runner',
        description: 'Crossy Road style infinite runner for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'dino-endless-runner', 
        repo: 'https://github.com/dgkanatsios/DinoRunner.git', 
        devices: ['mobile'], 
        thumbnail: '🦖',
        category: 'Runner',
        description: 'Dinosaur endless runner game for mobile',
        quality: 'Medium',
        entryFile: 'index.html'
    },

    // ========== PUZZLE GAMES (10) ==========
    { 
        name: 'match3-candy-crush-mobile', 
        repo: 'https://github.com/daltonbr/Match3.git', 
        devices: ['mobile'], 
        thumbnail: '🍬',
        category: 'Puzzle',
        description: 'Full Match-3 like Candy Crush for mobile with boosters',
        quality: 'AAA',
        entryFile: 'index.html'
    },
    { 
        name: 'candy-crush-clone-mobile', 
        repo: 'https://github.com/dgkanatsios/MatchThreeGame.git', 
        devices: ['mobile'], 
        thumbnail: '🍭',
        category: 'Puzzle',
        description: 'Complete Candy Crush/Bejeweled clone for mobile',
        quality: 'AAA',
        entryFile: 'index.html'
    },
    { 
        name: 'match3-unity-mobile', 
        repo: 'https://github.com/atakan1001/Match3-Game-in-Unity.git', 
        devices: ['mobile'], 
        thumbnail: '💎',
        category: 'Puzzle',
        description: 'Match-3 with 10 levels optimized for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'fruit-match-mobile', 
        repo: 'https://github.com/casterfile/MatchThreeGame.git', 
        devices: ['mobile'], 
        thumbnail: '🍊',
        category: 'Puzzle',
        description: 'Fruit matching puzzle game for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'jigsaw-puzzle-mobile', 
        repo: 'https://github.com/shamim-akhtar/jigsaw-puzzle.git', 
        devices: ['mobile'], 
        thumbnail: '🧩',
        category: 'Puzzle',
        description: 'Complete jigsaw puzzle with Bézier curves for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'tower-blocks-mobile', 
        repo: 'https://github.com/iamkun/tower_game.git', 
        devices: ['mobile'], 
        thumbnail: '🏗️',
        category: 'Puzzle',
        description: '3D tower stacking puzzle for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'sliding-puzzle-mobile', 
        repo: 'https://github.com/Firnox/SlidingPuzzle.git', 
        devices: ['mobile'], 
        thumbnail: '🔢',
        category: 'Puzzle',
        description: 'Classic sliding puzzle (fifteen) for mobile',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'bubble-shooter-mobile', 
        repo: 'https://github.com/dgkanatsios/BubbleShooter.git', 
        devices: ['mobile'], 
        thumbnail: '🫧',
        category: 'Puzzle',
        description: 'Bubble shooter puzzle game for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'tetris-mobile-3d', 
        repo: 'https://github.com/lucaxue/Tetris-3D.git', 
        devices: ['mobile'], 
        thumbnail: '🎲',
        category: 'Puzzle',
        description: '3D Tetris game for mobile devices',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'zen-match-mobile', 
        repo: 'https://github.com/krishx007/matchthreegame.git', 
        devices: ['mobile'], 
        thumbnail: '☯️',
        category: 'Puzzle',
        description: 'Zen-themed match-3 puzzle for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },

    // ========== SHOOTER/ACTION GAMES (10) ==========
    { 
        name: 'ar-shooter-mobile', 
        repo: 'https://github.com/rudrajikadra/ARShoot-Game-Markerless-Augmented-Reality-Unity3D-iOS-Android.git', 
        devices: ['mobile'], 
        thumbnail: '🎯',
        category: 'Shooter',
        description: 'AR FPS shooter using Apple AR Kit for iOS/Android',
        quality: 'AAA',
        entryFile: 'index.html'
    },
    { 
        name: 'mobile-fps-shooter', 
        repo: 'https://github.com/JFroggo-Gaming/Unity-FPS-game.git', 
        devices: ['mobile'], 
        thumbnail: '🔫',
        category: 'Shooter',
        description: 'FPS with destructible objects optimized for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'survival-shooter-mobile', 
        repo: 'https://github.com/rosdyana/3D-Shooting-Game-Unity.git', 
        devices: ['mobile'], 
        thumbnail: '💥',
        category: 'Shooter',
        description: 'Western-themed 3D FPS for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'mobile-fps-simple', 
        repo: 'https://github.com/joaoborks/unity-3d-simplefps.git', 
        devices: ['mobile'], 
        thumbnail: '🎮',
        category: 'Shooter',
        description: 'Simple FPS 3D for mobile with touch controls',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'fps-survival-waves', 
        repo: 'https://github.com/Viraj-Mavani/fps_game.git', 
        devices: ['mobile'], 
        thumbnail: '🧟',
        category: 'Shooter',
        description: 'Survival FPS with waves and power-ups for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'space-shooter-mobile', 
        repo: 'https://github.com/lucaxue/Space-Shooter.git', 
        devices: ['mobile'], 
        thumbnail: '🚀',
        category: 'Shooter',
        description: '3D space shooter for mobile devices',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'tank-shooter-mobile', 
        repo: 'https://github.com/dgkanatsios/TankShooter.git', 
        devices: ['mobile'], 
        thumbnail: '🎖️',
        category: 'Shooter',
        description: 'Tank battle shooter for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'zombie-shooter-mobile', 
        repo: 'https://github.com/lucaxue/Zombie-Shooter.git', 
        devices: ['mobile'], 
        thumbnail: '🧟‍♂️',
        category: 'Shooter',
        description: 'Zombie survival shooter for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'aircraft-combat-mobile', 
        repo: 'https://github.com/dgkanatsios/AircraftCombat.git', 
        devices: ['mobile'], 
        thumbnail: '✈️',
        category: 'Shooter',
        description: 'Aircraft combat shooter for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'alien-shooter-mobile', 
        repo: 'https://github.com/lucaxue/Alien-Shooter.git', 
        devices: ['mobile'], 
        thumbnail: '👾',
        category: 'Shooter',
        description: 'Alien shooter game for mobile',
        quality: 'Medium',
        entryFile: 'index.html'
    },

    // ========== ADVENTURE/SIMULATION (5) ==========
    { 
        name: 'blob-runner-mobile', 
        repo: 'https://github.com/muhammadtalhasultan/Blob-Runner.git', 
        devices: ['mobile'], 
        thumbnail: '🦠',
        category: 'Adventure',
        description: 'Jelly blob character runner for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'jump-game-mobile', 
        repo: 'https://github.com/lucaxue/Jump-Game.git', 
        devices: ['mobile'], 
        thumbnail: '⬆️',
        category: 'Adventure',
        description: 'Jumping game for iOS and Android',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'stack-blocks-mobile', 
        repo: 'https://github.com/dgkanatsios/StackBlocks.git', 
        devices: ['mobile'], 
        thumbnail: '📦',
        category: 'Adventure',
        description: 'Stack the blocks mobile game',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'roll-ball-mobile', 
        repo: 'https://github.com/lucaxue/Roll-Ball.git', 
        devices: ['mobile'], 
        thumbnail: '⚽',
        category: 'Adventure',
        description: 'Rolling ball 3D adventure for mobile',
        quality: 'Medium',
        entryFile: 'index.html'
    },
    { 
        name: 'maze-runner-mobile', 
        repo: 'https://github.com/dgkanatsios/MazeRunner.git', 
        devices: ['mobile'], 
        thumbnail: '🌀',
        category: 'Adventure',
        description: '3D maze navigation for mobile',
        quality: 'Medium',
        entryFile: 'index.html'
    },

    // ========== CASUAL/HYPER-CASUAL (5) ==========
    { 
        name: 'flappy-bird-3d-mobile', 
        repo: 'https://github.com/lucaxue/Flappy-Bird-3D.git', 
        devices: ['mobile'], 
        thumbnail: '🐦',
        category: 'Casual',
        description: '3D version of Flappy Bird for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'fruit-ninja-mobile', 
        repo: 'https://github.com/dgkanatsios/FruitNinja.git', 
        devices: ['mobile'], 
        thumbnail: '🍉',
        category: 'Casual',
        description: 'Fruit slicing game for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'color-switch-mobile', 
        repo: 'https://github.com/lucaxue/Color-Switch.git', 
        devices: ['mobile'], 
        thumbnail: '🎨',
        category: 'Casual',
        description: 'Color matching mobile game',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'helix-jump-mobile', 
        repo: 'https://github.com/dgkanatsios/HelixJump.git', 
        devices: ['mobile'], 
        thumbnail: '🌀',
        category: 'Casual',
        description: 'Helix tower jumping game for mobile',
        quality: 'High',
        entryFile: 'index.html'
    },
    { 
        name: 'knife-hit-mobile', 
        repo: 'https://github.com/lucaxue/Knife-Hit.git', 
        devices: ['mobile'], 
        thumbnail: '🔪',
        category: 'Casual',
        description: 'Knife throwing mobile game',
        quality: 'High',
        entryFile: 'index.html'
    }
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