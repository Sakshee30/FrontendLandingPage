export type BlogPost = {
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  author: string;
  role: string;
  date: string;
  readTime: string;
  body?: string;
  seo?: {
    title?: string;
    description?: string;
    canonical?: string;
    primaryKeyword?: string;
    secondaryKeywords?: string[];
    robotsIndex?: boolean;
    socialImage?: string;
    structuredDataType?: string;
  };
  publishedAt?: string;
  modifiedAt?: string;
};

export const blogPosts: BlogPost[] = [
  {
    slug: 'how-to-safely-transfer-gigabyte-sized-files',
    category: 'SECURITY & TRUST',
    title: 'How to safely transfer gigabyte-sized files without losing clients’ trust',
    excerpt: 'A practical guide to secure large-file delivery, branded access, retention controls, and download analytics.',
    author: 'Zoe Harrington, CTO',
    role: 'Writer & Operator',
    date: 'October 12, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'branded-links-that-people-trust',
    category: 'LINK MANAGEMENT',
    title: 'Why branded links earn more trust than anonymous short URLs',
    excerpt: 'How recognizable domains, social previews, and transparent destinations improve click confidence.',
    author: 'Aarav Mehta',
    role: 'Growth Lead',
    date: 'October 8, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'utm-governance-for-growing-teams',
    category: 'ATTRIBUTION',
    title: 'UTM governance for growing marketing teams',
    excerpt: 'A repeatable naming system that keeps campaign attribution clean across channels and collaborators.',
    author: 'Naina Kapoor',
    role: 'Product Marketing',
    date: 'September 29, 2026',
    readTime: '7 min read',
  },
  {
    slug: 'dynamic-qr-code-playbook',
    category: 'QR CODES',
    title: 'The dynamic QR code playbook for offline-to-online campaigns',
    excerpt: 'Design, placement, editing, analytics, and security recommendations for high-performing QR experiences.',
    author: 'Rohan Das',
    role: 'Solutions Architect',
    date: 'September 20, 2026',
    readTime: '8 min read',
  },
  {
    slug: 'link-in-bio-conversion-design',
    category: 'BIO PAGES',
    title: 'Design a link-in-bio page that converts without feeling crowded',
    excerpt: 'A block-by-block framework for hierarchy, proof, calls to action, products, and social destinations.',
    author: 'Maya Singh',
    role: 'Design Lead',
    date: 'September 14, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'retargeting-without-site-changes',
    category: 'RETARGETING',
    title: 'Build retargeting audiences without changing destination websites',
    excerpt: 'How redirect-level pixels can preserve destination performance while adding measurable audience signals.',
    author: 'Kabir Rao',
    role: 'Performance Marketing',
    date: 'September 2, 2026',
    readTime: '5 min read',
  },
];
