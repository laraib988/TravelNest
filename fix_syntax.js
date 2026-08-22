const fs = require('fs');
const path = 'frontend/src/components/tours/TourReviews.tsx';
let code = fs.readFileSync(path, 'utf8');

// I will look for the end of the file upload UI which I know is:
// {uploadError && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</div>}
//           </div>

// Then I will inject the correct input and textarea just before the Submit buttons.
// Let's completely replace the broken block from `</div>` to `</form>`

const matchStart = `{uploadError && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</div>}
          </div>`;

const searchPattern = /\{uploadError && <div style=\{\{ color: '#ef4444', fontSize: '0\.8rem', marginTop: '4px' \}\}>\{uploadError\}<\/div>\}\s*<\/div>[\s\S]*?<\/form>/;

const correctUI = `{uploadError && <div style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '4px' }}>{uploadError}</div>}
          </div>
          
          <input
            type="text"
            placeholder="Review title (e.g. 'Amazing sunset cruise!')"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            style={{ width: '100%', padding: '12px', marginBottom: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', fontSize: '0.95rem', outline: 'none' }}
          />
          <textarea
            placeholder="Tell travelers about your experience..."
            value={reviewComment}
            onChange={(e) => setReviewComment(e.target.value)}
            rows={4}
            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', color: '#0f172a', fontSize: '0.95rem', resize: 'vertical', outline: 'none' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
            <button type="button" onClick={() => setShowReviewForm(false)} className="btn-secondary" style={{ padding: '10px 20px' }}>Cancel</button>
            <button type="submit" disabled={submittingReview} className="btn-primary" style={{ padding: '10px 20px' }}>
              {submittingReview ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>`;

code = code.replace(searchPattern, correctUI);

fs.writeFileSync(path, code);
console.log('Fixed syntax error!');
