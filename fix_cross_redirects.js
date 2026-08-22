const fs = require('fs');

function fixCrossLinks(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // For login page linking to signup
  code = code.replace(
    /<Link href="\/signup" style=\{\{ color: 'var\(--brand-primary\)', fontWeight: 700, textDecoration: 'underline' \}\}>/,
    `<Link href={redirectUrl !== '/' ? \`/signup?redirect=\${encodeURIComponent(redirectUrl)}\` : '/signup'} style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'underline' }}>`
  );

  // For signup page linking to login
  code = code.replace(
    /<Link href="\/login" style=\{\{ color: 'var\(--brand-primary\)', fontWeight: 700, textDecoration: 'underline' \}\}>/,
    `<Link href={redirectUrl !== '/' ? \`/login?redirect=\${encodeURIComponent(redirectUrl)}\` : '/login'} style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'underline' }}>`
  );

  fs.writeFileSync(filePath, code);
}

fixCrossLinks('frontend/src/app/login/page.tsx');
fixCrossLinks('frontend/src/app/signup/page.tsx');

console.log('Fixed cross links to preserve redirect query params!');
