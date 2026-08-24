import { Link2Off } from 'lucide-react';
import { PageTransition } from '@/components/ui/PageTransition';
import { ButtonLink } from '@/components/ui/Button';
import { SiteFooter } from '@/components/layout/SiteFooter';

export function NotFoundPage(){return <PageTransition><section className="figma-grid flex min-h-[650px] items-center justify-center px-5 py-20 text-center"><div><span className="mx-auto flex size-24 items-center justify-center rounded-[24px] bg-[#fff3c3] text-ziplin-yellow"><Link2Off className="size-12"/></span><h1 className="mt-8 font-display text-6xl">404</h1><p className="mt-4 text-xl text-[#66718a]">This link did not resolve to a Ziplin page.</p><ButtonLink to="/" className="mt-7">Return home</ButtonLink></div></section><SiteFooter/></PageTransition>}
