'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, MapPin } from 'lucide-react';

export default function CommunityListClient({ initialDiscussions }: { initialDiscussions: any[] }) {
  const [discussions, setDiscussions] = useState(initialDiscussions);

  useEffect(() => {
    const channel = supabase
      .channel('public:forum_discussions')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_discussions' }, (payload) => {
        setDiscussions((prev) => [payload.new, ...prev]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'forum_discussions' }, (payload) => {
        setDiscussions((prev) => prev.map(d => d.id === payload.new.id ? payload.new : d));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <style dangerouslySetInnerHTML={{ __html: `
        .forum-card { padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0; transition: box-shadow 0.2s; cursor: pointer; }
        .forum-header { display: flex; gap: 8px; margin-bottom: 12px; font-size: 0.85rem; align-items: center; flex-wrap: wrap; }
        .forum-title { font-size: 1.2rem; color: #0f172a; margin-bottom: 8px; font-weight: 700; line-height: 1.4; }
        .forum-footer { display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; color: #64748b; flex-wrap: wrap; gap: 12px; }
        
        @media (max-width: 600px) {
          .forum-card { padding: 16px; }
          .forum-title { font-size: 1.1rem; }
          .forum-footer { flex-direction: column; align-items: flex-start; }
        }
      `}} />

      {discussions.map((d: any) => (
        <Link href={`/community/${d.id}`} key={d.id} style={{ textDecoration: 'none' }}>
          <div className="card-panel forum-card">
            <div className="forum-header">
              <span className="badge-blue" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>{d.category}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                <MapPin size={14} /> {d.location}
              </span>
            </div>
            
            <h3 className="forum-title">{d.title}</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {d.content}
            </p>

            <div className="forum-footer">
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, flexShrink: 0 }}>
                  {d.author_name?.charAt(0) || 'U'}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', alignItems: 'center' }}>
                  <strong>{d.author_name || 'Anonymous'}</strong>
                  <span style={{ opacity: 0.6 }}> • {d.created_at ? formatDistanceToNow(new Date(d.created_at)) : ''} ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600, flexShrink: 0 }}>
                <MessageSquare size={16} /> {d.reply_count || 0} Replies
              </div>
            </div>
          </div>
        </Link>
      ))}
      
      {discussions.length === 0 && (
        <div style={{ padding: '60px 20px', textAlign: 'center', color: '#64748b' }}>
          No discussions found. Be the first to start a topic!
        </div>
      )}
    </div>
  );
}
