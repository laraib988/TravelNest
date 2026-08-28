const fs = require('fs');
const file = 'src/app/tours/[slug]/TourDetailView.tsx';
let data = fs.readFileSync(file, 'utf8');

const regex = /\{\/\* ABOUT SUPPLIER - MOBILE ONLY \*\/\}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>\s*<\/div>/;
const match = data.match(regex);
if(match) {
  // We need to replace the entire ABOUT SUPPLIER block. But keep the closing div of left column if it matched it?
  // Actually, the block is exactly 21 lines.
  // I will just use string replace.
}
