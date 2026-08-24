import { AnimatePresence, motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import type { FaqItem } from '@/data/types';
import { Reveal } from '@/components/ui/Reveal';
import { SectionEyebrow } from '@/components/ui/SectionEyebrow';

export function FaqSection({ items, title = 'Frequently asked questions', accent = 'questions' }: { items: FaqItem[]; title?: string; accent?: string }) {
  const [open, setOpen] = useState<number | null>(null);
  const [before, after = ''] = title.split(accent);

  return (
    <section className="mx-auto min-h-[704px] max-w-[1280px] overflow-hidden rounded-[24px] bg-[rgba(253,195,60,.1)] px-8 py-14 lg:py-[88px]">
      <div>
        <Reveal className="text-center">
          <SectionEyebrow>FAQ</SectionEyebrow>
          <h2 className="mt-6 font-display text-[38px] leading-tight text-ziplin-ink sm:text-[48px] sm:leading-[60px]">
            {before}<span className="text-ziplin-yellow">{accent}</span>{after}
          </h2>
        </Reveal>
        <div className="mt-10 space-y-6">
          {items.map((item, index) => {
            const active = open === index;
            return (
              <Reveal key={item.question} delay={index * 0.045}>
                <motion.div
                  layout
                  transition={{ layout: { duration: 0.3, ease: [0.42, 0, 0.58, 1] } }}
                  className={`overflow-hidden rounded-lg shadow-[0_2px_6px_rgba(0,0,0,.16)] ${active ? 'border border-[#081c45] bg-[#081c45]' : 'border border-[#d5d5d5] bg-white'}`}
                  onMouseEnter={() => setOpen(index)}
                  onMouseLeave={() => setOpen((current) => current === index ? null : current)}
                >
                  <button
                    type="button"
                    className="flex min-h-[72px] w-full items-center justify-between gap-4 rounded-lg bg-white px-4 py-6 text-left"
                    aria-expanded={active}
                    onClick={() => setOpen(active ? null : index)}
                  >
                    <span className="font-body text-[20px] leading-[27px] text-[#002b70]">{item.question}</span>
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full border-[1.6px] border-[#0a0e1a] bg-[#ffc60a] text-[#0a0e1a]">
                      {active ? <Minus className="size-4" /> : <Plus className="size-4" />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {active ? (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.42, 0, 0.58, 1] }}
                      >
                        <p className="bg-[#081c45] px-8 py-4 text-[18px] font-semibold leading-7 text-white">{item.answer}</p>
                      </motion.div>
                    ) : null}
                  </AnimatePresence>
                </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
