const fs = require('fs');

// 1. Update CurrencyLanguageDropdown.tsx to support direction="up"
let cld = fs.readFileSync('src/components/CurrencyLanguageDropdown.tsx', 'utf8');

if (!cld.includes('direction?:')) {
  cld = cld.replace(
    "export default function CurrencyLanguageDropdown() {",
    "export default function CurrencyLanguageDropdown({ direction = 'down' }: { direction?: 'down' | 'up' }) {"
  );
  
  cld = cld.replace(
    "top: 'calc(100% + 8px)',",
    "top: direction === 'down' ? 'calc(100% + 8px)' : 'auto',\n            bottom: direction === 'up' ? 'calc(100% + 8px)' : 'auto',"
  );
  fs.writeFileSync('src/components/CurrencyLanguageDropdown.tsx', cld);
}


// 2. Update Header.tsx
let header = fs.readFileSync('src/components/Header.tsx', 'utf8');

// Replace "Explore the world" with Logo
const oldHeader = `<h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Explore the world</h3>`;
const newHeader = `<div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Image src="/logo.png" alt="Vaitour Logo" width={24} height={24} style={{ width: '24px', height: '24px', objectFit: 'contain' }} /><span style={{ fontSize: '1.25rem', fontWeight: 800, lineHeight: 1 }} className="gradient-text">Vaitour</span></div>`;
header = header.replace(oldHeader, newHeader);

// Pass direction="up" to CurrencyLanguageDropdown
header = header.replace(
  "<CurrencyLanguageDropdown />",
  "<CurrencyLanguageDropdown direction=\"up\" />"
);

// We should also replace it inside the left part if there's any other occurence, but it's only in the footer for mobile.
fs.writeFileSync('src/components/Header.tsx', header);
console.log("Done");
