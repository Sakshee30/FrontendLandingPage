import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { UploadCloud, FileSpreadsheet, Download, ArrowLeft } from "lucide-react";
import { TOKEN_COLOR } from "../utils/constants/colors.constants";
import { parseImportRows, type ImportRow } from "../utils/helpers/parseImportRows";
import { bulkImportLinks } from "../app/services/links";
import { getAvailableRedirectDomains, type RedirectDomainOption } from "../app/services/config";
import { ImportPreview } from "../app/components/links/ImportPreview";

export default function ImportLinksPage() {
  const navigate = useNavigate();
  const [importing, setImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<ImportRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [domains, setDomains] = useState<RedirectDomainOption[]>([]);

  useEffect(() => {
    getAvailableRedirectDomains().then(setDomains).catch(() => {});
  }, []);

  const validateRow = (row: ImportRow, domainList: RedirectDomainOption[]): ImportRow => {
    const isUrlValid = /^https?:\/\/[^.\s]+\.[^\s]+/i.test(row.destinationUrl) || /^https?:\/\/localhost/i.test(row.destinationUrl);
    if (!isUrlValid) {
      return { ...row, valid: false, reason: "Missing or invalid destination URL" };
    }
    
    let validDomain = row.shortDomain;
    if (validDomain && domainList.length > 0) {
      const isValidDomain = domainList.some(d => d.domain === validDomain);
      if (!isValidDomain) {
        validDomain = ""; // reset to default domain silently instead of erroring
      }
    }
    return { ...row, shortDomain: validDomain, valid: true, reason: undefined };
  };

  // Revalidate rows when domains load
  useEffect(() => {
    if (domains.length > 0 && importPreview) {
      const next = importPreview.map(row => validateRow(row, domains));
      const hasChanges = next.some((r, i) => r.valid !== importPreview[i].valid || r.reason !== importPreview[i].reason);
      if (hasChanges) setImportPreview(next);
    }
  }, [domains]); // only run when domains change to avoid loops

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;
    setError(null);
    try {
      const text = await file.text();
      const rows = parseImportRows(text);
      setImportPreview(rows.map(r => validateRow(r, domains)));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Parse failed");
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const confirmBulkImport = async () => {
    if (!importPreview) return;
    setImporting(true);
    setError(null);
    try {
      const valid = importPreview.filter((r) => r.valid);
      if (valid.length === 0) return;
      const response = await bulkImportLinks(valid);
      alert(`Imported ${response.imported} link${response.imported === 1 ? "" : "s"}.${response.errors?.length ? ` Failed to import ${response.errors.length} links.` : ""}`);
      navigate("/links");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Import failed");
    } finally {
      setImporting(false);
    }
  };

  const downloadSampleCsv = () => {
    const csvContent = "Title,Destination URL,Slug,Domain,Folder,Tags,Notes,UTM Source,UTM Medium,UTM Campaign\n"
                     + "My Website,https://example.com,website,,Marketing,landing-page,Main site,newsletter,email,summer_sale\n"
                     + "Twitter Profile,https://twitter.com/example,twitter,ex.co,Social,social,Official twitter,,,\n"
                     + ",https://google.com/search?q=example,,,,,,,,\n";
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "sample-import.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>
      <button 
        onClick={() => navigate("/links")}
        style={{ display: "flex", alignItems: "center", gap: 6, background: "none", border: "none", color: TOKEN_COLOR.MUTED, fontWeight: 600, fontSize: 13, cursor: "pointer", marginBottom: 24 }}
      >
        <ArrowLeft size={16} /> Back to Links
      </button>

      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: TOKEN_COLOR.TEXT, margin: "0 0 8px 0" }}>Import Links</h1>
        <p style={{ fontSize: 15, color: TOKEN_COLOR.MUTED, margin: 0 }}>
          Migrate your short links from other platforms or upload a large batch in one go.
        </p>
      </div>

      {error && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FECACA", color: "#B91C1C", borderRadius: 10, padding: "12px 16px", marginBottom: 24, fontWeight: 600, fontSize: 13 }}>
          ⚠ {error}
        </div>
      )}

      {!importPreview ? (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 32, alignItems: "start" }}>
          <div 
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ 
              border: `2px dashed ${TOKEN_COLOR.BORDER}`, 
              borderRadius: 16, 
              padding: "64px 32px", 
              textAlign: "center",
              background: "#FAFAFA",
              transition: "all 0.2s ease"
            }}
          >
            <div style={{ width: 64, height: 64, borderRadius: "50%", background: TOKEN_COLOR.PRIMARY_BG, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <UploadCloud size={32} color={TOKEN_COLOR.PRIMARY} />
            </div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: TOKEN_COLOR.TEXT, margin: "0 0 8px 0" }}>Drop your CSV file here</h3>
            <p style={{ fontSize: 14, color: TOKEN_COLOR.MUTED, margin: "0 0 24px 0" }}>
              Only CSV files are supported. Maximum 1000 links per import.
            </p>
            <label style={{ 
              display: "inline-block",
              background: TOKEN_COLOR.PRIMARY, 
              color: "#fff", 
              padding: "10px 24px", 
              borderRadius: 8, 
              fontWeight: 700, 
              fontSize: 14, 
              cursor: "pointer",
              boxShadow: `0 4px 14px rgba(8,28,69,0.3)` 
            }}>
              Browse files
              <input type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => {
                handleFileUpload(e.target.files?.[0] ?? null);
                e.target.value = "";
              }} />
            </label>
          </div>

          <div style={{ background: "#fff", border: `1px solid ${TOKEN_COLOR.BORDER}`, borderRadius: 12, padding: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FileSpreadsheet size={20} color={TOKEN_COLOR.MUTED} />
              </div>
              <div>
                <h4 style={{ margin: 0, fontSize: 14, fontWeight: 700, color: TOKEN_COLOR.TEXT }}>Need a template?</h4>
                <p style={{ margin: 0, fontSize: 13, color: TOKEN_COLOR.FAINT }}>Download our sample CSV</p>
              </div>
            </div>
            
            <button 
              onClick={downloadSampleCsv}
              style={{ width: "100%", padding: "10px", borderRadius: 8, border: `1px solid ${TOKEN_COLOR.BORDER}`, background: "#fff", color: TOKEN_COLOR.TEXT, fontWeight: 600, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
            >
              <Download size={14} /> Download Sample CSV
            </button>

            <hr style={{ border: 0, borderTop: `1px solid ${TOKEN_COLOR.BORDER}`, margin: "24px 0" }} />
            
            <h5 style={{ margin: "0 0 12px 0", fontSize: 12, fontWeight: 700, color: TOKEN_COLOR.FAINT, textTransform: "uppercase", letterSpacing: 0.5 }}>Supported Columns</h5>
            <ul style={{ margin: 0, padding: "0 0 0 16px", fontSize: 13, color: TOKEN_COLOR.MUTED, display: "flex", flexDirection: "column", gap: 8 }}>
              <li><strong>Destination URL</strong> (Required)</li>
              <li><strong>Title</strong></li>
              <li><strong>Slug</strong></li>
              <li><strong>Domain</strong></li>
              <li><strong>Folder</strong></li>
              <li><strong>Tags</strong> (Comma separated)</li>
              <li><strong>Notes</strong></li>
              <li><strong>UTM Parameters</strong> (Source, Medium, Campaign, Term, Content)</li>
            </ul>
          </div>
        </div>
      ) : (
        <ImportPreview
            importPreview={importPreview}
            importing={importing}
            domains={domains}
            onCancel={() => setImportPreview(null)}
            onConfirm={confirmBulkImport}
            onUpdateRow={(index, field, value) => {
              setImportPreview(prev => {
                if (!prev) return prev;
                const next = [...prev];
                next[index] = { ...next[index], [field]: value };
                next[index] = validateRow(next[index], domains);
                return next;
              });
            }}
        />
      )}
    </div>
  );
}
