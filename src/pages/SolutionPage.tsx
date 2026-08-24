import { Navigate, useParams } from 'react-router-dom';
import { solutionBySlug } from '@/data/solutions';
import { PageTransition } from '@/components/ui/PageTransition';
import { SolutionHero, SolutionUseCases, WorkflowSection } from '@/components/sections/SolutionSections';
import { Testimonials } from '@/components/sections/Testimonials';
import { CtaSection } from '@/components/sections/CtaSection';
import { SiteFooter } from '@/components/layout/SiteFooter';

export function SolutionPage() {
  const { slug } = useParams();
  const solution = slug ? solutionBySlug[slug] : undefined;
  if (!solution) return <Navigate to="/" replace />;
  return (
    <PageTransition>
      <SolutionHero solution={solution} />
      <SolutionUseCases solution={solution} />
      <WorkflowSection solution={solution} />
      <Testimonials />
      <CtaSection />
      <SiteFooter />
    </PageTransition>
  );
}
