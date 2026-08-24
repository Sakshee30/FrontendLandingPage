import { useState } from 'react';
import { resetPassword } from '../services/auth';
import { AuthSplitLayout } from './AuthSplitLayout';

interface ResetPasswordPageProps {
  token: string;
  onBack: () => void;
  onSuccess: () => void;
}

const panel = {
  badge: "You're almost in",
  headline: (
    <>
      One last step to{' '}
      <span className="bg-gradient-to-r from-[#F4B400] to-[#164BB7] bg-clip-text text-transparent font-black">
        secure your account.
      </span>
    </>
  ),
  bullets: [
    { icon: '🔑', text: 'Choose a strong password with at least 8 characters and a mix of symbols.' },
    { icon: '✅', text: 'Your reset link is single-use — it expires immediately after you update.' },
    { icon: '🔔', text: 'A confirmation email is sent once your password is successfully changed.' },
  ],
  quote: 'The security features are fantastic. I feel completely in control of my account.',
  quoteAuthor: 'Alex Torres',
  quoteRole: 'Founder · Linkflow',
  accent: 'rgba(244,114,182,0.15)',
  accentColor: '#f472b6',
};

export function ResetPasswordPage({ token, onBack, onSuccess }: ResetPasswordPageProps) {
  const [password, setPassword]   = useState('');
  const [confirm, setConfirm]     = useState('');
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [done, setDone]           = useState(false);
  const [showPass, setShowPass]   = useState(false);
  const [showConf, setShowConf]   = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    if (password !== confirm) { setError('Passwords do not match'); return; }
    if (password.length < 8)  { setError('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      await resetPassword(token, password);
      setDone(true);
      setTimeout(onSuccess, 2800);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  const inputClass = "w-full h-[46px] border-[1.5px] border-slate-200 rounded-xl px-3.5 text-sm outline-none font-sans bg-white text-slate-900 focus:ring-2 focus:ring-[#081C45]/20 focus:border-[#081C45] transition-all placeholder:text-slate-400";

  if (!token) {
    return (
      <AuthSplitLayout panel={panel}>
        <div className="text-center">
          <div className="text-5xl mb-5">⚠️</div>
          <h2 className="text-2xl font-black text-slate-900 mb-3 font-sans">
            Invalid reset link
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-7 font-sans">
            This link is missing a token. Please request a new password reset.
          </p>
          <button type="button" onClick={onBack} className="w-full h-12 border-none rounded-[11px] bg-gradient-to-r from-[#081C45] to-[#0E2F73] text-white font-bold text-[15px] cursor-pointer font-sans tracking-[-0.2px] shadow-[0_4px_20px_rgba(8,28,69,0.35)] hover:shadow-[0_6px_24px_rgba(8,28,69,0.45)] hover:opacity-95 active:scale-[0.99] transition-all">
            Request new link
          </button>
        </div>
      </AuthSplitLayout>
    );
  }

  if (done) {
    return (
      <AuthSplitLayout panel={panel}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center mx-auto mb-6 text-3xl">
            ✅
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-[-0.6px] mb-2.5 font-sans">
            Password updated!
          </h2>
          <p className="text-sm text-slate-500 leading-relaxed mb-4 font-sans">
            Your password has been changed. Redirecting you to sign in…
          </p>
          <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
            <div
              style={{
                animation: 'progress 2.8s linear forwards',
              }}
              className="h-full bg-gradient-to-r from-[#081C45] to-[#164BB7]"
            />
          </div>
        </div>
        <style>{`@keyframes progress { from { width: 0% } to { width: 100% } }`}</style>
      </AuthSplitLayout>
    );
  }

  const strength = password.length === 0 ? 0 : password.length < 8 ? 1 : password.length < 12 ? 2 : 3;
  const strengthLabel = ['', 'Weak', 'Good', 'Strong'][strength];
  const strengthColor = ['', '#ef4444', '#F4B400', '#10b981'][strength];

  return (
    <AuthSplitLayout panel={panel}>
      <div className="mb-8">
        <h1 className="text-[28px] font-black text-slate-900 tracking-[-0.8px] m-0 mb-1.5 font-sans">
          Set new password
        </h1>
        <p className="text-sm text-slate-500 m-0 font-sans">
          Choose something strong that you haven't used before.
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        {/* New password */}
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 font-sans">New password</label>
          <div className="relative">
            <input
              type={showPass ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 8 characters"
              autoComplete="new-password"
              required
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowPass((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 text-xs font-semibold p-0"
            >
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>
          {password.length > 0 && (
            <div className="mt-2">
              <div className="flex gap-1">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    style={{
                      background: i <= strength ? strengthColor : '#e2e8f0',
                    }}
                    className="flex-1 h-[3px] rounded-full transition-all duration-200"
                  />
                ))}
              </div>
              <span style={{ color: strengthColor }} className="text-[11px] font-semibold font-sans mt-1 block">
                {strengthLabel}
              </span>
            </div>
          )}
        </div>

        {/* Confirm password */}
        <div className="mb-4">
          <label className="block text-[13px] font-semibold text-slate-700 mb-1.5 font-sans">Confirm password</label>
          <div className="relative">
            <input
              type={showConf ? 'text' : 'password'}
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Repeat password"
              autoComplete="new-password"
              required
              style={{
                borderColor: confirm && confirm !== password ? '#fca5a5' : undefined,
              }}
              className={`${inputClass} pr-12`}
            />
            <button
              type="button"
              onClick={() => setShowConf((p) => !p)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer text-slate-400 text-xs font-semibold p-0"
            >
              {showConf ? 'Hide' : 'Show'}
            </button>
          </div>
          {confirm && confirm !== password && (
            <span className="text-xs text-red-500 mt-1 block font-sans">
              Passwords don't match
            </span>
          )}
        </div>

        {error && (
          <div className="flex items-start gap-2.5 bg-red-50 border border-red-200 rounded-xl p-3 mb-4">
            <span className="text-red-500 text-sm shrink-0">⚠</span>
            <span className="text-[13px] text-red-800 font-sans leading-relaxed">{error}</span>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || (!!confirm && confirm !== password)}
          className="w-full h-12 border-none rounded-[11px] bg-gradient-to-r from-[#081C45] to-[#0E2F73] text-white font-bold text-[15px] cursor-pointer font-sans tracking-[-0.2px] shadow-[0_4px_20px_rgba(8,28,69,0.35)] hover:shadow-[0_6px_24px_rgba(8,28,69,0.45)] hover:opacity-95 active:scale-[0.99] transition-all disabled:opacity-75"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin inline-block" /> Updating…
            </span>
          ) : 'Update password →'}
        </button>
      </form>

      <button type="button" onClick={onBack} className="w-full h-[44px] border border-slate-200 rounded-xl bg-white text-slate-500 font-semibold text-sm cursor-pointer font-sans mt-4 hover:bg-slate-50 active:scale-[0.99] transition-all">
        ← Back to sign in
      </button>
    </AuthSplitLayout>
  );
}

