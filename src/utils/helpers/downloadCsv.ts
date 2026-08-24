import { ZiplinLink } from "../../app/services/links";

function formatDate(value: string) {
  if (!value) return "—";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function downloadCsv(links: ZiplinLink[]) {
  const header = ["Title", "Clicks", "Created", "Destination URL", "Short URL"];
  const rows = links.map((l) => [
    l.title,
    String(l.clickCount ?? 0),
    formatDate(l.createdAt),
    l.destinationUrl,
    l.shortUrl,
  ]);
  const csv = [header, ...rows]
    .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "ziplin-links.csv";
  a.click();
  URL.revokeObjectURL(a.href);
}
