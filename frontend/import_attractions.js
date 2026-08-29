const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function run() {
  const { data: users, error: uErr } = await supabase.auth.admin.listUsers();
  if (uErr) {
    console.error('Error fetching users:', uErr);
    return;
  }
  
  const supplierId = users.users[0]?.id;
  if (!supplierId) {
    console.error('No users found to assign supplier_id');
    return;
  }
  console.log('Using supplier ID:', supplierId);

  // Attractions list
  const tickets = [
    { title: "Universal Studios Japan Express Pass", img: "https://res.klook.com/image/upload/activities/gb60sspwaefc1zeg7jhq.jpg", price: 61.39, desc: "Make the most out of your time at Universal Studios Japan with the Express™ Pass!" },
    { title: "Universal Studios Japan Studio Pass", img: "https://res.klook.com/image/upload/activities/q0mcamsusra4q1y6nzvp.jpg", price: 55.90, desc: "One of Japan's leading theme parks, highly praised by visitors to Japan!" },
    { title: "Tokyo Disney Resort - Tokyo Disneyland & Tokyo DisneySea Park Tickets", img: "https://res.klook.com/image/upload/activities/hoo92psxybodfjagbdhu.jpg", price: 55.75, desc: "Tokyo Disney Resort is a themed resort offering more than can be enjoyed in just a day." },
    { title: "SHIBUYA SKY Ticket", img: "https://res.klook.com/image/upload/activities/yjob4pwe3quwy452qk5q.jpg", price: 16.95, desc: "SHIBUYA SKY, located at the top of the Shibuya Scramble Square building, offers breathtaking 360° views of Tokyo." },
    { title: "teamLab Planets TOKYO Ticket", img: "https://res.klook.com/image/upload/activities/mn4cemkgx5r6fy6rgie6.jpg", price: 22.50, desc: "Explore teamLab Planets TOKYO, where you can be part of the art!" },
    { title: "LEGOLAND® Japan Ticket", img: "https://res.klook.com/image/upload/activities/fz92phqmntdktzqdjd49.jpg", price: 32.49, desc: "Celebrate the season of new beginnings at LEGOLAND® Japan Resort!" },
    { title: "teamLab Borderless Tickets: MORI Building DIGITAL ART MUSEUM", img: "https://res.klook.com/image/upload/activities/jrj7lehqfkhqjxaxao9e.jpg", price: 25.00, desc: "Step into a borderless world of art at Tokyo's teamLab Borderless in Azabudai Hills." },
    { title: "Warner Bros. Studio Tour Tokyo - The Making of Harry Potter", img: "https://res.klook.com/image/upload/activities/dff6bmkmphdybdd1prz1.jpg", price: 38.35, desc: "Step into the magic at Warner Bros. Studio Tour Tokyo, an enchanting experience bringing the beloved Harry Potter films to life!" },
    { title: "TOKYO SKYTREE® Ticket", img: "https://res.klook.com/image/upload/activities/u80hqva8ahlxsflkhzy3.jpg", price: 12.65, desc: "At 634 meters high, TOKYO SKYTREE is Japan's tallest structure, with the best panoramic views of Tokyo." },
    { title: "teamLab Biovortex Kyoto Ticket", img: "https://res.klook.com/image/upload/activities/aecfpzb3ura4qhg0nwvr.jpg", price: 25.05, desc: "The largest & newest teamLab museum in Japan." },
    { title: "Osaka Amazing Pass", img: "https://res.klook.com/image/upload/activities/npfsz2iqlc1bdnrzoowy.jpg", price: 20.00, desc: "The Osaka Amazing pass gives unlimited use of the Osaka subway, bus network and private railways plus entry to dozens of Osaka's top attractions." },
    { title: "Asakusa Sumo Club Sumo Show Admission with Chankonabe in Tokyo", img: "https://res.klook.com/image/upload/activities/vjmbzlyaexubgvnqncoz.jpg", price: 100.39, desc: "Enjoy a unique cultural entertainment show that combines live performances, delicious food, and fun." },
    { title: "Ghibli Park Ticket in Aichi", img: "https://res.klook.com/image/upload/activities/ey36go4ieyukkpecrq5f.jpg", price: 22.75, desc: "Ghibli Park is a park that represents the world of Studio Ghibli." },
    { title: "Have Fun in Kansai Premium Pass", img: "https://res.klook.com/image/upload/activities/lhxhmihs6dwevnde3wlj.jpg", price: 142.09, desc: "One pass to explore the best of Kansai, covering top attractions and convenient transportation all in one!" },
    { title: "Okinawa Churaumi Aquarium Ticket", img: "https://res.klook.com/image/upload/activities/ffvxriuek8w8mc4nlxmr.jpg", price: 10.85, desc: "Okinawa's wealth of nature history, and culture can now be experienced at the amazing Okinawa Churaumi Aquarium." },
    { title: "Sanrio Puroland Tokyo Ticket", img: "https://res.klook.com/image/upload/activities/sppl3wyggm3hkztpktzd.jpg", price: 21.29, desc: "Welcome to Sanrio Puroland, or Hello Kitty Land, an indoor theme park in Tama City, Tokyo!" },
    { title: "Umeda Sky Building & Kuchu Teien Observatory Ticket in Osaka", img: "https://res.klook.com/image/upload/activities/a7oblgn2qbkwexv2mnb4.jpg", price: 12.25, desc: "Experience breathtaking 360-degree panoramic views of Osaka from the Kuchu Teien Observatory." },
    { title: "Okinawa FunPASS (Churaumi Series)", img: "https://res.klook.com/image/upload/activities/h4do4lyfxqmw4qee5wxe.jpg", price: 18.35, desc: "Okinawa FunPASS – Your All-in-One Pass for Fun, Food & Shopping!" },
    { title: "Fuji-Q Highland Ticket", img: "https://res.klook.com/image/upload/activities/ttfkbnrbv2cmqoovtjbo.jpg", price: 43.15, desc: "Fuji-Q Highland is a top destination for thrill-seekers and families." },
    { title: "Suzuka Circuit Park Ticket in Mie", img: "https://res.klook.com/image/upload/activities/c4syd3upvjeznl329q9u.jpg", price: 6.25, desc: "Suzuka Circuit Motopia Amusement Park Pass." },
    { title: "Huis Ten Bosch Ticket", img: "https://res.klook.com/image/upload/activities/kl6psva8kxnp0bmiqwjv.jpg", price: 36.59, desc: "Located in Nagasaki's Sasebo city, Huis Ten Bosch is a unique Little Europe theme park." },
    { title: "Tokyo Chiikawa Park Ticket", img: "https://res.klook.com/image/upload/activities/tieelp5srxuzhhgek6f1.jpg", price: 15.00, desc: "Step into the charming world of Chiikawa, where adorable characters and whimsical settings come to life." },
    { title: "Tokyo Tower Ticket", img: "https://res.klook.com/image/upload/activities/i83jf2inxlltoybq8yji.jpg", price: 9.39, desc: "Standing at 333 meters tall, Tokyo Tower offers unforgettable ways to enjoy the iconic heights." },
    { title: "Tokyo Joypolis Ticket", img: "https://res.klook.com/image/upload/activities/rkhs9haflic4gomnnsbb.jpg", price: 22.95, desc: "Tokyo Joypolis is an indoor amusement park in the Odaiba area of Tokyo." },
  ];

  for (const t of tickets) {
    const { data, error } = await supabase
      .from('products')
      .insert({
        supplier_id: supplierId,
        status: 'PUBLISHED',
        current_step: 8,
        basic_info: {
          title: t.title,
          category: 'Attraction Tickets',
          shortDescription: t.desc,
          sellingPoints: 'Ticket',
          photos: {
            heroImage: t.img,
            gallery: []
          }
        },
        transport_pricing: [
          {
            amount: t.price,
            currency: 'USD',
            priceType: 'adult',
            optionName: 'Standard Entry'
          }
        ],
        experience_details: {},
        logistics: {},
        itinerary: []
      });
      
    if (error) {
      console.error('Error inserting:', t.title, error);
    } else {
      console.log('Inserted:', t.title);
    }
  }
}

run();
