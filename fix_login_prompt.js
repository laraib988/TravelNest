const fs = require('fs');
const path = 'frontend/src/components/tours/TourReviews.tsx';
let code = fs.readFileSync(path, 'utf8');

// Replace `const { user } = useAuth();` with `const { user, openAuthModal } = useAuth();`
// We also have to be careful if there's router stuff
code = code.replace(/const \{ user \} = useAuth\(\);/, 'const { user, openAuthModal } = useAuth();');

// Replace `router.push('/login')` with `openAuthModal('LOGIN')`
code = code.replace(/router\.push\('\/login'\)/g, "openAuthModal('LOGIN')");

// Also, let's remove unused `useRouter` if it's there (optional, but cleaner)
// code = code.replace(/import \{ useRouter \} from 'next\/navigation';/, '');

fs.writeFileSync(path, code);
console.log('Fixed login prompt!');
