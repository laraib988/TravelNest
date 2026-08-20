'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { formatDistanceToNow } from 'date-fns';
import { CheckCircle2, UserCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function DiscussionThreadClient({ discussion, initialReplies }: { discussion: any, initialReplies: any[] }) {
  const [replies, setReplies] = useState(initialReplies);
  const [replyText, setReplyText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const channel = supabase
      .channel(`public:forum_replies:${discussion.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'forum_replies', filter: `discussion_id=eq.${discussion.id}` }, (payload) => {
        setReplies((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [discussion.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !user) return;
    
    setSubmitting(true);
    const content = replyText.trim();
    setReplyText('');

    try {
      const { data: profile } = await supabase.from('profiles').select('name').eq('id', user.id).single();
      const authorName = profile?.name || user.name || 'Traveler';

      // Insert reply directly to DB
      const { error } = await supabase.from('forum_replies').insert({
        discussion_id: discussion.id,
        content: content,
        author_name: authorName,
        author_badge: 'Community Member',
        is_guide: false,
        user_id: user.id
      });

      if (error) throw error;

      // Trigger the background AI auto-reply hook
      fetch('/api/community/auto-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ discussionId: discussion.id, content: content })
      });
      
    } catch (err) {
      console.error('Failed to post reply:', err);
      alert('Failed to post reply.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* OP POST */}
      <div className="card-panel" style={{ padding: '32px', borderRadius: '16px', border: '1px solid #cbd5e1', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          <span className="badge-blue" style={{ background: '#e0f2fe', color: '#0369a1', padding: '4px 12px', borderRadius: '20px', fontWeight: 600, fontSize: '0.85rem' }}>{discussion.category}</span>
          <span style={{ color: '#64748b', fontSize: '0.9rem', display: 'flex', alignItems: 'center' }}>{discussion.location}</span>
        </div>
        
        <h1 style={{ fontSize: '1.8rem', color: '#0f172a', marginBottom: '16px', fontWeight: 800 }}>{discussion.title}</h1>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px', paddingBottom: '24px', borderBottom: '1px solid #e2e8f0' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: '1.2rem' }}>
            {discussion.author_name.charAt(0)}
          </div>
          <div>
            <div style={{ fontWeight: 700, color: '#0f172a' }}>{discussion.author_name}</div>
            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
              {discussion.author_badge} • {formatDistanceToNow(new Date(discussion.created_at))} ago
            </div>
          </div>
        </div>

        <div style={{ fontSize: '1.05rem', lineHeight: 1.7, color: '#334155', whiteSpace: 'pre-wrap' }}>
          {discussion.content}
        </div>
      </div>

      <h3 style={{ fontSize: '1.3rem', color: '#0f172a', margin: '32px 0 20px', fontWeight: 700 }}>
        {replies.length} {replies.length === 1 ? 'Reply' : 'Replies'}
      </h3>

      {/* REPLIES LIST */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '40px' }}>
        {replies.map((reply: any) => (
          <div key={reply.id} style={{ padding: '24px', borderRadius: '12px', background: reply.is_guide ? '#f0fdf4' : '#f8fafc', border: reply.is_guide ? '1px solid #bbf7d0' : '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: reply.is_guide ? '#059669' : '#94a3b8', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700 }}>
                {reply.author_name.charAt(0)}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 700, color: '#0f172a' }}>{reply.author_name}</span>
                  {reply.is_guide && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', background: '#d1fae5', color: '#065f46', padding: '2px 8px', borderRadius: '12px', fontWeight: 700 }}>
                      <CheckCircle2 size={12} /> {reply.author_badge}
                    </span>
                  )}
                  {!reply.is_guide && reply.author_badge && (
                    <span style={{ fontSize: '0.8rem', color: '#64748b' }}>{reply.author_badge}</span>
                  )}
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>
                  {formatDistanceToNow(new Date(reply.created_at))} ago
                </div>
              </div>
            </div>
            
            <div style={{ fontSize: '1rem', lineHeight: 1.6, color: '#334155', whiteSpace: 'pre-wrap' }}>
              {reply.content}
            </div>
          </div>
        ))}
      </div>

      {/* ADD REPLY */}
      <div className="card-panel" style={{ padding: '24px', borderRadius: '12px', border: '1px solid #cbd5e1', background: '#ffffff' }}>
        <h4 style={{ fontSize: '1.1rem', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <UserCircle2 size={20} /> Join the discussion
        </h4>
        {user ? (
          <form onSubmit={handleSubmit}>
            <textarea
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Share your advice or ask a follow-up question..."
              style={{ width: '100%', minHeight: '120px', padding: '16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none', resize: 'vertical', marginBottom: '16px', fontFamily: 'inherit' }}
            />
            <button type="submit" disabled={submitting || !replyText.trim()} className="btn-primary" style={{ padding: '12px 24px', opacity: submitting || !replyText.trim() ? 0.6 : 1 }}>
              {submitting ? 'Posting...' : 'Post Reply'}
            </button>
          </form>
        ) : (
          <div style={{ background: '#f8fafc', padding: '24px', textAlign: 'center', borderRadius: '8px', border: '1px dashed #cbd5e1' }}>
            <p style={{ color: '#64748b', marginBottom: '16px' }}>Please log in to participate in the community.</p>
            <Link href="/login?redirect=/community" className="btn-secondary" style={{ padding: '10px 20px', display: 'inline-block' }}>Log in to Reply</Link>
          </div>
        )}
      </div>
    </div>
  );
}
