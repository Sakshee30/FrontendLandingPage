import { motion, type HTMLMotionProps } from 'framer-motion';
import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
  delay?: number;
  distance?: number;
  once?: boolean;
  className?: string;
} & Omit<HTMLMotionProps<'div'>, 'children'>;

export function Reveal({ children, delay = 0, distance = 38, once = true, className, ...rest }: Props) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: distance }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.18 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1], delay }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
