const fs = require('fs');
let content = fs.readFileSync('src/components/Header.tsx', 'utf8');

// 2. Add state
content = content.replace("const [featuredCities, setFeaturedCities] = useState<any[]>([]);", "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n  const [featuredCities, setFeaturedCities] = useState<any[]>([]);");

// 3. Desktop wrap HEADER 1
content = content.replace(
  "{/* TOP ANNOUNCEMENT BAR */}",
  "<div className=\"desktop-only\" style={{ flexDirection: \"column\", width: \"100%\" }}>\n        {/* TOP ANNOUNCEMENT BAR */}"
);

// 4. Mobile header bar after HEADER 1
const mobileHeader = `        </div>
        </div>

        {/* MOBILE HEADER */}
        <div className="mobile-only" style={{ width: "100%", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: "none", border: "none", padding: "4px" }}>
            <Menu size={28} color="#0f172a" />
          </button>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <Image src="/logo.png" alt="Vaitour Logo" style={{ width: "28px", height: "28px", objectFit: "contain" }} width={28} height={28} />
            <span style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1 }} className="gradient-text">Vaitour</span>
          </Link>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <Link href="/tours" style={{ color: "#0f172a" }}><Search size={24} /></Link>
            <Link href={user ? "/profile" : \`/login?redirect=\${encodeURIComponent(pathname)}\`} style={{ color: "#0f172a" }}>
              <User size={24} />
            </Link>
          </div>
        </div>
      </header>`;

content = content.replace(/        <\/div>\r?\n      <\/header>/, mobileHeader);

// 5. Desktop wrap HEADER 2
content = content.replace(
  "{(!cleanPath.startsWith('/supplier') || isSupplierLanding) && (\n        <div \n          ref={subHeaderRef}\n        style={{ \n          background: '#ffffff',",
  "{(!cleanPath.startsWith('/supplier') || isSupplierLanding) && (\n        <div \n          ref={subHeaderRef}\n          className=\"desktop-only\"\n        style={{ \n          background: '#ffffff',"
);

// 6. Mobile Drawer at the end
const mobileDrawer = `
      {/* MOBILE DRAWER */}
      {isMobileMenuOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex' }} className="mobile-only">
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)' }} onClick={() => setIsMobileMenuOpen(false)} />
          <div style={{ position: 'relative', width: '85%', maxWidth: '340px', height: '100%', background: '#fff', display: 'flex', flexDirection: 'column', boxShadow: '2px 0 10px rgba(0,0,0,0.1)' }}>
            <div style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '1.3rem', fontWeight: 800 }} className="gradient-text">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} style={{ background: 'none', border: 'none', padding: '4px' }}><X size={28} color="#64748b" /></button>
            </div>
            <div style={{ padding: '24px 20px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <Link href="/tours" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}><Compass size={20} color="#0284c7" /> Tours & Tickets</Link>
                <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}><MapPin size={20} color="#7c3aed" /> Destinations</Link>
                <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}><MessageSquare size={20} color="#059669" /> Global Community</Link>
                <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}><FileText size={20} color="#d97706" /> Travel Journal</Link>
                <Link href="/supplier" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}><ShieldCheck size={20} color="#0f172a" /> Supplier Portal</Link>
              </nav>
              <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                 <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Preferences</span>
                 <CurrencyLanguageDropdown />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
`;

content = content.replace(/      \{\/\* Removed AuthModal \*\/}[\s\S]*<\/>[\s\S]*\);[\s\S]*}/, mobileDrawer);

fs.writeFileSync('src/components/Header.tsx', content);
