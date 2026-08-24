type ZiplinLogoProps = {
  compact?: boolean;
  size?: number;
};

export function ZiplinLogo({ compact = false, size = 46 }: ZiplinLogoProps) {
  return (
    <span
      aria-label="Ziplin logo"
      style={{
        display: "inline-block",
        fontSize: compact ? Math.max(17, Math.round(size * 0.38)) : Math.max(28, Math.round(size * 0.68)),
        fontWeight: 950,
        lineHeight: 1,
        letterSpacing: compact ? -1.1 : -1.4,
        color: "#FFFFFF",
        whiteSpace: "nowrap",
      }}
    >
      Ziplin
    </span>
  );
}
