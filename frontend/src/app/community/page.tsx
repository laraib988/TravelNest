'use client';

import React, { useState } from 'react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Search, 
  Filter, 
  MapPin, 
  MessageSquarePlus,
  TrendingUp,
  Clock,
  User,
  Sparkles,
  Award,
  CheckCircle2,
  Send,
  HelpCircle,
  Flame,
  Globe,
  Compass,
  ArrowRight,
  X,
  ChevronDown
} from 'lucide-react';
import Link from 'next/link';
import { useCurrency } from '@/context/CurrencyContext';

interface Thread {
  id: string;
  author: { name: string; avatar: string; badge: string; isGuide?: boolean };
  destination: string;
  category: string;
  title: string;
  content: string;
  responses: Array<{
    id: string;
    author: { name: string; avatar: string; isGuide?: boolean };
    comment: string;
    timeAgo: string;
    upvotes: number;
  }>;
  votes: number;
  hasVoted?: boolean;
  timeAgo: string;
  trending: boolean;
}

const CATEGORIES = [
  { name: 'All Discussions', icon: Globe },
  { name: 'Destination Advice', icon: Compass },
  { name: 'Food & Nightlife', icon: Flame },
  { name: 'Budget Tips', icon: Award },
  { name: 'Safety & Visa', icon: CheckCircle2 }
];

const INITIAL_THREADS: Thread[] = [
  {
    id: '1',
    author: { name: 'Sarah Jenkins', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', badge: '🥇 Gold Explorer', isGuide: true },
    destination: 'Lahore, Pakistan',
    category: 'Food & Nightlife',
    title: 'Best rooftop dinner spot near Walled City Lahore with Badshahi Mosque views?',
    content: 'Planning a memorable evening dinner for my family. Looking for an authentic Pakistani rooftop dining spot that offers direct views of Badshahi Mosque illuminated at night. Recommendations for Siri Paye or Karahi?',
    responses: [
      {
        id: 'r1',
        author: { name: 'Tariq Mahmood', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80', isGuide: true },
        comment: 'Fort Road Food Street rooftop restaurants (like Cooco’s Den or Haveli) offer breathtaking 360° views of Badshahi Mosque. Make sure to reserve a balcony table 2 days in advance!',
        timeAgo: '1 hour ago',
        upvotes: 18
      },
      {
        id: 'r2',
        author: { name: 'Ayesha Khan', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80' },
        comment: 'Also check out Andaaz Restaurant right opposite the mosque. Their mutton karahi and naan under the stars are unforgettable!',
        timeAgo: '45 mins ago',
        upvotes: 9
      }
    ],
    votes: 45,
    hasVoted: false,
    timeAgo: '2 hours ago',
    trending: true
  },
  {
    id: '2',
    author: { name: 'David Chen', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=150&q=80', badge: '🥈 Silver Traveler' },
    destination: 'Bali, Indonesia',
    category: 'Destination Advice',
    title: 'Is 3 days enough for Bali catamaran cruise & cliffside temples?',
    content: 'I have a 3-day layover in Bali and want to book the Luxury Catamaran Sunset Cruise and visit Uluwatu & Tanha Lot. Is this doable without feeling overly rushed?',
    responses: [
      {
        id: 'r3',
        author: { name: 'Wayan Putra', avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=150&q=80', isGuide: true },
        comment: 'Totally doable! Day 1: Land & Benoa Harbour Catamaran Cruise (4-8pm). Day 2: Uluwatu cliff temple & Kecak dance. Day 3: Tanah Lot & airport drop-off.',
        timeAgo: '3 hours ago',
        upvotes: 24
      }
    ],
    votes: 89,
    hasVoted: true,
    timeAgo: '5 hours ago',
    trending: true
  },
  {
    id: '3',
    author: { name: 'Emma Wilson', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80', badge: '🥉 Bronze Nomad' },
    destination: 'Paris, France',
    category: 'Budget Tips',
    title: 'Louvre Skip-the-line timed entry vs Standard ticket queue times?',
    content: 'Visiting Paris next month. Is paying the extra $25 for timed skip-the-line guided access truly worth it, or are morning general admission queues manageable?',
    responses: [
      {
        id: 'r4',
        author: { name: 'Jean Dupont', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80' },
        comment: '100% worth it! General queue at the Glass Pyramid can easily exceed 2.5 hours in peak season. Skip-the-line gets you straight inside in under 10 minutes.',
        timeAgo: '12 hours ago',
        upvotes: 31
      }
    ],
    votes: 34,
    hasVoted: false,
    timeAgo: '1 day ago',
    trending: false
  },
  {
    id: '4',
    author: { name: 'Zaid Al-Mansoor', avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=150&q=80', badge: '🥇 Gold Explorer' },
    destination: 'Dubai, UAE',
    category: 'Safety & Visa',
    title: 'Red Dune Safari safety for elderly family members?',
    content: 'My parents (65+) are visiting Dubai. We want to do the 4x4 Lahbab Desert Safari but are worried dune bashing might be too rough. Can we request smooth driving?',
    responses: [
      {
        id: 'r5',
        author: { name: 'Rashid Khan', avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&q=80', isGuide: true },
        comment: 'Yes! When booking on TravelNest, add a note in special requests. Private Land Cruisers provide gentle scenic dune driving directly to the Bedouin camp.',
        timeAgo: '1 day ago',
        upvotes: 15
      }
    ],
    votes: 52,
    hasVoted: false,
    timeAgo: '2 days ago',
    trending: true
  }
];

export default function CommunityPage() {
  const { t } = useCurrency();
  const [threads, setThreads] = useState<Thread[]>(INITIAL_THREADS);
  const [activeCategory, setActiveCategory] = useState('All Discussions');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedThreadId, setExpandedThreadId] = useState<string | null>('1');
  const [replyText, setReplyText] = useState<{ [key: string]: string }>({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New question form state
  const [newTitle, setNewTitle] = useState('');
  const [newDestination, setNewDestination] = useState('');
  const [newCategory, setNewCategory] = useState('Destination Advice');
  const [newContent, setNewContent] = useState('');

  const handleVote = (id: string) => {
    setThreads(prev => prev.map(t => {
      if (t.id === id) {
        const hasVoted = !t.hasVoted;
        return {
          ...t,
          hasVoted,
          votes: hasVoted ? t.votes + 1 : t.votes - 1
        };
      }
      return t;
    }));
  };

  const handleAddReply = (threadId: string) => {
    const comment = replyText[threadId];
    if (!comment || !comment.trim()) return;

    setThreads(prev => prev.map(t => {
      if (t.id === threadId) {
        return {
          ...t,
          responses: [
            ...t.responses,
            {
              id: `r-${Date.now()}`,
              author: { name: 'You (Traveler)', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80' },
              comment: comment.trim(),
              timeAgo: 'Just now',
              upvotes: 1
            }
          ]
        };
      }
      return t;
    }));

    setReplyText(prev => ({ ...prev, [threadId]: '' }));
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const newThread: Thread = {
      id: `thread-${Date.now()}`,
      author: { name: 'Ayesha Khan', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80', badge: '🥉 Verified Traveler' },
      destination: newDestination || 'Global',
      category: newCategory,
      title: newTitle,
      content: newContent,
      responses: [],
      votes: 1,
      hasVoted: true,
      timeAgo: 'Just now',
      trending: true
    };

    setThreads([newThread, ...threads]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewDestination('');
    setNewContent('');
  };

  const filteredThreads = threads.filter(t => {
    const matchesCat = activeCategory === 'All Discussions' || t.category === activeCategory;
    const matchesSearch = !searchQuery || 
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', color: '#0f172a', paddingBottom: '80px' }}>
      
      {/* ═══════════ HERO BANNER WITH BRAND GRADIENT ═══════════ */}
      <div style={{ 
        background: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        padding: '50px 24px 36px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '24px', marginBottom: '28px' }}>
            <div>
              <div className="badge-purple" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
                <Sparkles size={14} /> Global Travelers & Local Storytellers Hub
              </div>
              <h1 style={{ fontSize: '2.6rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', margin: 0, lineHeight: 1.2 }}>
                TravelNest <span className="gradient-text">Community Q&A Forum</span>
              </h1>
              <p style={{ color: '#475569', fontSize: '1.05rem', marginTop: '8px', maxWidth: '640px' }}>
                Connect with verified local guides, get real-time itinerary advice, discover hidden food streets, and earn rewards points.
              </p>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
              style={{
                fontSize: '1rem',
                padding: '14px 28px',
                boxShadow: '0 8px 25px rgba(2, 132, 199, 0.35)'
              }}
            >
              <MessageSquarePlus size={20} /> Ask the Community
            </button>
          </div>

          {/* COMMUNITY STATS CARDS MATCHING STOREFRONT DESIGN */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginTop: '24px' }}>
            <div className="card-panel" style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Active Discussions</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginTop: '2px' }}>14,280+</div>
            </div>
            <div className="card-panel" style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verified Local Guides</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#059669', marginTop: '2px' }}>3,450 Guides</div>
            </div>
            <div className="card-panel" style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Avg Response Time</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0284c7', marginTop: '2px' }}>Under 12 Mins</div>
            </div>
            <div className="card-panel" style={{ padding: '16px 20px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Helpful Answer Rate</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#d97706', marginTop: '2px' }}>98.4%</div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════ MAIN CONTAINER ═══════════ */}
      <div style={{ maxWidth: '1280px', margin: '36px auto 0', padding: '0 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>

          {/* ═══════════ LEFT SIDEBAR FILTERS & REWARDS CARD ═══════════ */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* SEARCH BOX */}
            <div className="card-panel" style={{ padding: '20px', borderRadius: '20px' }}>
              <div style={{ position: 'relative', marginBottom: '18px' }}>
                <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input 
                  type="text" 
                  placeholder="Search topics, cities..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 14px 12px 42px',
                    borderRadius: '12px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    color: '#0f172a',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              {/* CATEGORY CHIPS */}
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Filter size={14} /> Categories
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {CATEGORIES.map(cat => {
                  const Icon = cat.icon;
                  const isActive = activeCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      onClick={() => setActiveCategory(cat.name)}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '12px',
                        border: isActive ? '1.5px solid #0284c7' : '1px solid transparent',
                        background: isActive ? '#f0f9ff' : 'transparent',
                        color: isActive ? '#0284c7' : '#475569',
                        fontWeight: isActive ? 700 : 500,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        transition: 'all 0.2s'
                      }}
                    >
                      <Icon size={16} color={isActive ? '#0284c7' : '#64748b'} />
                      {cat.name}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* REWARDS CARD */}
            <div style={{ 
              background: 'linear-gradient(135deg, #fffbe6 0%, #fef3c7 100%)', 
              border: '1px solid #fde68a', 
              borderRadius: '20px', 
              padding: '22px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ background: '#f59e0b', padding: '8px', borderRadius: '10px', color: '#fff', display: 'flex' }}>
                  <Award size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#92400e', margin: 0 }}>Community Badges</h3>
                  <span style={{ fontSize: '0.78rem', color: '#b45309', fontWeight: 600 }}>Earn points for helpful answers</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: '#78350f', lineHeight: 1.5, marginBottom: '14px' }}>
                Answer traveler questions, gain upvotes, and unlock NestPoints redeemable on bookings.
              </p>
              <Link href="/loyalty" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#b45309', fontWeight: 700, fontSize: '0.88rem', textDecoration: 'none' }}>
                View Loyalty Program &rarr;
              </Link>
            </div>

            {/* RULES PANEL */}
            <div className="card-panel" style={{ padding: '18px', borderRadius: '20px' }}>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={16} color="#059669" /> Community Guidelines
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
                <li>• Be helpful, polite, and respectful</li>
                <li>• No spam or unauthorized promo links</li>
                <li>• Verified badges require official ID/permit</li>
              </ul>
            </div>

          </div>

          {/* ═══════════ MAIN DISCUSSIONS FEED ═══════════ */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #e2e8f0' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                Popular Discussions <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#64748b' }}>({filteredThreads.length} topics)</span>
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', color: '#64748b' }}>
                <span>Sort by:</span>
                <select style={{ background: '#ffffff', border: '1px solid #cbd5e1', color: '#0f172a', borderRadius: '8px', padding: '6px 12px', fontSize: '0.85rem', outline: 'none', cursor: 'pointer', fontWeight: 600 }}>
                  <option value="trending">🔥 Trending First</option>
                  <option value="newest">🕒 Newest First</option>
                  <option value="votes">👍 Most Voted</option>
                </select>
              </div>
            </div>

            {/* THREAD LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {filteredThreads.map(thread => {
                const isExpanded = expandedThreadId === thread.id;
                return (
                  <div 
                    key={thread.id} 
                    className="card-panel"
                    style={{
                      padding: '24px',
                      borderRadius: '20px',
                      borderColor: isExpanded ? '#38bdf8' : '#e2e8f0',
                      boxShadow: isExpanded ? 'var(--shadow-md)' : 'var(--shadow-sm)'
                    }}
                  >
                    <div style={{ display: 'flex', gap: '20px' }}>
                      
                      {/* UPVOTE COLUMN */}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                        <button
                          onClick={() => handleVote(thread.id)}
                          style={{
                            background: thread.hasVoted ? '#ecfdf5' : '#f8fafc',
                            border: thread.hasVoted ? '1px solid #a7f3d0' : '1px solid #cbd5e1',
                            borderRadius: '12px',
                            padding: '8px 14px',
                            cursor: 'pointer',
                            color: thread.hasVoted ? '#047857' : '#475569',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '4px',
                            transition: 'all 0.2s'
                          }}
                        >
                          <ThumbsUp size={18} fill={thread.hasVoted ? '#047857' : 'none'} />
                          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: thread.hasVoted ? '#047857' : '#0f172a' }}>{thread.votes}</span>
                        </button>
                      </div>

                      {/* MAIN THREAD DETAILS */}
                      <div style={{ flex: 1 }}>
                        
                        {/* AUTHOR ROW */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <img src={thread.author.avatar} alt={thread.author.name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#0f172a' }}>{thread.author.name}</span>
                                <span className="badge-amber" style={{ fontSize: '0.72rem' }}>
                                  {thread.author.badge}
                                </span>
                              </div>
                            </div>
                          </div>

                          {thread.trending && (
                            <span className="badge-rose" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                              <Flame size={12} /> Trending
                            </span>
                          )}
                        </div>

                        {/* TITLE & BODY */}
                        <h3 
                          onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                          style={{ 
                            fontSize: '1.2rem', 
                            fontWeight: 700, 
                            color: '#0f172a', 
                            marginBottom: '8px',
                            cursor: 'pointer',
                            lineHeight: 1.35
                          }}
                        >
                          {thread.title}
                        </h3>

                        <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
                          {thread.content}
                        </p>

                        {/* METADATA BAR */}
                        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', fontSize: '0.8rem', color: '#64748b' }}>
                          <span className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                            <MapPin size={12} /> {thread.destination}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f1f5f9', color: '#334155', padding: '4px 10px', borderRadius: '8px', fontWeight: 600 }}>
                            {thread.category}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Clock size={13} /> {thread.timeAgo}
                          </span>
                          <button 
                            onClick={() => setExpandedThreadId(isExpanded ? null : thread.id)}
                            style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'var(--brand-primary)', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem' }}
                          >
                            <MessageSquare size={14} /> {thread.responses.length} Replies {isExpanded ? '▲' : '▼'}
                          </button>
                        </div>

                        {/* EXPANDABLE RESPONSES FEED */}
                        {isExpanded && (
                          <div style={{ marginTop: '20px', paddingTop: '18px', borderTop: '1px solid #e2e8f0' }}>
                            
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <MessageSquare size={16} color="var(--brand-primary)" /> Community Answers & Local Tips
                            </h4>

                            {/* ANSWERS LIST */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                              {thread.responses.map(resp => (
                                <div key={resp.id} style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '14px 16px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                      <img src={resp.author.avatar} alt={resp.author.name} style={{ width: '26px', height: '26px', borderRadius: '50%', objectFit: 'cover' }} />
                                      <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#0f172a' }}>{resp.author.name}</span>
                                      {resp.author.isGuide && (
                                        <span className="badge-emerald" style={{ fontSize: '0.65rem', padding: '2px 6px' }}>
                                          ✓ Verified Guide
                                        </span>
                                      )}
                                    </div>
                                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{resp.timeAgo}</span>
                                  </div>
                                  <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: 1.5, margin: 0 }}>{resp.comment}</p>
                                </div>
                              ))}
                            </div>

                            {/* INLINE REPLY INPUT */}
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <input
                                type="text"
                                placeholder="Write a helpful answer or tip..."
                                value={replyText[thread.id] || ''}
                                onChange={(e) => setReplyText({ ...replyText, [thread.id]: e.target.value })}
                                onKeyDown={(e) => e.key === 'Enter' && handleAddReply(thread.id)}
                                style={{
                                  flex: 1,
                                  padding: '10px 14px',
                                  borderRadius: '10px',
                                  background: '#ffffff',
                                  border: '1px solid #cbd5e1',
                                  color: '#0f172a',
                                  fontSize: '0.88rem',
                                  outline: 'none'
                                }}
                              />
                              <button
                                onClick={() => handleAddReply(thread.id)}
                                className="btn-primary"
                                style={{
                                  padding: '10px 18px',
                                  fontSize: '0.85rem'
                                }}
                              >
                                <Send size={14} /> Reply
                              </button>
                            </div>

                          </div>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════ ASK COMMUNITY MODAL ═══════════ */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(8px)', zIndex: 99999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
          <div style={{ background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '24px', maxWidth: '600px', width: '100%', padding: '32px', boxShadow: '0 25px 50px rgba(0,0,0,0.25)', position: 'relative' }}>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={18} />
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ background: '#ecfdf5', padding: '10px', borderRadius: '12px', color: '#059669' }}>
                <HelpCircle size={24} />
              </div>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Ask the TravelNest Community</h2>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Get advice from verified travelers & accredited local guides</span>
              </div>
            </div>

            <form onSubmit={handleCreateQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Question Title</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. 'Best sunset viewing point in Hunza Valley?'"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Destination</label>
                  <input 
                    type="text"
                    placeholder="e.g. Hunza, Pakistan"
                    value={newDestination}
                    onChange={(e) => setNewDestination(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Category</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem', outline: 'none' }}
                  >
                    {CATEGORIES.filter(c => c.name !== 'All Discussions').map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Details / Context</label>
                <textarea 
                  rows={4}
                  required
                  placeholder="Provide travel dates, group size, budget, or specific preferences..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', fontSize: '0.9rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
                <button type="submit" className="btn-primary" style={{ padding: '10px 24px' }}>
                  Post Question to Community
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
