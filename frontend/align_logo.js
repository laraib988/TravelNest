const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');

c = c.replace(
  /<button onClick=\{\(\) => setIsMobileMenuOpen\(true\)\} style=\{\{ background: "none", border: "none", padding: "4px" \}\}>\s*<Menu size=\{28\} color="#0f172a" \/>\s*<\/button>\s*<Link href="\/" style=\{\{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" \}\}>\s*<Image src="\/logo\.png" alt="Vaitour Logo" style=\{\{ width: "28px", height: "28px", objectFit: "contain" \}\} width=\{28\} height=\{28\} \/>\s*<span style=\{\{ fontSize: "1\.25rem", fontWeight: 800, lineHeight: 1 \}\} className="gradient-text">Vaitour<\/span>\s*<\/Link>/,
  `<div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <button onClick={() => setIsMobileMenuOpen(true)} style={{ background: "none", border: "none", padding: "4px", display: "flex" }}>
                    <Menu size={28} color="#0f172a" />
                  </button>
                  <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
                    <Image src="/logo.png" alt="Vaitour Logo" style={{ width: "28px", height: "28px", objectFit: "contain" }} width={28} height={28} />
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, lineHeight: 1 }} className="gradient-text">Vaitour</span>
                  </Link>
                </div>`
);

fs.writeFileSync('src/components/Header.tsx', c);
