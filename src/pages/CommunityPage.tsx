import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Flame,
  Lightbulb,
  MessageCircle,
  Plus,
  Search,
  Send,
  ThumbsUp,
  Trophy,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { PageTransition } from '@/components/ui/PageTransition';
import { SiteFooter } from '@/components/layout/SiteFooter';

type ForumThread = {
  id: string;
  initials: string;
  name: string;
  time: string;
  body: string;
  tone: string;
  reactions: number;
  reacted: boolean;
  replies: string[];
  link?: string;
};

type FeatureRequest = {
  id: string;
  title: string;
  description: string;
  votes: number;
  voted: boolean;
  status: 'New' | 'Reviewing' | 'Planned' | 'Shipped';
};

const storageKey = 'ziplin-community-board-v1';

const fireBurstParticles = [
  { x: -34, y: -52, delay: 0 },
  { x: -18, y: -68, delay: 0.04 },
  { x: 0, y: -76, delay: 0.08 },
  { x: 18, y: -66, delay: 0.12 },
  { x: 34, y: -50, delay: 0.16 },
  { x: -8, y: -54, delay: 0.2 },
  { x: 10, y: -46, delay: 0.24 },
] as const;

const voteBurstParticles = [
  { x: -32, y: -54, delay: 0 },
  { x: -16, y: -72, delay: 0.04 },
  { x: 2, y: -80, delay: 0.08 },
  { x: 20, y: -70, delay: 0.12 },
  { x: 34, y: -52, delay: 0.16 },
  { x: -6, y: -58, delay: 0.2 },
  { x: 12, y: -48, delay: 0.24 },
] as const;

const initialThreads: ForumThread[] = [
  {
    id: 'bulk-edit-tags',
    initials: 'SJ',
    name: 'Sarah Jenkins',
    time: '10:24 AM',
    body: 'Bulk edit for tagging feels clunky. We need a migrate-safe way to massage data transitions before tags are locked.',
    tone: 'bg-[#ffc93d]',
    reactions: 12,
    reacted: false,
    replies: ['Converted into a product request: bulk-edit staging before publish.'],
  },
  {
    id: 'schema-transition',
    initials: 'MT',
    name: 'Mike T.',
    time: '10:32 AM',
    body: 'Same. I already voted. This feels similar to schema update previews: show a peek before applying changes.',
    tone: 'bg-[#8dccf0]',
    reactions: 6,
    reacted: false,
    link: 'Schema Data Structuring Best Practices',
    replies: [],
  },
];

const initialRequests: FeatureRequest[] = [
  {
    id: 'custom-domain-analytics',
    title: 'Custom Domain Analytics',
    description: 'Separate reporting dashboards for each branded domain.',
    votes: 43,
    voted: false,
    status: 'Reviewing',
  },
  {
    id: 'dark-mode-override',
    title: 'Dark Mode Override',
    description: 'Force dark mode on shared links and landing experiences.',
    votes: 29,
    voted: false,
    status: 'Planned',
  },
  {
    id: 'bulk-edit-staging',
    title: 'Bulk Edit Staging',
    description: 'Preview tag, UTM, and campaign changes before applying them in bulk.',
    votes: 18,
    voted: false,
    status: 'New',
  },
];

export function CommunityPage() {
  const [threads, setThreads] = useState(initialThreads);
  const [requests, setRequests] = useState(initialRequests);
  const [query, setQuery] = useState('');
  const [threadText, setThreadText] = useState('');
  const [ideaTitle, setIdeaTitle] = useState('');
  const [ideaDescription, setIdeaDescription] = useState('');
  const [showIdeaForm, setShowIdeaForm] = useState(false);
  const [replyDrafts, setReplyDrafts] = useState<Record<string, string>>({});
  const [expandedRequests, setExpandedRequests] = useState(false);
  const [reactionBursts, setReactionBursts] = useState<Record<string, number>>({});
  const [voteBursts, setVoteBursts] = useState<Record<string, number>>({});

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || 'null') as
        | { threads?: ForumThread[]; requests?: FeatureRequest[] }
        | null;
      if (saved?.threads?.length) setThreads(saved.threads);
      if (saved?.requests?.length) setRequests(saved.requests);
    } catch {
      /* ignore bad local cache */
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify({ threads, requests }));
  }, [threads, requests]);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredThreads = useMemo(() => {
    if (!normalizedQuery) return threads;
    return threads.filter((thread) =>
      [thread.name, thread.body, thread.link, ...thread.replies].join(' ').toLowerCase().includes(normalizedQuery),
    );
  }, [normalizedQuery, threads]);

  const filteredRequests = useMemo(() => {
    const source = expandedRequests ? requests : requests.slice(0, 2);
    if (!normalizedQuery) return source;
    return requests.filter((request) =>
      [request.title, request.description, request.status].join(' ').toLowerCase().includes(normalizedQuery),
    );
  }, [expandedRequests, normalizedQuery, requests]);

  function submitThread(event: FormEvent) {
    event.preventDefault();
    const body = threadText.trim();
    if (!body) return;
    setThreads((current) => [
      ...current,
      {
        id: `thread-${Date.now()}`,
        initials: 'YO',
        name: 'You',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        body,
        tone: 'bg-[#c8f2cf]',
        reactions: 0,
        reacted: false,
        replies: [],
      },
    ]);
    setThreadText('');
  }

  function submitIdea(event: FormEvent) {
    event.preventDefault();
    const title = ideaTitle.trim();
    const description = ideaDescription.trim();
    if (!title || !description) return;
    setRequests((current) => [
      {
        id: `request-${Date.now()}`,
        title,
        description,
        votes: 1,
        voted: true,
        status: 'New',
      },
      ...current,
    ]);
    setIdeaTitle('');
    setIdeaDescription('');
    setShowIdeaForm(false);
    setExpandedRequests(true);
  }

  function toggleThreadReaction(id: string) {
    const willReact = !threads.find((thread) => thread.id === id)?.reacted;
    if (willReact) {
      setReactionBursts((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    }
    setThreads((current) =>
      current.map((thread) =>
        thread.id === id
          ? { ...thread, reacted: !thread.reacted, reactions: thread.reacted ? Math.max(0, thread.reactions - 1) : thread.reactions + 1 }
          : thread,
      ),
    );
  }

  function submitReply(id: string) {
    const reply = replyDrafts[id]?.trim();
    if (!reply) return;
    setThreads((current) => current.map((thread) => (thread.id === id ? { ...thread, replies: [...thread.replies, reply] } : thread)));
    setReplyDrafts((current) => ({ ...current, [id]: '' }));
  }

  function toggleVote(id: string) {
    const willVote = !requests.find((request) => request.id === id)?.voted;
    if (willVote) {
      setVoteBursts((current) => ({ ...current, [id]: (current[id] || 0) + 1 }));
    }
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? { ...request, voted: !request.voted, votes: request.voted ? Math.max(0, request.votes - 1) : request.votes + 1 }
          : request,
      ),
    );
  }

  function advanceStatus(id: string) {
    const order: FeatureRequest['status'][] = ['New', 'Reviewing', 'Planned', 'Shipped'];
    setRequests((current) =>
      current.map((request) => {
        if (request.id !== id) return request;
        const next = order[Math.min(order.indexOf(request.status) + 1, order.length - 1)];
        return { ...request, status: next };
      }),
    );
  }

  return (
    <PageTransition>
      <section className="min-h-[900px] bg-white">
        <div className="border-b border-[#dbe4ef] bg-[#f0f3ff]">
          <div className="site-container flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <span className="flex size-12 items-center justify-center rounded-xl bg-[#091331] text-white"><MessageCircle className="size-6" /></span>
              <div>
                <div className="flex items-center gap-2"><h1 className="font-display text-2xl">The Feed</h1><span className="rounded-full bg-[#b4ff4f] px-2 py-0.5 font-mono text-[9px] font-bold text-[#07132f]">LIVE</span></div>
                <p className="text-sm text-[#5e687e]">Where the community shapes what we build next</p>
              </div>
            </div>
            <label className="flex w-full max-w-[390px] items-center gap-2 rounded-full border-2 border-ziplin-navy bg-white px-4 py-2.5">
              <Search className="size-4" />
              <input value={query} onChange={(event) => setQuery(event.target.value)} className="min-w-0 flex-1 text-sm outline-none" placeholder="Find a thread, idea, anything..." />
            </label>
          </div>
        </div>

        <div className="site-container grid gap-10 py-8 lg:grid-cols-[1fr_360px]">
          <main>
            <div className="my-4 text-center"><span className="rounded-full bg-ziplin-navy px-4 py-2 font-mono text-[10px] font-bold tracking-[.14em] text-white">TODAY</span></div>
            <div className="mt-10 space-y-10">
              {filteredThreads.map((thread) => (
                <motion.article key={thread.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
                  <div className={`flex size-11 shrink-0 items-center justify-center rounded-xl border-2 border-ziplin-navy text-sm font-semibold ${thread.tone}`}>{thread.initials}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline gap-3"><strong>{thread.name}</strong><span className="font-mono text-[10px] text-[#98a1b4]">{thread.time}</span></div>
                    <div className="mt-2 max-w-[680px] rounded-[16px] border-2 border-ziplin-navy bg-white p-5 shadow-[0_10px_30px_rgba(8,28,69,.06)]">
                      <p className="text-base leading-7 text-[#202638]">{thread.body}</p>
                      {thread.link ? <div className="mt-4 flex items-center gap-3 rounded-xl border-2 border-ziplin-navy bg-[#f8fbff] p-4"><span className="flex size-9 items-center justify-center rounded-lg bg-[#091331] font-mono text-[#b4ff4f]">{'{}'}</span><div><strong className="block text-sm">{thread.link}</strong><span className="text-xs text-[#97a1b4]">docs.example.com</span></div></div> : null}
                    </div>
                    {thread.replies.length ? <div className="ml-4 mt-3 space-y-2 border-l-2 border-[#dbe4ef] pl-4">{thread.replies.map((reply, index) => <p key={`${thread.id}-reply-${index}`} className="rounded-xl bg-[#f8fbff] px-4 py-2 text-sm text-[#40516a]">{reply}</p>)}</div> : null}
                    <div className="mt-2 flex flex-wrap gap-2">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleThreadReaction(thread.id)}
                          aria-pressed={thread.reacted}
                          aria-label={`${thread.reacted ? 'Remove' : 'Add'} fire vote. ${thread.reactions} votes`}
                          className={`relative z-10 inline-flex h-8 items-center gap-1.5 rounded-full border-2 border-ziplin-navy px-3 text-xs transition-colors ${thread.reacted ? 'bg-[#ffc60a] shadow-[0_3px_0_#081c45]' : 'bg-white hover:bg-[#fff8dc]'}`}
                        >
                          <motion.span
                            animate={thread.reacted ? { scale: [1, 1.5, 0.9, 1.15, 1], rotate: [0, -12, 10, -5, 0] } : { scale: 1, rotate: 0 }}
                            transition={{ duration: 0.55, ease: 'easeOut' }}
                            className="inline-flex"
                          >
                            <Flame className={`size-4 ${thread.reacted ? 'fill-[#ff6b00] text-[#c2410c]' : 'text-[#f59e0b]'}`} />
                          </motion.span>
                          <span>Hot</span>
                          <motion.strong key={thread.reactions} initial={{ scale: 1.45 }} animate={{ scale: 1 }} className="font-semibold">
                            {thread.reactions}
                          </motion.strong>
                        </button>

                        {thread.reacted && reactionBursts[thread.id] ? (
                          <motion.span
                            key={`${thread.id}-${reactionBursts[thread.id]}`}
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-20"
                          >
                            {fireBurstParticles.map((particle, index) => (
                              <motion.span
                                key={`${thread.id}-fire-${index}`}
                                initial={{ x: 0, y: 0, scale: 0.35, rotate: 0, opacity: 0 }}
                                animate={{
                                  x: particle.x,
                                  y: particle.y,
                                  scale: [0.35, 1.1, 0.75],
                                  rotate: particle.x * 0.9,
                                  opacity: [0, 1, 1, 0],
                                }}
                                transition={{ duration: 0.9, delay: particle.delay, ease: 'easeOut' }}
                                className="absolute left-1/2 top-1/2 -ml-2 -mt-2 text-base drop-shadow-[0_2px_2px_rgba(194,65,12,.28)]"
                              >
                                🔥
                              </motion.span>
                            ))}
                          </motion.span>
                        ) : null}
                      </div>
                      <input value={replyDrafts[thread.id] || ''} onChange={(event) => setReplyDrafts((current) => ({ ...current, [thread.id]: event.target.value }))} className="h-8 min-w-[220px] rounded-full border border-[#dbe4ef] px-3 text-xs outline-none" placeholder="Reply with customer insight..." />
                      <button onClick={() => submitReply(thread.id)} className="flex h-8 items-center gap-1 rounded-full border-2 border-ziplin-navy bg-white px-3 text-xs"><Plus className="size-3" /> Reply</button>
                    </div>
                  </div>
                </motion.article>
              ))}
              {!filteredThreads.length ? <div className="rounded-2xl border border-dashed border-[#c8d2e1] p-8 text-center text-[#64748b]">No discussions match your search.</div> : null}
            </div>

            <form onSubmit={submitThread} className="mt-10 flex items-center gap-3 rounded-[18px] border-2 border-ziplin-navy bg-white p-2 shadow-[0_4px_0_#081c45]">
              <button type="button" onClick={() => setThreadText('I found a customer requirement: ')} className="flex size-10 items-center justify-center"><Plus /></button>
              <input value={threadText} onChange={(event) => setThreadText(event.target.value)} className="min-w-0 flex-1 px-2 outline-none" placeholder="Share a customer requirement or product issue..." />
              <button className="flex size-11 items-center justify-center rounded-xl border-2 border-ziplin-navy bg-[#ffc93d]"><Send className="size-5" /></button>
            </form>
          </main>

          <aside className="space-y-4 lg:pt-2">
            <div className="rounded-[20px] border-2 border-ziplin-navy bg-white p-5 shadow-[0_8px_24px_rgba(8,28,69,.08)]">
              <div className="flex items-center justify-between"><h2 className="flex items-center gap-2 font-display text-lg"><Trophy className="size-5 text-ziplin-yellow" />Top Requests</h2><button onClick={() => setExpandedRequests((value) => !value)} className="text-sm text-ziplin-blue">{expandedRequests ? 'Show top' : 'See all'}</button></div>
              <div className="mt-5 divide-y">
                {filteredRequests.map((request, index) => (
                  <div key={request.id} className="py-4">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs text-[#a0a9ba]">{String(index + 1).padStart(2, '0')}</span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => toggleVote(request.id)}
                          aria-pressed={request.voted}
                          aria-label={`${request.voted ? 'Remove' : 'Add'} vote for ${request.title}. ${request.votes} votes`}
                          className={`relative z-10 flex min-w-[56px] flex-col items-center rounded-xl border-2 border-ziplin-navy px-2 py-1 text-center text-[10px] transition-colors ${request.voted ? 'bg-[#b4ff4f] shadow-[0_3px_0_#081c45]' : 'bg-white hover:bg-[#f5ffe8]'}`}
                        >
                          <span className="inline-flex items-center gap-1">
                            <motion.span
                              animate={request.voted ? { scale: [1, 1.5, 0.9, 1.15, 1], rotate: [0, -10, 8, -4, 0] } : { scale: 1, rotate: 0 }}
                              transition={{ duration: 0.55, ease: 'easeOut' }}
                              className="inline-flex"
                            >
                              <ThumbsUp className={`size-3 ${request.voted ? 'fill-[#0e2f73] text-[#0e2f73]' : 'text-ziplin-blue'}`} />
                            </motion.span>
                            {request.voted ? 'Voted' : 'Vote'}
                          </span>
                          <motion.strong key={request.votes} initial={{ scale: 1.45 }} animate={{ scale: 1 }} className="text-lg">
                            {request.votes}
                          </motion.strong>
                        </button>

                        {request.voted && voteBursts[request.id] ? (
                          <motion.span
                            key={`${request.id}-${voteBursts[request.id]}`}
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 z-20"
                          >
                            {voteBurstParticles.map((particle, particleIndex) => (
                              <motion.span
                                key={`${request.id}-vote-${particleIndex}`}
                                initial={{ x: 0, y: 0, scale: 0.35, rotate: 0, opacity: 0 }}
                                animate={{
                                  x: particle.x,
                                  y: particle.y,
                                  scale: [0.35, 1.1, 0.75],
                                  rotate: particle.x * 0.75,
                                  opacity: [0, 1, 1, 0],
                                }}
                                transition={{ duration: 0.9, delay: particle.delay, ease: 'easeOut' }}
                                className="absolute left-1/2 top-1/2 -ml-2 -mt-2 text-base drop-shadow-[0_2px_2px_rgba(14,47,115,.24)]"
                              >
                                👍
                              </motion.span>
                            ))}
                          </motion.span>
                        ) : null}
                      </div>
                      <div className="min-w-0 flex-1"><strong className="block text-sm">{request.title}</strong><span className="text-[11px] text-[#8b95a7]">{request.description}</span></div>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-2 pl-12">
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#fff6cc] px-2 py-1 text-[11px] font-semibold text-[#081c45]"><CheckCircle2 className="size-3" /> {request.status}</span>
                      <button onClick={() => advanceStatus(request.id)} className="text-[11px] font-semibold text-[#0e2f73]">Move status</button>
                    </div>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowIdeaForm((value) => !value)} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ziplin-navy bg-[#ffc93d] py-4"><Lightbulb className="size-4" /> Drop a feature idea</button>
              <button onClick={() => setShowIdeaForm(true)} className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border-2 border-ziplin-navy bg-[#f1efff] py-4"><ThumbsUp className="size-4" /> Start a vote</button>
              {showIdeaForm ? (
                <form onSubmit={submitIdea} className="mt-4 space-y-3 rounded-xl border border-[#dbe4ef] bg-[#f8fbff] p-3">
                  <input value={ideaTitle} onChange={(event) => setIdeaTitle(event.target.value)} className="h-10 w-full rounded-lg border border-[#dbe4ef] px-3 text-sm outline-none" placeholder="Feature title" />
                  <textarea value={ideaDescription} onChange={(event) => setIdeaDescription(event.target.value)} className="min-h-20 w-full rounded-lg border border-[#dbe4ef] px-3 py-2 text-sm outline-none" placeholder="What customer problem does this solve?" />
                  <button className="h-10 w-full rounded-lg bg-[#081c45] text-sm font-semibold text-white">Submit request</button>
                </form>
              ) : null}
            </div>

            <div className="rounded-[18px] bg-gradient-to-br from-[#071638] to-[#304ba8] p-6 text-white">
              <h3 className="font-display text-lg">Product signal board</h3>
              <p className="mt-2 text-sm leading-6 text-white/70">Threads, votes, replies, and request status are saved in this browser so testers can capture customer needs during review.</p>
              <Flame className="mt-4 text-[#ffc60a]" />
            </div>
          </aside>
        </div>
      </section>
      <SiteFooter />
    </PageTransition>
  );
}
