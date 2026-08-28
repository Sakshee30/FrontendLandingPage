import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, Check, Link2, QrCode, Send, UploadCloud } from 'lucide-react';
import { useMemo, useState } from 'react';
import type { FeatureDefinition } from '@/data/types';
import { ButtonLink } from '@/components/ui/Button';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

type HeroVisual = {
  source: string;
  width: number;
  height: number;
  eyebrow?: string;
  primaryCta?: string;
};

const featureHeroVisuals: Record<FeatureDefinition['slug'], HeroVisual> = {
  'url-shortener': {
    source: '/figma-assets/feature-hero-url-shortener.mp4',
    width: 607,
    height: 506,
    eyebrow: 'URL SHORTENER',
  },
  'qr-code-generator': {
    source: '/figma-assets/feature-hero-qr-code.mp4',
    width: 607,
    height: 506,
    eyebrow: 'QR CODE GENERATOR',
    primaryCta: 'Start for free',
  },
  '2d-barcode': {
    source: '/figma-assets/feature-hero-2d-barcode.mp4',
    width: 607,
    height: 506,
    eyebrow: '2D BARCODE',
    primaryCta: 'Start for free',
  },
  'bio-pages': {
    source: '/figma-assets/feature-hero-bio-pages.mp4',
    width: 607,
    height: 506,
    eyebrow: 'BIO PAGES',
    primaryCta: 'Claim your page',
  },
  'utm-tracking': {
    source: '/figma-assets/feature-hero-utm-tracking.mp4',
    width: 607,
    height: 506,
    eyebrow: 'UTM TRACKING',
    primaryCta: 'Start for free',
  },
  'file-sharing': {
    source: '/figma-assets/feature-hero-file-sharing.mp4',
    width: 660,
    height: 371,
    eyebrow: 'FILE SHARING',
    primaryCta: 'Start sharing',
  },
  campaigns: {
    source: '/figma-assets/feature-hero-campaigns.mp4',
    width: 607,
    height: 506,
    eyebrow: 'CAMPAIGNS',
    primaryCta: 'Start for free',
  },
  webhooks: {
    source: '/figma-assets/feature-hero-webhooks.mp4',
    width: 607,
    height: 506,
    eyebrow: 'WEBHOOKS',
    primaryCta: 'Start for free',
  },
  retargeting: {
    source: '/figma-assets/feature-hero-retargeting.mp4',
    width: 607,
    height: 506,
    eyebrow: 'RETARGETING',
    primaryCta: 'Start for free',
  },
};

const heroEnter = { duration: 0.5, ease: 'easeOut' as const };

function FeatureHeroTitle({ feature }: { feature: FeatureDefinition }) {
  switch (feature.slug) {
    case 'url-shortener':
      return <><span className="lg:block">Every click, connected</span><span className="text-ziplin-yellow">with confidence.</span></>;
    case 'qr-code-generator':
      return <><span className="lg:block">Dynamic <span className="text-ziplin-yellow">QR Codes</span></span><span>that evolve with you</span></>;
    case '2d-barcode':
      return <><span className="lg:block">Beyond the Point of Sale:</span><span>Ziplin <span className="text-ziplin-yellow">2D Barcodes.</span></span></>;
    case 'bio-pages':
      return <>Turn followers into fans with <span className="text-ziplin-yellow">one link</span></>;
    case 'utm-tracking':
      return <><span className="lg:block">Track every link</span><span className="lg:block">with Powerful Link</span><span className="text-ziplin-yellow">Analytics</span></>;
    case 'file-sharing':
      return <>Share files <span className="text-ziplin-yellow">securely</span>, without the hassle</>;
    case 'webhooks':
      return <><span className="lg:block">Integrate Ziplin with</span><span>your <span className="text-ziplin-yellow">workflow</span></span></>;
    default:
      return <>{feature.headline} <span className="text-ziplin-yellow">{feature.accent}</span></>;
  }
}

export function FeatureHero({ feature }: { feature: FeatureDefinition }) {
  const visual = featureHeroVisuals[feature.slug];
  const isShortener = feature.slug === 'url-shortener';
  const isFileSharing = feature.slug === 'file-sharing';

  return (
    <section className="figma-grid relative overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1252px] px-5 py-12 sm:px-8 sm:py-14 lg:px-0 lg:pb-[70px] lg:pt-[51px]">
        <div className={`grid items-center gap-8 lg:min-h-[588px] lg:gap-[22px] ${isFileSharing ? 'lg:grid-cols-[minmax(0,564px)_minmax(0,660px)]' : 'lg:grid-cols-[minmax(0,564px)_minmax(0,607px)]'}`}>
          <motion.div
            key={`${feature.slug}-copy`}
            initial={{ opacity: 0, x: -560 }}
            animate={{ opacity: 1, x: 0 }}
            transition={heroEnter}
            className="relative z-10"
          >
            <SectionEyebrow>{visual.eyebrow ?? feature.eyebrow}</SectionEyebrow>
            <h1 className={`display-1 mt-4 text-ziplin-navy ${isShortener ? 'max-w-[580px]' : 'max-w-[604px]'}`}>
              <FeatureHeroTitle feature={feature} />
            </h1>
            {isShortener ? <p className="mt-5 max-w-[430px] text-base leading-6 text-[#444651]">Create, share, and track short links and QR Codes with institutional grade security. Scale your engagement through data-driven precision.</p> : <p className="mt-5 max-w-[512px] text-lg leading-[26px] text-[#444651] sm:text-[20px]">{feature.description}</p>}
            {isShortener ? (
              <div className="mt-8"><ShortenerDemo /></div>
            ) : (
              <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:gap-[33px]">
                <ButtonLink to="/pricing" size="md" className="w-full sm:w-[200px]">{visual.primaryCta ?? feature.primaryCta}</ButtonLink>
                <ButtonLink to="/demo" variant="outline" size="md" className="w-full sm:w-[200px]">View demo</ButtonLink>
              </div>
            )}
          </motion.div>

          <motion.div
            key={`${feature.slug}-mascot`}
            initial={{ opacity: 0, x: '85vw', y: '65vh', rotate: 180 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: 0 }}
            transition={heroEnter}
            className="relative ml-auto w-full self-center"
            style={{ maxWidth: visual.width }}
          >
            <div className="relative w-full" style={{ aspectRatio: `${visual.width} / ${visual.height}` }}>
              <video
                src={visual.source}
                aria-label={`${feature.name} animated feature visual`}
                className="relative h-full w-full bg-transparent object-contain mix-blend-multiply [filter:contrast(1.18)_brightness(1.12)]"
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function WindowDots() {
  return <div className="flex gap-1.5"><span className="size-2.5 rounded-full border border-ziplin-blue bg-[#ff4fa0]" /><span className="size-2.5 rounded-full border border-ziplin-blue bg-[#ffc60a]" /><span className="size-2.5 rounded-full border border-ziplin-blue bg-[#b4ff4f]" /></div>;
}

function DemoShell({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={`screen-card max-w-[680px] p-5 sm:p-[30px] ${className}`}>
      <div className="flex items-center justify-between"><p className="font-mono text-xs font-bold uppercase tracking-[.14em] text-ziplin-blue">{label}</p><WindowDots /></div>
      {children}
    </div>
  );
}

function ShortenerDemo() {
  const [url, setUrl] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  return (
    <form className={`flex h-[56px] w-full max-w-[540px] items-center gap-1 rounded-2xl border-2 bg-white p-[2px] shadow-[0_4px_12px_rgba(8,28,69,.12)] transition-[border-color,box-shadow] hover:border-[#f4b400] ${isFocused || url ? 'border-[#f4b400] shadow-[0_0_0_3px_rgba(244,180,0,.16)]' : 'border-[#c9d2df]'}`} onSubmit={(event) => event.preventDefault()}>
      <label className="flex h-10 min-w-0 flex-1 items-center gap-3 rounded-xl bg-[#f5f6f7] px-3 text-[#8190a8]">
        <Link2 className="size-4 shrink-0" />
        <input value={url} onChange={(event) => setUrl(event.target.value)} onFocus={() => setIsFocused(true)} onBlur={() => setIsFocused(false)} className="min-w-0 flex-1 border-0 bg-transparent text-sm text-ziplin-navy shadow-none placeholder:text-[#a0a9b8]" style={{ outline: 'none' }} placeholder="Paste your long link here..." />
      </label>
      <button className="flex h-10 min-w-[120px] items-center justify-center gap-2 rounded-xl bg-ziplin-yellow px-4 text-sm font-semibold text-ziplin-navy">Shorten <span aria-hidden="true">→</span></button>
    </form>
  );
}

function QrPattern({ className = '' }: { className?: string }) {
  const cells = useMemo(() => Array.from({ length: 121 }, (_, i) => ((i * 17 + Math.floor(i / 11) * 7) % 13) < 6), []);
  return <div className={`grid grid-cols-11 gap-[2px] bg-white p-3 ${className}`}>{cells.map((on, i) => <i key={i} className={on ? 'aspect-square bg-ziplin-navy' : 'aspect-square bg-white'} />)}</div>;
}

function QrDemo() {
  const [style, setStyle] = useState(0);
  return <DemoShell label="Dynamic QR generator"><div className="mt-5 grid gap-5 sm:grid-cols-[1fr_180px]"><div className="space-y-3"><input className="h-11 w-full rounded-lg bg-ziplin-blue/[.08] px-4 text-sm" defaultValue="https://ziplin.io/spring-sale" /><div className="grid grid-cols-3 gap-2">{['Classic', 'Dots', 'Rounded'].map((x, i) => <button key={x} onClick={() => setStyle(i)} className={`rounded-lg border px-2 py-2 text-xs ${style === i ? 'border-ziplin-blue bg-ziplin-blue text-white' : 'border-[#d8deea]'}`}>{x}</button>)}</div><button className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#0a0e1a] bg-[#ffc60a] font-semibold"><QrCode className="size-4" /> Generate QR</button></div><motion.div key={style} initial={{ scale: .9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className={`rounded-xl border-2 border-ziplin-navy bg-white p-2 ${style === 1 ? 'rounded-[28px]' : ''}`}><QrPattern /></motion.div></div></DemoShell>;
}

function BarcodeDemo() {
  const [updated, setUpdated] = useState(false);
  return <DemoShell label="2D barcode studio"><div className="mt-5 grid gap-5 sm:grid-cols-[1fr_220px]"><div><label className="text-xs text-[#69738a]">Product destination</label><input className="mt-2 h-11 w-full rounded-lg bg-ziplin-blue/[.08] px-4 text-sm" defaultValue="store.example.com/product/2401" /><button onClick={() => setUpdated(!updated)} className="mt-3 h-11 w-full rounded-lg border-2 border-[#0a0e1a] bg-[#ffc60a] font-semibold">{updated ? 'Destination updated ✓' : 'Update destination'}</button><p className="mt-4 text-xs leading-5 text-[#66718a]">The printed code stays valid while the connected experience changes.</p></div><div className="rounded-xl border border-[#d7deea] bg-white p-4"><div className="flex h-[145px] items-stretch gap-[3px]">{Array.from({length: 36}, (_, i) => <i key={i} className="bg-ziplin-navy" style={{ width: `${(i * 7) % 4 + 2}px`, opacity: i % 6 === 0 ? .55 : 1 }} />)}</div><p className="mt-2 text-center font-mono text-[11px] tracking-[.22em]">8 901234 567890</p></div></div></DemoShell>;
}

function BioDemo() {
  const [theme, setTheme] = useState(0);
  const themes = ['from-[#1b3265] to-[#5e75e8]', 'from-[#8a4baf] to-[#f193c6]', 'from-[#034c3c] to-[#35c28a]'];
  return <DemoShell label="Bio page builder"><div className="mt-5 grid gap-5 sm:grid-cols-[1fr_190px]"><div><p className="text-sm text-[#59657d]">Choose a theme</p><div className="mt-3 flex gap-3">{themes.map((themeClass, i) => <button key={themeClass} onClick={() => setTheme(i)} className={`size-12 rounded-xl bg-gradient-to-br ${themeClass} ${theme === i ? 'ring-4 ring-ziplin-yellow/50' : ''}`} />)}</div><div className="mt-5 space-y-2">{['Latest video', 'My newsletter', 'Shop creator picks'].map(x => <div key={x} className="rounded-lg border border-[#dce3ee] bg-white p-3 text-sm">{x}</div>)}</div></div><motion.div key={theme} initial={{ opacity: .5, rotateY: 15 }} animate={{ opacity: 1, rotateY: 0 }} className={`mx-auto w-[170px] rounded-[28px] border-[6px] border-[#0a0e1a] bg-gradient-to-b ${themes[theme]} p-4 text-center text-white shadow-soft`}><div className="mx-auto size-14 rounded-full border-2 border-white bg-[#ffc60a]" /><strong className="mt-3 block">Chloe Creates</strong><span className="text-[10px] text-white/70">video • design • life</span>{['Watch now', 'Creator shop', 'Book me'].map(x => <div key={x} className="mt-3 rounded-full bg-white px-3 py-2 text-[10px] text-ziplin-navy">{x}</div>)}</motion.div></div></DemoShell>;
}

function UtmDemo() {
  const [generated, setGenerated] = useState(false);
  return <DemoShell label="UTM link builder"><div className="mt-5 grid gap-3 sm:grid-cols-2"><Field label="Source" value="newsletter" /><Field label="Medium" value="email" /><Field label="Campaign" value="spring_launch" /><Field label="Content" value="hero_cta" /></div><button onClick={() => setGenerated(true)} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#0a0e1a] bg-[#ffc60a] font-semibold"><Link2 className="size-4" /> Build tracked link</button><AnimatePresence>{generated ? <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-lg border border-dashed border-ziplin-blue bg-white p-3 font-mono text-[11px] leading-5 text-ziplin-blue">ziplin.to/spring?utm_source=newsletter&amp;utm_medium=email&amp;utm_campaign=spring_launch</motion.div> : null}</AnimatePresence></DemoShell>;
}

function Field({ label, value }: { label: string; value: string }) { return <label className="text-xs text-[#6a758d]">{label}<input defaultValue={value} className="mt-1 block h-10 w-full rounded-lg bg-ziplin-blue/[.08] px-3 text-sm text-ziplin-blue" /></label>; }

function FileDemo() {
  const [progress, setProgress] = useState(0);
  const start = () => { setProgress(8); [28, 55, 78, 100].forEach((v, i) => window.setTimeout(() => setProgress(v), (i + 1) * 300)); };
  return <DemoShell label="Secure file sharing"><div className="mt-5 rounded-xl border-2 border-dashed border-[#91a3c6] bg-white p-8 text-center"><UploadCloud className="mx-auto size-10 text-ziplin-blue" /><strong className="mt-3 block">Drop a large file here</strong><p className="mt-1 text-xs text-[#6e7890]">Videos, presentations, PDFs, and archives</p><button onClick={start} className="mt-4 rounded-lg bg-[#ffc60a] px-5 py-2 text-sm font-semibold">Choose file</button></div>{progress > 0 ? <div className="mt-4"><div className="flex justify-between text-xs"><span>campaign-assets.zip</span><strong>{progress}%</strong></div><div className="mt-2 h-2 overflow-hidden rounded-full bg-[#e9eef6]"><motion.div animate={{ width: `${progress}%` }} className="h-full bg-ziplin-blue" /></div>{progress === 100 ? <p className="mt-2 flex items-center gap-2 text-xs text-[#198754]"><Check className="size-4" /> Secure link ready</p> : null}</div> : null}</DemoShell>;
}

function CampaignDemo() {
  const [launched, setLaunched] = useState(false);
  return <DemoShell label="Campaign workspace"><div className="mt-5 grid grid-cols-3 gap-3">{[['Ideas', ['Creator launch', 'Spring QR']], ['Scheduled', ['Email nurture', 'Retail display']], ['Live', ['Summer sale', 'Influencer kit']]].map(([column, cards]) => <div key={column as string} className="rounded-lg bg-ziplin-blue/[.05] p-2"><strong className="text-xs">{column}</strong><div className="mt-2 space-y-2">{(cards as string[]).map(card => <div key={card} className="rounded-md border bg-white p-2 text-[11px] shadow-sm">{card}</div>)}</div></div>)}</div><button onClick={() => setLaunched(true)} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#0a0e1a] bg-[#ffc60a] font-semibold"><Send className="size-4" /> {launched ? 'Campaign launched ✓' : 'Launch campaign'}</button></DemoShell>;
}

function WebhookDemo() {
  const [sent, setSent] = useState(false);
  return <DemoShell label="Webhook delivery"><div className="mt-5 overflow-hidden rounded-lg bg-[#081c45] p-4 font-mono text-[11px] leading-6 text-[#dbe7ff]"><span className="text-[#b4ff4f]">POST</span> /webhooks/click<br/><span className="text-[#ffc60a]">event:</span> link.clicked<br/><span className="text-[#ffc60a]">link:</span> ziplin.to/spring<br/><span className="text-[#ffc60a]">country:</span> IN<br/><span className="text-[#ffc60a]">device:</span> mobile<br/><span className="text-[#ffc60a]">signature:</span> sha256=••••••</div><button onClick={() => setSent(true)} className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-lg border-2 border-[#0a0e1a] bg-[#ffc60a] font-semibold">{sent ? <><Check className="size-4"/> Delivered in 84ms</> : 'Send test event'}</button></DemoShell>;
}

function RetargetingDemo() {
  const [active, setActive] = useState(0);
  const platforms = ['Meta', 'Google', 'LinkedIn', 'TikTok'];
  return <DemoShell label="Retargeting pixels"><div className="mt-5 grid gap-2 sm:grid-cols-4">{platforms.map((platform, i) => <button key={platform} onClick={() => setActive(i)} className={`rounded-lg border px-3 py-3 text-xs ${active === i ? 'border-ziplin-blue bg-ziplin-blue text-white' : 'border-[#d6deeb] bg-white'}`}>{platform}</button>)}</div><div className="mt-5 flex items-center justify-between gap-2 rounded-xl bg-white p-4"><div className="rounded-lg bg-[#eef3ff] p-3"><Link2 className="size-5"/></div><span className="h-px flex-1 border-t-2 border-dashed border-[#8898b9]"/><motion.div key={active} initial={{ scale: .8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="rounded-lg bg-[#fff3c9] px-4 py-3 text-center text-xs font-semibold">{platforms[active]} Pixel<br/><span className="font-normal text-[#6d778c]">fired &lt; 20ms</span></motion.div><span className="h-px flex-1 border-t-2 border-dashed border-[#8898b9]"/><div className="rounded-lg bg-[#e9fbf0] p-3"><BarChart3 className="size-5"/></div></div></DemoShell>;
}
