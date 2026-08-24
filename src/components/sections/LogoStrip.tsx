import { motion } from 'framer-motion';

const logos = ['Acme Corp', 'Globex', 'Soylent', 'Initech', 'Umbrella'];

export function LogoStrip() {
  return (
    <section className="overflow-hidden bg-[#eff4fc] py-10">
      <p className="text-center font-mono text-[11px] uppercase tracking-[.18em] text-[#566178]">Trusted by 5,000+ forward-thinking teams</p>
      <div className="mt-6 flex justify-center overflow-hidden">
        <motion.div className="flex min-w-max items-center gap-14 px-10 sm:gap-20" animate={{ x: [0, -80, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }}>
          {logos.map((logo) => <span key={logo} className="font-display text-xl font-semibold text-[#707887] grayscale sm:text-2xl">◈ {logo}</span>)}
        </motion.div>
      </div>
    </section>
  );
}
