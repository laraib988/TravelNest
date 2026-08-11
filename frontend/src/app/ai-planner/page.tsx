'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { Sparkles, Compass, Calendar, CheckCircle2, ArrowRight, Zap, RefreshCw, Bot, Send, Loader2, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default function AIPlannerPage() {
  const [promptText, setPromptText] = useState('I want a 2-day getaway in Bali featuring a luxury catamaran sunset cruise, seafood buffet dinner, and local food exploration.');
  const [destination, setDestination] = useState('bali');
  const [maxBudget, setMaxBudget] = useState(250);
  const [itinerary, setItinerary] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  // --- AI Booking Agent State ---
  const [agentSessionId, setAgentSessionId] = useState<string | null>(null);
  const [agentMessages, setAgentMessages] = useState<any[]>([]);
  const [agentInput, setAgentInput] = useState('');
  const [agentWorking, setAgentWorking] = useState(false);
  const [agentSteps, setAgentSteps] = useState<any[]>([]);
  const [bundle, setBundle] = useState<any>(null);
  const [countdown, setCountdown] = useState<number>(0);
  
  const chatEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    { label: '⛵ Bali Cruise', prompt: 'Romantic sunset catamaran cruise in Bali with seafood buffet', dest: 'bali' },
    { label: '🍜 Tokyo Ramen', prompt: 'After-dark Shinjuku ramen and sake tasting tour in Tokyo', dest: 'tokyo' },
  ];

  const handleSelectSample = (sample: typeof samplePrompts[0]) => {
    setPromptText(sample.prompt);
    setDestination(sample.dest);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setGenerating(true);
    try {
      const res = await fetchFromAPI('/ai/trip-planner', {
        method: 'POST',
        body: JSON.stringify({ prompt: promptText, destination, max_budget: maxBudget }),
      });
      setItinerary(res);
    } catch (err: any) {
      alert('AI Generation error: ' + err.message);
    } finally {
      setGenerating(false);
    }
  };

  // --- AI Booking Agent Logic ---
  useEffect(() => {
    // Initialize session
    fetchFromAPI('/ai/agent/session', { method: 'POST' }).then(res => {
      setAgentSessionId(res.sessionId);
      setAgentMessages([{ role: 'agent', content: 'Hi! I am the TravelNest Booking Agent. I can plan your trip, find the best options, and hold them for you. What would you like to do?' }]);
    });
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [agentMessages, agentSteps]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleAgentSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!agentInput.trim() || !agentSessionId) return;

    const userMsg = { role: 'user', content: agentInput };
    setAgentMessages(prev => [...prev, userMsg]);
    setAgentInput('');
    setAgentWorking(true);
    setAgentSteps([]);

    try {
      const res = await fetchFromAPI(`/ai/agent/session/${agentSessionId}/message`, {
        method: 'POST',
        body: JSON.stringify({ message: userMsg.content })
      });
      
      // Simulate real-time progress steps for UI
      if (res.steps && res.steps.length > 0) {
         for (const step of res.steps) {
           setAgentSteps(prev => [...prev, step]);
           await new Promise(r => setTimeout(r, 800)); // UI delay for demo
         }
      }

      setAgentMessages(prev => [...prev, { role: 'agent', content: res.responseText }]);
      
      if (res.bundle) {
        setBundle(res.bundle);
        setCountdown(10 * 60); // 10 minutes
      } else if (res.responseText.includes('Done!')) {
        setBundle(null);
        setCountdown(0);
      }
    } catch (err: any) {
       console.error(err);
       setAgentMessages(prev => [...prev, { role: 'agent', content: 'Sorry, I encountered an error. Please try again.' }]);
    } finally {
      setAgentWorking(false);
      setAgentSteps([]);
    }
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '40px auto', padding: '0 24px', background: '#f8fafc' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <div className="badge-amber animate-pulse-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <Sparkles size={14} /> Next-Gen AI Services
        </div>
        <h1 style={{ fontSize: '3.2rem', marginBottom: '16px', color: '#0f172a', fontWeight: 800 }}>AI Trip Studio</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Experience the future of travel. Use the AI Trip Planner to draft ideas, or ask the Autonomous Booking Agent to find, hold, and book your complete trip.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        
        {/* LEFT COLUMN: AI TRIP PLANNER (SRS 9.1) */}
        <div style={{ flex: '1.2' }}>
          <div className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '36px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}><Compass className="text-brand-primary" /> AI Trip Planner</h2>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '24px' }}>
              {samplePrompts.map((s, idx) => (
                <button key={idx} onClick={() => handleSelectSample(s)} className="chip-filter" style={{ fontSize: '0.85rem' }}>{s.label}</button>
              ))}
            </div>

            <form onSubmit={handleGenerate}>
              <textarea value={promptText} onChange={(e) => setPromptText(e.target.value)} rows={3} style={{ width: '100%', padding: '16px', borderRadius: 'var(--radius-md)', background: '#f8fafc', border: '1px solid #cbd5e1', marginBottom: '24px', fontFamily: 'inherit' }} />
              <button type="submit" disabled={generating} className="btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1.05rem', justifyContent: 'center' }}>
                {generating ? <><RefreshCw size={18} className="animate-spin" /> Generating...</> : 'Generate Itinerary'}
              </button>
            </form>

            {/* ITINERARY RESULTS (Simplified for space) */}
            {itinerary && (
              <div style={{ marginTop: '32px', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '16px' }}>{itinerary.trip_name}</h3>
                {itinerary.days.map((day: any) => (
                  <div key={day.day_number} style={{ marginBottom: '16px', padding: '16px', background: '#f0f9ff', borderRadius: '8px' }}>
                    <div style={{ fontWeight: 700, marginBottom: '8px' }}>Day {day.day_number}: {day.theme}</div>
                    {day.activities.map((act: any, idx: number) => (
                      <div key={idx} style={{ fontSize: '0.9rem', marginBottom: '4px' }}>• {act.activity_name} (${act.estimated_price})</div>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: AI BOOKING AGENT */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', height: '800px' }}>
          <div className="card-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', background: '#ffffff', border: '2px solid var(--brand-primary)', overflow: 'hidden' }}>
            
            {/* AGENT HEADER */}
            <div style={{ padding: '20px', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bot size={28} />
              <div>
                <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Plan & Book for Me</h2>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Autonomous AI Booking Agent</div>
              </div>
            </div>

            {/* CHAT HISTORY */}
            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc' }}>
              {agentMessages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '85%' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: msg.role === 'user' ? 'var(--brand-primary)' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#0f172a',
                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.role === 'agent' ? '4px' : '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    lineHeight: 1.5
                  }}>
                    {msg.content}
                  </div>
                </div>
              ))}

              {/* PROGRESS INDICATORS (Think -> Act -> Check loop) */}
              {agentSteps.length > 0 && (
                <div style={{ alignSelf: 'flex-start', maxWidth: '85%', background: '#f1f5f9', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 size={14} className="animate-spin" /> Agent Working...
                  </div>
                  {agentSteps.map((step, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '8px', marginBottom: '4px' }}>
                      <CheckCircle2 size={12} className="text-emerald-500" style={{ marginTop: '3px' }} />
                      <span><strong>{step.tool}:</strong> {step.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* BUNDLE / INVENTORY HOLD UI */}
              {bundle && !agentWorking && (
                <div style={{ alignSelf: 'flex-start', width: '100%', background: '#ffffff', borderRadius: '12px', border: '2px solid #38bdf8', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                  <div style={{ background: '#e0f2fe', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd' }}>
                    <div style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: '6px' }}><Zap size={16} /> Ready to Book</div>
                    <div style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 700 }}>Expires in: {formatTime(countdown)}</div>
                  </div>
                  <div style={{ padding: '16px', maxHeight: '350px', overflowY: 'auto' }}>
                    {bundle.items.map((item: any, i: number) => (
                      <div 
                        key={i} 
                        onClick={() => setAgentInput(`I want to book: ${item.title}`)}
                        style={{ display: 'flex', gap: '12px', marginBottom: '12px', paddingBottom: '12px', borderBottom: i < bundle.items.length - 1 ? '1px solid #e2e8f0' : 'none', cursor: 'pointer' }}
                        title="Click to add to chat"
                      >
                        <img src={item.img} alt={item.title} style={{ width: '60px', height: '60px', borderRadius: '8px', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{item.title}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>{item.date}</div>
                        </div>
                        <div style={{ fontWeight: 700, color: '#059669' }}>${item.price}</div>
                        <button 
                           onClick={(e) => { e.stopPropagation(); /* handle remove logic here if needed */ }} 
                           style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} 
                           title="Remove"
                        >
                           <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px', paddingTop: '16px', borderTop: '2px dashed #cbd5e1', fontWeight: 800, fontSize: '1.1rem' }}>
                      <span>Total:</span>
                      <span>${bundle.totalPrice} {bundle.currency}</span>
                    </div>
                    <button onClick={() => setAgentInput('Yes, confirm and book')} className="btn-primary" style={{ width: '100%', marginTop: '16px', justifyContent: 'center', padding: '12px' }}>
                      Confirm & Book All
                    </button>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* CHAT INPUT */}
            <form onSubmit={handleAgentSend} style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder="Ask me to plan & book your trip..."
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                disabled={agentWorking || countdown === 0 && bundle !== null}
                style={{ flex: 1, padding: '14px 16px', borderRadius: '24px', border: '1px solid #cbd5e1', outline: 'none', background: '#f8fafc' }}
              />
              <button type="submit" disabled={agentWorking || !agentInput.trim()} className="btn-primary" style={{ borderRadius: '50%', width: '48px', height: '48px', padding: 0, justifyContent: 'center' }}>
                <Send size={18} />
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

