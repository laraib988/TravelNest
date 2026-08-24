'use client';
import { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { fetchFromAPI } from '@/lib/api-client';

export default function TourAskAIWidget({ tourId }: { tourId: string }) {
  const [aiQuestion, setAiQuestion] = useState('');
  const [aiAnswer, setAiAnswer] = useState('');
  const [askingAi, setAskingAi] = useState(false);

  const handleAskAI = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiQuestion.trim()) return;
    setAskingAi(true);
    try {
      const res = await fetchFromAPI('/ai/contextual-qa', {
        method: 'POST',
        body: JSON.stringify({ listing_id: tourId, question: aiQuestion }),
      });
      setAiAnswer(res.answer);
    } catch (err) {
      console.error(err);
    } finally {
      setAskingAi(false);
    }
  };

  return (
    <div className="card-panel" style={{ padding: '24px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <HelpCircle size={20} color="var(--brand-primary)" />
        <h3 style={{ fontSize: '1.2rem', color: '#0f172a' }}>Ask AI About This Experience</h3>
      </div>
      <form onSubmit={handleAskAI} style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
        <input
          type="text"
          placeholder="Ask anything (e.g. 'Is this suitable for kids?', 'What is the refund policy?')"
          value={aiQuestion}
          onChange={(e) => setAiQuestion(e.target.value)}
          style={{ flex: 1, padding: '12px', borderRadius: 'var(--radius-sm)', background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', outline: 'none' }}
        />
        <button type="submit" disabled={askingAi} className="btn-primary" style={{ padding: '12px 20px' }}>
          {askingAi ? 'Asking...' : 'Ask AI'}
        </button>
      </form>

      {aiAnswer && (
        <div style={{ padding: '14px', borderRadius: 'var(--radius-sm)', background: '#f0f9ff', border: '1px solid #7dd3fc', fontSize: '0.95rem', color: '#0369a1' }}>
          <strong>🤖 AI Concierge Answer:</strong> {aiAnswer}
        </div>
      )}
    </div>
  );
}
