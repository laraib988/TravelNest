'use client';

import { useState, useEffect, useRef } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { Sparkles, Compass, Calendar, CheckCircle2, ArrowRight, Zap, RefreshCw, Bot, Send, Loader2, Trash2, CloudSun, UtensilsCrossed, Wallet, MapPin, Star, Clock, ThermometerSun } from 'lucide-react';

const renderRichText = (content: string) => {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((p, i) =>
    p.startsWith('**') && p.endsWith('**') ? <strong key={i}>{p.slice(2, -2)}</strong> : <span key={i}>{p}</span>
  );
};

const TIME_LABEL: Record<string, string> = { MORNING: '☀️ Morning', AFTERNOON: '🌤️ Afternoon', EVENING: '🌙 Evening' };

function ItineraryCard({ itinerary }: { itinerary: any }) {
  if (!itinerary?.days?.length) return null;
  const b = itinerary.budget_summary || {};
  return (
    <div style={{ width: '100%', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)' }}>
      <div style={{ background: 'linear-gradient(90deg,#0ea5e9,#6366f1)', padding: '14px 16px', color: '#fff' }}>
        <div style={{ fontWeight: 800, fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 6 }}>
          <MapPin size={16} /> {itinerary.trip_name}
        </div>
        <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>{itinerary.destination}, {itinerary.country} · {itinerary.days.length}-day plan</div>
      </div>

      <div style={{ padding: '16px' }}>
        {itinerary.days.map((day: any) => (
          <div key={day.day_number} style={{ marginBottom: '16px', padding: '12px', background: '#f8fafc', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}><Calendar size={14} style={{ display: 'inline', marginRight: 4 }} /> Day {day.day_number}: {day.theme}</div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#059669' }}>${day.day_cost}</div>
            </div>
            {day.weather_note && (
              <div style={{ fontSize: '0.78rem', color: '#0369a1', background: '#e0f2fe', padding: '6px 8px', borderRadius: '6px', marginBottom: 8 }}>
                <ThermometerSun size={12} style={{ display: 'inline', marginRight: 4 }} /> {day.weather_note}
              </div>
            )}
            {day.activities.map((act: any, idx: number) => (
              <div key={idx} style={{ display: 'flex', gap: 10, padding: '6px 0', borderTop: idx === 0 ? 'none' : '1px dashed #e2e8f0' }}>
                {act.image ? <img src={act.image} alt={act.activity_name} style={{ width: 52, height: 52, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} /> : <div style={{ width: 52, height: 52, borderRadius: 8, background: '#e2e8f0', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Compass size={20} className="text-slate-400" /></div>}
                <div style={{ flex: 1, fontSize: '0.85rem' }}>
                  <div style={{ fontWeight: 600, color: '#0f172a' }}>{act.activity_name}</div>
                  <div style={{ color: '#64748b', fontSize: '0.75rem', marginTop: 2 }}>{TIME_LABEL[act.time_slot] || act.time_slot} · {act.duration_minutes ? `${Math.round(act.duration_minutes / 60)}h ${act.duration_minutes % 60}m` : 'flexible'}{act.travel_time_min ? ` · ${act.travel_time_min} min transfer` : ''}</div>
                  {act.rating ? <div style={{ color: '#d97706', fontSize: '0.75rem', marginTop: 2 }}><Star size={11} style={{ display: 'inline', marginRight: 3 }} />{act.rating} · {act.description?.slice(0, 80)}</div> : <div style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: 2 }}>{act.description}</div>}
                </div>
                <div style={{ fontWeight: 700, color: '#059669', fontSize: '0.9rem', whiteSpace: 'nowrap' }}>${act.estimated_price}</div>
              </div>
            ))}
          </div>
        ))}

        {/* Budget summary */}
        <div style={{ padding: '12px', borderRadius: '10px', border: `2px solid ${b.within_budget ? '#10b981' : '#ef4444'}`, background: b.within_budget ? '#ecfdf5' : '#fef2f2', marginBottom: 12 }}>
          <div style={{ fontWeight: 800, fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: 6, color: b.within_budget ? '#047857' : '#b91c1c' }}>
            <Wallet size={15} /> Budget Check: ${b.total_cost} vs ${itinerary.stated_budget}
            {b.within_budget ? ' ✅ Within budget' : ` ⚠️ Over by $${b.over_by}`}
          </div>
          <div style={{ fontSize: '0.8rem', color: b.within_budget ? '#059669' : '#dc2626', marginTop: 4 }}>
            {b.within_budget ? `${b.remaining ? `$${b.remaining} to spare for upgrades or shopping.` : 'Budget fully utilized.'}` : (b.savings_suggestions || []).map((s: string, i: number) => <div key={i}>• {s}</div>)}
          </div>
        </div>

        {/* Weather forecast */}
        {itinerary.weather?.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, fontSize: '0.85rem', marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6, color: '#475569' }}><CloudSun size={15} /> Live Weather Forecast</div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {itinerary.weather.map((w: any, i: number) => (
                <div key={i} style={{ flex: '1 1 90px', textAlign: 'center', padding: '8px', background: '#e0f2fe', borderRadius: 8, border: '1px solid #bae6fd' }}>
                  <div style={{ fontSize: '0.7rem', color: '#0369a1', fontWeight: 700 }}>{w.date.slice(5)}</div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 800, color: '#0f172a' }}>{w.temp_max}°C</div>
                  <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{w.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function RecommendationsCard({ recommendations }: { recommendations: any[] }) {
  if (!recommendations?.length) return null;
  return (
    <div style={{ width: '100%', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.08)' }}>
      <div style={{ padding: '12px 16px', background: '#fffbeb', borderBottom: '1px solid #fde68a', fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6, color: '#92400e' }}>
        <UtensilsCrossed size={15} /> More Live Experiences to Book
      </div>
      <div style={{ padding: '12px' }}>
        {recommendations.map((r: any, i: number) => (
          <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < recommendations.length - 1 ? '1px dashed #e2e8f0' : 'none' }}>
            {r.image ? <img src={r.image} alt={r.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: 'cover', flexShrink: 0 }} /> : <div style={{ width: 48, height: 48, borderRadius: 8, background: '#f1f5f9', flexShrink: 0 }} />}
            <div style={{ flex: 1, fontSize: '0.8rem' }}>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>
                {r.name} <span style={{ fontSize: '0.7rem', color: '#059669' }}>{r.price_range}</span>
              </div>
              <div style={{ color: '#64748b', fontSize: '0.72rem', marginTop: 2 }}>{r.description}</div>
              <div style={{ color: '#d97706', fontSize: '0.72rem', marginTop: 2 }}><Star size={10} style={{ display: 'inline', marginRight: 3 }} />{r.rating}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BookingIntentCard({ intent }: { intent: any }) {
  if (!intent) return null;
  return (
    <div style={{ width: '100%', background: '#ffffff', borderRadius: '12px', border: '2px solid #38bdf8', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
      <div style={{ background: '#e0f2fe', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd' }}>
        <div style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={16} /> Booking Intent (Draft)</div>
        <div style={{ fontSize: '0.78rem', color: '#0369a1' }}>No payment taken yet</div>
      </div>
      <div style={{ padding: '14px 16px' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{intent.tour_title}</div>
        <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: 4 }}>
          {intent.date} · {intent.travelers} × {intent.option_name} (${intent.unit_price})
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 12, borderTop: '2px dashed #cbd5e1', fontWeight: 800, fontSize: '1rem' }}>
          <span>Total incl. platform fee:</span>
          <span>${intent.total} {intent.currency}</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginTop: 4 }}>Supplier payout ${intent.supplier_payout} · Platform fee ${intent.platform_fee}</div>
      </div>
    </div>
  );
}

export default function AIPlannerPage() {
  const [promptText, setPromptText] = useState('I want a 2-day getaway in Bali featuring a luxury catamaran sunset cruise, seafood buffet dinner, and local food exploration.');
  const [destination, setDestination] = useState('bali');
  const [maxBudget, setMaxBudget] = useState(250);
  const [itinerary, setItinerary] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  const [agentSessionId, setAgentSessionId] = useState<string | null>(null);
  const [agentMessages, setAgentMessages] = useState<any[]>([]);
  const [agentInput, setAgentInput] = useState('');
  const [agentWorking, setAgentWorking] = useState(false);
  const [agentSteps, setAgentSteps] = useState<any[]>([]);
  const [countdown, setCountdown] = useState<number>(0);

  const chatEndRef = useRef<HTMLDivElement>(null);

  const samplePrompts = [
    { label: '🗻 Mt. Fuji / Tokyo', prompt: 'Plan a 1-day Mount Fuji private tour from Tokyo for 2 people under $500 with Lake Kawaguchiko and Oishi Park', dest: 'tokyo' },
    { label: '🗻 Tokyo + Fuji 2-Day', prompt: 'Plan a 2-day Tokyo trip under $700 with the Mount Fuji private tour and hotel pickup', dest: 'tokyo' },
    { label: '🏔️ Pakistan', prompt: '4-day adventure in Hunza valley for a family of 4 under $400', dest: 'hunza' },
    { label: '🏛️ Paris', prompt: '3-day Paris itinerary focused on art and museums under $400', dest: 'paris' },
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

  useEffect(() => {
    fetchFromAPI('/ai/agent/session', { method: 'POST' }).then(res => {
      setAgentSessionId(res.sessionId);
      setAgentMessages([{ role: 'agent', content: 'Hi! I am Karvaan — your AI travel agent. I plan your trip using **live Supabase catalog data** (real inventory, real prices, no invented data), with live weather and route optimization. Describe your trip (destination, budget, days, travelers).' }]);
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

      if (res.steps && res.steps.length > 0) {
        for (const step of res.steps) {
          setAgentSteps(prev => [...prev, step]);
          await new Promise(r => setTimeout(r, 500));
        }
      }

      setAgentMessages(prev => [...prev, {
        role: 'agent',
        content: res.responseText,
        itinerary: res.itinerary,
        recommendations: res.recommendations,
        bookingIntent: res.bookingIntent,
        bundle: res.bundle,
      }]);

      if (res.bundle?.expiresAt) {
        setCountdown(Math.max(0, Math.floor((res.bundle.expiresAt - Date.now()) / 1000)));
      } else if (res.bundle) {
        setCountdown(10 * 60);
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

      <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 40px' }}>
        <div className="badge-amber animate-pulse-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <Sparkles size={14} /> Karvaan AI Travel Agent
        </div>
        <h1 style={{ fontSize: '3.2rem', marginBottom: '16px', color: '#0f172a', fontWeight: 800 }}>AI Trip Studio</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Plan itineraries, get live weather, route-optimized day plans, curated dining &amp; stays, and booking intent — all in one conversation with your AI agent.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>

        {/* LEFT COLUMN: AI TRIP PLANNER */}
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

        {/* RIGHT COLUMN: AI TRAVEL AGENT */}
        <div style={{ flex: '1', display: 'flex', flexDirection: 'column', height: '820px' }}>
          <div className="card-panel" style={{ flex: 1, display: 'flex', flexDirection: 'column', borderRadius: 'var(--radius-lg)', background: '#ffffff', border: '2px solid var(--brand-primary)', overflow: 'hidden' }}>

            <div style={{ padding: '20px', background: 'var(--brand-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Bot size={28} />
              <div>
                <h2 style={{ fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>Karvaan AI Travel Agent</h2>
                <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Function-calling agent · Live Supabase catalog · Real-time weather · Route optimization</div>
              </div>
            </div>

            <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '20px', background: '#f8fafc' }}>
              {agentMessages.map((msg, i) => (
                <div key={i} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '100%', width: msg.role === 'agent' ? '100%' : '85%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start', gap: 10 }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: '16px',
                    background: msg.role === 'user' ? 'var(--brand-primary)' : '#ffffff',
                    color: msg.role === 'user' ? '#ffffff' : '#0f172a',
                    border: msg.role === 'user' ? 'none' : '1px solid #e2e8f0',
                    borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                    borderBottomLeftRadius: msg.role === 'agent' ? '4px' : '16px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    lineHeight: 1.5,
                    whiteSpace: 'pre-wrap',
                    maxWidth: msg.role === 'user' ? '85%' : '100%'
                  }}>
                    {renderRichText(msg.content)}
                  </div>
                  {msg.role === 'agent' && msg.bookingIntent && <BookingIntentCard intent={msg.bookingIntent} />}
                  {msg.role === 'agent' && msg.itinerary && <ItineraryCard itinerary={msg.itinerary} />}
                  {msg.role === 'agent' && msg.recommendations && <RecommendationsCard recommendations={msg.recommendations} />}
                  {msg.role === 'agent' && msg.bundle && !msg.itinerary && (
                    <div style={{ width: '100%', background: '#ffffff', borderRadius: '12px', border: '2px solid #38bdf8', overflow: 'hidden', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
                      <div style={{ background: '#e0f2fe', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #bae6fd' }}>
                        <div style={{ fontWeight: 700, color: '#0369a1', display: 'flex', alignItems: 'center', gap: 6 }}><Zap size={16} /> Matched Experiences</div>
                        <div style={{ fontSize: '0.85rem', color: '#b91c1c', fontWeight: 700 }}>Hold expires in: {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}{countdown % 60}</div>
                      </div>
                      <div style={{ padding: '16px' }}>
                        {msg.bundle.items.map((item: any, j: number) => (
                          <div key={j} style={{ display: 'flex', gap: 12, marginBottom: 12, paddingBottom: 12, borderBottom: j < msg.bundle.items.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                            {item.img ? <img src={item.img} alt={item.title} style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }} /> : <div style={{ width: 60, height: 60, borderRadius: 8, background: '#f1f5f9', flexShrink: 0 }} />}
                            <div style={{ flex: 1 }}>
                              <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#0f172a' }}>{item.title}</div>
                              {item.rating ? <div style={{ fontSize: '0.75rem', color: '#d97706', marginTop: 2 }}><Star size={11} style={{ display: 'inline', marginRight: 3 }} />{item.rating}</div> : null}
                            </div>
                            <div style={{ fontWeight: 700, color: '#059669' }}>${item.price}</div>
                            <button onClick={(e) => { e.stopPropagation(); }} style={{ color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' }} title="Remove"><Trash2 size={16} /></button>
                          </div>
                        ))}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTop: '2px dashed #cbd5e1', fontWeight: 800, fontSize: '1.1rem' }}>
                          <span>Total:</span>
                          <span>${msg.bundle.totalPrice} {msg.bundle.currency}</span>
                        </div>
                        <button onClick={() => setAgentInput('Yes, confirm and book')} className="btn-primary" style={{ width: '100%', marginTop: 16, justifyContent: 'center', padding: 12 }}>
                          Confirm & Book All
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {agentSteps.length > 0 && (
                <div style={{ alignSelf: 'flex-start', maxWidth: '100%', background: '#f1f5f9', padding: '12px', borderRadius: '12px', border: '1px solid #cbd5e1', width: '100%' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Loader2 size={14} className="animate-spin" /> Agent working — Think → Act → Check...
                  </div>
                  {agentSteps.map((step, i) => (
                    <div key={i} style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', gap: '8px', marginBottom: '4px' }}>
                      <CheckCircle2 size={12} className="text-emerald-500" style={{ marginTop: '3px' }} />
                      <span><strong>{step.tool.replace(/_/g, ' ')}:</strong> {step.detail}</span>
                    </div>
                  ))}
                </div>
              )}

              <div ref={chatEndRef} />
            </div>

            <form onSubmit={handleAgentSend} style={{ padding: '20px', borderTop: '1px solid #e2e8f0', background: '#ffffff', display: 'flex', gap: '12px' }}>
              <input
                type="text"
                placeholder='e.g. "2-day Bali trip for 2 under $300 with a sunset cruise"'
                value={agentInput}
                onChange={(e) => setAgentInput(e.target.value)}
                disabled={agentWorking}
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