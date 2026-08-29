const fs = require('fs');

const items = [
  {
    title: "Japan Travel Attractions & Places Guide",
    content: "<p>Welcome to our comprehensive guide to Japan's most spectacular theme parks, digital art museums, historic temples, and iconic observatories. Whether you are looking to skip the lines at world-renowned theme parks or explore cutting-edge immersive art, we have you covered.</p>"
  },
  {
    title: "1. Universal Studios Japan (USJ)",
    content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Japan ke sab se mashhoor aur bade theme parks mein se ek, jahan realistic gaming aur animation worlds ko live experience kiya ja sakta hai.</p><ul><li><strong>Major Zones & Rides:</strong> Super Nintendo World, The Wizarding World of Harry Potter, Despicable Me Minion Mayhem, The Flying Dinosaur.</li><li><strong>Special Events:</strong> Seasonal Halloween Horror Nights, immersive horror mazes, aur special shows.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥8,600 - ¥10,400 (Varies by day)<br/><strong>Best Time to Visit:</strong> Spring (March-May) or Autumn (September-November)</p>"
  },
  {
    title: "2. Tokyo Disney Resort (Disneyland & DisneySea)",
    content: "<p><strong>Location:</strong> Tokyo / Chiba, Japan</p><p><strong>Overview & Highlights:</strong> World-class theme park resort jisme do bade alag-alag parks shaamil hain.</p><ul><li><strong>Tokyo Disneyland:</strong> World Bazaar, Adventureland, Westernland, Tomorrowland. Key Rides: 'it\\'s a small world', Beauty and the Beast.</li><li><strong>Tokyo DisneySea:</strong> Mediterranean Harbor, Arabian Coast, Fantasy Springs. Key Rides: Journey to the Center of the Earth, Soaring.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥7,900 - ¥10,900 (Varies by day)<br/><strong>Best Time to Visit:</strong> Spring (April-May) or Autumn (October-November)</p>"
  },
  {
    title: "3. SHIBUYA SKY",
    content: "<p><strong>Location:</strong> Shibuya, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Shibuya Scramble Square building ke top par waqia 229 meters oonchi 360-degree observation deck. Yahan se Tokyo skyline, Shinjuku, aur Mount Fuji ka panoramic view milta hai.</p><ul><li><strong>Sky Gate:</strong> Entrance aur interactive ceiling animations.</li><li><strong>Sky Stage:</strong> Rooftop outdoor area jisme mashhoor photo-spot 'Sky Edge' shaamil hain.</li></ul><p><strong>Entrance Fee:</strong> ¥2,200 (Online) / ¥2,500 (At door)<br/><strong>Best Time to Visit:</strong> Late afternoon for sunset and dusk views.</p>"
  },
  {
    title: "4. teamLab Planets TOKYO",
    content: "<p><strong>Location:</strong> Toyosu, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Immersive digital art museum jahan visitors pani aur roshni ke dynamic art installations ke andar nange paon chal kar art ka hissa bante hain.</p><ul><li><strong>Infinite Crystal Universe:</strong> Hazaron LEDs se bana cosmic light room.</li><li><strong>Drawing on the Water Surface:</strong> Digital water pool jahan interactive koi machhliyan tairti hain.</li></ul><p><strong>Entrance Fee:</strong> ¥3,800<br/><strong>Best Time to Visit:</strong> Early morning or late evening to avoid crowds.</p>"
  },
  {
    title: "5. teamLab Borderless (MORI Building DIGITAL ART MUSEUM)",
    content: "<p><strong>Location:</strong> Azabudai Hills, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Be-hadd mashhoor continuous digital art museum jahan art pieces kamron ki hudood se nikal kar ek doosre ke sath integrate hote hain.</p><ul><li><strong>Bubble Universe:</strong> Chamakdaar bubbles aur light reflections ka multidimensional space.</li><li><strong>EN TEA HOUSE:</strong> Unique experience jahan aapki tea cup ke andar digital flowers bloom karte hain.</li></ul><p><strong>Entrance Fee:</strong> ¥3,800 - ¥4,800<br/><strong>Best Time to Visit:</strong> Early morning or late evening.</p>"
  },
  {
    title: "6. teamLab Biovortex Kyoto",
    content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Kyoto ka sab se naya aur sab se bara digital art museum jo Environmental Phenomena aur Japanese traditional art aesthetics par mabni hai.</p><ul><li><strong>Athletics Forest:</strong> Physically engaging aur multi-dimensional creative space.</li><li><strong>Future Park:</strong> Collaborative co-creation space jahan drawings live screens par chalti hain.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥3,800<br/><strong>Best Time to Visit:</strong> Weekdays, early morning.</p>"
  },
  {
    title: "7. Warner Bros. Studio Tour Tokyo – The Making of Harry Potter",
    content: "<p><strong>Location:</strong> Nerima, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Harry Potter aur Fantastic Beasts films ki making par mabni Asia ka pehla studio tour.</p><ul><li>Film ke iconic sets jaise Great Hall, Diagon Alley, aur Forbidden Forest ka real walk-through.</li><li>Behind-the-scenes costumes, animatronics, aur authentic props ki exhibition.</li></ul><p><strong>Entrance Fee:</strong> ¥6,500<br/><strong>Best Time to Visit:</strong> Year-round (Indoor facility).</p>"
  },
  {
    title: "8. TOKYO SKYTREE",
    content: "<p><strong>Location:</strong> Sumida, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> 634 meters ki bulandi ke sath Japan ka sab se ooncha structure.</p><ul><li><strong>Tembo Deck (350m):</strong> 360-degree views, restaurant, aur transparent glass floor panels.</li><li><strong>Tembo Galleria (450m):</strong> Duniya ka sab se buland spiraling skywalk ramp.</li></ul><p><strong>Entrance Fee:</strong> ¥3,100 (Combo ticket for both decks)<br/><strong>Best Time to Visit:</strong> Late afternoon for sunset and night views.</p>"
  },
  {
    title: "9. Tokyo Tower",
    content: "<p><strong>Location:</strong> Minato, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> 333 meters ooncha iconic lattice tower jo Paris ke Eiffel Tower se mutasir hokar banaya gaya hai.</p><ul><li><strong>Main Observatory (150m):</strong> City skyline aur glass viewing sections.</li><li><strong>Top Deck (250m):</strong> Geometric mirrors aur modern futuristic interior.</li></ul><p><strong>Entrance Fee:</strong> ¥1,200 (Main) / ¥3,000 (Top Deck Tour)<br/><strong>Best Time to Visit:</strong> Evening/Night for sparkling city lights.</p>"
  },
  {
    title: "10. Ghibli Park",
    content: "<p><strong>Location:</strong> Aichi Prefecture (Nagoya Area), Japan</p><p><strong>Overview & Highlights:</strong> Studio Ghibli ki animated filmon ki duniya par mushtamil park jo Expo 2005 Aichi Commemorative Park ke andar waqia hai.</p><ul><li><strong>Ghibli's Grand Warehouse:</strong> Indoor artifacts, production materials, exhibits.</li><li><strong>Dondoko Forest:</strong> My Neighbor Totoro se Satsuki & Mei ka ghar.</li></ul><p><strong>Entrance Fee:</strong> ¥1,500 - ¥7,300 (Depends on area/pass)<br/><strong>Best Time to Visit:</strong> Spring or Autumn (Large outdoor areas).</p>"
  },
  {
    title: "11. LEGOLAND Japan Resort",
    content: "<p><strong>Location:</strong> Nagoya, Japan</p><p><strong>Overview & Highlights:</strong> 17 million se zyada LEGO bricks aur hazaron models se bana family theme park.</p><ul><li><strong>Key Areas:</strong> Factory, Bricktopia, Adventure, Knight's Kingdom, Pirate Shores, Miniland.</li><li>40 se zyada interactive rides aur kids building workshops.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥4,500 - ¥7,400<br/><strong>Best Time to Visit:</strong> Spring or Autumn.</p>"
  },
  {
    title: "12. Fuji-Q Highland",
    content: "<p><strong>Location:</strong> Yamanashi Prefecture (Mount Fuji Region), Japan</p><p><strong>Overview & Highlights:</strong> Mount Fuji ke daaman mein waqia world-famous amusement park jo extreme coasters ke liye mashhoor hai.</p><ul><li><strong>Fujiyama:</strong> Dunya ke oonche aur lambe roller coasters mein shumar.</li><li><strong>Takabisha:</strong> 121-degree vertical drop coaster.</li></ul><p><strong>Entrance Fee:</strong> Free Entry; Free Pass Approx. ¥6,000 - ¥7,800<br/><strong>Best Time to Visit:</strong> Clear days in Autumn or Winter for Mt. Fuji views.</p>"
  },
  {
    title: "13. Umeda Sky Building & Kuchu Teien Observatory",
    content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Unique do towers ko aapas mein jodne wali iconic bridge architecture.</p><ul><li><strong>Floating Garden Observatory:</strong> Open-air 360-degree rooftop deck jo sunset aur night views ke liye mashhoor hai.</li></ul><p><strong>Entrance Fee:</strong> ¥1,500<br/><strong>Best Time to Visit:</strong> Sunset or Nighttime.</p>"
  },
  {
    title: "14. Okinawa Churaumi Aquarium",
    content: "<p><strong>Location:</strong> Okinawa, Japan</p><p><strong>Overview & Highlights:</strong> Ocean Expo Park mein waqia world-class marine life facility.</p><ul><li><strong>Kuroshio Sea Tank:</strong> Massive glass viewing wall jahan Whale Sharks aur giant Manta Rays tairti hain.</li></ul><p><strong>Entrance Fee:</strong> ¥2,180<br/><strong>Best Time to Visit:</strong> Year-round (Indoor).</p>"
  },
  {
    title: "15. Sanrio Puroland",
    content: "<p><strong>Location:</strong> Tama, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Indoor theme park jo Hello Kitty, My Melody, Cinnamoroll aur deegar Sanrio characters par mabni hai.</p><ul><li><strong>Key Attractions:</strong> Sanrio Character Boat Ride, Lady Kitty House, Grand Musical Theatrical Parades.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥3,600 - ¥4,900<br/><strong>Best Time to Visit:</strong> Year-round (Indoor theme park).</p>"
  },
  {
    title: "16. Tokyo Joypolis",
    content: "<p><strong>Location:</strong> Odaiba, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> SEGA ka indoor interactive technology aur gaming theme park.</p><ul><li><strong>Key Attractions:</strong> Halfpipe Tokyo, Gekion Live Coaster, Transformers VR experience.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥5,000 (Passport)<br/><strong>Best Time to Visit:</strong> Year-round, weekdays for shorter lines.</p>"
  },
  {
    title: "17. Huis Ten Bosch",
    content: "<p><strong>Location:</strong> Sasebo, Nagasaki Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> 17th-century Netherlands (Holland) ke tarz par banaya gaya realistic European theme park.</p><ul><li><strong>Highlights:</strong> Asal canals, windmills, Art Garden, Grand Rose Gardens, seasonal fireworks.</li></ul><p><strong>Entrance Fee:</strong> ¥7,400 (1-Day Passport)<br/><strong>Best Time to Visit:</strong> Spring for tulips, Winter for illumination.</p>"
  },
  {
    title: "18. Asakusa Sumo Club & Cultural Show",
    content: "<p><strong>Location:</strong> Asakusa, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Traditional Sumo wrestling entertainment aur live performance center.</p><ul><li>Isme Geisha welcome dance, sumo ke rules ki commentary, wrestling demonstration bouts, aur authentic Chankonabe dining shaamil hain.</li></ul><p><strong>Entrance Fee:</strong> Approx. ¥10,000 - ¥15,000 (Includes meal)<br/><strong>Best Time to Visit:</strong> Evening shows.</p>"
  },
  {
    title: "19. Suzuka Circuit Park",
    content: "<p><strong>Location:</strong> Mie Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Famous Formula 1 racing track ke sath waqia motorsports-themed amusement park jahan bachon aur bado ke liye driving aur karting experiences mojood hain.</p><p><strong>Entrance Fee:</strong> ¥2,000 (Entry) / ¥4,800 (Passport)<br/><strong>Best Time to Visit:</strong> Spring or Autumn.</p>"
  },
  {
    title: "20. Regional Tourism & Sightseeing Passes",
    content: "<p><strong>Osaka City Sights:</strong> Osaka Castle, Tombori River Cruise, Tennoji Zoo, Nagai Botanical Gardens.</p><p><strong>Kansai Region:</strong> Osaka, Kyoto, Kobe, aur Nara ko connect karne wali cultural sightseeing networks.</p><p><strong>Entrance Fee:</strong> Varies (e.g., Osaka Amazing Pass ¥2,800 - ¥3,600)<br/><strong>Best Time to Visit:</strong> When traveling extensively across regions.</p>"
  },
  {
    title: "21. Mount Fuji & Fuji Five Lakes (Fujigoko)",
    content: "<p><strong>Location:</strong> Yamanashi & Shizuoka Prefectures, Japan</p><p><strong>Overview & Highlights:</strong> Japan ka sab se buland (3,776 meters) aur iconic active volcano jo UNESCO World Heritage Site hai. Pahad ke ird-gird 5 khubsurat jheelein waqia hain.</p><ul><li>Yahan se panoramic views, scenic boat cruises, seasonal cherry blossoms, aur Chureito Pagoda ka famous view milta hai.</li></ul><p><strong>Entrance Fee:</strong> Free (Nature); Viewing spots/museums vary.<br/><strong>Best Time to Visit:</strong> November to February for clear views, April for cherry blossoms.</p>"
  },
  {
    title: "22. Fushimi Inari Taisha",
    content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Shinto mazhab ka intehai ahem shrine jo pahadi raste par banay gaye hazaron surkh (Torii) darwazoon ke liye duniya bhar mein mashhoor hai.</p><ul><li>Rasta pahad ki choti tak jata hai jahan qadeem stone foxes (Kitsune), shrines aur chote teahouses mojood hain.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Early morning (before 8 AM) to avoid crowds.</p>"
  },
  {
    title: "23. Kinkaku-ji (The Golden Pavilion)",
    content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Zen Buddhist temple jiske oopri do hisse khalis gold leaf (sonay ke warq) se dhake hue hain.</p><ul><li>Yeh temple ek shant jheel (Mirror Pond) ke kinare waqia hai jo Japanese classical landscape garden architecture ka behtareen namoona hai.</li></ul><p><strong>Entrance Fee:</strong> ¥500<br/><strong>Best Time to Visit:</strong> Early morning or just before sunset for the golden reflection.</p>"
  },
  {
    title: "24. Kiyomizu-dera Temple",
    content: "<p><strong>Location:</strong> Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Pahadi dhalan par bana qadeem lakdi ka tareekhi temple jo baghair kisi keel (nail) ke banaya gaya hai.</p><ul><li>Iska lamba wooden stage pooray Kyoto shehar aur cherry blossoms/autumn leaves ka lajawab nazara pesh karta hai. Niche Otowa Waterfall ka muqaddas pani behta hai.</li></ul><p><strong>Entrance Fee:</strong> ¥400<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossoms) or Autumn (Fall Colors).</p>"
  },
  {
    title: "25. Arashiyama Bamboo Grove & Monkey Park",
    content: "<p><strong>Location:</strong> Western Kyoto, Japan</p><p><strong>Overview & Highlights:</strong> Lambe aur ghane baans (bamboo) ke darakhton ka qudrati rasta jahan hawa chalne par unique sound atmosphere banta hai.</p><ul><li>Qareeb hi Togetsukyo Bridge, Iwatayama Monkey Park, aur tareekhi Tenryu-ji Zen temple waqia hain.</li></ul><p><strong>Entrance Fee:</strong> Bamboo Grove (Free), Monkey Park (¥600)<br/><strong>Best Time to Visit:</strong> Early morning for the grove, Spring/Autumn overall.</p>"
  },
  {
    title: "26. Nara Park & Todai-ji Temple",
    content: "<p><strong>Location:</strong> Nara Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Khula qudrati park jahan saikron azaad ghoomne wale muqaddas hiran (shika deer) rehte hain jinhein haath se feed kiya ja sakta hai.</p><ul><li>Park ke andar Todai-ji Temple mojood hai, jo dunya ki sab se bari lakdi ki buildings mein shumar hota hai aur jisme 15-meter oonchi giant bronze Buddha murti nasb hai.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Todai-ji Temple (¥600)<br/><strong>Best Time to Visit:</strong> Spring and Autumn.</p>"
  },
  {
    title: "27. Osaka Castle (Osaka-jo)",
    content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> 16th century ka tareekhi qila jo Japan ke daur-e-hukumat ko muttahid karne mein ahem markaz raha.</p><ul><li>Qilay ke andar multi-story museum aur top floor par viewing platform hai, jabke bahar massive stone walls, water moats aur Nishinomaru Garden waqia hain.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Museum Keep (¥600)<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossom season).</p>"
  },
  {
    title: "28. Dotonbori & Shinsaibashi District",
    content: "<p><strong>Location:</strong> Osaka, Japan</p><p><strong>Overview & Highlights:</strong> Osaka ka sab se mashhoor nightlife, shopping aur food hub.</p><ul><li>Dotonbori canal ke kinare iconic Glico Running Man neon sign, giant 3D mechanical seafood boards, aur mashhoor street foods (Takoyaki, Okonomiyaki) milte hain.</li></ul><p><strong>Entrance Fee:</strong> Free to explore.<br/><strong>Best Time to Visit:</strong> Nighttime for neon lights and dinner.</p>"
  },
  {
    title: "29. Senso-ji Temple & Nakamise-dori",
    content: "<p><strong>Location:</strong> Asakusa, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Tokyo ka sab se qadeem aur muqaddas Buddhist temple (645 AD mein qaim shuda).</p><ul><li>Entrance par giant red lantern wala Kaminarimon Gate hai, jiske baad Nakamise Shopping Street aati hai jahan traditional Japanese souvenirs aur snacks farokht hote hain.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Early morning or evening (shops close around 6 PM).</p>"
  },
  {
    title: "30. Shibuya Crossing & Hachiko Memorial",
    content: "<p><strong>Location:</strong> Shibuya, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Duniya ka sab se mashroof tareen pedestrian scramble crossing, jahan har signal par hazaron log aik sath rasta cross karte hain.</p><ul><li>Station exit par mashhoor wafadaar kutte 'Hachiko' ka bronze statue aik iconic meeting point hai.</li></ul><p><strong>Entrance Fee:</strong> Free<br/><strong>Best Time to Visit:</strong> Dusk/Evening to experience the massive crowds and neon lights.</p>"
  },
  {
    title: "31. Meiji Jingu Shrine & Yoyogi Park",
    content: "<p><strong>Location:</strong> Shibuya/Harajuku, Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Emperor Meiji aur Empress Shoken ke naam par banaya gaya Tokyo ka sab se bara Shinto shrine.</p><ul><li>Yeh Tokyo ke darmiyan 170 acres ke ghane qudrati jangal ke andar waqia hai, jo pur-sukoon mahol aur traditional weddings ke liye jana jata hai.</li></ul><p><strong>Entrance Fee:</strong> Shrine (Free), Inner Garden (¥500)<br/><strong>Best Time to Visit:</strong> Early morning for peaceful walks, Autumn for ginkgo trees.</p>"
  },
  {
    title: "32. Akihabara Electric Town",
    content: "<p><strong>Location:</strong> Tokyo, Japan</p><p><strong>Overview & Highlights:</strong> Global anime, manga, gaming, computer hardware aur pop-culture ka markaz.</p><ul><li>Yahan multi-level electronics stores, retro arcade gaming centers, themed cafes aur collectible shops mojood hain.</li></ul><p><strong>Entrance Fee:</strong> Free to explore.<br/><strong>Best Time to Visit:</strong> Sunday afternoons (main street becomes pedestrian-only).</p>"
  },
  {
    title: "33. Hakone Onsen & Lake Ashi",
    content: "<p><strong>Location:</strong> Kanagawa Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Tokyo ke qareeb mashhoor volcanic hot springs (Onsen) aur nature resort town.</p><ul><li>Highlights: Lake Ashi par sightseeing pirate ship cruise, Hakone Ropeway cable car, volcanic valley Owakudani, aur Hakone Shrine ka paani mein khara red Torii gate.</li></ul><p><strong>Entrance Fee:</strong> Hakone Free Pass (Approx. ¥6,100 from Tokyo).<br/><strong>Best Time to Visit:</strong> Autumn for fall foliage and clear Mt. Fuji views.</p>"
  },
  {
    title: "34. Hiroshima Peace Memorial Park & Atomic Bomb Dome",
    content: "<p><strong>Location:</strong> Hiroshima, Japan</p><p><strong>Overview & Highlights:</strong> 1945 ke atomic bomb ke waqiye ki yaad mein banaya gaya aalmi aman ka markaz.</p><ul><li>Genbaku Dome (A-Bomb Dome): Bomb ke markaz ke qareeb bach jane wali wahid tareekhi imarat. Yahan Peace Memorial Museum aur Cenotaph for the Victims waqia hain.</li></ul><p><strong>Entrance Fee:</strong> Park (Free), Museum (¥200)<br/><strong>Best Time to Visit:</strong> Year-round (Spring for cherry blossoms along the river).</p>"
  },
  {
    title: "35. Itsukushima Floating Shrine (Miyajima Island)",
    content: "<p><strong>Location:</strong> Miyajima, Hiroshima, Japan</p><p><strong>Overview & Highlights:</strong> Seto Inland Sea mein waqia muqaddas jazeera.</p><ul><li>Iska iconic red Grand Torii Gate high tide ke waqt samundar ke pani par tairta hua mehsoos hota hai. Yahan azaad hiran, Mount Misen cable car aur khubsurat qadeem temples mojood hain.</li></ul><p><strong>Entrance Fee:</strong> Shrine (¥300)<br/><strong>Best Time to Visit:</strong> Autumn for fall colors, check tide schedules for floating gate.</p>"
  },
  {
    title: "36. Himeji Castle (White Heron Castle)",
    content: "<p><strong>Location:</strong> Hyogo Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Japan ka sab se bara, sab se mehfooz aur khubsurat asil samurai qila (UNESCO World Heritage Site).</p><ul><li>Iski chamakdaar safaid deewaron aur parinday jaise design ki wajah se isay 'White Heron Castle' kaha jata hai. Isme 80 se zyada buildings aur multistoried defensive keep maze structures hain.</li></ul><p><strong>Entrance Fee:</strong> ¥1,000<br/><strong>Best Time to Visit:</strong> Spring (Cherry Blossom season).</p>"
  },
  {
    title: "37. Nikko Toshogu Shrine & National Park",
    content: "<p><strong>Location:</strong> Tochigi Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Tokugawa Shogunate ke bani Tokugawa Ieyasu ka aalishan aur sonay se aarasta mausoleum shrine.</p><ul><li>Iske qareeb ghana pahadi jangal, Lake Chuzenji, aur Japan ki sab se oonchi aabsharon mein se ek Kegon Falls waqia hain.</li></ul><p><strong>Entrance Fee:</strong> ¥1,300<br/><strong>Best Time to Visit:</strong> Autumn for spectacular fall foliage.</p>"
  },
  {
    title: "38. Shirakawa-go & Gokayama Historic Villages",
    content: "<p><strong>Location:</strong> Gifu / Toyama Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Qadeem dehati gaon jo apne makhsoos 'Gassho-zukuri' (namaz ke liye jure hathon jaise) ghaas-phoos ki dhalwaan chatt wale gharon ke liye aalmi satah par mashhoor hain.</p><ul><li>Yeh structure shadeed barf baari ko bardasht karne ke liye banaya gaya tha aur sardiyon mein yeh aik fairy-tale jaisa manzar pesh karta hai.</li></ul><p><strong>Entrance Fee:</strong> Villages (Free), Traditional Houses (¥300-¥400)<br/><strong>Best Time to Visit:</strong> Winter for snow illuminations, or Autumn.</p>"
  },
  {
    title: "39. Jigokudani Monkey Park (Snow Monkeys)",
    content: "<p><strong>Location:</strong> Nagano Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Shiga Kogen pahadon ke jangal mein waqia qudrati park.</p><ul><li>Yeh dunya bhar mein is liye mashhoor hai kyunki yahan ke wild Japanese Macaques (Snow Monkeys) shadeed sardi aur barf mein qudrati garm chashmon (natural onsen pools) mein naha kar sardi bhagate hain.</li></ul><p><strong>Entrance Fee:</strong> ¥800<br/><strong>Best Time to Visit:</strong> Winter (December to March) to see monkeys in the snow.</p>"
  },
  {
    title: "40. Kenroku-en Garden & Kanazawa Castle",
    content: "<p><strong>Location:</strong> Kanazawa, Ishikawa Prefecture, Japan</p><p><strong>Overview & Highlights:</strong> Japan ke 3 sab se azeem aur shandar tareekhi baaghat (Three Great Gardens) mein shumar.</p><ul><li>Yahan qadeem water features, bridges, teahouses, qareeb mojood Kanazawa Castle aur historical Higashi Chaya Geisha district waqia hain.</li></ul><p><strong>Entrance Fee:</strong> ¥320<br/><strong>Best Time to Visit:</strong> Spring (Plum/Cherry blossoms) or Winter (Yukitsuri snow ropes).</p>"
  }
];

let content = fs.readFileSync('src/app/category/[slug]/page.tsx', 'utf8');
const regex = /('attraction-tickets':\s*\{[\s\S]*?extra_sections:\s*\[)([\s\S]*?)(\]\n\s*\},\n\s*'transport')/;
const replacement = `$1${items.map(item => `{ title: ${JSON.stringify(item.title)}, image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?q=80&w=800', content: ${JSON.stringify(item.content)} }`).join(',\n')}$3`;

content = content.replace(regex, replacement);
fs.writeFileSync('src/app/category/[slug]/page.tsx', content, 'utf8');
