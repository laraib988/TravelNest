const fs = require('fs');
const path = 'frontend/src/components/tours/TourReviews.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Reset the "Write a Review" button to just toggle the form.
const buttonOld = "onClick={() => { if (!user) { openAuthModal('LOGIN'); return; } setShowReviewForm(!showReviewForm); }}";
const buttonNew = "onClick={() => setShowReviewForm(!showReviewForm)}";
code = code.replace(buttonOld, buttonNew);

// Fallback if they were using router.push
const buttonOld2 = "onClick={() => { if (!user) { router.push('/login'); return; } setShowReviewForm(!showReviewForm); }}";
code = code.replace(buttonOld2, buttonNew);

// 2. Wrap the form in `{showReviewForm && user && (`
// First find `{showReviewForm && (`
// But we might have already modified it or maybe it's still exactly `{showReviewForm && (`
const formStartPattern = /\{showReviewForm && \(\s*<form onSubmit=\{handleSubmitReview\}/;
const formStartReplacement = `{showReviewForm && !user && (
        <div className="card-panel" style={{ padding: '32px 24px', marginBottom: '24px', background: '#f8fafc', border: '1px solid #e2e8f0', textAlign: 'center', borderRadius: '16px' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '12px' }}>Share Your Experience</h3>
          <p style={{ color: '#475569', marginBottom: '20px', fontSize: '0.95rem' }}>You must be logged in to write a review. Join our community to share your thoughts!</p>
          <button onClick={() => router.push('/login')} className="btn-primary" style={{ padding: '10px 24px', fontSize: '0.95rem' }}>Login to Review</button>
        </div>
      )}

      {showReviewForm && user && (
        <form onSubmit={handleSubmitReview}`;
        
code = code.replace(formStartPattern, formStartReplacement);

fs.writeFileSync(path, code);
console.log('Fixed login prompt UI!');
