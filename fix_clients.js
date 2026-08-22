const fs = require('fs');

function makeRobustAuthCheck(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Replace the simple check with a robust check
  const robustCheck = `
  const cleanPath = pathname?.replace(/^\\/[a-z]{2}(?=\\/|$)/, '').replace(/\\/$/, '') || '';
  const isAuthPage = cleanPath === '/login' || cleanPath === '/signup' || cleanPath === '/supplier/login' || cleanPath === '/admin/login' || cleanPath === '/supplier/signup';
  `;

  code = code.replace(
    /const isAuthPage = [^;]+;/,
    robustCheck
  );

  fs.writeFileSync(filePath, code);
}

makeRobustAuthCheck('frontend/src/components/HeaderClient.tsx');
makeRobustAuthCheck('frontend/src/components/FooterClient.tsx');

console.log('Fixed Header/Footer robust check!');
