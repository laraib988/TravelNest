const fs = require('fs');

// 1. Hide AI Trip Studio in Header
let headerCode = fs.readFileSync('frontend/src/components/Header.tsx', 'utf8');
headerCode = headerCode.replace(
  /<Link\s*href="\/ai-planner"[\s\S]*?\{t\('ai_trip_studio'\)\}\s*<\/Link>/,
  `{/* <Link href="/ai-planner" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {t('ai_trip_studio')}
                </Link> */}`
);
fs.writeFileSync('frontend/src/components/Header.tsx', headerCode);

// 2. Hide AI Engine 2.0 in HomePageClient & update Where to Go Next keywords
let homeCode = fs.readFileSync('frontend/src/app/HomePageClient.tsx', 'utf8');
homeCode = homeCode.replace(
  /\{\/\* 4\. AI TRIP PLANNER DYNAMIC HERO FEATURE \*\/\}/,
  `{/* 4. AI TRIP PLANNER DYNAMIC HERO FEATURE (Temporarily hidden) `
);
// Find the end of the section
homeCode = homeCode.replace(
  /<\/section>\s*\{\/\* 5\. EXPERTISE\/FEATURES BAND \*\/\}/,
  `</section> */}\n\n      {/* 5. EXPERTISE/FEATURES BAND */}`
);

// Update keywords
homeCode = homeCode.replace(
  /'Calgary', 'MontrAcal', 'Toronto', 'Vancouver', 'Lyon', 'Marseille', 'Nice',\s*'Paris', 'Kyoto', 'Osaka', 'Tokyo', 'Al-Ula', 'Jeddah', 'Mecca', 'Riyadh',\s*'Birmingham', 'Liverpool', 'London', 'Manchester'/,
  `'best time to visit japan', 'tokyo best time to visit', 'Calgary', 'Montreal', 'Toronto', 'Vancouver', 'Lyon', 'Marseille', 'Nice', 'Paris', 'Kyoto', 'Osaka', 'Tokyo', 'Al-Ula', 'Jeddah', 'Mecca', 'Riyadh', 'Birmingham', 'Liverpool', 'London', 'Manchester'`
);
fs.writeFileSync('frontend/src/app/HomePageClient.tsx', homeCode);

// 3. Hide Ask with AI in TourDetailClient
let tourCode = fs.readFileSync('frontend/src/app/tours/[slug]/TourDetailClient.tsx', 'utf8');
tourCode = tourCode.replace(
  /\{\/\* SRS 9\.14: "ASK AI ABOUT THIS PLACE" CONTEXTUAL Q&A WIDGET \*\/\}/,
  `{/* SRS 9.14: "ASK AI ABOUT THIS PLACE" CONTEXTUAL Q&A WIDGET (Temporarily hidden)`
);
tourCode = tourCode.replace(
  /<\/div>\s*\{\/\* 9\. MAP \*\/\}/,
  `</div> */}\n\n          {/* 9. MAP */}`
);
fs.writeFileSync('frontend/src/app/tours/[slug]/TourDetailClient.tsx', tourCode);

console.log('Successfully hid AI elements and updated keywords!');
