const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');

c = c.replace(/    \);\r?\n  \}\r?\n\}\r?\n?$/, '    );\n}\n');
fs.writeFileSync('src/components/Header.tsx', c);
console.log("Replaced with regex");
