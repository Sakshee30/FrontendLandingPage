/**
 * Ziplin Design Tokens — Light Theme
 * ─────────────────────────────────────────────────────────────────────────────
 * Single source of truth. Change values here to update the entire app.
 * ─────────────────────────────────────────────────────────────────────────────
 */

export const theme = {
  // ── Brand / Primary ──────────────────────────────────────────────────────────
  colors: {
    primary:        "#081C45",
    primaryLight:   "#164BB7",
    primaryDark:    "#0E2F73",
    primaryBg:      "rgba(8, 28, 69, 0.08)",
    primaryBorder:  "rgba(8, 28, 69, 0.2)",
    primaryGlow:    "rgba(8, 28, 69, 0.25)",

    // ── Shell ────────────────────────────────────────────────────────────────
    sidebar:        "#ffffff",
    sidebarBorder:  "#e8edf3",
    topbar:         "#ffffff",
    topbarBorder:   "#e8edf3",
    pageBg:         "#f4f6fb",   // page content area background

    // ── Sidebar nav states ───────────────────────────────────────────────────
    navText:        "#64748b",
    navTextHover:   "#1e293b",
    navTextActive:  "#081C45",
    navItemActive:  "rgba(255, 198, 10, 0.45)",
    navItemHover:   "#f8fafc",
    navLabel:       "#94a3b8",

    // ── Cards / surfaces ─────────────────────────────────────────────────────
    card:           "#ffffff",
    cardBorder:     "#e8edf3",
    cardBorderHover:"rgba(8, 28, 69, 0.3)",
    cardSurface:    "#f8fafc",   // slightly elevated inner surface

    // ── Dropdowns ────────────────────────────────────────────────────────────
    dropdown:       "#ffffff",
    dropdownBorder: "#e8edf3",

    // ── Text hierarchy ───────────────────────────────────────────────────────
    textPrimary:    "#0f172a",
    textSecondary:  "#475569",
    textMuted:      "#94a3b8",
    textInverse:    "#ffffff",

    // ── Status ───────────────────────────────────────────────────────────────
    success:        "#10b981",
    successBg:      "rgba(16, 185, 129, 0.09)",
    successBorder:  "rgba(16, 185, 129, 0.2)",
    successText:    "#059669",

    warning:        "#F4B400",
    warningBg:      "rgba(245, 158, 11, 0.09)",
    warningText:    "#b45309",

    danger:         "#ef4444",
    dangerBg:       "rgba(239, 68, 68, 0.09)",
    dangerText:     "#dc2626",

    info:           "#164BB7",
    infoBg:         "rgba(59, 130, 246, 0.09)",
    infoText:       "#164BB7",

    // ── Stat card accent palette (one color per card) ────────────────────────
    accent1:        "#081C45",                       // navy    — Total Clicks
    accent1Bg:      "rgba(8, 28, 69, 0.10)",
    accent2:        "#164BB7",                       // royal   — Links
    accent2Bg:      "rgba(14, 165, 233, 0.10)",
    accent3:        "#10b981",                       // emerald — QR
    accent3Bg:      "rgba(16, 185, 129, 0.10)",
    accent4:        "#F4B400",                       // yellow  — Bio
    accent4Bg:      "rgba(244, 180, 0, 0.14)",

    // ── Charts ───────────────────────────────────────────────────────────────
    chartLine:      "#164BB7",
    chartArea:      "rgba(22, 75, 183, 0.08)",
    chartGrid:      "#e8edf3",
    chartBar:       "rgba(22, 75, 183, 0.14)",
    chartBarFill:   "#164BB7",
    chartTooltipBg: "#ffffff",
    chartTooltipBorder: "#e8edf3",
  },

  // ── Typography ───────────────────────────────────────────────────────────────
  font: {
    family: "Inter, system-ui, -apple-system, sans-serif",
    size: {
      xs:    11,
      sm:    12,
      base:  13,
      md:    14,
      lg:    16,
      xl:    18,
      "2xl": 22,
      "3xl": 28,
    },
    weight: {
      normal:    400,
      medium:    500,
      semibold:  600,
      bold:      700,
      extrabold: 800,
      black:     900,
    },
  },

  // ── Border radius ─────────────────────────────────────────────────────────────
  radius: {
    sm:    6,
    md:    10,
    lg:    14,
    xl:    18,
    "2xl": 24,
    full:  9999,
  },

  // ── Shadows ───────────────────────────────────────────────────────────────────
  shadow: {
    xs:       "0 1px 2px rgba(0,0,0,0.04)",
    card:     "0 1px 4px rgba(0,0,0,0.06), 0 0 0 1px rgba(0,0,0,0.04)",
    cardHover:"0 6px 24px rgba(0,0,0,0.10), 0 0 0 1px rgba(8,28,69,0.15)",
    glow:     "0 0 0 3px rgba(8,28,69,0.18)",
    glowBtn:  "0 4px 14px rgba(8,28,69,0.28)",
    dropdown: "0 8px 32px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06)",
  },

  // ── Layout dimensions ─────────────────────────────────────────────────────────
  sidebar: {
    fullWidth:    248,
    miniWidth:    64,
    topbarHeight: 60,
  },

  // ── Transitions ───────────────────────────────────────────────────────────────
  transition: {
    fast: "0.12s ease",
    base: "0.2s ease",
    slow: "0.28s ease",
  },
} as const;

export type AppTheme = typeof theme;
