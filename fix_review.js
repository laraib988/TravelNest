const fs = require('fs');
const path = 'frontend/src/components/tours/TourReviews.tsx';
let code = fs.readFileSync(path, 'utf8');

// Add useRouter
if (!code.includes('useRouter')) {
  code = code.replace(/import \{ useAuth \} from '@\/context\/AuthContext';/, "import { useAuth } from '@/context/AuthContext';\nimport { useRouter } from 'next/navigation';");
}

// Add router inside component
if (!code.includes('const router = useRouter()')) {
  code = code.replace(/const \{ user \} = useAuth\(\);/, "const { user } = useAuth();\n  const router = useRouter();");
}

// Add imageFile state
if (!code.includes('imageFile')) {
  code = code.replace(/const \[uploadError, setUploadError\] = useState<string \| null>\(null\);/, "const [imageFile, setImageFile] = useState<File | null>(null);\n  const [uploadError, setUploadError] = useState<string | null>(null);");
}

// Update the toggle button logic
code = code.replace(
  /onClick=\{\(\) => setShowReviewForm\(!showReviewForm\)\}/g,
  "onClick={() => { if (!user) { router.push('/login'); return; } setShowReviewForm(!showReviewForm); }}"
);

// Update handleSubmitReview
const submitReplacement = `const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setSubmittingReview(true);
    setUploadError(null);
    setReviewSuccessMsg(null);
    
    let uploadedPhotoUrl = null;
    if (imageFile) {
      const formData = new FormData();
      formData.append('file', imageFile);
      try {
        const uploadRes = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });
        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          uploadedPhotoUrl = uploadData.url;
        } else {
          throw new Error('Image upload failed');
        }
      } catch (err) {
        setUploadError('Failed to upload image. Please try again.');
        setSubmittingReview(false);
        return;
      }
    }

    try {
      const nextReviewRes = await fetch('/api/public/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          listing_id: tour.id,
          rating: reviewRating,
          title: reviewTitle,
          comment: reviewComment,
          photos: uploadedPhotoUrl ? [uploadedPhotoUrl] : [],
          tour_types: reviewTourTypes,
          user_id: user?.id,
          user_name: user?.name || (user?.email?.split('@')[0] || 'Anonymous'),
          user_avatar: user?.avatar || null
        }),
      });`;

const submitPattern = /const handleSubmitReview = async \(e: React\.FormEvent\) => \{[\s\S]*?body: JSON\.stringify\(\{[\s\S]*?user_avatar: user\?\.avatar \|\| null\s*\}\),\s*\}\);/;

code = code.replace(submitPattern, submitReplacement);

// Add the file input field
const fileInputUI = `
          {/* File Upload UI */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: '#475569', marginBottom: '8px' }}>Attach Photo (Max 2MB)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 2 * 1024 * 1024) {
                    setUploadError('Image size must be less than 2MB');
                    e.target.value = '';
                    setImageFile(null);
                    return;
                  }
                  setImageFile(file);
                  setUploadError(null);
                }
              }}
              style={{ fontSize: '0.85rem' }}
            />
            {imageFile && <span style={{ marginLeft: '10px', fontSize: '0.8rem', color: '#16a34a' }}>Selected: {imageFile.name}</span>}
            {uploadError && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</div>}
          </div>
          
          <input`;

code = code.replace(/<input\s*type="text"\s*placeholder="Review title/g, fileInputUI.trimStart());

fs.writeFileSync(path, code);
console.log('Done replacing');
