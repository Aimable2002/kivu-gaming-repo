const fs = require('fs');
const path = require('path');

const gameDir = path.join(__dirname, 'public', 'games', 'threejs-cannon', 'public');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(file => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);
        if (stats.isDirectory()) {
            walk(fullPath, callback);
        } else if (stats.isFile() && ['.html', '.js', '.css'].includes(path.extname(file))) {
            callback(fullPath);
        }
    });
}

walk(gameDir, file => {
    let content = fs.readFileSync(file, 'utf-8');

    // Replace leading slash paths with relative './'
    content = content.replace(/(src|href|data-src)=["']\/([^"']+)["']/g, '$1="./$2"');

    fs.writeFileSync(file, content, 'utf-8');
    console.log(`✅ Fixed paths in: ${file}`);
});

console.log('🎯 All paths fixed!');
