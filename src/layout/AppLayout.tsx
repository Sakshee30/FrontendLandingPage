import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router';
import {
  LayoutDashboard, Link2, BarChart2, QrCode, User,
  Settings as SettingsIcon, Bell, Megaphone, ChevronLeft,
  ChevronDown, LogOut, UserCircle, Files as FilesIcon,
  Eye, HelpCircle, CreditCard, Plus, Search,
  Replace, Lock, Zap, Globe2, ScanBarcode, ExternalLink,
  Layers, Boxes, Trash2,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../app/services/auth';
import { ZiplinLink } from '../app/services/links';
import { LandingLogo } from './components/landing-logo';


type NavItem = { label: string; path: string; icon: React.ElementType; adminOnly?: boolean };
type NavSection = { title: string; items: NavItem[] };

const NAV_SECTIONS: NavSection[] = [
  {
    title: 'Overview',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Links', path: '/links', icon: Link2 },
      { label: 'Analytics', path: '/analytics', icon: BarChart2 },
      { label: 'QR Codes', path: '/qr', icon: QrCode },
      { label: 'Bio Pages', path: '/bio', icon: User },
    ],
  },
  {
    title: 'Advanced',
    items: [
      { label: 'Campaigns', path: '/campaigns', icon: Megaphone, adminOnly: true },
      { label: 'Files', path: '/files', icon: FilesIcon, adminOnly: true },
      { label: 'Link Previews', path: '/previews', icon: Eye, adminOnly: true },
      { label: 'Migrations', path: '/migrations', icon: Replace, adminOnly: true },
      { label: 'Settings', path: '/settings', icon: SettingsIcon, adminOnly: true },
    ],
  },
  {
    title: 'Account',
    items: [
      { label: 'Subscription', path: '/subscription', icon: CreditCard },
      { label: 'Help Center', path: '/help', icon: HelpCircle },
    ],
  },
];

const FREE_ALLOWED_PATHS = ['/dashboard', '/qr', '/barcodes', '/subscription'];

const FREE_NAV_SECTIONS: NavSection[] = [
  {
    title: 'Free',
    items: [
      { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { label: 'Links', path: '/links', icon: Link2 },
      { label: 'QR Codes', path: '/qr', icon: QrCode },
      { label: 'Bio Pages', path: '/bio', icon: User },
      { label: 'Campaigns', path: '/campaigns', icon: Megaphone },
      { label: 'Custom Domains', path: '/settings/domains', icon: Globe2 },
      { label: 'Barcodes', path: '/barcodes', icon: ScanBarcode },
      { label: 'File Sharing', path: '/files', icon: ExternalLink },
      { label: 'Analytics', path: '/analytics', icon: BarChart2 },
      { label: 'Bulk Import', path: '/links/import', icon: Layers },
      { label: 'Integrations', path: '/settings/integrations', icon: Boxes },
      { label: 'Trash', path: '/trash', icon: Trash2 },
      { label: 'Setting', path: '/settings', icon: SettingsIcon },
    ],
  },
];

export type AppLayoutCtx = {
  openCreateLink: (initialUrl?: string) => void;
  openEditLink: (link: ZiplinLink) => void;
  openLinkAnalytics: (link: ZiplinLink) => void;
  openLinkQr: (link: ZiplinLink) => void;
  isAdmin: boolean;
  linksRefreshKey: number;
  handleLinkCreated: () => void;
};

export default function AppLayout() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { user, setSession } = useAuth();

  const [mini, setMini] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [linksRefreshKey, setLinksRefreshKey] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAdmin = user?.role === 'admin' || user?.role === 'owner';
  const isFreeUser = !user?.plan || user.plan.slug === 'free';
  const initial = (user?.name?.charAt(0) ?? 'U').toUpperCase();
  const freeRouteAllowed = FREE_ALLOWED_PATHS.some((path) => pathname === path || pathname.startsWith(path + '/'));

  async function handleLogout() {
    await logout();
    setSession(null);
    navigate('/login', { replace: true });
  }
  function openCreateLink(initialUrl: string = '') {
    const safeInitialUrl = typeof initialUrl === 'string' ? initialUrl.trim() : '';
    const params = safeInitialUrl ? `?url=${encodeURIComponent(safeInitialUrl)}` : '';
    navigate(`/links/new${params}`);
  }
  function openEditLink(link: ZiplinLink) { navigate(`/links/${link.id}/edit`); }
  function openLinkAnalytics(link: ZiplinLink) {
    localStorage.setItem('ziplin-analytics-link-id', link.id);
    navigate('/analytics');
  }
  function openLinkQr(link: ZiplinLink) {
    localStorage.setItem('ziplin-qr-prefill', JSON.stringify({ name: `${link.title} QR`, destinationUrl: link.shortUrl }));
    navigate('/qr');
  }
  function handleLinkCreated() {
    setLinksRefreshKey((v) => v + 1);
    navigate('/links');
  }

  const ctx: AppLayoutCtx = { openCreateLink, openEditLink, openLinkAnalytics, openLinkQr, isAdmin, linksRefreshKey, handleLinkCreated };

  if (isFreeUser) {
    const freeItems = FREE_NAV_SECTIONS[0].items;
    return (
      <div className="flex h-screen w-screen flex-col overflow-hidden bg-[#DCE7F5] font-sans text-[#081C45]">
        <div className="h-[64px] shrink-0 bg-[#081C45] text-white">
          <div className="flex h-full items-center justify-center gap-6 text-[16px] font-medium">
            <span>Discover easier ways to boost growth.</span>
            <button
              type="button"
              onClick={() => navigate('/subscription')}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/50 bg-white/10 px-5 text-[16px] font-medium text-white hover:bg-white/15"
            >
              <Zap size={17} className="fill-white" />
              Upgrade
            </button>
          </div>
        </div>

        <header className="relative z-40 flex h-[56px] shrink-0 items-center border-b border-[#D1D5DB] bg-white px-7 shadow-[0_4px_14px_rgba(8,28,69,0.12)]">
          <button
            onClick={() => setMobileOpen(true)}
            className="mr-3 flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 md:hidden"
            type="button"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <img src="/ziplin-brand-logo.png" alt="ziplin" className="h-auto w-[128px] object-contain" />
          <div className="flex-1" />
          <div className="relative">
            <button
              onClick={() => { setAccountOpen((v) => !v); setNotifOpen(false); }}
              className="flex items-center gap-3 border-none bg-transparent p-0 text-[14px] font-medium text-black"
              type="button"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black bg-[#F4B400] text-xs font-bold text-[#081C45]">
                {initial}
              </span>
              <span>{user?.name || 'John Doe'}</span>
              <ChevronDown size={16} />
            </button>
            {accountOpen && (
              <div className="absolute right-0 top-[44px] z-50 w-[220px] rounded-[14px] border border-[#e8edf3] bg-white p-1.5 shadow-[0_8px_32px_rgba(0,0,0,0.12)]">
                <div className="mb-1 border-b border-[#e8edf3] px-2.5 py-2 text-left">
                  <div className="text-[13px] font-semibold text-[#0f172a]">{user?.name}</div>
                  <div className="mt-0.5 truncate text-[11px] font-normal text-[#94a3b8]">{user?.email}</div>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded bg-transparent px-2.5 py-2 text-left text-[13px] font-medium text-[#dc2626] hover:bg-[#f8fafc]"
                  type="button"
                >
                  <LogOut size={14} /> Sign out
                </button>
              </div>
            )}
          </div>
        </header>

        <div className="flex min-h-0 flex-1">
          <aside className="hidden w-[236px] shrink-0 flex-col border-r border-[#D1D5DB] bg-white md:flex">
            <nav className="flex-1 overflow-y-auto px-7 py-6">
              {freeItems.map(({ label, path, icon: Icon }, index) => {
                const active = pathname === path || pathname.startsWith(path + '/');
                const locked = !FREE_ALLOWED_PATHS.includes(path);
                return (
                  <div key={`${path}-${label}`}>
                    {index === 9 && <div className="my-4 border-t border-[#E5E7EB]" />}
                    <button
                      type="button"
                      onClick={() => navigate(locked ? '/subscription' : path)}
                      className={`relative mb-1.5 flex h-[43px] w-full items-center gap-3 rounded px-4 text-left text-[15px] font-medium transition-colors ${
                        active ? 'bg-[#C8D1DE] text-[#081C45]' : 'bg-transparent text-[#2F2F2F] hover:bg-[#FFF6CC]'
                      }`}
                    >
                      {active && <span className="absolute left-0 top-3 bottom-3 w-1 rounded-r bg-[#0E2F73]" />}
                      <Icon size={18} className={active ? 'text-[#F4B400]' : 'text-black'} />
                      <span>{label}</span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </aside>

          <main className="flex min-w-0 flex-1 flex-col overflow-hidden bg-white">
            {mobileOpen && (
              <div className="fixed inset-0 z-50 bg-slate-900/40 md:hidden" onClick={() => setMobileOpen(false)}>
                <aside className="h-full w-[292px] bg-white p-6" onClick={(event) => event.stopPropagation()}>
                  <img src="/ziplin-brand-logo.png" alt="ziplin" className="mb-8 h-auto w-[180px] object-contain" />
                  {freeItems.map(({ label, path, icon: Icon }) => {
                    const locked = !FREE_ALLOWED_PATHS.includes(path);
                    return (
                      <button
                        key={`${path}-${label}-mobile`}
                        type="button"
                        onClick={() => {
                          navigate(locked ? '/subscription' : path);
                          setMobileOpen(false);
                        }}
                        className="mb-2 flex h-12 w-full items-center gap-3 rounded px-3 text-left text-[#081C45]"
                      >
                        <Icon size={20} />
                        {label}
                      </button>
                    );
                  })}
                </aside>
              </div>
            )}

            <div className="min-h-0 flex-1 overflow-y-auto bg-[#DCE7F5]">
              {freeRouteAllowed ? <Outlet context={ctx} /> : <LockedFreeFeature onUpgrade={() => navigate('/subscription')} />}
            </div>
          </main>
        </div>
      </div>
    );
  }

  function SidebarContent({ isMobile = false }) {
    const isSidebarMini = !isMobile && mini;
    return (
      <>
        {isMobile && (
          <div className='h-[84px] shrink-0 flex items-center justify-start px-5'>
            <LandingLogo />
          </div>
        )}
        {/* Nav */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 py-5 text-left">
          {(isFreeUser ? FREE_NAV_SECTIONS : NAV_SECTIONS).map((section, sectionIndex) => {
            const visible = section.items.filter((i) => !i.adminOnly || isAdmin);
            if (!visible.length) return null;
            return (
              <div key={section.title} className={sectionIndex === 0 ? 'mb-1' : 'mb-1 border-t border-[#E5EAF1] pt-2'}>
                {isSidebarMini && sectionIndex > 0 && <div className="h-2" />}

                {visible.map(({ label, path, icon: Icon }) => {
                  const active = pathname === path || pathname.startsWith(path + '/');
                  const locked = isFreeUser && !FREE_ALLOWED_PATHS.includes(path);
                  return (
                    <button
                      key={path}
                      onClick={() => {
                        navigate(locked ? '/subscription' : path);
                        if (isMobile) setMobileOpen(false);
                      }}
                      title={isSidebarMini ? label : undefined}
                      className={`flex h-9 items-center w-full px-2.5 rounded border-none cursor-pointer mb-1 outline-none relative transition-all duration-150 text-[12px] font-sans ${active
                        ? 'bg-[#FFC60A] text-[#081C45] font-semibold'
                        : locked
                          ? 'text-[#667085] hover:bg-[#FFF6CC] hover:text-[#081C45] font-medium'
                          : 'text-[#111827] hover:bg-[#FFF6CC] hover:text-[#081C45] font-medium'
                        } ${isSidebarMini ? 'justify-center px-0 gap-0' : 'justify-start gap-2'}`}
                    >
                      {active && !isSidebarMini && (
                        <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-r-[3px] bg-[#081C45]" />
                      )}
                      <Icon size={14} className="shrink-0" />
                      {!isSidebarMini && <span className="flex-1 text-left">{label}</span>}
                      {locked && !isSidebarMini && <Lock size={11} className="shrink-0 text-[#98A2B3]" />}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FBFF] font-sans pt-[44px]">
      {/* ── Mobile Sidebar Drawer ── */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-[1px] z-50 md:hidden"
        />
      )}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 flex flex-col w-[190px] bg-white border-r border-[#dbe3ee] overflow-hidden transition-transform duration-300 md:hidden ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <SidebarContent isMobile={true} />
      </aside>

      {/* ── Desktop Sidebar ── */}
      <aside className={`hidden md:flex md:flex-col shrink-0 bg-white border-r border-[#dbe3ee] overflow-hidden transition-all duration-300 ${mini ? 'w-14' : 'w-[190px]'}`}>
        <SidebarContent isMobile={false} />

        {/* Collapse button */}
        <div className="border-t border-[#e8edf3] p-2">
          <button
            onClick={() => setMini(!mini)}
            className={`flex items-center gap-2 w-full p-2 rounded-lg border-none cursor-pointer bg-transparent outline-none text-[#94a3b8] hover:text-[#1e293b] text-xs font-semibold transition-colors ${mini ? 'justify-center' : 'justify-start'}`}
          >
            <ChevronLeft size={15} className={`shrink-0 transition-transform duration-300 ${mini ? 'rotate-180' : ''}`} />
            {!mini && 'Collapse sidebar'}
          </button>
        </div>
      </aside>

      {/* ── Main content area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        {isFreeUser && (
          <div className="h-10 shrink-0 bg-[#081C45] text-white flex items-center justify-center gap-3 text-xs font-semibold">
            <span>Discover easier ways to boost growth.</span>
            <button onClick={() => navigate('/subscription')} className="h-6 rounded-full border border-white/40 bg-white/10 px-3 text-xs font-semibold text-white">
              Upgrade
            </button>
          </div>
        )}
        <header className="fixed left-0 right-0 top-0 z-40 h-[44px] shrink-0 bg-white border-b border-[#dbe3ee] shadow-[0_3px_12px_rgba(8,30,73,0.12)] flex items-center px-7 gap-3">
          {/* Mobile hamburger menu toggle */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden p-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:text-slate-900 flex items-center justify-center shrink-0 cursor-pointer"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden md:flex shrink-0 items-center">
            <LandingLogo />
          </div>

          <div className="flex-1" />

          {/* New link button */}
          <button onClick={() => openCreateLink()} className="hidden">
            <Plus size={13} /> <span className="hidden sm:inline">New Link</span>
          </button>

          {/* Search icon */}
          <button className="hidden w-8.5 h-8.5 rounded-lg border border-[#e8edf3] bg-transparent cursor-pointer text-[#94a3b8] items-center justify-center hover:bg-slate-50 hover:text-[#1e293b] transition-all shrink-0">
            <Search size={15} />
          </button>

          {/* Notifications */}
          <div className="relative shrink-0 hidden">
            <button
              onClick={() => { setNotifOpen((v) => !v); setAccountOpen(false); }}
              className={`w-8.5 h-8.5 rounded-lg border flex items-center justify-center cursor-pointer transition-all ${notifOpen ? 'border-[#081C45]/20 bg-[#081C45]/5 text-[#081C45]' : 'border-[#e8edf3] bg-transparent text-[#94a3b8] hover:bg-slate-50 hover:text-[#1e293b]'}`}
            >
              <Bell size={15} />
            </button>
            {notifOpen && (
              <div className="absolute right-0 top-[42px] w-[280px] z-50 bg-white border border-[#e8edf3] rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] p-4">
                <div className="text-[13px] font-bold text-[#0f172a] mb-2 text-left font-sans">Notifications</div>
                <div className="text-[13px] font-normal text-[#94a3b8] text-left font-sans">All caught up!</div>
              </div>
            )}
          </div>

          {/* Account */}
          <div className="relative shrink-0">
            <button
              onClick={() => { setAccountOpen((v) => !v); setNotifOpen(false); }}
              className="flex items-center gap-2 border-none bg-transparent p-0 cursor-pointer transition-all"
            >
              <div className="w-6 h-6 rounded-full shrink-0 bg-[#FFC60A] border border-[#F4B400] flex items-center justify-center text-[10px] font-bold text-[#081C45]">
                {initial}
              </div>
              <div className="line-height-[1.2] text-left hidden sm:block">
                <div className="text-xs font-semibold text-[#111827] whitespace-nowrap">{user?.name}</div>
              </div>
              <ChevronDown size={12} className={`text-[#111827] transition-transform duration-200 hidden sm:block ${accountOpen ? 'rotate-180' : ''}`} />
            </button>

            {accountOpen && (
              <div className="absolute right-0 top-[46px] w-[220px] z-50 bg-white border border-[#e8edf3] rounded-[14px] shadow-[0_8px_32px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.06)] p-1.5">
                <div className="px-2.5 py-2 mb-1 border-b border-[#e8edf3] text-left">
                  <div className="text-[13px] font-semibold text-[#0f172a]">{user?.name}</div>
                  <div className="text-[11px] font-normal text-[#94a3b8] mt-0.5 truncate">{user?.email}</div>
                </div>
                {[
                  { icon: UserCircle, label: 'My profile', action: () => { navigate('/profile'); setAccountOpen(false); }, className: 'text-[#475569]' },
                  { icon: LogOut, label: 'Sign out', action: handleLogout, className: 'text-[#dc2626]' },
                ].map(({ icon: Icon, label, action, className }) => (
                  <button
                    key={label}
                    onClick={action}
                    className={`flex items-center gap-2.5 w-full py-2.25 px-2.5 rounded border-none bg-transparent cursor-pointer text-[13px] font-medium transition-colors hover:bg-[#f8fafc] text-left ${className}`}
                  >
                    <Icon size={14} /> {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto bg-[#F8FBFF] flex flex-col">
          <div className="flex-1">
            {isFreeUser && !freeRouteAllowed ? (
              <LockedFreeFeature onUpgrade={() => navigate('/subscription')} />
            ) : (
              <Outlet context={ctx} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function LockedFreeFeature({ onUpgrade }: { onUpgrade: () => void }) {
  return (
    <div className="flex min-h-full items-center justify-center bg-[#DCE7F5] px-6 py-12 text-[#081C45]">
      <div className="w-full max-w-[620px] rounded-[24px] border border-slate-300 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF6CC] text-[#081C45]">
          <Lock size={24} />
        </div>
        <h1 className="text-[28px] font-extrabold tracking-[-0.02em] text-[#081C45]">This feature is locked</h1>
        <p className="mx-auto mt-3 max-w-[440px] text-sm font-medium leading-6 text-slate-600">
          Free accounts can use the quick short-link and QR creator from the dashboard. Upgrade to unlock links, analytics, QR management, bio pages, campaigns, files, migrations, and settings.
        </p>
        <button
          type="button"
          onClick={onUpgrade}
          className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#081C45] px-6 text-sm font-bold text-white shadow-lg shadow-[#081C45]/20 hover:bg-[#0E2F73]"
        >
          <Zap size={15} className="fill-white" />
          Upgrade
        </button>
      </div>
    </div>
  );
}
