const fs = require('fs');
const path = 'frontend/src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

const regex = /<Link\s+href="\/admin"[\s\S]*?<LayoutDashboard size=\{15\} color="#7c3aed" \/> Admin Portal\s*<\/Link>/;

const newAdminLink = `{user?.role === 'ADMIN' && (
                    <Link
                      href="/admin"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', fontSize: '0.88rem', color: '#7c3aed', textDecoration: 'none', fontWeight: 700, background: '#f5f3ff' }}
                    >
                      <LayoutDashboard size={15} color="#7c3aed" /> Admin Portal
                    </Link>
                    )}`;

code = code.replace(regex, newAdminLink);

fs.writeFileSync(path, code);
console.log('Fixed Header Admin Link REALLY THIS TIME!');
