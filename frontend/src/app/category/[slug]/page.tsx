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
      tours_section: { show: true, title: 'Popular Tours & Experiences', subtitle: 'Handpicked activities for you' },
      extra_sections: [
        {
          title: 'Why Book Your Tours & Experiences with Vaitour?',
          content: '<p>When you book with Vaitour, you are connecting directly with verified local guides and top-rated tour operators. Whether you are looking for an authentic food walking tour in Tokyo, a breathtaking sunset cruise in Bali, or a cultural heritage walk in Kyoto, our platform ensures <strong>instant confirmation, secure payments, and free cancellation</strong> on most activities. Skip the tourist traps and discover the world through the eyes of a local.</p>'
        },
        {
          title: 'How to Choose the Perfect Experience',
          content: '<p>Planning your itinerary? We recommend mixing iconic landmark visits with off-the-beaten-path local experiences. Look for tours with small group sizes for a more personalized touch. Check the <em>"Inclusions"</em> on our product pages to see if hotel pickup, meals, or entrance fees are covered. With Vaitour\'s curated categories, finding the perfect half-day trip, full-day excursion, or multi-day adventure has never been easier.</p>'
        }
      ]
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
      tours_section: { show: true, title: 'Best Selling Tickets', subtitle: 'Book your entry today' },
      extra_sections: [
        {
          title: 'Japan Travel Attractions & Places Guide',
          content: '<p>Welcome to our comprehensive guide to Japan\'s most spectacular theme parks, digital art museums, and iconic observatories. Whether you are looking to skip the lines at world-renowned theme parks or explore cutting-edge immersive art, we have you covered.</p>'
        },
        {
          title: '1. Universal Studios Japan (USJ)',
          content: '<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Japan ke sab se mashhoor aur bade theme parks mein se ek, jahan realistic gaming aur animation worlds ko live experience kiya ja sakta hai.</p><ul><li><strong>Major Zones & Rides:</strong> Super Nintendo World (Mario Kart: Koopa\'s Challenge, Yoshi\'s Adventure), The Wizarding World of Harry Potter (Harry Potter and the Forbidden Journey, Flight of the Hippogriff), Despicable Me Minion Mayhem, The Flying Dinosaur.</li><li><strong>Special Events:</strong> Seasonal Halloween Horror Nights, immersive horror mazes, aur special shows.</li></ul>'
        },
        {
          title: '2. Tokyo Disney Resort (Tokyo Disneyland & Tokyo DisneySea)',
          content: '<p><strong>Location:</strong> Tokyo / Chiba, Japan</p><p><strong>Overview & Highlights:</strong> World-class theme park resort jisme do bade alag-alag parks shaamil hain:</p><ul><li><strong>Tokyo Disneyland (7 Themed Lands):</strong> World Bazaar, Adventureland, Westernland, Critter Country, Fantasyland, Toontown, Tomorrowland.<br/><strong>Key Rides:</strong> "it\'s a small world", Enchanted Tale of Beauty and the Beast, Big Thunder Mountain, Splash Mountain.</li><li><strong>Tokyo DisneySea (8 Themed Ports):</strong> Mediterranean Harbor, American Waterfront, Port Discovery, Lost River Delta, Fantasy Springs, Arabian Coast, Mermaid Lagoon, Mysterious Island.<br/><strong>Key Rides:</strong> Journey to the Center of the Earth, Tower of Terror, Soaring: Fantastic Flight, Toy Story Mania, Anna and Elsa\'s Frozen Journey, Rapunzel\'s Lantern Festival.</li></ul>'
        },
        {
          title: '3. SHIBUYA SKY',
          content: '<p><strong>Location:</strong> Shibuya, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Shibuya Scramble Square building ke top par waqia 229 meters (754 feet) oonchi 360-degree observation deck. Yahan se Tokyo skyline, Shinjuku, Tokyo Tower, Tokyo Skytree, Tokyo Bay aur saaf mausam mein Mount Fuji ka panoramic view milta hai.</p><ul><li><strong>Sky Gate:</strong> Entrance aur interactive ceiling animations wali elevator ride.</li><li><strong>Sky Gallery:</strong> 46th floor par indoor art installations (Time River, Data Scape).</li><li><strong>Sky Stage:</strong> Rooftop outdoor area jisme mashhoor photo-spot "Sky Edge", Cloud Hammocks, Geo Compass aur raat ka "Crossing Light" show shaamil hain.</li></ul>'
        },
        {
          title: '4. teamLab Planets TOKYO',
          content: '<p><strong>Location:</strong> Toyosu, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Immersive digital art museum jahan visitors pani aur roshni ke dynamic art installations ke andar nange paon chal kar art ka hissa bante hain.</p><ul><li><strong>Infinite Crystal Universe:</strong> Hazaron LEDs se bana cosmic light room.</li><li><strong>Drawing on the Water Surface:</strong> Digital water pool jahan interactive koi machhliyan tairti hain aur insani movement par cherry blossoms ban kar bikhar jati hain.</li><li><strong>Floating in the Falling Universe of Flowers:</strong> Floating flowers aur seasonal cherry blossom projections.</li><li><strong>Moss Garden:</strong> Resonating Microcosms & Soft Black Hole.</li></ul>'
        },
        {
          title: '5. teamLab Borderless (MORI Building DIGITAL ART MUSEUM)',
          content: '<p><strong>Location:</strong> Azabudai Hills, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Be-hadd mashhoor continuous digital art museum jahan art pieces kamron ki hudood se nikal kar ek doosre ke sath integrate hote hain.</p><ul><li><strong>Bubble Universe:</strong> Chamakdaar bubbles aur light reflections ka multidimensional space.</li><li><strong>Flowers and Waterfall:</strong> Continuous transform hone wala floral waterfall zone.</li><li><strong>EN TEA HOUSE:</strong> Unique experience jahan aapki tea cup ke andar digital flowers bloom karte hain.</li></ul>'
        },
        {
          title: '6. teamLab Biovortex Kyoto',
          content: '<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Kyoto ka sab se naya aur sab se bara digital art museum jo Environmental Phenomena aur Japanese traditional art aesthetics par mabni hai.</p><ul><li><strong>Athletics Forest:</strong> Physically engaging aur multi-dimensional creative space jahan body movement se dynamic environments trigger hote hain.</li><li><strong>Future Park:</strong> Collaborative co-creation space jahan drawings aur collaborative art live screens par chalti hain.</li><li><strong>Megaliths & Transient Abstract Life:</strong> Unique structural art pieces.</li></ul>'
        },
        {
          title: '7. Warner Bros. Studio Tour Tokyo – The Making of Harry Potter',
          content: '<p><strong>Location:</strong> Nerima, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Harry Potter aur Fantastic Beasts films ki making par mabni Asia ka pehla studio tour.</p><ul><li>Film ke iconic sets jaise Great Hall, Diagon Alley, Platform 9 ¾, Hogwarts Express, aur Forbidden Forest ka real walk-through.</li><li>Behind-the-scenes costumes, animatronics, special visual effects, aur authentic props ki exhibition.</li></ul>'
        },
        {
          title: '8. TOKYO SKYTREE',
          content: '<p><strong>Location:</strong> Sumida, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> 634 meters ki bulandi ke sath Japan ka sab se ooncha structure.</p><ul><li><strong>Tembo Deck (350m):</strong> 360-degree views, restaurant, souvenir shop, aur transparent glass floor panels.</li><li><strong>Tembo Galleria (450m):</strong> Duniya ka sab se buland spiraling skywalk ramp jahan se pooray Kanto region aur Mount Fuji ka view milta hai.</li><li>Niche Tokyo Solamachi complex mein shopping aur dining centers waqia hain.</li></ul>'
        },
        {
          title: '9. Tokyo Tower',
          content: '<p><strong>Location:</strong> Minato, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> 333 meters ooncha iconic lattice tower jo Paris ke Eiffel Tower se mutasir hokar banaya gaya hai.</p><ul><li><strong>Main Observatory (150m):</strong> City skyline aur glass viewing sections.</li><li><strong>Top Deck (250m):</strong> Geometric mirrors aur modern futuristic interior ke sath elevated views.</li></ul>'
        },
        {
          title: '10. Ghibli Park',
          content: '<p><strong>Location:</strong> Aichi Prefecture (Nagoya Area), Japan</p><p><strong>Overview & Highlights:</strong> Studio Ghibli ki animated filmon ki duniya par mushtamil park jo Expo 2005 Aichi Commemorative Park ke andar waqia hai.</p><ul><li><strong>Ghibli\'s Grand Warehouse:</strong> Indoor artifacts, production materials, exhibits, cafe aur gift shop.</li><li><strong>Hill of Youth:</strong> Whisper of the Heart aur The Cat Returns par mabni structures.</li><li><strong>Dondoko Forest:</strong> My Neighbor Totoro se Satsuki & Mei ka ghar.</li><li><strong>Mononoke Village:</strong> Princess Mononoke se mutasir Emishi village aur Tatara-ba center.</li><li><strong>Valley of Witches:</strong> Howl\'s Moving Castle aur Kiki\'s Delivery Service par mabni European style townscape.</li></ul>'
        },
        {
          title: '11. LEGOLAND Japan Resort',
          content: '<p><strong>Location:</strong> Nagoya, Japan</p><p><strong>Overview & Highlights:</strong> 17 million se zyada LEGO bricks aur hazaron models se bana family theme park.</p><ul><li><strong>Key Areas & Attractions:</strong> Factory, Bricktopia, Adventure, Knight\'s Kingdom, Pirate Shores, Miniland (Tokyo aur Osaka ke LEGO models), aur LEGO NINJAGO World.</li><li>40 se zyada interactive rides, live performances aur kids building workshops.</li></ul>'
        },
        {
          title: '12. Fuji-Q Highland',
          content: '<p><strong>Location:</strong> Yamanashi Prefecture (Mount Fuji Region), Japan</p><p><strong>Overview & Highlights:</strong> Mount Fuji ke daaman mein waqia world-famous amusement park jo extreme coasters ke liye mashhoor hai.</p><ul><li><strong>Fujiyama:</strong> Dunya ke oonche aur lambe roller coasters mein shumar.</li><li><strong>Takabisha:</strong> 121-degree vertical drop coaster.</li><li><strong>Eejanaika:</strong> 4D rotation wala spinning coaster.</li><li><strong>Thomas Land & Shining Flower Ferris Wheel:</strong> Families aur bachon ke liye themed rides.</li></ul>'
        },
        {
          title: '13. Umeda Sky Building & Kuchu Teien Observatory',
          content: '<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Unique do towers ko aapas mein jodne wali iconic bridge architecture.</p><ul><li><strong>Floating Garden Observatory (Kuchu Teien):</strong> Open-air 360-degree rooftop deck jo sunset aur night views ke liye intehai mashhoor hai.</li><li>Building ke andar 27th floor par mashhoor Koji Kinutani Tenku Art Museum waqia hai.</li></ul>'
        },
        {
          title: '14. Okinawa Churaumi Aquarium',
          content: '<p><strong>Location:</strong> Okinawa, Japan</p><p><strong>Overview & Highlights:</strong> Ocean Expo Park mein waqia world-class marine life facility.</p><ul><li><strong>Kuroshio Sea Tank:</strong> Massive glass viewing wall jahan Whale Sharks aur giant Manta Rays tairti hain.</li><li>Deep sea life, coral reefs, aur Okinawa ke natural marine ecosystem ki exhibitions.</li></ul>'
        },
        {
          title: '15. Sanrio Puroland',
          content: '<p><strong>Location:</strong> Tama, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Indoor theme park jo Hello Kitty, My Melody, Cinnamoroll aur deegar Sanrio characters par mabni hai.</p><ul><li><strong>Key Attractions:</strong> Sanrio Character Boat Ride, Lady Kitty House, Mymeroad Drive, aur Grand Musical Theatrical Parades.</li></ul>'
        },
        {
          title: '16. Tokyo Joypolis',
          content: '<p><strong>Location:</strong> Odaiba, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> SEGA ka indoor interactive technology aur gaming theme park.</p><ul><li><strong>Key Attractions:</strong> Halfpipe Tokyo, Gekion Live Coaster, Transformers VR experience, House of the Dead interactive rides, aur classic SEGA arcade games.</li></ul>'
        },
        {
          title: '17. Huis Ten Bosch',
          content: '<p><strong>Location:</strong> Sasebo, Nagasaki Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> 17th-century Netherlands (Holland) ke tarz par banaya gaya realistic European theme park.</p><ul><li><strong>Highlights:</strong> Asal canals, windmills, Art Garden, Grand Rose Gardens, seasonal fireworks, EVANGELION 8K Ride, aur interactive museums.</li></ul>'
        },
        {
          title: '18. Asakusa Sumo Club & Cultural Show',
          content: '<p><strong>Location:</strong> Asakusa, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Traditional Sumo wrestling entertainment aur live performance center.</p><ul><li>Isme Geisha welcome dance, sumo ke rules aur rituals ki bilingual commentary, wrestling demonstration bouts, aur authentic Chankonabe (sumo stew) dining experience shaamil hain.</li></ul>'
        },
        {
          title: '19. Suzuka Circuit Park',
          content: '<p><strong>Location:</strong> Mie Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Famous Formula 1 racing track ke sath waqia motorsports-themed amusement park jahan bachon aur bado ke liye driving aur karting experiences mojood hain.</p>'
        },
        {
          title: '20. Regional Tourism & Sightseeing Passes',
          content: '<p><strong>Osaka City Sights:</strong> Osaka Castle, Tombori River Cruise, Tennoji Zoo, Nagai Botanical Gardens.</p><p><strong>Kansai Region:</strong> Osaka, Kyoto, Kobe, aur Nara ko connect karne wali cultural sightseeing networks.</p><p><strong>Okinawa Region Sights:</strong> Shurijo Castle Park, Kouri Ocean Tower, Nago Pineapple Park, Southeast Botanical Gardens, Katsuren Castle Ruins, Ryukyu Mura.</p>'
        }
      ]
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
      tours_section: { show: true, title: 'Transport Options', subtitle: 'Private transfers and public transit passes' },
      extra_sections: [
        {
          title: 'Seamless Airport Transfers & Rail Passes',
          content: '<p>Navigating a new city can be stressful. Vaitour simplifies your journey by offering pre-booked <strong>airport transfers, bullet train (Shinkansen) tickets, and comprehensive city transport passes</strong>. Whether you need a private van for your family or a budget-friendly bus ticket, we have you covered from arrival to departure.</p>'
        }
      ]
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
      tours_section: { show: true, title: 'Featured Vehicles', subtitle: 'Rentals and Private Charters' },
      extra_sections: [
        {
          title: 'Freedom to Explore at Your Own Pace',
          content: '<p>Rent a car through Vaitour and unlock the ultimate road trip experience. Drive through the scenic countryside of Hokkaido, explore the rugged coastlines of Europe, or simply enjoy the convenience of a private vehicle in bustling metropolises. We offer a wide range of vehicles from compact cars to luxury SUVs.</p>'
        },
        {
          title: 'Private Driver Charters',
          content: '<p>Prefer to sit back and relax? Hire a <strong>private driver and charter service</strong>. Our professional, vetted local drivers will take you exactly where you want to go, offering insider tips along the way. Perfect for family groups, corporate travel, or customized full-day sightseeing itineraries.</p>'
        }
      ]
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

    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'PUBLISHED');

    if (slug === 'attraction-tickets') {
      query = query.eq('basic_info->>category', 'Attraction Tickets');
    } else if (slug === 'tours-experiences') {
      // e.g. you could filter by other categories, or leave as is
      query = query.neq('basic_info->>category', 'Attraction Tickets');
    }

    const { data: tours } = await query.limit(24);

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
              <Link href={`/destinations/${d.slug}`} key={d.id} style={{ minWidth: '200px', flex: '0 0 200px', scrollSnapAlign: 'start', position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '250px', textDecoration: 'none' }}>
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
              {(tourSec.items && tourSec.items.length > 0 ? tourSec.items : tours)?.map((rawTour: any) => {
                // Map the dynamic products table structure
                const tour = {
                  id: rawTour.id,
                  slug: rawTour.id, // Using ID as slug based on current architecture
                  title: rawTour.basic_info?.title || rawTour.title || 'Tour & Experience',
                  image: rawTour.basic_info?.photos?.heroImage || rawTour.hero_image || '/images/placeholder.jpg',
                  category: rawTour.basic_info?.sellingPoints || rawTour.category || 'Experience',
                  pickup_location: rawTour.logistics?.pickupLocation || rawTour.pickup_location,
                  description: rawTour.basic_info?.summary || rawTour.description,
                  base_price: rawTour.transport_pricing?.[0]?.amount || rawTour.base_price,
                  currency: rawTour.currency || 'USD'
                };
                
                return (
                <Link href={tour.slug ? `/tours/${tour.slug}` : '#'} key={tour.id} style={{ textDecoration: 'none', cursor: tour.slug ? 'pointer' : 'default' }}>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ height: '200px', position: 'relative' }}>
                      <Image src={tour.image} alt={tour.title} fill style={{ objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {tour.category || 'Attraction'}
                      </div>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>{tour.title}</h3>
                      {tour.pickup_location && <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>📍 {tour.pickup_location}</p>}
                      {tour.description && <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', flexGrow: 1 }}>{tour.description}</p>}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                        {slug === 'attraction-tickets' ? (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}><strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>Information Only</strong></span>
                        ) : tour.base_price ? (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>From <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{tour.currency || 'USD'} {tour.base_price}</strong></span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}><strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>View Only</strong></span>
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0284c7' }}>View Details &rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. EXTRA SECTIONS (PROFESSIONAL DESIGN) */}
        <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
              {extras.map((sec: any, idx: number) => {
                const isCard = sec.title.match(/^\d+\./) || sec.title.includes('Passes');
                return (
                  <div key={idx} style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gridColumn: isCard ? 'span 1' : '1 / -1',
                    marginBottom: isCard ? '0' : '20px'
                  }}>
                    {isCard && (
                      <div style={{ position: 'relative', width: '100%', height: '250px' }}>
                        <Image 
                          src={sec.image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800'} 
                          alt={sec.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ padding: isCard ? '30px' : '40px' }}>
                      <h2 style={{ fontSize: isCard ? '1.8rem' : '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', letterSpacing: '-0.02em', textAlign: isCard ? 'left' : 'center' }}>
                        {sec.title}
                      </h2>
                      <div 
                        className="prose max-w-none"
                        style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569', textAlign: isCard ? 'left' : 'center' }} 
                        dangerouslySetInnerHTML={{ __html: sec.content }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

    </div>
  );
}
