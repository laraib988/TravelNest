const fs = require('fs');
let fFile = fs.readFileSync('src/components/Footer.tsx', 'utf8');

const startCol2 = fFile.indexOf('{/* COLUMN 2: QUICK LINKS */}');
const endCol3 = fFile.indexOf('{/* COLUMN 4: PREFERENCES */}');

if (startCol2 !== -1 && endCol3 !== -1 && !fFile.includes('footer-links-row')) {
  const contentToWrap = fFile.substring(startCol2, endCol3);
  const wrapped = `          <div className="footer-links-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '40px' }}>\n  ` + contentToWrap + `          </div>\n\n`;
  fFile = fFile.replace(contentToWrap, wrapped);
  fs.writeFileSync('src/components/Footer.tsx', fFile);
  console.log("Replaced");
} else {
  console.log("Not found or already wrapped");
}
