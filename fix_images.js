const fs = require('fs');
const path = require('path');

const files = [
  'frontend/src/app/HomePageClient.tsx',
  'frontend/src/app/admin/listings/page.tsx',
  'frontend/src/app/admin/reviews/page.tsx',
  'frontend/src/app/supplier/page.tsx',
  'frontend/src/components/DestinationDetailsClient.tsx',
  'frontend/src/components/DestinationNews.tsx'
];

files.forEach(file => {
  const filePath = path.join(__dirname, file);
  if (!fs.existsSync(filePath)) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Add import if missing
  if (!content.includes("import Image from 'next/image'")) {
    content = content.replace("import React", "import Image from 'next/image';\nimport React");
    if (!content.includes("import Image")) {
      content = "import Image from 'next/image';\n" + content;
    }
  }

  // Replace <img with <Image width={800} height={600}
  content = content.replace(/<img\s/g, '<Image width={800} height={600} ');
  
  fs.writeFileSync(filePath, content);
  console.log(`Updated ${file}`);
});
