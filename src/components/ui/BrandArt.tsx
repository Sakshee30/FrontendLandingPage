import clsx from 'clsx';
import type { FigmaAsset } from '@/data/types';
import { FigmaAssetImage } from '@/components/ui/FigmaAsset';

export function BrandLogo({ className }: { className?: string }) {
  return (
    <span className={clsx('inline-flex h-[44px] w-[151px] items-center', className)}>
      <img
        src="/figma-assets/logo.png"
        alt="Ziplin — links. tracked."
        className="h-[44px] w-[151px] object-contain"
      />
    </span>
  );
}

export function MascotFallback({ className, pose = 'wave' }: { className?: string; pose?: 'wave' | 'point' | 'phone' | 'support' }) {
  return (
    <svg
      viewBox="0 0 460 560"
      role="img"
      aria-label="Ziplin chain mascot"
      className={clsx('h-full w-full overflow-visible drop-shadow-[0_20px_30px_rgba(8,28,69,.18)]', className)}
    >
      <defs>
        <linearGradient id="z-yellow" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#ffe66a" />
          <stop offset=".55" stopColor="#ffc60a" />
          <stop offset="1" stopColor="#e9a800" />
        </linearGradient>
        <linearGradient id="z-blue" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor="#164bb7" />
          <stop offset=".55" stopColor="#081c45" />
          <stop offset="1" stopColor="#001845" />
        </linearGradient>
        <filter id="z-shadow" x="-30%" y="-30%" width="160%" height="180%">
          <feDropShadow dx="0" dy="14" stdDeviation="10" floodColor="#001845" floodOpacity=".24" />
        </filter>
      </defs>

      <ellipse cx="230" cy="530" rx="130" ry="18" fill="#0e2f73" opacity=".13" />
      <g filter="url(#z-shadow)">
        <rect x="128" y="28" width="204" height="445" rx="102" fill="url(#z-blue)" />
        <rect x="174" y="78" width="112" height="345" rx="56" fill="#f9fbff" />
        <rect x="145" y="122" width="170" height="294" rx="85" fill="url(#z-yellow)" stroke="#e6a500" strokeWidth="4" />
        <rect x="190" y="184" width="80" height="168" rx="40" fill="#fff9da" opacity=".95" />
      </g>

      <g>
        <ellipse cx="194" cy="190" rx="29" ry="38" fill="#fff" stroke="#0a0e1a" strokeWidth="3" />
        <ellipse cx="266" cy="190" rx="29" ry="38" fill="#fff" stroke="#0a0e1a" strokeWidth="3" />
        <ellipse cx="202" cy="198" rx="12" ry="18" fill="#001845" />
        <ellipse cx="258" cy="198" rx="12" ry="18" fill="#001845" />
        <circle cx="206" cy="191" r="4.5" fill="#fff" />
        <circle cx="262" cy="191" r="4.5" fill="#fff" />
        <path d="M177 149q17-15 35-3" fill="none" stroke="#081c45" strokeLinecap="round" strokeWidth="9" />
        <path d="M248 146q19-12 36 4" fill="none" stroke="#081c45" strokeLinecap="round" strokeWidth="9" />
        <path d="M183 251q47 55 94 0c-1 78-92 80-94 0Z" fill="#fff" stroke="#0a0e1a" strokeLinejoin="round" strokeWidth="4" />
        <path d="M202 294q28-20 57 0" fill="#ff719c" />
      </g>

      <g fill="none" stroke="url(#z-blue)" strokeLinecap="round" strokeWidth="24">
        <path d={pose === 'point' ? 'M151 263Q78 240 61 176' : pose === 'phone' || pose === 'support' ? 'M151 263Q97 232 83 159' : 'M151 263Q82 234 64 160'} />
        <path d={pose === 'point' ? 'M310 264Q372 238 403 186' : pose === 'phone' || pose === 'support' ? 'M310 264Q365 282 394 235' : 'M310 264Q373 230 392 155'} />
        <path d="M188 406Q166 459 146 490" />
        <path d="M272 406Q293 459 313 490" />
      </g>
      <g fill="url(#z-yellow)" stroke="#e0a300" strokeWidth="3">
        <circle cx="62" cy={pose === 'point' ? 172 : pose === 'phone' || pose === 'support' ? 155 : 154} r="24" />
        <circle cx="397" cy={pose === 'point' ? 182 : pose === 'phone' || pose === 'support' ? 231 : 151} r="24" />
      </g>
      {pose === 'point' ? <path d="M405 179l34-16" stroke="#081c45" strokeLinecap="round" strokeWidth="8" /> : null}
      {pose === 'phone' || pose === 'support' ? (
        <g transform="translate(35 80) rotate(-13)">
          <rect x="0" y="0" width="59" height="102" rx="13" fill="#6351ce" stroke="#32217f" strokeWidth="5" />
          <rect x="9" y="10" width="41" height="70" rx="6" fill="#ece9ff" />
          <circle cx="29" cy="90" r="5" fill="#fff" />
        </g>
      ) : null}
      <g>
        <path d="M116 490q41-13 65 5l-5 34H98q0-26 18-39Z" fill="url(#z-blue)" stroke="#ffc60a" strokeWidth="8" />
        <path d="M279 495q24-18 65-5 18 13 18 39h-78Z" fill="url(#z-blue)" stroke="#ffc60a" strokeWidth="8" />
        <path d="M111 512h66M285 512h66" stroke="#fff" strokeLinecap="round" strokeWidth="6" />
      </g>
    </svg>
  );
}

export function MascotAsset({ asset, className, pose = 'wave' }: { asset: FigmaAsset; className?: string; pose?: 'wave' | 'point' | 'phone' | 'support' }) {
  return (
    <div className={clsx('relative', className)}>
      <FigmaAssetImage
        asset={asset}
        className="h-full w-full object-contain"
        fallback={<MascotFallback className="h-full w-full" pose={pose} />}
      />
    </div>
  );
}
