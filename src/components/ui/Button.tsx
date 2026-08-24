import clsx from 'clsx';
import { ArrowUpRight } from 'lucide-react';
import { Link, type LinkProps } from 'react-router-dom';
import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Shared = {
  children: ReactNode;
  variant?: 'yellow' | 'navy' | 'outline' | 'glass' | 'white';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  withArrow?: boolean;
};

const classes = ({ variant = 'yellow', size = 'md', className }: Shared) =>
  clsx(
    'inline-flex items-center justify-center gap-2 rounded-[6px] font-body transition duration-300 ease-out focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
    {
      'bg-ziplin-yellow text-ziplin-blue hover:-translate-y-0.5 hover:bg-ziplin-sun': variant === 'yellow',
      'bg-ziplin-blue text-white hover:-translate-y-0.5 hover:bg-ziplin-navy': variant === 'navy',
      'border border-ziplin-blue bg-transparent text-ziplin-blue hover:-translate-y-0.5 hover:bg-ziplin-blue hover:text-white': variant === 'outline',
      'border border-white/20 bg-white/10 text-white backdrop-blur hover:bg-white/20': variant === 'glass',
      'border-2 border-[#0a0e1a] bg-white text-ziplin-blue shadow-[5px_5px_0_#0a0e1a] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[3px_3px_0_#0a0e1a]': variant === 'white',
      'px-4 py-2 text-sm': size === 'sm',
      'px-6 py-3 text-base sm:text-lg': size === 'md',
      'min-h-[52px] px-8 py-3.5 text-lg sm:text-xl': size === 'lg',
    },
    className,
  );

export function Button({ children, variant, size, className, withArrow, ...props }: Shared & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={classes({ children, variant, size, className })}>
      {children}
      {withArrow ? <ArrowUpRight className="size-4" aria-hidden="true" /> : null}
    </button>
  );
}

export function ButtonLink({ children, variant, size, className, withArrow, ...props }: Shared & LinkProps) {
  return (
    <Link {...props} className={classes({ children, variant, size, className })}>
      {children}
      {withArrow ? <ArrowUpRight className="size-4" aria-hidden="true" /> : null}
    </Link>
  );
}
