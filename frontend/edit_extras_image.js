const fs = require('fs');
let content = fs.readFileSync('src/app/category/[slug]/page.tsx', 'utf8');

const regex = /title:\s*'(\d+\..*?)',\n\s*content:/g;
content = content.replace(regex, (match, title) => {
    return \image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800',
          title: '\',
          content:\;
});

fs.writeFileSync('src/app/category/[slug]/page.tsx', content, 'utf8');
