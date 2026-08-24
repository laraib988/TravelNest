const fs = require('fs');

let pageCode = fs.readFileSync('src/app/tours/[slug]/TourDetailView.tsx', 'utf8');

// Find where we render the tour title or location and inject the Verified Local Operator badge
pageCode = pageCode.replace(
  /<div style=\{\{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' \}\}>/,
  `<div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>\n            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#ecfdf5', color: '#059669', padding: '6px 12px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700 }}>\n              <CheckCircle2 size={16} /> Verified Local Operator\n            </div>`
);

fs.writeFileSync('src/app/tours/[slug]/TourDetailView.tsx', pageCode);

console.log('Added Verified Local Operator badge');
