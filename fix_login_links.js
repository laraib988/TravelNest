const fs = require('fs');

function addLink(filePath, text, linkText, linkHref) {
  let code = fs.readFileSync(filePath, 'utf8');
  const strToInject = `
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          ${text} <Link href="${linkHref}" style={{ color: 'var(--brand-primary)', fontWeight: 700, textDecoration: 'underline' }}>${linkText}</Link>
        </div>`;
        
  // Inject right after the "Don't have an account? Sign Up" block
  code = code.replace(
    /(<Link href="[^"]+" style=\{\{ color: 'var\(--brand-primary\)', fontWeight: 700, textDecoration: 'underline' \}\}>\s*[^<]+\s*<\/Link>\s*<\/div>)/,
    `$1${strToInject}`
  );
  fs.writeFileSync(filePath, code);
}

addLink('frontend/src/app/login/page.tsx', 'Are you a Supplier/Partner?', 'Supplier Login', '/supplier/login');
addLink('frontend/src/app/supplier/login/page.tsx', 'Are you a Traveler/Customer?', 'Customer Login', '/login');
console.log('Added cross-links to login pages!');
