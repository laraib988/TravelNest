const fs = require('fs');
let content = fs.readFileSync('src/app/blog/[slug]/page.tsx', 'utf8');

// 1. Add robots, publisher to generateMetadata
content = content.replace(
  "keywords: blog.focus_keywords || [],",
  "keywords: blog.focus_keywords || [],\n    publisher: 'Vaitour',\n    robots: {\n      index: true,\n      follow: true,\n      googleBot: {\n        index: true,\n        follow: true,\n        'max-image-preview': 'large',\n        'max-video-preview': -1,\n        'max-snippet': -1,\n      },\n    },"
);

// 2. We need to inject schema. Look for the export default async function Page
// First, find the declaration.
let pMatch = content.match(/export default async function BlogPage\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{/);
if (!pMatch) {
    pMatch = content.match(/export default async function Page\(\{ params \}: \{ params: Promise<\{ slug: string \}> \}\) \{/);
}
// Oh wait, I didn't see the component signature. Let me check the rest of the file to see what it's named.
