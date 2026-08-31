import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AttractionsFilterGrid from '@/components/AttractionsFilterGrid';
import SmartSearchBar from '@/components/SmartSearchBar';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const revalidate = 3600;


export default async function CategoryDynamicPage({ params }: { params: { slug: string } }) {
  const { slug } = params;

  const { data: pageData } = await supabase
    .from('dynamic_pages')
    .select('*')
    .eq('slug', slug)
    .single();

  const FALLBACK_PAGES: Record<string, any> = {
    'tours-experiences': {
      title: 'Tours & Experiences',
      hero_section: {
        heading: 'Discover Unforgettable Tours & Experiences',
        subheading: 'Book the best local guides, sightseeing tours, and unique activities.',
        show_search_bar: true,
        background_image: 'https://images.unsplash.com/photo-1522083165195-3444ecd5244e?q=80&w=2000'
      },
      destinations_section: { show: true, title: 'Top Destinations for Experiences' },
      tours_section: { show: true, title: 'Popular Tours & Experiences', subtitle: 'Handpicked activities for you' },
      extra_sections: [
        {
          title: 'Why Book Your Tours & Experiences with Vaitour?',
          content: '<p>When you book with Vaitour, you are connecting directly with verified local guides and top-rated tour operators. Whether you are looking for an authentic food walking tour in Tokyo, a breathtaking sunset cruise in Bali, or a cultural heritage walk in Kyoto, our platform ensures <strong>instant confirmation, secure payments, and free cancellation</strong> on most activities. Skip the tourist traps and discover the world through the eyes of a local.</p>'
        },
        {
          title: 'How to Choose the Perfect Experience',
          content: '<p>Planning your itinerary? We recommend mixing iconic landmark visits with off-the-beaten-path local experiences. Look for tours with small group sizes for a more personalized touch. Check the <em>"Inclusions"</em> on our product pages to see if hotel pickup, meals, or entrance fees are covered. With Vaitour\'s curated categories, finding the perfect half-day trip, full-day excursion, or multi-day adventure has never been easier.</p>'
        }
      ]
    },
    'attraction-tickets': {
      title: 'Attraction Tickets',
      hero_section: {
        heading: 'Skip the Line: Attraction Tickets',
        subheading: 'Book tickets to museums, theme parks, and historic landmarks instantly.',
        show_search_bar: true,
        background_image: 'https://images.unsplash.com/photo-1513407030348-c983a97b98d8?q=80&w=2000'
      },
      destinations_section: { show: false, title: 'Top Cities for Attractions' },
      tours_section: { show: false, title: '', subtitle: '' },
      extra_sections: [{ title: "Japan Travel Attractions & Places Guide", image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800", content: "<h2>What are the best attractions in Japan?</h2><p><strong>The best attractions in Japan include Universal Studios Japan, Tokyo Disney Resort, Fushimi Inari Taisha, and teamLab Planets. Visitors should allocate $50 to $80 per ticket. Spring (March-May) and Autumn (September-November) offer the most comfortable weather and scenic cherry blossom or fall foliage views for outdoor exploration.</strong></p><p>Welcome to our comprehensive guide to Japan's most spectacular theme parks, digital art museums, historic temples, and iconic observatories.</p><h3>Top Attractions Comparison Table</h3><div style='overflow-x: auto;'><table style='width: 100%; text-align: left; border-collapse: collapse; margin-bottom: 24px;' border='1'><thead><tr><th style='padding: 8px;'>Attraction</th><th style='padding: 8px;'>City</th><th style='padding: 8px;'>Best For</th><th style='padding: 8px;'>Official Link</th></tr></thead><tbody><tr><td style='padding: 8px;'>Universal Studios Japan</td><td style='padding: 8px;'>Osaka</td><td style='padding: 8px;'>Thrill Rides & Super Nintendo</td><td style='padding: 8px;'><a href='https://www.usj.co.jp/web/en/us' target='_blank' rel='nofollow'>Visit USJ</a></td></tr><tr><td style='padding: 8px;'>Tokyo Disney Resort</td><td style='padding: 8px;'>Tokyo</td><td style='padding: 8px;'>Families & Disney Fans</td><td style='padding: 8px;'><a href='https://www.tokyodisneyresort.jp/en/index.html' target='_blank' rel='nofollow'>Visit Disney</a></td></tr><tr><td style='padding: 8px;'>teamLab Planets</td><td style='padding: 8px;'>Tokyo</td><td style='padding: 8px;'>Immersive Digital Art</td><td style='padding: 8px;'><a href='https://planets.teamlab.art/tokyo/' target='_blank' rel='nofollow'>Visit teamLab</a></td></tr></tbody></table></div>" },
{ title: "1. Universal Studios Japan (USJ)", image: "https://images.unsplash.com/photo-1601189517986-5e4ec202f168?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VW5pdmVyc2FsJTIwU3R1ZGlvcyUyMEphcGFuJTIwKFVTSil8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> One of Japan's most famous and largest theme parks, where you can experience realistic gaming and animation worlds live.</p><ul><li><strong>Major Zones & Rides:</strong> Super Nintendo World, The Wizarding World of Harry Potter, Despicable Me Minion Mayhem, The Flying Dinosaur.</li><li><strong>Special Events:</strong> Seasonal Halloween Horror Nights, immersive horror mazes, and special shows.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥8,600 - ¥10,400 (Varies by day)<br/><strong>Best Time to Visit:</strong> Spring (March-May) or Autumn (September-November)</p>" },
{ title: "2. Tokyo Disney Resort (Disneyland & DisneySea)", image: "https://images.unsplash.com/photo-1718870010023-b4fed50a0d84?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8VG9reW8lMjBEaXNuZXklMjBSZXNvcnQlMjAoRGlzbmV5bGFuZCUyMCUyNiUyMERpc25leVNlYSl8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Tokyo / Chiba, Japan</p><p><strong>Overview & Highlights:</strong> World-class theme park resort containing two separate major parks.</p><ul><li><strong>Tokyo Disneyland:</strong> World Bazaar, Adventureland, Westernland, Tomorrowland. Key Rides: 'it\\'s a small world', Beauty and the Beast.</li><li><strong>Tokyo DisneySea:</strong> Mediterranean Harbor, Arabian Coast, Fantasy Springs. Key Rides: Journey to the Center of the Earth, Soaring.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥7,900 - ¥10,900 (Varies by day)<br/><strong>Best Time to Visit:</strong> Spring (April-May) or Autumn (October-November)</p>" },
{ title: "3. SHIBUYA SKY", image: "https://images.unsplash.com/photo-1595089025834-fe08af8840f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8U0hJQlVZQSUyMFNLWXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Shibuya, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> A 229-meter high 360-degree observation deck located on top of the Shibuya Scramble Square building. Offers a panoramic view of the Tokyo skyline, Shinjuku, and Mount Fuji.</p><ul><li><strong>Sky Gate:</strong> Entrance and interactive ceiling animations.</li><li><strong>Sky Stage:</strong> Rooftop outdoor area featuring the famous photo-spot 'Sky Edge'.</li></ul><p><strong>Entrance Fee:</strong> ¥2,200 (Online) / ¥2,500 (At door)<br/><strong>Best Time to Visit:</strong> Late afternoon for sunset and dusk views.</p>" },
{ title: "4. teamLab Planets TOKYO", image: "https://images.unsplash.com/photo-1572834534349-51cd25d3bd88?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8dGVhbUxhYiUyMFBsYW5ldHMlMjBUT0tZT3xlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Toyosu, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Immersive digital art museum where visitors walk barefoot through dynamic water and light art installations to become part of the art.</p><ul><li><strong>Infinite Crystal Universe:</strong> A cosmic light room made of thousands of LEDs.</li><li><strong>Drawing on the Water Surface:</strong> A digital water pool where interactive koi fish swim.</li></ul><p><strong>Entrance Fee:</strong> ¥3,800<br/><strong>Best Time to Visit:</strong> Early morning or late evening to avoid crowds.</p>" },
{ title: "5. teamLab Borderless (MORI Building DIGITAL ART MUSEUM)", image: "https://images.unsplash.com/photo-1772550018808-ebbcc271726c?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1772550018820-7172a04e9c2e?q=80&w=875&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Azabudai Hills, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> An immensely popular continuous digital art museum where art pieces expand beyond their rooms and integrate with each other.</p><ul><li><strong>Bubble Universe:</strong> A multidimensional space of glowing bubbles and light reflections.</li><li><strong>EN TEA HOUSE:</strong> A unique experience where digital flowers bloom inside your teacup.</li></ul><p><strong>Entrance Fee:</strong> ¥3,800 - ¥4,800<br/><strong>Best Time to Visit:</strong> Early morning or late evening.</p>" },
{ title: "6. teamLab Biovortex Kyoto", image: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?w=800&q=80", content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Kyoto's newest and largest digital art museum based on Environmental Phenomena and Japanese traditional art aesthetics.</p><ul><li><strong>Athletics Forest:</strong> Physically engaging and multi-dimensional creative space.</li><li><strong>Future Park:</strong> A collaborative co-creation space where drawings come to life on screens.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥3,800<br/><strong>Best Time to Visit:</strong> Weekdays, early morning.</p>" },
{ title: "7. Warner Bros. Studio Tour Tokyo – The Making of Harry Potter", image: "https://images.unsplash.com/photo-1618944847023-38aa001235f0?w=800&q=80", content: "<p><strong>Location:</strong> Nerima, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Asia's first studio tour based on the making of Harry Potter and Fantastic Beasts films.</p><ul><li>A real walk-through of iconic movie sets like the Great Hall, Diagon Alley, and Forbidden Forest.</li><li>Exhibition of behind-the-scenes costumes, animatronics, and authentic props.</li></ul><p><strong>Entrance Fee:</strong> ¥6,500<br/><strong>Best Time to Visit:</strong> Year-round (Indoor facility).</p>" },
{ title: "8. TOKYO SKYTREE", image: "https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=800&q=80", content: "<p><strong>Location:</strong> Sumida, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Japan's tallest structure with a height of 634 meters.</p><ul><li><strong>Tembo Deck (350m):</strong> 360-degree views, restaurant, and transparent glass floor panels.</li><li><strong>Tembo Galleria (450m):</strong> The world's highest spiraling skywalk ramp.</li></ul><p><strong>Entrance Fee:</strong> ¥3,100 (Combo ticket for both decks)<br/><strong>Best Time to Visit:</strong> Late afternoon for sunset and night views.</p>" },
{ title: "9. Tokyo Tower", image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80", content: "<p><strong>Location:</strong> Minato, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> A 333-meter tall iconic lattice tower inspired by the Eiffel Tower in Paris.</p><ul><li><strong>Main Observatory (150m):</strong> City skyline and glass viewing sections.</li><li><strong>Top Deck (250m):</strong> Geometric mirrors and modern futuristic interior.</li></ul><p><strong>Entrance Fee:</strong> ¥1,200 (Main) / ¥3,000 (Top Deck Tour)<br/><strong>Best Time to Visit:</strong> Evening/Night for sparkling city lights.</p>" },
{ title: "10. Ghibli Park", image: "https://images.unsplash.com/photo-1675275373048-94def1bf2b7d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8R2hpYmxpJTIwUGFya3xlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Aichi Prefecture (Nagoya Area), Japan</p><p><strong>Overview & Highlights:</strong> A park based on the world of Studio Ghibli animated films, located inside the Expo 2005 Aichi Commemorative Park.</p><ul><li><strong>Ghibli's Grand Warehouse:</strong> Indoor artifacts, production materials, exhibits.</li><li><strong>Dondoko Forest:</strong> Satsuki & Mei's house from My Neighbor Totoro.</li></ul><p><strong>Entrance Fee:</strong> ¥1,500 - ¥7,300 (Depends on area/pass)<br/><strong>Best Time to Visit:</strong> Spring or Autumn (Large outdoor areas).</p>" },
{ title: "11. LEGOLAND Japan Resort", image: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80", content: "<p><strong>Location:</strong> Nagoya, Japan</p><p><strong>Overview & Highlights:</strong> A family theme park made of over 17 million LEGO bricks and thousands of models.</p><ul><li><strong>Key Areas:</strong> Factory, Bricktopia, Adventure, Knight's Kingdom, Pirate Shores, Miniland.</li><li>Over 40 interactive rides and kids' building workshops.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥4,500 - ¥7,400<br/><strong>Best Time to Visit:</strong> Spring or Autumn.</p>" },
{ title: "12. Fuji-Q Highland", image: "https://images.unsplash.com/photo-1682394549510-538a3a2b5c32?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Yamanashi Prefecture (Mount Fuji Region), Japan</p><p><strong>Overview & Highlights:</strong> A world-famous amusement park located at the base of Mount Fuji, famous for its extreme coasters.</p><ul><li><strong>Fujiyama:</strong> Ranked among the tallest and longest roller coasters in the world.</li><li><strong>Takabisha:</strong> 121-degree vertical drop coaster.</li></ul><p><strong>Entrance Fee:</strong> Free Entry; Free Pass Approx. ¥6,000 - ¥7,800<br/><strong>Best Time to Visit:</strong> Clear days in Autumn or Winter for Mt. Fuji views.</p>" },
{ title: "13. Umeda Sky Building & Kuchu Teien Observatory", image: "https://images.unsplash.com/photo-1735820432071-23431d46d4a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VW1lZGElMjBTa3klMjBCdWlsZGluZyUyMCUyNiUyMEt1Y2h1JTIwVGVpZW4lMjBPYnNlcnZhdG9yeXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> An iconic bridge architecture connecting two unique towers.</p><ul><li><strong>Floating Garden Observatory:</strong> An open-air 360-degree rooftop deck famous for sunset and night views.</li></ul><p><strong>Entrance Fee:</strong> ¥1,500<br/><strong>Best Time to Visit:</strong> Sunset or Nighttime.</p>" },
{ title: "14. Okinawa Churaumi Aquarium", image: "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800&q=80", content: "<p><strong>Location:</strong> Okinawa, Japan</p><p><strong>Overview & Highlights:</strong> A world-class marine life facility located in Ocean Expo Park.</p><ul><li><strong>Kuroshio Sea Tank:</strong> A massive glass viewing wall where Whale Sharks and giant Manta Rays swim.</li></ul><p><strong>Entrance Fee:</strong> ¥2,180<br/><strong>Best Time to Visit:</strong> Year-round (Indoor).</p>" },
{ title: "15. Sanrio Puroland", image: "https://images.unsplash.com/photo-1573125456391-664eef5c2af9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2FucmlvJTIwUHVyb2xhbmR8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Tama, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> An indoor theme park based on Hello Kitty, My Melody, Cinnamoroll, and other Sanrio characters.</p><ul><li><strong>Key Attractions:</strong> Sanrio Character Boat Ride, Lady Kitty House, Grand Musical Theatrical Parades.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥3,600 - ¥4,900<br/><strong>Best Time to Visit:</strong> Year-round (Indoor theme park).</p>" },
{ title: "16. Tokyo Joypolis", image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&q=80", content: "<p><strong>Location:</strong> Odaiba, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> SEGA's indoor interactive technology and gaming theme park.</p><ul><li><strong>Key Attractions:</strong> Halfpipe Tokyo, Gekion Live Coaster, Transformers VR experience.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥5,000 (Passport)<br/><strong>Best Time to Visit:</strong> Year-round, weekdays for shorter lines.</p>" },
{ title: "17. Huis Ten Bosch", image: "https://images.unsplash.com/photo-1513242285-8905cc370848?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SHVpcyUyMFRlbiUyMEJvc2NofGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Sasebo, Nagasaki Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> A realistic European theme park designed in the style of the 17th-century Netherlands (Holland).</p><ul><li><strong>Highlights:</strong> Real canals, windmills, Art Garden, Grand Rose Gardens, and seasonal fireworks.</li></ul><p><strong>Entrance Fee:</strong> ¥7,400 (1-Day Passport)<br/><strong>Best Time to Visit:</strong> Spring for tulips, Winter for illumination.</p>" },
{ title: "18. Asakusa Sumo Club & Cultural Show", image: "https://images.unsplash.com/photo-1580167227251-be70f01b0c51?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXNha3VzYSUyMHRlbXBsZXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Asakusa, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Traditional Sumo wrestling entertainment and live performance center.</p><ul><li>Includes a Geisha welcome dance, commentary on sumo rules, wrestling demonstration bouts, and authentic Chankonabe dining.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥10,000 - ¥15,000 (Includes meal)<br/><strong>Best Time to Visit:</strong> Evening shows.</p>" },
{ title: "19. Suzuka Circuit Park", image: "https://images.unsplash.com/photo-1785323714172-8b9935a28236?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U3V6dWthJTIwQ2lyY3VpdCUyMFBhcmt8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Mie Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> A motorsports-themed amusement park located next to the famous Formula 1 racing track, featuring driving and karting experiences for kids and adults.</p><p><strong>Entrance Fee:</strong> ¥2,000 (Entry) / ¥4,800 (Passport)<br/><strong>Best Time to Visit:</strong> Spring or Autumn.</p>" },
{ title: "20. Regional Tourism & Sightseeing Passes", image: "https://images.unsplash.com/photo-1546661869-9fcc17ef46aa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8UmVnaW9uYWwlMjBUb3VyaXNtJTIwJTI2JTIwU2lnaHRzZWVpbmclMjBQYXNzZXN8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Osaka City Sights:</strong> Osaka Castle, Tombori River Cruise, Tennoji Zoo, Nagai Botanical Gardens.</p><p><strong>Kansai Region:</strong> Cultural sightseeing networks connecting Osaka, Kyoto, Kobe, and Nara.</p><p><strong>Entrance Fee:</strong> Varies (e.g., Osaka Amazing Pass ¥2,800 - ¥3,600)<br/><strong>Best Time to Visit:</strong> When traveling extensively across regions.</p>" },
{ title: "21. Mount Fuji & Fuji Five Lakes (Fujigoko)", image: "https://images.unsplash.com/photo-1712035740706-9581f86da641?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TW91bnQlMjBGdWppJTIwJTI2JTIwRnVqaSUyMEZpdmUlMjBMYWtlcyUyMChGdWppZ29rbyl8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Yamanashi & Shizuoka Prefectures, Japan</p><p><strong>Overview & Highlights:</strong> Japan's highest (3,776 meters) and most iconic active volcano, a UNESCO World Heritage Site. 5 beautiful lakes are situated around the mountain.</p><ul><li>Offers panoramic views, scenic boat cruises, seasonal cherry blossoms, and the famous view of Chureito Pagoda.</li></ul><p><strong>Entrance Fee:</strong> Free (Nature); Viewing spots/museums vary.<br/><strong>Best Time to Visit:</strong> November to February for clear views, April for cherry blossoms.</p>" },
{ title: "22. Fushimi Inari Taisha", image: "https://images.unsplash.com/photo-1571754687694-15eb9a3ac00b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RnVzaGltaSUyMEluYXJpJTIwVGFpc2hhfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> A highly important Shinto shrine famous worldwide for its thousands of red (Torii) gates built along a mountain path.</p><ul><li>The path leads to the top of the mountain where ancient stone foxes (Kitsune), shrines, and small teahouses can be found.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Early morning (before 8 AM) to avoid crowds.</p>" },
{ title: "23. Kinkaku-ji (The Golden Pavilion)", image: "https://images.unsplash.com/photo-1653997412308-308d945f687b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S2lua2FrdS1qaSUyMChUaGUlMjBHb2xkZW4lMjBQYXZpbGlvbil8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> A Zen Buddhist temple whose top two floors are covered in pure gold leaf.</p><ul><li>This temple is located on the edge of a tranquil lake (Mirror Pond) and is an excellent example of Japanese classical landscape garden architecture.</li></ul><p><strong>Entrance Fee:</strong> ¥500<br/><strong>Best Time to Visit:</strong> Early morning or just before sunset for the golden reflection.</p>" },
{ title: "24. Kiyomizu-dera Temple", image: "https://images.unsplash.com/photo-1637679105331-a0cea188b83e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8a2l5b21penUlMjBkZXJhfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> An ancient historic wooden temple built on a mountain slope without using a single nail.</p><ul><li>Its long wooden stage offers a magnificent view of the entire city of Kyoto and cherry blossoms/autumn leaves. The sacred water of Otowa Waterfall flows below.</li></ul><p><strong>Entrance Fee:</strong> ¥400<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossoms) or Autumn (Fall Colors).</p>" },
{ title: "25. Arashiyama Bamboo Grove & Monkey Park", image: "https://images.unsplash.com/photo-1542280267-3e11f71a067a?w=800&q=80", content: "<p><strong>Location:</strong> Western Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> A natural path of tall and dense bamboo trees where a unique sound atmosphere is created when the wind blows.</p><ul><li>Nearby are Togetsukyo Bridge, Iwatayama Monkey Park, and the historic Tenryu-ji Zen temple.</li></ul><p><strong>Entrance Fee:</strong> Bamboo Grove (Free), Monkey Park (¥600)<br/><strong>Best Time to Visit:</strong> Early morning for the grove, Spring/Autumn overall.</p>" },
{ title: "26. Nara Park & Todai-ji Temple", image: "https://images.unsplash.com/photo-1720573166278-4ac6ba745a2a?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dG9kYWlqaSUyMHRlbXBsZXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Nara Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> An open natural park home to hundreds of free-roaming sacred deer (Shika deer) that can be hand-fed.</p><ul><li>Inside the park is Todai-ji Temple, one of the world's largest wooden buildings, housing a 15-meter tall giant bronze Buddha statue.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Todai-ji Temple (¥600)<br/><strong>Best Time to Visit:</strong> Spring and Autumn.</p>" },
{ title: "27. Osaka Castle (Osaka-jo)", image: "https://images.unsplash.com/photo-1596240748549-6ec0f32d4c95?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8T3Nha2ElMjBDYXN0bGUlMjAoT3Nha2Etam8pfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> A 16th-century historic castle that played a major role in unifying Japan.</p><ul><li>Inside the castle is a multi-story museum and a viewing platform on the top floor, while outside are massive stone walls, water moats, and Nishinomaru Garden.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Museum Keep (¥600)<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossom season).</p>" },
{ title: "28. Dotonbori & Shinsaibashi District", image: "https://images.unsplash.com/photo-1768100639787-bb9636b59baa?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8RG90b25ib3JpJTIwJTI2JTIwU2hpbnNhaWJhc2hpJTIwRGlzdHJpY3R8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Osaka's most famous nightlife, shopping, and food hub.</p><ul><li>Along the Dotonbori canal you'll find the iconic Glico Running Man neon sign, giant 3D mechanical seafood boards, and famous street foods (Takoyaki, Okonomiyaki).</li></ul><p><strong>Entrance Fee:</strong> Free to explore.<br/><strong>Best Time to Visit:</strong> Nighttime for neon lights and dinner.</p>" },
{ title: "29. Senso-ji Temple & Nakamise-dori", image: "https://images.unsplash.com/photo-1686933021139-69c8b4242198?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2Vuc28tamklMjBUZW1wbGUlMjAlMjYlMjBOYWthbWlzZS1kb3JpfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Asakusa, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Tokyo's oldest and most sacred Buddhist temple (established in 645 AD).</p><ul><li>At the entrance is the Kaminarimon Gate with a giant red lantern, followed by Nakamise Shopping Street where traditional Japanese souvenirs and snacks are sold.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Early morning or evening (shops close around 6 PM).</p>" },
{ title: "30. Shibuya Crossing & Hachiko Memorial", image: "https://images.unsplash.com/photo-1542051842920-c5a4d469d7da?w=800&q=80", content: "<p><strong>Location:</strong> Shibuya, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> The world's busiest pedestrian scramble crossing, where thousands of people cross the street together at every signal.</p><ul><li>The bronze statue of the famous loyal dog 'Hachiko' at the station exit is an iconic meeting point.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Dusk/Evening to experience the massive crowds and neon lights.</p>" },
{ title: "31. Meiji Jingu Shrine & Yoyogi Park", image: "https://images.unsplash.com/photo-1618478344639-5d934b25a0f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TWVpamklMjBKaW5ndSUyMFNocmluZSUyMCUyNiUyMFlveW9naSUyMFBhcmt8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Shibuya/Harajuku, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Tokyo's largest Shinto shrine dedicated to Emperor Meiji and Empress Shoken.</p><ul><li>It is located in the middle of Tokyo inside a dense 170-acre natural forest, known for its tranquil atmosphere and traditional weddings.</li></ul><p><strong>Entrance Fee:</strong> Shrine (Free), Inner Garden (¥500)<br/><strong>Best Time to Visit:</strong> Early morning for peaceful walks, Autumn for ginkgo trees.</p>" },
{ title: "32. Akihabara Electric Town", image: "https://images.unsplash.com/photo-1683995259187-54142c49338b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8QWtpaGFiYXJhJTIwRWxlY3RyaWMlMjBUb3dufGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> A global hub for anime, manga, gaming, computer hardware, and pop-culture.</p><ul><li>Features multi-level electronics stores, retro arcade gaming centers, themed cafes, and collectible shops.</li></ul><p><strong>Entrance Fee:</strong> Free to explore.<br/><strong>Best Time to Visit:</strong> Sunday afternoons (main street becomes pedestrian-only).</p>" },
{ title: "33. Hakone Onsen & Lake Ashi", image: "https://images.unsplash.com/photo-1524413840847-07c04e1355dc?w=800&q=80", content: "<p><strong>Location:</strong> Kanagawa Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> A famous volcanic hot springs (Onsen) and nature resort town near Tokyo.</p><ul><li>Highlights: Sightseeing pirate ship cruise on Lake Ashi, Hakone Ropeway cable car, volcanic valley Owakudani, and the red Torii gate of Hakone Shrine standing in the water.</li></ul><p><strong>Entrance Fee:</strong> Hakone Free Pass (Approx. ¥6,100 from Tokyo).<br/><strong>Best Time to Visit:</strong> Autumn for fall foliage and clear Mt. Fuji views.</p>" },
{ title: "34. Hiroshima Peace Memorial Park & Atomic Bomb Dome", image: "https://images.unsplash.com/photo-1658167865945-7e9949fa4d69?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGlyb3NoaW1hJTIwUGVhY2UlMjBNZW1vcmlhbCUyMFBhcmslMjAlMjYlMjBBdG9taWMlMjBCb21iJTIwRG9tZXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Hiroshima, Japan</p><p><strong>Overview & Highlights:</strong> A global center for peace built in memory of the 1945 atomic bomb event.</p><ul><li>Genbaku Dome (A-Bomb Dome): The only historic building left standing near the hypocenter. Also houses the Peace Memorial Museum and Cenotaph for the Victims.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Museum (¥200)<br/><strong>Best Time to Visit:</strong> Year-round (Spring for cherry blossoms along the river).</p>" },
{ title: "35. Itsukushima Floating Shrine (Miyajima Island)", image: "https://images.unsplash.com/photo-1719360569943-310d65648d37?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8SXRzdWt1c2hpbWElMjBGbG9hdGluZyUyMFNocmluZSUyMChNaXlhamltYSUyMElzbGFuZCl8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Miyajima, Hiroshima, Japan</p><p><strong>Overview & Highlights:</strong> A sacred island located in the Seto Inland Sea.</p><ul><li>Its iconic red Grand Torii Gate appears to float on the sea water during high tide. Free-roaming deer, Mount Misen cable car, and beautiful ancient temples are also present.</li></ul><p><strong>Entrance Fee:</strong> Shrine (¥300)<br/><strong>Best Time to Visit:</strong> Autumn for fall colors, check tide schedules for floating gate.</p>" },
{ title: "36. Himeji Castle (White Heron Castle)", image: "https://images.unsplash.com/photo-1714999667643-d811c009309e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGltZWppJTIwQ2FzdGxlJTIwKFdoaXRlJTIwSGVyb24lMjBDYXN0bGUpfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Hyogo Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Japan's largest, most well-preserved, and beautiful original samurai castle (UNESCO World Heritage Site).</p><ul><li>It is called 'White Heron Castle' because of its brilliant white walls and bird-like design. It features over 80 buildings and multistoried defensive keep maze structures.</li></ul><p><strong>Entrance Fee:</strong> ¥1,000<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossom season).</p>" },
{ title: "37. Nikko Toshogu Shrine & National Park", image: "https://images.unsplash.com/photo-1528164344705-47542687000d?q=80&w=800", content: "<p><strong>Location:</strong> Tochigi Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> The magnificent and gold-adorned mausoleum shrine of Tokugawa Ieyasu, founder of the Tokugawa Shogunate.</p><ul><li>Nearby is a dense mountain forest, Lake Chuzenji, and Kegon Falls, one of Japan's highest waterfalls.</li></ul><p><strong>Entrance Fee:</strong> ¥1,300<br/><strong>Best Time to Visit:</strong> Autumn for spectacular fall foliage.</p>" },
{ title: "38. Shirakawa-go & Gokayama Historic Villages", image: "https://images.unsplash.com/photo-1582049686609-468f488591ef?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U2hpcmFrYXdhLWdvJTIwJTI2JTIwR29rYXlhbWElMjBIaXN0b3JpYyUyMFZpbGxhZ2VzfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Gifu / Toyama Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Ancient rural villages world-famous for their unique 'Gassho-zukuri' (praying hands-like) steep thatched-roof houses.</p><ul><li>This structure was built to withstand heavy snowfall and presents a fairy-tale-like scene in winter.</li></ul><p><strong>Entrance Fee:</strong> Villages (Free), Traditional Houses (¥300-¥400)<br/><strong>Best Time to Visit:</strong> Winter for snow illuminations, or Autumn.</p>" },
{ title: "39. Jigokudani Monkey Park (Snow Monkeys)", image: "https://images.unsplash.com/photo-1565494396485-ac83a2295872?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Smlnb2t1ZGFuaSUyME1vbmtleSUyMFBhcmslMjAoU25vdyUyME1vbmtleXMpfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Nagano Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> A natural park located in the forest of the Shiga Kogen mountains.</p><ul><li>It is world-famous because the wild Japanese Macaques (Snow Monkeys) here bathe in natural hot springs (onsen pools) to beat the intense cold and snow.</li></ul><p><strong>Entrance Fee:</strong> ¥800<br/><strong>Best Time to Visit:</strong> Winter (December to March) to see monkeys in the snow.</p>" },
{ title: "40. Kenroku-en Garden & Kanazawa Castle", image: "https://images.unsplash.com/photo-1709260295527-611319fb212c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2Vucm9rdS1lbiUyMEdhcmRlbiUyMCUyNiUyMEthbmF6YXdhJTIwQ2FzdGxlfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Kanazawa, Ishikawa Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Ranked among Japan's 3 greatest and most magnificent historic gardens (Three Great Gardens).</p><ul><li>Features ancient water elements, bridges, teahouses, and is located near Kanazawa Castle and the historical Higashi Chaya Geisha district.</li></ul><p><strong>Entrance Fee:</strong> ¥320<br/><strong>Best Time to Visit:</strong> Spring (Plum/Cherry blossoms) or Winter (Yukitsuri snow ropes).</p>" },
{ title: "41. Himeji Castle", image: "https://images.unsplash.com/photo-1714999667643-d811c009309e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8SGltZWppJTIwQ2FzdGxlfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Himeji, Hyogo Prefecture</p><p><strong>Overview & Highlights:</strong> Japan's greatest and best-preserved white feudal castle, a UNESCO World Heritage site.</p><p><strong>Entrance Fee:</strong> �1,000<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossoms) or Autumn</p>" },
{ title: "42. Jigokudani Monkey Park", image: "https://images.unsplash.com/photo-1621862194864-9363167fc586?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Smlnb2t1ZGFuaSUyME1vbmtleSUyMFBhcmt8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Yamanouchi, Nagano Prefecture</p><p><strong>Overview & Highlights:</strong> Famous Snow Monkeys bathing in natural hot springs (onsen).</p><p><strong>Entrance Fee:</strong> �800<br/><strong>Best Time to Visit:</strong> Winter (December se March)</p>" },
{ title: "43. Matsumoto Castle", image: "https://plus.unsplash.com/premium_photo-1716968595134-f74c3e3ced1d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWF0c3Vtb3RvJTIwY2FzdGxlfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Matsumoto, Nagano Prefecture</p><p><strong>Overview & Highlights:</strong> Japan ke qadeem tareen asool par qaim original wooden castles mein se aik, jise \"Crow Castle\" bhi kaha jata hai.</p><p><strong>Entrance Fee:</strong> �700<br/><strong>Best Time to Visit:</strong> Spring or Autumn</p>" },
{ title: "44. Nikko Toshogu Shrine", image: "https://images.unsplash.com/photo-1624577946147-919174206a6b?q=80&w=868&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Nikko, Tochigi Prefecture</p><p><strong>Overview & Highlights:</strong> Tokugawa Ieyasu ka azeem aur gold-carved shandar mazar, \"Three Wise Monkeys\" ka maroof naqsh.</p><p><strong>Entrance Fee:</strong> �1,300<br/><strong>Best Time to Visit:</strong> Autumn (Foliage) or Spring</p>" },
{ title: "45. Lake Kawaguchiko & Chureito Pagoda", image: "https://images.unsplash.com/photo-1681317474435-91e0f5065abf?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2h1cmVpdG8lMjBwYWdvZGF8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Fujikawaguchiko, Yamanashi Prefecture</p><p><strong>Overview & Highlights:</strong> The famous iconic view of a classic 5-story red pagoda with Mount Fuji.</p><p><strong>Entrance Fee:</strong> Free (Pagoda & Park grounds)<br/><strong>Best Time to Visit:</strong> Spring (Sakura) or November (Autumn Leaves)</p>" },
{ title: "46. Miyajima (Itsukushima Shrine)", image: "https://images.unsplash.com/photo-1580355275559-10c832e123f1?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8TWl5YWppbWElMjAoSXRzdWt1c2hpbWElMjBTaHJpbmUpfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Hatsukaichi, Hiroshima Prefecture</p><p><strong>Overview & Highlights:</strong> The famous \"Floating Torii Gate\" floating in the sea water and free-roaming deer.</p><p><strong>Entrance Fee:</strong> �300 (Plus �100 Island Tourist Tax)<br/><strong>Best Time to Visit:</strong> Autumn or High Tide</p>" },
{ title: "47. Hiroshima Peace Memorial Park & Museum", image: "https://images.unsplash.com/photo-1753159396851-f4b3f76c4bb5?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8SGlyb3NoaW1hJTIwUGVhY2UlMjBNZW1vcmlhbCUyMFBhcmslMjAlMjYlMjBNdXNldW18ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Hiroshima, Hiroshima Prefecture</p><p><strong>Overview & Highlights:</strong> Atomic Bomb Dome and a memorial to WWII history and peace.</p><p><strong>Entrance Fee:</strong> �200 (Museum), Park: Free<br/><strong>Best Time to Visit:</strong> All year round</p>" },
{ title: "48. Universal Studios Japan (USJ)", image: "https://images.unsplash.com/photo-1601189517986-5e4ec202f168?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8VW5pdmVyc2FsJTIwU3R1ZGlvcyUyMEphcGFuJTIwKFVTSil8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Osaka, Osaka Prefecture</p><p><strong>Overview & Highlights:</strong> Super Nintendo World, The Wizarding World of Harry Potter, and thrill rides.</p><p><strong>Entrance Fee:</strong> �8,600 � �10,400 (Dynamic ticket pricing)<br/><strong>Best Time to Visit:</strong> Spring or Autumn (Weekdays)</p>" },
{ title: "49. Tokyo DisneySea", image: "https://images.unsplash.com/photo-1718870008334-90194ba7a74f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VG9reW8lMjBEaXNuZXlTZWF8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Urayasu, Chiba Prefecture (Tokyo Bay)</p><p><strong>Overview & Highlights:</strong> The world's only ocean-themed Disney park, including Fantasy Springs.</p><p><strong>Entrance Fee:</strong> �7,900 � �10,900 (Date ke mutabiq)<br/><strong>Best Time to Visit:</strong> Autumn or Spring (Off-peak days)</p>" },
{ title: "50. Tokyo Disneyland", image: "https://images.unsplash.com/photo-1547782126-87bb2bead14e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VG9reW8lMjBEaXNuZXlsYW5kfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Urayasu, Chiba Prefecture</p><p><strong>Overview & Highlights:</strong> Classic Disney fairy tale world, Cinderella Castle, and parades.</p><p><strong>Entrance Fee:</strong> �7,900 � �10,900<br/><strong>Best Time to Visit:</strong> Weekdays, All year</p>" },
{ title: "51. Koyasan (Mount Koya) & Okunoin Cemetery", image: "https://images.unsplash.com/photo-1765888552488-ee1799182240?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S295YXNhbiUyMChNb3VudCUyMEtveWEpJTIwJTI2JTIwT2t1bm9pbiUyMENlbWV0ZXJ5fGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Koya, Wakayama Prefecture</p><p><strong>Overview & Highlights:</strong> Center of Shingon Buddhism, ancient stone tombs, cedar forests, and temple lodgings (Shukubo).</p><p><strong>Entrance Fee:</strong> Free (Okunoin), Specific temples: �500 � �1,000<br/><strong>Best Time to Visit:</strong> Autumn or Summer</p>" },
{ title: "52. Dotonbori District", image: "https://images.unsplash.com/photo-1762245752426-cf29fd654056?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RG90b25ib3JpJTIwRGlzdHJpY3R8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Osaka, Osaka Prefecture</p><p><strong>Overview & Highlights:</strong> Osaka's vibrant street food culture, Glico Running Man neon sign, and Takoyaki stalls.</p><p><strong>Entrance Fee:</strong> Free (Open street area)<br/><strong>Best Time to Visit:</strong> Evening / Night</p>" },
{ title: "53. teamLab Borderless / Planets", image: "https://images.unsplash.com/photo-1654263391025-4c4809a37f5c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8dGVhbUxhYiUyMEJvcmRlcmxlc3MlMjAlMkYlMjBQbGFuZXRzfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Toyosu / Azabudai Hills, Tokyo</p><p><strong>Overview & Highlights:</strong> Immersive digital art museum with unparalleled visual illusions of lights and projections.</p><p><strong>Entrance Fee:</strong> �3,800 � �4,200<br/><strong>Best Time to Visit:</strong> All year (Advance booking required)</p>" },
{ title: "54. Shirakawa-go Traditional Village", image: "https://plus.unsplash.com/premium_photo-1661883132712-58b38588abbb?q=80&w=1472&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Ono District, Gifu Prefecture</p><p><strong>Overview & Highlights:</strong> Ancient mountain village featuring Gassho-zukuri (straw thatched roofs), a UNESCO World Heritage site.</p><p><strong>Entrance Fee:</strong> Free (Village walk), Village Museums: �300 � �400<br/><strong>Best Time to Visit:</strong> Winter (Snow/Illumination) or Autumn</p>" },
{ title: "55. Takayama Old Town (Sanmachi Suji)", image: "https://images.unsplash.com/photo-1708142219466-4efec16c17b4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8VGFrYXlhbWElMjBPbGQlMjBUb3duJTIwKFNhbm1hY2hpJTIwU3VqaSl8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Takayama, Gifu Prefecture</p><p><strong>Overview & Highlights:</strong> Edo-period wooden shops, sake breweries, and Hida beef street food.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Spring/Autumn festivals (Takayama Matsuri)</p>" },
{ title: "56. Hakone Open-Air Museum", image: "https://images.unsplash.com/photo-1744767524259-1a2750b31670?q=80&w=435&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Hakone, Kanagawa Prefecture</p><p><strong>Overview & Highlights:</strong> Open-air sculptures among the mountains, Picasso pavilion, and foot onsen.</p><p><strong>Entrance Fee:</strong> �1,600<br/><strong>Best Time to Visit:</strong> Spring or Autumn</p>" },
{ title: "57. Lake Ashi & Hakone Ropeway", image: "https://images.unsplash.com/photo-1682394549510-538a3a2b5c32?q=80&w=870&auto=format&fit=crop", content: "<p><strong>Location:</strong> Hakone, Kanagawa Prefecture</p><p><strong>Overview & Highlights:</strong> Owakudani volcanic valley (black eggs) and lake cruise offering views of Mt. Fuji.</p><p><strong>Entrance Fee:</strong> Free (Sightseeing Cruise/Ropeway: approx. �1,200 � �2,500)<br/><strong>Best Time to Visit:</strong> Autumn or Clear Winter mornings</p>" },
{ title: "58. Gion Geisha District", image: "https://plus.unsplash.com/premium_photo-1664472640765-40a5265ec3ee?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8R2lvbiUyMEdlaXNoYSUyMERpc3RyaWN0fGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Kyoto, Kyoto Prefecture</p><p><strong>Overview & Highlights:</strong> Ancient machiya wooden houses, traditional teahouses, and sights of Geiko/Maiko in the evening.</p><p><strong>Entrance Fee:</strong> Free (Public streets)<br/><strong>Best Time to Visit:</strong> Evening (Dusk)</p>" },
{ title: "59. Kinkaku-ji (Golden Pavilion)", image: "https://plus.unsplash.com/premium_photo-1661908616159-b0ce47a1a9c4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8S2lua2FrdS1qaSUyMChHb2xkZW4lMjBQYXZpbGlvbil8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Kyoto, Kyoto Prefecture</p><p><strong>Overview & Highlights:</strong> Zen Buddhist temple covered in pure gold leaf by the water.</p><p><strong>Entrance Fee:</strong> �500<br/><strong>Best Time to Visit:</strong> Morning on a clear sunny day</p>" },
{ title: "60. Fushimi Inari Taisha", image: "https://images.unsplash.com/photo-1571754687694-15eb9a3ac00b?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8RnVzaGltaSUyMEluYXJpJTIwVGFpc2hhfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Kyoto, Kyoto Prefecture</p><p><strong>Overview & Highlights:</strong> Thousands of red Torii gates continuously spanning to the top of Mount Inari.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Early Morning (Sunrise) or Night</p>" },
{ title: "61. Arashiyama Bamboo Grove & Monkey Park", image: "https://images.unsplash.com/photo-1542280267-3e11f71a067a?w=800&q=80", content: "<p><strong>Location:</strong> Kyoto, Kyoto Prefecture</p><p><strong>Overview & Highlights:</strong> Towering bamboo forests and a park with free-roaming monkeys on the mountain.</p><p><strong>Entrance Fee:</strong> Bamboo Forest: Free, Iwatayama Monkey Park: �600<br/><strong>Best Time to Visit:</strong> Early Morning (before 8 AM)</p>" },
{ title: "62. Kiyomizu-dera Temple", image: "https://images.unsplash.com/photo-1669954791579-15a45890449f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8S2l5b21penUtZGVyYSUyMFRlbXBsZXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Kyoto, Kyoto Prefecture</p><p><strong>Overview & Highlights:</strong> A magnificent wooden stage built on wooden pillars on the mountain side offering views of Kyoto city.</p><p><strong>Entrance Fee:</strong> �400<br/><strong>Best Time to Visit:</strong> Spring (Sakura) or Autumn Night Illuminations</p>" },
{ title: "63. Nara Park & Todai-ji Temple", image: "https://images.unsplash.com/photo-1578639755533-2c52ba911914?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8TmFyYSUyMFBhcmslMjAlMjYlMjBUb2RhaS1qaSUyMFRlbXBsZXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Nara, Nara Prefecture</p><p><strong>Overview & Highlights:</strong> The world's largest bronze Buddha statue and free-roaming sacred Shika deers.</p><p><strong>Entrance Fee:</strong> Park: Free, Todai-ji Hall: �600<br/><strong>Best Time to Visit:</strong> Spring or Autumn</p>" },
{ title: "64. Shibuya Crossing & Hachiko Statue", image: "https://images.unsplash.com/photo-1542051842920-c5a4d469d7da?w=800&q=80", content: "<p><strong>Location:</strong> Shibuya, Tokyo</p><p><strong>Overview & Highlights:</strong> The world's busiest pedestrian scramble crossing and the statue of loyal dog Hachiko.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Evening / Rush hour</p>" },
{ title: "65. Shibuya Sky", image: "https://images.unsplash.com/photo-1595089025834-fe08af8840f9?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2hpYnV5YSUyMHNreXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Shibuya, Tokyo</p><p><strong>Overview & Highlights:</strong> A 360-degree open-air rooftop observation deck offering views of the entire Tokyo skyline and Mt. Fuji.</p><p><strong>Entrance Fee:</strong> �2,200 � �2,500<br/><strong>Best Time to Visit:</strong> Sunset / Night</p>" },
{ title: "66. Tokyo Skytree", image: "https://images.unsplash.com/photo-1614932750312-440cdfc45fea?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8dG9reW8lMjBza3l0cmVlfGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Sumida, Tokyo</p><p><strong>Overview & Highlights:</strong> Japan's tallest tower (634m) featuring high-tech observation decks and a shopping complex.</p><p><strong>Entrance Fee:</strong> �2,100 � �3,100<br/><strong>Best Time to Visit:</strong> Afternoon to Sunset</p>" },
{ title: "67. Senso-ji Temple & Nakamise Street", image: "https://images.unsplash.com/photo-1695500872638-ebf29db2402f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8U2Vuc28tamklMjBUZW1wbGUlMjAlMjYlMjBOYWthbWlzZSUyMFN0cmVldHxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Asakusa, Tokyo</p><p><strong>Overview & Highlights:</strong> Tokyo's oldest Buddhist temple, the great red lantern (Kaminarimon), and a souvenir street market.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Early morning or Illuminated night</p>" },
{ title: "68. Meiji Jingu Shrine & Yoyogi Park", image: "https://images.unsplash.com/photo-1618478344639-5d934b25a0f4?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TWVpamklMjBKaW5ndSUyMFNocmluZSUyMCUyNiUyMFlveW9naSUyMFBhcmt8ZW58MHx8MHx8fDA%3D", content: "<p><strong>Location:</strong> Shibuya/Harajuku, Tokyo</p><p><strong>Overview & Highlights:</strong> A magnificent Shinto shrine dedicated to Emperor Meiji set amidst a dense forest.</p><p><strong>Entrance Fee:</strong> Free (Inner garden: �500)<br/><strong>Best Time to Visit:</strong> Sunday mornings</p>" },
{ title: "69. Akihabara Electric Town", image: "https://images.unsplash.com/photo-1690434992242-f4cbf990b2f8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTd8fEFraWhhYmFyYSUyMEVsZWN0cmljJTIwVG93bnxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Chiyoda, Tokyo</p><p><strong>Overview & Highlights:</strong> A global hub for anime, manga, electronics, retro video games, and maid cafes.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Afternoon to Evening</p>" },
{ title: "70. Shinjuku Gyoen National Garden", image: "https://images.unsplash.com/photo-1532188978303-4bfaccc429d2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2hpbmp1a3UlMjBHeW9lbiUyME5hdGlvbmFsJTIwR2FyZGVufGVufDB8fDB8fHww", content: "<p><strong>Location:</strong> Shinjuku, Tokyo</p><p><strong>Overview & Highlights:</strong> A grand garden blending Japanese, English, and French styles, offering a peaceful atmosphere amid skyscrapers.</p><p><strong>Entrance Fee:</strong> �500<br/><strong>Best Time to Visit:</strong> Spring (Sakura) or Autumn</p>" },
{ title: "71. Osaka Castle (Osaka-jo)", image: "https://images.unsplash.com/photo-1596240748549-6ec0f32d4c95?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Chuo Ward, Osaka</p><p><strong>Overview & Highlights:</strong> A historic castle and museum surrounded by massive stone walls and a moat.</p><p><strong>Entrance Fee:</strong> Castle Grounds: Free, Main Keep: �600<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossoms)</p>" },
{ title: "72. Umeda Sky Building (Kuchu Teien Observatory)", image: "https://images.unsplash.com/photo-1599680756838-307f6d3c4ada?q=80&w=1480&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Kita Ward, Osaka</p><p><strong>Overview & Highlights:</strong> Futuristic twin towers connected by a floating ring observatory.</p><p><strong>Entrance Fee:</strong> �1,500<br/><strong>Best Time to Visit:</strong> Sunset aur Night view</p>" },
{ title: "73. Kuromon Ichiba Market", image: "https://images.unsplash.com/photo-1608516494623-2df85572e673?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1573674451487-3c66c2aad5ba?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Chuo Ward, Osaka</p><p><strong>Overview & Highlights:</strong> Known as \"Osaka's Kitchen,\" a market for fresh seafood, wagyu beef, and street delicacies.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Morning (Breakfast / Brunch)</p>" },
{ title: "74. Otaru Canal & Music Box Museum", image: "https://images.unsplash.com/photo-1665324949416-c153df85a918?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Otaru, Hokkaido</p><p><strong>Overview & Highlights:</strong> A canal illuminated by historic gas lamps, ancient warehouses, and traditional glass/music box workshops.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Winter (Snow Light Path Festival in Feb)</p>" },
{ title: "75. Furano Flower Fields (Farm Tomita)", image: "https://images.unsplash.com/photo-1573718893672-86144926f4fb?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1625115006061-94a44d9894c6?q=80&w=871&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Furano, Hokkaido</p><p><strong>Overview & Highlights:</strong> Rainbow-colored flower carpets and endless fields of lavender.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> July (Peak Lavender Season)</p>" },
{ title: "76. Noboribetsu Jigokudani (Hell Valley)", image: "https://images.unsplash.com/photo-1677076452912-3f454015f271?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Noboribetsu, Hokkaido</p><p><strong>Overview & Highlights:</strong> A steaming volcanic valley producing mineral-rich onsen water.</p><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Autumn or Winter</p>" },
{ title: "77. Nijo Castle", image: "https://images.unsplash.com/photo-1700424779513-cd55ec444d71?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8TmlqbyUyMENhc3RsZXxlbnwwfHwwfHx8MA%3D%3D", content: "<p><strong>Location:</strong> Kyoto, Kyoto Prefecture</p><p><strong>Overview & Highlights:</strong> The historic castle of the Shogun featuring \"nightingale floors\" (chirping security wooden floors).</p><p><strong>Entrance Fee:</strong> �800 (Palace indoor access ke sath �1,300)<br/><strong>Best Time to Visit:</strong> Morning or Autumn</p>" },
{ title: "78. Naoshima Art Island", image: "https://images.unsplash.com/photo-1762353549500-4c8925b43367?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Kagawa Prefecture (Seto Inland Sea)</p><p><strong>Overview & Highlights:</strong> Famous Yellow Pumpkin sculptures by Yayoi Kusama and underground art museums (Chichu Art Museum).</p><p><strong>Entrance Fee:</strong> Island: Free, Art Museums: �1,000 � �2,100<br/><strong>Best Time to Visit:</strong> Spring to Autumn</p>" },
{ title: "79. Okinawa Churaumi Aquarium", image: "https://images.unsplash.com/photo-1614071659313-fd1bb53ce2a9?q=80&w=870&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Motobu, Okinawa</p><p><strong>Overview & Highlights:</strong> The massive Kuroshio Sea giant water tank where Whale Sharks and Manta Rays swim.</p><p><strong>Entrance Fee:</strong> �2,180<br/><strong>Best Time to Visit:</strong> Summer or Afternoon feeding time</p>" },
{ title: "80. Shuri Castle (Shurijo)", image: "https://images.unsplash.com/photo-1610976689391-c749d937dcab?q=80&w=1512&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", content: "<p><strong>Location:</strong> Naha, Okinawa</p><p><strong>Overview & Highlights:</strong> Ryukyu Kingdom ka tareekhi laal mehal (restoration & heritage park grounds).</p><p><strong>Entrance Fee:</strong> �400 (Restoration viewing area)<br/><strong>Best Time to Visit:</strong> Winter / Spring</p>" }]

    },
    'transport': {
      title: 'Transport',
      hero_section: {
        heading: 'Trains, Buses & Transfers',
        subheading: 'Reliable transport options to get you where you need to go.',
        show_search_bar: true,
        background_image: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2000'
      },
      destinations_section: { show: false },
      tours_section: { show: true, title: 'Transport Options', subtitle: 'Private transfers and public transit passes' },
      extra_sections: [
        {
          title: 'Seamless Airport Transfers & Rail Passes',
          content: '<p>Navigating a new city can be stressful. Vaitour simplifies your journey by offering pre-booked <strong>airport transfers, bullet train (Shinkansen) tickets, and comprehensive city transport passes</strong>. Whether you need a private van for your family or a budget-friendly bus ticket, we have you covered from arrival to departure.</p>'
        }
      ]
    },
    'car-rentals': {
      title: 'Car Rentals',
      hero_section: {
        heading: 'Car Rentals & Private Drivers',
        subheading: 'Explore at your own pace with a rental car or hired private driver.',
        show_search_bar: true,
        background_image: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?q=80&w=2000'
      },
      destinations_section: { show: false },
      tours_section: { show: true, title: 'Featured Vehicles', subtitle: 'Rentals and Private Charters' },
      extra_sections: [
        {
          title: 'Freedom to Explore at Your Own Pace',
          content: '<p>Rent a car through Vaitour and unlock the ultimate road trip experience. Drive through the scenic countryside of Hokkaido, explore the rugged coastlines of Europe, or simply enjoy the convenience of a private vehicle in bustling metropolises. We offer a wide range of vehicles from compact cars to luxury SUVs.</p>'
        },
        {
          title: 'Private Driver Charters',
          content: '<p>Prefer to sit back and relax? Hire a <strong>private driver and charter service</strong>. Our professional, vetted local drivers will take you exactly where you want to go, offering insider tips along the way. Perfect for family groups, corporate travel, or customized full-day sightseeing itineraries.</p>'
        }
      ]
    }
  };

  const finalPageData = pageData || FALLBACK_PAGES[slug];

  if (!finalPageData) {
    notFound();
  }

  // Fetch some top destinations for the strip
  const { data: dests } = await supabase
    .from('destinations')
    .select('*')
    .eq('is_published', true)
    .limit(6);

    let query = supabase
      .from('products')
      .select('*')
      .eq('status', 'PUBLISHED');

    if (slug === 'attraction-tickets') {
      query = query.eq('basic_info->>category', 'Attraction Tickets');
    } else if (slug === 'tours-experiences') {
      // e.g. you could filter by other categories, or leave as is
      query = query.neq('basic_info->>category', 'Attraction Tickets');
    }

    const { data: tours } = await query.limit(24);

  const hero = finalPageData.hero_section || {};
  const destSec = finalPageData.destinations_section || {};
  const tourSec = finalPageData.tours_section || {};
  const extras = finalPageData.extra_sections || [];

  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh' }}>
      
      {/* 1. HERO SECTION */}
      <section style={{ 
        position: 'relative', 
        width: '100%', 
        height: '60vh', 
        minHeight: '500px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.6)), url(${hero.background_image || '/images/hero-bg.jpg'})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div style={{ textAlign: 'center', color: '#fff', padding: '0 20px', maxWidth: '800px', width: '100%' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: '16px', color: '#000000', textShadow: '2px 2px 0 #fff, -2px -2px 0 #fff, 2px -2px 0 #fff, -2px 2px 0 #fff, 0 0 20px rgba(255,255,255,0.9)' }}>
            {hero.heading || finalPageData.title}
          </h1>
          {hero.subheading && (
            <p style={{ fontSize: '1.2rem', marginBottom: '32px', opacity: 0.9 }}>{hero.subheading}</p>
          )}
          {hero.show_search_bar && (
            <div style={{ background: '#fff', padding: '8px', borderRadius: '100px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              <SmartSearchBar 
                placeholder="Where are you going?" 
                inputStyle={{ padding: '8px 8px', fontSize: '1.1rem' }}
              />
            </div>
          )}
        </div>
      </section>

      {/* 2. DESTINATIONS STRIP */}
      {destSec.show && (
        <section style={{ padding: '60px 20px', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '32px' }}>{destSec.title}</h2>
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '20px', scrollSnapType: 'x mandatory' }}>
            {dests?.map(d => (
              <Link href={`/destinations/${d.slug}`} key={d.id} style={{ minWidth: '200px', flex: '0 0 200px', scrollSnapAlign: 'start', position: 'relative', borderRadius: '16px', overflow: 'hidden', height: '250px', textDecoration: 'none' }}>
                <Image src={d.hero_image || ''} alt={d.name} fill style={{ objectFit: 'cover' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }} />
                <h3 style={{ position: 'absolute', bottom: '20px', left: '20px', color: '#fff', fontSize: '1.2rem', margin: 0, fontWeight: 700 }}>{d.name}</h3>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 3. TOURS & EXPERIENCES GRID (4 ROWS) */}
      {tourSec.show && (
        <section style={{ padding: '60px 20px', background: '#fff' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {tourSec.title && <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>{tourSec.title}</h2>}
            {tourSec.subtitle && <p style={{ fontSize: '1.1rem', color: '#64748b', marginBottom: '32px' }}>{tourSec.subtitle}</p>}
            
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
              gap: '24px' 
            }}>
              {(tourSec.items && tourSec.items.length > 0 ? tourSec.items : tours)?.map((rawTour: any) => {
                // Map the dynamic products table structure
                const tour = {
                  id: rawTour.id,
                  slug: rawTour.slug || `${(rawTour.basic_info?.title || rawTour.title || "Tour").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}-${rawTour.id}`,
                  title: rawTour.basic_info?.title || rawTour.title || 'Tour & Experience',
                  image: rawTour.basic_info?.photos?.heroImage || rawTour.hero_image || '/images/placeholder.jpg',
                  category: rawTour.basic_info?.sellingPoints || rawTour.category || 'Experience',
                  pickup_location: rawTour.logistics?.pickupLocation || rawTour.pickup_location,
                  description: rawTour.basic_info?.summary || rawTour.description,
                  base_price: rawTour.transport_pricing?.[0]?.amount || rawTour.base_price,
                  currency: rawTour.currency || 'USD'
                };
                
                return (
                <Link href={tour.slug ? `/tours/${tour.slug}` : '#'} key={tour.id} style={{ textDecoration: 'none', cursor: tour.slug ? 'pointer' : 'default' }}>
                  <div style={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #e2e8f0', background: '#fff', transition: 'transform 0.2s', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <div style={{ height: '200px', position: 'relative' }}>
                      <Image src={tour.image} alt={tour.title} fill style={{ objectFit: 'cover' }} />
                      <div style={{ position: 'absolute', top: '12px', left: '12px', background: '#0284c7', color: '#fff', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', fontWeight: 700 }}>
                        {tour.category || 'Attraction'}
                      </div>
                    </div>
                    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                      <h3 style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 700, marginBottom: '8px', lineHeight: 1.4 }}>{tour.title}</h3>
                      {tour.pickup_location && <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>📍 {tour.pickup_location}</p>}
                      {tour.description && <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px', flexGrow: 1 }}>{tour.description}</p>}
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '12px', marginTop: 'auto' }}>
                        {slug === 'attraction-tickets' ? (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}><strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>Information Only</strong></span>
                        ) : tour.base_price ? (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}>From <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{tour.currency || 'USD'} {tour.base_price}</strong></span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#64748b' }}><strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>View Only</strong></span>
                        )}
                        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#0284c7' }}>View Details &rarr;</span>
                      </div>
                    </div>
                  </div>
                </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* 4. EXTRA SECTIONS */}
      {slug === 'attraction-tickets' ? (
        <AttractionsFilterGrid items={extras} />
      ) : (
        <section style={{ padding: '80px 20px', background: '#f8fafc' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '40px' }}>
              {extras.map((sec: any, idx: number) => {
                const isCard = sec.title.match(/^\d+\./) || sec.title.includes('Passes');
                return (
                  <div key={idx} style={{
                    background: '#ffffff',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    gridColumn: isCard ? 'span 1' : '1 / -1',
                    marginBottom: isCard ? '0' : '20px'
                  }}>
                    {isCard && (
                      <div style={{ position: 'relative', width: '100%', height: '250px' }}>
                        <Image 
                          src={sec.image || 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800'} 
                          alt={sec.title}
                          fill
                          style={{ objectFit: 'cover' }}
                        />
                      </div>
                    )}
                    <div style={{ padding: isCard ? '30px' : '40px' }}>
                      <h2 style={{ fontSize: isCard ? '1.8rem' : '2.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '20px', letterSpacing: '-0.02em', textAlign: isCard ? 'left' : 'center' }}>
                        {sec.title}
                      </h2>
                      <div 
                        className="prose max-w-none"
                        style={{ fontSize: '1.1rem', lineHeight: 1.8, color: '#475569', textAlign: isCard ? 'left' : 'center' }} 
                        dangerouslySetInnerHTML={{ __html: sec.content }} 
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}
