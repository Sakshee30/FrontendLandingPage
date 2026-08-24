import clsx from 'clsx';

export function SectionEyebrow({ children, className }: { children: string; className?: string }) {
  return <span className={clsx('eyebrow-pill uppercase', className)}>{children}</span>;
}
