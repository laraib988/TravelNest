const fs = require('fs');

function hideOnPath(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');
  code = code.replace(
    /const isAuthPage = pathname === '\/login' \|\| pathname === '\/signup';/,
    "const isAuthPage = pathname === '/login' || pathname === '/signup' || pathname === '/supplier/login' || pathname === '/admin/login';"
  );
  fs.writeFileSync(filePath, code);
}

hideOnPath('frontend/src/components/HeaderClient.tsx');
hideOnPath('frontend/src/components/FooterClient.tsx');
console.log('Fixed header/footer hiding!');
