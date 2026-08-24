import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { featureLinks, legalLinks, resourceLinks, solutionLinks } from '@/data/navigation';

const socialIcons = [
  ['Instagram', 'social-instagram.svg'], ['WhatsApp', 'social-whatsapp.svg'], ['X', 'social-x.svg'],
  ['Facebook', 'social-facebook.svg'], ['LinkedIn', 'social-linkedin.svg'], ['YouTube', 'social-youtube.svg'],
];

export function SiteFooter() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (email.trim()) setSubmitted(true);
  };

  return (
    <footer className="relative overflow-hidden bg-[#010a28] text-white">
      <div className="pointer-events-none absolute inset-0 opacity-20">
        <img src="/figma-assets/footer-chain.png" alt="" className="absolute left-8 top-28 h-auto w-[calc(100%-64px)] max-w-[896px] object-contain object-left opacity-20" />
        <img
          src="/figma-assets/logo.png"
          alt=""
          className="absolute right-8 top-24 h-auto w-[min(900px,80vw)] brightness-0 invert opacity-[.16]"
        />
      </div>

      <div className="landing-footer-content relative mx-auto max-w-[1280px] px-8 py-12">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_2fr] lg:items-start">
          <div>
            <Link to="/" aria-label="Ziplin home" className="inline-flex items-center gap-0">
              <span
                aria-hidden="true"
                className="h-[68px] w-[72px] shrink-0 -translate-y-1 bg-white"
                style={{
                  WebkitMaskImage: "url('/figma-assets/logo.png')",
                  WebkitMaskPosition: '-47px -9px',
                  WebkitMaskRepeat: 'no-repeat',
                  WebkitMaskSize: '350px auto',
                  maskImage: "url('/figma-assets/logo.png')",
                  maskPosition: '-47px -9px',
                  maskRepeat: 'no-repeat',
                  maskSize: '350px auto',
                }}
              />
              <span aria-hidden="true" className="relative h-[58px] w-[110px] shrink-0 translate-y-[4px]">
                <span
                  className="absolute left-0 top-0 h-[36px] w-[110px] bg-ziplin-yellow"
                  style={{
                    WebkitMaskImage: "url('/figma-assets/logo.png')",
                    WebkitMaskPosition: '-94px -13px',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: '260px auto',
                    maskImage: "url('/figma-assets/logo.png')",
                    maskPosition: '-94px -13px',
                    maskRepeat: 'no-repeat',
                    maskSize: '260px auto',
                  }}
                />
                <span
                  className="absolute left-4 top-[42px] h-[11px] w-[76px] bg-white"
                  style={{
                    WebkitMaskImage: "url('/figma-assets/logo.png')",
                    WebkitMaskPosition: '-109px -57px',
                    WebkitMaskRepeat: 'no-repeat',
                    WebkitMaskSize: '260px auto',
                    maskImage: "url('/figma-assets/logo.png')",
                    maskPosition: '-109px -57px',
                    maskRepeat: 'no-repeat',
                    maskSize: '260px auto',
                  }}
                />
              </span>
            </Link>
            <p className="mt-6 max-w-[312px] text-sm leading-6 text-[#c8d3e6]">
              Branded links, QR codes, campaigns, and analytics built for teams that need every click tracked.
            </p>
            <div className="mt-8">
              <h3 className="font-body text-[20px] leading-[27px] text-ziplin-yellow">Subscribe to our newsletter</h3>
              <p className="mt-2 max-w-[336px] text-xs leading-[15px] text-[#d9e3f7]">Get the latest marketing strategies and platform releases directly to your inbox.</p>
              {submitted ? <p className="mt-4 text-sm text-ziplin-yellow">You are subscribed.</p> : (
                <form onSubmit={submit} className="relative mt-4 h-12 max-w-[360px]">
                  <img src="/figma-assets/mail.svg" alt="" className="absolute left-4 top-4 size-4" />
                  <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Enter your email" className="h-full w-full rounded-[9px] border border-[#e2e8f0]/80 bg-white pl-10 pr-[120px] text-xs text-ziplin-navy placeholder:text-[#90a1b9]" />
                  <button type="submit" className="absolute right-2 top-2 flex h-8 items-center gap-2 rounded-[9px] bg-ziplin-navy px-4 text-[11px] font-semibold text-white">Subscribe <img src="/figma-assets/arrow-right.svg" alt="" className="size-3" /></button>
                </form>
              )}
            </div>
          </div>

          <div>
            <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-5">
              <FooterColumn title="Why Ziplin?" links={[{ label: 'Pricing', to: '/pricing' }]} />
              <FooterColumn title="Features" links={featureLinks} />
              <FooterColumn title="Solutions" links={solutionLinks} />
              <FooterColumn title="Resources" links={resourceLinks} />
              <FooterColumn title="Legal" links={legalLinks} />
            </div>

          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-8 text-center">
          <h3 className="text-[20px] font-semibold leading-8 tracking-[.2px]">Connect with us</h3>
          <div className="mt-4 flex flex-wrap justify-center gap-4">
            {socialIcons.map(([label, icon]) => (
              <a key={label} href="#social" aria-label={label} className="flex size-12 items-center justify-center rounded-md bg-[#d9e3f2] transition hover:bg-white">
                <img src={`/figma-assets/${icon}`} alt="" className="size-9 object-contain" />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-white/10 pt-6 text-[13px] leading-6 text-[#a0aec0] lg:flex-row lg:items-center lg:justify-between">
          <p>2026 Ziplin India Private Limited. All rights reserved.</p>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link to="/privacy">Cookie Policy</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms &amp; Conditions</Link>
            <Link to="/terms">Refund Policy</Link>
            <Link to="/terms">Cancellation Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; to: string }[] }) {
  return (
    <div className="relative z-10">
      <h3 className="font-body text-[18px] leading-7 text-ziplin-yellow">{title}</h3>
      <ul className="mt-4 space-y-2">
        {links.map((link) => (
          <li key={`${title}-${link.to}-${link.label}`}>
            <Link to={link.to} className="text-sm leading-6 text-white/90 hover:text-ziplin-yellow">{link.label}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
