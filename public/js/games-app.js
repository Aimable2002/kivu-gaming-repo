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
            document.getElementById('totalGames').textContent = data.totalGames;
            
            // Hide loading, show grid
            document.getElementById('loadingState').style.display = 'none';
            document.getElementById('gamesGrid').style.display = 'grid';
        }
    } catch (error) {
        console.error('Error loading games:', error);
        document.getElementById('loadingState').innerHTML = `
            <i class="fas fa-exclamation-circle" style="font-size: 48px; color: #FF6600;"></i>
            <p style="margin-top: 12px; color: #6b7280;">Failed to load games. Please refresh.</p>
        `;
    }
}

function displayGames(games) {
    const grid = document.getElementById('gamesGrid');
    
    if (games.length === 0) {
        grid.innerHTML = `
            <div style="text-align: center; padding: 40px; grid-column: 1/-1;">
                <i class="fas fa-inbox" style="font-size: 48px; color: #9CA3AF;"></i>
                <p style="margin-top: 12px; color: #6b7280;">No games found in this category.</p>
            </div>
        `;
        return;
    }
    
    grid.innerHTML = games.map(game => `
        <div class="game-card animate-fade-in" onclick="playGame('${game.path}', ${game.external || false}, '${game.externalUrl || ''}')">
            <div class="game-card-header">
                <div class="game-icon-large">${game.thumbnail}</div>
            </div>
            <div class="game-card-body">
                <h3 class="game-name">${game.name}</h3>
                <p class="game-description">${game.description}</p>
                
                <div class="game-meta">
                    <span class="badge badge-category">${game.category}</span>
                    <span class="badge badge-difficulty">${game.difficulty}</span>
                    <span class="badge badge-players">${game.players}</span>
                </div>
                
                <div class="game-footer">
                    <div class="github-stats">
                        <div class="stat-item-inline">
                            <i class="fas fa-star" style="color: #FFB800;"></i>
                            <span>${game.realStars || game.stars}</span>
                        </div>
                        ${game.githubUrl ? `
                            <a href="${game.githubUrl}" target="_blank" onclick="event.stopPropagation()" style="color: #00695C; text-decoration: none;">
                                <i class="fas fa-code-branch"></i>
                            </a>
                        ` : ''}
                    </div>
                    <button class="play-btn-kivu">
                        <i class="fas fa-play"></i> Play
                    </button>
                </div>
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

// Filter functionality
document.querySelectorAll('.filter-tab').forEach(btn => {
    btn.addEventListener('click', (e) => {
        // Remove active class from all
        document.querySelectorAll('.filter-tab').forEach(b => {
            b.classList.remove('tab-active');
            b.classList.add('tab-inactive');
        });
        
        // Add active class to clicked
        e.target.classList.remove('tab-inactive');
        e.target.classList.add('tab-active');
        
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