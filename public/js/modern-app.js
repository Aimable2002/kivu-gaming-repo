let allGames = [];
let currentFilter = 'all';

// Fetch games on load
async function loadGames() {
    try {
        const response = await fetch('/api/games');
        const data = await response.json();
        
        if (data.success) {
            allGames = data.games;
            displayGames(allGames);
            document.getElementById('totalGames').textContent = allGames.length;
        }
        
        document.getElementById('loading').style.display = 'none';
    } catch (error) {
        console.error('Error loading games:', error);
        document.getElementById('loading').innerHTML = `
            <p style="color: #ff0080;">Error loading games. Please refresh the page.</p>
        `;
    }
}

function displayGames(games) {
    const grid = document.getElementById('gamesGrid');
    
    if (games.length === 0) {
        grid.innerHTML = '<p style="text-align: center; color: #8892b0;">No games found.</p>';
        return;
    }
    
    grid.innerHTML = games.map(game => `
        <div class="game-card" data-category="${game.category}" onclick="playGame('${game.path}', ${game.external || false}, '${game.externalUrl || ''}')">
            <div class="game-icon">${game.thumbnail}</div>
            <h3 class="game-name">${game.name}</h3>
            <div class="game-meta">
                <span class="badge badge-category">${game.category}</span>
                <span class="badge badge-difficulty">${game.difficulty}</span>
                <span class="badge badge-players">${game.players}</span>
            </div>
            <p class="game-description">${game.description}</p>
            <div class="game-footer">
                <div class="github-stats">
                    <div class="stat-item">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                            <path d="M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25z"/>
                        </svg>
                        ${game.realStars || game.stars}
                    </div>
                    ${game.githubUrl ? `
                        <a href="${game.githubUrl}" target="_blank" onclick="event.stopPropagation()" style="color: #8892b0; text-decoration: none;">
                            GitHub →
                        </a>
                    ` : ''}
                </div>
                <button class="play-btn">
                    Play Now
                </button>
            </div>
        </div>
    `).join('');
}

function playGame(path, external = false, externalUrl = '') {
    if (external && externalUrl) {
        window.open(externalUrl, '_blank');
    } else {
        window.location.href = path;
    }
}

function scrollToGames() {
    document.getElementById('games').scrollIntoView({ behavior: 'smooth' });
}

// Filter games
document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
        e.target.classList.add('active');
        
        const filter = e.target.dataset.filter;
        currentFilter = filter;
        
        if (filter === 'all') {
            displayGames(allGames);
        } else {
            const filtered = allGames.filter(game => game.category === filter);
            displayGames(filtered);
        }
    });
});

// Load games on page load
loadGames();