const fs = require('fs');

const files = [
  'frontend/src/app/login/page.tsx',
  'frontend/src/app/signup/page.tsx',
  'frontend/src/app/supplier/login/page.tsx',
  'frontend/src/app/supplier/signup/page.tsx',
  'frontend/src/app/admin/login/page.tsx',
];

for (const filePath of files) {
  let c = fs.readFileSync(filePath, 'utf8');
  const original = c;

  // 1. Add Eye, EyeOff import if not there
  if (!c.includes("Eye,") && !c.includes("Eye }") && !c.includes("Eye\n")) {
    // Add after the last lucide import line
    c = c.replace(
      /} from 'lucide-react';/,
      `  Eye,\n  EyeOff,\n} from 'lucide-react';`
    );
  }

  // 2. Add showPassword state after the first useState declaration block
  // Insert after the first useState that has 'password'
  if (!c.includes('showPassword')) {
    c = c.replace(
      /const \[password, setPassword\] = useState\(''\);/g,
      `const [password, setPassword] = useState('');\n  const [showPassword, setShowPassword] = useState(false);`
    );
    // Also handle confirmPassword if present
    if (c.includes('confirmPassword')) {
      c = c.replace(
        /const \[confirmPassword, setConfirmPassword\] = useState\(''\);/g,
        `const [confirmPassword, setConfirmPassword] = useState('');\n  const [showConfirmPassword, setShowConfirmPassword] = useState(false);`
      );
    }
  }

  // 3. Replace all password input containers with eye toggle version
  // Match: <div style={{ position: 'relative' }}> ... type="password" ... </div>
  // We replace the inner Lock icon + input + closing div pattern
  
  // Pattern for password fields with Lock icon
  c = c.replace(
    /<Lock size=\{18\} color="#94a3b8" style=\{\{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY\(-50%\)' \}\} \/>\s*<input\s+type="password"\s+required\s+placeholder="Password"\s+value=\{password\}\s+onChange=\{\(e\) => setPassword\(e\.target\.value\)\}\s+style=\{\{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var\(--radius-md\)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0\.95rem' \}\}\s+\/>/gs,
    `<Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '0' }}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>`
  );

  // For signup page - also handle confirm password
  if (c.includes('confirmPassword') && c.includes('showConfirmPassword')) {
    c = c.replace(
      /<Lock size=\{18\} color="#94a3b8" style=\{\{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY\(-50%\)' \}\} \/>\s*<input\s+type="password"\s+required\s+placeholder="Confirm Password"\s+value=\{confirmPassword\}\s+onChange=\{\(e\) => setConfirmPassword\(e\.target\.value\)\}\s+style=\{\{ width: '100%', padding: '12px 14px 12px 42px', borderRadius: 'var\(--radius-md\)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0\.95rem' \}\}\s+\/>/gs,
      `<Lock size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ width: '100%', padding: '12px 42px 12px 42px', borderRadius: 'var(--radius-md)', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.95rem' }}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', display: 'flex', alignItems: 'center', padding: '0' }}
                tabIndex={-1}
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>`
    );
  }

  if (c !== original) {
    fs.writeFileSync(filePath, c);
    console.log('Updated:', filePath);
  } else {
    console.log('No change (may need manual check):', filePath);
  }
}
