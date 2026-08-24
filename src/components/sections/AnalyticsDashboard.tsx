import { motion } from 'framer-motion';
import { BarChart3, Globe2, MousePointerClick, TrendingUp } from 'lucide-react';
import { Reveal } from '@/components/ui/Reveal';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export function AnalyticsDashboard({ metrics, title = 'Your command center for smarter links', description = 'Track performance across every channel, optimize for conversions, and keep every branded campaign under control.' }: { metrics: { label: string; value: string }[]; title?: string; description?: string }) {
  const normalized = metrics.length >= 4 ? metrics.slice(0, 4) : [...metrics, { label: 'Active campaigns', value: '67' }].slice(0, 4);
  return (
    <section className="figma-grid bg-[#f7fbff] py-20 sm:py-28">
      <div className="site-container">
        <Reveal className="text-center">
          <SectionEyebrow>ANALYTICS</SectionEyebrow>
          <h2 className="display-2 mx-auto mt-6 max-w-[780px]">{title}</h2>
          <p className="mx-auto mt-4 max-w-[720px] text-base leading-7 text-[#667089] sm:text-lg">{description}</p>
        </Reveal>

        <Reveal delay={0.1} className="mx-auto mt-12 max-w-[1120px]">
          <div className="overflow-hidden rounded-[22px] border border-[#b7c7df] bg-white shadow-[0_24px_70px_rgba(8,28,69,.16)]">
            <div className="flex items-center justify-between border-b border-[#e2e8f0] px-5 py-4 sm:px-7">
              <div className="flex items-center gap-3"><span className="font-display text-lg text-ziplin-navy">ziplin</span><span className="rounded-md bg-[#edf3ff] px-3 py-1 text-xs text-ziplin-blue">Analytics overview</span></div>
              <div className="flex gap-1.5"><i className="size-2.5 rounded-full bg-[#ff4fa0]" /><i className="size-2.5 rounded-full bg-[#ffc60a]" /><i className="size-2.5 rounded-full bg-[#b4ff4f]" /></div>
            </div>
            <div className="grid lg:grid-cols-[215px_1fr]">
              <aside className="hidden border-r border-[#e5ebf4] bg-[#f8faff] p-5 lg:block">
                {['Overview', 'Links', 'Campaigns', 'QR codes', 'Bio pages', 'Pixels', 'Reports', 'Settings'].map((item, index) => <div key={item} className={`mb-2 rounded-lg px-4 py-2.5 text-sm ${index === 0 ? 'bg-ziplin-blue text-white' : 'text-[#61708c]'}`}>{item}</div>)}
              </aside>
              <div className="p-5 sm:p-7">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {normalized.map((metric, index) => {
                    const Icon = [MousePointerClick, Globe2, TrendingUp, BarChart3][index];
                    return (
                      <motion.div key={metric.label} whileHover={{ y: -5 }} transition={{ duration: 0.3 }} className="rounded-xl border border-[#e2e8f0] bg-white p-5 shadow-[0_8px_24px_rgba(8,28,69,.06)]">
                        <Icon className="size-5 text-ziplin-yellow" />
                        <strong className="mt-3 block font-display text-3xl text-ziplin-navy">{metric.value}</strong>
                        <span className="mt-1 block text-xs text-[#71809b]">{metric.label}</span>
                      </motion.div>
                    );
                  })}
                </div>
                <div className="mt-6 grid gap-5 xl:grid-cols-[1.65fr_1fr]">
                  <div className="rounded-xl border border-[#e2e8f0] p-5">
                    <div className="flex items-center justify-between"><h3 className="font-body text-lg text-ziplin-navy">Performance trends</h3><span className="text-xs text-[#7a859a]">Last 30 days</span></div>
                    <div className="mt-7 flex h-[230px] items-end gap-2 sm:gap-3">
                      {[38, 52, 46, 68, 61, 84, 76, 96, 73, 91, 100, 88].map((height, index) => <motion.div key={index} initial={{ height: 0 }} whileInView={{ height: `${height}%` }} viewport={{ once: true }} transition={{ duration: 0.55, delay: index * 0.035 }} className="min-w-0 flex-1 rounded-t-md bg-gradient-to-t from-ziplin-blue to-[#5c86e0]" />)}
                    </div>
                  </div>
                  <div className="rounded-xl border border-[#e2e8f0] p-5">
                    <h3 className="font-body text-lg text-ziplin-navy">Traffic by source</h3>
                    <div className="mt-7 space-y-5">
                      {[['Social', '42%', 78], ['Direct', '28%', 54], ['Email', '18%', 38], ['Search', '12%', 26]].map(([name, value, width]) => <div key={name as string}><div className="flex justify-between text-sm"><span>{name}</span><strong>{value}</strong></div><div className="mt-2 h-2 rounded-full bg-[#edf1f7]"><motion.div initial={{ width: 0 }} whileInView={{ width: `${width}%` }} viewport={{ once: true }} transition={{ duration: .7 }} className="h-full rounded-full bg-ziplin-yellow" /></div></div>)}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
