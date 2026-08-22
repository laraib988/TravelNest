const fs = require('fs');

let homeCode = fs.readFileSync('frontend/src/app/HomePageClient.tsx', 'utf8');

homeCode = homeCode.replace(
  /placeholder=\{t\('search_placeholder'\)\}/,
  `placeholder="e.g. Best time to visit Japan, Tokyo..."`
);

fs.writeFileSync('frontend/src/app/HomePageClient.tsx', homeCode);
console.log('Fixed search placeholder!');
