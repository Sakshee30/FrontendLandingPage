import { useState } from 'react';
import { AuthSession, login, loginToPaidDemo } from '../services/auth';
import { AuthSplitLayout } from './AuthSplitLayout';

interface LoginPageProps {
  onLogin: (session: AuthSession) => void;
  onShowSignup: () => void;
  onForgotPassword?: () => void;
}

const panel = {
  badge: 'Trusted by 50,000+ teams',
  headline: (
    <>
      Welcome back.{' '}
      <span className="bg-gradient-to-r from-[#164BB7] to-[#FFC60A] bg-clip-text text-transparent font-black">
        Your links are waiting.
      </span>
    </>
  ),
  bullets: [
    { icon: '⚡', text: 'Real-time click analytics updated every second across all your links.' },
    { icon: '🔗', text: 'Branded short links with custom slugs, expiry, and password protection.' },
    { icon: '📊', text: 'Full funnel visibility — geo, device, referrer, and campaign attribution.' },
  ],
  quote: 'Ziplin replaced three separate tools for us. The analytics alone are worth switching for.',
  quoteAuthor: 'Sarah Chen',
  quoteRole: 'Head of Growth · Vertica',
  accent: 'rgba(109,40,217,0.22)',
  accentColor: '#164BB7',
};

export function LoginPage({ onLogin, onShowSignup, onForgotPassword }: LoginPageProps) {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword]     = useState('');
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState('');
  const [showPass, setShowPass]     = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const session = await login(identifier, password);
      onLogin(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handlePaidDemoLogin() {
    setError('');
    setLoading(true);
    try {
      const session = await loginToPaidDemo();
      onLogin(session);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Paid demo login failed');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full h-[46px] border-[1.5px] border-slate-200 rounded-xl px-3.5 text-sm outline-none font-sans bg-white text-slate-900 focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] transition-all placeholder:text-slate-400";

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
      <div className="mb-8">
        <h1 className="text-[28px] font-black text-slate-900 tracking-[-0.8px] m-0 mb-1.5 font-sans">
          Sign in
        </h1>
        <p className="text-sm text-slate-500 m-0 font-sans">
          Don't have an account?{' '}
          <button type="button" onClick={onShowSignup} className="border-0 bg-transparent text-[#164BB7] font-bold cursor-pointer p-0 text-sm font-sans hover:underline">Create one free</button>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-0">
        {/* Email */}
        <FieldBlock label="Email or phone">
          <input
            type="text"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            placeholder="you@company.com"
            autoComplete="username"
            required
            className={inputClass}
          />
        </FieldBlock>

        {/* Password */}
        <FieldBlock label="Password">
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
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

        {/* Forgot */}
        {onForgotPassword && (
          <div className="flex justify-end -mt-1.5 mb-2">
            <button type="button" onClick={onForgotPassword} className="border-0 bg-transparent text-[#164BB7] font-bold cursor-pointer p-0 text-[13px] font-sans hover:underline">
              Forgot password?
            </button>
          </div>
        )}

        {error && <ErrorBanner msg={error} />}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 border-none rounded-[11px] bg-gradient-to-r from-[#081C45] to-[#0E2F73] text-white font-bold text-[15px] cursor-pointer font-sans tracking-[-0.2px] shadow-[0_4px_20px_rgba(8,28,69,0.35)] hover:shadow-[0_6px_24px_rgba(8,28,69,0.45)] hover:opacity-95 active:scale-[0.99] transition-all mt-2 disabled:opacity-75"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Signing in…
            </span>
          ) : 'Sign in →'}
        </button>
      </form>

      {import.meta.env.DEV ? (
        <button
          type="button"
          onClick={handlePaidDemoLogin}
          disabled={loading}
          className="mt-4 h-12 w-full rounded-[11px] border-2 border-[#081C45] bg-[#FFC60A] text-[15px] font-bold text-[#081C45] shadow-[0_4px_0_#081C45] transition-all hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60"
        >
          {loading ? 'Opening paid dashboard…' : 'Open paid demo dashboard →'}
        </button>
      ) : null}

      {/* Divider */}
      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px bg-slate-200" />
        <span className="text-xs text-slate-400 font-sans">OR</span>
        <div className="flex-1 h-px bg-slate-200" />
      </div>

      {/* Sign up CTA */}
      <button type="button" onClick={onShowSignup} className="w-full h-[46px] border border-slate-200 rounded-xl bg-white text-slate-700 font-semibold text-sm cursor-pointer font-sans transition-all hover:bg-slate-50 hover:border-slate-350 active:scale-[0.99]">
        Create a free account
      </button>
    </AuthSplitLayout>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 font-sans">
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
      <span className="text-[13px] text-red-800 font-sans leading-relaxed">{msg}</span>
    </div>
  );
}

