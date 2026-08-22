const fs = require('fs');
const path = 'frontend/src/components/tours/TourReviews.tsx';
let code = fs.readFileSync(path, 'utf8');

// 1. Add usePathname
if (!code.includes('usePathname')) {
  code = code.replace(/import \{ useRouter \} from 'next\/navigation';/, "import { useRouter, usePathname } from 'next/navigation';");
}
if (!code.includes('const pathname = usePathname();')) {
  code = code.replace(/const router = useRouter\(\);/, "const router = useRouter();\n  const pathname = usePathname();");
}

// 2. Change the button onClick
const buttonRegex = /onClick=\{\(\) => setShowReviewForm\(!showReviewForm\)\}/;
code = code.replace(buttonRegex, "onClick={() => { if (!user) { router.push(`/login?redirect=${encodeURIComponent(pathname)}`); return; } setShowReviewForm(!showReviewForm); }}");

// 3. Remove the inline UI
const inlineUIStart = "{showReviewForm && !user && (";
const inlineUIEnd = ")}";
// I will use regex to completely remove the inline UI block.
const inlineRegex = /\{showReviewForm && !user && \([\s\S]*?<\/div>\s*\)\}\s*\{showReviewForm && user && \(/;
code = code.replace(inlineRegex, "{showReviewForm && (");

fs.writeFileSync(path, code);
console.log('Fixed TourReviews redirection logic!');
