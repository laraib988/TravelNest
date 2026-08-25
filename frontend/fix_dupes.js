const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');

c = c.replace(/const \[isMobileSearchOpen, setIsMobileSearchOpen\] = useState\(false\);\s*/g, '');
c = c.replace(/const \[mobileSearchQuery, setMobileSearchQuery\] = useState\(''\);\s*/g, '');

// Now insert them correctly right after isMobileMenuOpen
c = c.replace(
  "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);",
  "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);\n  const [mobileSearchQuery, setMobileSearchQuery] = useState('');"
);

fs.writeFileSync('src/components/Header.tsx', c);
