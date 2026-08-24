import { Link } from "react-router";
import { LandingLogo } from "./landing-logo";
import { motion } from "motion/react";
import { Github, Linkedin, Twitter, ArrowRight, Mail } from "lucide-react";

export const footerNavItems = {
  product: {
    title: "Product",
    links: [
      { label: "Link Management", href: "/features/link-management" },
      { label: "Pixel Retargeting", href: "/features/pixel-retargeting" },
      { label: "UTM Tracking", href: "/features/utm-tracking" },
      { label: "Smart Bio Pages", href: "/features/smart-bio-pages" },
      { label: "Dynamic QR Codes", href: "/features/dynamic-qr-codes" },
      { label: "Campaign", href: "/features/campaigns" },
    ],
  },
  solutions: {
    title: "Solutions",
    links: [
      { label: "Digital Agencies", href: "/solutions/agencies" },
      { label: "Affiliate Marketers", href: "/solutions/affiliates" },
      { label: "E-commerce Brands", href: "/solutions/ecommerce" },
      { label: "Social Media Managers", href: "/solutions/social-managers" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "About Us", href: "/resources/about" },
      { label: "Contact Us", href: "/resources/contact" },
      { label: "Compare Ziplin", href: "/resources/switchy-alternative" },
      { label: "Help Center", href: "/resources/help-center" },
      { label: "Status", href: "https://status.ziplin.com/", isExternal: true },
    ],
  },
  legal: {
    title: "Compliance",
    links: [
      { label: "Privacy Policy", href: "/privacy-policy" },
      { label: "Terms of Service", href: "/terms-of-service" },
      // { label: "GDPR / CCPA Policy", href: "/legal/gdpr" },
      // { label: "Cookie Management", href: "/legal/cookies" },
      // { label: "Report Link Abuse", href: "/contact/abuse" },
    ],
  },
};

export function LandingFooter() {
  return (
    <footer className="bg-slate-50/50 border-t border-slate-200/80 relative overflow-hidden">
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-14">
          <div className="lg:col-span-2 flex flex-col justify-between">
            <div>
              <LandingLogo />
              <p className="text-slate-500 text-sm mt-3 leading-relaxed max-w-sm">
                The all-in-one link management platform for modern teams to shorten, track, and optimize campaigns.
              </p>
            </div>
            <div className="mt-8 max-w-sm">
              <h4 className="text-sm font-semibold text-slate-800 mb-1.5">
                Subscribe to our newsletter
              </h4>
              <p className="text-xs text-slate-500 mb-4 leading-relaxed">
                Get the latest marketing strategies and platform releases directly to your inbox.
              </p>
              <form onSubmit={(e) => e.preventDefault()} className="relative flex items-center">
                <div className="absolute left-4 text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-white border border-slate-200/80 rounded-lg pl-11 pr-32 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/10 focus:border-violet-500 transition-all placeholder-slate-400"
                />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="absolute right-1.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-lg flex items-center gap-1.5 shadow-md shadow-violet-600/10 hover:shadow-violet-600/20 transition-all cursor-pointer"
                >
                  Subscribe
                  <ArrowRight className="w-3.5 h-3.5" />
                </motion.button>
              </form>
            </div>
          </div>
          <div>
            <h3 className="text-md font-semibold text-slate-900 uppercase tracking-wider mb-4">
              {footerNavItems.product.title}
            </h3>
            <ul className="space-y-3">
              {footerNavItems.product.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-md text-slate-500 hover:text-violet-600 hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold text-slate-900 uppercase tracking-wider mb-4">
              {footerNavItems.solutions.title}
            </h3>
            <ul className="space-y-3">
              {footerNavItems.solutions.links.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-md text-slate-500 hover:text-violet-600 hover:translate-x-1 transition-all duration-200 inline-block"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="space-y-8">
            <div>
              <h3 className="text-md font-semibold text-slate-900 uppercase tracking-wider mb-4">
                {footerNavItems.resources.title}
              </h3>
              <ul className="space-y-3">
                {footerNavItems.resources.links.map((link) => (
                  <li key={link.href}>
                    {link.isExternal ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-md text-slate-500 hover:text-violet-600 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        {link.label}
                      </a>
                    ) : (
                      <Link
                        to={link.href}
                        className="text-md text-slate-500 hover:text-violet-600 hover:translate-x-1 transition-all duration-200 inline-block"
                      >
                        {link.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-md font-semibold text-slate-900 uppercase tracking-wider mb-4">
                {footerNavItems.legal.title}
              </h3>
              <ul className="space-y-3">
                {footerNavItems.legal.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-md text-slate-500 hover:text-violet-600 hover:translate-x-1 transition-all duration-200 inline-block"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="border-t border-slate-200/80 pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <span className="text-sm text-slate-500">
            © {new Date().getFullYear()} Ziplin. All rights reserved.
          </span>
          <div className="flex items-center gap-4">
            {[
              { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
              { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
              { icon: Github, href: "https://github.com", label: "GitHub" },
            ].map((social, idx) => {
              const Icon = social.icon;
              return (
                <motion.a
                  key={idx}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-10 h-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-500 hover:text-violet-600 hover:border-violet-300 hover:shadow-lg hover:shadow-violet-500/5 transition-colors duration-200"
                  title={social.label}
                >
                  <Icon className="w-4.5 h-4.5" />
                </motion.a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}

