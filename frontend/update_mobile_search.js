const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');

c = c.replace(
  "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);",
  "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);\n  const [mobileSearchQuery, setMobileSearchQuery] = useState('');"
);

const startIdx = c.indexOf('{/* MOBILE HEADER */}');
const endIdx = c.indexOf('</header>', startIdx);

if (startIdx !== -1 && endIdx !== -1) {
  const newMobileHeader = `{/* MOBILE HEADER */}
        <div className="mobile-only" style={{ width: "100%", padding: "12px 16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {isMobileSearchOpen ? (
            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '10px' }}>
               <button onClick={() => setIsMobileSearchOpen(false)} style={{ background: 'none', border: 'none', padding: '4px' }}><X size={24} color="#0f172a" /></button>
               <form onSubmit={(e) => { e.preventDefault(); window.location.href = \`/tours?search=\${encodeURIComponent(mobileSearchQuery)}\`; }} style={{ flex: 1, display: 'flex', alignItems: 'center', background: '#f1f5f9', borderRadius: '20px', padding: '6px 12px' }}>
                  <input autoFocus type="text" value={mobileSearchQuery} onChange={e => setMobileSearchQuery(e.target.value)} placeholder="Search destinations, tours..." style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '0.95rem', color: '#0f172a' }} />
                  <button type="submit" style={{ background: 'none', border: 'none', padding: 0, display: 'flex', alignItems: 'center' }}><Search size={18} color="#64748b" /></button>
               </form>
            </div>
          ) : (
            <>
              <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: "none", border: "none", padding: "4px" }}>
                <Menu size={28} color="#0f172a" />
              </button>
              <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                <Image src="/logo.png" alt="Vaitour Logo" style={{ width: "28px", height: "28px", objectFit: "contain" }} width={28} height={28} />
                <span style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1 }} className="gradient-text">Vaitour</span>
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button onClick={() => setIsMobileSearchOpen(true)} style={{ background: "none", border: "none", color: "#0f172a", padding: "4px", cursor: "pointer" }}><Search size={24} /></button>
                <Link href={user ? "/profile" : \`/login?redirect=\${encodeURIComponent(pathname)}\`} style={{ color: "#0f172a", display: 'flex', alignItems: 'center' }}>
                  <User size={24} />
                </Link>
              </div>
            </>
          )}
        </div>
      `;
  c = c.slice(0, startIdx) + newMobileHeader + c.slice(endIdx);
  fs.writeFileSync('src/components/Header.tsx', c);
} else {
  console.log("NOT FOUND");
}
