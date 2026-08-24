import { createClient } from '@supabase/supabase-js';
import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { Sparkles, User, Calendar, ArrowRight, BookOpen } from 'lucide-react';

export const revalidate = 86400; // 24h ISR

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseAnonKey);

import { getAlternates } from '@/lib/seo';
export const metadata: Metadata = {
  title: 'Vaitour Blog — Destination Guides & Travel Tips',
  description:
    'Expert travel guides, 3-day itineraries, cost breakdowns and local etiquette tips for Japan and beyond. Plan smarter with Vaitour.',
  alternates: getAlternates('/blog')
};

async function getPublishedBlogs() {
  const { data, error } = await supabase
    .from('blogs')
    .select('id,title,slug,summary,hero_image,hero_image_alt,author_name,author_avatar,published_at,focus_keywords,meta_description')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(30);

  if (error) {
    console.error('Blog index fetch error:', error);
    return [];
  }
  return data || [];
}

export default async function BlogIndexPage() {
  const posts = await getPublishedBlogs();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '40px 24px 80px' }}>
      {/* HEADER SECTION */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <div className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
          <Sparkles size={14} /> Daily Travel Blog Engine
        </div>
        <h1 style={{ fontSize: '2.5rem', color: '#0f172a', fontWeight: 800, marginBottom: '12px' }}>
          Vaitour Journal & Destination Guides
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto' }}>
          Expert insider guides, food tours, and cultural itineraries — refreshed daily by our editorial AI engine.
        </p>
      </div>

      {posts.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          <BookOpen size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
          <p>No published articles yet. Check back soon.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '32px' }}>
          {posts.map((post) => (
            <article key={post.slug} className="card-panel card-interactive" style={{ borderRadius: 'var(--radius-lg)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: '220px', position: 'relative' }}>
                <Image src={post.hero_image} alt={post.hero_image_alt || post.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }}  width={100} height={100} />
                <div style={{ position: 'absolute', top: '12px', left: '12px', background: 'var(--brand-primary)', color: '#fff', padding: '4px 10px', borderRadius: 'var(--radius-sm)', fontSize: '0.75rem', fontWeight: 700 }}>
                  Travel Guide
                </div>
              </div>

              <div style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {post.author_avatar && (
                        <Image src={post.author_avatar} alt={post.author_name} style={{ width: 22, height: 22, borderRadius: '50%', objectFit: 'cover' }}  width={22} height={22} />
                      )}
                      <User size={13} /> {post.author_name}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={13} /> {post.published_at ? new Date(post.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                    </span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', color: '#0f172a', lineHeight: 1.3, marginBottom: '10px', fontWeight: 700 }}>
                    {post.title}
                  </h2>

                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '16px' }}>
                    {post.summary || post.meta_description}
                  </p>
                </div>

                <Link href={`/blog/${post.slug}`} className="btn-secondary" style={{ width: '100%', justifyContent: 'center', padding: '10px 0' }}>
                  Read Full Guide <ArrowRight size={16} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}