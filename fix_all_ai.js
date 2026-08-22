const fs = require('fs');

// 1. Header.tsx: Hide AI Trip Studio link
let headerCode = fs.readFileSync('frontend/src/components/Header.tsx', 'utf8');
headerCode = headerCode.replace(
  /<Link\s*href="\/ai-planner"[\s\S]*?\{t\('ai_trip_studio'\)\}\s*<\/Link>/,
  `{false && (
                <Link href="/ai-planner" className="btn-primary" style={{ padding: '8px 18px', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>
                  {t('ai_trip_studio')}
                </Link>
              )}`
);
fs.writeFileSync('frontend/src/components/Header.tsx', headerCode);

// 2. HomePageClient.tsx: Hide AI Trip Planner section and update keywords
let homeCode = fs.readFileSync('frontend/src/app/HomePageClient.tsx', 'utf8');
homeCode = homeCode.replace(
  /\{\/\* 4\. AI TRIP PLANNER DYNAMIC HERO FEATURE \*\/\}\s*<section/,
  `{/* 4. AI TRIP PLANNER DYNAMIC HERO FEATURE (Temporarily hidden) */}\n      {false && (<section`
);
homeCode = homeCode.replace(
  /<\/section>\s*\{\/\* 5\. POPULAR THIS WEEK \*\/\}/,
  `</section>)}      {/* 5. POPULAR THIS WEEK */}`
);
homeCode = homeCode.replace(
  /'Calgary', 'MontrAcal', 'Toronto', 'Vancouver', 'Lyon', 'Marseille', 'Nice',\s*'Paris', 'Kyoto', 'Osaka', 'Tokyo', 'Al-Ula', 'Jeddah', 'Mecca', 'Riyadh',\s*'Birmingham', 'Liverpool', 'London', 'Manchester'/,
  `'best time to visit japan', 'tokyo best time to visit', 'Calgary', 'Montreal', 'Toronto', 'Vancouver', 'Lyon', 'Marseille', 'Nice', 'Paris', 'Kyoto', 'Osaka', 'Tokyo', 'Al-Ula', 'Jeddah', 'Mecca', 'Riyadh', 'Birmingham', 'Liverpool', 'London', 'Manchester'`
);
fs.writeFileSync('frontend/src/app/HomePageClient.tsx', homeCode);

// 3. TourDetailClient.tsx: Hide Ask AI widget
let tourCode = fs.readFileSync('frontend/src/app/tours/[slug]/TourDetailClient.tsx', 'utf8');
tourCode = tourCode.replace(
  /\{\/\* SRS 9\.14: "ASK AI ABOUT THIS PLACE" CONTEXTUAL Q&A WIDGET \*\/\}\s*<div/,
  `{/* SRS 9.14: "ASK AI ABOUT THIS PLACE" CONTEXTUAL Q&A WIDGET (Temporarily hidden) */}\n            {false && (<div`
);
tourCode = tourCode.replace(
  /<\/div>\s*\{\/\* ITINERARY SECTION \*\/\}/,
  `</div>)}\\n\\n            {/* ITINERARY SECTION */}`
);
fs.writeFileSync('frontend/src/app/tours/[slug]/TourDetailClient.tsx', tourCode);

console.log('All AI sections hidden safely using false && pattern!');
