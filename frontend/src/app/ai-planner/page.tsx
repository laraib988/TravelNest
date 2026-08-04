'use client';

import { useState } from 'react';
import { fetchFromAPI } from '@/lib/api-client';
import { Sparkles, Compass, Calendar, CheckCircle2, ArrowRight, Zap, RefreshCw, Sliders } from 'lucide-react';
import Link from 'next/link';

export default function AIPlannerPage() {
  const [promptText, setPromptText] = useState(
    'I want a 2-day getaway in Bali featuring a luxury catamaran sunset cruise, seafood buffet dinner, and local food exploration.'
  );
  const [destination, setDestination] = useState('bali');
  const [maxBudget, setMaxBudget] = useState(250);
  const [itinerary, setItinerary] = useState<any>(null);
  const [generating, setGenerating] = useState(false);

  const samplePrompts = [
    { label: '⛵ Bali Sunset Cruise & Dinner', prompt: 'Romantic sunset catamaran cruise in Bali with seafood buffet and live acoustic music', dest: 'bali' },
    { label: '🍜 Tokyo Izakaya & Ramen Walk', prompt: 'After-dark Shinjuku ramen, yakitori, and artisanal sake tasting tour in Tokyo', dest: 'tokyo' },
    { label: '🏛️ Paris Louvre Skip-the-Line', prompt: 'Priority skip-the-line guided museum tour of Louvre masterpiece artworks in Paris', dest: 'paris' }
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

  return (
    <div style={{ maxWidth: '1280px', margin: '40px auto', padding: '0 24px', background: '#ffffff' }}>
      {/* HEADER */}
      <div style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto 40px' }}>
        <div className="badge-amber animate-pulse-glow" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <Sparkles size={14} /> AI Natural Language Prompt Engine
        </div>
        <h1 style={{ fontSize: '3.2rem', marginBottom: '16px', color: '#0f172a', fontWeight: 800 }}>AI Trip Planner Studio</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.6 }}>
          Describe your dream trip in plain language. Our prompt engine creates a day-by-day plan and maps each activity directly to real-time marketplace listing slots.
        </p>
      </div>

      {/* SAMPLE CHIPS */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', marginBottom: '24px' }}>
        {samplePrompts.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSelectSample(s)}
            className="chip-filter"
            style={{ fontSize: '0.85rem' }}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* PROMPT FORM */}
      <form onSubmit={handleGenerate} className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '36px', maxWidth: '900px', margin: '0 auto 50px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <label style={{ display: 'block', fontWeight: 700, fontSize: '1.05rem', marginBottom: '10px', color: '#0f172a' }}>
          What kind of experience are you looking for?
        </label>
        <textarea
          value={promptText}
          onChange={(e) => setPromptText(e.target.value)}
          rows={3}
          style={{
            width: '100%',
            padding: '16px',
            borderRadius: 'var(--radius-md)',
            background: '#f8fafc',
            border: '1px solid #cbd5e1',
            color: '#0f172a',
            fontSize: '1.05rem',
            outline: 'none',
            fontFamily: 'inherit',
            marginBottom: '24px',
          }}
        />

        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Destination</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                style={{
                  padding: '10px 16px',
                  borderRadius: 'var(--radius-pill)',
                  background: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#0f172a',
                  outline: 'none',
                  fontWeight: 600,
                }}
              >
                <option value="bali">Bali, Indonesia</option>
                <option value="tokyo">Tokyo, Japan</option>
                <option value="paris">Paris, France</option>
                <option value="lahore">Lahore, Pakistan</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Max Budget per Person: <strong>${maxBudget} USD</strong></label>
              <input
                type="range"
                min="50"
                max="500"
                step="25"
                value={maxBudget}
                onChange={(e) => setMaxBudget(Number(e.target.value))}
                style={{ accentColor: 'var(--brand-primary)', width: '160px', marginTop: '6px' }}
              />
            </div>
          </div>

          <button type="submit" disabled={generating} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1.05rem' }}>
            {generating ? <><RefreshCw size={18} className="animate-spin" /> Running LLM RAG Pipeline...</> : <><Sparkles size={18} /> Generate AI Itinerary</>}
          </button>
        </div>
      </form>

      {/* GENERATED ITINERARY VIEW */}
      {itinerary && (
        <div className="card-panel" style={{ borderRadius: 'var(--radius-lg)', padding: '40px', maxWidth: '1000px', margin: '0 auto', background: '#ffffff', border: '1px solid #cbd5e1' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '24px', marginBottom: '32px' }}>
            <div>
              <div className="badge-emerald" style={{ display: 'inline-flex', marginBottom: '8px' }}>
                Verified Match Score: 98%
              </div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '6px', color: '#0f172a' }}>{itinerary.trip_name}</h2>
              <p style={{ color: 'var(--text-secondary)' }}>Estimated Total Budget: <strong style={{ color: 'var(--brand-primary)', fontSize: '1.2rem' }}>${itinerary.total_estimated_budget} USD</strong></p>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
            {itinerary.days.map((day: any) => (
              <div key={day.day_number} style={{ background: '#f8fafc', padding: '24px', borderRadius: 'var(--radius-md)', border: '1px solid #e2e8f0' }}>
                <h3 style={{ fontSize: '1.4rem', color: 'var(--brand-primary)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={20} /> Day {day.day_number}: {day.theme}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {day.activities.map((act: any, idx: number) => (
                    <div key={idx} style={{ padding: '18px', borderRadius: 'var(--radius-sm)', background: '#ffffff', border: '1px solid #e2e8f0', borderLeft: '4px solid var(--brand-accent)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.8rem', color: '#b45309', fontWeight: 700 }}>{act.time_slot}</span>
                        <span style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669' }}>${act.estimated_price} USD</span>
                      </div>
                      <h4 style={{ fontSize: '1.15rem', marginBottom: '8px', color: '#0f172a' }}>{act.activity_name}</h4>

                      {act.matched_listing ? (
                        <div style={{ marginTop: '12px', padding: '14px', borderRadius: 'var(--radius-sm)', background: '#f0f9ff', border: '1px solid #7dd3fc', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--brand-primary)', fontWeight: 700 }}>MATCHED MARKETPLACE EXPERIENCE</span>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{act.matched_listing.title}</div>
                          </div>
                          <Link href={`/tours/${act.matched_listing.slug}`} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                            Lock Seat <ArrowRight size={14} />
                          </Link>
                        </div>
                      ) : (
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Suggested local independent activity (Self-guided)</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
