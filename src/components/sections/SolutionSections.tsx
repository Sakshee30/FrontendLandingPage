import { motion } from 'framer-motion';
import { ArrowRight, BarChart3, Check, Link2, QrCode, Smartphone } from 'lucide-react';
import type { SolutionDefinition } from '@/data/types';
import { solutionMascotSources } from '@/data/figmaAssets';
import { ButtonLink } from '@/components/ui/Button';
import { Reveal } from '@/components/ui/Reveal';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export function SolutionHero({ solution }: { solution: SolutionDefinition }) {
  const shortMotion = solution.slug === 'content-creators' || solution.slug === 'influencers';
  const duration = shortMotion ? 0.3 : 0.5;
  const visualClass = {
    'affiliate-marketing': 'h-[589px] max-w-[598px]',
    'content-creators': 'h-[600px] max-w-[598px]',
    influencers: 'h-[496px] max-w-[540px]',
    'media-entertainment': 'h-[576px] max-w-[593px]',
    ecommerce: 'h-[454px] max-w-[600px]',
    'digital-marketing': 'h-[454px] max-w-[591px]',
  }[solution.slug] ?? 'h-[520px] max-w-[598px]';
  return (
    <section className="figma-grid overflow-hidden bg-white">
      <div className="mx-auto w-full max-w-[1252px] px-6 py-10 sm:px-8 lg:px-0 lg:py-0">
        <div className="grid min-h-[589px] items-center gap-8 lg:grid-cols-[584px_1fr]">
          <motion.div initial={{ opacity: 0, x: -520 }} animate={{ opacity: 1, x: 0 }} transition={{ duration, ease: 'easeOut' }}>
            <SectionEyebrow>{solution.eyebrow}</SectionEyebrow>
            <h1 className="mt-7 max-w-[584px] font-display text-[44px] leading-[1.24] text-ziplin-navy sm:text-[50px]">{solution.headline} <span className="text-ziplin-yellow">{solution.accent}</span></h1>
            <p className="mt-7 max-w-[584px] text-[20px] leading-[1.35] text-[#555e73]">{solution.description}</p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: shortMotion ? 1320 : 1250, rotate: shortMotion ? 0 : 178 }} animate={{ opacity: 1, x: 0, rotate: 0 }} transition={{ duration, ease: 'easeOut' }} className={`relative mx-auto w-full [&>div]:hidden ${visualClass}`}>
            <img src={solutionMascotSources[solution.slug as keyof typeof solutionMascotSources]} alt={`${solution.name} Ziplin mascot`} className="relative h-full w-full object-contain" />
            <motion.div animate={{ y: [0,-12,0], rotate: [-3,3,-3] }} transition={{ repeat: Infinity, duration: 4.4 }} className="absolute right-[4%] top-[8%] flex size-16 items-center justify-center rounded-2xl bg-[#ff4f87] text-3xl text-white shadow-soft">♥</motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

const useCaseIcons = [Link2, QrCode, Smartphone];

export function SolutionUseCases({ solution }: { solution: SolutionDefinition }) {
  return (
    <section className="overflow-hidden py-20 sm:py-28">
      <div className="site-container">
        <Reveal className="text-center">
          <SectionEyebrow>SOLUTIONS</SectionEyebrow>
          <h2 className="display-2 mx-auto mt-6 max-w-[920px]">{solution.sectionHeading}</h2>
          <p className="mx-auto mt-4 max-w-[820px] text-lg leading-8 text-[#65718a]">{solution.sectionSubheading}</p>
        </Reveal>
        <div className="mt-16 space-y-24 sm:mt-20 sm:space-y-32">
          {solution.useCases.map((useCase, index) => {
            const Icon = useCaseIcons[index];
            const reversed = index % 2 === 1;
            return (
              <div key={useCase.label} className={`grid items-center gap-12 lg:grid-cols-2 ${reversed ? 'lg:[&>*:first-child]:order-2' : ''}`}>
                <Reveal distance={reversed ? -60 : 60}>
                  <div className={`relative min-h-[440px] overflow-hidden rounded-[26px] border border-[#dfe6f1] ${index === 0 ? 'bg-[#fff9e9]' : index === 1 ? 'bg-[#f0efff]' : 'bg-[#ecfbf2]'}`}>
                    <div className="absolute -right-16 -top-16 size-56 rounded-full border-[38px] border-white/60" />
                    <div className="absolute bottom-0 left-0 right-0 h-36 bg-gradient-to-t from-ziplin-blue/[.08] to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center p-8">
                      <motion.div whileHover={{ y: -8, rotate: reversed ? 2 : -2 }} transition={{ duration: .3 }} className="w-full max-w-[440px] rounded-[22px] border-2 border-[#0a0e1a] bg-white p-6 shadow-[12px_12px_0_#f4b400]">
                        <div className="flex items-center justify-between"><div className="flex size-12 items-center justify-center rounded-xl bg-ziplin-navy text-white"><Icon /></div><span className="font-mono text-[10px] tracking-[.15em] text-[#7a859c]">LIVE PREVIEW</span></div>
                        <div className="mt-6 space-y-3">{useCase.bullets.map((bullet, bulletIndex) => <motion.div key={bullet} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: .12 + bulletIndex * .08 }} className="flex items-center gap-3 rounded-xl bg-[#f7f9fc] p-4"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#e9fbf0] text-[#12a556]"><Check className="size-4" /></span><span className="text-sm leading-6 text-[#4e586c]">{bullet}</span></motion.div>)}</div>
                        <div className="mt-5 flex items-end gap-2"><div className="h-14 flex-1 rounded-lg bg-[#edf2fb]"/><div className="h-20 flex-1 rounded-lg bg-[#dfe8f8]"/><div className="h-28 flex-1 rounded-lg bg-ziplin-yellow"/><div className="h-24 flex-1 rounded-lg bg-[#c9d8f3]"/></div>
                      </motion.div>
                    </div>
                  </div>
                </Reveal>
                <Reveal distance={reversed ? 60 : -60} delay={.08}>
                  <span className="font-mono text-xs font-bold uppercase tracking-[.15em] text-ziplin-yellow">{useCase.label}</span>
                  <h3 className="mt-5 font-display text-[34px] leading-[1.2] text-ziplin-navy sm:text-[42px]">{useCase.title}</h3>
                  <div className="mt-7 space-y-5">{useCase.bullets.map((bullet) => <p key={bullet} className="flex gap-3 text-lg leading-8 text-[#596379]"><ArrowRight className="mt-1.5 size-5 shrink-0 text-ziplin-yellow" />{bullet}</p>)}</div>
                  <ButtonLink to="/pricing" variant="outline" className="mt-8">Explore Ziplin</ButtonLink>
                </Reveal>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function WorkflowSection({ solution }: { solution: SolutionDefinition }) {
  return (
    <section className="figma-grid bg-[#f7fbff] py-20 sm:py-28">
      <div className="site-container">
        <Reveal className="text-center"><SectionEyebrow>WORKFLOW</SectionEyebrow><h2 className="display-2 mt-6">Everything You Need, <span className="text-ziplin-yellow">in One Workflow</span></h2></Reveal>
        <div className="relative mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="pointer-events-none absolute left-[12%] right-[12%] top-12 hidden border-t-2 border-dashed border-[#9daac1] xl:block" />
          {solution.workflow.map((step, index) => <Reveal key={step.title} delay={index * .08}><motion.article whileHover={{ y: -8 }} className="relative h-full rounded-[20px] border border-[#d9e2ef] bg-white p-7 text-center shadow-[0_14px_45px_rgba(8,28,69,.08)]"><div className="relative z-10 mx-auto flex size-14 items-center justify-center rounded-full border-4 border-white bg-ziplin-navy font-display text-xl text-white shadow-md">{String(index + 1).padStart(2, '0')}</div><h3 className="mt-6 font-display text-2xl">{step.title}</h3><p className="mt-3 text-base leading-7 text-[#66718a]">{step.description}</p></motion.article></Reveal>)}
        </div>
        <Reveal delay={.18} className="mx-auto mt-14 max-w-[920px] rounded-[24px] bg-ziplin-navy p-8 text-white sm:p-10"><div className="grid items-center gap-8 sm:grid-cols-[auto_1fr_auto]"><div className="flex size-14 items-center justify-center rounded-xl bg-white/10"><BarChart3 className="text-ziplin-yellow" /></div><div><h3 className="font-display text-2xl">One dashboard. Every audience journey.</h3><p className="mt-2 text-white/65">Build, measure, learn, and improve without switching tools.</p></div><ButtonLink to="/demo" variant="glass">View demo</ButtonLink></div></Reveal>
      </div>
    </section>
  );
}
