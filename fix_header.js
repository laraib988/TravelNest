const fs = require('fs');
const path = 'frontend/src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

const emptyElse = `) : null}`;

const newElse = `) : (
              <div style={{ display: 'flex', gap: '8px' }}>
                <Link href="/login" style={{ padding: '6px 16px', fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', textDecoration: 'none', border: '1px solid #cbd5e1', borderRadius: '20px', background: '#fff' }}>Sign In</Link>
                <Link href="/signup" style={{ padding: '6px 16px', fontSize: '0.85rem', fontWeight: 700, color: '#fff', textDecoration: 'none', border: '1px solid var(--brand-primary)', borderRadius: '20px', background: 'var(--brand-primary)' }}>Sign Up</Link>
              </div>
            )}`;

code = code.replace(emptyElse, newElse);

fs.writeFileSync(path, code);
console.log('Fixed Header login buttons!');
