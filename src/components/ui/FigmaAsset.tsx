import { useState, type ImgHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';
import type { FigmaAsset } from '@/data/types';

type Props = Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> & {
  asset: FigmaAsset;
  fallbackClassName?: string;
  fallback?: ReactNode;
};

export function FigmaAssetImage({ asset, className, fallbackClassName, fallback, ...props }: Props) {
  const [source, setSource] = useState(asset.local);
  const [failed, setFailed] = useState(false);

  if (failed) {
    if (fallback) {
      return <>{fallback}</>;
    }
    return (
      <div
        aria-label={asset.alt || undefined}
        role={asset.alt ? 'img' : undefined}
        className={clsx('asset-placeholder relative overflow-hidden', fallbackClassName, className)}
      >
        <div className="absolute inset-0 flex items-center justify-center font-display text-6xl text-white/70">∞</div>
      </div>
    );
  }

  return (
    <img
      {...props}
      src={source}
      alt={asset.alt}
      className={className}
      onError={(event) => {
        props.onError?.(event);
        if (source !== asset.remote) {
          setSource(asset.remote);
        } else {
          setFailed(true);
        }
      }}
    />
  );
}
