const fs = require('fs');
const path = require('path');

const assetsDir = path.join(__dirname, 'assets');
const jsonOutputFile = path.join(assetsDir, 'photos.json');
const jsOutputFile = path.join(assetsDir, 'photos-data.js');

if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

const validExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg']);

let photoFiles = [];
try {
  const files = fs.readdirSync(assetsDir);
  photoFiles = files
    .filter(f => validExtensions.has(path.extname(f).toLowerCase()))
    .filter(f => !f.startsWith('.') && f !== 'hero-placeholder.svg' && f !== 'hero.jpg' && f !== 'photos.json' && f !== 'photos-data.js')
    .sort((a, b) => {
      return a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' });
    });
} catch (err) {
  console.warn('Could not read assets directory:', err.message);
}

const photoPaths = photoFiles.map(f => `assets/${encodeURIComponent(f)}`.replace(/%2F/g, '/'));

const manifest = {
  total: photoPaths.length,
  photos: photoPaths
};

fs.writeFileSync(jsonOutputFile, JSON.stringify(manifest, null, 2), 'utf8');

const jsContent = `// Auto-generated photo list for Pradnya's Birthday Website
window.PHOTOS_DATA = ${JSON.stringify(manifest, null, 2)};
`;
fs.writeFileSync(jsOutputFile, jsContent, 'utf8');

console.log(`Discovered ${photoPaths.length} photos in assets/ folder.`);
console.log(`Saved manifest to ${jsonOutputFile} and ${jsOutputFile}`);
