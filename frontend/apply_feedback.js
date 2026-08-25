const fs = require('fs');

// 1. Update translations.ts
let tFile = fs.readFileSync('src/context/translations.ts', 'utf8');
tFile = tFile.replace(/Top\s*Global Travel Destinations/g, 'Travel Destinations');
fs.writeFileSync('src/context/translations.ts', tFile);

// 2. Update HomePageClient.tsx
let hFile = fs.readFileSync('src/app/HomePageClient.tsx', 'utf8');

// Top Rated Marketplace Experiences -> Top Rated Experiences
hFile = hFile.replace(/Top Rated Marketplace Experiences/g, 'Top Rated Experiences');

// 3. Move the Top Rated filter to right
// Target the div next to it: <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
// It's inside {/* HEADER BAR WITH TITLE, SLIDER CONTROLS & SORT DROPDOWN */}
hFile = hFile.replace(
  /<div style=\{\{ display: 'flex', alignItems: 'center', gap: '12px' \}\}>/g,
  '<div className="top-rated-controls" style={{ display: \'flex\', alignItems: \'center\', gap: \'12px\' }}>'
);

// 4. Update "Why choose Vaitour" section to use the scroll classes
hFile = hFile.replace(
  /<div style=\{\{ display: 'grid', gridTemplateColumns: 'repeat\(auto-fit, minmax\(250px, 1fr\)\)', gap: '24px' \}\}>/g,
  '<div className="why-choose-scroll" style={{ display: \'grid\', gridTemplateColumns: \'repeat(auto-fit, minmax(250px, 1fr))\', gap: \'24px\' }}>'
);

// Update all 3 cards in the Why Choose section
hFile = hFile.replace(
  /className="card-panel" style=\{\{ padding: '28px 24px', borderRadius: 'var\(--radius-md\)', textAlign: 'left', display: 'flex', flexDirection: 'column', alignItems: 'center' \}\}/g,
  'className="card-panel why-choose-card" style={{ padding: \'28px 24px\', borderRadius: \'var(--radius-md)\', textAlign: \'left\', display: \'flex\', flexDirection: \'column\', alignItems: \'flex-start\' }}'
);

// Replace icon container alignment if needed (currently they might have centered icons, flex-start will left-align them)
fs.writeFileSync('src/app/HomePageClient.tsx', hFile);

// 5. Update globals.css
let cFile = fs.readFileSync('src/app/globals.css', 'utf8');
cFile += `
@media (max-width: 768px) {
  h2 {
    font-size: 1.4rem !important;
  }
  .top-rated-controls {
    margin-left: auto !important;
  }
  .why-choose-scroll {
    display: flex !important;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    scroll-behavior: smooth;
    scrollbar-width: none;
    -ms-overflow-style: none;
    padding-bottom: 16px;
    margin-left: -24px;
    margin-right: -24px;
    padding-left: 24px;
    padding-right: 24px;
  }
  .why-choose-scroll::-webkit-scrollbar {
    display: none;
  }
  .why-choose-card {
    flex: 0 0 42% !important;
    min-width: 150px;
    scroll-snap-align: center;
    padding: 16px !important;
    align-items: flex-start !important;
  }
  .why-choose-card h3 {
    font-size: 1.05rem !important;
    margin-top: 12px !important;
  }
  .why-choose-card p {
    font-size: 0.82rem !important;
    line-height: 1.4 !important;
  }
}
`;
fs.writeFileSync('src/app/globals.css', cFile);

console.log("ALL DONE");
