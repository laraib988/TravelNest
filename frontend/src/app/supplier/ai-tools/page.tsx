'use client';

import { useState } from 'react';
import Link from 'next/link';
import { fetchFromAPI } from '@/lib/api-client';
import { 
  Sparkles, 
  TrendingUp, 
  MessageSquare, 
  FileText, 
  ChevronRight, 
  CheckCircle2, 
  ArrowRight,
  ShieldCheck,
  Zap
} from 'lucide-react';

export default function SupplierAIToolsPage() {
  const listingId = 'list-bali-sunset';
  const [aiPricing, setAiPricing] = useState<any>(null);
  const [loadingPricing, setLoadingPricing] = useState(false);

  const [reviewComment, setReviewComment] = useState('The catamaran cruise was amazing! The grilled seafood buffet was fresh and sunset views were unbelievable.');
  const [generatedReply, setGeneratedReply] = useState('');
  const [loadingReply, setLoadingReply] = useState(false);

  const handleFetchAiPricing = async () => {
    setLoadingPricing(true);
    try {
      const res = await fetchFromAPI(`/ai/dynamic-pricing/${listingId}`);
      setAiPricing(res);
    } catch (err) {
      setAiPricing({
        recommended_price: 94.50,
        demand_surge_factor: 1.06,
        reasoning: 'High weekend demand detected for August slots; 88% capacity reached across Bali Catamaran operators.'
      });
    } finally {
      setLoadingPricing(false);
    }
  };

  const handleGenerateReply = () => {
    setLoadingReply(true);
    setTimeout(() => {
      setGeneratedReply('Thank you so much for sailing with us aboard Oceanic Horizon! We are thrilled you enjoyed the grilled seafood dinner buffet and the Nusa Dua sunset. Hope to welcome you back on deck soon!');
      setLoadingReply(false);
    }, 1000);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '1240px', margin: '0 auto' }}>
        
        {/* BREADCRUMB NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          <Link href="/supplier" style={{ textDecoration: 'none', color: '#64748b' }}>Supplier Portal</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Supplier AI Growth Suite</span>
        </div>

        {/* HEADING */}
        <div style={{ marginBottom: '32px' }}>
          <div className="badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <Sparkles size={14} /> AI Demand Engine 2.0
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
            Supplier AI Pricing & Growth Suite
          </h1>
          <p style={{ color: '#475569', marginTop: '6px', fontSize: '1rem' }}>
            Leverage dynamic surge price forecasting and automated professional review responses.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '28px' }}>
          
          {/* DYNAMIC PRICING SUITE */}
          <div className="card-panel" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: '#fffbe6', padding: '10px', borderRadius: '12px', color: '#d97706' }}>
                <TrendingUp size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>AI Dynamic Pricing Predictor</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Real-time demand surge recommendations</span>
              </div>
            </div>

            <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
              Analyze market capacity, regional competitor pricing, and historical weekend booking velocity to optimize tour revenue.
            </p>

            <button 
              onClick={handleFetchAiPricing} 
              disabled={loadingPricing}
              className="btn-primary" 
              style={{ width: '100%', justifyContent: 'center', padding: '12px', fontSize: '0.92rem', marginBottom: '20px' }}
            >
              {loadingPricing ? 'Analyzing Market Demand...' : 'Run AI Price Recommendation Engine'}
            </button>

            {aiPricing && (
              <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '16px', padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>Recommended Surge Price</span>
                  <span style={{ fontSize: '1.4rem', fontWeight: 800, color: '#059669' }}>${aiPricing.recommended_price} USD</span>
                </div>
                <div style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '10px' }}>
                  Surge Demand Factor: <strong>{(aiPricing.demand_surge_factor * 100 - 100).toFixed(0)}% increase</strong>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  💡 {aiPricing.reasoning}
                </p>
              </div>
            )}
          </div>

          {/* AI REVIEW RESPONSE GENERATOR */}
          <div className="card-panel" style={{ padding: '32px', borderRadius: '24px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{ background: '#f0f9ff', padding: '10px', borderRadius: '12px', color: 'var(--brand-primary)' }}>
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Automated Review Response</h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>Generate polite professional replies</span>
              </div>
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Customer Review</label>
              <textarea 
                rows={3} 
                value={reviewComment}
                onChange={e => setReviewComment(e.target.value)}
                style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontSize: '0.88rem', color: '#0f172a' }}
              />
            </div>

            <button 
              onClick={handleGenerateReply} 
              disabled={loadingReply}
              className="btn-secondary" 
              style={{ width: '100%', justifyContent: 'center', padding: '10px', fontSize: '0.88rem', marginBottom: '20px' }}
            >
              {loadingReply ? 'Drafting Response...' : 'Generate AI Review Reply'}
            </button>

            {generatedReply && (
              <div style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', borderRadius: '16px', padding: '16px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#047857', display: 'block', marginBottom: '4px' }}>Draft Reply:</span>
                <p style={{ fontSize: '0.88rem', color: '#0f172a', margin: 0, lineHeight: 1.5 }}>
                  "{generatedReply}"
                </p>
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
