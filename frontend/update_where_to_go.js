const fs = require('fs');

let hFile = fs.readFileSync('src/components/Header.tsx', 'utf8');

const targetToReplace = `                      {/* Pills Row (Visual flair) */}
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
                      </div>`;

const newContent = `                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {Array.from(new Set(featuredCities.map(c => c.country))).map((country, idx) => {
                          const countryCities = featuredCities.filter(c => c.country === country);
                          return (
                            <div key={String(country)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                              {/* Country Header */}
                              <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0' }}>{String(country)}</h4>
                              
                              {/* Cities inside Country */}
                              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                                 {countryCities.map(city => (
                                   <Link key={city.id} href={\`/destinations/\${city.slug}\`} onClick={() => setIsMobileMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', fontWeight: 600, color: '#1e293b', textDecoration: 'none', padding: '8px 0', borderBottom: '1px solid #f1f5f9' }}>
                                     <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: '#e2e8f0' }}>
                                       {(city.hero_image || city.image_url) && (
                                         <Image src={city.hero_image || city.image_url} alt={city.name} width={36} height={36} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                       )}
                                     </div>
                                     {city.name}
                                   </Link>
                                 ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>`;

if (hFile.includes('Pills Row (Visual flair)')) {
  hFile = hFile.replace(targetToReplace, newContent);
  fs.writeFileSync('src/components/Header.tsx', hFile);
  console.log("Replaced successfully!");
} else {
  console.log("Could not find the target text to replace.");
}
