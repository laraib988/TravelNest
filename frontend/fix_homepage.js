const fs = require('fs');
const file = 'd:/TravelNest/frontend/src/app/HomePageClient.tsx';
let content = fs.readFileSync(file, 'utf8');

content = content.replace(
  /{[\s\*\/]*Card 1 - Tours & experiences[\s\*\/]*}\s*<div className="category-card">\s*<Compass size={32} color="#f97316" \/>\s*<span className="category-card-text">Tours & experiences<\/span>\s*<\/div>/g,
  `{/* Card 1 - Tours & experiences */}
          <Link href="/category/tours-experiences" className="category-card" style={{ textDecoration: 'none' }}>
            <Compass size={32} color="#f97316" />
            <span className="category-card-text">Tours & experiences</span>
          </Link>`
);

content = content.replace(
  /{[\s\*\/]*Card 2 - Attraction tickets[\s\*\/]*}\s*<div className="category-card">\s*<Ticket size={32} color="#8b5cf6" \/>\s*<span className="category-card-text">Attraction tickets<\/span>\s*<\/div>/g,
  `{/* Card 2 - Attraction tickets */}
          <Link href="/category/attraction-tickets" className="category-card" style={{ textDecoration: 'none' }}>
            <Ticket size={32} color="#8b5cf6" />
            <span className="category-card-text">Attraction tickets</span>
          </Link>`
);

content = content.replace(
  /{[\s\*\/]*Card 3 - Transport[\s\*\/]*}\s*<div className="category-card">\s*<Train size={32} color="#3b82f6" \/>\s*<span className="category-card-text">Transport<\/span>\s*<\/div>/g,
  `{/* Card 3 - Transport */}
          <Link href="/category/transport" className="category-card" style={{ textDecoration: 'none' }}>
            <Train size={32} color="#3b82f6" />
            <span className="category-card-text">Transport</span>
          </Link>`
);

content = content.replace(
  /{[\s\*\/]*Card 4 - Car rentals[\s\*\/]*}\s*<div className="category-card">\s*<Car size={32} color="#10b981" \/>\s*<span className="category-card-text">Car rentals<\/span>\s*<\/div>/g,
  `{/* Card 4 - Car rentals */}
          <Link href="/category/car-rentals" className="category-card" style={{ textDecoration: 'none' }}>
            <Car size={32} color="#10b981" />
            <span className="category-card-text">Car rentals</span>
          </Link>`
);

fs.writeFileSync(file, content);
console.log('Fixed HomePageClient.tsx');
