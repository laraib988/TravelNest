import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function CategoryDynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: pageData } = await supabase
    .from('dynamic_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  const FALLBACK_PAGES: Record<string, any> = {
    'tours-experiences': {
      title: 'Tours & Experiences',
      hero_section: {
        heading: 'Discover Unforgettable Tours & Experiences',
        subheading: 'Book the best local guides, sightseeing tours, and unique activities.',
        show_search_bar: true,
        background_image: 'https://images.unsplash.com/photo-1522083165195-3444ecd5244e?q=80&w=2000'
      },
      destinations_section: { show: true, title: 'Top Destinations for Experiences' },
      tours_section: { show: true, title: 'Popular Tours & Experiences', subtitle: 'Handpicked activities for you' }
    },
    'attraction-tickets': {
      title: 'Attraction Tickets',
      hero_section: {
        heading: 'Skip the Line: Attraction Tickets',
        subheading: 'Book tickets to museums, theme parks, and historic landmarks instantly.',
        show_search_bar: true,
        background_image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=2000'
      },
      destinations_section: { show: true, title: 'Top Cities for Attractions' },
      tours_section: { show: true, title: 'Best Selling Tickets', subtitle: 'Book your entry today' }
    },
    'transport': {
      title: 'Transport',
      hero_section: {
        heading: 'Trains, Buses & Transfers',
        subheading: 'Reliable transport options to get you where you need to go.',
        show_search_bar: true,
        background_image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2000'
      },
      destinations_section: { show: false },
      tours_section: { show: true, title: 'Transport Options', subtitle: 'Private transfers and public transit passes' }
    },
    'car-rentals': {
      title: 'Car Rentals',
      hero_section: {
        heading: 'Car Rentals & Private Drivers',
        subheading: 'Explore at your own pace with a rental car or hired private driver.',
        show_search_bar: true,
        background_image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000'
      },
      destinations_section: { show: false },
      tours_section: { show: true, title: 'Featured Vehicles', subtitle: 'Rentals and Private Charters' }
    }
  };

  const finalPageData = pageData || FALLBACK_PAGES[slug];

  if (!finalPageData) {
    notFound();
  }

  // Fetch some top destinations for the strip
  const { data: dests } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_published', true)
    .limit(6);

  // Fetch some top tours for the grid/slider
  const { data: tours } = await supabase
    .from('products')
    .select('*')
    .eq('status', 'PUBLISHED')
    .limit(16); // 4 rows

  const hero = finalPageData.hero_section || {};
  const destSec = finalPageData.destinations_section || {};
  const tourSec = finalPageData.tours_section || {};
  const extras = finalPageData.extra_sections || [];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        width: '100%', 
        height: '60vh', 
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${hero.background_image || '/images/hero-bg.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#fff', padding: '0 20px', maxWidth: '800px', width: '100%' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {hero.heading || finalPageData.title}
          </h1>
          {hero.subheading && (
            <p style={{ fontSize: '1.2rem', marginBottom: '32px', opacity: 0.9 }}>{hero.subheading}</p>
          )}
          {hero.show_search_bar && (
            <div style={{ background: '#fff', padding: '8px', borderRadius: '100px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              {/* Fallback to simple input if SearchBar isn't compatible */}
              <input type="text" placeholder="Where are you going?" style={{ width: '100%', padding: '16px 24px', border: 'none', borderRadius: '100px', outline: 'none', fontSize: '1rem', color: '#0f172a' }} />
            </div>
          )}
        </div>
      </section>

      {/* 2. DESTINATIONS STRIP */}
      {destSec.show && (
        <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>{destSec.title}</h2>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollSnapType: 'x mandatory' }}>
            {dests?.map(d => (
              <Link href={`/en/destinations/${d.slug}`} key={d.id} style={{ minWidth: '200px', flex: '0 0 200px', scrollSnapAlign: 'start', position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '250px', textDecoration: 'none' }}>
                <Image src={d.hero_image || ''} alt={d.name} fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                <h3 style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>{d.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. TOURS & EXPERIENCES GRID (4 ROWS) */}
      {tourSec.show && (
        <section style={{ padding: '60px 20px', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{tourSec.title}</h2>
            {tourSec.subtitle && <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '32px' }}>{tourSec.subtitle}</p>}
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '24px' 
            }}>
              {(tourSec.items && tourSec.items.length > 0 ? tourSec.items : tours)?.map((tour: any) => (
                <Link href={tour.slug ? `/en/tours/${tour.slug}` : '#'} key={tour.id} style={{ textDecoration: 'none', cursor: tour.slug ? 'pointer' : 'default' }}>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ height: '200px', position: 'relative' }}>
                      <Image src={tour.image || tour.hero_image || '/images/placeholder.jpg'} alt={tour.title} fill style={{ objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {tour.category || 'Attraction'}
                      </div>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>{tour.title}</h3>
                      {tour.pickup_location && <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>📍 {tour.pickup_location}</p>}
                      {tour.description && <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', flexGrow: 1 }}>{tour.description}</p>}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                        {tour.base_price ? (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>From <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{tour.currency || 'USD'} {tour.base_price}</strong></span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}><strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>View Only</strong></span>
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0284c7' }}>View Details &rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. EXTRA SECTIONS (PROFESSIONAL DESIGN) */}
      {extras.map((sec: any, idx: number) => (
        <section key={idx} style={{ 
          padding: '80px 20px', 
          background: idx % 2 === 0 ? '#f8fafc' : '#ffffff' 
        }}>
          <div style={{ 
            maxWidth: '1000px', 
            margin: '0 auto',
            textAlign: idx % 2 === 0 ? 'center' : 'left'
          }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '24px', letterSpacing: '-0.02em' }}>
              {sec.title}
            </h2>
            <div 
              style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569' }} 
              dangerouslySetInnerHTML={{ __html: sec.content }} 
            />
          </div>
        </section>
      ))}

    </div>
  );
}
