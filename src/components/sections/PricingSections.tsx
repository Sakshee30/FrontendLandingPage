import { motion } from 'framer-motion';
import { Check, Minus } from 'lucide-react';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

const plans = [
  {
    name: 'Starter', price: '₹0', description: 'Perfect for individual developers and small personal bio-pages exploring trackable redirects.', cta: 'Get started', highlight: false,
    features: ['Up to 50 active shortened links', 'Standard ziplin.io domain redirection', 'Basic redirect count reporting', 'No custom branded domains', 'Community channel assistance'],
  },
  {
    name: 'Pro', price: '₹9,999/yr', description: 'Best suited for agencies and eCommerce stores tracking attribution analytics daily.', cta: 'Start free trial', highlight: true,
    features: ['Unlimited shortened links & redirects', '3 custom branded domains', 'Real-time analytics & GEO reports', 'Smart link routing & deep-linking', 'Integrations with Webhooks & Slack', 'Priority business hours email support'],
  },
  {
    name: 'Business', price: '₹38,040/yr', description: 'Built to meet complex HIPAA compliance, high-volume redirection, and SSO expectations.', cta: 'Get started', highlight: false,
    features: ['Everything in Pro tier included', 'Unlimited branded custom domains', 'Advanced UTM tracking matrices', 'Priority support', 'Webhooks', 'Unlimited clicks'],
  },
];

export function PricingHero() {
  return (
    <section className="figma-grid overflow-hidden bg-white">
      <div className="site-container grid min-h-[440px] items-center gap-8 py-12 lg:grid-cols-[1fr_520px] lg:py-0">
        <motion.div initial={{ opacity: 0, x: -415 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, ease: 'easeOut' }}>
          <SectionEyebrow>PRICING PLANS</SectionEyebrow>
          <h1 className="display-1 mt-7 max-w-[640px]">Simple, transparent <span className="text-ziplin-yellow">pricing structure</span></h1>
          <p className="mt-5 max-w-[396px] text-[20px] leading-[1.35] text-[#111]">Start free. Upgrade when you need more links, branding controls, team seats, or API limits. No hidden fees, ever.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 415 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: .5, ease: 'easeOut' }} className="relative mx-auto h-[434px] w-[447px] max-w-full overflow-hidden">
          <img src="/figma-assets/feature-mascot-sheet.png" alt="Ziplin mascot beside the pricing plan board" className="absolute left-[-487px] top-[-699px] h-[1321px] w-[1448px] max-w-none" />
        </motion.div>
      </div>
    </section>
  );
}

export function PricingCards() {
  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.16 }}
      className="mx-auto flex min-h-[992px] w-full max-w-[1280px] flex-col items-center overflow-hidden px-8 pb-20 pt-10"
    >
      <div className="w-full max-w-[640px] text-center">
        <span className="inline-flex h-10 items-center gap-2 rounded-full border-[2.4px] border-[#0a0e1a] bg-white px-4 font-mono text-[12.5px] font-bold uppercase tracking-[1.25px] text-[#0a0e1a] shadow-[3px_3px_0_#0a0e1a]">⚡ PRICING</span>
        <motion.h2 variants={{ hidden: { opacity: 0, x: -401 }, visible: { opacity: 1, x: 0, transition: { duration: .5, ease: 'easeOut' } } }} className="mt-4 font-display text-[38px] leading-tight text-ziplin-blue sm:text-[48px] sm:leading-[60px]">start free. <span className="text-ziplin-yellow">grow into it.</span></motion.h2>
        <motion.p variants={{ hidden: { opacity: 0, x: 752 }, visible: { opacity: 1, x: 0, transition: { duration: .5, ease: 'easeOut' } } }} className="mx-auto mt-4 max-w-[640px] text-[20px] leading-[27px] text-[#4a4e5e]">Every plan includes branded links, QR codes, and real-time analytics — upgrade when your traffic does.</motion.p>
      </div>
      <motion.div variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: .5, ease: 'easeOut' } } }} className="mt-12 grid w-full max-w-[1280px] gap-6 lg:grid-cols-3">
          {plans.map((plan, index) => <motion.article key={plan.name} variants={{ hidden: { x: index === 0 ? 0 : index === 1 ? 908 : 1816 }, visible: { x: 0, transition: { duration: .5, ease: 'easeOut' } } }} whileHover={{ y: -5 }} className={`relative flex min-h-[592px] flex-col rounded-[24px] border p-8 ${plan.highlight ? 'border-[#ffe8a6] bg-[#ffc60a] shadow-[12px_12px_0_rgba(0,0,0,.25)]' : 'border-[#e5e7eb] bg-white shadow-[12px_12px_0_rgba(0,0,0,.25)]'}`}>
            {plan.highlight ? <span className="absolute -top-4 left-8 rounded-full border border-[#0a0e1a] bg-ziplin-navy px-4 py-2 font-mono text-[11px] font-extrabold uppercase tracking-[.55px] text-white">Most popular</span> : null}
            <h3 className="font-body text-[20px] font-bold leading-[27px] text-[#0a0e1a]">{plan.name}</h3>
            <p className="mt-4 min-h-[48px] text-[15px] leading-6 text-[#667085]">{plan.description}</p>
            <strong className="mt-6 block min-h-[60px] font-display text-[48px] font-normal leading-[60px] text-ziplin-blue">{plan.price}</strong>
            <div className={`my-6 h-px w-full ${plan.highlight ? 'bg-[#031f39]' : 'bg-[#e5e7eb]'}`} />
            <ul className="flex-1 space-y-4 pb-6">{plan.features.map((feature) => <li key={feature} className="flex gap-4 text-base leading-6 text-[#0a0e1a]"><Check className="mt-1 size-3 shrink-0 stroke-[4] text-[#ff4fa0]" />{feature}</li>)}</ul>
            <ButtonLink to="/demo" variant={plan.highlight ? 'navy' : 'white'} className="min-h-14 w-full rounded-xl border-[2.4px] border-[#0a0e1a] shadow-[7px_7px_0_#0a0e1a]">{plan.cta}</ButtonLink>
          </motion.article>)}
        </motion.div>
    </motion.section>
  );
}

const comparisonRows = [
  ['Redirection limit', '50 links', 'Unlimited', 'Unlimited'],
  ['Branded domains', '—', '3 domains', 'Unlimited'],
  ['Real-time analytics', '—', 'Included', 'Included'],
  ['Smart link routing', '—', 'Included', 'Included'],
  ['UTM tracking framework', '—', 'Included', 'Included'],
  ['Webhooks & API', 'Basic', 'Advanced', 'Custom Access'],
];

export function PricingComparison() {
  return (
    <section className="site-container py-20 sm:py-24">
      <Reveal className="text-center"><h2 className="display-2">Detailed Feature <span className="text-ziplin-yellow">Comparison</span></h2><p className="mt-3 text-base text-[#6b7280]">Review every technical detail side-by-side to choose confidently.</p></Reveal>
      <Reveal delay={.1} className="mt-12 overflow-x-auto rounded-[22px] border border-[#dce4ef] bg-white shadow-soft">
        <table className="min-w-[760px] w-full border-collapse text-left">
          <thead><tr className="bg-ziplin-navy text-white"><th className="p-5 font-body text-lg">Capabilities</th><th className="p-5 text-center font-body text-lg">Starter</th><th className="bg-ziplin-yellow p-5 text-center font-body text-lg text-ziplin-navy">Pro</th><th className="p-5 text-center font-body text-lg">Business</th></tr></thead>
          <tbody>{comparisonRows.map((row, index) => <tr key={row[0]} className={index % 2 ? 'bg-[#f8faff]' : 'bg-white'}>{row.map((cell, column) => <td key={column} className={`border-t border-[#e4e9f1] p-5 ${column ? 'text-center' : 'font-medium text-ziplin-navy'}`}>{cell === '—' ? <Minus className="mx-auto text-[#9aa5b8]" /> : cell === 'Included' ? <span className="inline-flex items-center gap-2"><Check className="size-4 text-[#12a556]" />Included</span> : cell}</td>)}</tr>)}</tbody>
        </table>
      </Reveal>
    </section>
  );
}
