const simpleGit = require('simple-git');
const fs = require('fs');
const path = require('path');

const git = simpleGit();

const games = [
    {
        name: '2048',
        repo: 'https://github.com/gabrielecirulli/2048.git',
        path: './public/games/2048'
    },
    {
        name: 'hextris',
        repo: 'https://github.com/Hextris/hextris.git',
        path: './public/games/hextris'
    },
    {
        name: 'clumsy-bird',
        repo: 'https://github.com/ellisonleao/clumsy-bird.git',
        path: './public/games/clumsy-bird'
    }
];

async function setupGames() {
    console.log('🎮 Setting up games from GitHub...\n');

    // Create games directory if it doesn't exist
    if (!fs.existsSync('./public/games')) {
        fs.mkdirSync('./public/games', { recursive: true });
    }

    for (const game of games) {
        console.log(`📦 Cloning ${game.name}...`);
        
        try {
            
            if (fs.existsSync(game.path)) {
                fs.rmSync(game.path, { recursive: true, force: true });
            }

            // Clone the repository
            await git.clone(game.repo, game.path);
            console.log(`✅ ${game.name} cloned successfully!\n`);
        } catch (error) {
            console.error(`❌ Error cloning ${game.name}:`, error.message);
        }
    }

    console.log('🎉 All games setup complete!');
    console.log('Run "npm start" to launch the server.\n');
}

setupGames();