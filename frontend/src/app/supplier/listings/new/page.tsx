'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchFromAPI } from '@/lib/api-client';
import { 
  PlusCircle, 
  MapPin, 
  Ticket, 
  CheckCircle2, 
  Image as ImageIcon, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export default function CreateListingWizardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: 'Lahore Walled City Culinary Night Experience',
    category_id: 'cat-food',
    destination_id: 'dest-lahore',
    summary: 'Guided food walk through Delhi Gate & Fort Road Food Street with traditional dinner.',
    description: 'Immerse yourself in authentic Punjabi flavors. Led by a local culinary guide, visit historic food stalls and enjoy rooftop dining overlooking Badshahi Mosque.',
    address: 'Delhi Gate, Walled City, Lahore, Pakistan',
    latitude: 31.5822,
    longitude: 74.3283,
    base_price: 35.00,
    variant_name: 'Adult Standard Ticket',
    duration_hours: 4,
    inclusions: 'Guided tour, Rickshaw ride, rooftop dinner, tea',
    exclusions: 'Personal tips, souvenirs',
    know_before_you_go: 'Modest dress required for religious sites.',
    image_url: 'https://images.unsplash.com/photo-1622547748225-3fc4abd2cca0?auto=format&fit=crop&w=1000&q=80',
    confirmation_type: 'INSTANT',
    cancellation_policy: 'FREE_24H'
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNextStep = () => {
    if (step < 6) setStep(step + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmitListing = async () => {
    setSubmitting(true);
    try {
      // Simulate API call to create listing
      setTimeout(() => {
        setSubmitting(false);
        alert('Listing published successfully! It is now live on TravelNest Marketplace.');
        router.push('/supplier');
      }, 1200);
    } catch (err: any) {
      alert('Error creating listing: ' + err.message);
      setSubmitting(false);
    }
  };

  const stepsList = [
    { num: 1, label: 'Basic Info' },
    { num: 2, label: 'Location' },
    { num: 3, label: 'Tickets & Prices' },
    { num: 4, label: 'Inclusions' },
    { num: 5, label: 'Photos' },
    { num: 6, label: 'Policies' }
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#0f172a', padding: '40px 24px 80px', fontFamily: 'var(--font-body)' }}>
      <div style={{ maxWidth: '960px', margin: '0 auto' }}>
        
        {/* BREADCRUMB NAV */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          <Link href="/supplier" style={{ textDecoration: 'none', color: '#64748b' }}>Supplier Portal</Link>
          <ChevronRight size={14} color="#94a3b8" />
          <span style={{ color: '#0f172a', fontWeight: 700 }}>Listing Creation Wizard</span>
        </div>

        {/* PAGE HEADING */}
        <div style={{ marginBottom: '32px' }}>
          <div className="badge-emerald" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '12px' }}>
            <PlusCircle size={14} /> 6-Step Experience Creator
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0f172a', margin: 0, lineHeight: 1.2 }}>
            Publish New Experience Listing
          </h1>
          <p style={{ color: '#475569', marginTop: '6px', fontSize: '1rem' }}>
            Provide activity details, ticket variants, inclusions, and confirmation SLA rules.
          </p>
        </div>

        {/* WIZARD STEP INDICATOR BAR */}
        <div className="card-panel" style={{ padding: '20px 28px', borderRadius: '20px', marginBottom: '32px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          {stepsList.map(s => (
            <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div 
                style={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  background: step >= s.num ? 'var(--brand-primary)' : '#e2e8f0', 
                  color: step >= s.num ? '#ffffff' : '#64748b', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.85rem'
                }}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: step === s.num ? 800 : 600, color: step === s.num ? '#0f172a' : '#64748b' }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* FORM CONTAINER */}
        <div className="card-panel" style={{ padding: '36px', borderRadius: '24px' }}>
          
          {/* STEP 1: BASIC INFO */}
          {step === 1 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Step 1: Experience Title & Overview</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Listing Title</label>
                  <input 
                    type="text" 
                    value={formData.title} 
                    onChange={e => handleChange('title', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Category</label>
                    <select value={formData.category_id} onChange={e => handleChange('category_id', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}>
                      <option value="cat-tours">Tours & Day Trips</option>
                      <option value="cat-food">Food & Dining</option>
                      <option value="cat-tickets">Attraction Tickets</option>
                      <option value="cat-adventure">Adventure & Outdoor</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Destination</label>
                    <select value={formData.destination_id} onChange={e => handleChange('destination_id', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}>
                      <option value="dest-lahore">Lahore, Pakistan</option>
                      <option value="dest-bali">Bali, Indonesia</option>
                      <option value="dest-tokyo">Tokyo, Japan</option>
                      <option value="dest-paris">Paris, France</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Short Summary (Card Preview)</label>
                  <textarea 
                    rows={2} 
                    value={formData.summary} 
                    onChange={e => handleChange('summary', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 500, color: '#0f172a' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: LOCATION */}
          {step === 2 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Step 2: Meeting Point & Map Location</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Full Meeting Address</label>
                  <input 
                    type="text" 
                    value={formData.address} 
                    onChange={e => handleChange('address', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Map Latitude</label>
                    <input 
                      type="number" 
                      step="0.0001" 
                      value={formData.latitude} 
                      onChange={e => handleChange('latitude', parseFloat(e.target.value))}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Map Longitude</label>
                    <input 
                      type="number" 
                      step="0.0001" 
                      value={formData.longitude} 
                      onChange={e => handleChange('longitude', parseFloat(e.target.value))}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: TICKETS & PRICING */}
          {step === 3 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Step 3: Variant Pricing & Duration</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Base Price ($ USD)</label>
                    <input 
                      type="number" 
                      value={formData.base_price} 
                      onChange={e => handleChange('base_price', parseFloat(e.target.value))}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Duration (Hours)</label>
                    <input 
                      type="number" 
                      value={formData.duration_hours} 
                      onChange={e => handleChange('duration_hours', parseInt(e.target.value))}
                      style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Default Ticket Variant Name</label>
                  <input 
                    type="text" 
                    value={formData.variant_name} 
                    onChange={e => handleChange('variant_name', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: INCLUSIONS & RULES */}
          {step === 4 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Step 4: Inclusions & Important Rules</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>What's Included</label>
                  <textarea 
                    rows={2} 
                    value={formData.inclusions} 
                    onChange={e => handleChange('inclusions', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 500, color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>What's Excluded</label>
                  <textarea 
                    rows={2} 
                    value={formData.exclusions} 
                    onChange={e => handleChange('exclusions', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 500, color: '#0f172a' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Know Before You Go Rules</label>
                  <textarea 
                    rows={2} 
                    value={formData.know_before_you_go} 
                    onChange={e => handleChange('know_before_you_go', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 500, color: '#0f172a' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PHOTOS */}
          {step === 5 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Step 5: High-Res Hero Photo</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Unsplash Photo URL</label>
                  <input 
                    type="text" 
                    value={formData.image_url} 
                    onChange={e => handleChange('image_url', e.target.value)}
                    style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}
                  />
                </div>
                <div style={{ height: '220px', borderRadius: '16px', overflow: 'hidden', border: '1px solid #cbd5e1' }}>
                  <img src={formData.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: POLICIES & PUBLISH */}
          {step === 6 && (
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px' }}>Step 6: Confirmation SLA & Cancellation Policy</h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Booking Confirmation Type</label>
                  <select value={formData.confirmation_type} onChange={e => handleChange('confirmation_type', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}>
                    <option value="INSTANT">Instant Auto-Confirmation (QR Voucher Instant Delivery)</option>
                    <option value="REQUEST_BASED_24H_SLA">Manual 24-Hour SLA Request (Accept/Reject manually)</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.88rem', fontWeight: 700, color: '#334155', marginBottom: '6px' }}>Cancellation Policy</label>
                  <select value={formData.cancellation_policy} onChange={e => handleChange('cancellation_policy', e.target.value)} style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #cbd5e1', outline: 'none', fontWeight: 600, color: '#0f172a' }}>
                    <option value="FREE_24H">Free Cancellation up to 24 hours before activity</option>
                    <option value="NON_REFUNDABLE">Non-refundable listing</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* WIZARD NAVIGATION CONTROLS */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '36px', paddingTop: '20px', borderTop: '1px solid #e2e8f0' }}>
            {step > 1 ? (
              <button onClick={handlePrevStep} className="btn-secondary" style={{ padding: '10px 20px', fontSize: '0.9rem' }}>
                <ArrowLeft size={16} /> Previous Step
              </button>
            ) : <div />}

            {step < 6 ? (
              <button onClick={handleNextStep} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.9rem' }}>
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button onClick={handleSubmitListing} disabled={submitting} className="btn-primary" style={{ padding: '12px 28px', fontSize: '1rem', fontWeight: 700 }}>
                {submitting ? 'Publishing Listing...' : 'Publish Listing Live'}
              </button>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
