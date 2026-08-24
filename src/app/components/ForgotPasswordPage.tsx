import { useState } from 'react';
import { forgotPassword } from '../services/auth';
import { AuthSplitLayout } from './AuthSplitLayout';

interface ForgotPasswordPageProps {
  onBack: () => void;
}

const panel = {
  badge: 'Secure account recovery',
  headline: (
    <>
      Regain access{' '}
      <span className="bg-gradient-to-r from-[#164BB7] to-[#FFC60A] bg-clip-text text-transparent font-black">
        in seconds.
      </span>
    </>
  ),
  bullets: [
    { icon: '🔐', text: 'Secure reset link sent directly to your inbox — valid for 60 minutes.' },
    { icon: '🛡️', text: 'SHA-256 token hashing means your reset link is safe even if email is intercepted.' },
    { icon: '✉️', text: 'No account? No problem — we never reveal whether an email is registered.' },
  ],
  quote: 'The support team is incredible. Reset took 30 seconds and my data was all there.',
  quoteAuthor: 'Priya Nair',
  quoteRole: 'Brand Manager · Lumio',
  accent: 'rgba(8,28,69,0.18)',
  accentColor: '#164BB7',
};

export function ForgotPasswordPage({ onBack }: ForgotPasswordPageProps) {
  const [email, setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);
  const [error, setError]     = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full h-[46px] border-[1.5px] border-slate-200 rounded-xl px-3.5 text-sm outline-none font-sans bg-white text-slate-900 focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] transition-all placeholder:text-slate-400";

  return (
    <AuthSplitLayout panel={panel}>
      {sent ? (
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#081C45]/10 border border-[#081C45]/25 flex items-center justify-center mx-auto mb-6 text-3xl">
            ✉️
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-[-0.6px] mb-2.5 font-sans">
            Check your inbox
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-8 font-sans">
            If <strong className="text-slate-700 font-semibold">{email}</strong> is registered, you'll receive a secure reset link within a few minutes.
          </p>
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-7 flex items-start gap-2.5">
            <span className="text-base">💡</span>
            <span className="text-[13px] text-slate-500 leading-relaxed font-sans text-left">
              Check your spam folder if you don't see it within 5 minutes.
            </span>
          </div>
          <button type="button" onClick={onBack} className="w-full h-12 border-none rounded-[11px] bg-gradient-to-r from-[#081C45] to-[#0E2F73] text-white font-bold text-[15px] cursor-pointer font-sans tracking-[-0.2px] shadow-[0_4px_20px_rgba(8,28,69,0.35)] hover:shadow-[0_6px_24px_rgba(8,28,69,0.45)] hover:opacity-95 active:scale-[0.99] transition-all">
            Back to sign in
          </button>
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h1 className="text-[28px] font-black text-slate-900 tracking-[-0.8px] m-0 mb-1.5 font-sans">
              Reset password
            </h1>
            <p className="text-sm text-slate-500 m-0 font-sans">
              Enter your email and we'll send a reset link.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 font-sans">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
                className={inputClass}
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
                <span className="text-red-500 text-sm shrink-0">⚠</span>
                <span className="text-[13px] text-red-800 font-sans leading-relaxed">{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 border-none rounded-[11px] bg-gradient-to-r from-[#081C45] to-[#0E2F73] text-white font-bold text-[15px] cursor-pointer font-sans tracking-[-0.2px] shadow-[0_4px_20px_rgba(8,28,69,0.35)] hover:shadow-[0_6px_24px_rgba(8,28,69,0.45)] hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-75"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Sending…
                </span>
              ) : 'Send reset link →'}
            </button>
          </form>

          <button type="button" onClick={onBack} className="w-full h-[44px] border border-slate-200 rounded-xl bg-white text-slate-500 font-semibold text-sm cursor-pointer font-sans mt-4 hover:bg-slate-50 active:scale-[0.99] transition-all">
            ← Back to sign in
          </button>
        </>
      )}
    </AuthSplitLayout>
  );
}

