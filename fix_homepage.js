const fs = require('fs');

let homeCode = fs.readFileSync('frontend/src/app/HomePageClient.tsx', 'utf8');

// 1. Comment out AI Trip Planner section safely
const plannerStart = '{/* 4. AI TRIP PLANNER DYNAMIC HERO FEATURE */}';
const newPlannerStart = '{/* 4. AI TRIP PLANNER DYNAMIC HERO FEATURE (Temporarily hidden)\n';
const plannerEnd = '</section>\n\n      {/* 5. POPULAR THIS WEEK */}';
const newPlannerEnd = '</section>\n*/}\n\n      {/* 5. POPULAR THIS WEEK */}';

homeCode = homeCode.replace(plannerStart, newPlannerStart);
homeCode = homeCode.replace(plannerEnd, newPlannerEnd);

// 2. Update 'Where to go next' keywords
homeCode = homeCode.replace(
  /'Calgary', 'MontrAcal', 'Toronto', 'Vancouver', 'Lyon', 'Marseille', 'Nice',\s*'Paris', 'Kyoto', 'Osaka', 'Tokyo', 'Al-Ula', 'Jeddah', 'Mecca', 'Riyadh',\s*'Birmingham', 'Liverpool', 'London', 'Manchester'/,
  `'best time to visit japan', 'tokyo best time to visit', 'Calgary', 'Montreal', 'Toronto', 'Vancouver', 'Lyon', 'Marseille', 'Nice', 'Paris', 'Kyoto', 'Osaka', 'Tokyo', 'Al-Ula', 'Jeddah', 'Mecca', 'Riyadh', 'Birmingham', 'Liverpool', 'London', 'Manchester'`
);

fs.writeFileSync('frontend/src/app/HomePageClient.tsx', homeCode);
console.log('Fixed HomePageClient successfully!');
