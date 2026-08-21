const fs = require('fs');
let c = fs.readFileSync('frontend/src/app/HomePageClient.tsx', 'utf8');

c = c.replace(/export default function HomePage\(\) \{/g, `import Image from 'next/image';

export default function HomePage() {`);

fs.writeFileSync('frontend/src/app/HomePageClient.tsx', c);
