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
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div style={{ maxWidth: '1000px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ background: 'var(--brand-primary)', borderRadius: '16px', padding: '40px', color: '#fff', marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '12px', color: '#ffffff' }}>Travel Community Forum</h1>
        <p style={{ fontSize: '1.1rem', opacity: 0.9 }}>Ask questions, share tips, and get advice from verified local guides.</p>
        <div style={{ marginTop: '24px', display: 'flex', gap: '8px', maxWidth: '500px', margin: '24px auto 0' }}>
          <input type="text" placeholder="Search discussions..." style={{ flex: 1, padding: '14px', borderRadius: '8px', border: 'none', outline: 'none' }} />
          <button className="btn-secondary" style={{ background: '#fff', color: 'var(--brand-primary)', border: 'none' }}>
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
