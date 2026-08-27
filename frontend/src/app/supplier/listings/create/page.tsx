'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import dynamic from 'next/dynamic';
const ServiceAreaMap = dynamic(() => import('@/app/supplier/map/ServiceAreaMap').then(m => m.ServiceAreaMap), {
  ssr: false,
  loading: () => <div style={{ height: 400, background: '#f8fafc', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Loading Map...</div>
});

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Check, ChevronRight, Save, Trash2, Plus, ChevronLeft } from 'lucide-react';
import languagesList from '@/lib/languages.json';


const STEPS = ['Basic Info', 'Photos', 'Experience', 'Transport & Pricing', 'Logistics', 'Itinerary', 'FAQs', 'Review'];

export default function CreateListingPage() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [productId, setProductId] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Step 1 State
  const [basicInfo, setBasicInfo] = useState({
    title: '',
    category: '',
    sellingPoints: '',
    shortDescription: '',
    summary: '',
    highlights: ['', ''],
    photos: []
  });

  // Step 2 State (Photos)
  const [uploadingImage, setUploadingImage] = useState(false);
  const [photos, setPhotos] = useState({
    heroImage: null as any,
    gallery: [] as any[]
  });

  // Step 3 State
  const [experienceDetails, setExperienceDetails] = useState({
    guideType: '',
    activityType: '',
    language: [] as string[],
    accessibility: {
      wheelchair: false,
      serviceAnimal: false,
      infantSeat: false,
      stroller: false
    },
    thingsToCarry: [] as string[],
    included: '',
    excluded: '',
    faqs: [] as { question: string, answer: string }[]
  });

  // Step 3 State (Transport & Pricing)
  const [transportOptions, setTransportOptions] = useState<any[]>([]);
  const [currentTransport, setCurrentTransport] = useState({
    title: '',
    transportType: '',
    makeVariant: '',
    attributes: [] as string[],
    travellers: '',
    pricingType: '',
    amount: '',
    duration: '',
    availableUnits: ''
  });

  // Step 4 State (Logistics)
  const [logistics, setLogistics] = useState({
    pickupLocation: '',
    dropOffSameAsPickup: false,
    dropOffLocation: '',
    pickupLocationMap: null as { lat: number; lng: number } | null,
    serviceArea: 'none' as 'none' | 'custom' | 'radius' | 'polygon',
    pickupLocations: [] as string[],
    availability: [] as string[],
    timeFrameFrom: '',
    timeFrameTo: '',
    bookingType: 'Instant Confirmation',
    paymentOption: 'Pay Now',
    timeInterval: '30'
  });

  // Step 5 State (Itinerary)
  const [itinerary, setItinerary] = useState<any[]>([]);
  const [currentItinerary, setCurrentItinerary] = useState({
    locationName: '',
    description: '',
    attractionType: '',
    timeToSpend: '',
    hasEntryFee: false,
    entryFeeAmount: '',
    images: [], dayNumber: 1 });

  // State to prevent autosave before initial fetch completes
  const [isInitialLoad, setIsInitialLoad] = useState(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search).has('id');
    }
    return false;
  });

  // Load existing listing if editing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const id = urlParams.get('id');
      if (id && user && !productId) {
        setProductId(id);
        fetch(`/api/supplier/listings/${id}?userId=${user.id}`)
          .then(res => res.json())
          .then(data => {
            if (data && !data.error) {
              setBasicInfo(prev => ({ ...prev, ...(data.basic_info || {}) }));
              setPhotos(prev => ({ ...prev, ...(data.basic_info?.photos || {}) }));
              const langData = data.experience_details?.language;
                const languageArr = Array.isArray(langData) ? langData : (typeof langData === 'string' && langData ? [langData] : []);
                setExperienceDetails(prev => ({ ...prev, ...(data.experience_details || {}), language: languageArr, faqs: data.experience_details?.faqs || [] }));
              setTransportOptions(data.transport_pricing || transportOptions);
              setLogistics(prev => ({ ...prev, ...(data.logistics || {}) }));
              setItinerary(data.itinerary || itinerary);
              setCurrentStep(data.current_step || 1);
            }
            setIsInitialLoad(false);
          })
          .catch(err => {
            console.error('Error fetching listing:', err);
            setIsInitialLoad(false);
          });
      }
    }
  }, [user]);

  // Auto-Save Logic with Debounce
  const saveDraft = useCallback(async () => {
    if (!user || isInitialLoad) return { success: false };
    setSaveStatus('saving');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    try {
      const res = await fetch('/api/supplier/listings/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          userId: user.id,
          productId,
          step: currentStep,
          basic_info: basicInfo,
          photos: photos,
          experience_details: experienceDetails,
          transport_pricing: transportOptions,
          logistics: logistics,
          itinerary: itinerary
        })
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (res.ok && data.success) {
        if (!productId || data.cloned) {
          setProductId(data.data.id);
          // If we just created a clone, update the URL so a refresh keeps the new draft
          window.history.replaceState({}, '', `/supplier/listings/create?id=${data.data.id}`);
        }
        setSaveStatus('saved');
        return { success: true, id: data.data.id };
      } else {
        setSaveStatus('error');
        return { success: false, error: data.error };
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      setSaveStatus('error');
      return { success: false, error: e.name === 'AbortError' ? 'Network timeout: Request took too long (Dev server might be compiling)' : e.message };
    }
  }, [user, isInitialLoad, productId, currentStep, basicInfo, photos, experienceDetails, transportOptions, logistics, itinerary]);

  // Save current form as draft when publish fails
  const saveDraftAsDrift = useCallback(async () => {
    if (!user || isInitialLoad) return;
    setSaveStatus('saving');
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);
    try {
      const res = await fetch('/api/supplier/listings/autosave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          userId: user.id,
          productId: productId || '',
          step: currentStep,
          basic_info: basicInfo,
          photos: photos,
          experience_details: experienceDetails,
          transport_pricing: transportOptions,
          logistics: logistics,
          itinerary: itinerary
        })
      });
      clearTimeout(timeoutId);
      const data = await res.json();
      if (res.ok && data.success) {
        setSaveStatus('saved');
      } else {
        setSaveStatus('error');
      }
    } catch (e: any) {
      clearTimeout(timeoutId);
      setSaveStatus('error');
    }
  }, [user, isInitialLoad, productId, currentStep, basicInfo, photos, experienceDetails, transportOptions, logistics, itinerary]);

  useEffect(() => {
    const handler = setTimeout(() => {
      saveDraft();
    }, 2000); // Wait 2s after typing to auto-save
    return () => clearTimeout(handler);
  }, [basicInfo, photos, experienceDetails, transportOptions, logistics, itinerary, currentStep, saveDraft]);

  
  const validateCurrentStep = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;
    
    switch (currentStep) {
      case 1:
        if (!basicInfo.title.trim()) { newErrors.title = 'Please enter Product Title'; isValid = false; }
        if (!basicInfo.category) { newErrors.category = 'Please select a Category'; isValid = false; }
        if (!basicInfo.sellingPoints) { newErrors.sellingPoints = 'Please select a Selling Point'; isValid = false; }
        if (!basicInfo.shortDescription.trim()) { newErrors.shortDescription = 'Please enter a Description'; isValid = false; }
        const hasHighlights = basicInfo.highlights.some(h => h.trim().length > 0);
        if (!hasHighlights) { newErrors.highlights = 'Please add at least one Highlight'; isValid = false; }
        break;
      case 2:
        break;
      case 3:
        if (!experienceDetails.guideType) { newErrors.guideType = 'Please select a Guide Type'; isValid = false; }
        if (!experienceDetails.activityType) { newErrors.activityType = 'Please select an Activity Type'; isValid = false; }
        if (!experienceDetails.language || experienceDetails.language.length === 0) { newErrors.language = 'Please select at least one Language'; isValid = false; }
        break;
      case 4:
        if (transportOptions.length === 0) { newErrors.transportOptions = 'Please add at least one Pricing/Transport Option'; isValid = false; }
        break;
      case 5:
        
        if (logistics.availability.length === 0) { newErrors.availability = 'Please select at least one Available Day'; isValid = false; }
        if (!logistics.timeFrameFrom || !logistics.timeFrameTo) { newErrors.timeFrame = 'Please select a valid Time Frame'; isValid = false; }
        break;
      case 6:
        if (itinerary.length === 0) { newErrors.itinerary = 'Please add at least one Itinerary stop'; isValid = false; }
        break;
      case 7:
        if (experienceDetails.faqs.length === 0) { newErrors.faqs = 'Please add at least one FAQ'; isValid = false; }
        break;
    }
    
    setErrors(newErrors);
    return isValid;
  };

  const updateHighlight = (index: number, val: string) => {
    if (val.length > 60) return;
    const newH = [...basicInfo.highlights];
    newH[index] = val;
    setBasicInfo({ ...basicInfo, highlights: newH });
  };

  const addHighlight = () => {
    setBasicInfo({ ...basicInfo, highlights: [...basicInfo.highlights, ''] });
  };

  const removeHighlight = (index: number) => {
    const newH = basicInfo.highlights.filter((_, i) => i !== index);
    setBasicInfo({ ...basicInfo, highlights: newH });
  };

  const toggleThingToCarry = (item: string) => {
    if (experienceDetails.thingsToCarry.includes(item)) {
      setExperienceDetails(prev => ({ ...prev, thingsToCarry: prev.thingsToCarry.filter(i => i !== item) }));
    } else {
      setExperienceDetails(prev => ({ ...prev, thingsToCarry: [...prev.thingsToCarry, item] }));
    }
  };

  const toggleTransportAttribute = (attr: string) => {
    if (currentTransport.attributes.includes(attr)) {
      setCurrentTransport(prev => ({ ...prev, attributes: prev.attributes.filter(a => a !== attr) }));
    } else {
      setCurrentTransport(prev => ({ ...prev, attributes: [...prev.attributes, attr] }));
    }
  };

  const saveTransportOption = () => {
    if (!currentTransport.title || !currentTransport.amount) return;
    setTransportOptions([...transportOptions, { ...currentTransport, id: Date.now().toString() }]);
    setCurrentTransport({ title: '', transportType: '', makeVariant: '', attributes: [], travellers: '', pricingType: '', amount: '', duration: '', availableUnits: '' });
  };

  const removeTransportOption = (id: string) => {
    setTransportOptions(transportOptions.filter(t => t.id !== id));
  };

  const toggleAvailability = (day: string) => {
    if (logistics.availability.includes(day)) {
      setLogistics(prev => ({ ...prev, availability: prev.availability.filter(d => d !== day) }));
    } else {
      setLogistics(prev => ({ ...prev, availability: [...prev.availability, day] }));
    }
  };

  const saveItineraryItem = () => {
    if (!currentItinerary.locationName) return;
    setItinerary([...itinerary, { ...currentItinerary, id: Date.now().toString() }]);
    setCurrentItinerary({ locationName: '', description: '', attractionType: '', timeToSpend: '', hasEntryFee: false, entryFeeAmount: '', images: [], dayNumber: currentItinerary.dayNumber || 1 });
  };

  const removeItineraryItem = (id: string) => {
    setItinerary(itinerary.filter(i => i.id !== id));
  };


  const uploadImageToCloudinary = async (fileOrUrl: File | string) => {
    setUploadingImage(true);
    try {
      const formData = new FormData();
      if (typeof fileOrUrl === 'string') {
        formData.append('url', fileOrUrl);
      } else {
        formData.append('file', fileOrUrl);
      }
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.url) {
        return data.url;
      } else {
        throw new Error(data.error || 'Upload failed');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to upload image to Cloudinary. Please try again.');
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean) => {
    const files = e.target.files;
    if (!files) return;
    
    // Check sizes
    for (let i = 0; i < files.length; i++) {
      if (files[i].size > 2 * 1024 * 1024) {
        alert('File size must be under 2MB.');
        return;
      }
    }

    if (isHero) {
      const url = await uploadImageToCloudinary(files[0]);
      if (url) setPhotos(prev => ({ ...prev, heroImage: url }));
    } else {
      for (const f of Array.from(files)) {
        if (photos.gallery.filter(Boolean).length >= 4) break;
        const url = await uploadImageToCloudinary(f);
        if (url) setPhotos(prev => ({ ...prev, gallery: [...prev.gallery.filter(Boolean), url].slice(0, 4) }));
      }
    }
  };

  // Shared generic input style
  const inputStyle = { width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc', outline: 'none', transition: 'border 0.2s' };

  return (
    <div className="supplier-create-page" style={{ maxWidth: '1200px', width: '100%', margin: '40px auto', padding: '0 24px' }}>
      <style dangerouslySetInnerHTML={{
        __html: `
          .supplier-create-layout {
            display: flex;
            gap: 40px;
            width: 100%;
          }
          .supplier-create-sidebar {
            width: 280px;
            flex-shrink: 0;
          }
          .supplier-create-sidebar-inner {
            background: #ffffff;
            border-radius: 24px;
            padding: 30px 24px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
            position: sticky;
            top: 120px;
          }
          .supplier-create-content {
            flex: 1;
            min-width: 0;
            width: 100%;
            background: #ffffff;
            border-radius: 24px;
            padding: 40px;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 20px rgba(0,0,0,0.03);
          }
          
          /* RESPONSIVE OVERRIDES */
          @media (max-width: 900px) {
            .supplier-create-layout {
              flex-direction: column;
            }
            .supplier-create-sidebar {
              width: 100%;
            }
            .supplier-create-sidebar-inner {
              position: static;
              display: flex;
              flex-wrap: wrap;
              gap: 12px;
              padding: 20px;
            }
            .supplier-create-sidebar-inner > div {
              margin-bottom: 0 !important;
              padding: 8px 16px;
              background: #f8fafc;
              border-radius: 100px;
            }
          }
          
          @media (max-width: 768px) {
            /* Force all multi-column inline grids to 1 column on mobile */
            .supplier-create-content div[style*="display: grid"],
            .supplier-create-content div[style*="grid-template-columns"] {
              grid-template-columns: 1fr !important;
            }
            .supplier-create-content {
              padding: 20px;
            }
          }
        `
      }} />
      
      {/* HEADER & SAVING STATUS */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0', letterSpacing: '-0.02em' }}>Create Listing</h1>
          <p style={{ color: '#64748b', margin: 0, fontSize: '1.05rem' }}>Auto-saving your progress as you type.</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: saveStatus === 'saving' ? '#d97706' : saveStatus === 'saved' ? '#10b981' : '#ef4444', fontWeight: 600, fontSize: '0.9rem', background: '#f8fafc', padding: '8px 16px', borderRadius: '100px', border: '1px solid #e2e8f0' }}>
          <Save size={16} /> {saveStatus === 'saving' ? 'Saving...' : saveStatus === 'saved' ? 'Draft Saved' : 'Save Error'}
        </div>
      </div>

      <div className="supplier-create-layout">
        
        {/* LEFT SIDEBAR STEPPER */}
        <div className="supplier-create-sidebar">
          <div className="supplier-create-sidebar-inner">
            {STEPS.map((step, idx) => {
              const stepNum = idx + 1;
              const isActive = currentStep === stepNum;
              const isPast = currentStep > stepNum;
              return (
                <div 
                  key={stepNum} 
                  onClick={() => isPast && setCurrentStep(stepNum)}
                  style={{ 
                    display: 'flex', alignItems: 'center', gap: '16px', 
                    marginBottom: idx === STEPS.length - 1 ? 0 : '24px', 
                    opacity: isActive || isPast ? 1 : 0.5,
                    cursor: isPast ? 'pointer' : 'default',
                    transition: 'opacity 0.2s'
                  }}
                >
                  <div style={{ 
                    width: '32px', height: '32px', borderRadius: '50%', 
                    background: isActive ? '#0f172a' : isPast ? '#10b981' : '#f1f5f9',
                    color: isActive || isPast ? '#ffffff' : '#64748b',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem',
                    flexShrink: 0
                  }}>
                    {isPast ? <Check size={16} /> : stepNum}
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: isActive ? 800 : 600, color: isActive ? '#0f172a' : '#64748b', whiteSpace: 'nowrap' }}>
                    {step}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT MAIN CONTENT AREA */}
        <div className="supplier-create-content">
          
          {currentStep === 1 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '30px' }}>Basic Information</h2>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Product Title <span style={{color: 'red'}}>*</span> {errors.title && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.title}</span>}</label>
                  <div style={{ position: 'relative' }}>
                    <input type="text" value={basicInfo.title} onChange={e => { if (e.target.value.length <= 70) setBasicInfo({...basicInfo, title: e.target.value}) }} placeholder="e.g. Kyoto 5-Day Cultural Immersion" style={{...inputStyle, paddingRight: '60px'}} />
                    <span style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>{basicInfo.title.length}/70</span>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Category <span style={{color: 'red'}}>*</span> {errors.category && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.category}</span>}</label>
                    <select value={basicInfo.category} onChange={e => setBasicInfo({...basicInfo, category: e.target.value})} style={inputStyle}>
                      <option value="">Select Category</option>
                      <option value="Cultural">Cultural Tour</option>
                      <option value="Adventure">Adventure</option>
                      <option value="Relaxation">Relaxation</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Selling Points <span style={{color: 'red'}}>*</span> {errors.sellingPoints && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.sellingPoints}</span>}</label>
                    <select value={basicInfo.sellingPoints} onChange={e => setBasicInfo({...basicInfo, sellingPoints: e.target.value})} style={inputStyle}>
                      <option value="">Select Point</option>
                      <option value="Best Seller">Best Seller</option>
                      <option value="Family Friendly">Family Friendly</option>
                      <option value="Luxury">Luxury</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Description <span style={{color: 'red'}}>*</span> {errors.shortDescription && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.shortDescription}</span>}</label>
                  <textarea 
                    value={basicInfo.shortDescription} 
                    onChange={e => setBasicInfo({...basicInfo, shortDescription: e.target.value})}
                    placeholder="Provide a comprehensive description of the tour..." 
                    style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                  />
                </div>

                <div style={{ marginTop: '20px', padding: '30px', background: '#f1f5f9', borderRadius: '16px' }}>
                  <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0' }}>Highlights <span style={{color: 'red'}}>*</span> {errors.highlights && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'normal'}}>{errors.highlights}</span>}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px', lineHeight: 1.5 }}>
                    Describe in 3-5 sentences what makes your activity unique and different from others. Highlight the special features or experiences that set it apart, so customers can easily compare and see why yours is the best choice.
                  </p>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {basicInfo.highlights.map((highlight, idx) => (
                      <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <input 
                            type="text" 
                            value={highlight}
                            onChange={(e) => updateHighlight(idx, e.target.value)}
                            placeholder="e.g. Chureito Pagoda and Lake Kawaguchi." 
                            style={{ 
                              width: '100%', padding: '14px 60px 14px 20px', borderRadius: '100px', 
                              border: '1px solid #cbd5e1', fontSize: '0.95rem', background: '#ffffff', outline: 'none'
                            }} 
                          />
                          <span style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>
                            {highlight.length}/60
                          </span>
                        </div>
                        {basicInfo.highlights.length > 2 && (
                          <button onClick={() => removeHighlight(idx)} style={{ padding: '10px', background: '#ffe4e6', color: '#e11d48', border: 'none', borderRadius: '50%', cursor: 'pointer', flexShrink: 0 }}>
                            <Trash2 size={16} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <div style={{ textAlign: 'right', marginTop: '16px' }}>
                    <button onClick={addHighlight} style={{ background: 'none', border: 'none', color: '#2563eb', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                      <Plus size={16} /> Add another highlights
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '30px' }}>Photos</h2>
              
              <div style={{ display: 'grid', gap: '30px' }}>
                <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0' }}>Hero Image</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>This is the main image customers will see. Make it count! (Max 2MB, any image format).</p>
                  
                  <div style={{ position: 'relative', height: '200px', border: '2px dashed #cbd5e1', borderRadius: '12px', background: photos.heroImage ? `url(${photos.heroImage}) center/cover` : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {uploadingImage ? <div style={{ color: '#0284c7', fontWeight: 600 }}>Uploading to Cloudinary...</div> : (!photos.heroImage && <div style={{ color: '#94a3b8', fontWeight: 600 }}>Click to upload Hero Image</div>)}
                    <input type="file" accept="image/*" onChange={(e) => handlePhotoUpload(e, true)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                  </div>
                  
                  <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Or paste image URL here (e.g. Unsplash) and press Enter" style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} onKeyDown={async (e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        const val = e.currentTarget.value.trim();
                        if (val) {
                          e.currentTarget.value = '';
                          const url = await uploadImageToCloudinary(val);
                          if (url) setPhotos(prev => ({ ...prev, heroImage: url }));
                        }
                      }
                    }} />
                    <button style={{ padding: '0 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={async (e) => {
                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                      if (input && input.value.trim()) {
                        const val = input.value.trim();
                        input.value = '';
                        const url = await uploadImageToCloudinary(val);
                        if (url) setPhotos(prev => ({ ...prev, heroImage: url }));
                      }
                    }}>Add URL</button>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 10px 0' }}>Gallery Images</h3>
                  <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '20px' }}>Upload additional images to show off your tour. (Max 4 images, 2MB per file).</p>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    {photos.gallery.filter(Boolean).map((src, i) => (
                      <div key={i} style={{ height: '120px', borderRadius: '12px', background: `url(${src}) center/cover`, position: 'relative' }}>
                        <button 
                          onClick={() => setPhotos(prev => ({...prev, gallery: prev.gallery.filter((_, idx) => idx !== i)}))}
                          style={{ position: 'absolute', top: '4px', right: '4px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', fontSize: '10px' }}
                        >✕</button>
                      </div>
                    ))}
                    {photos.gallery.filter(Boolean).length < 4 && (
                      <div style={{ position: 'relative', height: '120px', border: '2px dashed #cbd5e1', borderRadius: '12px', background: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', color: '#64748b' }}>
                        <Plus size={24} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, marginTop: '8px' }}>Add Photos</span>
                        <input type="file" accept="image/*" multiple onChange={(e) => handlePhotoUpload(e, false)} style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }} />
                      </div>
                    )}
                  </div>
                  {photos.gallery.filter(Boolean).length < 4 && (
                      <div style={{ marginTop: '16px', display: 'flex', gap: '10px' }}>
                        <input type="text" placeholder="Or paste image URL here and press Enter" style={{ flex: 1, padding: '12px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }} onKeyDown={async (e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const val = e.currentTarget.value.trim();
                            if (val) {
                              e.currentTarget.value = '';
                              const url = await uploadImageToCloudinary(val);
                              if (url) setPhotos(prev => ({ ...prev, gallery: [...prev.gallery.filter(Boolean), url].slice(0, 4) }));
                            }
                          }
                        }} />
                        <button style={{ padding: '0 20px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }} onClick={async (e) => {
                          const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                          if (input && input.value.trim()) {
                            const val = input.value.trim();
                            input.value = '';
                            const url = await uploadImageToCloudinary(val);
                            if (url) setPhotos(prev => ({ ...prev, gallery: [...prev.gallery.filter(Boolean), url].slice(0, 4) }));
                          }
                        }}>Add URL</button>
                      </div>
                    )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '30px' }}>Experience Details</h2>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Guide Type <span style={{color: 'red'}}>*</span> {errors.guideType && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.guideType}</span>}</label>
                    <select value={experienceDetails.guideType} onChange={e => setExperienceDetails({...experienceDetails, guideType: e.target.value})} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="Driver">Driver</option>
                      <option value="Guide">Guide</option>
                      <option value="Both">Both</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Activity Type <span style={{color: 'red'}}>*</span> {errors.activityType && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.activityType}</span>}</label>
                    <select value={experienceDetails.activityType} onChange={e => setExperienceDetails({...experienceDetails, activityType: e.target.value})} style={inputStyle}>
                      <option value="">Select</option>
                      <option value="Private">Private</option>
                      <option value="Customized">Customized</option>
                      <option value="Shared">Shared</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Language <span style={{color: 'red'}}>*</span> {errors.language && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.language}</span>}</label>
                    <div style={{ position: 'relative' }}>
  <details style={{ width: '100%', padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc', outline: 'none', transition: 'border 0.2s', cursor: 'pointer', boxSizing: 'border-box' }}>
    <summary style={{ listStyle: 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 600, color: '#334155' }}>
      {Array.isArray(experienceDetails.language) && experienceDetails.language.length > 0 ? experienceDetails.language.join(', ') : 'Select Languages...'}
      <ChevronRight size={18} style={{ transform: 'rotate(90deg)' }} />
    </summary>
    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#ffffff', border: '1px solid #cbd5e1', borderRadius: '12px', marginTop: '4px', zIndex: 100, maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
      {languagesList.map(lang => (
        <label key={lang} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9', background: Array.isArray(experienceDetails.language) && experienceDetails.language.includes(lang) ? '#eff6ff' : 'transparent', width: '100%' }}>
          <input type="checkbox" checked={Array.isArray(experienceDetails.language) && experienceDetails.language.includes(lang)} onChange={(e) => {
            if (e.target.checked) {
              setExperienceDetails({...experienceDetails, language: [...(Array.isArray(experienceDetails.language) ? experienceDetails.language : []), lang]});
            } else {
              setExperienceDetails({...experienceDetails, language: (Array.isArray(experienceDetails.language) ? experienceDetails.language : []).filter(l => l !== lang)});
            }
          }} style={{ width: '18px', height: '18px', accentColor: '#3b82f6' }} />
          <span style={{ fontSize: '1rem', color: '#1e293b' }}>{lang}</span>
        </label>
      ))}
    </div>
  </details>
</div>
                  </div>
                </div>

                <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '16px', fontSize: '1.1rem' }}>Accessibility & Comfort</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {Object.entries(experienceDetails.accessibility).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', background: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <span style={{ fontWeight: 600, color: '#334155', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <div 
                          onClick={() => setExperienceDetails(prev => ({ ...prev, accessibility: { ...prev.accessibility, [key]: !value } }))}
                          style={{ width: '44px', height: '24px', background: value ? '#10b981' : '#cbd5e1', borderRadius: '100px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s' }}
                        >
                          <div style={{ width: '20px', height: '20px', background: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', left: value ? '22px' : '2px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ position: 'relative' }}>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Things to Carry</label>
                  <div style={{ padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', background: '#f8fafc', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                    {['Passport', 'Comfortable Shoes', 'Camera', 'Sunscreen', 'Umbrella'].map(item => {
                      const isSelected = experienceDetails.thingsToCarry.includes(item);
                      return (
                        <div 
                          key={item}
                          onClick={() => toggleThingToCarry(item)}
                          style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px', borderRadius: '8px', background: isSelected ? '#eff6ff' : 'transparent' }}
                        >
                          <div style={{ width: '20px', height: '20px', borderRadius: '4px', border: '2px solid', borderColor: isSelected ? '#2563eb' : '#cbd5e1', background: isSelected ? '#2563eb' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {isSelected && <Check size={14} color="#fff" strokeWidth={3} />}
                          </div>
                          <span style={{ color: isSelected ? '#1e3a8a' : '#334155', fontWeight: 600 }}>{item}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>What's Included</label>
                    <textarea 
                      value={experienceDetails.included} 
                      onChange={e => setExperienceDetails({...experienceDetails, included: e.target.value})}
                      placeholder="e.g. Hotel pickup and drop-off, English speaking guide..." 
                      style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>What's Excluded</label>
                    <textarea 
                      value={experienceDetails.excluded} 
                      onChange={e => setExperienceDetails({...experienceDetails, excluded: e.target.value})}
                      placeholder="e.g. Gratuities, Food and drinks..." 
                      style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' }}
                    />
                  </div>
                </div>

              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '30px' }}>Transport & Pricing Options</h2>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 20px 0' }}>Add Vehicle / Pricing Option</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Title of Option</label>
                      <input type="text" value={currentTransport.title} onChange={e => setCurrentTransport({...currentTransport, title: e.target.value})} placeholder="e.g. Standard Van Package" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Transportation Type</label>
                      <select value={currentTransport.transportType} onChange={e => setCurrentTransport({...currentTransport, transportType: e.target.value})} style={inputStyle}>
                        <option value="">Select Type</option>
                        <option value="Car">Car</option>
                        <option value="Van">Van</option>
                        <option value="Bus">Bus</option>
                        <option value="Hiace">Hiace</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Make and Variant</label>
                      <select value={currentTransport.makeVariant} onChange={e => setCurrentTransport({...currentTransport, makeVariant: e.target.value})} style={inputStyle}>
                        <option value="">Select Year</option>
                        {Array.from({length: 26}, (_, i) => 2001 + i).reverse().map(year => (
                          <option key={year} value={year.toString()}>{year}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Number of Travellers</label>
                      <input type="number" value={currentTransport.travellers} onChange={e => setCurrentTransport({...currentTransport, travellers: e.target.value})} placeholder="e.g. 4" style={inputStyle} />
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Vehicle Attributes</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['Premium', 'Economy', 'Electric', 'Manual'].map(attr => (
                        <div 
                          key={attr}
                          onClick={() => toggleTransportAttribute(attr)}
                          style={{ 
                            padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                            background: currentTransport.attributes.includes(attr) ? '#0f172a' : '#ffffff',
                            color: currentTransport.attributes.includes(attr) ? '#ffffff' : '#64748b',
                            border: '1px solid', borderColor: currentTransport.attributes.includes(attr) ? '#0f172a' : '#cbd5e1'
                          }}
                        >
                          {attr}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Pricing Type</label>
                      <select value={currentTransport.pricingType} onChange={e => setCurrentTransport({...currentTransport, pricingType: e.target.value})} style={inputStyle}>
                        <option value="">Select</option>
                        <option value="Per Group">Per Group</option>
                        <option value="Per Person">Per Person</option>
                        <option value="Per Vehicle">Per Vehicle</option>
                        <option value="Hourly Rate">Hourly Rate</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Customer Price (USD)</label>
                      <div style={{ position: 'relative' }}>
                        <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>$</span>
                        <input type="number" min="1" value={currentTransport.amount} onChange={e => { const val = e.target.value.replace(/-/g, ''); setCurrentTransport({...currentTransport, amount: val}); }} placeholder="0.00" style={{...inputStyle, paddingLeft: '32px'}} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#0f172a', marginBottom: '8px' }}>Your Earnings (-15% fee)</label>
                      <div style={{ background: '#f1f5f9', padding: '14px 18px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '1rem', fontWeight: 800, color: '#334155' }}>
                        ${currentTransport.amount ? (parseFloat(currentTransport.amount) * 0.85).toFixed(2) : '0.00'}
                      </div>
                    </div>
                  </div>

                  {currentTransport.pricingType && (
                    <div style={{ marginBottom: '24px' }}>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>
                        {currentTransport.pricingType === 'Per Person' ? 'How many seats are available?' : 'How many vehicles are available?'}
                      </label>
                      <input 
                        type="number" 
                        value={currentTransport.availableUnits || ''} 
                        onChange={e => setCurrentTransport({...currentTransport, availableUnits: e.target.value})} 
                        placeholder="e.g. 10" 
                        style={{...inputStyle, maxWidth: '300px'}} 
                      />
                    </div>
                  )}

                  <div>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Tour Duration</label>
                    <select value={currentTransport.duration} onChange={e => setCurrentTransport({...currentTransport, duration: e.target.value})} style={{...inputStyle, maxWidth: '300px'}}>
                      <option value="">Select Duration</option>
                      {Array.from({length: 20}, (_, i) => `${i + 1} Hour${i > 0 ? 's' : ''}`).map(d => <option key={d} value={d}>{d}</option>)}
                      {Array.from({length: 5}, (_, i) => `${i + 1} Day${i > 0 ? 's' : ''}`).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>

                  <div style={{ marginTop: '24px', textAlign: 'right' }}>
                    <button 
                      onClick={saveTransportOption}
                      disabled={!currentTransport.title || !currentTransport.amount || parseFloat(currentTransport.amount) <= 0}
                      style={{ background: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: (!currentTransport.title || !currentTransport.amount || parseFloat(currentTransport.amount) <= 0) ? 'not-allowed' : 'pointer', opacity: (!currentTransport.title || !currentTransport.amount || parseFloat(currentTransport.amount) <= 0) ? 0.5 : 1 }}
                    >
                      Save Option
                    </button>
                  </div>
                </div>

                {transportOptions.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Saved Options</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {transportOptions.map(opt => (
                        <div key={opt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }}>
                          <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{opt.title}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '12px' }}>
                              <span>{opt.transportType} • {opt.makeVariant}</span>
                              <span>{opt.travellers} Travellers</span>
                              <span>{opt.duration}</span>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                            <div style={{ textAlign: 'right' }}>
                              <div style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>Your Earnings ({opt.pricingType})</div>
                              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>${(parseFloat(opt.amount) * 0.85).toFixed(2)}</div>
                            </div>
                            <button onClick={() => removeTransportOption(opt.id)} style={{ padding: '10px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '30px' }}>Logistics & Availability</h2>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div>
                  
                  
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Pickup Area Map (Select center and radius)</label>
                  <ServiceAreaMap
                    productId={productId || ''}
                    initialCenter={logistics.pickupLocationMap ? [logistics.pickupLocationMap.lat, logistics.pickupLocationMap.lng] : [31.5, 74.3]}
                    onSave={(mapData, locs, searchName) => setLogistics({ ...logistics, pickupLocationMap: mapData, serviceArea: 'custom', pickupLocation: searchName || logistics.pickupLocation })}
                  />
{logistics.pickupLocationMap && (
                      <div style={{ marginTop: '10px', fontSize: '0.9rem', color: '#10b981', background: '#ecfdf5', padding: '10px', borderRadius: '8px' }}>
                        ✓ Center: {logistics.pickupLocationMap.lat.toFixed(4)}, {logistics.pickupLocationMap.lng.toFixed(4)}
                      </div>
                    )}
                </div>
                
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div 
                      onClick={() => setLogistics(prev => ({ ...prev, dropOffSameAsPickup: !prev.dropOffSameAsPickup }))}
                      style={{ width: '24px', height: '24px', borderRadius: '6px', border: '2px solid', borderColor: logistics.dropOffSameAsPickup ? '#2563eb' : '#cbd5e1', background: logistics.dropOffSameAsPickup ? '#2563eb' : '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                    >
                      {logistics.dropOffSameAsPickup && <Check size={16} color="#ffffff" strokeWidth={3} />}
                    </div>
                    <span style={{ fontWeight: 600, color: '#334155' }}>Drop-off location is same as Pickup</span>
                  </div>
                  
                  {!logistics.dropOffSameAsPickup && (
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Drop-off Location</label>
                      <input type="text" value={logistics.dropOffLocation} onChange={e => setLogistics({...logistics, dropOffLocation: e.target.value})} placeholder="e.g. Airport" style={inputStyle} />
                    </div>
                  )}
                </div>

                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', marginTop: '16px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 20px 0' }}>Availability & Schedule</h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Available Days <span style={{color: 'red'}}>*</span> {errors.availability && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.availability}</span>}</label>
                    <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                      {['Weekdays', 'Weekend', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
                        <div 
                          key={day}
                          onClick={() => toggleAvailability(day)}
                          style={{ 
                            padding: '8px 16px', borderRadius: '100px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600,
                            background: logistics.availability.includes(day) ? '#0f172a' : '#ffffff',
                            color: logistics.availability.includes(day) ? '#ffffff' : '#64748b',
                            border: '1px solid', borderColor: logistics.availability.includes(day) ? '#0f172a' : '#cbd5e1'
                          }}
                        >
                          {day}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Time Frame (From) <span style={{color: 'red'}}>*</span> {errors.timeFrame && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.timeFrame}</span>}</label>
                      <input type="time" value={logistics.timeFrameFrom} onChange={e => setLogistics({...logistics, timeFrameFrom: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Time Frame (To)</label>
                      <input type="time" value={logistics.timeFrameTo} onChange={e => setLogistics({...logistics, timeFrameTo: e.target.value})} style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Pickup Interval</label>
                      <select value={logistics.timeInterval} onChange={e => setLogistics({...logistics, timeInterval: e.target.value})} style={inputStyle}>
                        <option value="15">15 minutes</option>
                        <option value="30">30 minutes</option>
                        <option value="45">45 minutes</option>
                        <option value="60">1 hour</option>
                      </select>
                    </div>
                  </div>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginTop: '10px', margin: 0 }}>This time frame will apply to all selected days above. Note: Customers will see and select pickup times in the specified interval within this frame.</p>

                  <div style={{ marginTop: '32px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', background: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #cbd5e1' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Booking Type</label>
                      <select value={logistics.bookingType} onChange={e => setLogistics({...logistics, bookingType: e.target.value})} style={inputStyle}>
                        <option value="Instant Confirmation">Instant Confirmation</option>
                        <option value="Manual Confirmation">Manual Confirmation</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Payment Option</label>
                      <select value={logistics.paymentOption} onChange={e => setLogistics({...logistics, paymentOption: e.target.value})} style={inputStyle}>
                        <option value="Pay Now">Pay Now</option>
                        <option value="Pay After Tour">Pay After Tour</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 6 && (
            <div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '30px' }}>Tour Itinerary</h2>
              
              <div style={{ display: 'grid', gap: '24px' }}>
                <div style={{ background: '#f8fafc', padding: '30px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 20px 0' }}>Add Itinerary Stop</h3>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px', marginBottom: '20px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Location / Attraction Name</label>
                      <input type="text" value={currentItinerary.locationName} onChange={e => setCurrentItinerary({...currentItinerary, locationName: e.target.value})} placeholder="e.g. Mount Fuji 5th Station" style={inputStyle} />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Attraction Type</label>
                      <select value={currentItinerary.attractionType} onChange={e => setCurrentItinerary({...currentItinerary, attractionType: e.target.value})} style={inputStyle}>
                        <option value="">Select</option>
                        <option value="Sightseeing">Sightseeing</option>
                        <option value="Nature">Nature</option>
                        <option value="Shopping">Shopping</option>
                        <option value="Food">Food / Dining</option>
                          <option value="Culture">Culture</option>
                          <option value="Adventure">Adventure</option>
                        </select>
                    </div>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Description <span style={{color: 'red'}}>*</span> {errors.shortDescription && <span style={{color: '#ef4444', fontSize: '0.8rem', marginLeft: '8px'}}>{errors.shortDescription}</span>}</label>
                    <textarea 
                      value={currentItinerary.description} 
                      onChange={e => setCurrentItinerary({...currentItinerary, description: e.target.value})}
                      placeholder="Describe what visitors will do here..." 
                      style={{ ...inputStyle, minHeight: '100px', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '24px' }}>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Time to Spend</label>
                      <select value={currentItinerary.timeToSpend} onChange={e => setCurrentItinerary({...currentItinerary, timeToSpend: e.target.value})} style={inputStyle}>
                        <option value="">Select Duration</option>
                        <option value="30 mins">30 mins</option>
                        <option value="1 hour">1 hour</option>
                        <option value="2 hours">2 hours</option>
                        <option value="3+ hours">3+ hours</option>
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontWeight: 700, color: '#334155', marginBottom: '8px' }}>Entry Fee</label>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <div 
                          onClick={() => setCurrentItinerary(prev => ({ ...prev, hasEntryFee: !prev.hasEntryFee }))}
                          style={{ width: '44px', height: '24px', background: currentItinerary.hasEntryFee ? '#10b981' : '#cbd5e1', borderRadius: '100px', position: 'relative', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                        >
                          <div style={{ width: '20px', height: '20px', background: '#ffffff', borderRadius: '50%', position: 'absolute', top: '2px', left: currentItinerary.hasEntryFee ? '22px' : '2px', transition: 'left 0.2s', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }} />
                        </div>
                        {currentItinerary.hasEntryFee && (
                          <div style={{ position: 'relative', flex: 1 }}>
                            <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: '#64748b' }}>$</span>
                            <input type="number" value={currentItinerary.entryFeeAmount} onChange={e => setCurrentItinerary({...currentItinerary, entryFeeAmount: e.target.value})} placeholder="Amount" style={{...inputStyle, paddingLeft: '32px'}} />
                          </div>
                        )}
                        {!currentItinerary.hasEntryFee && <span style={{ color: '#64748b', fontWeight: 600 }}>No entry fee</span>}
                      </div>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <button 
                      onClick={saveItineraryItem}
                      disabled={!currentItinerary.locationName}
                      style={{ background: '#0f172a', color: '#ffffff', padding: '12px 24px', borderRadius: '8px', fontWeight: 700, border: 'none', cursor: !currentItinerary.locationName ? 'not-allowed' : 'pointer', opacity: !currentItinerary.locationName ? 0.5 : 1 }}
                    >
                      Save Location
                    </button>
                  </div>
                </div>

                {itinerary.length > 0 && (
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', marginBottom: '16px' }}>Your Timeline</h3>
                    <div style={{ display: 'grid', gap: '16px' }}>
                      {itinerary.map((item, index) => (
                        <div key={item.id} style={{ display: 'flex', gap: '20px' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#2563eb', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, zIndex: 2 }}>
                              {index + 1}
                            </div>
                            {index < itinerary.length - 1 && <div style={{ width: '2px', flex: 1, background: '#e2e8f0', margin: '4px 0' }} />}
                          </div>
                          
                          <div style={{ flex: 1, padding: '20px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.02)', marginBottom: index === itinerary.length - 1 ? 0 : '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{item.locationName}</div>
                              <div style={{ fontSize: '0.85rem', color: '#64748b', display: 'flex', gap: '12px', marginBottom: '8px' }}>
                                <span>{item.attractionType}</span>
                                <span>•</span>
                                <span>{item.timeToSpend}</span>
                                {item.hasEntryFee && (
                                  <>
                                    <span>•</span>
                                    <span style={{ color: '#b45309', fontWeight: 600 }}>Entry: ${item.entryFeeAmount}</span>
                                  </>
                                )}
                              </div>
                              <div style={{ fontSize: '0.9rem', color: '#475569' }}>{item.description}</div>
                            </div>
                            <button onClick={() => removeItineraryItem(item.id)} style={{ padding: '8px', background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 7 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Frequently Asked Questions</h2>
                <button 
                  onClick={() => setExperienceDetails({...experienceDetails, faqs: [...experienceDetails.faqs, { question: '', answer: '' }]})}
                  style={{ background: '#f8fafc', border: '1px solid #cbd5e1', color: '#0f172a', padding: '10px 20px', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Plus size={16} /> Add FAQ
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {experienceDetails.faqs.map((faq, index) => (
                  <div key={index} style={{ padding: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <label style={{ fontWeight: 700, color: '#0f172a' }}>Question {index + 1}</label>
                      <button onClick={() => {
                        const newFaqs = [...experienceDetails.faqs];
                        newFaqs.splice(index, 1);
                        setExperienceDetails({...experienceDetails, faqs: newFaqs});
                      }} style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <input 
                      placeholder="e.g. What should I wear?" 
                      value={faq.question}
                      onChange={e => {
                        const newFaqs = [...experienceDetails.faqs];
                        newFaqs[index].question = e.target.value;
                        setExperienceDetails({...experienceDetails, faqs: newFaqs});
                      }}
                      style={inputStyle} 
                    />
                    <textarea 
                      placeholder="Answer..." 
                      value={faq.answer}
                      onChange={e => {
                        const newFaqs = [...experienceDetails.faqs];
                        newFaqs[index].answer = e.target.value;
                        setExperienceDetails({...experienceDetails, faqs: newFaqs});
                      }}
                      style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }} 
                    />
                  </div>
                ))}
                {experienceDetails.faqs.length === 0 && (
                  <div style={{ padding: '40px', textAlign: 'center', color: '#64748b', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                    No FAQs added yet. Click "Add FAQ" to start.
                  </div>
                )}
              </div>
            </div>
          )}

          {currentStep === 8 && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Final Review</h2>
                <span style={{ background: '#fef08a', color: '#854d0e', padding: '6px 12px', borderRadius: '100px', fontSize: '0.85rem', fontWeight: 700 }}>Draft Mode</span>
              </div>
              
              <div style={{ display: 'grid', gap: '30px' }}>
                
                {/* Basic Info Summary */}
                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between' }}>
                    Basic Information <button onClick={() => setCurrentStep(1)} style={{ fontSize: '0.9rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '0.95rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Title:</span>
                    <span style={{ color: '#0f172a', fontWeight: 700 }}>{basicInfo.title || 'Not provided'}</span>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Category:</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{basicInfo.category || 'Not provided'}</span>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Highlights:</span>
                    <ul style={{ margin: 0, paddingLeft: '20px', color: '#0f172a' }}>
                      {basicInfo.highlights.filter(h => h).map((h, i) => <li key={i}>{h}</li>)}
                    </ul>
                  </div>
                </div>

                {/* Logistics Summary */}
                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between' }}>
                    Logistics <button onClick={() => setCurrentStep(5)} style={{ fontSize: '0.9rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px', fontSize: '0.95rem' }}>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Pickup:</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{logistics.pickupLocation || 'Not provided'}</span>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Drop-off:</span>
                    <span style={{ color: '#0f172a', fontWeight: 600 }}>{logistics.dropOffSameAsPickup ? 'Same as Pickup' : logistics.dropOffLocation || 'Not provided'}</span>
                    <span style={{ color: '#64748b', fontWeight: 600 }}>Availability:</span>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {logistics.availability.map(d => <span key={d} style={{ background: '#e2e8f0', padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600 }}>{d}</span>)}
                    </div>
                  </div>
                </div>

                {/* Pricing Summary */}
                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between' }}>
                    Pricing Options <button onClick={() => setCurrentStep(4)} style={{ fontSize: '0.9rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </h3>
                  {transportOptions.length === 0 ? <span style={{ color: '#94a3b8' }}>No options added.</span> : (
                    <div style={{ display: 'grid', gap: '12px' }}>
                      {transportOptions.map(opt => (
                        <div key={opt.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                          <span style={{ fontWeight: 700, color: '#0f172a' }}>{opt.title}</span>
                          <span style={{ fontWeight: 800, color: '#334155' }}>Your Earnings: ${(parseFloat(opt.amount) * 0.85).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Itinerary Summary */}
                <div style={{ padding: '24px', background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#0f172a', margin: '0 0 16px 0', display: 'flex', justifyContent: 'space-between' }}>
                    Itinerary <button onClick={() => setCurrentStep(6)} style={{ fontSize: '0.9rem', color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Edit</button>
                  </h3>
                  {itinerary.length === 0 ? <span style={{ color: '#94a3b8' }}>No itinerary added.</span> : (
                    <div style={{ display: 'grid', gap: '8px', color: '#0f172a', fontWeight: 600 }}>
                      {itinerary.map((item, idx) => (
                        <div key={item.id}>
                          {idx + 1}. {item.locationName} <span style={{ color: '#64748b', fontWeight: 400 }}>({item.timeToSpend})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>

              <div style={{ marginTop: '40px', padding: '30px', background: '#eff6ff', borderRadius: '16px', border: '1px solid #bfdbfe', textAlign: 'center' }}>
                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e3a8a', margin: '0 0 10px 0' }}>Ready to go live?</h3>
                <p style={{ color: '#1e40af', marginBottom: '16px' }}>Publishing will make this tour visible to customers (or send it for Admin approval depending on your account status).</p>
                
                {publishError && (
                  <div style={{ background: '#fef2f2', color: '#b91c1c', padding: '12px', borderRadius: '8px', marginBottom: '20px', border: '1px solid #f87171', fontWeight: 600 }}>
                    Error: {publishError}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
                  <button 
                    disabled={isPublishing}
                    onClick={async () => {
                      setPublishError(null);
                      setIsPublishing(true);
                      const result = await saveDraft();
                      if (result && result.success) {
                        router.push('/supplier');
                      } else {
                        setPublishError(result?.error || 'Failed to save draft');
                        setIsPublishing(false);
                      }
                    }}
                    style={{ background: '#ffffff', color: '#1e3a8a', padding: '14px 32px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, border: '1px solid #bfdbfe', cursor: isPublishing ? 'not-allowed' : 'pointer', opacity: isPublishing ? 0.7 : 1 }}
                  >
                    Keep as Draft
                  </button>
                  <button 
                    disabled={isPublishing}
                    onClick={async () => {
                      if (!user) return;
                      setPublishError(null);
                      setIsPublishing(true);
                      
                      // Validate all required fields
                      const errors = [];
                      if (!basicInfo.title) errors.push('Title is missing.');
                      if (!basicInfo.category) errors.push('Category is missing.');
                      if (!basicInfo.shortDescription) errors.push('Description is missing.');
                      if (!photos.heroImage) errors.push('Hero image is missing.');
                      if (transportOptions.length === 0) errors.push('At least one pricing option is required.');
                      if (!logistics.pickupLocation && !logistics.pickupLocationMap) errors.push('Pickup location is missing.');
                      if (!logistics.timeFrameFrom || !logistics.timeFrameTo) errors.push('Time frame is incomplete.');
                      if (itinerary.length === 0) errors.push('At least one itinerary item is required.');
                      
                      if (errors.length > 0) {
                        setPublishError('Please fill out all required fields: ' + errors.join(' '));
                        setIsPublishing(false);
                        return;
                      }
                      
const currentId = productId;

                      try {
                        const controller = new AbortController();
                        const timeoutId = setTimeout(() => controller.abort(), 60000);
                          
                        const res = await fetch('/api/supplier/listings/publish', { 
                          method: 'POST', 
                          headers: { 'Content-Type': 'application/json' }, 
                          signal: controller.signal,
                          body: JSON.stringify({ userId: user.id, productId: currentId }) 
                        });
                        clearTimeout(timeoutId);
                        
                        const data = await res.json();
                        if (res.ok && data.success) {
                          router.push('/supplier/dashboard');
                        } else {
                          // Save as draft on publish failure
                          await saveDraftAsDrift();
                          setPublishError(data.error || 'Failed to publish. Saved as draft.');
                          setIsPublishing(false);
                        }
                      } catch (err: any) {
                        // Save as draft on network/error
                        await saveDraftAsDrift();
                        setPublishError(err.name === 'AbortError' ? 'Network timeout. Saved as draft.' : (err.message || 'Network error'));
                        setIsPublishing(false);
                      }
                    }}
                    style={{ background: '#2563eb', color: '#ffffff', padding: '14px 40px', borderRadius: '12px', fontSize: '1.05rem', fontWeight: 700, border: 'none', cursor: isPublishing ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)', opacity: isPublishing ? 0.7 : 1 }}
                  >
                    {isPublishing ? 'Processing...' : 'Publish Listing Now'}
                  </button>
                </div>
              </div>

            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', paddingTop: '30px', borderTop: '1px solid #e2e8f0' }}>
            <button 
              onClick={() => setCurrentStep(prev => Math.max(prev - 1, 1))}
              disabled={currentStep === 1}
              style={{ background: '#ffffff', color: '#334155', padding: '14px 24px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, border: '1px solid #cbd5e1', cursor: currentStep === 1 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '8px', opacity: currentStep === 1 ? 0.5 : 1 }}
            >
              <ChevronLeft size={18} /> Back
            </button>
            {currentStep < 8 && (
              <button 
                onClick={() => { if (validateCurrentStep()) { setCurrentStep(prev => Math.min(prev + 1, STEPS.length)); } }}
                style={{ background: '#0f172a', color: '#ffffff', padding: '14px 32px', borderRadius: '12px', fontSize: '1rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                Save & Continue <ChevronRight size={18} />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
