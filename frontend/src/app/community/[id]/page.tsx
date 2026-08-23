import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import DiscussionThreadClient from './DiscussionThreadClient';

export const revalidate = 1800;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export async function generateMetadata({ params }: { params: { id: string } }) {
  const { data: discussion } = await supabase.from('forum_discussions').select('*').eq('id', params.id).single();
  if (!discussion) return { title: 'Discussion Not Found' };
  
  return {
    title: `${discussion.title} | Vaitour Community`,
    description: discussion.content.substring(0, 150) + '...',
  };
}

export default async function DiscussionDetailPage({ params }: { params: { id: string } }) {
  const { data: discussion } = await supabase
    .from('forum_discussions')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!discussion) {
    return <div style={{ padding: '60px', textAlign: 'center' }}>Discussion not found.</div>;
  }

  const { data: replies } = await supabase
    .from('forum_replies')
    .select('*')
    .eq('discussion_id', params.id)
    .order('created_at', { ascending: true });

  // JSON-LD for SEO
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'DiscussionForumPosting',
    headline: discussion.title,
    text: discussion.content,
    author: { '@type': 'Person', name: discussion.author_name },
    datePublished: discussion.created_at,
    commentCount: discussion.reply_count,
    comment: (replies || []).map((r: any) => ({
      '@type': 'Comment',
      text: r.content,
      author: { '@type': 'Person', name: r.author_name },
      dateCreated: r.created_at
    }))
  };

  return (
    <div style={{ maxWidth: '900px', margin: '40px auto', padding: '0 24px' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      
      <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#64748b', textDecoration: 'none', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Community
      </Link>

      <DiscussionThreadClient discussion={discussion} initialReplies={replies || []} />
    </div>
  );
}
