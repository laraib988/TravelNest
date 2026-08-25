const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');

const newDrawer = `
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
              <nav style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                
                <Link href="/tours" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Compass size={20} color="#f97316" /> Tours & Tickets
                </Link>
                
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button onClick={() => setIsDestinationsOpen(!isDestinationsOpen)} style={{ background: 'none', border: 'none', fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 0, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MapPin size={20} color="#7c3aed" /> Destinations</div>
                    <ChevronDown size={18} color="#64748b" style={{ transform: isDestinationsOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {isDestinationsOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '16px 0 0 32px' }}>
                       {Array.from(new Set(featuredCities.map(c => c.country))).map(country => (
                          <Link key={country} href="/destinations" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1rem', color: '#475569', textDecoration: 'none' }}>
                             {country}
                          </Link>
                       ))}
                       <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1rem', color: '#0284c7', fontWeight: 600, textDecoration: 'none', marginTop: '8px' }}>
                         Explore All Destinations &rarr;
                       </Link>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button onClick={() => setIsExploreOpen(!isExploreOpen)} style={{ background: 'none', border: 'none', fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: 0, cursor: 'pointer' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Compass size={20} color="#0284c7" /> Explore Vaitour</div>
                    <ChevronDown size={18} color="#64748b" style={{ transform: isExploreOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }} />
                  </button>
                  {isExploreOpen && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px 0 0 32px' }}>
                      <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#475569', textDecoration: 'none' }}>
                        <MessageSquare size={16} color="#0284c7" /> Community Forum
                      </Link>
                      <Link href="/loyalty" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#475569', textDecoration: 'none' }}>
                        <Award size={16} color="#059669" /> Loyalty & Rewards
                      </Link>
                      <Link href="/ai-planner" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#475569', textDecoration: 'none' }}>
                        <Sparkles size={16} color="#7c3aed" /> AI Itinerary Studio
                      </Link>
                      <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1rem', color: '#475569', textDecoration: 'none' }}>
                        <FileText size={16} color="#dc2626" /> Travel Journal & Guides
                      </Link>
                    </div>
                  )}
                </div>

                <Link href="/supplier" onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <ShieldCheck size={20} color="#10b981" /> Supplier Portal
                </Link>

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
}`;

c = c.replace(/      \{\/\* MOBILE DRAWER \*\/}[\s\S]*<\/>[\s\S]*\);[\s\S]*}/, newDrawer );

fs.writeFileSync('src/components/Header.tsx', c);
