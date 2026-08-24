import { ButtonLink } from '@/components/ui/Button';

export function CtaSection(_: { compact?: boolean } = {}) {
  return (
    <section className="mx-auto max-w-[1280px] px-8 py-16">
      <div className="relative mx-auto mb-6 flex min-h-10 w-full max-w-[620px] flex-wrap items-center justify-center gap-4 rounded-full border border-[#ffc83d] bg-[#ffc83d] px-4 py-2 text-[12px] text-[#0f254e] shadow-sm">
        <span className="tracking-[1px] text-[#0f254e]">*****</span>
        <strong className="text-[13.5px] font-semibold text-[#0f254e]">4.9 / 5</strong>
        <span className="h-4 w-px bg-[#0f254e]/20" />
        <span className="text-[#0f254e]">Trusted by 50,000+ marketers</span>
        <span className="rounded-full bg-[#0f254e] px-4 py-2 font-mono text-xs text-[#ffc83d]">2,847 reviews</span>
      </div>
      <div className="relative mx-auto flex w-full flex-col items-center overflow-hidden rounded-[36px] bg-[#0f254e] px-6 py-10 text-center text-white sm:px-10 sm:py-12 lg:px-16">
        <img src="/figma-assets/cta-background.svg" alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="relative flex w-full max-w-[1120px] flex-col items-center">
          <h2 className="font-display text-[26px] leading-[1.12] text-white sm:text-[34px] lg:whitespace-nowrap lg:text-[40px]">
            Trusted by teams that grow faster with <span className="text-ziplin-yellow">Ziplin.</span>
          </h2>
          <p className="mt-4 max-w-[920px] text-base leading-6 text-[#9fb0d6] sm:text-[18px]">
            See why marketers, creators, agencies, and businesses rely on Ziplin to shorten links, track campaigns, generate QR codes, and measure performance from one platform.
          </p>
          <div className="mt-8 flex w-full flex-col justify-center gap-4 sm:flex-row">
            <ButtonLink to="/pricing" className="h-12 w-full rounded-md text-base sm:w-[208px]">Get started</ButtonLink>
            <ButtonLink to="/demo" variant="glass" className="h-12 w-full rounded-md border border-white/20 bg-white/10 text-base sm:w-[208px]">Schedule a demo</ButtonLink>
          </div>
        </div>
      </div>
    </section>
  );
}
