const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const games = require('./game-array');

const gamesDir = path.join(__dirname, 'public', 'games');
const wrappersDir = path.join(__dirname, 'public', 'game-wrappers');
const tempDir = path.join(__dirname, 'temp-builds');

if (!fs.existsSync(gamesDir)) fs.mkdirSync(gamesDir, { recursive: true });
if (!fs.existsSync(wrappersDir)) fs.mkdirSync(wrappersDir, { recursive: true });
if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

/**
 * Execute shell command and return promise
 */
function execPromise(command, cwd) {
    return new Promise((resolve, reject) => {
        exec(command, { cwd, maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
            if (error) {
                reject({ error, stderr, stdout });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

/**
 * Clone, install, build, and deploy a single game
 */
async function buildAndDeployGame(game, index, total) {
    const startTime = Date.now();
    const tempGamePath = path.join(tempDir, game.name);
    const finalGamePath = path.join(gamesDir, game.name);
    
    console.log(`\n${'='.repeat(60)}`);
    console.log(`[${index + 1}/${total}] 🎮 Processing: ${game.name}`);
    console.log(`${'='.repeat(60)}`);
    
    try {
        // STEP 1: Clone repository
        console.log(`📥 Step 1/5: Cloning repository...`);
        if (fs.existsSync(tempGamePath)) {
            fs.rmSync(tempGamePath, { recursive: true, force: true });
        }
        
        await execPromise(`git clone --depth 1 ${game.repo} "${tempGamePath}"`);
        console.log(`   ✅ Cloned successfully`);
        
        // STEP 2: Check if package.json exists
        console.log(`📋 Step 2/5: Checking package.json...`);
        const packageJsonPath = path.join(tempGamePath, 'package.json');
        
        if (!fs.existsSync(packageJsonPath)) {
            // No build needed - copy directly
            console.log(`   ⚠️  No package.json found - copying files directly...`);
            if (fs.existsSync(finalGamePath)) {
                fs.rmSync(finalGamePath, { recursive: true, force: true });
            }
            fs.cpSync(tempGamePath, finalGamePath, { recursive: true });
            fs.rmSync(tempGamePath, { recursive: true, force: true });
            
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
            console.log(`   ✅ Deployed (no build) in ${elapsed}s`);
            return { success: true, game, time: elapsed, method: 'direct' };
        }
        
        console.log(`   ✅ package.json found`);
        
        // STEP 3: Install dependencies
        console.log(`📦 Step 3/5: Installing dependencies (npm install)...`);
        console.log(`   ⏳ This may take 1-3 minutes...`);
        
        try {
            await execPromise('npm install', tempGamePath);
            console.log(`   ✅ Dependencies installed`);
        } catch (err) {
            console.log(`   ⚠️  npm install had warnings (continuing...)`);
        }
        
        // STEP 4: Build the game
        console.log(`🔨 Step 4/5: Building game...`);
        console.log(`   ⏳ Running: ${game.buildCmd || 'npm run build'}`);
        
        let buildSuccess = false;
        let buildOutput = null;
        
        // Try different build commands
        const buildCommands = [
            game.buildCmd,
            'npm run build',
            'npm run build:prod',
            'npm run webpack',
            'npm start -- --build'
        ].filter(Boolean);
        
        for (const cmd of buildCommands) {
            try {
                buildOutput = await execPromise(cmd, tempGamePath);
                buildSuccess = true;
                console.log(`   ✅ Build successful with: ${cmd}`);
                break;
            } catch (err) {
                console.log(`   ⚠️  ${cmd} failed, trying next...`);
            }
        }
        
        if (!buildSuccess) {
            // Check if dist/build folder already exists (static files)
            const possibleOutputDirs = ['dist', 'build', 'public', 'out'];
            let foundOutput = null;
            
            for (const dir of possibleOutputDirs) {
                const dirPath = path.join(tempGamePath, dir);
                if (fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory()) {
                    foundOutput = dir;
                    break;
                }
            }
            
            if (foundOutput) {
                console.log(`   ⚠️  No build needed - found static files in ${foundOutput}/`);
                game.outputDir = foundOutput + '/';
            } else {
                throw new Error('Build failed and no output directory found');
            }
        }
        
        // STEP 5: Copy build output to final location
        console.log(`📂 Step 5/5: Deploying build files...`);
        
        // Determine output directory
        let outputDir = game.outputDir || 'dist/';
        if (!outputDir.endsWith('/')) outputDir += '/';
        
        const builtFilesPath = path.join(tempGamePath, outputDir);
        
        if (!fs.existsSync(builtFilesPath)) {
            // Try alternative locations
            const alternatives = ['dist/', 'build/', 'public/', 'out/', './'];
            let found = false;
            
            for (const alt of alternatives) {
                const altPath = path.join(tempGamePath, alt);
                if (fs.existsSync(altPath) && fs.statSync(altPath).isDirectory()) {
                    outputDir = alt;
                    found = true;
                    console.log(`   ℹ️  Found output in: ${alt}`);
                    break;
                }
            }
            
            if (!found) {
                throw new Error(`Output directory not found. Expected: ${outputDir}`);
            }
        }
        
        // Clean destination
        if (fs.existsSync(finalGamePath)) {
            fs.rmSync(finalGamePath, { recursive: true, force: true });
        }
        fs.mkdirSync(finalGamePath, { recursive: true });
        
        // Copy ONLY the built files (not source)
        const sourcePath = path.join(tempGamePath, outputDir);
        fs.cpSync(sourcePath, finalGamePath, { recursive: true });
        
        // Verify index.html exists
        const indexPath = path.join(finalGamePath, 'index.html');
        if (!fs.existsSync(indexPath)) {
            throw new Error('No index.html found in build output!');
        }
        
        console.log(`   ✅ Deployed to: public/games/${game.name}/`);
        
        // STEP 6: Clean up temp files
        console.log(`🗑️  Cleaning up temporary files...`);
        fs.rmSync(tempGamePath, { recursive: true, force: true });
        console.log(`   ✅ Cleaned up`);
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`\n✨ SUCCESS! Completed in ${elapsed}s`);
        
        return { 
            success: true, 
            game, 
            time: elapsed, 
            method: 'built',
            outputDir: outputDir 
        };
        
    } catch (error) {
        console.error(`\n❌ FAILED: ${error.message}`);
        if (error.stderr) {
            console.error(`   Error details: ${error.stderr.substring(0, 200)}`);
        }
        
        // Clean up on failure
        if (fs.existsSync(tempGamePath)) {
            fs.rmSync(tempGamePath, { recursive: true, force: true });
        }
        
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
        return { 
            success: false, 
            game, 
            error: error.message,
            time: elapsed 
        };
    }
}

/**
 * Generate game wrapper HTML
 */
function generateGameWrapper(game) {
    const wrapperPath = path.join(wrappersDir, `${game.name}.html`);
    
    // Entry file is always index.html after build
    const entryFile = 'index.html';
    
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
            src="/games/${game.name}/${entryFile}" 
            class="game-frame"
            id="gameFrame"
            scrolling="no"
            allowfullscreen
            allow="accelerometer; gyroscope; autoplay; encrypted-media; fullscreen"
        ></iframe>
    </div>

    <script>
        const gameFrame = document.getElementById('gameFrame');
        const loadingOverlay = document.getElementById('loadingOverlay');
        
        gameFrame.addEventListener('load', function() {
            setTimeout(() => {
                loadingOverlay.classList.add('hidden');
            }, 500);
        });
        
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
        
        document.addEventListener('fullscreenchange', function() {
            if (!document.fullscreenElement) {
                document.body.classList.remove('fullscreen');
            }
        });
        
        document.body.addEventListener('touchmove', function(e) {
            if (e.touches.length > 1) {
                e.preventDefault();
            }
        }, { passive: false });
        
        document.addEventListener('gesturestart', function(e) {
            e.preventDefault();
        });
    </script>
</body>
</html>`;

    fs.writeFileSync(wrapperPath, html, 'utf-8');
    console.log(`   📄 Generated wrapper: ${game.name}.html`);
}

function capitalizeGameName(name) {
    return name.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
}

/**
 * Main setup function
 */
async function setupAllGames() {
    console.log('🎮 Building HTML5 Mobile Games from GitHub\n');
    console.log('📊 Estimated time: 2-7 minutes per game');
    console.log(`📦 Total games: ${games.length}\n`);
    
    const results = [];
    const startTime = Date.now();
    
    // Process games one at a time
    for (let i = 0; i < games.length; i++) {
        const result = await buildAndDeployGame(games[i], i, games.length);
        results.push(result);
        
        // Show progress
        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;
        console.log(`\n📈 Progress: ${successful} success, ${failed} failed, ${games.length - results.length} remaining`);
    }
    
    // Generate wrappers for successful games
    console.log('\n📝 Generating game wrapper HTML files...\n');
    const successfulGames = results.filter(r => r.success).map(r => r.game);
    successfulGames.forEach(game => {
        generateGameWrapper(game);
    });
    
    // Calculate statistics
    const totalTime = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
    const avgTime = results.length > 0 
        ? (results.reduce((sum, r) => sum + parseFloat(r.time), 0) / results.length).toFixed(1)
        : 0;
    
    // Print final summary
    console.log('\n' + '='.repeat(60));
    console.log('🎉 SETUP COMPLETE!');
    console.log('='.repeat(60));
    console.log(`✅ Successfully built: ${successfulGames.length} games`);
    console.log(`❌ Failed: ${results.filter(r => !r.success).length} games`);
    console.log(`⏱️  Total time: ${totalTime} minutes`);
    console.log(`📊 Average time per game: ${avgTime} seconds`);
    console.log('='.repeat(60));
    
    // List failed games
    const failedGames = results.filter(r => !r.success);
    if (failedGames.length > 0) {
        console.log('\n❌ Failed games:');
        failedGames.forEach(f => {
            console.log(`   - ${f.game.name}: ${f.error}`);
        });
    }
    
    console.log('\n✨ Next steps:');
    console.log('1. Run: npm start');
    console.log('2. Open: http://localhost:3000');
    console.log('3. Your games are ready! 🎮\n');
    
    // Save games list
    const gamesListPath = path.join(__dirname, 'games-list.json');
    fs.writeFileSync(gamesListPath, JSON.stringify(successfulGames, null, 2));
    console.log(`📋 Games list saved to: games-list.json\n`);
    
    // Clean up temp directory
    if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
    }
}

// Run setup
setupAllGames().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});