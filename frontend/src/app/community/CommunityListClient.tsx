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
      {discussions.map((d: any) => (
        <Link href={`/community/${d.id}`} key={d.id} style={{ textDecoration: 'none' }}>
          <div className="card-panel" style={{ padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', transition: 'box-shadow 0.2s', cursor: 'pointer' }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px', fontSize: '0.85rem' }}>
              <span className="badge-blue" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 10px', borderRadius: '20px', fontWeight: 600 }}>{d.category}</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748b' }}>
                <MapPin size={14} /> {d.location}
              </span>
            </div>
            
            <h3 style={{ fontSize: '1.2rem', color: '#0f172a', marginBottom: '8px', fontWeight: 700 }}>{d.title}</h3>
            <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '16px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {d.content}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.85rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                  {d.author_name.charAt(0)}
                </div>
                <div>
                  <strong>{d.author_name}</strong>
                  <span style={{ opacity: 0.6 }}> • {formatDistanceToNow(new Date(d.created_at))} ago</span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
                <MessageSquare size={16} /> {d.reply_count || 0} Replies
              </div>
            </div>
          </div>
        </Link>
      ))}
      
      {discussions.length === 0 && (
        <div style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
          No discussions found. Be the first to start a topic!
        </div>
      )}
    </div>
  );
}
