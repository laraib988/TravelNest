const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

let dbUrl = process.env.DATABASE_URL.replace(/"/g, '').replace('Buttar197042#', 'Buttar197042%23');
const pool = new Pool({
  connectionString: dbUrl,
  ssl: { rejectUnauthorized: false }
});

const attractions = [
  { id: 'usj-express-pass', title: 'Universal Studios Japan Express Pass', image: 'https://res.klook.com/image/upload/activities/gb60sspwaefc1zeg7jhq.jpg', description: 'Make the most out of your time at Universal Studios Japan with the Express Pass! Effortlessly bypass lines at the rides and attractions.' },
  { id: 'usj-studio-pass', title: 'Universal Studios Japan Studio Pass', image: 'https://res.klook.com/image/upload/activities/q0mcamsusra4q1y6nzvp.jpg', description: 'One of Japan\'s leading theme parks. A super-exciting experience that will unleash your emotions!' },
  { id: 'tokyo-disney-resort', title: 'Tokyo Disney Resort - Tokyo Disneyland & DisneySea', image: 'https://res.klook.com/image/upload/activities/hoo92psxybodfjagbdhu.jpg', description: 'Tokyo Disney Resort is a themed resort offering more than can be enjoyed in just a day. Have a magical day at Tokyo Disneyland with your Disney friends!' },
  { id: 'shibuya-sky', title: 'SHIBUYA SKY Ticket', image: 'https://res.klook.com/image/upload/activities/yjob4pwe3quwy452qk5q.jpg', description: 'Located at the top of the Shibuya Scramble Square building, offers breathtaking 360° views of Tokyo at 229 meters high.' },
  { id: 'teamlab-planets', title: 'teamLab Planets TOKYO Ticket', image: 'https://res.klook.com/image/upload/activities/mn4cemkgx5r6fy6rgie6.jpg', description: 'Explore teamLab Planets TOKYO, where you can be part of the art! A full-body experience where you walk barefoot.' },
  { id: 'legoland-japan', title: 'LEGOLAND® Japan Ticket', image: 'https://res.klook.com/image/upload/activities/fz92phqmntdktzqdjd49.jpg', description: 'Bring the whole family to enjoy the 40 attractions, including plenty of rides, shows, and interactive experiences in Legoland Japan!' },
  { id: 'teamlab-borderless', title: 'teamLab Borderless Tickets', image: 'https://res.klook.com/image/upload/activities/jrj7lehqfkhqjxaxao9e.jpg', description: 'Step into a borderless world of art at Tokyo\'s teamLab Borderless in Azabudai Hills.' },
  { id: 'warner-bros-studio', title: 'Warner Bros. Studio Tour Tokyo - The Making of Harry Potter', image: 'https://res.klook.com/image/upload/activities/dff6bmkmphdybdd1prz1.jpg', description: 'Step into the magic at Warner Bros. Studio Tour Tokyo, an enchanting experience bringing the beloved Harry Potter films to life!' },
  { id: 'tokyo-skytree', title: 'TOKYO SKYTREE® Ticket', image: 'https://res.klook.com/image/upload/activities/u80hqva8ahlxsflkhzy3.jpg', description: 'At 634 meters high, TOKYO SKYTREE is Japan\'s tallest structure, with the best panoramic views of Tokyo.' },
  { id: 'teamlab-biovortex', title: 'teamLab Biovortex Kyoto Ticket', image: 'https://res.klook.com/image/upload/activities/aecfpzb3ura4qhg0nwvr.jpg', description: 'The largest & newest teamLab museum in Japan. Features more than 50 artworks based on Environmental Phenomena.' },
  { id: 'osaka-amazing-pass', title: 'Osaka Amazing Pass', image: 'https://res.klook.com/image/upload/activities/npfsz2iqlc1bdnrzoowy.jpg', description: 'Gives unlimited use of the Osaka subway, bus network and private railways plus entry to dozens of top tourist attractions.' },
  { id: 'asakusa-sumo', title: 'Asakusa Sumo Club Sumo Show Admission', image: 'https://res.klook.com/image/upload/activities/vjmbzlyaexubgvnqncoz.jpg', description: 'Enjoy a unique cultural entertainment show that combines live performances, delicious food, and fun. Includes Chankonabe.' },
  { id: 'ghibli-park', title: 'Ghibli Park Ticket in Aichi', image: 'https://res.klook.com/image/upload/activities/ey36go4ieyukkpecrq5f.jpg', description: 'Ghibli Park is a park that represents the world of Studio Ghibli, spread out across the massive grounds of Expo 2005 Aichi Commemorative Park.' },
  { id: 'kansai-premium-pass', title: 'Have Fun in Kansai Premium Pass', image: 'https://res.klook.com/image/upload/activities/lhxhmihs6dwevnde3wlj.jpg', description: 'One pass to explore the best of Kansai, covering top attractions and convenient transportation all in one!' },
  { id: 'churaumi-aquarium', title: 'Okinawa Churaumi Aquarium Ticket', image: 'https://res.klook.com/image/upload/activities/ffvxriuek8w8mc4nlxmr.jpg', description: 'Okinawa\'s wealth of nature history, and culture can now be experienced at the amazing Okinawa Churaumi Aquarium.' },
  { id: 'sanrio-puroland', title: 'Sanrio Puroland Tokyo Ticket', image: 'https://res.klook.com/image/upload/activities/sppl3wyggm3hkztpktzd.jpg', description: 'Welcome to Sanrio Puroland, or Hello Kitty Land, an indoor theme park in Tama City, Tokyo! Go on interactive rides and watch live shows.' },
  { id: 'umeda-sky-building', title: 'Umeda Sky Building & Kuchu Teien Observatory Ticket', image: 'https://res.klook.com/image/upload/activities/a7oblgn2qbkwexv2mnb4.jpg', description: 'Experience breathtaking 360-degree panoramic views of Osaka from the Kuchu Teien Observatory.' },
  { id: 'okinawa-funpass', title: 'Okinawa FunPASS (Churaumi Series)', image: 'https://res.klook.com/image/upload/activities/h4do4lyfxqmw4qee5wxe.jpg', description: 'Your All-in-One Pass for Fun, Food & Shopping! Save time and money with flexible plans covering top attractions.' },
  { id: 'fuji-q-highland', title: 'Fuji-Q Highland Ticket', image: 'https://res.klook.com/image/upload/activities/ttfkbnrbv2cmqoovtjbo.jpg', description: 'A top destination for thrill-seekers and families, featuring world-class coasters like Fujiyama and Takabisha.' },
  { id: 'suzuka-circuit', title: 'Suzuka Circuit Park Ticket in Mie', image: 'https://res.klook.com/image/upload/activities/c4syd3upvjeznl329q9u.jpg', description: 'Enjoy rides and attractions at the Suzuka Circuit Park, an exciting amusement park for the whole family.' },
  { id: 'huis-ten-bosch', title: 'Huis Ten Bosch Ticket', image: 'https://res.klook.com/image/upload/activities/kl6psva8kxnp0bmiqwjv.jpg', description: 'A unique Little Europe theme park replicating 17th-century Holland with canals, windmills, and stunning attractions.' },
  { id: 'chiikawa-park', title: 'Tokyo Chiikawa Park Ticket', image: 'https://res.klook.com/image/upload/activities/tieelp5srxuzhhgek6f1.jpg', description: 'Step into the charming world of Chiikawa, where adorable characters and whimsical settings come to life.' },
  { id: 'tokyo-tower', title: 'Tokyo Tower Ticket', image: 'https://res.klook.com/image/upload/activities/i83jf2inxlltoybq8yji.jpg', description: 'Standing at 333 meters tall, Tokyo Tower offers unforgettable ways to enjoy the iconic heights from its observation decks.' },
  { id: 'tokyo-joypolis', title: 'Tokyo Joypolis Ticket', image: 'https://res.klook.com/image/upload/activities/rkhs9haflic4gomnnsbb.jpg', description: 'Tokyo Joypolis is an indoor amusement park in the Odaiba area of Tokyo. Perfect for gamers and thrill-seekers.' }
];

async function run() {
  const client = await pool.connect();
  try {
    const toursSection = {
      title: 'Top Attraction Tickets',
      subtitle: 'Discover the best theme parks, museums and more must-sees',
      show: true,
      items: attractions
    };

    const heroSection = {
      heading: 'Attraction Tickets',
      subheading: 'Discover the best theme parks, museums and more must-sees in Japan',
      background_image: 'https://res.klook.com/image/upload/fl_lossy.progressive,q_85/c_fill,w_1920,h_300/v1606978266/ued/ttd/banner/ttd_veritcal_page_banner_experiences.jpg',
      show_search_bar: true
    };

    await client.query(`
      UPDATE dynamic_pages 
      SET tours_section = $1::jsonb, hero_section = $2::jsonb
      WHERE slug = 'attraction-tickets';
    `, [JSON.stringify(toursSection), JSON.stringify(heroSection)]);
    
    console.log("Attraction tickets seeded successfully!");
  } catch (err) {
    console.error('Error:', err);
  } finally {
    client.release();
    pool.end();
  }
}

run();
