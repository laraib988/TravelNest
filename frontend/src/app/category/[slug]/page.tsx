import React from 'react';
import { createClient } from '@supabase/supabase-js';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import AttractionsFilterGrid from '@/components/AttractionsFilterGrid';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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
      extra_sections: [{ title: "Japan Travel Attractions & Places Guide", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p>Welcome to our comprehensive guide to Japan's most spectacular theme parks, digital art museums, historic temples, and iconic observatories. Whether you are looking to skip the lines at world-renowned theme parks or explore cutting-edge immersive art, we have you covered.</p>" },
{ title: "1. Universal Studios Japan (USJ)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Japan ke sab se mashhoor aur bade theme parks mein se ek, jahan realistic gaming aur animation worlds ko live experience kiya ja sakta hai.</p><ul><li><strong>Major Zones & Rides:</strong> Super Nintendo World, The Wizarding World of Harry Potter, Despicable Me Minion Mayhem, The Flying Dinosaur.</li><li><strong>Special Events:</strong> Seasonal Halloween Horror Nights, immersive horror mazes, aur special shows.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥8,600 - ¥10,400 (Varies by day)<br/><strong>Best Time to Visit:</strong> Spring (March-May) or Autumn (September-November)</p>" },
{ title: "2. Tokyo Disney Resort (Disneyland & DisneySea)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Tokyo / Chiba, Japan</p><p><strong>Overview & Highlights:</strong> World-class theme park resort jisme do bade alag-alag parks shaamil hain.</p><ul><li><strong>Tokyo Disneyland:</strong> World Bazaar, Adventureland, Westernland, Tomorrowland. Key Rides: 'it\\'s a small world', Beauty and the Beast.</li><li><strong>Tokyo DisneySea:</strong> Mediterranean Harbor, Arabian Coast, Fantasy Springs. Key Rides: Journey to the Center of the Earth, Soaring.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥7,900 - ¥10,900 (Varies by day)<br/><strong>Best Time to Visit:</strong> Spring (April-May) or Autumn (October-November)</p>" },
{ title: "3. SHIBUYA SKY", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Shibuya, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Shibuya Scramble Square building ke top par waqia 229 meters oonchi 360-degree observation deck. Yahan se Tokyo skyline, Shinjuku, aur Mount Fuji ka panoramic view milta hai.</p><ul><li><strong>Sky Gate:</strong> Entrance aur interactive ceiling animations.</li><li><strong>Sky Stage:</strong> Rooftop outdoor area jisme mashhoor photo-spot 'Sky Edge' shaamil hain.</li></ul><p><strong>Entrance Fee:</strong> ¥2,200 (Online) / ¥2,500 (At door)<br/><strong>Best Time to Visit:</strong> Late afternoon for sunset and dusk views.</p>" },
{ title: "4. teamLab Planets TOKYO", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Toyosu, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Immersive digital art museum jahan visitors pani aur roshni ke dynamic art installations ke andar nange paon chal kar art ka hissa bante hain.</p><ul><li><strong>Infinite Crystal Universe:</strong> Hazaron LEDs se bana cosmic light room.</li><li><strong>Drawing on the Water Surface:</strong> Digital water pool jahan interactive koi machhliyan tairti hain.</li></ul><p><strong>Entrance Fee:</strong> ¥3,800<br/><strong>Best Time to Visit:</strong> Early morning or late evening to avoid crowds.</p>" },
{ title: "5. teamLab Borderless (MORI Building DIGITAL ART MUSEUM)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Azabudai Hills, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Be-hadd mashhoor continuous digital art museum jahan art pieces kamron ki hudood se nikal kar ek doosre ke sath integrate hote hain.</p><ul><li><strong>Bubble Universe:</strong> Chamakdaar bubbles aur light reflections ka multidimensional space.</li><li><strong>EN TEA HOUSE:</strong> Unique experience jahan aapki tea cup ke andar digital flowers bloom karte hain.</li></ul><p><strong>Entrance Fee:</strong> ¥3,800 - ¥4,800<br/><strong>Best Time to Visit:</strong> Early morning or late evening.</p>" },
{ title: "6. teamLab Biovortex Kyoto", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Kyoto ka sab se naya aur sab se bara digital art museum jo Environmental Phenomena aur Japanese traditional art aesthetics par mabni hai.</p><ul><li><strong>Athletics Forest:</strong> Physically engaging aur multi-dimensional creative space.</li><li><strong>Future Park:</strong> Collaborative co-creation space jahan drawings live screens par chalti hain.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥3,800<br/><strong>Best Time to Visit:</strong> Weekdays, early morning.</p>" },
{ title: "7. Warner Bros. Studio Tour Tokyo – The Making of Harry Potter", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Nerima, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Harry Potter aur Fantastic Beasts films ki making par mabni Asia ka pehla studio tour.</p><ul><li>Film ke iconic sets jaise Great Hall, Diagon Alley, aur Forbidden Forest ka real walk-through.</li><li>Behind-the-scenes costumes, animatronics, aur authentic props ki exhibition.</li></ul><p><strong>Entrance Fee:</strong> ¥6,500<br/><strong>Best Time to Visit:</strong> Year-round (Indoor facility).</p>" },
{ title: "8. TOKYO SKYTREE", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Sumida, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> 634 meters ki bulandi ke sath Japan ka sab se ooncha structure.</p><ul><li><strong>Tembo Deck (350m):</strong> 360-degree views, restaurant, aur transparent glass floor panels.</li><li><strong>Tembo Galleria (450m):</strong> Duniya ka sab se buland spiraling skywalk ramp.</li></ul><p><strong>Entrance Fee:</strong> ¥3,100 (Combo ticket for both decks)<br/><strong>Best Time to Visit:</strong> Late afternoon for sunset and night views.</p>" },
{ title: "9. Tokyo Tower", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Minato, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> 333 meters ooncha iconic lattice tower jo Paris ke Eiffel Tower se mutasir hokar banaya gaya hai.</p><ul><li><strong>Main Observatory (150m):</strong> City skyline aur glass viewing sections.</li><li><strong>Top Deck (250m):</strong> Geometric mirrors aur modern futuristic interior.</li></ul><p><strong>Entrance Fee:</strong> ¥1,200 (Main) / ¥3,000 (Top Deck Tour)<br/><strong>Best Time to Visit:</strong> Evening/Night for sparkling city lights.</p>" },
{ title: "10. Ghibli Park", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Aichi Prefecture (Nagoya Area), Japan</p><p><strong>Overview & Highlights:</strong> Studio Ghibli ki animated filmon ki duniya par mushtamil park jo Expo 2005 Aichi Commemorative Park ke andar waqia hai.</p><ul><li><strong>Ghibli's Grand Warehouse:</strong> Indoor artifacts, production materials, exhibits.</li><li><strong>Dondoko Forest:</strong> My Neighbor Totoro se Satsuki & Mei ka ghar.</li></ul><p><strong>Entrance Fee:</strong> ¥1,500 - ¥7,300 (Depends on area/pass)<br/><strong>Best Time to Visit:</strong> Spring or Autumn (Large outdoor areas).</p>" },
{ title: "11. LEGOLAND Japan Resort", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Nagoya, Japan</p><p><strong>Overview & Highlights:</strong> 17 million se zyada LEGO bricks aur hazaron models se bana family theme park.</p><ul><li><strong>Key Areas:</strong> Factory, Bricktopia, Adventure, Knight's Kingdom, Pirate Shores, Miniland.</li><li>40 se zyada interactive rides aur kids building workshops.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥4,500 - ¥7,400<br/><strong>Best Time to Visit:</strong> Spring or Autumn.</p>" },
{ title: "12. Fuji-Q Highland", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Yamanashi Prefecture (Mount Fuji Region), Japan</p><p><strong>Overview & Highlights:</strong> Mount Fuji ke daaman mein waqia world-famous amusement park jo extreme coasters ke liye mashhoor hai.</p><ul><li><strong>Fujiyama:</strong> Dunya ke oonche aur lambe roller coasters mein shumar.</li><li><strong>Takabisha:</strong> 121-degree vertical drop coaster.</li></ul><p><strong>Entrance Fee:</strong> Free Entry; Free Pass Approx. ¥6,000 - ¥7,800<br/><strong>Best Time to Visit:</strong> Clear days in Autumn or Winter for Mt. Fuji views.</p>" },
{ title: "13. Umeda Sky Building & Kuchu Teien Observatory", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Unique do towers ko aapas mein jodne wali iconic bridge architecture.</p><ul><li><strong>Floating Garden Observatory:</strong> Open-air 360-degree rooftop deck jo sunset aur night views ke liye mashhoor hai.</li></ul><p><strong>Entrance Fee:</strong> ¥1,500<br/><strong>Best Time to Visit:</strong> Sunset or Nighttime.</p>" },
{ title: "14. Okinawa Churaumi Aquarium", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Okinawa, Japan</p><p><strong>Overview & Highlights:</strong> Ocean Expo Park mein waqia world-class marine life facility.</p><ul><li><strong>Kuroshio Sea Tank:</strong> Massive glass viewing wall jahan Whale Sharks aur giant Manta Rays tairti hain.</li></ul><p><strong>Entrance Fee:</strong> ¥2,180<br/><strong>Best Time to Visit:</strong> Year-round (Indoor).</p>" },
{ title: "15. Sanrio Puroland", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Tama, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Indoor theme park jo Hello Kitty, My Melody, Cinnamoroll aur deegar Sanrio characters par mabni hai.</p><ul><li><strong>Key Attractions:</strong> Sanrio Character Boat Ride, Lady Kitty House, Grand Musical Theatrical Parades.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥3,600 - ¥4,900<br/><strong>Best Time to Visit:</strong> Year-round (Indoor theme park).</p>" },
{ title: "16. Tokyo Joypolis", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Odaiba, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> SEGA ka indoor interactive technology aur gaming theme park.</p><ul><li><strong>Key Attractions:</strong> Halfpipe Tokyo, Gekion Live Coaster, Transformers VR experience.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥5,000 (Passport)<br/><strong>Best Time to Visit:</strong> Year-round, weekdays for shorter lines.</p>" },
{ title: "17. Huis Ten Bosch", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Sasebo, Nagasaki Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> 17th-century Netherlands (Holland) ke tarz par banaya gaya realistic European theme park.</p><ul><li><strong>Highlights:</strong> Asal canals, windmills, Art Garden, Grand Rose Gardens, seasonal fireworks.</li></ul><p><strong>Entrance Fee:</strong> ¥7,400 (1-Day Passport)<br/><strong>Best Time to Visit:</strong> Spring for tulips, Winter for illumination.</p>" },
{ title: "18. Asakusa Sumo Club & Cultural Show", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Asakusa, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Traditional Sumo wrestling entertainment aur live performance center.</p><ul><li>Isme Geisha welcome dance, sumo ke rules ki commentary, wrestling demonstration bouts, aur authentic Chankonabe dining shaamil hain.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥10,000 - ¥15,000 (Includes meal)<br/><strong>Best Time to Visit:</strong> Evening shows.</p>" },
{ title: "19. Suzuka Circuit Park", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Mie Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Famous Formula 1 racing track ke sath waqia motorsports-themed amusement park jahan bachon aur bado ke liye driving aur karting experiences mojood hain.</p><p><strong>Entrance Fee:</strong> ¥2,000 (Entry) / ¥4,800 (Passport)<br/><strong>Best Time to Visit:</strong> Spring or Autumn.</p>" },
{ title: "20. Regional Tourism & Sightseeing Passes", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Osaka City Sights:</strong> Osaka Castle, Tombori River Cruise, Tennoji Zoo, Nagai Botanical Gardens.</p><p><strong>Kansai Region:</strong> Osaka, Kyoto, Kobe, aur Nara ko connect karne wali cultural sightseeing networks.</p><p><strong>Entrance Fee:</strong> Varies (e.g., Osaka Amazing Pass ¥2,800 - ¥3,600)<br/><strong>Best Time to Visit:</strong> When traveling extensively across regions.</p>" },
{ title: "21. Mount Fuji & Fuji Five Lakes (Fujigoko)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Yamanashi & Shizuoka Prefectures, Japan</p><p><strong>Overview & Highlights:</strong> Japan ka sab se buland (3,776 meters) aur iconic active volcano jo UNESCO World Heritage Site hai. Pahad ke ird-gird 5 khubsurat jheelein waqia hain.</p><ul><li>Yahan se panoramic views, scenic boat cruises, seasonal cherry blossoms, aur Chureito Pagoda ka famous view milta hai.</li></ul><p><strong>Entrance Fee:</strong> Free (Nature); Viewing spots/museums vary.<br/><strong>Best Time to Visit:</strong> November to February for clear views, April for cherry blossoms.</p>" },
{ title: "22. Fushimi Inari Taisha", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Shinto mazhab ka intehai ahem shrine jo pahadi raste par banay gaye hazaron surkh (Torii) darwazoon ke liye duniya bhar mein mashhoor hai.</p><ul><li>Rasta pahad ki choti tak jata hai jahan qadeem stone foxes (Kitsune), shrines aur chote teahouses mojood hain.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Early morning (before 8 AM) to avoid crowds.</p>" },
{ title: "23. Kinkaku-ji (The Golden Pavilion)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Zen Buddhist temple jiske oopri do hisse khalis gold leaf (sonay ke warq) se dhake hue hain.</p><ul><li>Yeh temple ek shant jheel (Mirror Pond) ke kinare waqia hai jo Japanese classical landscape garden architecture ka behtareen namoona hai.</li></ul><p><strong>Entrance Fee:</strong> ¥500<br/><strong>Best Time to Visit:</strong> Early morning or just before sunset for the golden reflection.</p>" },
{ title: "24. Kiyomizu-dera Temple", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Pahadi dhalan par bana qadeem lakdi ka tareekhi temple jo baghair kisi keel (nail) ke banaya gaya hai.</p><ul><li>Iska lamba wooden stage pooray Kyoto shehar aur cherry blossoms/autumn leaves ka lajawab nazara pesh karta hai. Niche Otowa Waterfall ka muqaddas pani behta hai.</li></ul><p><strong>Entrance Fee:</strong> ¥400<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossoms) or Autumn (Fall Colors).</p>" },
{ title: "25. Arashiyama Bamboo Grove & Monkey Park", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Western Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Lambe aur ghane baans (bamboo) ke darakhton ka qudrati rasta jahan hawa chalne par unique sound atmosphere banta hai.</p><ul><li>Qareeb hi Togetsukyo Bridge, Iwatayama Monkey Park, aur tareekhi Tenryu-ji Zen temple waqia hain.</li></ul><p><strong>Entrance Fee:</strong> Bamboo Grove (Free), Monkey Park (¥600)<br/><strong>Best Time to Visit:</strong> Early morning for the grove, Spring/Autumn overall.</p>" },
{ title: "26. Nara Park & Todai-ji Temple", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Nara Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Khula qudrati park jahan saikron azaad ghoomne wale muqaddas hiran (shika deer) rehte hain jinhein haath se feed kiya ja sakta hai.</p><ul><li>Park ke andar Todai-ji Temple mojood hai, jo dunya ki sab se bari lakdi ki buildings mein shumar hota hai aur jisme 15-meter oonchi giant bronze Buddha murti nasb hai.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Todai-ji Temple (¥600)<br/><strong>Best Time to Visit:</strong> Spring and Autumn.</p>" },
{ title: "27. Osaka Castle (Osaka-jo)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> 16th century ka tareekhi qila jo Japan ke daur-e-hukumat ko muttahid karne mein ahem markaz raha.</p><ul><li>Qilay ke andar multi-story museum aur top floor par viewing platform hai, jabke bahar massive stone walls, water moats aur Nishinomaru Garden waqia hain.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Museum Keep (¥600)<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossom season).</p>" },
{ title: "28. Dotonbori & Shinsaibashi District", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Osaka ka sab se mashhoor nightlife, shopping aur food hub.</p><ul><li>Dotonbori canal ke kinare iconic Glico Running Man neon sign, giant 3D mechanical seafood boards, aur mashhoor street foods (Takoyaki, Okonomiyaki) milte hain.</li></ul><p><strong>Entrance Fee:</strong> Free to explore.<br/><strong>Best Time to Visit:</strong> Nighttime for neon lights and dinner.</p>" },
{ title: "29. Senso-ji Temple & Nakamise-dori", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Asakusa, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Tokyo ka sab se qadeem aur muqaddas Buddhist temple (645 AD mein qaim shuda).</p><ul><li>Entrance par giant red lantern wala Kaminarimon Gate hai, jiske baad Nakamise Shopping Street aati hai jahan traditional Japanese souvenirs aur snacks farokht hote hain.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Early morning or evening (shops close around 6 PM).</p>" },
{ title: "30. Shibuya Crossing & Hachiko Memorial", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Shibuya, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Duniya ka sab se mashroof tareen pedestrian scramble crossing, jahan har signal par hazaron log aik sath rasta cross karte hain.</p><ul><li>Station exit par mashhoor wafadaar kutte 'Hachiko' ka bronze statue aik iconic meeting point hai.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Dusk/Evening to experience the massive crowds and neon lights.</p>" },
{ title: "31. Meiji Jingu Shrine & Yoyogi Park", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Shibuya/Harajuku, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Emperor Meiji aur Empress Shoken ke naam par banaya gaya Tokyo ka sab se bara Shinto shrine.</p><ul><li>Yeh Tokyo ke darmiyan 170 acres ke ghane qudrati jangal ke andar waqia hai, jo pur-sukoon mahol aur traditional weddings ke liye jana jata hai.</li></ul><p><strong>Entrance Fee:</strong> Shrine (Free), Inner Garden (¥500)<br/><strong>Best Time to Visit:</strong> Early morning for peaceful walks, Autumn for ginkgo trees.</p>" },
{ title: "32. Akihabara Electric Town", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Global anime, manga, gaming, computer hardware aur pop-culture ka markaz.</p><ul><li>Yahan multi-level electronics stores, retro arcade gaming centers, themed cafes aur collectible shops mojood hain.</li></ul><p><strong>Entrance Fee:</strong> Free to explore.<br/><strong>Best Time to Visit:</strong> Sunday afternoons (main street becomes pedestrian-only).</p>" },
{ title: "33. Hakone Onsen & Lake Ashi", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Kanagawa Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Tokyo ke qareeb mashhoor volcanic hot springs (Onsen) aur nature resort town.</p><ul><li>Highlights: Lake Ashi par sightseeing pirate ship cruise, Hakone Ropeway cable car, volcanic valley Owakudani, aur Hakone Shrine ka paani mein khara red Torii gate.</li></ul><p><strong>Entrance Fee:</strong> Hakone Free Pass (Approx. ¥6,100 from Tokyo).<br/><strong>Best Time to Visit:</strong> Autumn for fall foliage and clear Mt. Fuji views.</p>" },
{ title: "34. Hiroshima Peace Memorial Park & Atomic Bomb Dome", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Hiroshima, Japan</p><p><strong>Overview & Highlights:</strong> 1945 ke atomic bomb ke waqiye ki yaad mein banaya gaya aalmi aman ka markaz.</p><ul><li>Genbaku Dome (A-Bomb Dome): Bomb ke markaz ke qareeb bach jane wali wahid tareekhi imarat. Yahan Peace Memorial Museum aur Cenotaph for the Victims waqia hain.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Museum (¥200)<br/><strong>Best Time to Visit:</strong> Year-round (Spring for cherry blossoms along the river).</p>" },
{ title: "35. Itsukushima Floating Shrine (Miyajima Island)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Miyajima, Hiroshima, Japan</p><p><strong>Overview & Highlights:</strong> Seto Inland Sea mein waqia muqaddas jazeera.</p><ul><li>Iska iconic red Grand Torii Gate high tide ke waqt samundar ke pani par tairta hua mehsoos hota hai. Yahan azaad hiran, Mount Misen cable car aur khubsurat qadeem temples mojood hain.</li></ul><p><strong>Entrance Fee:</strong> Shrine (¥300)<br/><strong>Best Time to Visit:</strong> Autumn for fall colors, check tide schedules for floating gate.</p>" },
{ title: "36. Himeji Castle (White Heron Castle)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Hyogo Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Japan ka sab se bara, sab se mehfooz aur khubsurat asil samurai qila (UNESCO World Heritage Site).</p><ul><li>Iski chamakdaar safaid deewaron aur parinday jaise design ki wajah se isay 'White Heron Castle' kaha jata hai. Isme 80 se zyada buildings aur multistoried defensive keep maze structures hain.</li></ul><p><strong>Entrance Fee:</strong> ¥1,000<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossom season).</p>" },
{ title: "37. Nikko Toshogu Shrine & National Park", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Tochigi Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Tokugawa Shogunate ke bani Tokugawa Ieyasu ka aalishan aur sonay se aarasta mausoleum shrine.</p><ul><li>Iske qareeb ghana pahadi jangal, Lake Chuzenji, aur Japan ki sab se oonchi aabsharon mein se ek Kegon Falls waqia hain.</li></ul><p><strong>Entrance Fee:</strong> ¥1,300<br/><strong>Best Time to Visit:</strong> Autumn for spectacular fall foliage.</p>" },
{ title: "38. Shirakawa-go & Gokayama Historic Villages", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Gifu / Toyama Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Qadeem dehati gaon jo apne makhsoos 'Gassho-zukuri' (namaz ke liye jure hathon jaise) ghaas-phoos ki dhalwaan chatt wale gharon ke liye aalmi satah par mashhoor hain.</p><ul><li>Yeh structure shadeed barf baari ko bardasht karne ke liye banaya gaya tha aur sardiyon mein yeh aik fairy-tale jaisa manzar pesh karta hai.</li></ul><p><strong>Entrance Fee:</strong> Villages (Free), Traditional Houses (¥300-¥400)<br/><strong>Best Time to Visit:</strong> Winter for snow illuminations, or Autumn.</p>" },
{ title: "39. Jigokudani Monkey Park (Snow Monkeys)", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Nagano Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Shiga Kogen pahadon ke jangal mein waqia qudrati park.</p><ul><li>Yeh dunya bhar mein is liye mashhoor hai kyunki yahan ke wild Japanese Macaques (Snow Monkeys) shadeed sardi aur barf mein qudrati garm chashmon (natural onsen pools) mein naha kar sardi bhagate hain.</li></ul><p><strong>Entrance Fee:</strong> ¥800<br/><strong>Best Time to Visit:</strong> Winter (December to March) to see monkeys in the snow.</p>" },
{ title: "40. Kenroku-en Garden & Kanazawa Castle", image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: "<p><strong>Location:</strong> Kanazawa, Ishikawa Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Japan ke 3 sab se azeem aur shandar tareekhi baaghat (Three Great Gardens) mein shumar.</p><ul><li>Yahan qadeem water features, bridges, teahouses, qareeb mojood Kanazawa Castle aur historical Higashi Chaya Geisha district waqia hain.</li></ul><p><strong>Entrance Fee:</strong> ¥320<br/><strong>Best Time to Visit:</strong> Spring (Plum/Cherry blossoms) or Winter (Yukitsuri snow ropes).</p>" }]
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
          <h1 style={{ fontSize: '3rem', fontWeight: 800, marginBottom: '16px', textShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
            {hero.heading || finalPageData.title}
          </h1>
          {hero.subheading && (
            <p style={{ fontSize: '1.2rem', marginBottom: '32px', opacity: 0.9 }}>{hero.subheading}</p>
          )}
          {hero.show_search_bar && (
            <div style={{ background: '#fff', padding: '8px', borderRadius: '100px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
              {/* Fallback to simple input if SearchBar isn't compatible */}
              <input type="text" placeholder="Where are you going?" style={{ width: '100%', padding: '16px 24px', border: 'none', borderRadius: '100px', outline: 'none', fontSize: '1rem', color: '#0f172a' }} />
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
                  slug: rawTour.id, // Using ID as slug based on current architecture
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
