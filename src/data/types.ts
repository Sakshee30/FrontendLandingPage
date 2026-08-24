export type FigmaAsset = {
  local: string;
  remote: string;
  alt: string;
};

export type FeatureCard = {
  title: string;
  description: string;
  tone: 'cream' | 'lilac' | 'mint';
};

export type FaqItem = {
  question: string;
  answer: string;
};

export type FeatureDefinition = {
  slug: string;
  route: string;
  name: string;
  eyebrow: string;
  headline: string;
  accent: string;
  description: string;
  primaryCta: string;
  demoKind: 'shortener' | 'qr' | 'barcode' | 'bio' | 'utm' | 'files' | 'campaign' | 'webhook' | 'retargeting';
  featureHeading: string;
  featureIntro: string;
  cards: FeatureCard[];
  metrics: { label: string; value: string }[];
  faqs: FaqItem[];
};

export type SolutionDefinition = {
  slug: string;
  route: string;
  name: string;
  eyebrow: string;
  headline: string;
  accent: string;
  description: string;
  sectionHeading: string;
  sectionSubheading: string;
  useCases: {
    label: string;
    title: string;
    bullets: string[];
  }[];
  workflow: {
    title: string;
    description: string;
  }[];
};
