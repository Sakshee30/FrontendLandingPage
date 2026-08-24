import { Link } from 'react-router-dom';
import { CtaSection } from '@/components/sections/CtaSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { PricingCards } from '@/components/sections/PricingSections';
import { Testimonials } from '@/components/sections/Testimonials';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageTransition } from '@/components/ui/PageTransition';
import { ComingSoonBanner } from '@/components/sections/ComingSoonBanner';
import { FeatureVideoCarousel } from '@/components/sections/FeatureVideoCarousel';

const asset = (name: string) => `/figma-assets/${name}`;

const landingFaqs = [
  { question: 'Is there a free plan?', answer: 'Yes. The Starter plan includes 10 short links, 1,000 clicks per month, basic analytics, one workspace, and five QR codes.' },
  { question: 'Who can use Ziplin?', answer: 'Ziplin is built for creators, marketers, agencies, businesses, and anyone who needs branded, measurable links.' },
  { question: 'What analytics does Ziplin provide?', answer: 'Ziplin reports clicks, scans, devices, locations, referrers, campaign parameters, and performance over time.' },
  { question: 'Is my data secure?', answer: 'Yes. Ziplin uses secure links, controlled destinations, workspace permissions, and reliable infrastructure.' },
];

const productCards = [
  ['URL Shortener', 'Create branded short links in one click. Add custom slugs, expiry dates, and password protection.', 'bg-[#f0fdf4] border-[#dcfce7]', 'text-[#16a34a]', '/features/url-shortener'],
  ['Dynamic QR Codes', 'Generate scannable QR codes for any link. Update the destination anytime without reprinting.', 'bg-[#fffcf0] border-[#fef3c7]', 'text-[#d97706]', '/features/qr-code-generator'],
  ['Bio Pages', 'Build stunning link-in-bio pages in minutes. Perfect for creators, brands, and portfolios.', 'bg-[#f5f3ff] border-[#ddd6fe]', 'text-[#7c3aed]', '/features/bio-pages'],
  ['Deep Analytics', "See who clicks, where they're from, what device they use, and when — with real-time dashboards.", 'bg-[#f0fdf4] border-[#dcfce7]', 'text-[#16a34a]', '/features/campaigns'],
  ['Campaign Tracking', "Auto-append UTM parameters and measure every campaign's performance from one place.", 'bg-[#fffcf0] border-[#fef3c7]', 'text-[#d97706]', '/features/utm-tracking'],
  ['Custom Domains', 'Use your own branded domain for all your short links to build trust and recognition.', 'bg-[#f5f3ff] border-[#ddd6fe]', 'text-[#7c3aed]', '/features/url-shortener'],
] as const;

const steps = [
  ['01', 'Paste your link', 'Drop in any URL. Ziplin shortens, brands, and preps it for tracking — QR code included, automatically.', 'bg-[#fffcf0]'],
  ['02', 'Post it anywhere', 'Bio, ad, email, packaging — one link, works everywhere your audience already is.', 'bg-[#f0fdf4]'],
  ['03', 'Watch the numbers move', "Real-time clicks, devices, and locations. See what's popping the moment it does.", 'bg-[#f5f3ff]'],
] as const;

const commitments = [
  ['Connectivity', 'Every connection matters', 'Ziplin transforms ordinary URLs into intelligent digital assets that strengthen communication across every platform.', 'bg-[#fffcf0]'],
  ['Insight', 'Data drives decisions', 'Every click tells a story. Ziplin provides accurate, real-time analytics so you can optimize with confidence.', 'bg-[#f0fdf4]'],
  ['Reliability', 'Trust is the foundation', 'From small campaigns to enterprise operations, every link is secure, fast, and consistently available.', 'bg-[#f5f3ff]'],
] as const;

export function LandingPage() {
  return (
    <PageTransition>
      <div className="landing-page">
        <LandingHero />
        <IntegrationStrip />
        <DashboardSection />
        <FeaturesSection />
        <HowItWorks />
        <SolutionsMosaic />
        <Commitments />
        <PricingCards />
        <FaqSection items={landingFaqs} />
        <Testimonials />
        <CtaSection />
        <SiteFooter />
      </div>
    </PageTransition>
  );
}

function LandingHero() {
  return (
    <>
      <ComingSoonBanner />
      <FeatureVideoCarousel />
    </>
  );
}

function IntegrationStrip() {
  const platforms = [
    ['Webflow', 'webflow.svg'], ['Instagram', 'instagram.svg'], ['Linkedin', 'linkedin.svg'],
    ['Youtube', 'youtube.svg'], ['Hub spot', 'hubspot.svg'], ['Spotify', 'spotify.svg'],
  ];
  return (
    <section className="bg-white">
      <div className="mx-auto grid min-h-40 max-w-[1280px] items-center gap-8 px-8 py-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] lg:gap-16">
        <h2 className="font-display text-[38px] leading-[1.15] text-ziplin-navy sm:text-[48px] sm:leading-[60px]">
          Integrates seamlessly with <span className="text-ziplin-yellow">your stack</span>
        </h2>
        <div className="grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-3 lg:gap-y-8">
          {platforms.map(([name, icon]) => (
            <div key={name} className="flex h-14 min-w-0 items-center justify-center gap-2 rounded-md bg-white px-2 text-[#475569]">
              <img src={asset(icon)} alt="" className="size-8 object-contain" />
              <span className="text-base leading-6 sm:text-[20px] sm:leading-[27px]">{name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DashboardSection() {
  return (
    <section className="relative mx-auto min-h-[936px] max-w-[1280px] overflow-hidden bg-[linear-gradient(180deg,#e7e9eb_0%,#a8cff1_100%)] px-8 pt-24" style={{ clipPath: 'polygon(6% 0,94% 0,100% 7%,100% 93%,94% 100%,6% 100%,0 93%,0 7%)' }}>
      <h2 className="mx-auto max-w-[768px] text-center font-display text-[38px] leading-tight text-ziplin-blue sm:text-[48px] sm:leading-[60px]">
        Link management is now <span className="text-ziplin-yellow">powerful.</span>
      </h2>
      <img src={asset('analytics-glow.svg')} alt="" className="pointer-events-none absolute -left-36 top-48 size-[485px] opacity-75" />
      <img src={asset('analytics-glow.svg')} alt="" className="pointer-events-none absolute -right-36 bottom-20 size-[485px] opacity-75" />
      <div className="relative mx-auto mt-16 aspect-[912/608] w-full max-w-[912px] overflow-hidden rounded-[24px] border border-[#052b67]/75">
        <img src={asset('links-dashboard.png')} alt="Ziplin links management dashboard" className="absolute left-0 top-[-6.18%] h-[106.2%] w-full object-cover" />
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="mx-auto min-h-[872px] max-w-[1280px] bg-white px-8 pb-20 pt-4">
      <div className="text-center">
        <Eyebrow>FEATURE</Eyebrow>
        <h2 className="mt-16 font-display text-[38px] leading-tight text-ziplin-blue sm:text-[48px] sm:leading-[60px]">
          Everything your links need to <span className="text-ziplin-yellow">go off</span>
        </h2>
        <p className="mx-auto mt-6 max-w-[648px] text-base leading-6 text-ziplin-blue sm:text-[24px] sm:leading-[27px]">
          From the first click to the full campaign report, Ziplin gives every URL a job — and the receipts to prove it's working.
        </p>
      </div>
      <div className="mt-16 grid gap-x-12 gap-y-12 md:grid-cols-2 xl:grid-cols-3">
        {productCards.map(([title, description, tone, accent, to]) => (
          <Link key={title} to={to} className={`flex min-h-[224px] flex-col gap-4 rounded-[24px] border p-8 shadow-[12px_12px_0_rgba(0,0,0,.05)] transition-transform hover:-translate-y-1 ${tone}`}>
            <span className={`pt-4 text-xs font-extrabold uppercase tracking-[1.2px] ${accent}`}>WITH ZIPLIN</span>
            <h3 className="font-body text-[24px] leading-[27px] text-[#0f254e]">{title}</h3>
            <p className="pt-1 text-base leading-6 text-[#0f254e]/70">{description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section className="mx-auto min-h-[1104px] max-w-[1280px] bg-white px-8 py-14">
      <div className="text-center">
        <Eyebrow>HOW IT WORKS</Eyebrow>
        <h2 className="mx-auto mt-4 max-w-[696px] font-display text-[38px] leading-tight text-ziplin-navy sm:text-[48px] sm:leading-[60px]">
          Three steps, <span className="text-ziplin-yellow">zero learning curve.</span>
        </h2>
      </div>
      <div className="mt-[88px] grid items-center gap-12 lg:grid-cols-[360px_minmax(0,1fr)] lg:gap-16">
        <div className="space-y-10">
          {steps.map(([number, title, description, tone]) => (
            <article key={number} className={`min-h-[224px] rounded-[20px] p-8 shadow-[12px_12px_0_#0a0e1a] ${tone}`}>
              <span className="flex size-12 items-center justify-center rounded-full bg-[linear-gradient(120deg,#ffc60a_8%,#ff57c6_92%)] font-mono text-base font-bold text-[#160a20]">{number}</span>
              <h3 className="mt-6 font-body text-[20px] leading-[27px] text-black">{title}</h3>
              <p className="mt-2 text-base leading-6 text-black">{description}</p>
            </article>
          ))}
        </div>
        <div className="aspect-[595/755] w-full overflow-hidden rounded-[30px] bg-[#e5e5e3] shadow-[12px_12px_4px_rgba(0,0,0,.25)]">
          <video
            src="/figma-assets/how-it-works.mp4"
            aria-label="How Ziplin works"
            className="h-full w-full object-cover"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        </div>
      </div>
    </section>
  );
}

function SolutionsMosaic() {
  const tiles = [
    ['Content creator', 'solution-content.png', 'bg-[#ff7043]', 'text-white', '/solutions/content-creators'],
    ['Influencer', 'solution-influencer-hq.png', 'bg-[#00bcd4]', 'text-white', '/solutions/influencers'],
    ['Freelancer', 'solution-freelancer.png', 'bg-[#e91e63]', 'text-white', '/solutions/digital-marketing'],
    ['Insurance', 'solution-insurance.png', 'bg-[#ffc107]', 'text-[#001031]', '/solutions/affiliate-marketing'],
    ['Media & Entertainment', 'solution-media.png', 'bg-[#8bc34a]', 'text-[#001031]', '/solutions/media-entertainment'],
    ['Retail & Consumer Tech', 'solution-retail.png', 'bg-[#5c6bc0]', 'text-white', '/solutions/ecommerce'],
  ];
  return (
    <section className="mx-auto min-h-[960px] max-w-[1280px] bg-white px-8 py-14">
      <div className="text-center">
        <h2 className="font-display text-[38px] leading-tight text-ziplin-ink sm:text-[48px] sm:leading-[60px]">Our Industry Expertise and <span className="text-ziplin-yellow">Solutions</span></h2>
        <p className="mx-auto mt-4 max-w-[976px] text-[20px] leading-[27px] text-ziplin-ink">Creating business value at the intersection of your industry transformation and today’s latest technology innovation.</p>
      </div>
      <div className="mt-12 rounded-[24px] bg-[rgba(253,195,60,.1)] px-6 py-8">
        <div className="mx-auto grid max-w-[896px] overflow-hidden rounded-xl sm:grid-cols-2 lg:grid-cols-3">
          {tiles.map(([title, image, tone, textColor, to]) => (
            <Link key={title} to={to} className={`group relative min-h-[312px] overflow-hidden p-8 ${tone}`}>
              <img src={asset(image)} alt="" className="absolute inset-0 h-full w-full object-cover opacity-85 transition duration-500 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ziplin-navy/50 via-ziplin-navy/10 to-transparent" />
              <h3 className={`absolute bottom-8 left-8 right-6 font-display text-[34px] leading-[1.08] drop-shadow-[0_2px_8px_rgba(0,0,0,.35)] sm:text-[40px] lg:text-[44px] lg:leading-[54px] ${textColor}`}>{title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function Commitments() {
  return (
    <section className="mx-auto flex min-h-[448px] max-w-[1280px] flex-col px-8">
      <div className="text-center">
        <Eyebrow>WHY ZIPLIN</Eyebrow>
        <h2 className="mt-4 font-display text-[38px] leading-tight text-ziplin-blue sm:text-[48px] sm:leading-[60px]">Built on <span className="text-ziplin-yellow">three commitments</span></h2>
      </div>
      <div className="mt-[88px] grid gap-6 lg:grid-cols-3">
        {commitments.map(([label, title, description, tone]) => (
          <article key={label} className={`min-h-[232px] overflow-hidden rounded-[18px] border-[2.4px] border-[#0a0e1a] px-8 py-8 shadow-[7px_7px_0_#0a0e1a] ${tone}`}>
            <span className="text-xs leading-[15px] text-ziplin-navy">{label}</span>
            <h3 className="mt-4 font-display text-[24px] leading-9 text-[#1a1a1a]">{title}</h3>
            <p className="mt-4 text-base leading-6 text-black">{description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function Eyebrow({ children }: { children: string }) {
  return (
    <span className="inline-flex h-10 items-center justify-center gap-2 rounded-full bg-white px-5 text-base leading-6 text-[#001845] shadow-[1px_1px_.05px_rgba(0,0,0,.25)]">
      <span className="size-2 rounded-full bg-[#ffc83d]" />{children}
    </span>
  );
}
