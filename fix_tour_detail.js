const fs = require('fs');

let tourCode = fs.readFileSync('frontend/src/app/tours/[slug]/TourDetailClient.tsx', 'utf8');

const askAiStart = '{/* SRS 9.14: "ASK AI ABOUT THIS PLACE" CONTEXTUAL Q&A WIDGET */}';
const newAskAiStart = '{/* SRS 9.14: "ASK AI ABOUT THIS PLACE" CONTEXTUAL Q&A WIDGET (Temporarily hidden)\n';
const askAiEnd = '</div>          {/* ITINERARY SECTION */}';
const newAskAiEnd = '</div>\n*/}         {/* ITINERARY SECTION */}';

tourCode = tourCode.replace(askAiStart, newAskAiStart);
tourCode = tourCode.replace(askAiEnd, newAskAiEnd);

fs.writeFileSync('frontend/src/app/tours/[slug]/TourDetailClient.tsx', tourCode);
console.log('Fixed TourDetailClient successfully!');
