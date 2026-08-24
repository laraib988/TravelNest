const fs = require('fs');
let code = fs.readFileSync('src/app/tours/[slug]/TourDetailView.tsx', 'utf8');
if (!code.includes("'use client'") && !code.includes('"use client"')) {
  code = "'use client';\n\n" + code;
  fs.writeFileSync('src/app/tours/[slug]/TourDetailView.tsx', code);
  console.log('Added use client to TourDetailView');
}
