const fs = require('fs');
const path = require('path');

const gamesDir = path.join(__dirname, 'public', 'games');

function walk(dir, callback) {
    if (!fs.existsSync(dir)) {
        console.log(`⚠️  Directory not found: ${dir}`);
        return;
    }
    
    try {
        fs.readdirSync(dir).forEach(file => {
            const fullPath = path.join(dir, file);
            const stats = fs.statSync(fullPath);
            if (stats.isDirectory()) {
                walk(fullPath, callback);
            } else if (stats.isFile() && ['.html', '.js', '.css'].includes(path.extname(file))) {
                callback(fullPath);
            }
        });
    } catch (err) {
        console.error(`Error walking directory ${dir}:`, err.message);
    }
}

// Check if games directory exists
if (!fs.existsSync(gamesDir)) {
    console.log('❌ Games directory not found. Run setup-games.js first.');
    process.exit(1);
}

// Get list of game directories
const gameDirs = fs.readdirSync(gamesDir).filter(item => {
    const fullPath = path.join(gamesDir, item);
    return fs.statSync(fullPath).isDirectory();
});

console.log(`🔧 Fixing paths in ${gameDirs.length} games...\n`);

let totalFilesFixed = 0;

gameDirs.forEach(gameDir => {
    const gamePath = path.join(gamesDir, gameDir);
    console.log(`📁 Processing: ${gameDir}`);
    
    let fileCount = 0;
    
    walk(gamePath, file => {
        try {
            let content = fs.readFileSync(file, 'utf-8');
            let modified = false;
            const originalContent = content;

            // Replace absolute paths (starting with /) with relative paths (./)
            // Matches: src="/path", href="/path", data-src="/path"
            // BUT: Skips URLs that start with // (protocol-relative) or contain ://  (full URLs)
            content = content.replace(
                /(src|href|data-src|url)\s*=\s*(["'])\/(?!\/|[a-zA-Z]+:\/\/)([^"']+)\2/gi,
                (match, attr, quote, urlPath) => {
                    modified = true;
                    return `${attr}=${quote}./${urlPath}${quote}`;
                }
            );

            // Also fix CSS url() references like: url(/images/bg.png)
            content = content.replace(
                /url\s*\(\s*(["']?)\/(?!\/|[a-zA-Z]+:\/\/)([^)"']+)\1\s*\)/gi,
                (match, quote, urlPath) => {
                    modified = true;
                    return `url(${quote}./${urlPath}${quote})`;
                }
            );

            if (modified) {
                fs.writeFileSync(file, content, 'utf-8');
                fileCount++;
                totalFilesFixed++;
                console.log(`   ✅ Fixed: ${path.relative(gamePath, file)}`);
            }
        } catch (err) {
            console.error(`   ❌ Error processing ${file}:`, err.message);
        }
    });
    
    if (fileCount === 0) {
        console.log(`   ℹ️  No files needed fixing`);
    } else {
        console.log(`   ✅ Fixed ${fileCount} files in ${gameDir}`);
    }
    console.log('');
});

console.log('='.repeat(50));
console.log(`🎯 Path fixing complete!`);
console.log(`📊 Total files fixed: ${totalFilesFixed}`);
console.log('='.repeat(50));