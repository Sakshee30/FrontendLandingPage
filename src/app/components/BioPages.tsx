import { useEffect, useMemo, useState } from 'react';
import {
  ArrowLeft,
  BarChart3,
  Check,
  ChevronDown,
  Copy,
  Eye,
  FilePenLine,
  Filter,
  CalendarDays,
  Globe2,
  Instagram,
  Link2,
  Loader2,
  Mail,
  MoreHorizontal,
  MousePointerClick,
  Music2,
  Pencil,
  Plus,
  Search,
  Share2,
  ShoppingBag,
  Trash2,
  Upload,
  UserRound,
  UsersRound,
  Youtube,
} from 'lucide-react';
import {
  BioPage,
  BioWidget,
  createBioPage,
  deleteBioPage,
  listBioPages,
  updateBioPage,
} from '../services/bioPages';

type View = 'management' | 'templates' | 'editor' | 'detail';
type TemplateCategory = 'All Templates' | 'Products and Services' | 'Business Card';
type ButtonIcon = 'instagram' | 'spotify' | 'youtube' | 'x' | 'website' | 'email' | 'shop' | 'booking';

type BioForm = {
  title: string;
  slug: string;
  bio: string;
  avatarUrl: string;
  bgColor: string;
  cardColor: string;
  textColor: string;
  accentColor: string;
};

type BioTemplate = {
  id: string;
  name: string;
  tagline: string;
  category: Exclude<TemplateCategory, 'All Templates'>;
  bgColor: string;
  cardColor: string;
  textColor: string;
  accentColor: string;
  pattern?: string;
};

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  'All Templates',
  'Products and Services',
  'Business Card',
];

const TEMPLATES: BioTemplate[] = [
  { id: 'clean', name: 'Jesse Jordan', tagline: 'Rockstar, Activist, Writer', category: 'Business Card', bgColor: '#f7f8fa', cardColor: '#ffffff', textColor: '#0b1f44', accentColor: '#0b3675' },
  { id: 'sunset', name: 'Mindy Frauke', tagline: 'Community artist, with a taste for everything local', category: 'Business Card', bgColor: '#c5eef1', cardColor: '#ffffff', textColor: '#172554', accentColor: '#ef6b4d', pattern: 'linear-gradient(180deg,#bcebed 0%,#e0c6e5 55%,#f06443 100%)' },
  { id: 'studio', name: 'Lowell Maxwell', tagline: 'Soul beats and mech from Hackney', category: 'Products and Services', bgColor: '#512c2d', cardColor: '#fff2d5', textColor: '#fff6e5', accentColor: '#a95a4d', pattern: 'linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px)' },
  { id: 'editorial', name: 'Sergey Amir', tagline: 'Vintage photography for modern brands', category: 'Business Card', bgColor: '#fff7e9', cardColor: '#fffaf0', textColor: '#ce2b24', accentColor: '#ef4444' },
  { id: 'forest', name: 'Roberto Leopoldo', tagline: 'Blending horticulture with the art of design', category: 'Products and Services', bgColor: '#043c32', cardColor: '#e9fbdc', textColor: '#f2ffe9', accentColor: '#8ecf7b' },
  { id: 'mono', name: 'Salka Ruslan', tagline: 'Reading my way through Brooklyn', category: 'Business Card', bgColor: '#eef1f5', cardColor: '#ffffff', textColor: '#141b2d', accentColor: '#475569' },
  { id: 'earth', name: 'Monica Vera', tagline: 'DAILY RITUALS', category: 'Products and Services', bgColor: '#665d55', cardColor: '#8c7a6d', textColor: '#ffffff', accentColor: '#c1a995', pattern: 'repeating-linear-gradient(80deg,rgba(255,255,255,.04) 0 3px,transparent 3px 8px)' },
  { id: 'berry', name: 'Newlove Store', tagline: 'Vintage, always.', category: 'Products and Services', bgColor: '#701b4c', cardColor: '#782558', textColor: '#ffffff', accentColor: '#ee9bc9', pattern: 'linear-gradient(145deg,#570b35,#85306c)' },
  { id: 'purple', name: 'Lexie Candis', tagline: 'Pastel artist from Melbourne', category: 'Products and Services', bgColor: '#9149bd', cardColor: '#ead2ff', textColor: '#ffffff', accentColor: '#5d2388', pattern: 'radial-gradient(circle at 15% 20%,#ad68d1 0 10%,transparent 11%),radial-gradient(circle at 80% 55%,#6e3295 0 14%,transparent 15%)' },
  { id: 'mist', name: 'Indi Montana', tagline: 'Skincare blogger. Owner of too many plants.', category: 'Business Card', bgColor: '#cfe1e6', cardColor: '#e7f1f3', textColor: '#334155', accentColor: '#769ba5' },
];

const DEFAULT_WIDGETS: BioWidget[] = [
  { type: 'link', label: 'My Music', url: 'https://example.com/music', icon: 'spotify' },
  { type: 'link', label: 'Latest Interview', url: 'https://example.com/interview', icon: 'youtube' },
  { type: 'link', label: 'Merch Store', url: 'https://example.com/store', icon: 'shop' },
  { type: 'link', label: 'Book Me', url: 'https://example.com/contact', icon: 'booking' },
];

const BUTTON_ICONS: Array<{ id: ButtonIcon; label: string }> = [
  { id: 'instagram', label: 'Instagram' },
  { id: 'spotify', label: 'Spotify' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'x', label: 'X' },
  { id: 'website', label: 'Website' },
  { id: 'email', label: 'Email' },
  { id: 'shop', label: 'Shop' },
  { id: 'booking', label: 'Booking' },
];

const DEFAULT_FORM: BioForm = {
  title: 'Social Me',
  slug: 'social-me',
  bio: 'Content Creator | Digital Nomad',
  avatarUrl: '',
  bgColor: '#f1f5f9',
  cardColor: '#ffffff',
  textColor: '#0b1f44',
  accentColor: '#0b3675',
};

const DEMO_PAGES: BioPage[] = [
  {
    id: 'demo-instagram', workspaceId: 'local-preview', slug: 'social-me', title: 'Instagram Bio',
    bio: 'Content Creator | Digital Nomad', theme: 'clean', avatarUrl: null, customDomain: null,
    widgets: DEFAULT_WIDGETS.map((widget) => ({ ...widget })), published: true,
    settings: { templateId: 'clean', bgColor: '#f1f5f9', cardColor: '#ffffff', textColor: '#0b1f44', accentColor: '#0b3675', views: 42903, uniqueVisitors: 31204, clicks: 12182 },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-portfolio', workspaceId: 'local-preview', slug: 'john-doe', title: 'Personal Portfolio',
    bio: 'Designer, maker, and creative thinker', theme: 'forest', avatarUrl: null, customDomain: null,
    widgets: DEFAULT_WIDGETS.slice(0, 3).map((widget) => ({ ...widget })), published: true,
    settings: { templateId: 'forest', bgColor: '#043c32', cardColor: '#e9fbdc', textColor: '#f2ffe9', accentColor: '#8ecf7b', views: 12184, uniqueVisitors: 9410, clicks: 4280 },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
  {
    id: 'demo-campaign', workspaceId: 'local-preview', slug: 'summer-2026', title: 'Summer Campaign',
    bio: 'Our latest collection is almost here', theme: 'sunset', avatarUrl: null, customDomain: null,
    widgets: DEFAULT_WIDGETS.slice(0, 2).map((widget) => ({ ...widget })), published: false,
    settings: { templateId: 'sunset', bgColor: '#c5eef1', cardColor: '#ffffff', textColor: '#172554', accentColor: '#ef6b4d', views: 0, uniqueVisitors: 0, clicks: 0 },
    createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
  },
];

const cx = (...classes: Array<string | false | null | undefined>) => classes.filter(Boolean).join(' ');

function makeSlug(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 36) || 'bio-page';
}

function settingsOf(page: BioPage) {
  return page.settings ?? {};
}

function pageToForm(page: BioPage): BioForm {
  const settings = settingsOf(page);
  return {
    title: page.title,
    slug: page.slug,
    bio: page.bio ?? '',
    avatarUrl: page.avatarUrl ?? '',
    bgColor: String(settings.bgColor ?? '#f1f5f9'),
    cardColor: String(settings.cardColor ?? '#ffffff'),
    textColor: String(settings.textColor ?? '#0b1f44'),
    accentColor: String(settings.accentColor ?? '#0b3675'),
  };
}

function initials(value: string) {
  return value.split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join('') || 'Z';
}

function numberSetting(page: BioPage, key: string, fallback = 0) {
  const value = Number(settingsOf(page)[key]);
  return Number.isFinite(value) ? value : fallback;
}

function formatNumber(value: number) {
  return new Intl.NumberFormat('en-US').format(value);
}

export function BioPages({ previewMode = false }: { previewMode?: boolean }) {
  const [view, setView] = useState<View>('management');
  const [pages, setPages] = useState<BioPage[]>([]);
  const [selectedPage, setSelectedPage] = useState<BioPage | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<BioTemplate>(TEMPLATES[0]);
  const [category, setCategory] = useState<TemplateCategory>('All Templates');
  const [form, setForm] = useState<BioForm>(DEFAULT_FORM);
  const [widgets, setWidgets] = useState<BioWidget[]>(DEFAULT_WIDGETS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const [search, setSearch] = useState('');

  async function loadPages() {
    setLoading(true);
    if (previewMode) {
      setPages(DEMO_PAGES.map((page) => ({ ...page, widgets: page.widgets.map((widget) => ({ ...widget })) })));
      setLoading(false);
      return;
    }
    try {
      setPages(await listBioPages());
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not load bio pages.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void loadPages(); }, [previewMode]);

  const visiblePages = useMemo(() => {
    const query = search.trim().toLowerCase();
    return pages.filter((page) => !query || page.title.toLowerCase().includes(query) || page.slug.toLowerCase().includes(query));
  }, [pages, search]);

  const visibleTemplates = useMemo(
    () => TEMPLATES.filter((template) => category === 'All Templates' || template.category === category),
    [category],
  );

  function startNewPage() {
    setSelectedPage(null);
    setStatus('');
    setView('templates');
  }

  function chooseTemplate(template: BioTemplate) {
    setSelectedTemplate(template);
    setSelectedPage(null);
    setForm({
      ...DEFAULT_FORM,
      title: template.name,
      slug: makeSlug(template.name),
      bio: template.tagline,
      bgColor: template.bgColor,
      cardColor: template.cardColor,
      textColor: template.textColor,
      accentColor: template.accentColor,
    });
    setWidgets(DEFAULT_WIDGETS.map((widget) => ({ ...widget })));
    setView('editor');
  }

  function openPage(page: BioPage) {
    setSelectedPage(page);
    setForm(pageToForm(page));
    setWidgets(page.widgets?.length ? page.widgets.map((widget) => ({ ...widget })) : DEFAULT_WIDGETS);
    setStatus('');
    setView('detail');
  }

  function editPage(page: BioPage) {
    setSelectedPage(page);
    setForm(pageToForm(page));
    setWidgets(page.widgets?.length ? page.widgets.map((widget) => ({ ...widget })) : DEFAULT_WIDGETS);
    setSelectedTemplate(TEMPLATES.find((template) => template.id === settingsOf(page).templateId) ?? TEMPLATES[0]);
    setStatus('');
    setView('editor');
  }

  async function savePage(published: boolean) {
    if (!form.title.trim()) { setStatus('Add a page title before saving.'); return; }
    setSaving(true);
    setStatus('');
    const payload = {
      title: form.title.trim(),
      slug: makeSlug(form.slug || form.title),
      bio: form.bio.trim(),
      theme: selectedTemplate.id,
      avatarUrl: form.avatarUrl.trim() || null,
      widgets,
      published,
      settings: {
        ...(selectedPage?.settings ?? {}),
        templateId: selectedTemplate.id,
        bgColor: form.bgColor,
        cardColor: form.cardColor,
        textColor: form.textColor,
        accentColor: form.accentColor,
      },
    };
    try {
      let saved: BioPage;
      if (previewMode) {
        const now = new Date().toISOString();
        saved = {
          id: selectedPage?.id ?? `preview-${Date.now()}`,
          workspaceId: selectedPage?.workspaceId ?? 'local-preview',
          customDomain: selectedPage?.customDomain ?? null,
          createdAt: selectedPage?.createdAt ?? now,
          updatedAt: now,
          ...payload,
        };
      } else {
        saved = selectedPage
          ? await updateBioPage(selectedPage.id, payload)
          : await createBioPage(payload);
      }
      setSelectedPage(saved);
      setPages((current) => selectedPage ? current.map((page) => page.id === saved.id ? saved : page) : [saved, ...current]);
      setStatus(published ? 'Bio page published.' : 'Draft saved.');
      setView('detail');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not save your bio page.');
    } finally {
      setSaving(false);
    }
  }

  async function removePage(page: BioPage) {
    if (!window.confirm(`Delete “${page.title}”? This cannot be undone.`)) return;
    try {
      if (!previewMode) await deleteBioPage(page.id);
      setPages((current) => current.filter((item) => item.id !== page.id));
      setSelectedPage(null);
      setStatus('Bio page deleted.');
      setView('management');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Could not delete the bio page.');
    }
  }

  async function copyPublicUrl(page: BioPage) {
    const url = `${window.location.origin}/b/${page.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setStatus('Public link copied.');
    } catch {
      setStatus(url);
    }
  }

  if (view === 'templates') {
    return <TemplateGallery category={category} setCategory={setCategory} templates={visibleTemplates} onBack={() => setView('management')} onChoose={chooseTemplate} />;
  }

  if (view === 'editor') {
    return (
      <BioEditor
        form={form}
        setForm={setForm}
        widgets={widgets}
        setWidgets={setWidgets}
        template={selectedTemplate}
        saving={saving}
        status={status}
        isEditing={Boolean(selectedPage)}
        onBack={() => selectedPage ? setView('detail') : setView('templates')}
        onSave={savePage}
      />
    );
  }

  if (view === 'detail' && selectedPage) {
    return (
      <PageDetail
        page={selectedPage}
        form={form}
        widgets={widgets}
        status={status}
        onBack={() => setView('management')}
        onEdit={() => editPage(selectedPage)}
        onCopy={() => void copyPublicUrl(selectedPage)}
        onDelete={() => void removePage(selectedPage)}
      />
    );
  }

  return (
    <Management
      pages={visiblePages}
      allPages={pages}
      loading={loading}
      search={search}
      setSearch={setSearch}
      status={status}
      onCreate={startNewPage}
      onOpen={openPage}
      onCopy={copyPublicUrl}
    />
  );
}

function Management({ pages, allPages, loading, search, setSearch, status, onCreate, onOpen, onCopy }: {
  pages: BioPage[]; allPages: BioPage[]; loading: boolean; search: string; setSearch: (value: string) => void; status: string;
  onCreate: () => void; onOpen: (page: BioPage) => void; onCopy: (page: BioPage) => void;
}) {
  const totalViews = allPages.reduce((sum, page) => sum + numberSetting(page, 'views'), 0);
  const totalClicks = allPages.reduce((sum, page) => sum + numberSetting(page, 'clicks'), 0);
  const published = allPages.filter((page) => page.published).length;
  const ctr = totalViews ? (totalClicks / totalViews) * 100 : 0;
  return (
    <main className="min-h-full bg-[#eaf0f9] px-4 py-7 text-[#0b1f44] sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="m-0 text-2xl font-extrabold tracking-[-0.02em] text-slate-950">Bio Page Management</h1>
            <p className="mt-1 text-sm text-slate-500">Manage your link-in-bio landing pages and track performance.</p>
          </div>
          <button onClick={onCreate} className="inline-flex h-12 items-center justify-center gap-2 rounded-lg border-0 bg-[#073574] px-5 text-sm font-bold text-white shadow-sm transition hover:bg-[#052b60]">
            <Plus size={21} /> Create new Bio Page
          </button>
        </div>

        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={<Eye />} label="Total bio page views" value={formatNumber(totalViews)} badge="+10%" />
          <StatCard icon={<FilePenLine />} label="Active pages" value={`${published} / 10 slots`} badge={published ? 'Active' : undefined} neutral />
          <StatCard icon={<MousePointerClick />} label="Avg. click rate" value={`${ctr.toFixed(1)}%`} badge="+04%" />
          <StatCard icon={<FilePenLine />} label="Draft pages" value={String(allPages.length - published)} badge="Inactive" neutral />
        </div>

        <section className="mb-7 flex flex-col items-stretch gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:flex-row lg:items-center">
          <div className="flex min-w-fit items-center gap-3">
            <Filter size={21} className="text-slate-700" />
            <div><h2 className="m-0 text-lg font-bold">Filter Bio Pages</h2><p className="m-0 text-xs text-slate-500">Find a page by name or URL</p></div>
          </div>
          <label className="relative ml-auto block w-full lg:max-w-xl">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search bio pages" className="h-11 w-full rounded-lg border-0 bg-slate-100 pl-10 pr-4 text-sm outline-none ring-[#0b3675] focus:ring-2" />
          </label>
          <button className="flex h-11 items-center justify-center gap-1 rounded-lg px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50">Filter <ChevronDown size={15} /></button>
        </section>

        {status && <StatusMessage message={status} />}

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-6 py-5"><h2 className="m-0 text-xl font-bold">Your Bio Pages</h2></div>
          {loading ? (
            <div className="flex min-h-56 items-center justify-center gap-2 text-sm text-slate-500"><Loader2 className="animate-spin" size={18} /> Loading bio pages…</div>
          ) : pages.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center px-6 text-center">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-blue-50 text-[#0b3675]"><UserRound size={26} /></div>
              <h3 className="m-0 text-lg font-bold text-slate-900">{search ? 'No matching bio pages' : 'Create your first bio page'}</h3>
              <p className="mb-5 mt-1 max-w-md text-sm text-slate-500">{search ? 'Try a different page name or URL.' : 'Choose a template, add your links, customize the design, and publish it in a few minutes.'}</p>
              {!search && <button onClick={onCreate} className="rounded-lg bg-[#073574] px-4 py-2.5 text-sm font-bold text-white">Choose a template</button>}
            </div>
          ) : pages.map((page) => (
            <div key={page.id} className="group flex items-center border-b border-slate-200 bg-white px-3 last:border-b-0 hover:bg-slate-50">
              <button onClick={() => onOpen(page)} className="flex min-w-0 flex-1 items-center gap-4 border-0 bg-transparent px-2 py-5 text-left">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0b3675]"><Link2 size={22} /></span>
                <span className="min-w-0 flex-1"><span className="block truncate text-sm font-bold text-[#0b1f44]">{page.title}</span><span className="mt-1 block truncate text-xs text-blue-500">ziplin.io/{page.slug}</span></span>
                <span className="hidden text-right sm:block"><span className="block text-xs text-slate-500">Views</span><span className="block font-bold">{formatNumber(numberSetting(page, 'views'))}</span></span>
                <StatusPill published={page.published} />
              </button>
              <button onClick={() => void onCopy(page)} aria-label={`Copy ${page.title} public URL`} className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border-0 bg-transparent text-slate-400 hover:bg-blue-50 hover:text-blue-600"><Copy size={15} /></button>
              <MoreHorizontal size={18} className="mx-2 hidden text-slate-400 sm:block" />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}

function TemplateGallery({ category, setCategory, templates, onBack, onChoose }: {
  category: TemplateCategory; setCategory: (category: TemplateCategory) => void; templates: BioTemplate[]; onBack: () => void; onChoose: (template: BioTemplate) => void;
}) {
  return (
    <main className="min-h-full bg-[#eaf0f9] px-4 py-6 text-[#0b1f44] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-[1320px]">
        <button onClick={onBack} className="mb-8 flex items-center gap-2 border-0 bg-transparent p-0 text-sm font-bold text-slate-500 hover:text-[#0b3675]"><ArrowLeft size={17} /> Back</button>
        <div className="mb-8"><h1 className="m-0 text-2xl font-extrabold text-slate-950">Select a Template</h1><p className="mt-1 text-sm text-slate-500">Start with a design you love. You can customize every detail next.</p></div>
        <div className="mb-8 flex gap-8 overflow-x-auto border-b border-slate-300">
          {TEMPLATE_CATEGORIES.map((item) => <button key={item} onClick={() => setCategory(item)} className={cx('relative whitespace-nowrap border-0 bg-transparent px-0 pb-4 text-sm font-bold', category === item ? 'text-[#0b3675] after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#0b3675]' : 'text-slate-600')}>{item}</button>)}
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {templates.map((template) => <TemplateCard key={template.id} template={template} onChoose={() => onChoose(template)} />)}
        </div>
      </div>
    </main>
  );
}

function TemplateCard({ template, onChoose }: { template: BioTemplate; onChoose: () => void }) {
  return (
    <button onClick={onChoose} className="group relative aspect-[9/16] w-full overflow-hidden rounded-2xl border-2 border-transparent p-0 text-left shadow-sm transition hover:-translate-y-1 hover:border-[#0b3675] hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-200" style={{ background: template.pattern ?? template.bgColor, backgroundColor: template.bgColor, backgroundSize: '24px 24px' }}>
      <div className="flex h-full flex-col items-center px-[7%] pt-[16%] text-center" style={{ color: template.textColor }}>
        <div className="grid h-[14%] max-h-16 min-h-10 aspect-square place-items-center rounded-full border-2 border-white/50 bg-white/25 text-sm font-black shadow-sm">{initials(template.name)}</div>
        <div className="mt-3 text-[clamp(10px,1vw,15px)] font-extrabold leading-tight">{template.name}</div>
        <div className="mt-1 line-clamp-2 text-[clamp(6px,.62vw,9px)] opacity-80">{template.tagline}</div>
        <div className="my-3 flex gap-2"><Music2 size={11} /><Youtube size={11} /><Instagram size={11} /></div>
        <div className="flex w-full flex-col gap-2">
          {[1, 2, 3].map((item) => <div key={item} className="h-7 w-full rounded-lg border border-current/20 shadow-sm sm:h-8" style={{ backgroundColor: template.cardColor }} />)}
        </div>
      </div>
      <div className="absolute inset-x-3 bottom-3 translate-y-14 rounded-lg bg-white py-2 text-center text-xs font-extrabold text-[#0b3675] shadow-lg transition group-hover:translate-y-0">Use this template</div>
    </button>
  );
}

function BioEditor({ form, setForm, widgets, setWidgets, template, saving, status, isEditing, onBack, onSave }: {
  form: BioForm; setForm: React.Dispatch<React.SetStateAction<BioForm>>; widgets: BioWidget[]; setWidgets: React.Dispatch<React.SetStateAction<BioWidget[]>>; template: BioTemplate;
  saving: boolean; status: string; isEditing: boolean; onBack: () => void; onSave: (published: boolean) => void;
}) {
  const [iconTarget, setIconTarget] = useState(0);
  const [iconUploadError, setIconUploadError] = useState('');
  const linkWidgets = widgets.map((widget, index) => ({ widget, index })).filter(({ widget }) => widget.type === 'link');
  const resolvedIconTarget = linkWidgets.some(({ index }) => index === iconTarget) ? iconTarget : (linkWidgets[0]?.index ?? 0);

  function updateTargetIcon(patch: Partial<BioWidget>) {
    setWidgets((current) => current.map((widget, index) => index === resolvedIconTarget ? { ...widget, ...patch } : widget));
  }

  function uploadButtonIcon(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setIconUploadError('Choose an image file.');
      return;
    }
    if (file.size > 1024 * 1024) {
      setIconUploadError('Custom icon must be smaller than 1 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateTargetIcon({ icon: undefined, customIconUrl: reader.result });
        setIconUploadError('');
      }
    };
    reader.onerror = () => setIconUploadError('Could not read that icon.');
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  return (
    <main className="min-h-full bg-[#eaf0f9] text-[#0b1f44]">
      <div className="sticky top-0 z-20 flex min-h-16 flex-wrap items-center gap-3 border-b border-slate-200 bg-white px-4 py-3 sm:px-7">
        <button onClick={onBack} className="flex items-center gap-2 border-0 bg-transparent p-0 text-sm font-bold text-slate-500 hover:text-[#0b3675]"><ArrowLeft size={17} /> Back</button>
        <div className="ml-2 hidden h-7 w-px bg-slate-200 sm:block" />
        <div className="min-w-0 flex-1"><div className="truncate text-sm font-extrabold text-slate-900">{isEditing ? `Edit ${form.title}` : `Create from ${template.name}`}</div><div className="text-xs text-slate-400">Changes appear instantly in the preview</div></div>
        <button disabled={saving} onClick={() => onSave(false)} className="rounded-lg border border-[#0b3675] bg-white px-4 py-2 text-xs font-extrabold text-[#0b3675] hover:bg-blue-50 disabled:opacity-60">Save draft</button>
        <button disabled={saving} onClick={() => onSave(true)} className="flex items-center gap-2 rounded-lg border-0 bg-[#073574] px-4 py-2 text-xs font-extrabold text-white hover:bg-[#052b60] disabled:opacity-60">{saving && <Loader2 size={14} className="animate-spin" />}{isEditing ? 'Save & publish' : 'Create & publish'}</button>
      </div>
      <div className="mx-auto max-w-[1160px] p-4 sm:p-7">
        {status && <StatusMessage message={status} />}
        <div className="grid items-start gap-6 lg:grid-cols-[220px_360px_220px] lg:justify-center">
          <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-start-1 lg:row-start-1 lg:self-center">
            <div className="mb-4">
              <h2 className="m-0 text-base font-bold text-slate-900">Button Icons</h2>
              <p className="m-0 mt-1 text-xs leading-relaxed text-slate-500">Choose a button, then apply an icon.</p>
            </div>
            {linkWidgets.length > 0 ? <>
              <Field label="Apply to button">
                <select value={resolvedIconTarget} onChange={(event) => setIconTarget(Number(event.target.value))} className={inputClass}>
                  {linkWidgets.map(({ widget, index }) => <option key={index} value={index}>{widget.label || `Link ${index + 1}`}</option>)}
                </select>
              </Field>
              <div className="mt-4 grid grid-cols-4 gap-2 lg:grid-cols-2">
                {BUTTON_ICONS.map((icon) => {
                  const selected = widgets[resolvedIconTarget]?.icon === icon.id && !widgets[resolvedIconTarget]?.customIconUrl;
                  return <button type="button" key={icon.id} title={icon.label} aria-label={`Use ${icon.label} icon`} onClick={() => { updateTargetIcon({ icon: icon.id, customIconUrl: undefined }); setIconUploadError(''); }} className={cx('flex h-11 items-center justify-center gap-2 rounded-lg border text-xs font-bold transition', selected ? 'border-[#073574] bg-blue-50 text-[#073574] ring-1 ring-[#073574]' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:bg-blue-50')}><ButtonIconGraphic icon={icon.id} size={17} /><span className="hidden lg:inline">{icon.label}</span></button>;
                })}
              </div>
              <label className="mt-4 flex h-10 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#073574] bg-blue-50/50 text-xs font-extrabold text-[#073574] hover:bg-blue-50"><Upload size={14} /> Upload custom icon<input type="file" accept="image/*" onChange={uploadButtonIcon} className="sr-only" /></label>
              {iconUploadError && <p className="mb-0 mt-2 text-xs font-semibold text-red-600">{iconUploadError}</p>}
              {(widgets[resolvedIconTarget]?.icon || widgets[resolvedIconTarget]?.customIconUrl) && <button type="button" onClick={() => { updateTargetIcon({ icon: undefined, customIconUrl: undefined }); setIconUploadError(''); }} className="mt-3 flex items-center gap-2 border-0 bg-transparent p-0 text-xs font-bold text-red-600"><Trash2 size={13} /> Remove icon</button>}
            </> : <p className="m-0 rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Add a link in the phone preview first.</p>}
          </aside>
          <div className="lg:col-start-2 lg:row-start-1 lg:sticky lg:top-24 lg:self-start">
            <div className="mb-3 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">Live preview · click anything to edit</div>
            <PhonePreview form={form} widgets={widgets} editable autoSlug={!isEditing} onFormChange={setForm} onWidgetsChange={setWidgets} />
          </div>
          <aside className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm lg:col-start-3 lg:row-start-1 lg:self-center">
            <div className="mb-4">
              <h2 className="m-0 text-base font-bold text-slate-900">Appearance</h2>
              <p className="m-0 mt-1 text-xs leading-relaxed text-slate-500">Fine-tune your template colors.</p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-1">
              <ColorField label="Background" value={form.bgColor} onChange={(value) => setForm((current) => ({ ...current, bgColor: value }))} />
              <ColorField label="Link cards" value={form.cardColor} onChange={(value) => setForm((current) => ({ ...current, cardColor: value }))} />
              <ColorField label="Text" value={form.textColor} onChange={(value) => setForm((current) => ({ ...current, textColor: value }))} />
              <ColorField label="Accent" value={form.accentColor} onChange={(value) => setForm((current) => ({ ...current, accentColor: value }))} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

function PageDetail({ page, form, widgets, status, onBack, onEdit, onCopy, onDelete }: {
  page: BioPage; form: BioForm; widgets: BioWidget[]; status: string; onBack: () => void; onEdit: () => void; onCopy: () => void; onDelete: () => void;
}) {
  const views = numberSetting(page, 'views');
  const visitors = numberSetting(page, 'uniqueVisitors');
  const clicks = numberSetting(page, 'clicks');
  const ctr = views ? (clicks / views) * 100 : 0;
  const points = [38, 34, 30, 20, 24, 14, 19, 10, 5, 3];
  return (
    <main className="min-h-full bg-[#eaf0f9] px-4 py-6 text-[#0b1f44] sm:px-7 lg:px-10">
      <div className="mx-auto max-w-[1320px]">
        <button onClick={onBack} className="mb-7 flex items-center gap-2 border-0 bg-transparent p-0 text-sm font-bold text-slate-500 hover:text-[#0b3675]"><ArrowLeft size={17} /> Bio Pages</button>
        <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><div className="mb-2 text-xs font-semibold text-slate-500">Bio Pages <span className="px-2">›</span> {page.title}</div><div className="flex items-center gap-3"><h1 className="m-0 text-3xl font-extrabold text-[#0b1f44]">{page.title}</h1><StatusPill published={page.published} /></div><button onClick={onCopy} className="mt-2 flex items-center gap-2 border-0 bg-transparent p-0 text-sm text-blue-500 hover:text-blue-700">ziplin.io/{page.slug}<Copy size={14} /></button></div>
          <div className="flex flex-wrap gap-3"><button onClick={onEdit} className="flex h-11 items-center gap-2 rounded-lg border-0 bg-[#073574] px-5 text-sm font-bold text-white"><Pencil size={16} /> Edit Page</button><button onClick={onCopy} className="flex h-11 items-center gap-2 rounded-lg border border-[#073574] bg-transparent px-5 text-sm font-bold text-[#073574]"><Share2 size={16} /> Share</button><button onClick={onDelete} aria-label="Delete page" className="grid h-11 w-11 place-items-center rounded-lg border border-red-200 bg-white text-red-600 hover:bg-red-50"><Trash2 size={16} /></button></div>
        </div>
        {status && <StatusMessage message={status} />}
        <div className="mb-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard icon={<Eye />} label="Total bio page views" value={formatNumber(views)} badge="+12%" /><StatCard icon={<UsersRound />} label="Unique visitors" value={formatNumber(visitors)} badge="+8%" /><StatCard icon={<MousePointerClick />} label="Avg. click rate" value={`${ctr.toFixed(1)}%`} badge="+3%" /><StatCard icon={<BarChart3 />} label="Total clicks" value={formatNumber(clicks)} /></div>
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <div className="space-y-6">
            <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-7 flex items-center justify-between"><h2 className="m-0 text-lg font-bold">Page Views Over Time</h2><div className="flex gap-2 text-xs font-bold text-slate-500"><span>7D</span><span className="rounded bg-slate-100 px-2 py-1 text-[#0b3675]">30D</span><span>3M</span></div></div><div className="relative h-52 overflow-hidden rounded bg-gradient-to-b from-blue-50/80 to-transparent"><div className="absolute inset-0 flex flex-col justify-between">{[1,2,3,4].map((n) => <div key={n} className="border-t border-dashed border-slate-200" />)}</div><svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 h-full w-full"><polyline points={points.map((point, i) => `${i * (100 / (points.length - 1))},${point}`).join(' ')} fill="none" stroke="#073574" strokeWidth="1.2" vectorEffect="non-scaling-stroke" /></svg></div><div className="mt-2 flex justify-between text-xs text-slate-400"><span>Jun 17</span><span>Jun 24</span><span>Jul 1</span><span>Jul 8</span><span>Jul 16</span></div></section>
            <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><div className="px-6 py-5"><h2 className="m-0 text-lg font-bold">Link Performance</h2></div><div className="grid grid-cols-[1fr_90px_70px] border-y border-slate-200 bg-slate-50 px-5 py-3 text-[11px] font-bold uppercase text-slate-400 sm:grid-cols-[1fr_110px_90px_130px]"><span>Link name</span><span>Clicks</span><span>CTR</span><span className="hidden sm:block">Last clicked</span></div>{widgets.filter((widget) => widget.type === 'link').map((widget, index) => { const widgetClicks = Math.max(0, Math.round(clicks * ([.43,.32,.17,.08][index] ?? .05))); return <div key={index} className="grid grid-cols-[1fr_90px_70px] items-center border-b border-slate-200 px-5 py-4 text-sm last:border-0 sm:grid-cols-[1fr_110px_90px_130px]"><span className="flex min-w-0 items-center gap-3 font-semibold"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-slate-100 text-[#0b3675]"><Link2 size={15} /></span><span className="truncate">{widget.label}</span></span><span className="text-slate-500">{formatNumber(widgetClicks)}</span><span className="text-slate-500">{clicks ? ((widgetClicks / clicks) * ctr).toFixed(1) : '0.0'}%</span><span className="hidden text-slate-500 sm:block">—</span></div>; })}</section>
          </div>
          <div><div className="mb-3 text-center text-xs font-extrabold uppercase tracking-wider text-slate-500">Live preview</div><PhonePreview form={form} widgets={widgets} /></div>
        </div>
      </div>
    </main>
  );
}

type PhoneEditorTarget = 'avatar' | 'title' | 'bio' | number | null;

function ButtonIconGraphic({ icon, customIconUrl, size = 16 }: { icon?: string; customIconUrl?: string; size?: number }) {
  if (customIconUrl) return <img src={customIconUrl} alt="" className="shrink-0 rounded-sm object-contain" style={{ width: size, height: size }} />;
  switch (icon) {
    case 'instagram': return <Instagram size={size} />;
    case 'spotify': return <Music2 size={size} />;
    case 'youtube': return <Youtube size={size} />;
    case 'x': return <span aria-hidden="true" className="shrink-0 font-black leading-none" style={{ fontSize: size }}>X</span>;
    case 'website': return <Globe2 size={size} />;
    case 'email': return <Mail size={size} />;
    case 'shop': return <ShoppingBag size={size} />;
    case 'booking': return <CalendarDays size={size} />;
    default: return null;
  }
}

function PhonePreview({ form, widgets, editable = false, autoSlug = false, onFormChange, onWidgetsChange }: {
  form: BioForm;
  widgets: BioWidget[];
  editable?: boolean;
  autoSlug?: boolean;
  onFormChange?: React.Dispatch<React.SetStateAction<BioForm>>;
  onWidgetsChange?: React.Dispatch<React.SetStateAction<BioWidget[]>>;
}) {
  const [editing, setEditing] = useState<PhoneEditorTarget>(null);
  const [uploadError, setUploadError] = useState('');
  const editingWidget = typeof editing === 'number' ? widgets[editing] : null;

  function updateForm(patch: Partial<BioForm>) {
    onFormChange?.((current) => ({ ...current, ...patch }));
  }

  function updatePhoneWidget(index: number, patch: Partial<BioWidget>) {
    onWidgetsChange?.((current) => current.map((widget, widgetIndex) => widgetIndex === index ? { ...widget, ...patch } : widget));
  }

  function addPhoneWidget() {
    const newIndex = widgets.length;
    onWidgetsChange?.((current) => [...current, { type: 'link', label: 'New link', url: 'https://' }]);
    setEditing(newIndex);
  }

  function movePhoneWidget(index: number, direction: -1 | 1) {
    const target = index + direction;
    if (target < 0 || target >= widgets.length) return;
    onWidgetsChange?.((current) => {
      const next = [...current];
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
    setEditing(target);
  }

  function uploadAvatar(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setUploadError('Choose an image file.');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateForm({ avatarUrl: reader.result });
        setUploadError('');
      }
    };
    reader.onerror = () => setUploadError('Could not read that image.');
    reader.readAsDataURL(file);
    event.target.value = '';
  }

  return (
    <div className="mx-auto w-full max-w-[360px] rounded-[44px] border-[10px] border-[#071e46] bg-[#071e46] p-1 shadow-[0_20px_35px_rgba(15,23,42,.18)]">
      <div className="relative min-h-[620px] overflow-hidden rounded-[31px] px-5 pb-8 pt-16 text-center" style={{ backgroundColor: form.bgColor, color: form.textColor }}>
        <div className="absolute left-1/2 top-3 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        <button type="button" disabled={!editable} onClick={() => setEditing('avatar')} aria-label={editable ? 'Edit avatar' : undefined} className={cx('group relative mx-auto block h-20 w-20 rounded-full border-0 bg-transparent p-0', editable && 'cursor-pointer outline-none ring-offset-2 hover:ring-2 hover:ring-current focus:ring-2 focus:ring-current')}>
          {form.avatarUrl ? <img src={form.avatarUrl} alt="Profile avatar" className="h-20 w-20 rounded-full object-cover shadow" /> : <span className="grid h-20 w-20 place-items-center rounded-full text-xl font-black shadow" style={{ backgroundColor: form.accentColor, color: form.cardColor }}>{initials(form.title)}</span>}
          {editable && <span className="absolute -bottom-1 -right-1 grid h-7 w-7 place-items-center rounded-full bg-white text-[#073574] shadow"><Pencil size={13} /></span>}
        </button>
        <button type="button" disabled={!editable} onClick={() => setEditing('title')} className={cx('mx-auto mb-1 mt-4 block rounded-md border-0 bg-transparent px-2 text-xl font-extrabold', editable && 'cursor-pointer hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-current')}>{form.title || 'Your name'}</button>
        <button type="button" disabled={!editable} onClick={() => setEditing('bio')} className={cx('mx-auto mb-5 block max-w-full rounded-md border-0 bg-transparent px-2 text-sm opacity-70', editable && 'cursor-pointer hover:bg-white/50 focus:outline-none focus:ring-2 focus:ring-current')}>{form.bio || 'Your bio goes here'}</button>
        <div className="space-y-3">{widgets.map((widget, index) => widget.type === 'link' ? editable ? (
          <button key={index} type="button" onClick={() => setEditing(index)} className="relative flex min-h-12 w-full cursor-pointer items-center justify-center rounded-full border border-black/10 px-12 text-sm font-bold shadow-sm outline-none transition hover:-translate-y-0.5 hover:shadow-md focus:ring-2 focus:ring-current" style={{ backgroundColor: form.cardColor, color: form.textColor }}>{(widget.icon || widget.customIconUrl) && <span className="absolute left-5 flex items-center"><ButtonIconGraphic icon={widget.icon} customIconUrl={widget.customIconUrl} size={17} /></span>}<span className="truncate">{widget.label || 'New link'}</span></button>
        ) : (
          <a key={index} href={widget.url || '#'} target="_blank" rel="noreferrer" className="relative flex min-h-12 items-center justify-center rounded-full border border-black/10 px-12 text-sm font-bold no-underline shadow-sm transition hover:-translate-y-0.5 hover:shadow-md" style={{ backgroundColor: form.cardColor, color: form.textColor }}>{(widget.icon || widget.customIconUrl) && <span className="absolute left-5 flex items-center"><ButtonIconGraphic icon={widget.icon} customIconUrl={widget.customIconUrl} size={17} /></span>}<span className="truncate">{widget.label || 'New link'}</span></a>
        ) : null)}</div>
        {editable && <button type="button" onClick={addPhoneWidget} className="mt-3 flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-dashed border-current bg-transparent px-5 text-sm font-bold opacity-70 transition hover:bg-white/40 hover:opacity-100"><Plus size={16} /> Add link</button>}
        <div className="mt-10 flex items-center justify-center gap-1 text-[11px] font-extrabold opacity-60"><Link2 size={13} /> ziplin</div>

        {editable && editing !== null && (
          <div className="absolute inset-0 z-20 flex items-end bg-slate-950/35 p-3 text-left" onClick={() => setEditing(null)}>
            <div className="w-full rounded-2xl bg-white p-4 text-slate-800 shadow-2xl" onClick={(event) => event.stopPropagation()}>
              <div className="mb-4 flex items-center justify-between">
                <div><div className="text-sm font-extrabold">{editing === 'avatar' ? 'Edit avatar' : editing === 'title' ? 'Edit page name' : editing === 'bio' ? 'Edit bio' : 'Edit link'}</div><div className="text-[11px] text-slate-500">Your preview updates instantly</div></div>
                <button type="button" onClick={() => setEditing(null)} className="grid h-8 w-8 place-items-center rounded-full border-0 bg-slate-100 text-lg text-slate-500 hover:bg-slate-200" aria-label="Close editor">×</button>
              </div>
              {editing === 'avatar' && <div className="space-y-3">
                <label className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#073574] text-xs font-extrabold text-white hover:bg-[#052b60]"><Upload size={15} /> Upload from device<input type="file" accept="image/*" onChange={uploadAvatar} className="sr-only" /></label>
                <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-wider text-slate-400"><span className="h-px flex-1 bg-slate-200" /> or use a URL <span className="h-px flex-1 bg-slate-200" /></div>
                <Field label="Avatar image URL"><input value={form.avatarUrl.startsWith('data:') ? '' : form.avatarUrl} onChange={(event) => { updateForm({ avatarUrl: event.target.value }); setUploadError(''); }} placeholder="https://…" className={inputClass} /></Field>
                {form.avatarUrl && <button type="button" onClick={() => { updateForm({ avatarUrl: '' }); setUploadError(''); }} className="flex items-center gap-2 border-0 bg-transparent p-0 text-xs font-bold text-red-600"><Trash2 size={14} /> Remove image</button>}
                {uploadError && <p className="m-0 text-xs font-semibold text-red-600">{uploadError}</p>}
              </div>}
              {editing === 'title' && <div className="space-y-3"><Field label="Page title"><input autoFocus value={form.title} onChange={(event) => updateForm({ title: event.target.value, ...(autoSlug ? { slug: makeSlug(event.target.value) } : {}) })} className={inputClass} /></Field><Field label="Custom URL"><div className="flex h-11 overflow-hidden rounded-lg border border-slate-300 bg-white focus-within:ring-2 focus-within:ring-blue-200"><span className="flex items-center bg-slate-50 px-2 text-[11px] text-slate-500">ziplin.io/</span><input value={form.slug} onChange={(event) => updateForm({ slug: makeSlug(event.target.value) })} className="min-w-0 flex-1 border-0 px-2 text-sm outline-none" /></div></Field></div>}
              {editing === 'bio' && <Field label="Bio"><textarea autoFocus value={form.bio} onChange={(event) => updateForm({ bio: event.target.value })} rows={3} className={`${inputClass} h-auto resize-none py-3`} /></Field>}
              {typeof editing === 'number' && editingWidget && <div className="space-y-3"><Field label="Button text"><input autoFocus value={editingWidget.label ?? ''} onChange={(event) => updatePhoneWidget(editing, { label: event.target.value })} className={inputClass} /></Field><Field label="Destination URL"><input value={editingWidget.url ?? ''} onChange={(event) => updatePhoneWidget(editing, { url: event.target.value })} placeholder="https://example.com" className={inputClass} /></Field><div className="grid grid-cols-2 gap-2"><button type="button" disabled={editing === 0} onClick={() => movePhoneWidget(editing, -1)} className="h-9 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Move up</button><button type="button" disabled={editing === widgets.length - 1} onClick={() => movePhoneWidget(editing, 1)} className="h-9 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40">Move down</button></div><button type="button" onClick={() => { onWidgetsChange?.((current) => current.filter((_, index) => index !== editing)); setEditing(null); }} className="flex items-center gap-2 border-0 bg-transparent p-0 text-xs font-bold text-red-600"><Trash2 size={14} /> Remove this link</button></div>}
              <button type="button" onClick={() => setEditing(null)} className="mt-4 h-10 w-full rounded-lg border-0 bg-[#073574] text-xs font-extrabold text-white">Done</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, badge, neutral }: { icon: React.ReactNode; label: string; value: string; badge?: string; neutral?: boolean }) {
  return <div className="min-h-36 rounded-xl border border-slate-200 bg-white p-6 shadow-sm"><div className="mb-6 flex items-center justify-between"><span className="text-slate-950 [&>svg]:h-6 [&>svg]:w-6">{icon}</span>{badge && <span className={cx('rounded-md px-2 py-1 text-xs font-bold', neutral ? 'bg-slate-100 text-slate-500' : 'bg-emerald-50 text-emerald-600')}>{badge}</span>}</div><div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div><div className="mt-1 text-2xl font-extrabold tracking-tight text-[#0b1f44]">{value}</div></div>;
}

function StatusPill({ published }: { published: boolean }) {
  return <span className={cx('inline-flex rounded-full px-3 py-1 text-[10px] font-extrabold uppercase tracking-wide', published ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500')}>{published ? 'Active' : 'Draft'}</span>;
}

function EditorSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="mb-5"><h2 className="m-0 text-lg font-bold text-slate-900">{title}</h2><p className="m-0 mt-1 text-xs text-slate-500">{subtitle}</p></div>{children}</section>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span>{children}</label>;
}

function ColorField({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return <Field label={label}><div className="flex h-11 items-center gap-2 rounded-lg border border-slate-300 bg-white px-2"><input type="color" value={value} onChange={(event) => onChange(event.target.value)} className="h-7 w-8 cursor-pointer border-0 bg-transparent p-0" /><span className="truncate text-xs font-semibold uppercase text-slate-500">{value}</span></div></Field>;
}

function StatusMessage({ message }: { message: string }) {
  return <div className="mb-5 flex items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-[#0b3675]"><Check size={16} /> {message}</div>;
}

const inputClass = 'h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100';
