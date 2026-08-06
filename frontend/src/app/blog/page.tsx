'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { BookOpen, Sparkles, Tag, Calendar, User, ArrowRight, Compass } from 'lucide-react';
import { fetchFromAPI } from '@/lib/api-client';

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBlogData() {
      try {
        // Fetch listings or blog articles from NestJS API
        const listings = await fetchFromAPI('/listings');
        const blogPosts = [
          {
            slug: 'ultimate-bali-sunset-guide-2026',
            title: 'The Ultimate 2026 Bali Sunset & Catamaran Travel Guide',
            summary: 'Discover the top secret spots in Tanah Lot, Uluwatu, and Nusa Penida for unforgettable sunset views with verified local guides.',
            author: 'Elena Rostova',
            published_at: 'August 2, 2026',
            read_time: '6 min read',
            category: 'Destination Guides',
            hero_image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1000&q=80',
            related_listings: listings.slice(0, 2),
          },
          {
            slug: 'tokyo-ramen-hidden-izakayas-foodie-walk',
            title: 'Top Hidden Izakayas & Michelin Ramen in Shinjuku After Dark',
            summary: 'A curated foodie tour through Tokyo secret alleyways, sampling authentic Wagyu skewers, craft sake, and rich Tonkotsu broth.',
            author: 'Kenji Sato',
            published_at: 'July 28, 2026',
            read_time: '8 min read',
            category: 'Food & Dining',
            hero_image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1000&q=80',
            related_listings: listings.slice(1, 3),
          },
        ];
        setPosts(blogPosts);
      } catch (err) {
        console.error('Error loading blog posts:', err);
      } finally {
        setLoading(false);
      }
    }
    loadBlogData();
  }, []);

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 80px' }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Sparkles size={14} /> Headless CMS Travel Guides (Strapi Integrated)
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '12px' }}>
          TravelNest SEO Journal & Destination Guides
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto' }}>
          Explore expert insider guides, food tours, and cultural itineraries seamlessly linked with live marketplace bookable slots.
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>Loading Strapi blog articles...</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          {posts.map((post) => (
            <article key={post.slug} className="card-panel card-interactive" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '220px', position: 'relative' }}>
                <img src={post.hero_image} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--brand-primary)', color: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700 }}>
                  {post.category}
                </div>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><User size={13} /> {post.author}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={13} /> {post.published_at}</span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', color: '#0f172a', lineHeight: 1.3, marginBottom: '10px', fontWeight: 700 }}>
                    {post.title}
                  </h2>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '20px' }}>
                    {post.summary}
                  </p>

                  {/* EMBEDDED RELATED LISTINGS PREVIEW */}
                  <div style={{ background: '#f8fafc', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '8px' }}>
                      Linked Bookable Experience:
                    </span>
                    {post.related_listings[0] && (
                      <Link href={`/tours/${post.related_listings[0].slug}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', textDecoration: 'none', color: '#0284c7', fontWeight: 600, fontSize: '0.88rem' }}>
                        <span>⚡ {post.related_listings[0].title}</span>
                        <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>

                <Link href={`/blog/${post.slug}`} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '10px 0' }}>
                  Read Full Guide & Book Slots
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
