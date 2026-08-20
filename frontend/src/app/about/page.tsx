import { Metadata } from 'next';
import Link from 'next/link';
import { 
  ArrowRight, Info, Compass, Globe, Users, Wind, Terminal, 
  Shield, UserPlus, TrendingUp, Star, Laptop, Heart, 
  Briefcase, Award, FastForward, Send, Map
} from 'lucide-react';

export const metadata: Metadata = {
  title: 'About Us | TravelNest',
  description: 'Discover the story, mission, and global impact of the TravelNest platform.',
};

export default function AboutUsPage() {
  return (
    <div style={{ background: '#f8fafc', minHeight: '100vh', paddingBottom: '80px' }}>
      {/* HERO SECTION */}
      <div 
        style={{ 
          background: '#0f172a', 
          padding: '80px 24px', 
          textAlign: 'center', 
          color: '#fff',
          marginBottom: '60px'
        }}
      >
        <h1 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: '20px', letterSpacing: '-1px' }}>The TravelNest Story</h1>
        <p style={{ fontSize: '1.15rem', color: '#cbd5e1', maxWidth: '750px', margin: '0 auto', lineHeight: 1.6 }}>
          We are more than just a booking platform. Discover our radical origins, our uncompromising mission to democratize global travel, and the dedicated humans behind the technology that powers your greatest adventures.
        </p>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px', display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 3fr', gap: '40px', alignItems: 'start' }}>
        
        {/* STICKY SIDEBAR (TABLE OF CONTENTS) */}
        <div style={{ position: 'sticky', top: '100px', background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
          <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Our DNA
          </h4>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><a href="#sec-1" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Our Origin Story</a></li>
            <li><a href="#sec-2" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>The Core Mission</a></li>
            <li><a href="#sec-3" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Global Footprint</a></li>
            <li><a href="#sec-4" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Empowering Local Hosts</a></li>
            <li><a href="#sec-5" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Sustainable Travel</a></li>
            <li><a href="#sec-6" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Engineering Philosophy</a></li>
            <li><a href="#sec-7" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Trust & Safety First</a></li>
            <li><a href="#sec-8" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Diversity & Inclusion</a></li>
            <li><a href="#sec-9" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Economic Impact</a></li>
            <li><a href="#sec-10" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>The Curated Experience</a></li>
            <li><a href="#sec-11" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Remote-First Culture</a></li>
            <li><a href="#sec-12" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Customer Obsession</a></li>
            <li><a href="#sec-13" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Strategic Partnerships</a></li>
            <li><a href="#sec-14" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Awards & Recognition</a></li>
            <li><a href="#sec-15" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Looking to the Future</a></li>
            <li><a href="#sec-16" style={{ color: '#475569', textDecoration: 'none', fontSize: '0.92rem', display: 'block' }}>Join the Journey</a></li>
          </ul>
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="card-panel" style={{ background: '#fff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', color: '#334155', lineHeight: 1.8 }}>
          
          <div style={{ marginBottom: '32px', padding: '16px 20px', background: '#e0f2fe', borderRadius: '8px', borderLeft: '4px solid #0284c7', display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
            <Info size={24} color="#0284c7" style={{ flexShrink: 0, marginTop: '2px' }} />
            <p style={{ margin: 0, color: '#0c4a6e', fontSize: '0.95rem' }}>
              <strong>Who We Are:</strong> TravelNest is a globally distributed technology company obsessed with breaking down the barriers between curious travelers and authentic local experiences. Read our manifesto below.
            </p>
          </div>

          <section id="sec-1" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Map size={28} color="#0284c7" /> Our Origin Story
            </h2>
            <p>The genesis of TravelNest was not born in a sterile corporate boardroom, but rather out of a shared frustration felt by our founders while backpacking across Southeast Asia. They realized a painful paradox: while the internet had made booking massive, generic chain hotels easier than ever, finding and securing an authentic, locally-run experienceâ€”like a hidden cooking class in a Vietnamese alleyway or a private boat tour operated by a third-generation fishermanâ€”was still a terrifyingly archaic process. Travelers were forced to rely on outdated guidebooks, sketchy cash handoffs, and language barriers that often resulted in miscommunication, scams, and missed opportunities. The beauty of truly local travel was hidden behind a wall of logistical friction.</p>
            <p style={{ marginTop: '16px' }}>Armed with nothing but laptops, maxed-out credit cards, and a radical vision, our founders set out to build a digital bridge. They wanted to create a platform that combined the frictionless, deeply secure checkout experience of modern e-commerce with the rugged, unpredictable authenticity of off-the-beaten-path exploration. In the early days, they personally walked the streets of ancient cities, knocking on the doors of local artisans, convincing them to digitize their life's work and trust this new platform. What started as a chaotic, heavily caffeinated startup operating out of a cramped apartment has since exploded into a sprawling global marketplace, but that original scrappy, boots-on-the-ground ethos still violently dictates every single business decision we make today.</p>
          </section>

          <section id="sec-2" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Compass size={28} color="#16a34a" /> The Core Mission
            </h2>
            <p>Our corporate mission is singularly focused and intensely ambitious: to aggressively democratize global travel by making the world's most authentic experiences instantly accessible, mathematically secure, and universally available to anyone with a smartphone. We believe that travel, when stripped of its overly commercialized, tourist-trap veneer, is the most powerful catalyst for human empathy on the planet. By forcing people out of their comfortable, homogenous bubbles and thrusting them into beautiful collisions with foreign cultures, exotic cuisines, and entirely different ways of thinking, we are fundamentally building a more tolerant, interconnected world.</p>
            <p style={{ marginTop: '16px' }}>However, a mission statement is merely a hollow marketing slogan unless it is backed by relentless execution. We measure the success of our mission not just by our quarterly revenue growth, but by the sheer volume of "aha moments" we facilitate daily. Every time a traveler successfully navigates a sprawling Tokyo subway using our localized instructions, every time a family connects deeply with a Maasai warrior on a properly compensated, ethically run safari, and every time a solo traveler feels utterly safe while exploring a new continent, we consider our mission validated. We are not just selling tickets; we are architecting the foundational infrastructure required for humans to safely and joyfully understand one another.</p>
          </section>

          <section id="sec-3" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Globe size={28} color="#8b5cf6" /> Global Footprint
            </h2>
            <p>From the glacial fjords of Norway to the sun-scorched dunes of the Sahara, TravelNestâ€™s operational footprint is truly staggering in its global scale. We currently host over a million meticulously vetted experiences spanning across 190 sovereign nations and territories. We have actively translated our platform into 42 distinct languages, not through cheap, automated AI translations, but via massive teams of localized linguistic experts who understand the cultural nuances and colloquialisms of each specific region. This ensures that a local host in a rural Peruvian village can seamlessly and accurately communicate complex logistical instructions to a traveler from Seoul, South Korea, entirely in their respective native tongues.</p>
            <p style={{ marginTop: '16px' }}>Managing a footprint this massive requires an equally massive technological infrastructure. We operate sprawling, interconnected server clusters strategically positioned across the Americas, Europe, and Asia to guarantee that our platform remains lightning-fast, regardless of whether you are trying to pull up a mobile ticket on a sluggish 3G connection in the Himalayas or via high-speed fiber in Manhattan. But our footprint is not just digital. We maintain active, physical hub offices in major cultural epicentersâ€”including London, Singapore, New York, and Berlinâ€”where our localized operational teams work intimately with municipal governments, tourism boards, and thousands of independent suppliers to ensure our global machine operates in perfect, harmonious synchronization.</p>
          </section>

          <section id="sec-4" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Users size={28} color="#dc2626" /> Empowering Local Hosts
            </h2>
            <p>While travelers are the highly visible consumers of our platform, the independent local hosts, boutique tour operators, and specialized artisans are the undisputed, beating heart of TravelNest. Historically, the global tourism industry has been dominated by massive, vertically integrated conglomerates that swoop into developing nations, extract the vast majority of the tourist capital, and funnel the profits back to offshore tax havens, leaving the local communities impoverished and economically disenfranchised. TravelNest was built specifically to shatter this exploitative paradigm.</p>
            <p style={{ marginTop: '16px' }}>Our entire economic model is designed to aggressively empower the micro-entrepreneur. By providing a rural coffee farmer in Colombia or a third-generation ceramicist in Kyoto with a world-class, multi-lingual digital storefront, secure payment processing, and access to a global audience of millions, we allow them to instantly compete with the massive, heavily funded tour companies. We take a minimal, highly transparent commission on each booking, ensuring that the overwhelming majority of the capital flows directly into the pockets of the local operators. This massive injection of direct capital allows them to hire within their communities, preserve their ancient cultural traditions, and achieve profound financial independence on their own terms, completely bypassing the exploitative legacy middlemen.</p>
          </section>

          <section id="sec-5" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Wind size={28} color="#d97706" /> Sustainable & Ethical Travel
            </h2>
            <p>We are acutely, painfully aware of the devastating environmental and cultural impact that unchecked mass tourism can inflict upon the planet. As a global leader in the travel sector, we refuse to turn a blind eye to the reality of carbon emissions, the erosion of fragile ecosystems, and the suffocating overcrowding of ancient cities. TravelNest is deeply committed to pioneering a fundamentally new paradigm of ethical, highly sustainable exploration. We have aggressively integrated sustainability metrics directly into our core search algorithms, actively promoting and artificially boosting the visibility of tours that utilize zero-emission transport (like sailing or cycling), operators who maintain verified eco-certifications, and experiences that actively give back to local conservation efforts.</p>
            <p style={{ marginTop: '16px' }}>Furthermore, we are combatting the destructive phenomenon of "Overtourism" through intelligent, data-driven load balancing. If our systems detect that a specific hotspot (such as Venice or Machu Picchu) is reaching a critical, suffocating capacity, our algorithms will automatically begin suggesting stunning, culturally identical, but heavily under-visited alternative destinations to our users, actively redistributing the flow of tourist capital to rural areas that desperately need it. We also invest a significant percentage of our annual corporate profits into verified, high-impact carbon sequestering projects, specifically targeting the restoration of global mangrove forests and vital coral reef ecosystems, fighting to ensure the beautiful world we want you to explore actually survives the next century.</p>
          </section>

          <section id="sec-6" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Terminal size={28} color="#06b6d4" /> Our Engineering Philosophy
            </h2>
            <p>At our absolute core, TravelNest is an elite, hardcore engineering and technology company. The seamless, beautiful user interface you interact with is merely the polished tip of a staggering, hyper-complex technological iceberg. Our engineering philosophy is ruthlessly dictated by three uncompromising pillars: Absolute Speed, Zero-Downtime Reliability, and Defensive Security. We operate on a cutting-edge, fully decoupled microservices architecture, deploying thousands of individual, containerized code updates a day without ever taking the platform offline. When you click "Book Now," you are triggering a massive, instantaneous cascade of API calls that verify inventory in real-time, execute complex fraud algorithms, process international currency exchanges, and generate cryptographic tickets in milliseconds.</p>
            <p style={{ marginTop: '16px' }}>We absolutely loathe technical debt and bloated code. Our frontend teams are fanatical about shaving milliseconds off page load times, recognizing that a traveler trying to pull up a crucial map on a weak 3G connection in a foreign jungle cannot afford to wait for unoptimized images to load. We embrace a culture of aggressive experimentation and data-driven chaos engineeringâ€”regularly and intentionally breaking our own internal servers (Red Teaming) to ensure our failover protocols and automated backup systems operate flawlessly under extreme, unpredictable stress. We don't just write code to sell tickets; we write highly elegant, resilient software designed to survive the chaotic reality of global travel.</p>
          </section>

          <section id="sec-7" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield size={28} color="#3b82f6" /> Trust & Safety First
            </h2>
            <p>When you utilize our platform to book a trek deep into the Amazon rainforest or a private homestay in an unfamiliar neighborhood, you are placing immense, profound trust in our systems. We do not take this responsibility lightly. The Trust & Safety division at TravelNest operates with the intensity and rigor of a municipal intelligence agency. Every single supplier attempting to list an experience on our platform must first survive a notoriously grueling, multi-layered vetting process. This is not an automated rubber-stamp; our human compliance officers manually review official business registration documents, verify comprehensive public liability insurance policies, and cross-reference the operator against global watchlists.</p>
            <p style={{ marginTop: '16px' }}>But our commitment to safety does not stop at onboarding. We deploy highly sophisticated Machine Learning (ML) models that silently monitor millions of data points in real-timeâ€”scanning host-guest chat logs for predatory language, analyzing review sentiment for subtle red flags, and immediately flagging any sudden spikes in cancellation rates. If an operator's quality begins to slip, or if a severe safety violation is reported, our emergency response protocols are brutal and instantaneous. The operatorâ€™s account is frozen, all pending payouts are locked, and a deep-dive forensic investigation is launched. We maintain a strict zero-tolerance policy for negligence, harassment, or fraud, ensuring that the bad actors are permanently surgically excised from our ecosystem to protect your peace of mind.</p>
          </section>

          <section id="sec-8" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <UserPlus size={28} color="#14b8a6" /> Diversity, Equity & Inclusion
            </h2>
            <p>We deeply believe that a company attempting to build a product for the entire globe must fundamentally reflect the staggering diversity of the globe within its own walls. TravelNest is fiercely committed to cultivating a corporate environment that aggressively champions diversity, equity, and inclusion (DEI). We actively recruit top-tier engineering, marketing, and operational talent from historically marginalized communities, ensuring that our leadership tables are not dominated by a single, homogenous demographic. When diverse voices, varying socioeconomic backgrounds, and differing cultural viewpoints clash and collaborate, the resulting product is exponentially stronger, more empathetic, and more universally accessible.</p>
            <p style={{ marginTop: '16px' }}>This internal commitment to diversity bleeds directly into our external product design. We have launched massive, highly funded initiatives to specifically amplify, support, and subsidize minority-owned tour operators, indigenous artisans, and female-led hospitality businesses across developing nations. We actively audit our search algorithms to eliminate latent biases, ensuring that smaller, culturally authentic operators receive the exact same algorithmic visibility and promotional weight as massive, well-funded corporate tours. By aggressively leveling the digital playing field, we ensure that the vast economic wealth generated by global tourism is distributed fairly and equitably to the communities that actually create the magic.</p>
          </section>

          <section id="sec-9" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <TrendingUp size={28} color="#be123c" /> Economic Impact
            </h2>
            <p>The macroeconomic impact of the TravelNest platform is profound and highly measurable. By drastically lowering the barrier to entry for micro-entrepreneurs, we have effectively ignited localized economic booms in thousands of rural communities and neglected urban neighborhoods worldwide. When a traveler books a local cooking class through our app, that capital does not simply vanish into a corporate vault. The host uses that money to buy ingredients from the local farmer's market, to hire a neighbor as an assistant, and to pay for their childrenâ€™s education. We call this the "TravelNest Multiplier Effect," and it is a violently powerful engine for grassroots economic stimulation.</p>
            <p style={{ marginTop: '16px' }}>Our internal data science teams continually publish comprehensive transparency reports detailing the exact volume of capital we have successfully routed away from exploitative legacy conglomerates and directly into the hands of independent creators. We take immense pride in knowing that our software architecture has directly facilitated the creation of hundreds of thousands of sustainable, independent jobs globally. By providing these hosts with powerful digital toolsâ€”dynamic pricing engines, algorithmic calendar syncing, and automated tax reportingâ€”we are not merely giving them a temporary gig; we are actively helping them build generational wealth and robust, highly resilient small businesses that can weather local economic downturns.</p>
          </section>

          <section id="sec-10" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Star size={28} color="#6366f1" /> The Curated Experience
            </h2>
            <p>We are waging an aggressive, all-out war against the concept of the generic, soulless "tourist trap." The modern traveler is deeply exhausted by overcrowded buses, scripted monologues, and manufactured authenticity. TravelNest is obsessed with the art of hyper-curation. While we host over a million experiences, we actively reject thousands of applications a week from operators who fail to meet our stringent standards of uniqueness, passion, and local immersion. We don't just want to sell you a ticket to see a famous monument from a distance; we want to connect you with an impassioned, eccentric local historian who holds the keys to the underground crypts beneath that monument.</p>
            <p style={{ marginTop: '16px' }}>To maintain this sky-high standard of quality, we deploy a hybrid model of advanced machine learning and discerning human taste-makers. Our algorithms ruthlessly penalize and bury listings that generate generic, unenthusiastic reviews or suffer from high cancellation rates. Conversely, our global team of "Experience Curators"â€”seasoned travel journalists, cultural anthropologists, and local expatsâ€”manually scour the platform, elevating the most bizarre, fascinating, and deeply authentic experiences to the front page. Whether it's a midnight street-food crawl in Bangkok, a multi-day survival course in the Swedish wilderness, or a private violin concert in a hidden Venetian palazzo, we guarantee that every highly-ranked experience on our platform is fundamentally unforgettable.</p>
          </section>

          <section id="sec-11" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Laptop size={28} color="#0ea5e9" /> Remote-First Culture
            </h2>
            <p>You cannot build a product designed to help people explore the globe if you force your own employees to sit chained to a cubicle in a gray office park for 50 weeks a year. TravelNest operates on a radical, uncompromising "Remote-First" philosophy. We do not care where our employees physically reside, so long as they have a stable internet connection and a burning passion for our mission. Our engineering, design, and marketing teams are scattered across 60 different countries, collaborating asynchronously across massive time zones. This is not a cost-saving measure; it is a profound strategic advantage.</p>
            <p style={{ marginTop: '16px' }}>By hiring globally, we completely shatter the Silicon Valley echo chamber. Our product design is continuously informed by the lived experiences of developers in Nairobi, designers in Buenos Aires, and product managers in Seoul. This ensures our app is universally intuitive, culturally sensitive, and structurally robust in low-bandwidth environments. Furthermore, we actively mandate that our employees utilize the platform, providing them with aggressive travel stipends and unlimited paid time off. We expect our developers to regularly "eat their own dog food," booking tours, interacting with hosts, and discovering UI friction points while actually traveling in the real world, ensuring our software remains brutally grounded in reality.</p>
          </section>

          <section id="sec-12" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Heart size={28} color="#15803d" /> Customer Obsession
            </h2>
            <p>In the highly volatile, unpredictable realm of international travel, things will inevitably go wrong. Flights get grounded, typhoons strike, and people get lost. While many tech companies view customer support as an annoying cost center to be heavily outsourced and automated away via useless chatbots, TravelNest views Customer Support as our most critical, defining feature. We operate under a doctrine of absolute, unyielding "Customer Obsession." When a traveler is stranded in a foreign country at 2:00 AM, confused and terrified, they do not want to read an FAQ page; they want immediate, highly empathetic human intervention.</p>
            <p style={{ marginTop: '16px' }}>We have invested millions into building a sprawling, interconnected global support infrastructure staffed by highly trained, deeply empathetic human agents who possess the unilateral authority to actually fix problems. If a supplier fails to show up, our agents don't just quote policies; they have the corporate credit cards and the authorization to instantly book you a premium alternative tour, order you an Uber to get there, and issue a full refund for the stress caused, all within minutes. We measure the success of our support teams not by how fast they get you off the phone, but by the sheer volume of chaotic nightmares they successfully transform into seamless, highly positive resolutions. We firmly believe that the true measure of our brand is how aggressively we fight for you when everything goes wrong.</p>
          </section>

          <section id="sec-13" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Briefcase size={28} color="#64748b" /> Strategic Partnerships
            </h2>
            <p>While TravelNest is a fiercely independent, highly autonomous technology company, we recognize that we cannot unilaterally fix the fractured global travel industry in a vacuum. To accelerate our mission and dramatically expand our logistical capabilities, we have aggressively forged highly strategic, deeply integrated partnerships with some of the most powerful entities in the aviation, hospitality, and fintech sectors. By linking our APIs directly into the backend mainframes of major international airlines, global hotel chains, and ride-sharing giants, we are actively architecting a future where your entire journey is seamlessly interconnected.</p>
            <p style={{ marginTop: '16px' }}>Imagine booking a remote hiking tour on TravelNest, and our system automatically coordinating with the airline to adjust your flight in case of a weather delay, while simultaneously alerting your boutique hotel to prepare a late-night dinner upon your arrival. This level of hyper-coordination is only possible through deep, trusting corporate alliances. Furthermore, we partner extensively with national governments, municipal tourism boards, and global conservation NGOs (Non-Governmental Organizations). These alliances allow us to collaboratively tackle massive systemic issues like overtourism, ensuring that our influx of travelers actively supports local infrastructure and environmental preservation efforts, rather than overwhelming and destroying the very destinations we love.</p>
          </section>

          <section id="sec-14" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Award size={28} color="#4f46e5" /> Awards & Recognition
            </h2>
            <p>While our true validation always comes directly from the glowing, five-star reviews left by exhausted but exhilarated travelers, we are deeply humbled by the staggering amount of critical acclaim and industry validation TravelNest has garnered since our inception. We have been consecutively ranked as the "Global Travel Innovator of the Year" by elite technology publications, lauded for completely disrupting the stagnant, highly monopolized online travel agency (OTA) space with our host-centric economic model. Our mobile application has repeatedly won prestigious design awards for its stunning, highly intuitive user interface that manages to make booking a complex, multi-day expedition feel as effortless as ordering a cup of coffee.</p>
            <p style={{ marginTop: '16px' }}>Beyond the glitzy technology awards, we are most fiercely proud of the recognition we have received from global human rights and environmental organizations. TravelNest has been officially recognized by the United Nations World Tourism Organization (UNWTO) for our aggressive, highly effective initiatives to promote sustainable eco-tourism and our unwavering commitment to ensuring that the massive profits of global travel are distributed fairly to marginalized, rural communities. These heavy, glass trophies sitting in our corporate lobbies are not just vanity metrics; they serve as a constant, heavy reminder of the massive ethical responsibility we bear as the custodians of the world's premier travel platform.</p>
          </section>

          <section id="sec-15" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FastForward size={28} color="#059669" /> Looking to the Future
            </h2>
            <p>We are completely, fundamentally obsessed with the future. While we are incredibly proud of the massive global ecosystem we have built today, we view our current platform merely as the foundational stepping stone for what is to come. The next decade of travel will be radically, unrecognizably transformed by the explosive convergence of Artificial Intelligence, Augmented Reality (AR), and decentralized blockchain infrastructure, and TravelNest is heavily investing hundreds of millions of dollars into our secretive R&D (Research and Development) labs to ensure we are the ones leading this violent disruption.</p>
            <p style={{ marginTop: '16px' }}>We envision a very near future where our AI does not just recommend tours, but acts as a hyper-intelligent, predictive digital conciergeâ€”automatically re-routing your itinerary in real-time to avoid a sudden transit strike in Paris, or instantly translating a complex local dialect into your earpiece while you bargain in a bustling Marrakech souk. We are actively prototyping Augmented Reality layers that will allow you to hold your phone up to ancient ruins in Athens and watch them digitally reconstruct themselves in real-time, narrated by the localized voice of a virtual historian. However, despite this aggressive push into science-fiction technology, our core ethos will never waver. Technology will only ever be used to remove the frustrating logistical friction of travel, constantly amplifyingâ€”never replacingâ€”the profound, irreplaceable magic of authentic human connection.</p>
          </section>

          <section id="sec-16" style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Send size={28} color="#0284c7" /> Join the Journey
            </h2>
            <p>TravelNest is not a closed, secretive corporate monolith; it is a sprawling, chaotic, and incredibly beautiful global movement, and we want you to be a fundamental part of it. Whether you are a curious traveler desperately seeking to break out of your comfort zone, an impassioned local artisan hoping to share your ancient craft with a global audience, or a brilliant software engineer looking to write code that actually changes the physical world, there is a place for you within our ecosystem. We are constantly seeking out the dreamers, the relentlessly curious, and the deeply empathetic to join our ranks and push our mission forward.</p>
            <p style={{ marginTop: '16px' }}>If you align with our radical vision of a borderless, deeply empathetic, and highly accessible world, we invite you to take the plunge. Book that terrifyingly exotic tour youâ€™ve been dreaming about for years. Apply to become a highly-rated local host and take control of your financial destiny. Or visit our careers portal and apply to join our engineering, design, or operational teams. The world is massive, breathtakingly complex, and waiting to be explored. We have built the ultimate tool to help you navigate it safely. The only question remaining is: where exactly are you going to go next?</p>
          </section>

          <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginTop: '40px' }}>
            <div>
              <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '4px' }}>Want to work with us?</h4>
              <p style={{ margin: 0, fontSize: '0.95rem', color: '#64748b' }}>Check out our open roles and join the remote-first team.</p>
            </div>
            <Link href="mailto:support@travelnest.com" className="btn-primary" style={{ padding: '10px 24px', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              View Careers <ArrowRight size={16} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
