const fs = require('fs');

let tourCode = fs.readFileSync('frontend/src/app/tours/[slug]/TourDetailClient.tsx', 'utf8');

tourCode = tourCode.replace(
  /<\/div>\)\}\\n\\n\s*\{\/\* ITINERARY SECTION \*\/\}/,
  `</div>)}\n\n          {/* ITINERARY SECTION */}`
);

fs.writeFileSync('frontend/src/app/tours/[slug]/TourDetailClient.tsx', tourCode);
console.log('Fixed literal \\n\\n bug!');
