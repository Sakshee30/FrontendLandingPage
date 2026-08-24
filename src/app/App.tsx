import {
  CSSProperties,
  lazy,
  Suspense,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  LayoutDashboard,
  Link2,
  BarChart2,
  QrCode,
  User,
  Users,
  Settings as SettingsIcon,
  ChevronDown,
  Bell,
  Megaphone,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldCheck,
  Moon,
  Sun,
  Files as FilesIcon,
  Eye,
  HelpCircle,
  CreditCard,
} from 'lucide-react';
import { LinksSecondarySidebar } from './components/LinksSecondarySidebar';
import { CreateLinkDrawer } from './components/CreateLinkDrawer';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { ZiplinLogo } from './components/ZiplinLogo';
import {
  AuthSession,
  clearSession,
  getMe,
  getStoredSession,
  logout,
} from './services/auth';
import { ZiplinLink } from './services/links';

const Dashboard = lazy(() =>
  import('./components/Dashboard').then((module) => ({
    default: module.Dashboard,
  }))
);
const LinksList = lazy(() =>
  import('./components/LinksList').then((module) => ({
    default: module.LinksList,
  }))
);
const Analytics = lazy(() =>
  import('./components/Analytics').then((module) => ({
    default: module.Analytics,
  }))
);
const QRBuilder = lazy(() =>
  import('./components/QRBuilder').then((module) => ({
    default: module.QRBuilder,
  }))
);
const BioPages = lazy(() =>
  import('./components/BioPages').then((module) => ({
    default: module.BioPages,
  }))
);
const Campaigns = lazy(() =>
  import('./components/Campaigns').then((module) => ({
    default: module.Campaigns,
  }))
);
const Files = lazy(() =>
  import('./components/Files').then((module) => ({ default: module.Files }))
);
const LinkPreviews = lazy(() =>
  import('./components/LinkPreviews').then((module) => ({
    default: module.LinkPreviews,
  }))
);
const Settings = lazy(() =>
  import('./components/Settings').then((module) => ({
    default: module.Settings,
  }))
);
const HelpCenter = lazy(() =>
  import('./components/HelpCenter').then((module) => ({
    default: module.HelpCenter,
  }))
);
const Subscription = lazy(() =>
  import('./components/Subscription').then((module) => ({
    default: module.Subscription,
  }))
);
const TeamMembers = lazy(() =>
  import('./components/Team').then((module) => ({
    default: module.TeamMembers,
  }))
);

type Page =
  | 'dashboard'
  | 'links'
  | 'analytics'
  | 'qr'
  | 'bio'
  | 'campaigns'
  | 'files'
  | 'previews'
  | 'settings'
  | 'team'
  | 'subscription'
  | 'help';
type ThemeMode = 'light' | 'dark';

type NavItem = {
  id: Page;
  icon: typeof LayoutDashboard;
  label: string;
  adminOnly?: boolean;
};

const navItems: NavItem[] = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'links', icon: Link2, label: 'Links' },
  { id: 'team', icon: Users, label: 'Team', adminOnly: true },
  { id: 'analytics', icon: BarChart2, label: 'Analytics' },
  { id: 'qr', icon: QrCode, label: 'QR Codes' },
  { id: 'bio', icon: User, label: 'Bio Pages' },
  { id: 'campaigns', icon: Megaphone, label: 'Campaigns', adminOnly: true },
  { id: 'files', icon: FilesIcon, label: 'Files', adminOnly: true },
  { id: 'previews', icon: Eye, label: 'Link Previews', adminOnly: true },
  { id: 'settings', icon: SettingsIcon, label: 'Settings', adminOnly: true },
  { id: 'subscription', icon: CreditCard, label: 'Subscription' },
  { id: 'help', icon: HelpCircle, label: 'Help Center' },
];

const pageInfo: Record<Page, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Performance overview' },
  links: { title: 'URL Shortener', subtitle: 'Create & manage links' },
  analytics: { title: 'Analytics', subtitle: 'Clicks and audience' },
  qr: { title: 'QR Codes', subtitle: 'Create and track QR' },
  bio: { title: 'Bio Pages', subtitle: 'SmartPage builder' },
  campaigns: { title: 'Campaigns', subtitle: 'UTM tracking & attribution' },
  files: { title: 'Files', subtitle: 'Branded file sharing' },
  previews: { title: 'Link Previews', subtitle: 'Website hover previews' },
  team: { title: 'Team', subtitle: 'Manage members and access' },
  settings: { title: 'Settings', subtitle: 'Domains, pixels and API' },
  subscription: { title: 'Subscription', subtitle: 'Plan, billing and limits' },
  help: {
    title: 'Help Center',
    subtitle: 'Feature guide and production notes',
  },
};

export default function App() {
  const [session, setSession] = useState<AuthSession | null>(() =>
    getStoredSession()
  );
  const [authPage, setAuthPage] = useState<'login' | 'signup'>('login');
  const [authChecking, setAuthChecking] = useState(Boolean(getStoredSession()));
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerInitialUrl, setDrawerInitialUrl] = useState('');
  const [editingLink, setEditingLink] = useState<ZiplinLink | null>(null);
  const [linksRefreshKey, setLinksRefreshKey] = useState(0);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [helpTopicId, setHelpTopicId] = useState('dashboard');
  const [readNotifications, setReadNotifications] = useState<string[]>(() => {
    try {
      return JSON.parse(
        localStorage.getItem('ziplin-read-notifications') || '[]'
      );
    } catch {
      return [];
    }
  });
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('ziplin-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  });

  const isAdmin =
    session?.user.role === 'admin' || session?.user.role === 'owner';
  const notifications = useMemo(
    () => [
      {
        id: 'welcome',
        title: 'Workspace ready',
        message:
          'Your Ziplin dashboard, links, analytics, QR codes, and campaigns are available.',
        action: () => setActivePage('dashboard'),
      },
      {
        id: 'create-link',
        title: 'Create your next smart link',
        message:
          'Add a destination, slug, tracking pixels, UTM data, and redirect rules.',
        action: () => openCreateLink(),
      },
      {
        id: 'analytics',
        title: 'Live analytics enabled',
        message:
          'Open analytics to review clicks, devices, referrers, and click locations.',
        action: () => setActivePage('analytics'),
      },
      ...(isAdmin
        ? [
            {
              id: 'admin-settings',
              title: 'Admin controls available',
              message:
                'Manage domains, pixels, team access, API keys, and webhooks from Settings.',
              action: () => setActivePage('settings'),
            },
          ]
        : []),
    ],
    [isAdmin]
  );

  const unreadCount = notifications.filter(
    (item) => !readNotifications.includes(item.id)
  ).length;
  const availableNavItems = useMemo(
    () => navItems.filter((item) => !item.adminOnly || isAdmin),
    [isAdmin]
  );

  useEffect(() => {
    if (!session) return;
    getMe()
      .then((user) =>
        setSession((current) => (current ? { ...current, user } : current))
      )
      .catch(() => {
        clearSession();
        setSession(null);
      })
      .finally(() => setAuthChecking(false));
  }, []);

  useEffect(() => {
    if (!availableNavItems.some((item) => item.id === activePage)) {
      setActivePage('dashboard');
    }
  }, [activePage, availableNavItems]);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('ziplin-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(
      'ziplin-read-notifications',
      JSON.stringify(readNotifications)
    );
  }, [readNotifications]);

  useEffect(() => {
    function handleOpenHelp(event: Event) {
      const topicId =
        (event as CustomEvent<{ topicId?: string }>).detail?.topicId ||
        'dashboard';
      setHelpTopicId(topicId);
      setActivePage('help');
      setNotificationsOpen(false);
      setAccountOpen(false);
    }

    window.addEventListener('ziplin-open-help', handleOpenHelp);
    return () => window.removeEventListener('ziplin-open-help', handleOpenHelp);
  }, []);

  async function handleLogout() {
    await logout();
    setSession(null);
    setActivePage('dashboard');
    setDrawerOpen(false);
    setAccountOpen(false);
  }

  function openCreateLink(initialUrl = '') {
    setDrawerInitialUrl(initialUrl);
    setEditingLink(null);
    setDrawerOpen(true);
  }

  function openEditLink(link: ZiplinLink) {
    setDrawerInitialUrl('');
    setEditingLink(link);
    setDrawerOpen(true);
  }

  function handleLinkCreated() {
    setLinksRefreshKey((value) => value + 1);
    setActivePage('links');
  }

  function openLinkAnalytics(link: ZiplinLink) {
    localStorage.setItem('ziplin-analytics-link-id', link.id);
    setActivePage('analytics');
  }

  function openLinkQr(link: ZiplinLink) {
    localStorage.setItem(
      'ziplin-qr-prefill',
      JSON.stringify({
        name: `${link.title} QR`,
        destinationUrl: link.shortUrl,
      })
    );
    setActivePage('qr');
  }

  function markNotificationRead(id: string) {
    setReadNotifications((current) =>
      current.includes(id) ? current : [...current, id]
    );
  }

  function markAllNotificationsRead() {
    setReadNotifications(notifications.map((item) => item.id));
  }

  if (!session) {
    return authPage === 'login' ? (
      <LoginPage
        onLogin={setSession}
        onShowSignup={() => setAuthPage('signup')}
      />
    ) : (
      <SignupPage
        onRegistered={setSession}
        onShowLogin={() => setAuthPage('login')}
      />
    );
  }

  if (authChecking) {
    return (
      <div
        style={{
          height: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: '#F4F7FB',
          color: '#1C2433',
          fontFamily: 'Inter, Arial, sans-serif',
        }}
      >
        Checking your session...
      </div>
    );
  }

  const info = pageInfo[activePage];
  const initial = session.user.name?.charAt(0).toUpperCase() || 'U';
  const isDark = theme === 'dark';

  return (
    <div
      className="ziplin-app-shell"
      style={{
        display: 'flex',
        height: '100vh',
        width: '100vw',
        background: '#F4F7FB',
        fontFamily: 'Inter, Arial, sans-serif',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          width: 72,
          height: '100%',
          flexShrink: 0,
          background: '#2F80ED',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 12,
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: '100%',
            minHeight: 44,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 18,
          }}
        >
          <ZiplinLogo compact size={44} />
        </div>

        <nav
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            width: '100%',
            alignItems: 'center',
            flex: 1,
            overflowY: 'auto',
            scrollbarWidth: 'none',
          }}
        >
          {availableNavItems.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              title={label}
              onClick={() => setActivePage(id)}
              style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                  activePage === id ? 'rgba(255,255,255,0.22)' : 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#fff',
                transition: 'background 0.15s',
                flexShrink: 0,
              }}
            >
              <Icon size={20} />
            </button>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          title="Logout"
          style={{
            width: 44,
            height: 44,
            border: 'none',
            background: 'none',
            color: '#fff',
            cursor: 'pointer',
            marginBottom: 8,
          }}
        >
          <LogOut size={19} />
        </button>
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: '#1769D1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 700,
            fontSize: 14,
            marginBottom: 16,
          }}
        >
          {initial}
        </div>
      </div>

      <div
        style={{
          width: sidebarCollapsed ? 0 : 260,
          flexShrink: 0,
          background: '#fff',
          borderRight: sidebarCollapsed ? 'none' : '1px solid #D9E2EC',
          display: 'flex',
          flexDirection: 'column',
          padding: sidebarCollapsed ? 0 : '20px 20px',
          overflowY: 'auto',
          overflowX: 'hidden',
          transition: 'width 0.3s ease, padding 0.3s ease',
          position: 'relative',
        }}
      >
        {!sidebarCollapsed && (
          <>
            <div style={{ marginBottom: 18 }}>
              <h2
                style={{
                  color: '#1C2433',
                  fontSize: 20,
                  fontWeight: 700,
                  margin: 0,
                }}
              >
                {info.title}
              </h2>
              <p style={{ color: '#667085', fontSize: 13, margin: '4px 0 0' }}>
                {info.subtitle}
              </p>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: isAdmin ? '#EEF4FF' : '#F8FAFC',
                color: isAdmin ? '#2F80ED' : '#667085',
                border: '1px solid #D9E2EC',
                borderRadius: 10,
                padding: '9px 10px',
                marginBottom: 18,
                fontSize: 13,
                fontWeight: 800,
              }}
            >
              <ShieldCheck size={15} />{' '}
              {isAdmin ? 'Admin access' : 'User access'}
            </div>

            {activePage === 'links' && (
              <LinksSecondarySidebar onCreateLink={() => openCreateLink()} />
            )}

            {activePage !== 'links' && (
              <div>
                {availableNavItems.map(({ id, icon: Icon, label }) => (
                  <button
                    key={id}
                    onClick={() => setActivePage(id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: 8,
                      background: activePage === id ? '#EEF4FF' : 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: activePage === id ? '#2F80ED' : '#667085',
                      fontWeight: activePage === id ? 700 : 400,
                      fontSize: 14,
                      marginBottom: 2,
                      textAlign: 'left',
                      fontFamily: 'Inter, sans-serif',
                      transition: 'background 0.15s',
                    }}
                  >
                    <Icon size={16} />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <button
        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
        style={{
          position: 'absolute',
          left: sidebarCollapsed ? 72 : 332,
          top: 20,
          width: 24,
          height: 24,
          borderRadius: '50%',
          background: '#fff',
          border: '1px solid #D9E2EC',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          zIndex: 20,
          transition: 'left 0.3s ease',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
        title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {sidebarCollapsed ? (
          <ChevronRight size={14} color="#667085" />
        ) : (
          <ChevronLeft size={14} color="#667085" />
        )}
      </button>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: 64,
            flexShrink: 0,
            background: '#fff',
            borderBottom: '1px solid #D9E2EC',
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
            gap: 12,
          }}
        >
          <span
            style={{
              color: '#516581',
              fontSize: 18,
              fontWeight: 600,
              fontFamily: 'Inter, sans-serif',
            }}
          >
            {info.title}
          </span>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => {
              setHelpTopicId(activePage);
              setActivePage('help');
              setNotificationsOpen(false);
              setAccountOpen(false);
            }}
            title="Open help for this page"
            aria-label="Open help for this page"
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #D9E2EC',
              background: activePage === 'help' ? '#EEF4FF' : 'transparent',
              color: activePage === 'help' ? '#2F80ED' : '#667085',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <HelpCircle size={18} />
          </button>
          <button
            onClick={() => setTheme(isDark ? 'light' : 'dark')}
            title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            style={{
              width: 36,
              height: 36,
              borderRadius: '50%',
              border: '1px solid #D9E2EC',
              background: 'transparent',
              color: '#667085',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotificationsOpen((value) => !value)}
              title="Notifications"
              aria-label={`Notifications${
                unreadCount ? `, ${unreadCount} unread` : ''
              }`}
              aria-expanded={notificationsOpen}
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                border: '1px solid #D9E2EC',
                background: notificationsOpen ? '#EEF4FF' : 'transparent',
                cursor: 'pointer',
                color: notificationsOpen ? '#2F80ED' : '#667085',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span
                  style={{
                    position: 'absolute',
                    right: -3,
                    top: -4,
                    minWidth: 17,
                    height: 17,
                    borderRadius: 999,
                    background: '#2F80ED',
                    color: '#fff',
                    fontSize: 10,
                    fontWeight: 900,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '2px solid #fff',
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>
            {notificationsOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 46,
                  width: 360,
                  background: '#fff',
                  border: '1px solid #D9E2EC',
                  borderRadius: 16,
                  boxShadow: '0 22px 60px rgba(28,36,51,0.18)',
                  zIndex: 40,
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px 16px 12px',
                    borderBottom: '1px solid #D9E2EC',
                  }}
                >
                  <div>
                    <div
                      style={{
                        color: '#1C2433',
                        fontWeight: 900,
                        fontSize: 16,
                      }}
                    >
                      Notifications
                    </div>
                    <div style={{ color: '#667085', fontSize: 12 }}>
                      {unreadCount ? `${unreadCount} unread` : 'All caught up'}
                    </div>
                  </div>
                  <button
                    onClick={markAllNotificationsRead}
                    disabled={unreadCount === 0}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      color: unreadCount ? '#2F80ED' : '#98A2B3',
                      fontWeight: 800,
                      fontSize: 12,
                      cursor: unreadCount ? 'pointer' : 'default',
                    }}
                  >
                    Mark all read
                  </button>
                </div>

                <div style={{ maxHeight: 330, overflowY: 'auto', padding: 8 }}>
                  {notifications.map((item) => {
                    const read = readNotifications.includes(item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          markNotificationRead(item.id);
                          item.action();
                          setNotificationsOpen(false);
                        }}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: read ? 'transparent' : '#F4F8FF',
                          borderRadius: 12,
                          padding: '12px 12px',
                          textAlign: 'left',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: 10,
                          marginBottom: 6,
                        }}
                      >
                        <span
                          style={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            background: read ? '#CBD5E1' : '#2F80ED',
                            marginTop: 7,
                            flexShrink: 0,
                          }}
                        />
                        <span>
                          <span
                            style={{
                              display: 'block',
                              color: '#1C2433',
                              fontWeight: 850,
                              fontSize: 13,
                            }}
                          >
                            {item.title}
                          </span>
                          <span
                            style={{
                              display: 'block',
                              color: '#667085',
                              fontSize: 12,
                              lineHeight: 1.45,
                              marginTop: 3,
                            }}
                          >
                            {item.message}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setAccountOpen((value) => !value);
                setNotificationsOpen(false);
              }}
              title="Account menu"
              aria-label="Open account menu"
              aria-expanded={accountOpen}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '6px 12px',
                borderRadius: 8,
                border: accountOpen ? '1px solid #2F80ED' : '1px solid #D9E2EC',
                background: accountOpen
                  ? isDark
                    ? '#10213D'
                    : '#EEF4FF'
                  : 'transparent',
                cursor: 'pointer',
                boxShadow: accountOpen
                  ? '0 0 0 3px rgba(47,128,237,0.14)'
                  : 'none',
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: '#2F80ED',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: 12,
                }}
              >
                {initial}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  lineHeight: 1.1,
                  textAlign: 'left',
                }}
              >
                <span
                  style={{
                    fontSize: 14,
                    color: isDark ? '#F8FAFC' : '#1C2433',
                    fontWeight: 700,
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  {session.user.name}
                </span>
                <span
                  style={{
                    fontSize: 11,
                    color: isAdmin ? '#2F80ED' : '#667085',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                  }}
                >
                  {session.user.role}
                </span>
              </div>
              <ChevronDown
                size={14}
                color={isDark ? '#CBD5E1' : '#667085'}
                style={{
                  transform: accountOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.15s ease',
                }}
              />
            </button>

            {accountOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 48,
                  width: 260,
                  background: isDark ? '#111D2E' : '#fff',
                  border: isDark ? '1px solid #263952' : '1px solid #D9E2EC',
                  borderRadius: 14,
                  boxShadow: isDark
                    ? '0 22px 60px rgba(0,0,0,0.38)'
                    : '0 22px 60px rgba(28,36,51,0.18)',
                  zIndex: 45,
                  overflow: 'hidden',
                  padding: 8,
                }}
              >
                <div
                  style={{
                    padding: '10px 10px 12px',
                    borderBottom: isDark
                      ? '1px solid #263952'
                      : '1px solid #E5EAF1',
                    marginBottom: 6,
                  }}
                >
                  <div
                    style={{
                      color: isDark ? '#F8FAFC' : '#1C2433',
                      fontWeight: 900,
                      fontSize: 14,
                    }}
                  >
                    {session.user.name}
                  </div>
                  <div
                    style={{
                      color: isDark ? '#94A3B8' : '#667085',
                      fontSize: 12,
                      marginTop: 3,
                    }}
                  >
                    {session.user.email}
                  </div>
                </div>

                {isAdmin && (
                  <button
                    onClick={() => {
                      setActivePage('settings');
                      setAccountOpen(false);
                    }}
                    style={accountMenuItemStyle(isDark)}
                  >
                    <SettingsIcon size={16} />
                    Workspace settings
                  </button>
                )}

                <button
                  onClick={() => {
                    setActivePage('analytics');
                    setAccountOpen(false);
                  }}
                  style={accountMenuItemStyle(isDark)}
                >
                  <BarChart2 size={16} />
                  View analytics
                </button>

                <button
                  onClick={handleLogout}
                  style={{ ...accountMenuItemStyle(isDark), color: '#EF4444' }}
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: 'auto' }}>
          <Suspense
            fallback={
              <div style={{ padding: 32, color: '#667085', fontWeight: 800 }}>
                Loading {info.title}...
              </div>
            }
          >
            {activePage === 'dashboard' && (
              <Dashboard onCreateLink={() => openCreateLink()} />
            )}
            {activePage === 'links' && (
              <LinksList
                onCreateLink={openCreateLink}
                onEditLink={openEditLink}
                onOpenAnalytics={openLinkAnalytics}
                onOpenQr={openLinkQr}
                canManage={isAdmin}
                refreshKey={linksRefreshKey}
              />
            )}
            {activePage === 'analytics' && <Analytics />}
            {activePage === 'qr' && <QRBuilder />}
            {activePage === 'bio' && <BioPages />}
            {activePage === 'campaigns' && isAdmin && <Campaigns />}
            {activePage === 'files' && isAdmin && <Files />}
            {activePage === 'previews' && isAdmin && <LinkPreviews />}
            {activePage === 'team' && <TeamMembers />}
            {activePage === 'settings' && isAdmin && <Settings />}
            {activePage === 'subscription' && <Subscription />}
            {activePage === 'help' && (
              <HelpCenter initialTopicId={helpTopicId} />
            )}
          </Suspense>
        </div>
      </div>

      <CreateLinkDrawer
        open={drawerOpen}
        initialUrl={drawerInitialUrl}
        editingLink={editingLink}
        onClose={() => {
          setDrawerOpen(false);
          setDrawerInitialUrl('');
          setEditingLink(null);
        }}
        onCreated={handleLinkCreated}
      />
    </div>
  );
}

function accountMenuItemStyle(isDark: boolean): CSSProperties {
  return {
    width: '100%',
    border: 'none',
    background: 'transparent',
    color: isDark ? '#E2E8F0' : '#1C2433',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    padding: '10px 10px',
    fontSize: 13,
    fontWeight: 800,
    textAlign: 'left',
    fontFamily: 'Inter, sans-serif',
  };
}
