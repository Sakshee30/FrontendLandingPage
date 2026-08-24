import type { FigmaAsset } from './types';

export const figmaAssets = {
  logo: {
    local: '/figma-assets/ziplin-logo.png',
    remote: 'https://www.figma.com/api/mcp/asset/1beb2cac-1272-4cef-847a-69811c3fb5d3.png',
    alt: 'Ziplin logo',
  },
  featureMascot: {
    local: '/figma-assets/feature-mascot.png',
    remote: 'https://www.figma.com/api/mcp/asset/210fa128-17d5-4e5b-895b-46ea1bc67a36.png',
    alt: 'Ziplin mascot breaking a chain',
  },
  solutionMascot: {
    local: '/figma-assets/solution-mascot.png',
    remote: 'https://www.figma.com/api/mcp/asset/a6ee9dda-b8cc-414f-bf52-ec307e9f0171.png',
    alt: 'Ziplin mascot taking a selfie',
  },
  pricingMascot: {
    local: '/figma-assets/pricing-mascot.png',
    remote: 'https://www.figma.com/api/mcp/asset/0f28a28a-93e7-4365-a366-ad22ce4b2ea4.png',
    alt: 'Ziplin mascot next to a pricing board',
  },
  aboutMascots: {
    local: '/figma-assets/about-mascots.png',
    remote: 'https://www.figma.com/api/mcp/asset/876d1569-dfb3-48ca-8b6a-102728cb3e57',
    alt: 'Two Ziplin mascots high-fiving',
  },
  contactMascot: {
    local: '/figma-assets/contact-mascot.png',
    remote: 'https://www.figma.com/api/mcp/asset/e634e6a6-56b6-4c5c-bd5f-f344ef1eb7b5',
    alt: 'Ziplin support mascot with phone and envelope',
  },
  helpMascot: {
    local: '/figma-assets/help-mascot.png',
    remote: 'https://www.figma.com/api/mcp/asset/a49cc27a-c438-4db7-bad0-48d7b388e4af',
    alt: 'Ziplin help center mascot',
  },
  footerChain: {
    local: '/figma-assets/footer-chain.png',
    remote: 'https://www.figma.com/api/mcp/asset/7f3998d4-4a4e-4ac5-b0cd-94d03c61764a.png',
    alt: '',
  },
  landingHeroReference: {
    local: '/figma-assets/landing-hero-reference.png',
    remote: 'https://www.figma.com/api/mcp/asset/7c9c29a5-08d6-4f2d-a2b9-5f2cef31bd02.png',
    alt: 'Figma landing hero visual reference',
  },
  featureReference: {
    local: '/figma-assets/feature-reference.png',
    remote: 'https://www.figma.com/api/mcp/asset/f5a1af8a-b420-4ef2-8beb-6d807a83ada0.png',
    alt: 'Figma URL shortener hero reference',
  },
  pricingReference: {
    local: '/figma-assets/pricing-reference.png',
    remote: 'https://www.figma.com/api/mcp/asset/91253e70-8b5c-4ab6-bdd2-112f8f432283.png',
    alt: 'Figma pricing card reference',
  },
} satisfies Record<string, FigmaAsset>;

export const featureMascotSources = {
  urlShortener: '/figma-assets/feature-url-shortener.png',
  qrBarcodeSheet: '/figma-assets/feature-qr-barcode-sheet.png',
  featureSheet: '/figma-assets/feature-mascot-sheet.png',
  fileSharing: '/figma-assets/feature-file-sharing-source.png',
  retargeting: '/figma-assets/feature-retargeting-source.png',
} as const;

export const solutionMascotSources = {
  'affiliate-marketing': '/figma-assets/solution-affiliate-mascot.png',
  'content-creators': '/figma-assets/solution-content-mascot.png',
  influencers: '/figma-assets/solution-influencer-mascot.png',
  'media-entertainment': '/figma-assets/solution-media-mascot.png',
  ecommerce: '/figma-assets/solution-ecommerce-mascot.png',
  'digital-marketing': '/figma-assets/solution-agency-mascot.png',
} as const;

export const resourceMascotSources = {
  about: '/figma-assets/about-hero-mascot.png',
  contact: '/figma-assets/contact-hero-mascot.png',
  help: '/figma-assets/help-hero-mascot-hq.png',
} as const;

export type FigmaAssetKey = keyof typeof figmaAssets;
