const fs = require('fs');
const path = 'frontend/src/components/SupplierHeader.tsx';
let code = fs.readFileSync(path, 'utf8');

if (!code.includes('usePathname')) {
  code = code.replace(
    /import Link from 'next\/link';/,
    "import Link from 'next/link';\nimport { usePathname } from 'next/navigation';"
  );
}

if (!code.includes('if (isAuthPage) return null;')) {
  code = code.replace(
    /export default function SupplierHeader\(\) \{/,
    `export default function SupplierHeader() {
  const pathname = usePathname();
  const isAuthPage = pathname === '/supplier/login' || pathname === '/supplier/signup';
  if (isAuthPage) return null;`
  );
}

fs.writeFileSync(path, code);
console.log('Fixed SupplierHeader!');
