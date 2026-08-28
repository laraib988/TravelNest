const fs = require('fs');
let content = fs.readFileSync('src/app/blog/[slug]/page.tsx', 'utf8');

// 1. Add robots, publisher to generateMetadata
content = content.replace(
  "keywords: blog.focus_keywords || [],",
  "keywords: blog.focus_keywords || [],\n    publisher: 'Vaitour',\n    robots: {\n      index: true,\n      follow: true,\n      googleBot: {\n        index: true,\n        follow: true,\n        'max-image-preview': 'large',\n        'max-video-preview': -1,\n        'max-snippet': -1,\n      },\n    },"
);

// 2. Enhance fallbackArticleSchema
content = content.replace(
  "datePublished: blog.published_at,",
  "datePublished: blog.published_at,\n    dateModified: blog.updated_at || blog.published_at,\n    url: `${APP_URL}/blog/${blog.slug}`,"
);

fs.writeFileSync('src/app/blog/[slug]/page.tsx', content);
