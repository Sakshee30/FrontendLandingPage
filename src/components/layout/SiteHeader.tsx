import { AnimatePresence, motion } from 'framer-motion';
import { Barcode, BarChart3, BookOpen, ContactRound, Crosshair, DollarSign, FilePenLine, FolderUp, GitCompareArrows, Globe2, HelpCircle, Info, Link2, Megaphone, Menu, MessageCircle, QrCode, ShoppingCart, UserRound, UsersRound, Video, Webhook, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { featureLinks, resourceLinks, solutionLinks } from '@/data/navigation';
import { BrandLogo } from '@/components/ui/BrandArt';
import { ButtonLink } from '@/components/ui/Button';

const menuMotion = {
  initial: { opacity: 0, y: -8, scale: 0.985 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -8, scale: 0.985 },
  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
};

type MenuKind = 'features' | 'resources' | 'solutions' | null;

const featureMenuDetails = {
  '/features/url-shortener': { icon: Link2, description: 'Shorten lengthy URLs into clean, memorable links in one click' },
  '/features/utm-tracking': { icon: BarChart3, description: 'Track clicks, geography, and referrers with real-time dashboards' },
  '/features/qr-code-generator': { icon: QrCode, description: 'Generate dynamic QR codes linked to any destination instantly' },
  '/features/campaigns': { icon: Megaphone, description: 'Manage and track your marketing campaigns with ease' },
  '/features/bio-pages': { icon: UserRound, description: 'Build beautiful link-in-bio pages to showcase all your content' },
  '/features/2d-barcode': { icon: Barcode, description: 'Encode data into scannable 2D barcodes for products and assets' },
  '/features/file-sharing': { icon: FolderUp, description: 'Share files securely with password protection and expiry dates' },
  '/features/webhooks': { icon: Webhook, description: 'Receive real-time notifications for key link-management events' },
  '/features/retargeting': { icon: Crosshair, description: 'Track clicks and retarget high-intent audiences across campaigns' },
} as const;

const solutionMenuDetails = {
  '/solutions/digital-marketing': { icon: Globe2, description: 'Manage multiple client campaigns with branded links and team collaboration' },
  '/solutions/affiliate-marketing': { icon: DollarSign, description: 'Track affiliate clicks, optimize commissions, and cloak links effortlessly' },
  '/solutions/ecommerce': { icon: ShoppingCart, description: 'Drive product sales with trackable short links across all channels' },
  '/solutions/media-entertainment': { icon: UsersRound, description: 'Create clean, shareable links with built-in analytics for every platform' },
  '/solutions/content-creators': { icon: FilePenLine, description: 'Manage your content campaigns with branded links and real-time performance insights.' },
  '/solutions/influencers': { icon: Video, description: 'Manage sponsored campaigns, branded links, and performance in one place' },
} as const;

const resourceMenuDetails = {
  '/blog': { icon: BookOpen, description: 'Read product insights, deep-dives, and practical growth guides' },
  '/compare': { icon: GitCompareArrows, description: 'Compare Ziplin with other link-management platforms' },
  '/about': { icon: Info, description: 'Learn about Ziplin, our mission, values, and story' },
  '/help': { icon: HelpCircle, description: 'Find answers, guides, popular topics, and product support' },
  '/contact': { icon: ContactRound, description: 'Talk with our product, support, partnership, or sales team' },
  '/community': { icon: MessageCircle, description: 'Share ideas, join discussions, and shape what we build next' },
} as const;

const desktopNavItemClass =
  'site-header-nav-item flex h-20 items-center gap-2 px-2 transition hover:text-ziplin-navy';

function DesktopDropdown({ kind, onClose }: { kind: Exclude<MenuKind, null>; onClose: () => void }) {
  const config = {
    features: {
      title: 'Link infrastructure',
      intro: 'Create, route, measure, and automate every customer journey.',
      links: featureLinks,
      columns: 3,
    },
    resources: {
      title: 'Learn with Ziplin',
      intro: 'Guides, product thinking, support, and community conversations.',
      links: resourceLinks,
      columns: 2,
    },
    solutions: {
      title: 'Built around your work',
      intro: 'Purpose-built journeys for creators, marketers, agencies, and commerce teams.',
      links: solutionLinks,
      columns: 2,
    },
  }[kind];

  if (kind === 'features') {
    return (
      <div
        className="absolute left-1/2 top-[72px] z-50 w-[min(1128px,calc(100vw-48px))] -translate-x-1/2"
        onMouseLeave={onClose}
      >
        <motion.div
          {...menuMotion}
          className="w-full rounded-[24px] border border-[#dfe6f1] bg-white p-6 shadow-[0_24px_80px_rgba(8,28,69,.18)]"
        >
        <div className="grid grid-flow-col grid-rows-4 gap-x-8 gap-y-2">
          {featureLinks.map((link) => {
            const detail = featureMenuDetails[link.to as keyof typeof featureMenuDetails];
            const Icon = detail.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className="group grid min-h-[88px] grid-cols-[48px_1fr] gap-4 rounded-xl border border-transparent p-2 transition duration-300 hover:border-[#e1e8f4] hover:bg-[#f7f9ff]"
              >
                <span className="flex size-12 items-center justify-center rounded-lg bg-[#f1f5fa] text-ziplin-blue">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                <span>
                  <span className="block text-[17px] leading-6 text-ziplin-blue transition group-hover:translate-x-0.5">{link.label}</span>
                  <span className="mt-2 block max-w-[248px] text-[12px] leading-[17px] text-[#444651]">{detail.description}</span>
                </span>
              </NavLink>
            );
          })}
        </div>
        </motion.div>
      </div>
    );
  }

  const menuDetails: Record<string, { icon: LucideIcon; description: string }> = kind === 'solutions' ? solutionMenuDetails : resourceMenuDetails;

  return (
    <div
      className="absolute left-1/2 top-[72px] z-50 w-[min(1128px,calc(100vw-48px))] -translate-x-1/2"
      onMouseLeave={onClose}
    >
      <motion.div
        {...menuMotion}
        className="w-full rounded-[24px] border border-[#dfe6f1] bg-white p-6 shadow-[0_24px_80px_rgba(8,28,69,.18)]"
      >
      <div className={kind === 'solutions' ? 'grid grid-flow-col grid-rows-3 gap-x-10 gap-y-2' : 'grid gap-x-10 gap-y-2 md:grid-cols-2'}>
        <div className="hidden">
          <span className="font-mono text-[11px] uppercase tracking-[.16em] text-ziplin-yellow">Ziplin</span>
          <h2 className="mt-4 font-display text-2xl leading-tight">{config.title}</h2>
          <p className="mt-4 text-sm leading-6 text-white/65">{config.intro}</p>
          <Link to="/demo" className="mt-6 inline-flex text-sm text-ziplin-yellow hover:text-white">See it in action →</Link>
        </div>
        <div className="contents">
          {config.links.map((link) => {
            const detail = menuDetails[link.to];
            const Icon = detail.icon;
            return (
            <NavLink
              key={link.to}
              to={link.to}
              className="group grid min-h-24 grid-cols-[48px_1fr] gap-4 rounded-xl border border-transparent p-2 transition duration-300 hover:border-[#e1e8f4] hover:bg-[#f7f9ff]"
            >
              <span className="flex size-12 items-center justify-center rounded-lg bg-[#f1f5fa] text-ziplin-blue"><Icon className="size-5"/></span>
              <span><span className="block text-[17px] leading-6 text-ziplin-blue transition group-hover:translate-x-0.5">{link.label}</span><span className="mt-2 block max-w-[328px] text-[12px] leading-[17px] text-[#444651]">{detail.description}</span></span>
            </NavLink>
          )})}
        </div>
      </div>
      </motion.div>
    </div>
  );
}

export function SiteHeader() {
  const [openMenu, setOpenMenu] = useState<MenuKind>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    setMobileOpen(false);
    setOpenMenu(null);
  }, [location.pathname]);

  const scheduleClose = () => {
    if (closeTimer.current !== undefined) window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  };

  const open = (menu: Exclude<MenuKind, null>) => {
    if (closeTimer.current !== undefined) window.clearTimeout(closeTimer.current);
    setOpenMenu(menu);
  };

  const Chevron = ({ alt = false }: { alt?: boolean }) => (
    <img
      src={alt ? '/figma-assets/chevron-down-alt.svg' : '/figma-assets/chevron-down.svg'}
      alt=""
      className="h-4 w-4"
    />
  );

  return (
    <header className="sticky top-0 z-[80] h-20 border-b border-[#e8e8e8] bg-white/95 shadow-[1px_1px_4px_rgba(0,0,0,.18)] backdrop-blur-xl">
      <style>{`
        .site-header-nav-item {
          appearance: none;
          border: 0;
          background: transparent;
          font-family: var(--font-body);
          font-size: 17px;
          font-weight: 400 !important;
          line-height: 24px;
          letter-spacing: 0;
        }

        .site-header-nav-item img {
          flex: 0 0 auto;
          width: 14px;
          height: 14px;
        }
      `}</style>
      <div className="landing-nav-shell relative flex h-full items-center">
        <Link to="/" aria-label="Ziplin home" className="relative z-10 shrink-0">
          <BrandLogo className="h-12" />
        </Link>

        <div className="hidden min-w-0 flex-1 items-center justify-between pl-8 lg:flex xl:pl-12 2xl:pl-24">
        <nav aria-label="Primary navigation" className="flex h-20 items-center justify-center gap-8 font-body">
          <div onMouseEnter={() => open('features')} onMouseLeave={scheduleClose}>
            <button type="button" className={`${desktopNavItemClass} text-ziplin-royal`} aria-expanded={openMenu === 'features'}>
              <span>Features</span> <Chevron alt />
            </button>
          </div>
          <NavLink to="/pricing" className={({ isActive }) => `${desktopNavItemClass} ${isActive ? 'text-ziplin-navy' : 'text-ziplin-royal'}`}>
            <span>Pricing</span>
          </NavLink>
          <div onMouseEnter={() => open('resources')} onMouseLeave={scheduleClose}>
            <button type="button" className={`${desktopNavItemClass} text-ziplin-royal`} aria-expanded={openMenu === 'resources'}>
              <span>Resources</span> <Chevron />
            </button>
          </div>
          <div onMouseEnter={() => open('solutions')} onMouseLeave={scheduleClose}>
            <button type="button" className={`${desktopNavItemClass} text-ziplin-royal`} aria-expanded={openMenu === 'solutions'}>
              <span>Solution</span> <Chevron />
            </button>
          </div>
        </nav>

        <div className="ml-8 flex items-center gap-8 xl:ml-12 2xl:ml-24">
          <Link to="/login" className="site-header-nav-item flex h-20 items-center px-2 text-ziplin-blue transition hover:text-ziplin-yellow">Log in</Link>
          <ButtonLink to="/signup" size="md" className="w-[136px]">Sign up</ButtonLink>
        </div>
        </div>

        <button
          type="button"
          className="ml-auto rounded-md p-2 text-ziplin-navy lg:hidden"
          aria-label={mobileOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((value) => !value)}
        >
          {mobileOpen ? <X /> : <Menu />}
        </button>

        <AnimatePresence>
          {openMenu ? (
            <div onMouseEnter={() => open(openMenu)} onMouseLeave={scheduleClose}>
              <DesktopDropdown kind={openMenu} onClose={() => setOpenMenu(null)} />
            </div>
          ) : null}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'calc(100vh - 80px)' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-y-auto border-t border-[#e8e8e8] bg-white xl:hidden"
          >
            <div className="space-y-8 px-6 py-8">
              <div>
                <p className="font-mono text-xs uppercase tracking-[.15em] text-ziplin-yellow">Features</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {featureLinks.map((link) => <NavLink key={link.to} to={link.to} className="rounded-lg px-4 py-2 text-ziplin-blue hover:bg-[#f5f7ff]">{link.label}</NavLink>)}
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[.15em] text-ziplin-yellow">Solutions</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {solutionLinks.map((link) => <NavLink key={link.to} to={link.to} className="rounded-lg px-4 py-2 text-ziplin-blue hover:bg-[#f5f7ff]">{link.label}</NavLink>)}
                </div>
              </div>
              <div>
                <p className="font-mono text-xs uppercase tracking-[.15em] text-ziplin-yellow">Resources</p>
                <div className="mt-4 grid gap-2 sm:grid-cols-2">
                  {resourceLinks.map((link) => <NavLink key={link.to} to={link.to} className="rounded-lg px-4 py-2 text-ziplin-blue hover:bg-[#f5f7ff]">{link.label}</NavLink>)}
                </div>
              </div>
              <div className="flex gap-4 border-t pt-6">
                <ButtonLink to="/pricing" variant="outline" className="flex-1">Pricing</ButtonLink>
                <ButtonLink to="/pricing" className="flex-1">Sign up</ButtonLink>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
