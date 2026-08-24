import { motion } from 'framer-motion';
import { Building2, Check, Clock3, Mail, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { useState, type FormEvent } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { CtaSection } from '@/components/sections/CtaSection';
import { SiteFooter } from '@/components/layout/SiteFooter';

const contactMethods = [
  { icon: Mail, title: 'Email support', value: 'support@ziplin.io', sub: 'Responses within one business day' },
  { icon: MessageCircle, title: 'Live chat', value: 'Available in your workspace', sub: 'Fast product and account help' },
  { icon: Phone, title: 'Enterprise sales', value: 'Schedule a tailored conversation', sub: 'Architecture, security, migration, and scale' },
];

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const submit=(event:FormEvent)=>{event.preventDefault();setSent(true)};
  return (
    <PageTransition>
      <section className="border-b border-[#e8e8e8] bg-gradient-to-r from-[#f0f8ff] to-white">
        <div className="mx-auto grid min-h-[588px] w-full max-w-[1252px] items-center gap-8 px-5 py-14 sm:px-8 lg:grid-cols-[minmax(0,564px)_minmax(0,660px)] lg:gap-[22px] lg:px-0">
          <motion.div initial={{opacity:0,x:-60}} animate={{opacity:1,x:0}} transition={{duration:.5,ease:[.22,1,.36,1]}}><SectionEyebrow>CONTACT ZIPLIN SUPPORT</SectionEyebrow><h1 className="display-1 mt-7 max-w-[650px]">We are here to help you <span className="text-ziplin-yellow">connect better</span></h1><p className="mt-6 max-w-[640px] text-lg leading-8 text-[#545b6e] sm:text-xl">Have questions about branded links, enterprise solutions, or billing cycles? Our team of link optimization experts is ready to assist you. Drop us a message, check our locations, or access real-time support.</p></motion.div>
          <motion.div initial={{opacity:0,x:1150,y:400,rotate:178}} animate={{opacity:1,x:0,y:0,rotate:0}} transition={{duration:.5,ease:'easeOut'}} className="h-[450px]"><video src="/figma-assets/contact-hero-animation.mp4" aria-label="Animated Ziplin contact visual" className="h-full w-full bg-transparent object-contain mix-blend-multiply [filter:contrast(1.12)_brightness(1.08)]" autoPlay loop muted playsInline preload="auto"/></motion.div>
        </div>
      </section>

      <section className="site-container py-20 sm:py-28">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.25fr]">
          <Reveal>
            <SectionEyebrow>CONTACT OPTIONS</SectionEyebrow><h2 className="display-2 mt-6">Choose the channel that <span className="text-ziplin-yellow">works for you</span></h2><p className="mt-5 text-lg leading-8 text-[#657087]">Product questions, support, partnerships, security, sales, and media requests all start here.</p>
            <div className="mt-8 space-y-4">{contactMethods.map(({ icon: Icon, title, value, sub })=><motion.div key={title} whileHover={{x:5}} className="flex gap-4 rounded-[18px] border border-[#dce4ef] bg-white p-5 shadow-sm"><span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-[#fff3c6] text-ziplin-yellow"><Icon className="size-5"/></span><span><strong className="block font-display text-xl">{title}</strong><span className="mt-1 block text-sm text-ziplin-blue">{value}</span><small className="mt-1 block text-[#7a8498]">{sub}</small></span></motion.div>)}</div>
          </Reveal>
          <Reveal delay={.1}>
            <div className="rounded-[24px] border border-[#d8e2ef] bg-white p-6 shadow-[0_22px_70px_rgba(8,28,69,.12)] sm:p-9">
              {sent ? <div className="flex min-h-[550px] flex-col items-center justify-center text-center"><span className="flex size-20 items-center justify-center rounded-full bg-[#eafaf0] text-[#12a556]"><Check className="size-10"/></span><h2 className="mt-6 font-display text-3xl">Message received</h2><p className="mt-3 max-w-[420px] text-base leading-7 text-[#66718a]">Thank you. A Ziplin specialist will review your request and contact you using the details provided.</p><Button className="mt-7" onClick={()=>setSent(false)}>Send another message</Button></div> : <form onSubmit={submit}><h2 className="font-display text-3xl">Tell us how we can help</h2><p className="mt-2 text-sm leading-6 text-[#737d91]">Complete the form and our team will route your request to the right specialist.</p><div className="mt-7 grid gap-5 sm:grid-cols-2"><Input label="First name" placeholder="Jane"/><Input label="Last name" placeholder="Doe"/><Input label="Work email" placeholder="jane@company.com" type="email" className="sm:col-span-2"/><Input label="Company" placeholder="Company name"/><label className="text-sm text-[#59647a]">Topic<select className="mt-2 h-12 w-full rounded-lg border border-[#d8e0eb] bg-[#f7f9fc] px-4"><option>Product question</option><option>Enterprise sales</option><option>Billing</option><option>Technical support</option><option>Partnership</option></select></label><label className="sm:col-span-2 text-sm text-[#59647a]">Message<textarea required rows={6} placeholder="Share the context, goals, or issue..." className="mt-2 w-full resize-none rounded-lg border border-[#d8e0eb] bg-[#f7f9fc] p-4"/></label></div><Button type="submit" size="lg" className="mt-6 w-full"><Send className="size-4"/> Send message</Button></form>}
            </div>
          </Reveal>
        </div>
      </section>

      <section className="figma-grid bg-[#f7fbff] py-20"><div className="site-container"><Reveal className="text-center"><SectionEyebrow>OFFICE LOCATIONS</SectionEyebrow><h2 className="display-2 mt-6">Local context. <span className="text-ziplin-yellow">Global support.</span></h2></Reveal><div className="mt-12 grid gap-6 md:grid-cols-3">{[['Bengaluru, India','Product, engineering, and operations','IST'],['London, United Kingdom','Customer success and partnerships','GMT'],['New York, United States','Enterprise growth and support','ET']].map(([city,role,zone],i)=><Reveal key={city} delay={i*.08}><motion.article whileHover={{y:-6}} className="h-full rounded-[20px] border border-[#dbe4ef] bg-white p-7 shadow-[8px_8px_0_rgba(8,28,69,.07)]"><MapPin className="size-7 text-ziplin-yellow"/><h3 className="mt-5 font-display text-2xl">{city}</h3><p className="mt-3 text-sm leading-6 text-[#68748a]">{role}</p><div className="mt-5 flex items-center gap-2 text-xs text-ziplin-blue"><Clock3 className="size-4"/> {zone}</div></motion.article></Reveal>)}</div></div></section>
      <CtaSection />
      <SiteFooter />
    </PageTransition>
  );
}

function Input({label,className='',...props}:{label:string;className?:string}&React.InputHTMLAttributes<HTMLInputElement>){return <label className={`text-sm text-[#59647a] ${className}`}>{label}<input required {...props} className="mt-2 h-12 w-full rounded-lg border border-[#d8e0eb] bg-[#f7f9fc] px-4"/></label>}
