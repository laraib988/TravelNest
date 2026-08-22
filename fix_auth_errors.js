const fs = require('fs');

function addErrorHandling(filePath, submitFuncCall, isSignup) {
  let code = fs.readFileSync(filePath, 'utf8');

  // Add authError state
  if (!code.includes('authError')) {
    code = code.replace(
      /const \[loading, setLoading\] = useState\(false\);/,
      "const [loading, setLoading] = useState(false);\n  const [authError, setAuthError] = useState('');"
    );
  }

  // Rewrite handleSubmit
  const regex = /const handleSubmit = async \(e: React\.FormEvent\) => \{\s*e\.preventDefault\(\);\s*setLoading\(true\);\s*await [^;]+;\s*setLoading\(false\);\s*router\.push\(redirectUrl\);\s*\};/;
  
  const newHandleSubmit = `const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAuthError('');
    try {
      ${submitFuncCall}
      router.push(redirectUrl);
    } catch (err: any) {
      console.error(err);
      setAuthError(err.message || '${isSignup ? 'Sign up failed' : 'Invalid login credentials. Please try again.'}');
    } finally {
      setLoading(false);
    }
  };`;

  code = code.replace(regex, newHandleSubmit);

  // Inject error UI above the submit button
  if (!code.includes('{authError &&')) {
    code = code.replace(
      /<button[^>]*type="submit"[^>]*>/,
      `{authError && (
            <div style={{ padding: '12px', borderRadius: '12px', background: '#fef2f2', border: '1px solid #fecaca', color: '#ef4444', fontSize: '0.85rem', fontWeight: 600, marginBottom: '12px' }}>
              {authError}
            </div>
          )}
          $&`
    );
  }

  fs.writeFileSync(filePath, code);
}

addErrorHandling('frontend/src/app/login/page.tsx', 'await login(email, password);', false);
addErrorHandling('frontend/src/app/signup/page.tsx', 'await signup(name, email, password);', true);

console.log('Added robust error handling to Auth pages!');
