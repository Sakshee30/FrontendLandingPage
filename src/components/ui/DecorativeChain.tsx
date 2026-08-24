import clsx from 'clsx';

export function DecorativeChain({ className, opacity = 0.06 }: { className?: string; opacity?: number }) {
  return (
    <div aria-hidden="true" className={clsx('pointer-events-none absolute select-none font-display text-[14rem] leading-none text-ziplin-blue sm:text-[20rem]', className)} style={{ opacity }}>
      ∞
    </div>
  );
}
