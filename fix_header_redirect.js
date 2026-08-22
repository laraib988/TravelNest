const fs = require('fs');
const path = 'frontend/src/components/Header.tsx';
let code = fs.readFileSync(path, 'utf8');

code = code.replace(
  /<Link href="\/login"/,
  `<Link href={\`/login?redirect=\${encodeURIComponent(pathname)}\`}`
);

code = code.replace(
  /<Link href="\/signup"/,
  `<Link href={\`/signup?redirect=\${encodeURIComponent(pathname)}\`}`
);

fs.writeFileSync(path, code);
console.log('Fixed Header login links to include redirect query param!');
