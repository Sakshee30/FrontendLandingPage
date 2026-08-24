import { PageTransition } from '@/components/ui/PageTransition';
import { PricingHero, PricingCards, PricingComparison } from '@/components/sections/PricingSections';
import { FaqSection } from '@/components/sections/FaqSection';
import { CtaSection } from '@/components/sections/CtaSection';
import { SiteFooter } from '@/components/layout/SiteFooter';

const faqs = [
  { question: 'Are there hidden redirection limits on the Pro plan?', answer: 'No. Pro includes unlimited shortened links and redirects under the fair-use and security controls described in the service terms.' },
  { question: 'Can I upgrade or downgrade my plan at any time?', answer: 'Yes. Workspace owners can change plans as requirements evolve. Billing adjustments are shown before confirmation.' },
  { question: 'Do branded custom domains require SSL configuration?', answer: 'Ziplin automates certificate provisioning for connected domains after DNS verification, so secure HTTPS redirection remains simple.' },
  { question: 'Is there a free plan for testing the product?', answer: 'Yes. Starter includes core shortened-link capabilities and basic reporting so you can validate your workflow before upgrading.' },
];

export function PricingPage() {
  return <PageTransition><PricingHero /><PricingCards /><PricingComparison /><FaqSection items={faqs} /><CtaSection /><SiteFooter /></PageTransition>;
}
