import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Code2, CreditCard, Flag, Grid3X3, Link2, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { PageTransition } from '@/components/ui/PageTransition';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { resourceMascotSources } from '@/data/figmaAssets';
import { Reveal } from '@/components/ui/Reveal';
import { CtaSection } from '@/components/sections/CtaSection';
import { SiteFooter } from '@/components/layout/SiteFooter';

const categories = [
  { icon: Flag, title: 'Getting Started', description: 'Learn URL shortening, domain configuration, and workspace setup.', tone: 'bg-[#f1efff] shadow-[12px_12px_0_#164bb7]' },
  { icon: CreditCard, title: 'Account & Billing', description: 'Manage subscription, payment methods, invoices, and plan quotas.', tone: 'bg-[#fffcf0] shadow-[12px_12px_0_#f4b400]' },
  { icon: Link2, title: 'Link Management', description: 'Create trackable short URLs, redirects, tags, and organized campaigns.', tone: 'bg-[#ecfbf2] shadow-[12px_12px_0_#08aa46]' },
  { icon: BarChart3, title: 'Analytics & Reports', description: 'Understand traffic statistics, geography, referrers, and clicks.', tone: 'bg-[#f1efff] shadow-[12px_12px_0_#164bb7]' },
  { icon: Grid3X3, title: 'Integrations', description: 'Connect Slack, Zapier, analytics platforms, and CRMs.', tone: 'bg-[#fffcf0] shadow-[12px_12px_0_#f4b400]' },
  { icon: Code2, title: 'API & Developers', description: 'Explore webhooks, SDKs, endpoints, and programmatic customization.', tone: 'bg-[#ecfbf2] shadow-[12px_12px_0_#08aa46]' },
];

const topics = ['Custom Domain', 'API Key', 'Billing Cycle', 'QR Codes', 'Click Tracking'];

export function HelpCenterPage() {
  const [query, setQuery] = useState('');
  const filtered = useMemo(
    () => categories.filter((category) => `${category.title} ${category.description}`.toLowerCase().includes(query.toLowerCase())),
    [query],
  );

  return (
    <PageTransition>
      <section className="figma-grid border-b border-[#e8e8e8] bg-white">
        <div className="site-container grid min-h-[709px] items-center gap-8 py-14 lg:grid-cols-[.82fr_1.18fr]">
          <motion.div initial={{ opacity: 0, x: -520 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, ease: 'easeOut' }}>
            <SectionEyebrow>HELP CENTER</SectionEyebrow>
            <h1 className="display-1 mt-8">How Can We Help <span className="text-ziplin-yellow">You?</span></h1>
            <form onSubmit={(event) => event.preventDefault()} className="mt-8 flex max-w-[510px] gap-3 rounded-xl border border-[#dbe2ed] bg-white p-3 shadow-[0_8px_28px_rgba(8,28,69,.1)]">
              <Search className="ml-2 mt-2.5 size-5 text-ziplin-blue" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 px-2 text-sm outline-none" placeholder="Search for articles, guides, topics..." />
              <button className="rounded-lg bg-ziplin-yellow px-6 text-sm font-semibold">Search</button>
            </form>
            <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-[#6e788c]">Popular topics:</span>
              {topics.map((topic) => (
                <button key={topic} onClick={() => setQuery(topic)} className="rounded-lg border border-[#d7dfeb] px-3 py-2 text-ziplin-blue transition hover:border-ziplin-yellow hover:bg-[#fff8df]">
                  {topic}
                </button>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 1150 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, ease: 'easeOut' }} className="relative flex min-h-[420px] items-center justify-center lg:h-[516px]">
            <img src={resourceMascotSources.help} alt="Ziplin mascot pointing to the Help Center" className="h-auto max-h-full w-full max-w-[650px] rounded-[24px] object-contain shadow-[0_24px_80px_rgba(8,28,69,.12)]" />
          </motion.div>
        </div>
      </section>

      <section className="site-container py-20 sm:py-28">
        <Reveal className="text-center">
          <h2 className="display-2">Browse by <span className="text-ziplin-yellow">Category</span></h2>
          <p className="mt-4 text-lg text-[#68738a]">Explore structured documentation to quickly find the solutions you need.</p>
        </Reveal>
        <div className="mt-12 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((category, index) => (
            <Reveal key={category.title} delay={index * .06}>
              <Link
                to="/help/getting-started"
                aria-label={`View ${category.title} articles`}
                className="group block h-full rounded-[18px] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ziplin-yellow/40"
              >
                <motion.article
                  whileHover={{ y: -7 }}
                  whileTap={{ scale: .99 }}
                  className={`flex min-h-[330px] h-full cursor-pointer flex-col rounded-[18px] border border-[#dde4ef] p-8 transition-shadow duration-300 group-hover:shadow-[0_18px_45px_rgba(8,28,69,.16)] ${category.tone}`}
                >
                  <span className="flex size-14 items-center justify-center rounded-xl bg-[#fff4ce] text-ziplin-yellow"><category.icon /></span>
                  <h3 className="mt-10 font-display text-2xl">{category.title}</h3>
                  <p className="mt-7 flex-1 text-base leading-7 text-[#596174]">{category.description}</p>
                  <span className="mt-6 inline-flex items-center gap-2 text-sm text-ziplin-blue">
                    View Articles <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
                  </span>
                </motion.article>
              </Link>
            </Reveal>
          ))}
        </div>
        {filtered.length === 0 ? <div className="py-20 text-center text-[#66718a]">No category matched “{query}”. Try a broader term.</div> : null}
      </section>

      <CtaSection />
      <SiteFooter />
    </PageTransition>
  );
}
