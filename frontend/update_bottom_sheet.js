const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');

if (!c.includes('const [mobileTab, setMobileTab]')) {
  c = c.replace(
    "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);",
    "const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);\n  const [mobileTab, setMobileTab] = useState<'where' | 'explore'>('where');"
  );
}

const newBottomSheet = `        {/* MOBILE DRAWER / BOTTOM SHEET */}
        {isMobileMenuOpen && (
          <div style={{ position: 'fixed', inset: 0, zIndex: 99999, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }} className="mobile-only">
            {/* Backdrop */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', transition: 'opacity 0.3s' }} onClick={() => setIsMobileMenuOpen(false)} />
            
            {/* Sheet Content */}
            <div style={{ 
              position: 'relative', 
              width: '100%', 
              height: '85vh', 
              background: '#fff', 
              borderTopLeftRadius: '24px', 
              borderTopRightRadius: '24px', 
              display: 'flex', 
              flexDirection: 'column', 
              boxShadow: '0 -4px 20px rgba(0,0,0,0.1)',
            }}>
              
              {/* Drag Handle & Header */}
              <div style={{ padding: '16px 20px 0', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ width: '40px', height: '4px', background: '#e2e8f0', borderRadius: '2px', marginBottom: '16px' }} />
                <div style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0, color: '#0f172a' }}>Explore the world</h3>
                  <button onClick={() => setIsMobileMenuOpen(false)} style={{ position: 'absolute', right: 0, background: 'none', border: 'none', padding: '4px' }}>
                    <X size={24} color="#64748b" />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', borderBottom: '1px solid #e2e8f0', width: '100%' }}>
                <button 
                  onClick={() => setMobileTab('where')}
                  style={{ 
                    flex: 1, 
                    padding: '12px 0', 
                    background: 'none', 
                    border: 'none', 
                    borderBottom: mobileTab === 'where' ? '2px solid #f97316' : '2px solid transparent',
                    color: mobileTab === 'where' ? '#f97316' : '#64748b',
                    fontWeight: mobileTab === 'where' ? 700 : 500,
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                  Where to go
                </button>
                <button 
                  onClick={() => setMobileTab('explore')}
                  style={{ 
                    flex: 1, 
                    padding: '12px 0', 
                    background: 'none', 
                    border: 'none', 
                    borderBottom: mobileTab === 'explore' ? '2px solid #f97316' : '2px solid transparent',
                    color: mobileTab === 'explore' ? '#f97316' : '#64748b',
                    fontWeight: mobileTab === 'explore' ? 700 : 500,
                    fontSize: '1rem',
                    cursor: 'pointer'
                  }}>
                  Explore Vaitour
                </button>
              </div>

              {/* Tab Content */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', paddingBottom: '40px' }}>
                {mobileTab === 'where' ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    
                    {/* Pills Row (Visual flair) */}
                    <div style={{ display: 'flex', gap: '10px', overflowX: 'auto', paddingBottom: '8px', scrollbarWidth: 'none' }}>
                      <button style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #f97316', color: '#f97316', background: '#fffcf9', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Popular regions</button>
                      <button style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', color: '#475569', background: '#f8fafc', fontSize: '0.85rem', fontWeight: 600, whiteSpace: 'nowrap' }}>Popular destinations</button>
                    </div>

                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '8px 0 0', color: '#0f172a' }}>Popular regions</h4>
                    
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {Array.from(new Set(featuredCities.map(c => c.country))).map((country, idx) => {
                        const countryCities = featuredCities.filter(c => c.country === country);
                        return (
                          <div key={String(country)} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {/* Country Header */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#e2e8f0', overflow: 'hidden' }}>
                                <Image src={countryCities[0]?.image_url || '/placeholder-city.jpg'} alt={String(country)} width={48} height={48} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Things to do in</span>
                                <span style={{ fontSize: '1.05rem', fontWeight: 600, color: '#0f172a' }}>{String(country)}</span>
                              </div>
                            </div>
                            
                            {/* Cities inside Country */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', paddingLeft: '60px' }}>
                               {countryCities.map(city => (
                                 <Link key={city.id} href={\`/destinations/\${city.slug}\`} onClick={() => setIsMobileMenuOpen(false)} style={{ fontSize: '0.95rem', color: '#475569', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                   {city.name}
                                 </Link>
                               ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    <Link href="/destinations" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'block', textAlign: 'center', padding: '12px', background: '#f1f5f9', borderRadius: '8px', color: '#0f172a', fontWeight: 600, textDecoration: 'none', marginTop: '10px' }}>
                       Explore All Destinations &rarr;
                    </Link>

                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: '0 0 16px', color: '#0f172a' }}>Things to do</h4>
                    
                    <Link href="/tours" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Compass size={20} color="#f97316" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Tours & experiences</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/community" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <MessageSquare size={20} color="#0284c7" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Community Forum</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/loyalty" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Award size={20} color="#059669" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Loyalty & Rewards</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/ai-planner" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Sparkles size={20} color="#7c3aed" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>AI Itinerary Studio</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/blog" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FileText size={20} color="#dc2626" />
                        <span style={{ fontSize: '1rem', fontWeight: 500 }}>Travel Journal & Guides</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>
                    
                    <Link href="/supplier" onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 0', borderBottom: '1px solid #f1f5f9', textDecoration: 'none', color: '#0f172a', marginTop: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <ShieldCheck size={20} color="#10b981" />
                        <span style={{ fontSize: '1rem', fontWeight: 700, color: '#10b981' }}>Supplier Portal</span>
                      </div>
                      <ChevronRight size={18} color="#94a3b8" />
                    </Link>

                    {/* Footer Settings */}
                    <div style={{ marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                       <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Preferences</span>
                       <CurrencyLanguageDropdown />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </>
    );
  }
}
`;

const startIdx = c.indexOf('{/* MOBILE DRAWER */}');
if (startIdx !== -1) {
  // End of file is `      </>\n    );\n  }\n}\n`
  const lastReturn = c.indexOf('</>', startIdx);
  if (lastReturn !== -1) {
    c = c.slice(0, startIdx) + newBottomSheet;
    fs.writeFileSync('src/components/Header.tsx', c);
    console.log("SUCCESS");
  } else {
    console.log("FAILED to find </>");
  }
} else {
  console.log("FAILED to find MOBILE DRAWER");
}
