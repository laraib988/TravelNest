const fs = require('fs');
const path = require('path');

const staticPages = [
  'about', 'contact', 'faq', 'privacy', 'terms', 'cancellation-policy', 'refund-policy'
];

staticPages.forEach(page => {
  const dirPath = path.join(__dirname, 'src', 'app', page);
  const layoutPath = path.join(dirPath, 'layout.tsx');
  
  if (fs.existsSync(dirPath) && !fs.existsSync(layoutPath)) {
    const title = page.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const layoutContent = `import { headers } from 'next/headers';

export async function generateMetadata() {
  const headersList = await headers();
  const locale = headersList.get('x-locale') || 'en';
  
  return {
    title: '${title} | Vaitour',
    alternates: {
      canonical: \`https://www.vaitour.com/\${locale}/${page}\`,
      languages: {
        en: \`https://www.vaitour.com/en/${page}\`,
        ja: \`https://www.vaitour.com/ja/${page}\`,
        ur: \`https://www.vaitour.com/ur/${page}\`,
        fr: \`https://www.vaitour.com/fr/${page}\`,
        ar: \`https://www.vaitour.com/ar/${page}\`,
        'x-default': \`https://www.vaitour.com/en/${page}\`,
      }
    }
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
`;
    fs.writeFileSync(layoutPath, layoutContent);
    console.log(`Created layout for ${page}`);
  }
});
