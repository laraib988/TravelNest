# International SEO Routing (Next.js [locale] Folder Implementation)

Hum Next.js ka official i18n routing architecture ( `[locale]` folder ) implement karenge taake Japanese (`/ja/`) aur dusri languages ke URLs 404 error na dein aur RTL (Urdu/Arabic) theek se kaam kare.

## User Review Required
> [!WARNING]
> Yeh ek major architectural change hai jisme hum taqreeban tamam public pages ko ek naye `[locale]` folder mein move karenge. `admin`, `supplier`, aur `api` ko hum root par hi rakhnge. Is se thori der ke liye development server restart karna par sakta hai.

## Proposed Changes

### Next.js Routing Architecture
Move all public-facing routes into the new `[locale]` dynamic segment:

#### [NEW] `frontend/src/app/[locale]/`
- Hum ek naya folder banayenge.

#### [MODIFY] `frontend/src/app/layout.tsx` -> `frontend/src/app/[locale]/layout.tsx`
- Move inside `[locale]`.
- Update `params: { locale: string }` so it natively supports Next.js i18n.
- Apply RTL logic directly from `params.locale`: `dir={rtlLocales.includes(locale) ? 'rtl' : 'ltr'}`.
- Fix relative imports like `globals.css`.

#### [MODIFY] Page & Route Folders
Move the following directories inside `[locale]`:
- `about`, `blog`, `cancellation-policy`, `cart`, `checkout`, `community`, `compare`, `contact`, `destinations`, `faq`, `login`, `loyalty`, `my-bookings`, `privacy`, `profile`, `refund-policy`, `signup`, `tours`, `wishlist`, `page.tsx`, `not-found.tsx`, `HomePageClient.tsx`.

#### [MODIFY] `frontend/src/middleware.ts`
- Remove the buggy `NextResponse.rewrite` logic.
- Implement standard i18n redirection. If a user visits `/tours/tokyo`, the middleware will 301 redirect them to `/en/tours/tokyo`. Next.js natively handles the routing inside `[locale]`.

## Verification Plan

### Automated/Scripted Tests
- Move all files via a precise bash/powershell script to avoid data loss.
- Run `npm run build` locally to ensure no import paths are broken.

### Manual Verification
- Aap browser mein `http://localhost:3000/ja/tours/slug` open kar ke check karenge.
- Aap `/ur/` open kar ke check karenge ke website ka layout RTL (Right-to-Left) ho gaya hai ya nahi.
