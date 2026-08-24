import { motion } from 'framer-motion';
import { BarChart3, HeartHandshake, Lightbulb, ShieldCheck, Users } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { CtaSection } from '@/components/sections/CtaSection';
import { SiteFooter } from '@/components/layout/SiteFooter';

const mission = 'Our mission is to empower businesses, creators, and organizations with a secure, intelligent, and user-friendly link management platform that simplifies digital communication and delivers measurable results. We are committed to providing innovative tools that transform ordinary links into valuable business assets, helping users strengthen their online presence, improve customer engagement, and make data-driven decisions with confidence. Through continuous innovation, exceptional reliability, and a customer-first approach, Ziplin aims to make every digital interaction smarter, faster, and more meaningful.';

const values = [
  { icon: Lightbulb, title: 'Useful innovation', text: 'We build technology that removes work, clarifies decisions, and creates measurable outcomes—not features for their own sake.' },
  { icon: ShieldCheck, title: 'Trust by design', text: 'Security, reliability, transparent behavior, and user control are built into the product architecture and operating habits.' },
  { icon: HeartHandshake, title: 'Customer first', text: 'We listen closely, explain clearly, support quickly, and keep product decisions connected to real customer workflows.' },
  { icon: Users, title: 'Better together', text: 'Great connected experiences require collaboration across creators, marketers, developers, partners, and customers.' },
];

export function AboutPage() {
  return (
    <PageTransition>
      <section className="border-b border-[#e8e8e8] bg-gradient-to-r from-[#f0f8ff] to-white">
        <div className="mx-auto grid min-h-[648px] w-full max-w-[1252px] items-center gap-8 px-5 py-16 sm:px-8 lg:grid-cols-[minmax(0,564px)_minmax(0,607px)] lg:gap-[22px] lg:px-0 lg:py-[90px]">
          <motion.div initial={{opacity:0,x:-60}} animate={{opacity:1,x:0}} transition={{duration:.5,ease:[.22,1,.36,1]}}>
            <SectionEyebrow>OUR MISSION & STORY</SectionEyebrow>
            <p className="mt-7 text-xl leading-7 text-ziplin-blue">Building the infrastructure for connected link experiences</p>
            <p className="mt-7 text-lg leading-[1.45] text-[#474555] sm:text-xl">{mission}</p>
          </motion.div>
          <motion.div initial={{opacity:0,x:1150}} animate={{opacity:1,x:0}} transition={{duration:.5,ease:'easeOut'}} className="relative h-[408px] overflow-hidden rounded-[24px] bg-[#75aee0]">
            <video src="/figma-assets/about-hero-animation.mp4" aria-label="Animated Ziplin About visual" className="h-full w-full object-cover" autoPlay loop muted playsInline preload="auto" />
          </motion.div>
        </div>
      </section>

      <section className="site-container py-20 sm:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-2">
          <Reveal>
            <SectionEyebrow>OUR STORY</SectionEyebrow>
            <h2 className="display-2 mt-6">Ordinary links became <span className="text-ziplin-yellow">strategic infrastructure</span></h2>
            <div className="mt-7 space-y-5 text-lg leading-8 text-[#5f687c]">
              <p>Ziplin began with a simple observation: every business shares links, but most teams still manage those links as disposable text instead of connected customer journeys.</p>
              <p>We designed a platform where a single destination could carry brand trust, routing intelligence, attribution, security, and automation—without becoming complicated for the person creating it.</p>
              <p>Today that vision spans short links, QR codes, pages, files, campaigns, retargeting, webhooks, and an analytics layer that helps teams understand what happens next.</p>
            </div>
          </Reveal>
          <Reveal delay={.1}>
            <div className="figma-grid relative min-h-[500px] overflow-hidden rounded-[28px] bg-[#f8fbff] p-8 shadow-soft">
              <div className="absolute -right-14 -top-14 size-52 rounded-full border-[38px] border-ziplin-yellow/10" />
              <div className="grid h-full content-center gap-4 sm:grid-cols-2">
                {[['2019','The first link prototype'],['2022','Campaign and QR intelligence'],['2024','Teams, automation, and governance'],['2026','One connected growth platform']].map(([year,text],i)=><motion.div key={year} whileHover={{y:-6}} className={`rounded-[18px] border p-6 ${i===3?'border-ziplin-yellow bg-[#fff7d8]':'border-[#dce4ef] bg-white'}`}><strong className="font-display text-4xl text-ziplin-blue">{year}</strong><p className="mt-3 text-sm leading-6 text-[#68738a]">{text}</p></motion.div>)}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="figma-grid bg-[#f7fbff] py-20 sm:py-28">
        <div className="site-container">
          <Reveal className="text-center"><SectionEyebrow>OUR VALUES</SectionEyebrow><h2 className="display-2 mt-6">What guides every <span className="text-ziplin-yellow">product decision</span></h2></Reveal>
          <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">{values.map((value,index)=><Reveal key={value.title} delay={index*.075}><motion.article whileHover={{y:-8}} className="h-full rounded-[22px] border border-[#dbe4ef] bg-white p-7 shadow-[8px_8px_0_rgba(8,28,69,.08)]"><div className="flex size-12 items-center justify-center rounded-xl bg-[#fff4c9] text-ziplin-yellow"><value.icon/></div><h3 className="mt-6 font-display text-2xl">{value.title}</h3><p className="mt-4 text-base leading-7 text-[#66718a]">{value.text}</p></motion.article></Reveal>)}</div>
        </div>
      </section>

      <section className="site-container py-20 sm:py-24">
        <Reveal className="overflow-hidden rounded-[28px] bg-ziplin-navy p-8 text-white sm:p-12">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center"><div><SectionEyebrow>BY THE NUMBERS</SectionEyebrow><h2 className="mt-6 font-display text-4xl leading-tight sm:text-5xl">Connected experiences at <span className="text-ziplin-yellow">real scale</span></h2></div><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{[['50K+','teams'],['180M+','clicks routed'],['99.99%','platform availability'],['120+','markets reached']].map(([value,label])=><div key={label} className="rounded-xl border border-white/10 bg-white/[.06] p-5"><strong className="font-display text-3xl text-ziplin-yellow">{value}</strong><span className="mt-2 block text-sm text-white/60">{label}</span></div>)}</div></div>
          <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-6 text-sm text-white/60"><BarChart3 className="size-5 text-ziplin-yellow"/> Metrics are presented as design content for this frontend implementation.</div>
        </Reveal>
      </section>
      <CtaSection />
      <SiteFooter />
    </PageTransition>
  );
}
