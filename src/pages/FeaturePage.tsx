import { Navigate, useParams } from 'react-router-dom';
import { featureBySlug } from '@/data/features';
import { PageTransition } from '@/components/ui/PageTransition';
import { FeatureHero } from '@/components/sections/FeatureHero';
import { FeatureRoadmap, FeatureBenefits } from '@/components/sections/FeatureRoadmap';
import { AnalyticsDashboard } from '@/components/sections/AnalyticsDashboard';
import { FaqSection } from '@/components/sections/FaqSection';
import { Testimonials } from '@/components/sections/Testimonials';
import { CtaSection } from '@/components/sections/CtaSection';
import { SiteFooter } from '@/components/layout/SiteFooter';

const featureSlugAliases: Record<string, string> = {
  'link-management': 'url-shortener',
  'dynamic-qr-codes': 'qr-code-generator',
  'smart-bio-pages': 'bio-pages',
  'pixel-retargeting': 'retargeting',
};

export function FeaturePage() {
  const { slug } = useParams();
  const resolvedSlug = slug ? featureSlugAliases[slug] ?? slug : undefined;
  const feature = resolvedSlug ? featureBySlug[resolvedSlug] : undefined;
  if (!feature) return <Navigate to="/" replace />;
  return (
    <PageTransition>
      <FeatureHero feature={feature} />
      <FeatureRoadmap feature={feature} />
      <AnalyticsDashboard metrics={feature.metrics} title={feature.slug === 'url-shortener' ? 'Analytics Overview' : `${feature.name} performance`} />
      <FeatureBenefits feature={feature} />
      <FaqSection items={feature.faqs} />
      <Testimonials />
      <CtaSection />
      <SiteFooter />
    </PageTransition>
  );
}
