const fs = require('fs');

// 1. UPDATE HomePageClient.tsx
let hFile = fs.readFileSync('src/app/HomePageClient.tsx', 'utf8');

// Newsletter Title Color
hFile = hFile.replace(
  /<h2 style=\{\{ fontSize: '2rem', fontWeight: 800, marginBottom: '12px' \}\}>\{t\('newsletter_title'\)\}<\/h2>/g,
  '<h2 style={{ fontSize: \'2rem\', fontWeight: 800, marginBottom: \'12px\', color: \'#ffffff\' }}>{t(\'newsletter_title\')}</h2>'
);

// Newsletter Form Flex Wrap
hFile = hFile.replace(
  /style=\{\{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', maxWidth: '500px', margin: '0 auto' \}\}/g,
  'style={{ display: \'flex\', flexWrap: \'nowrap\', gap: \'10px\', justifyContent: \'center\', maxWidth: \'500px\', margin: \'0 auto\' }}'
);

// Newsletter Input Min Width
hFile = hFile.replace(
  /minWidth: '240px'/g,
  'minWidth: \'120px\''
);

fs.writeFileSync('src/app/HomePageClient.tsx', hFile);


// 2. UPDATE Header.tsx (Remove Preferences from mobile menu)
let headFile = fs.readFileSync('src/components/Header.tsx', 'utf8');
const prefSection = `                      {/* Footer Settings */}
                      <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                         <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Preferences</span>
                         <CurrencyLanguageDropdown />
                      </div>`;
headFile = headFile.replace(prefSection, '');
fs.writeFileSync('src/components/Header.tsx', headFile);


// 3. UPDATE Footer.tsx
let fFile = fs.readFileSync('src/components/Footer.tsx', 'utf8');

// Add import
if (!fFile.includes('CurrencyLanguageDropdown')) {
  fFile = fFile.replace(
    'import { useCurrency } from \'@/context/CurrencyContext\';',
    'import { useCurrency } from \'@/context/CurrencyContext\';\nimport CurrencyLanguageDropdown from \'./CurrencyLanguageDropdown\';'
  );
}

// Wrap Quick Links and Support in a `.footer-links-row`
const col2 = `            {/* COLUMN 2: QUICK LINKS */}
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                {t('quick_links')}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                <li><Link href="/community" style={{ color: '#d1d5db', textDecoration: 'none' }}>Community Forum</Link></li>
                <li><Link href="/loyalty" style={{ color: '#d1d5db', textDecoration: 'none' }}>Loyalty & Rewards</Link></li>
                <li><Link href="/blog" style={{ color: '#d1d5db', textDecoration: 'none' }}>Travel Journal</Link></li>
                <li><Link href="/ai-planner" style={{ color: '#d1d5db', textDecoration: 'none' }}>AI Trip Studio</Link></li>
                <li><Link href="/supplier" style={{ color: '#d1d5db', textDecoration: 'none' }}>Supplier Portal</Link></li>
                <li><Link href="/about" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('about_us')}</Link></li>
                <li><Link href="/support" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('help_support')}</Link></li>
              </ul>
            </div>`;

const col3 = `            {/* COLUMN 3: SUPPORT */}
            <div>
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                {t('support')}
              </h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.95rem' }}>
                <li><Link href="/privacy" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('privacy_policy')}</Link></li>
                <li><Link href="/terms" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('terms_service')}</Link></li>
                <li><Link href="/cancellation-policy" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('cancellation_policy')}</Link></li>
                <li><Link href="/refund-policy" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('refund_policy')}</Link></li>
                <li><Link href="/faq" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('faq')}</Link></li>
                <li><Link href="/sitemap" style={{ color: '#d1d5db', textDecoration: 'none' }}>{t('sitemap')}</Link></li>
              </ul>
            </div>`;

const paymentChannels = `            {/* COLUMN 3: PAYMENT CHANNELS */}`;

if (fFile.includes(col2) && fFile.includes(col3)) {
  const wrapped = `          <div className="footer-links-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '20px' }}>\n` + col2 + `\n\n` + col3 + `\n          </div>`;
  fFile = fFile.replace(col2 + `\n\n` + col3, wrapped);
}

// Add Preferences column
const prefCol = `            {/* COLUMN 4: PREFERENCES */}
            <div className="footer-preferences">
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '22px' }}>
                Preferences
              </h4>
              <CurrencyLanguageDropdown direction="up" />
            </div>`;

// Insert it before Payment Channels
fFile = fFile.replace(paymentChannels, prefCol + '\n\n' + paymentChannels);

fs.writeFileSync('src/components/Footer.tsx', fFile);


// 4. UPDATE globals.css
let cFile = fs.readFileSync('src/app/globals.css', 'utf8');
cFile += `
@media (max-width: 768px) {
  .footer-links-row {
    grid-template-columns: 1fr 1fr !important;
    gap: 16px !important;
  }
}
`;
fs.writeFileSync('src/app/globals.css', cFile);

console.log("DONE");
