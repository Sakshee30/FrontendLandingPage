import { useState } from "react";
import { Link } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  Link as LinkIcon,
  Sparkles,
  ArrowRightLeft,
  User,
  QrCode,
  ShieldCheck,
  ChevronDown,
  Menu,
  X,
  ArrowRight,
  BookOpen,
  HelpCircle,
  Phone,
} from "lucide-react";
import { LandingLogo } from "./landing-logo";
import { motion, AnimatePresence } from "motion/react";

export const navItems = [
  {
    label: "Features",
    hasDropdown: true,
    columns: [
      {
        title: "Core Features",
        items: [
          {
            title: "Link Management",
            description: "Customize social cards, titles, meta tags, and open-graph imagery.",
            href: "/features/link-management",
            icon: "LinkIcon",
          },
          {
            title: "UTM Tracking",
            description: "Redirect clicks dynamically using Geolocation and device OS logic.",
            href: "/features/utm-tracking",
            icon: "ArrowsRightLeftIcon",
          },
          {
            title: "Smart Bio Pages",
            description: "Deploy beautiful, mobile-optimized link-in-bio landing structures.",
            href: "/features/smart-bio-pages",
            icon: "UserIcon",
          },
          {
            title: "Campaigns",
            description: "Manage and track your marketing campaigns with ease.",
            href: "/features/campaigns",
            icon: "ShieldCheckIcon",
          },
        ],
      },
      {
        title: "Advanced Tools",
        items: [
          {
            title: "Retargeting Pixels",
            description: "Track click audiences through Meta, Google, LinkedIn, and TikTok pixels.",
            href: "/features/pixel-retargeting",
            icon: "SparklesIcon",
          },
          {
            title: "Dynamic QR Codes",
            description: "Generate programmable vector QR formats with dynamic backends.",
            href: "/features/dynamic-qr-codes",
            icon: "QrCodeIcon",
          },
          {
            title: "Webhooks",
            description: "Receive real-time notifications for key events in your link management.",
            href: "/features/webhooks",
            icon: "ShieldCheckIcon",
          },
        ],
      },
    ],
  },
  { label: "Pricing", href: "/pricing", hasDropdown: false },
  {
    label: "Resources",
    hasDropdown: true,
    columns: [
      {
        title: "Resources",
        items: [
          // {
          //   title: "Growth Blog",
          //   description: "Performance marketing strategies and conversion tips.",
          //   href: "/blog",
          //   icon: "BookOpenIcon",
          // },
          {
            title: "Help Center",
            description: "Detailed platform installation tutorials and user guides.",
            href: "/resources/help-center",
            icon: "HelpCircleIcon",
          },
          {
            title: "About Us",
            description: "Learn our mission, story, and the team building Ziplin.",
            href: "/resources/about",
            icon: "UserIcon",
          },
          {
            title: "Contact Us",
            description: "Get in touch with our sales, support, and partnership teams.",
            href: "/resources/contact",
            icon: "PhoneIcon",
          },
        ],
      },
      {
        title: "Alternatives",
        items: [
          {
            title: "Switchy Alternative",
            description: "See how Ziplin is a faster and more modern link shortener than Switchy.",
            href: "/resources/switchy-alternative",
            icon: "SparklesIcon",
          },
          {
            title: "Linktree Alternative",
            description: "Ditch Linktree for Ziplin's highly customizable smart bio pages.",
            href: "/resources/link-tree-alternative",
            icon: "UserIcon",
          },
          {
            title: "Linko Alternative",
            description: "Discover why Ziplin is the chosen Linko alternative for marketing teams.",
            href: "/resources/linko-alternative",
            icon: "LinkIcon",
          },
          {
            title: "Rebrandly Alternative",
            description: "Compare Ziplin's advanced custom domain branding against Rebrandly.",
            href: "/resources/rebrandly-alternative",
            icon: "ArrowsRightLeftIcon",
          },
        ],
      },
    ],
  },
];

const iconMap: Record<string, any> = {
  LinkIcon: LinkIcon,
  SparklesIcon: Sparkles,
  ArrowsRightLeftIcon: ArrowRightLeft,
  UserIcon: User,
  QrCodeIcon: QrCode,
  ShieldCheckIcon: ShieldCheck,
  BookOpenIcon: BookOpen,
  HelpCircleIcon: HelpCircle,
  PhoneIcon: Phone,
};

const containerVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: {
    opacity: 1,
    height: "auto",
    transition: {
      height: { duration: 0.3, ease: "easeOut" },
      staggerChildren: 0.05,
      delayChildren: 0.05,
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      height: { duration: 0.25, ease: "easeIn" },
      staggerChildren: 0.03,
      staggerDirection: -1,
    },
  },
};


export function LandingHeader() {
  const { state } = useAuth();
  const isLoggedIn = state === "ok";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white/75 backdrop-blur-md border-b border-slate-200/60 transition-all duration-300 relative">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <LandingLogo />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <div
              key={item.label}
              className="group"
              onMouseEnter={() => setOpenDropdown(item.label)}
              onMouseLeave={() => setOpenDropdown(null)}
            >
              {item.hasDropdown ? (
                <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-lg font-medium text-slate-700 hover:text-violet-600 hover:bg-violet-50/50 transition-all duration-200">
                  {item.label}
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 group-hover:rotate-180" />
                </button>
              ) : (
                <Link
                  to={item.href!}
                  className="px-4 py-2.5 rounded-xl text-lg font-medium text-slate-700 hover:text-violet-600 hover:bg-violet-50/50 transition-all duration-200"
                >
                  {item.label}
                </Link>
              )}

              {/* Dropdown */}
              <AnimatePresence>
                {item.hasDropdown && openDropdown === item.label && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 z-50">
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 shadow-2xl shadow-slate-900/5 backdrop-blur-xl w-[760px]">
                        <div className="grid grid-cols-2 gap-6 p-1">
                          {item.columns?.map((column: any, colIdx: number) => (
                            <div key={colIdx} className="flex flex-col">
                              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3.5 px-3.5">
                                {column.title}
                              </div>
                              <div className="flex flex-col gap-1">
                                {column.items.map((dropdownItem: any) => {
                                  const Icon = dropdownItem.icon
                                    ? iconMap[dropdownItem.icon]
                                    : null;
                                  return (
                                    <Link
                                      key={dropdownItem.href}
                                      to={dropdownItem.href}
                                      onClick={() => setOpenDropdown(null)}
                                      className="flex items-start gap-3.5 p-3 rounded-2xl hover:bg-slate-50 transition-all duration-200 group/link"
                                    >
                                      {Icon && (
                                        <div className="mt-0.5 w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/10 to-purple-650/10 flex items-center justify-center text-violet-600 group-hover/link:text-violet-700 group-hover/link:from-violet-500/20 group-hover/link:to-purple-600/20 transition-all shrink-0">
                                          <Icon className="w-4.5 h-4.5" />
                                        </div>
                                      )}
                                      <div className="flex-1">
                                        <div className="flex items-center gap-1.5">
                                          <span className="text-sm font-semibold text-slate-900 group-hover/link:text-violet-600 transition-colors">
                                            {dropdownItem.title}
                                          </span>
                                          <ArrowRight className="w-3.5 h-3.5 text-violet-600 opacity-0 -translate-x-1 group-hover/link:opacity-100 group-hover/link:translate-x-0 transition-all duration-200" />
                                        </div>
                                        {dropdownItem.description && (
                                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed font-medium">
                                            {dropdownItem.description}
                                          </p>
                                        )}
                                      </div>
                                    </Link>
                                  );
                                })}
                              </div>
                            </div>
                          ))}
                        </div>
                        {item.label === "Features" && (
                          <div className="mt-4 pt-4 border-t border-slate-100/80 flex items-center justify-between text-xs text-slate-500 px-2">
                            <span>Looking for enterprise scaling?</span>
                            <Link
                              to="/contact"
                              className="text-violet-600 hover:text-violet-700 font-semibold flex items-center gap-1 group/banner-link"
                            >
                              Explore Enterprise Solutions
                              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/banner-link:translate-x-0.5" />
                            </Link>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </nav>

        {/* Auth Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isLoggedIn ? (
            <motion.div
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <Link
                to="/dashboard"
                className="group relative block overflow-hidden bg-purple-700 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-xl shadow-violet-600/20 hover:shadow-violet-600/30 transition-all duration-200"
              >
                <span className="relative z-10">Dashboard</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </Link>
            </motion.div>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-slate-700 px-5 py-2.5 rounded-xl hover:text-slate-900 hover:bg-slate-100 transition-all duration-200"
              >
                Log in
              </Link>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Link
                  to="/signup"
                  className="group relative block overflow-hidden bg-purple-700 text-white text-sm font-semibold px-6 py-3 rounded-lg shadow-xl shadow-violet-600/20 hover:shadow-violet-600/30 transition-all duration-200"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Get started free
                    <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
                </Link>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-slate-700 p-2 hover:bg-slate-100 rounded-xl transition-colors relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          <motion.div
            animate={{ rotate: mobileOpen ? 90 : 0 }}
            transition={{ duration: 0.2 }}
            className="absolute"
          >
            {mobileOpen ? (
              <X className="w-6 h-6 text-slate-800" />
            ) : (
              <Menu className="w-6 h-6 text-slate-800" />
            )}
          </motion.div>
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="md:hidden border-t border-slate-200 bg-white/95 backdrop-blur-3xl overflow-auto max-h-screen pb-32"
          >
            <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col gap-4">
              {navItems.map((item) => (
                <motion.div
                  key={item.label}
                  className="border-b border-slate-100 last:border-0 pb-4 last:pb-0"
                >
                  {item.hasDropdown ? (
                    <div className="space-y-4">
                      <div className="text-slate-400 font-bold mb-1 text-xs uppercase tracking-wider">
                        {item.label}
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-2">
                        {item.columns?.map((column: any, colIdx: number) => (
                          <div key={colIdx} className="space-y-2">
                            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {column.title}
                            </div>
                            <div className="space-y-1">
                              {column.items.map((dropdownItem: any) => (
                                <Link
                                  key={dropdownItem.href}
                                  to={dropdownItem.href}
                                  className="group py-2 px-2.5 text-slate-700 hover:text-violet-600 hover:bg-violet-50/50 rounded-xl transition-all text-sm flex items-center justify-between font-medium"
                                  onClick={() => setMobileOpen(false)}
                                >
                                  <span>{dropdownItem.title}</span>
                                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                                </Link>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={item.href!}
                      className="py-2.5 px-2 text-slate-900 font-semibold hover:bg-slate-50 rounded-xl transition-all flex items-center justify-between"
                      onClick={() => setMobileOpen(false)}
                    >
                      <span>{item.label}</span>
                      <ArrowRight className="w-4 h-4 text-slate-500" />
                    </Link>
                  )}
                </motion.div>
              ))}

              <motion.div className="space-y-3 pt-2">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    className="block bg-gradient-to-r from-violet-600 via-purple-650 to-violet-700 text-white text-sm font-semibold px-6 py-3.5 rounded-2xl text-center shadow-lg shadow-violet-600/20"
                    onClick={() => setMobileOpen(false)}
                  >
                    Dashboard
                  </Link>
                ) : (
                  <div className="flex flex-col gap-3">
                    <Link
                      to="/login"
                      className="text-slate-700 font-semibold text-center py-3 hover:bg-slate-50 rounded-xl transition-all"
                      onClick={() => setMobileOpen(false)}
                    >
                      Log in
                    </Link>
                    <Link
                      to="/signup"
                      className="bg-gradient-to-r from-violet-600 via-purple-650 to-violet-700 text-white text-sm font-semibold px-6 py-3.5 rounded-2xl text-center shadow-lg shadow-violet-600/20"
                      onClick={() => setMobileOpen(false)}
                    >
                      Get started free
                    </Link>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
