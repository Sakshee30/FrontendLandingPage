import { AnimatePresence, motion } from 'framer-motion';
import { Boxes, Check, Code2, Download, Globe2, Minus, Upload, Zap } from 'lucide-react';
import { useState } from 'react';
import { CtaSection } from '@/components/sections/CtaSection';
import { FaqSection } from '@/components/sections/FaqSection';
import { Testimonials } from '@/components/sections/Testimonials';
import { SiteFooter } from '@/components/layout/SiteFooter';
import { PageTransition } from '@/components/ui/PageTransition';
import { Reveal } from '@/components/ui/Reveal';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

type CompetitorKey = 'Bitly' | 'TinyURL' | 'Rebrandly' | 'Short.io';

const competitors: CompetitorKey[] = ['Bitly', 'TinyURL', 'Rebrandly', 'Short.io'];

const competitorDetails: Record<CompetitorKey, { summary: string; strengths: string[]; limits: string[]; ziplinSummary: string; ziplinItems: string[] }> = {
  Bitly: {
    summary: 'A familiar enterprise link platform with mature brand recognition',
    strengths: ['Recognizable link-management platform', 'Campaign links and QR codes', 'Large integration ecosystem'],
    limits: ['Advanced features move into higher plans', 'Domain and seat limits vary by plan', 'Separate tools are still needed for files and 2D barcodes'],
    ziplinSummary: 'Ten seats and unlimited domains on the entry plan',
    ziplinItems: ['10 seats included, not one', 'Unlimited branded domains, no add-on', 'Click history kept for as long as you keep the link', 'Support replies in under two hours'],
  },
  TinyURL: {
    summary: 'A straightforward option for creating and managing short links',
    strengths: ['Simple link-shortening workflow', 'Branded domains on paid plans', 'Campaign and redirect controls'],
    limits: ['A smaller all-in-one marketing toolkit', 'Limited bio-page and automation depth', 'No built-in file sharing or 2D barcodes'],
    ziplinSummary: 'The simple version, with analytics when you need them',
    ziplinItems: ['Still one click to shorten', 'Campaign rollup when you outgrow single links', 'Conversion tracking through to signups', 'Bio pages and file links in the same place'],
  },
  Rebrandly: {
    summary: 'A branded-link platform designed around custom domains',
    strengths: ['Strong branded-domain focus', 'Link routing and collaboration', 'API access and integrations'],
    limits: ['Domain and seat allowances depend on plan', 'Bio-page tools are more limited', 'No file sharing or 2D barcodes'],
    ziplinSummary: 'Branded links plus everything you were opening a second tab for',
    ziplinItems: ['Bio pages built in', 'File sharing on your own domain', '2D barcodes for packaging', 'UTM builder wired into campaigns'],
  },
  'Short.io': {
    summary: 'Developer-friendly, priced by click volume',
    strengths: ['Clean API and webhooks', 'Link routing and custom domains', 'Developer-friendly workflows'],
    limits: ['Click-based pricing spikes with virality', 'No file sharing or 2D barcodes', 'Bio page features are limited'],
    ziplinSummary: 'Flat pricing that does not punish a good campaign',
    ziplinItems: ['Priced on seats, not clicks', 'A viral post costs you nothing extra', 'Full bio page builder', 'Spike alerts when traffic jumps'],
  },
};

type MatrixCell = string | boolean | 'limited' | { value: string; note?: string };
type MatrixRow = { label: string; note?: string; values: MatrixCell[] } | { section: string };

const matrixRows: MatrixRow[] = [
  { label: 'Branded short links', values: [true, true, true, true, true] },
  { label: 'Custom domains included', note: 'Before you pay per extra domain', values: ['Unlimited', '1', '3', '1–10', '5'] },
  { label: 'Non-English slugs', note: 'Hindi, Arabic, Thai, emoji', values: [true, true, 'limited', 'limited', 'limited'] },
  { label: 'Bulk import and redirect rules', note: 'Move 10,000 links in one CSV', values: [true, true, 'limited', true, true] },
  { label: 'Link expiry and password locks', values: [true, 'limited', true, true, true] },
  { section: 'Beyond the short link' },
  { label: 'Dynamic QR codes', note: 'Edit the destination after printing', values: [true, true, true, true, true] },
  { label: '2D barcodes for packaging', values: [true, false, false, false, false] },
  { label: 'Bio pages', note: 'Landing page builder, no extra tool', values: [true, true, false, true, true] },
  { label: 'File sharing links', values: [true, false, false, false, false] },
  { label: 'Retargeting pixels on redirect', note: 'Meta, Google, LinkedIn, X', values: [true, true, false, true, true] },
  { label: 'Click history retained', values: ['Unlimited', '2 years', '6 months', '1 year', '1 year'] },
  { label: 'UTM builder and campaign rollup', values: [true, true, true, true, true] },
  { label: 'Conversion tracking', note: 'Clicks through to signups and sales', values: [true, true, false, true, true] },
  { label: 'Seats on the entry paid plan', values: ['10', 'limited', 'limited', '1–5+', '1+'] },
  { label: 'Free plan that keeps your links live', values: [true, true, true, true, true] },
];

const migrationSteps = [
  { number: '01', icon: Download, title: 'Export your Data', text: 'Download your active short links directory from the dashboard in standard CSV format.' },
  { number: '02', icon: Upload, title: 'Bulk Import to Ziplin', text: "Upload the CSV inside Ziplin's importer. Slugs, destinations, and metadata map instantly." },
  { number: '03', icon: Globe2, title: 'Point Branded Domains', text: 'Update your CNAME domain DNS settings to Ziplin. All traffic redirects with zero downtime.' },
];

const switchingBenefits = [
  { icon: Zap, title: 'Global Edge Network Redirects', text: 'Ziplin short links resolve at our closest edge location. This means redirects take less than 20ms, preventing user bounce rates and maximizing campaign page load efficiency.', border: 'border-[#f1b51c]', iconStyle: 'bg-[#fff3c3] text-[#d69a00]', shadow: 'shadow-[8px_8px_0_rgba(244,180,0,.22)]' },
  { icon: Boxes, title: 'Integrated Marketing Tools', text: 'Stop paying for multiple tools. Ziplin integrates link shortening, dynamic QR codes, UTM campaign builders, custom pixels, and bio pages under a single account.', border: 'border-[#56bd7d]', iconStyle: 'bg-[#e9f8ef] text-[#079447]', shadow: 'shadow-[8px_8px_0_rgba(86,189,125,.18)]' },
  { icon: Code2, title: 'Developer-First Infrastructure', text: 'Access fully-featured REST APIs, send click events directly to webhooks, view trigger logs, and manage developer tokens without high enterprise markups.', border: 'border-[#7567d8]', iconStyle: 'bg-[#eeebff] text-[#5b4bc4]', shadow: 'shadow-[8px_8px_0_rgba(117,103,216,.18)]' },
];

const faqs = [
  { question: 'Will my existing short links break?', answer: 'No. Import your existing slugs and destinations, verify every redirect, then move your branded domain when you are ready. Your active links can continue resolving throughout the migration.' },
  { question: 'Do I lose my click history?', answer: 'Your exported link metadata can be mapped during import. Historical analytics availability depends on the data your current provider includes in its export.' },
  { question: 'Can I try it before moving everything?', answer: 'Yes. Start with a small link batch or one branded domain, validate the workflow, and move the rest only after your team is comfortable.' },
];

function MatrixValue({ value }: { value: MatrixCell }) {
  if (value === true) {
    return <span className="mx-auto flex size-7 items-center justify-center rounded-full bg-[#e9f8ef] text-[#079447]" aria-label="Included"><Check className="size-4" strokeWidth={2.6} /></span>;
  }

  if (value === false) {
    return <span className="mx-auto block text-lg text-[#a5adbb]" aria-label="Not available">—</span>;
  }

  if (value === 'limited') {
    return <span className="font-semibold text-[#7c8596]">~</span>;
  }

  if (typeof value === 'object') {
    return <><strong className="block">{value.value}</strong>{value.note ? <small className="mt-1 block text-xs text-[#7c8596]">{value.note}</small> : null}</>;
  }

  return <span className="font-semibold text-ziplin-navy">{value}</span>;
}

export function ComparePage() {
  const [activeCompetitor, setActiveCompetitor] = useState<CompetitorKey>('Short.io');
  const active = competitorDetails[activeCompetitor];

  return (
    <PageTransition>
      <section className="figma-grid relative overflow-hidden border-b border-[#e5e9f0] bg-white py-12 sm:py-16 lg:py-10">
        <div className="pointer-events-none absolute -right-20 -top-24 size-[420px] rounded-full bg-[#fff5d3] opacity-70 blur-3xl" />
        <div className="site-container grid min-h-[570px] items-center gap-10 lg:grid-cols-[minmax(0,1.08fr)_minmax(360px,.72fr)] lg:gap-16">
          <motion.div initial={{ opacity: 0, x: -80 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .65, ease: [.22, 1, .36, 1] }} className="relative z-10 text-left">
            <SectionEyebrow>COMPARISON</SectionEyebrow>
            <h1 className="display-1 mt-7 max-w-[760px] text-ziplin-navy">Every link tool promises short links. <span className="text-ziplin-yellow">Then what?</span></h1>
            <p className="mt-6 max-w-[650px] text-lg leading-8 text-[#66718a]">We put Ziplin side by side with other websites — same features, same plans, no asterisks. Read the table, then decide for yourself.</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 110, rotate: 7 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration: .72, delay: .08, ease: [.22, 1, .36, 1] }} className="relative mx-auto flex h-[470px] w-full max-w-[430px] items-center justify-center">
            <motion.div animate={{ y: [0, -12, 0], rotate: [0, 1.2, 0] }} transition={{ duration: 4.4, repeat: Infinity, ease: 'easeInOut' }} className="relative z-10 size-[430px]">
              <img src="/figma-assets/feature-url-shortener.png" alt="Ziplin mascot breaking a chain" className="size-full object-contain" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      <section className="site-container py-20 sm:py-28">
        <Reveal className="text-center">
          <SectionEyebrow>HEAD TO HEAD</SectionEyebrow>
          <h2 className="display-2 mt-6 text-ziplin-navy">Pick a tool. <span className="text-ziplin-yellow">See the difference.</span></h2>
          <p className="mx-auto mt-4 max-w-[760px] text-base leading-7 text-[#68738a]">The honest version — what each one is genuinely good at, and where teams tell us they hit a wall.</p>
        </Reveal>

        <div className="mt-10 flex flex-wrap justify-center gap-3" role="tablist" aria-label="Select a competitor">
          {competitors.map((competitor) => {
            const selected = activeCompetitor === competitor;
            return (
              <motion.button
                key={competitor}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveCompetitor(competitor)}
                whileHover={{ y: -3 }}
                whileTap={{ scale: .96 }}
                className={`relative min-w-[132px] overflow-hidden rounded-full border-2 px-6 py-3 text-sm font-semibold transition-colors duration-300 ${selected ? 'border-ziplin-navy text-white' : 'border-[#d9e0ea] bg-white text-ziplin-navy hover:border-ziplin-yellow'}`}
              >
                {selected ? <motion.span layoutId="active-comparison-tab" className="absolute inset-0 bg-ziplin-navy" transition={{ type: 'spring', stiffness: 420, damping: 34 }} /> : null}
                <span className="relative z-10">vs {competitor}</span>
              </motion.button>
            );
          })}
        </div>

        <div className="relative mt-12 grid items-stretch gap-6 lg:grid-cols-[1fr_72px_1fr] lg:gap-0">
          <motion.article whileHover={{ y: -8 }} transition={{ duration: .25 }} className="rounded-[24px] border-2 border-ziplin-navy bg-ziplin-navy p-8 text-white shadow-[12px_12px_0_#f4b400] sm:p-10">
            <span className="inline-flex rounded-full bg-ziplin-yellow px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-ziplin-navy">Our pick</span>
            <h3 className="mt-6 font-display text-[40px] leading-tight">Ziplin</h3>
            <p className="mt-3 min-h-14 text-base leading-7 text-[#bcd0f8]">{active.ziplinSummary}</p>
            <div className="my-7 h-px bg-white/15" />
            <ul className="space-y-4">
              {active.ziplinItems.map((item) => (
                <li key={item} className="flex items-start gap-3 text-base leading-6"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#b9f467] text-ziplin-navy"><Check className="size-4" /></span>{item}</li>
              ))}
            </ul>
          </motion.article>

          <div className="relative z-10 flex items-center justify-center py-2 lg:py-0">
            <motion.span key={activeCompetitor} initial={{ scale: .55, rotate: -16 }} animate={{ scale: 1, rotate: 0 }} className="flex size-16 items-center justify-center rounded-full border-2 border-ziplin-navy bg-ziplin-yellow font-display text-xl text-ziplin-navy shadow-[5px_5px_0_#081c45]">VS</motion.span>
          </div>

          <AnimatePresence mode="wait">
            <motion.article
              key={activeCompetitor}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              whileHover={{ y: -8 }}
              transition={{ duration: .25 }}
              className="rounded-[24px] border-2 border-ziplin-navy bg-white p-8 shadow-[12px_12px_0_rgba(8,28,69,.12)] sm:p-10"
            >
              <span className="inline-flex rounded-full bg-[#eef3fb] px-4 py-2 text-xs font-bold uppercase tracking-[.14em] text-[#6d778a]">Other option</span>
              <h3 className="mt-6 font-display text-[40px] leading-tight text-ziplin-navy">{activeCompetitor}</h3>
              <p className="mt-3 min-h-14 text-base leading-7 text-[#66718a]">{active.summary}</p>
              <div className="my-7 h-px bg-[#e3e8f0]" />
              <ul className="space-y-4">
                {active.strengths.map((item) => <li key={item} className="flex items-start gap-3 text-base leading-6 text-ziplin-navy"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#e9f8ef] text-[#079447]"><Check className="size-4" /></span>{item}</li>)}
                {active.limits.map((item) => <li key={item} className="flex items-start gap-3 text-base leading-6 text-[#66718a]"><span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-[#f0f2f5] text-[#8f98a8]"><Minus className="size-4" /></span>{item}</li>)}
              </ul>
            </motion.article>
          </AnimatePresence>
        </div>
      </section>

      <section className="bg-[#f7faff] py-20 sm:py-28">
        <div className="site-container">
          <Reveal className="text-center">
            <SectionEyebrow>FEATURE MATRIX</SectionEyebrow>
            <h2 className="display-2 mt-6 text-ziplin-navy">Everything compared, <span className="text-ziplin-yellow">in one table</span></h2>
            <p className="mx-auto mt-4 max-w-[700px] text-base leading-7 text-[#68738a]">Based on each provider&apos;s entry-level paid plan for a five-person team.</p>
          </Reveal>

          <Reveal delay={.08} className="mt-12 overflow-hidden rounded-[24px] border border-[#dce3ed] bg-white shadow-[0_18px_55px_rgba(8,28,69,.09)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1040px] border-collapse text-left">
                <thead>
                  <tr className="bg-ziplin-navy text-white">
                    {['Feature', 'Ziplin', 'Bitly', 'TinyURL', 'Rebrandly', 'Short.io'].map((heading, index) => <th key={heading} className={`px-6 py-5 text-sm font-semibold ${index === 0 ? 'w-[32%] text-left' : 'text-center'} ${index === 1 ? 'bg-ziplin-yellow text-ziplin-navy' : ''}`}>{heading}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {matrixRows.map((row, rowIndex) => {
                    if ('section' in row) {
                      return <tr key={row.section}><th colSpan={6} className="border-y border-[#dde4ee] bg-[#edf3fc] px-6 py-4 font-display text-lg text-ziplin-navy">{row.section}</th></tr>;
                    }

                    return (
                      <motion.tr key={row.label} initial="rest" whileHover="hover" className={rowIndex % 2 ? 'bg-[#fbfcff]' : 'bg-white'}>
                        <motion.th variants={{ rest: { x: 0 }, hover: { x: 4 } }} transition={{ duration: .18 }} className="border-t border-[#e5eaf1] px-6 py-5 text-sm font-semibold text-ziplin-navy">
                          {row.label}
                          {row.note ? <span className="mt-1 block text-xs font-normal leading-5 text-[#7a8597]">{row.note}</span> : null}
                        </motion.th>
                        {row.values.map((value, valueIndex) => <td key={valueIndex} className={`border-t border-[#e5eaf1] px-5 py-5 text-center text-sm transition-colors duration-200 ${valueIndex === 0 ? 'bg-[#fff8dd] group-hover:bg-[#fff3bf]' : ''}`}><MatrixValue value={value} /></td>)}
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 border-t border-[#e3e8f0] bg-white px-6 py-5 text-xs text-[#697487]">
              <span className="inline-flex items-center gap-2"><Check className="size-4 text-[#079447]" /> Included</span>
              <span className="inline-flex items-center gap-2"><strong className="text-base">~</strong> Limited, or costs extra</span>
              <span className="inline-flex items-center gap-2"><strong className="text-base">—</strong> Not available</span>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="border-y border-[#f4b400]/25 bg-[#fff9e8] py-20 sm:py-28">
        <div className="site-container">
          <Reveal className="text-center">
            <SectionEyebrow>MIGRATE</SectionEyebrow>
            <h2 className="display-2 mt-6 text-ziplin-navy">Your old links <span className="text-ziplin-yellow">keep working</span></h2>
            <p className="mx-auto mt-4 max-w-[780px] text-base leading-7 text-[#68738a]">Moving your active short links and custom domains from another website to Ziplin is simple, secure, and preserves your traffic redirections.</p>
          </Reveal>
          <div className="relative mt-14 grid gap-7 md:grid-cols-3">
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true, amount: .5 }} transition={{ duration: .85, ease: [.22, 1, .36, 1] }} className="absolute left-[16%] right-[16%] top-12 hidden origin-left border-t-2 border-dashed border-[#d7af40] md:block" />
            {migrationSteps.map(({ number, icon: Icon, title, text }, index) => (
              <Reveal key={number} delay={index * .08}>
                <motion.article whileHover={{ y: -8, rotate: index === 1 ? 0 : index === 0 ? -1 : 1 }} transition={{ duration: .24 }} className="relative h-full rounded-[22px] border-2 border-ziplin-navy bg-white p-7 shadow-[8px_8px_0_#f4b400]">
                  <div className="relative z-10 flex items-center justify-between"><span className="font-display text-5xl text-[#e6ebf3]">{number}</span><span className="flex size-12 items-center justify-center rounded-xl bg-ziplin-yellow text-ziplin-navy"><Icon className="size-6" /></span></div>
                  <h3 className="mt-8 font-display text-2xl text-ziplin-navy">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#66718a]">{text}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="figma-grid bg-white py-20 sm:py-28">
        <div className="site-container">
          <Reveal className="text-center">
            <SectionEyebrow>SWITCHING</SectionEyebrow>
            <h2 className="display-2 mt-6 text-ziplin-navy">Built for modern <span className="text-ziplin-yellow">marketing teams</span></h2>
            <p className="mx-auto mt-4 max-w-[760px] text-base leading-7 text-[#68738a]">Why switching to Ziplin unlocks new campaign growth opportunities</p>
          </Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {switchingBenefits.map(({ icon: Icon, title, text, border, iconStyle, shadow }, index) => (
              <Reveal key={title} delay={index * .08}>
                <motion.article whileHover={{ y: -10, rotate: index === 1 ? 0 : index === 0 ? -1 : 1 }} transition={{ duration: .24 }} className={`group h-full rounded-[22px] border-2 bg-white p-7 ${border} ${shadow}`}>
                  <span className={`flex size-12 items-center justify-center rounded-xl transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110 ${iconStyle}`}><Icon /></span>
                  <h3 className="mt-7 font-display text-2xl text-ziplin-navy">{title}</h3>
                  <p className="mt-4 text-sm leading-7 text-[#66718a]">{text}</p>
                </motion.article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <Testimonials />
      <div className="mt-16 sm:mt-20 [&>section]:min-h-0">
        <FaqSection items={faqs} title="Before you switch" accent="switch" />
      </div>
      <CtaSection />
      <SiteFooter />
    </PageTransition>
  );
}
