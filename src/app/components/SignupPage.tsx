import { useState } from 'react';
import { registerTenant } from '../services/public';
import { storeSession, type AuthSession } from '../services/auth';
import { AuthSplitLayout } from './AuthSplitLayout';

interface SignupPageProps {
  onRegistered: (session: AuthSession) => void;
  onShowLogin: () => void;
}

const panel = {
  badge: 'Free plan — no credit card',
  headline: (
    <>
      The link platform your{' '}
      <span className="bg-gradient-to-r from-emerald-400 to-sky-400 bg-clip-text text-transparent font-black">
        team will love.
      </span>
    </>
  ),
  bullets: [
    { icon: '🚀', text: 'Set up your workspace in under 60 seconds — no setup fees, ever.' },
    { icon: '🪪', text: 'Bio pages, QR codes, and short links all under one branded domain.' },
    { icon: '🔒', text: 'Enterprise-grade security with role-based access for every team member.' },
  ],
  quote: 'We switched from Bitly and never looked back. Custom domains and analytics out of the box.',
  quoteAuthor: 'Marcus Webb',
  quoteRole: 'Marketing Lead · Pulsify',
  accent: 'rgba(16,185,129,0.18)',
  accentColor: '#34d399',
};

export function SignupPage({ onRegistered, onShowLogin }: SignupPageProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPass, setShowPass] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await registerTenant({ firstName, lastName, companyName, email, password });
      const session: AuthSession = { user: result.user };
      storeSession(session);
      onRegistered(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full h-[46px] border-[1.5px] border-slate-200 rounded-xl px-3.5 text-sm outline-none font-sans bg-white text-slate-900 focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] transition-all placeholder:text-slate-450";

  return (
    <AuthSplitLayout
      panel={panel}
      leftContent={
        <iframe
          src="/ziplin-coast-runner.html"
          title="Ziplin Coast Runner"
          className="h-full min-h-screen w-full border-0 bg-[#1c3a6e]"
          allow="fullscreen"
        />
      }
    >
      {/* Heading */}
      <div className="mb-7">
        <h1 className="text-[28px] font-black text-slate-900 tracking-[-0.8px] m-0 mb-1.5 font-sans">
          Create your account
        </h1>
        <p className="text-sm text-[#64748b] m-0 font-sans">
          Already have an account?{' '}
          <button type="button" onClick={onShowLogin} className="border-0 bg-transparent text-[#081C45] font-bold cursor-pointer p-0 text-sm font-sans hover:underline">Sign in</button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-0">
        <FieldBlock label="Company / workspace name">
          <input
            value={companyName}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Acme Corp"
            autoComplete="organization"
            required
            className={inputClass}
          />
        </FieldBlock>

        <div className="flex gap-3">
          <FieldBlock label="First name">
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
              placeholder="Jane" autoComplete="given-name" required className={inputClass} />
          </FieldBlock>
          <FieldBlock label="Last name">
            <input value={lastName} onChange={(e) => setLastName(e.target.value)}
              placeholder="Smith" autoComplete="family-name" required className={inputClass} />
          </FieldBlock>
        </div>

        <FieldBlock label="Work email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            autoComplete="email"
            required
            className={inputClass}
          />
        </FieldBlock>

        <FieldBlock label="Password">
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              required
              className={`${inputClass} pr-11`}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 text-xs font-semibold p-0"
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
        </FieldBlock>

        {error && <ErrorBanner msg={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 border-none rounded-[11px] bg-gradient-to-r from-[#081C45] to-[#0E2F73] text-white font-bold text-[15px] cursor-pointer font-sans tracking-[-0.2px] shadow-[0_4px_20px_rgba(8,28,69,0.35)] hover:shadow-[0_6px_24px_rgba(8,28,69,0.45)] hover:opacity-95 active:scale-[0.99] transition-all mt-1 disabled:opacity-75"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Creating account…
            </span>
          ) : 'Create free account →'}
        </button>

        <p className="text-xs text-slate-400 text-center mt-4 leading-relaxed font-sans">
          By creating an account you agree to our{' '}
          <a href="/terms-of-service"><span className="text-[#081C45] cursor-pointer hover:underline">Terms</span></a> and{' '}
          <a href="/privacy-policy"><span className="text-[#081C45] cursor-pointer hover:underline">Privacy Policy</span></a>.
        </p>
      </form>
    </AuthSplitLayout>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-3.5 flex-1">
      <label className="block text-[13px] font-semibold text-slate-750 mb-1.5 font-sans">
        {label}
      </label>
      {children}
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 mb-3">
      <span className="text-red-500 text-sm shrink-0">⚠</span>
      <span className="text-[13px] text-red-850 font-sans leading-relaxed">{msg}</span>
    </div>
  );
}

