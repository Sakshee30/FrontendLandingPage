export const paths = {
  // Public routes
  home: "/",
  pricing: "/pricing",

  // Resources
  resources: {
    root: "/resources",
    helpCenter: "/resources/help-center",
    about: "/resources/about",
    contact: "/resources/contact",
    switchyAlternative: "/resources/switchy-alternative",
    linkTreeAlternative: "/resources/link-tree-alternative",
    linkoAlternative: "/resources/linko-alternative",
    rebrandlyAlternative: "/resources/rebrandly-alternative",
  },

  // Legal
  legal: {
    privacy: "/privacy-policy",
    terms: "/terms-of-service",
  },

  // Features
  features: {
    root: "/features",
    linkManagement: "/features/link-management",
    smartBioPages: "/features/smart-bio-pages",
    dynamicQRCodes: "/features/dynamic-qr-codes",
    campaigns: "/features/campaigns",
    utmTracking: "/features/utm-tracking",
    webhooks: "/features/webhooks",
    pixelRetargeting: "/features/pixel-retargeting",
  },

  // Auth routes
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",

  // Protected routes
  dashboard: "/dashboard",
  links: {
    root: "/links",
    new: "/links/new",
    import: "/links/import",
    edit: (id: string | number = ":id") => `/links/${id}/edit`,
  },
  analytics: "/analytics",
  qr: "/qr",
  barcodes: "/barcodes",
  bio: "/bio",
  campaigns: "/campaigns",
  files: "/files",
  previews: "/previews",
  migrations: "/migrations",
  settings: "/settings",
  subscription: "/subscription",
  help: "/help",
  profile: "/profile",

  // Catch all
  notFound: "*",
} as const;

// Type-safe path helper for dynamic routes
export const getEditLinkPath = (id: string | number) => `/links/${id}/edit`;
