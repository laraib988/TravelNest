
export const metadata = { alternates: { canonical: '/community' } };
import { Suspense } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, MapPin, Search } from 'lucide-react';
import CommunityListClient from './CommunityListClient';




export const revalidate = 1800; // ISR cache revalidation (30 minutes) for SEO

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function CommunityDirectoryPage() {
  const { data: discussions } = await supabase
    .from('forum_discussions')
    .select('id, title, author_id, category, upvotes, view_count, created_at, is_pinned')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }} className="community-page-container">
      <style dangerouslySetInnerHTML={{ __html: `
        .community-page-container { margin: 20px auto !important; padding: 0 16px !important; }
        .community-hero { background: var(--brand-primary); border-radius: 16px; padding: 40px; color: #fff; margin-bottom: 30px; text-align: center; }
        .community-title { font-size: 2.5rem; margin-bottom: 12px; color: #ffffff; font-weight: 800; }
        .community-subtitle { font-size: 1.1rem; opacity: 0.9; padding: 0 10px; }
        .community-search-bar { margin-top: 24px; display: flex; gap: 8px; max-width: 500px; margin: 24px auto 0; }
        
        @media (max-width: 768px) {
          .community-hero { padding: 30px 20px; }
          .community-title { font-size: 1.8rem; }
          .community-subtitle { font-size: 0.95rem; }
        }
        @media (min-width: 769px) {
          .community-page-container { margin: 40px auto !important; padding: 0 24px !important; }
        }
      `}} />

      <div className="community-hero">
        <h1 className="community-title">Travel Community Forum</h1>
        <p className="community-subtitle">Ask questions, share tips, and get advice from verified local guides.</p>
        <div className="community-search-bar">
          <input type="text" placeholder="Search discussions..." style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', outline: 'none', width: '100%' }} />
          <button className="btn-secondary" style={{ background: '#fff', color: 'var(--brand-primary)', border: 'none', padding: '0 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Search size={20} />
          </button>
        </div>
      </div>

      <Suspense fallback={<div>Loading discussions...</div>}>
        <CommunityListClient initialDiscussions={discussions || []} />
      </Suspense>
    </div>
  );
}
