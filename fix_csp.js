const fs = require('fs');
const path = 'frontend/next.config.mjs';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /connect-src 'self' https:\/\/\*\.supabase\.co wss:\/\/\*\.supabase\.co https:\/\/api\.mapbox\.com https:\/\/events\.mapbox\.com https:\/\/api\.frankfurter\.app https:\/\/travelnest-backend\.onrender\.com http:\/\/localhost:4000;/,
  "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.mapbox.com https://events.mapbox.com https://api.frankfurter.app https://travelnest-backend.onrender.com http://localhost:4000 https://cdn.jsdelivr.net;"
);

fs.writeFileSync(path, code);
console.log('Fixed CSP!');
