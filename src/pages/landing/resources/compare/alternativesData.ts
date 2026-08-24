export interface CompetitorData {
  id: string;
  name: string;
  tagline: string;
  heroSubtitle: string;
  features: {
    feature: string;
    ziplin: { val: string; ok: boolean };
    competitor: { val: string; ok: boolean };
  }[];
  benefits: {
    title: string;
    desc: string;
    iconName: string;
    color: string;
    bg: string;
    border: string;
  }[];
  migration: {
    step: string;
    desc: string;
    iconName: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
}

export const alternativesData: Record<string, CompetitorData> = {
  switchy: {
    id: "switchy",
    name: "Switchy",
    tagline: "Why brands choose Ziplin over Switchy",
    heroSubtitle: "Switchy is built for basic link curation, but Ziplin offers lower redirect latencies, infinite scaling, and robust developer APIs at a fraction of the cost.",
    features: [
      {
        feature: "Custom Branded Domains",
        ziplin: { val: "Unlimited domains on Pro ($9/mo)", ok: true },
        competitor: { val: "Limited to 2 on Team plan ($39/mo)", ok: false }
      },
      {
        feature: "Dynamic QR Codes",
        ziplin: { val: "Included (Custom vector shapes & logo embeds)", ok: true },
        competitor: { val: "Basic static generated formats only", ok: false }
      },
      {
        feature: "Retargeting Pixels",
        ziplin: { val: "Included on Pro ($9/mo)", ok: true },
        competitor: { val: "Subject to strict click limits on all plans", ok: false }
      },
      {
        feature: "Link-in-Bio Smart Pages",
        ziplin: { val: "Included (Custom dynamic bio profiles)", ok: true },
        competitor: { val: "Gated under templates with limited widgets", ok: false }
      },
      {
        feature: "Redirect Latency",
        ziplin: { val: "< 20ms (Global edge node distribution)", ok: true },
        competitor: { val: "~50ms (Standard cloud routing)", ok: false }
      },
      {
        feature: "Starting Price Point",
        ziplin: { val: "Free / Pro from $9/mo", ok: true },
        competitor: { val: "Starts from $39/mo (no free plan)", ok: false }
      }
    ],
    benefits: [
      {
        title: "Global Edge Network Redirects",
        desc: "Ziplin short links resolve at our closest edge location. This means redirects take less than 20ms, preventing user bounce rates and maximizing campaign page load efficiency.",
        iconName: "Globe",
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100"
      },
      {
        title: "Integrated Marketing Tools",
        desc: "Stop paying for multiple tools. Ziplin integrates standard link shortening, dynamic QR codes, UTM campaign builders, custom pixels, and bio pages under a single account.",
        iconName: "Zap",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
      },
      {
        title: "Developer-First Infrastructure",
        desc: "Access fully-featured REST APIs, send click events directly to webhooks, view trigger logs, and manage developer tokens without paying for high enterprise markups.",
        iconName: "Code2",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
      }
    ],
    migration: [
      {
        iconName: "FileSpreadsheet",
        step: "1. Export Switchy Data",
        desc: "Download your active short links directory from the Switchy dashboard in standard CSV format."
      },
      {
        iconName: "Settings",
        step: "2. Bulk Import to Ziplin",
        desc: "Upload the CSV inside Ziplin's importer. Slugs, destinations, and metadata map instantly."
      },
      {
        iconName: "Globe",
        step: "3. Point Branded Domains",
        desc: "Update your CNAME domain DNS settings to Ziplin. All traffic redirects with zero downtime."
      }
    ],
    faqs: [
      {
        question: "Will my active Switchy redirects break during migration?",
        answer: "No. Since you own your custom branded domain, you can keep all your short links functional by exporting them as a CSV from Switchy and uploading them directly to Ziplin before updating your domain DNS. Redirections will remain active with zero downtime."
      },
      {
        question: "Can I connect multiple custom domains on Ziplin?",
        answer: "Yes, absolutely! Ziplin allows you to connect custom domains on our Pro plan. You simply point the DNS settings to Ziplin, and we automatically provision SSL certificates for all your links."
      },
      {
        question: "How long does it take for DNS settings to propagate?",
        answer: "The import process itself takes less than 2 minutes. Once you point your CNAME record to Ziplin, domain verification typically propagates globally within 15 to 30 minutes."
      }
    ]
  },
  linktree: {
    id: "linktree",
    name: "Linktree",
    tagline: "Why brands choose Ziplin over Linktree",
    heroSubtitle: "Linktree popularized the link-in-bio, but Ziplin gives you full custom CSS control, native UTM tracking, retargeting pixels, and no forced platform branding.",
    features: [
      {
        feature: "Custom Branded Domains",
        ziplin: { val: "Unlimited custom domains on Pro ($9/mo)", ok: true },
        competitor: { val: "Requires Pro plan ($15/mo) or higher", ok: false }
      },
      {
        feature: "Link-in-Bio Themes",
        ziplin: { val: "Full design control, zero forced branding", ok: true },
        competitor: { val: "Forced Linktree logo on Free/Starter tiers", ok: false }
      },
      {
        feature: "Deep Analytics & UTMs",
        ziplin: { val: "Included automatically per button click", ok: true },
        competitor: { val: "Only basic click counts on Free tier", ok: false }
      },
      {
        feature: "Dynamic QR Codes",
        ziplin: { val: "Generate vector QR codes for your bio page", ok: true },
        competitor: { val: "Basic static QR code image export only", ok: false }
      },
      {
        feature: "Retargeting Pixels",
        ziplin: { val: "Included on Pro ($9/mo)", ok: true },
        competitor: { val: "Only on Pro ($15/mo) and Premium plans", ok: false }
      },
      {
        feature: "API & Webhooks Access",
        ziplin: { val: "Full REST developer access & webhooks", ok: true },
        competitor: { val: "No public developer API or webhooks available", ok: false }
      }
    ],
    benefits: [
      {
        title: "Total Branding Freedom",
        desc: "Remove all platform watermarks and host bios on your exact custom domains to build brand authority and trust.",
        iconName: "Globe",
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100"
      },
      {
        title: "Advanced UTM Tracker",
        desc: "Automatically tag every outbound redirect click from your bio pages. Trace conversions down to the specific link, button, or social post.",
        iconName: "Zap",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
      },
      {
        title: "Lightning Fast Bio Load",
        desc: "Optimized components, CSS styling, and media assets loaded from the closest global edge CDN nodes for instantaneous mobile rendering.",
        iconName: "Code2",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
      }
    ],
    migration: [
      {
        iconName: "FileSpreadsheet",
        step: "1. Gather Linktree Details",
        desc: "Copy your active bio button links and titles from your Linktree profile or import via Ziplin bulk tool."
      },
      {
        iconName: "Settings",
        step: "2. Design in Ziplin",
        desc: "Utilize our drag-and-drop bio builder. Select layout styles, background colors, and widgets."
      },
      {
        iconName: "Globe",
        step: "3. Update Social Profiles",
        desc: "Replace your old linktr.ee URL in your bio profiles with your new custom branded link."
      }
    ],
    faqs: [
      {
        question: "Is there a free plan for Linktree users?",
        answer: "Yes, Ziplin has a robust free plan for basic bio bios. You can set up links, choose basic styling, and track clicks without paying a cent."
      },
      {
        question: "Can I connect my own custom domain for bio pages?",
        answer: "Yes! You can connect your domain (e.g. bio.mybrand.com) directly on Ziplin's Pro tier to eliminate the platform's URL and own your traffic."
      },
      {
        question: "Does Ziplin support social links & contact forms on bio pages?",
        answer: "Absolutely. Ziplin offers responsive social icon rows, email newsletter integration, custom text widgets, and video embeds directly in your bio layouts."
      }
    ]
  },
  linko: {
    id: "linko",
    name: "Linko",
    tagline: "Why brands choose Ziplin over Linko",
    heroSubtitle: "Upgrade to a more stable, faster, and enterprise-grade link management system with advanced pixel tracking and global low-latency redirects.",
    features: [
      {
        feature: "Redirect Latency",
        ziplin: { val: "< 20ms global edge network", ok: true },
        competitor: { val: "~70ms standard cloud server routing", ok: false }
      },
      {
        feature: "Webhooks Integration",
        ziplin: { val: "Real-time trigger logs for all links", ok: true },
        competitor: { val: "Not supported on any plans", ok: false }
      },
      {
        feature: "Retargeting Pixels",
        ziplin: { val: "Fully supported (Meta, Google, LinkedIn)", ok: true },
        competitor: { val: "Gated/restricted limits on lower plans", ok: false }
      },
      {
        feature: "Bio Page Customization",
        ziplin: { val: "Advanced layouts with dynamic widgets", ok: true },
        competitor: { val: "Limits bio pages (e.g., 3 on Starter)", ok: false }
      },
      {
        feature: "Uptime SLA",
        ziplin: { val: "99.99% high-availability SLA", ok: true },
        competitor: { val: "No guaranteed uptime SLA structure", ok: false }
      },
      {
        feature: "Pricing Plan Tiers",
        ziplin: { val: "Free / Pro from $9/mo", ok: true },
        competitor: { val: "Starter is $12/mo, Pro is $29/mo", ok: false }
      }
    ],
    benefits: [
      {
        title: "Sub-20ms Redirects",
        desc: "Ensure your mobile audience is redirected instantly. Ziplin leverages global CDN routing to provide faster redirects than standard platforms.",
        iconName: "Globe",
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100"
      },
      {
        title: "Developer Integration",
        desc: "Send click logs to external databases instantly via webhook events or interact with links programmatically using our REST APIs.",
        iconName: "Zap",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
      },
      {
        title: "Guaranteed SLA",
        desc: "We ensure our link redirection infrastructure stays online 99.99% of the time, keeping your ad campaigns working around the clock.",
        iconName: "Code2",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
      }
    ],
    migration: [
      {
        iconName: "FileSpreadsheet",
        step: "1. Export Linko Directory",
        desc: "Obtain your short links database in CSV format directly from the Linko settings page."
      },
      {
        iconName: "Settings",
        step: "2. Bulk Upload to Ziplin",
        desc: "Import the CSV inside Ziplin. All destination URLs, analytics categories, and tags match instantly."
      },
      {
        iconName: "Globe",
        step: "3. Point DNS Settings",
        desc: "Configure your custom domain CNAME record to Ziplin's edge server to route links securely."
      }
    ],
    faqs: [
      {
        question: "Does Ziplin support bulk QR code generation?",
        answer: "Yes, you can generate dynamic QR codes in bulk via our API or UI. Every QR code maps to a tracking link that can be updated in real time."
      },
      {
        question: "Will my active redirects break?",
        answer: "DNS changes propagate in under 30 minutes. Setting up your links in Ziplin before updating DNS ensures a seamless transition with zero downtime."
      }
    ]
  },
  rebrandly: {
    id: "rebrandly",
    name: "Rebrandly",
    tagline: "Why brands choose Ziplin over Rebrandly",
    heroSubtitle: "Rebrandly charges high rates for custom domains. Ziplin provides unlimited custom domains, bio landing pages, and Webhooks integrations at a fraction of the cost.",
    features: [
      {
        feature: "Custom Branded Domains",
        ziplin: { val: "Unlimited domains on Pro ($9/mo)", ok: true },
        competitor: { val: "Gated to 1 on Essentials ($28/mo), 5 on Pro ($89/mo)", ok: false }
      },
      {
        feature: "Link-in-Bio Smart Pages",
        ziplin: { val: "Included (Full rich components)", ok: true },
        competitor: { val: "Not supported at all", ok: false }
      },
      {
        feature: "Dynamic QR Codes",
        ziplin: { val: "Included (Dynamic custom designs)", ok: true },
        competitor: { val: "Requires separate paid add-ons ($)", ok: false }
      },
      {
        feature: "Developer Webhooks",
        ziplin: { val: "Included with detailed log feeds", ok: true },
        competitor: { val: "Requires Pro plan ($89/mo) or higher", ok: false }
      },
      {
        feature: "Monthly Links Gating",
        ziplin: { val: "Unlimited link creation", ok: true },
        competitor: { val: "Restricted to 250 links/mo on Essentials", ok: false }
      },
      {
        feature: "Starting Price Point",
        ziplin: { val: "Free / Pro from $9/mo", ok: true },
        competitor: { val: "Starts from $28/mo (Essentials plan)", ok: false }
      }
    ],
    benefits: [
      {
        title: "Unlimited Domain Branding",
        desc: "Connect all your clients or product lines without hitting arbitrary domain limits or paying for expensive plan extensions.",
        iconName: "Globe",
        color: "text-violet-600",
        bg: "bg-violet-50",
        border: "border-violet-100"
      },
      {
        title: "All-in-One Dashboard",
        desc: "No need to pay for a separate bio link service - Ziplin covers short links, dynamic QRs, pixels, and responsive bios in one place.",
        iconName: "Zap",
        color: "text-emerald-600",
        bg: "bg-emerald-50",
        border: "border-emerald-100"
      },
      {
        title: "Modern Developer API",
        desc: "First-class developer docs, webhooks, and REST requests, giving you total control to automate your campaigns programmatically.",
        iconName: "Code2",
        color: "text-blue-600",
        bg: "bg-blue-50",
        border: "border-blue-100"
      }
    ],
    migration: [
      {
        iconName: "FileSpreadsheet",
        step: "1. Export Rebrandly Links",
        desc: "Download your existing branded link directory from Rebrandly as a CSV spreadsheet."
      },
      {
        iconName: "Settings",
        step: "2. Import to Ziplin",
        desc: "Instantly upload and match slug structures using the Ziplin bulk migration tool."
      },
      {
        iconName: "Globe",
        step: "3. Point Custom Domains",
        desc: "Update your DNS records to target Ziplin, which will automatically handle routing and SSL setup."
      }
    ],
    faqs: [
      {
        question: "Can I manage multiple client accounts in Ziplin?",
        answer: "Yes, our team settings and workspaces allow seamless project separation, team member access controls, and custom workspace management."
      },
      {
        question: "Does Ziplin support SSL for custom domains?",
        answer: "Yes, Ziplin automatically issues and renews free SSL certificates via Let's Encrypt for all your mapped domains, keeping connections encrypted."
      }
    ]
  }
};
