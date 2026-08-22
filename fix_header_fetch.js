const fs = require('fs');
const path = 'frontend/src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /loadNotifications\(\);\n  \}, \[pathname\]\);/,
  "if (user) loadNotifications();\n  }, [pathname, user]);"
);

fs.writeFileSync(path, code);
console.log('Fixed Header notifications fetch!');
