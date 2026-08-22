const fs = require('fs');

function fixAuthPage(filePath) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Add useEffect to the imports if not present
  if (!code.includes('useEffect')) {
    code = code.replace(/import \{ useState \} from 'react';/, "import { useState, useEffect } from 'react';");
  }

  // Inject redirect logic
  if (!code.includes('redirectUrl')) {
    const injectHooks = `const [loading, setLoading] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState('/');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const redir = params.get('redirect');
    if (redir) setRedirectUrl(redir);
  }, []);`;
    
    code = code.replace(/const \[loading, setLoading\] = useState\(false\);/, injectHooks);
  }

  // Update router.push('/') to router.push(redirectUrl)
  // Need to be careful because there might be multiple router.push
  // But usually it's just after login/signup
  code = code.replace(/router\.push\('\/'\);/g, "router.push(redirectUrl);");

  fs.writeFileSync(filePath, code);
  console.log('Fixed auth redirect logic for ' + filePath);
}

fixAuthPage('frontend/src/app/login/page.tsx');
fixAuthPage('frontend/src/app/signup/page.tsx');
