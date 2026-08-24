import type { SolutionDefinition } from './types';

export const solutionDefinitions: SolutionDefinition[] = [
  {
    slug: 'affiliate-marketing', route: '/solutions/affiliate-marketing', name: 'Affiliate Marketing', eyebrow: 'AFFILIATE MARKETING',
    headline: 'Unlock the Value,', accent: 'Behind Every Click',
    description: 'Create branded affiliate links, monitor campaign performance, and optimize conversions with real-time insights.',
    sectionHeading: 'Transform the Way You Manage Links', sectionSubheading: 'Grow Your Affiliate Business with Smarter Digital Experiences',
    useCases: [
      { label: 'LINK SHORTENER', title: 'Grow your affiliate earnings with smart branded links.', bullets: ['Promote offers with trusted, customizable short links.', 'Send visitors directly to the right product or promotional page.', 'Measure campaign performance and conversions.'] },
      { label: 'QR CODE', title: 'Boost affiliate revenue with smart QR Codes.', bullets: ['Guide audiences to affiliate offers and exclusive deals.', 'Add branded QR codes to every campaign.', 'Monitor scan activity in real time.'] },
      { label: 'LINK IN BIO', title: 'Build a branded destination for every affiliate campaign.', bullets: ['Feature highest-converting offers and product reviews.', 'Analyze audience behavior and conversion paths.', 'Update every campaign from one page.'] },
    ],
    workflow: [{ title: 'Create', description: 'Generate branded short links in seconds.' }, { title: 'Customize', description: 'Add domains, aliases, and campaign parameters.' }, { title: 'Analyze', description: 'Understand clicks, conversions, and revenue.' }, { title: 'Optimize', description: 'Improve performance with data and experiments.' }],
  },
  {
    slug: 'content-creators', route: '/solutions/content-creators', name: 'Content Creators', eyebrow: 'INFLUENCER',
    headline: 'Understand Your Audience.', accent: 'Grow Your Influence',
    description: 'Create branded links, track audience engagement, and optimize your content and collaborations with real-time insights.',
    sectionHeading: 'Share your content. grow your audience.', sectionSubheading: 'Take Your Content Further With Smarter Digital Experiences',
    useCases: [
      { label: 'LINK SHORTENER', title: 'Create links that grow your creator brand', bullets: ['Share clean branded links across every platform.', 'Direct followers to videos, newsletters, products, and exclusive content.', 'Track what your audience engages with.'] },
      { label: 'QR CODE', title: 'Turn every scan into a new experience', bullets: ['Add codes to videos, social posts, merchandise, and events.', 'Give instant access to exclusive content and creator updates.', 'Measure scans and audience response.'] },
      { label: 'LINK IN BIO', title: 'Bring all your content together', bullets: ['Collect profiles, posts, products, and collaborations.', 'Give your audience one simple destination.', 'Customize the experience to match your creator brand.'] },
    ],
    workflow: [{ title: 'Create', description: 'Create branded links in seconds.' }, { title: 'Customize', description: 'Make every touchpoint feel like your brand.' }, { title: 'Analyze', description: 'Understand what earns attention.' }, { title: 'Optimize', description: 'Turn insights into better content.' }],
  },
  {
    slug: 'influencers', route: '/solutions/influencers', name: 'Influencers', eyebrow: 'INFLUENCER',
    headline: 'Make Every Click Count', accent: 'for Your Content',
    description: 'Create branded links for your content, track audience engagement, and use real-time insights to optimize your content and grow your reach.',
    sectionHeading: 'Manage every link behind your influence', sectionSubheading: 'Grow Your Influence With Smarter Digital Experiences',
    useCases: [
      { label: 'LINK SHORTENER', title: 'Create branded links that grow your influence', bullets: ['Share memorable links to profiles and collaborations.', 'Drive followers to affiliate products or exclusive content.', 'Keep every share recognizable.'] },
      { label: 'QR CODE', title: 'Turn every scan into an opportunity', bullets: ['Connect followers to campaigns and promotions.', 'Send audiences to giveaways, offers, and products.', 'Track scans and engagement.'] },
      { label: 'LINK IN BIO', title: 'Turn your Link-in-Bio into your influencer hub', bullets: ['Collect profiles, collaborations, affiliate links, and products.', 'Give followers one destination.', 'See which content and campaigns get attention.'] },
    ],
    workflow: [{ title: 'Create', description: 'Create branded links in seconds.' }, { title: 'Customize', description: 'Make every link your own.' }, { title: 'Analyze', description: 'See what your audience loves.' }, { title: 'Optimize', description: 'Turn clicks into growth.' }],
  },
  {
    slug: 'media-entertainment', route: '/solutions/media-entertainment', name: 'Media & Entertainment', eyebrow: 'MEDIA AND ENTERTAINTMENT',
    headline: 'Turn Every Viewer into', accent: 'an Engaged Community',
    description: 'Engage your audience across every channel with branded links, dynamic QR Codes, and powerful analytics that turn every interaction into lasting fan engagement.',
    sectionHeading: 'Transform the Way You Manage Links', sectionSubheading: 'Simplify Audience Engagement with Intelligent Media Tools',
    useCases: [
      { label: 'LINK SHORTENER', title: 'Create short links that keep audiences engaged.', bullets: ['Connect viewers to the latest content.', 'Guide fans to streaming, ticket, or exclusive experiences.', 'Measure every campaign.'] },
      { label: 'QR CODE', title: 'Bring your content to life with dynamic QR Codes.', bullets: ['Bridge broadcast, print, venues, and digital experiences.', 'Deliver exclusive content and support.', 'Analyze every scan.'] },
      { label: 'LINK IN BIO', title: 'Bring all your content together.', bullets: ['Create one destination for content and campaigns.', 'Gain audience insights.', 'Publish updates without friction.'] },
    ],
    workflow: [{ title: 'Design', description: 'Create a destination that reflects your brand.' }, { title: 'Publish', description: 'Share one smart link everywhere.' }, { title: 'Measure', description: 'Understand audience behavior.' }, { title: 'Grow', description: 'Turn audiences into customers and partners.' }],
  },
  {
    slug: 'ecommerce', route: '/solutions/ecommerce', name: 'E-commerce', eyebrow: 'AFFILIATE MARKETING',
    headline: 'Turn every viewer into a loyal fan with smarter', accent: 'digital experience',
    description: 'Engage your audience across every channel with branded links, dynamic QR Codes, and powerful analytics that turn every interaction into lasting fan engagement.',
    sectionHeading: 'Transform the Way You Manage Links', sectionSubheading: 'Empower Your Store with Smarter Digital Commerce',
    useCases: [
      { label: 'LINK SHORTENER', title: 'Drive more sales with smart branded links.', bullets: ['Promote products across every marketing channel.', 'Send shoppers to best-sellers, collections, and checkout.', 'Measure clicks, conversions, and ROI.'] },
      { label: 'QR CODE', title: 'Turn every scan into a shopping opportunity.', bullets: ['Connect packaging to details, tutorials, and reviews.', 'Drive flash sales and loyalty programs.', 'Track every scan.'] },
      { label: 'LINK IN BIO', title: 'Turn your bio into a powerful storefront.', bullets: ['Collect products, offers, and social channels.', 'Gain real-time customer insights.', 'Launch promotions without coding.'] },
    ],
    workflow: [{ title: 'Upload', description: 'Import products and links in a few clicks.' }, { title: 'Customize', description: 'Apply branded domains and short URLs.' }, { title: 'Measure', description: 'See engagement and conversion.' }, { title: 'Grow', description: 'Turn insight into higher sales.' }],
  },
  {
    slug: 'digital-marketing', route: '/solutions/digital-marketing', name: 'Digital Agencies', eyebrow: 'DIGITAL AGENCIES',
    headline: 'Simplify Agency Operations', accent: 'and Accelerate Client Growth',
    description: 'Create branded affiliate links, monitor campaign performance, and optimize conversions with real-time insights.',
    sectionHeading: 'Your Complete Growth Platform', sectionSubheading: 'Accelerate Agency Growth with Smarter Marketing Tools',
    useCases: [
      { label: 'LINK SHORTENER', title: 'Build client trust with branded short links.', bullets: ['Use custom domains across every campaign.', 'Share landing pages and client resources.', 'Improve click-through rates with recognizable URLs.'] },
      { label: 'QR CODE', title: 'Create interactive marketing experiences.', bullets: ['Bridge print and digital campaigns.', 'Connect audiences to current experiences.', 'Analyze every scan.'] },
      { label: 'LINK IN BIO', title: 'Create a landing page for every client campaign.', bullets: ['Showcase campaigns, portfolios, and resources.', 'Present services and consultation links.', 'Organize lead generation tools in one page.'] },
    ],
    workflow: [{ title: 'Create', description: 'Build branded links for every promotion.' }, { title: 'Monitor', description: 'Track every click and customer journey.' }, { title: 'Optimize', description: 'Improve campaign outcomes.' }, { title: 'Grow', description: 'Increase conversion with data.' }],
  },
];

export const solutionBySlug = Object.fromEntries(solutionDefinitions.map((solution) => [solution.slug, solution]));
