const fs = require('fs');

let hFile = fs.readFileSync('src/app/HomePageClient.tsx', 'utf8');

// The How It Works container:
const oldGrid = `<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>`;
const newGrid = `<div className="why-choose-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '30px' }}>`;
hFile = hFile.replace(oldGrid, newGrid);

// Step 1
hFile = hFile.replace(
  `<div style={{ textAlign: 'center' }}>\n                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>1</div>`,
  `<div className="why-choose-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>\n                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: 800 }}>1</div>`
);

// Step 2
hFile = hFile.replace(
  `<div style={{ textAlign: 'center' }}>\n                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>2</div>`,
  `<div className="why-choose-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>\n                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: 800 }}>2</div>`
);

// Step 3
hFile = hFile.replace(
  `<div style={{ textAlign: 'center' }}>\n                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>3</div>`,
  `<div className="why-choose-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>\n                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: 800 }}>3</div>`
);

// Step 4
hFile = hFile.replace(
  `<div style={{ textAlign: 'center' }}>\n                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontWeight: 800 }}>4</div>`,
  `<div className="why-choose-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' }}>\n                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--brand-primary)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px', fontWeight: 800 }}>4</div>`
);

fs.writeFileSync('src/app/HomePageClient.tsx', hFile);
console.log("DONE");
