import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { updateProfile, type UpdateProfilePayload } from "../app/services/auth";

type Tab = "profile" | "organization" | "plan";

// ── Helpers ────────────────────────────────────────────────────────────────────

function LimitRow({ label, value }: { label: string; value: string | number | boolean }) {
  let display: string;
  let color = "#1C252E";
  if (typeof value === "boolean") {
    display = value ? "Yes" : "No";
    color = value ? "#00A76F" : "#637381";
  } else if (value === -1) {
    display = "Unlimited";
    color = "#00A76F";
  } else {
    display = String(value);
  }
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid rgba(145,158,171,0.12)" }}>
      <span style={{ fontSize: 13, color: "#637381" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color }}>{display}</span>
    </div>
  );
}

function limitLabel(key: string): string {
  const map: Record<string, string> = {
    max_links:             "Max short links",
    max_clicks_per_month:  "Max clicks / month",
    max_websites:          "Max websites",
    max_team_members:      "Max team members",
    custom_domains:        "Custom domains",
    analytics:             "Analytics level",
    api_access:            "API access",
    bio_pages:             "Bio pages",
    qr_codes:              "QR codes",
    campaigns:             "Campaigns",
    file_assets:           "File assets",
    webhooks:              "Webhooks",
    link_expiry:           "Link expiry",
    password_protection:   "Password protection",
  };
  return map[key] ?? key.replace(/_/g, " ");
}

// ── Sub-panels ─────────────────────────────────────────────────────────────────

function ProfileTab() {
  const { user, refresh } = useAuth();
  const [form, setForm] = useState({
    name:      user?.name ?? "",
    firstName: user?.firstName ?? "",
    lastName:  user?.lastName ?? "",
    phone:     user?.phone ?? "",
  });
  const [saving, setSaving]   = useState(false);
  const [saved, setSaved]     = useState(false);
  const [error, setError]     = useState("");

  useEffect(() => {
    setForm({
      name:      user?.name ?? "",
      firstName: user?.firstName ?? "",
      lastName:  user?.lastName ?? "",
      phone:     user?.phone ?? "",
    });
  }, [user]);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [key]: e.target.value }));
      setSaved(false);
      setError("");
    },
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) { setError("Name is required"); return; }
    setSaving(true);
    setError("");
    try {
      const patch: UpdateProfilePayload = {};
      if (form.name      !== user?.name)      patch.name      = form.name.trim();
      if (form.firstName !== user?.firstName) patch.firstName = form.firstName.trim();
      if (form.lastName  !== user?.lastName)  patch.lastName  = form.lastName.trim();
      if (form.phone     !== user?.phone)     patch.phone     = form.phone.trim();
      if (Object.keys(patch).length > 0) {
        await updateProfile(patch);
        await refresh();
      }
      setSaved(true);
    } catch (err: any) {
      setError(err.message ?? "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSave} style={{ maxWidth: 540 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 16 }}>
        <Field label="First name" {...field("firstName")} />
        <Field label="Last name"  {...field("lastName")} />
      </div>
      <Field label="Full name" {...field("name")} style={{ marginBottom: 16 }} />
      <Field label="Phone" {...field("phone")} style={{ marginBottom: 16 }} />
      <Field
        label="Email address"
        value={user?.email ?? ""}
        disabled
        hint="Email cannot be changed"
        style={{ marginBottom: 24 }}
      />

      {error && (
        <div style={{ marginBottom: 12, padding: "10px 14px", background: "#FFF0EE", border: "1px solid #FF5630", borderRadius: 8, fontSize: 13, color: "#FF5630" }}>
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={saving}
        style={{
          height: 40, paddingInline: 24, borderRadius: 8, border: "none",
          background: saving ? "#aaa" : "#00A76F", color: "#fff",
          fontWeight: 700, fontSize: 14, cursor: saving ? "not-allowed" : "pointer",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {saving ? "Saving…" : "Save changes"}
      </button>
      {saved && !saving && (
        <span style={{ marginLeft: 14, fontSize: 13, fontWeight: 600, color: "#00A76F" }}>
          ✓ Saved
        </span>
      )}
    </form>
  );
}

function OrgTab() {
  const { user } = useAuth();
  const org = user?.organization;

  if (!org) {
    return <p style={{ fontSize: 14, color: "#637381" }}>No organization found.</p>;
  }

  return (
    <div style={{ maxWidth: 540 }}>
      <ReadRow label="Organization name" value={org.name} />
      <ReadRow label="Slug"              value={org.slug} mono />
      <ReadRow label="Status"            value={org.status} badge />
      <ReadRow label="Organization ID"   value={org.id} mono small />
    </div>
  );
}

function PlanTab() {
  const { user } = useAuth();
  const plan = user?.plan;

  if (!plan) {
    return (
      <div style={{ maxWidth: 540 }}>
        <p style={{ fontSize: 14, color: "#637381", marginBottom: 16 }}>
          No active subscription found. You are on the free tier.
        </p>
      </div>
    );
  }

  const limits = plan.limits as Record<string, string | number | boolean>;

  return (
    <div style={{ maxWidth: 540 }}>
      {/* Plan header */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16, padding: "20px 24px",
        background: "linear-gradient(135deg, #00A76F14, #00A76F08)",
        border: "1px solid rgba(0,167,111,0.2)", borderRadius: 12, marginBottom: 24,
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12, background: "#00A76F",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, fontWeight: 900, color: "#fff",
        }}>
          {plan.name.charAt(0)}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#1C252E" }}>{plan.name}</div>
          <div style={{ fontSize: 12, fontWeight: 600, color: "#637381", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 2 }}>
            {plan.slug} plan
          </div>
        </div>
        <div style={{ marginLeft: "auto" }}>
          <span style={{
            padding: "4px 12px", borderRadius: 20, fontSize: 12, fontWeight: 700,
            background: "rgba(0,167,111,0.12)", color: "#00A76F",
          }}>
            Active
          </span>
        </div>
      </div>

      {/* Features */}
      {plan.features && plan.features.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <SectionLabel>Included features</SectionLabel>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(plan.features as string[]).map((f) => (
              <span key={f} style={{
                padding: "4px 10px", borderRadius: 6, fontSize: 12, fontWeight: 600,
                background: "#F4F6F8", color: "#1C252E", border: "1px solid rgba(145,158,171,0.2)",
              }}>
                {f}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Limits */}
      {Object.keys(limits).length > 0 && (
        <div>
          <SectionLabel>Plan limits</SectionLabel>
          <div style={{ background: "#fff", border: "1px solid rgba(145,158,171,0.2)", borderRadius: 10, padding: "0 16px" }}>
            {Object.entries(limits).map(([k, v]) => (
              <LimitRow key={k} label={limitLabel(k)} value={v} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ── Reusable primitives ────────────────────────────────────────────────────────

function Field({
  label, hint, disabled = false, style = {}, ...inputProps
}: {
  label: string; hint?: string; disabled?: boolean; style?: React.CSSProperties;
  value: string; onChange?: React.ChangeEventHandler<HTMLInputElement>;
}) {
  return (
    <div style={style}>
      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "#637381", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>
        {label}
      </label>
      <input
        {...inputProps}
        disabled={disabled}
        style={{
          width: "100%", height: 40, padding: "0 12px", borderRadius: 8,
          border: "1px solid rgba(145,158,171,0.3)",
          background: disabled ? "#F4F6F8" : "#fff",
          color: disabled ? "#9AA4AE" : "#1C252E",
          fontSize: 14, fontFamily: "Inter, sans-serif",
          boxSizing: "border-box", outline: "none",
        }}
      />
      {hint && <p style={{ fontSize: 11, color: "#9AA4AE", marginTop: 4 }}>{hint}</p>}
    </div>
  );
}

function ReadRow({ label, value, mono = false, small = false, badge = false }: {
  label: string; value: string; mono?: boolean; small?: boolean; badge?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 0", borderBottom: "1px solid rgba(145,158,171,0.12)" }}>
      <span style={{ fontSize: 13, color: "#637381", flexShrink: 0, marginRight: 24 }}>{label}</span>
      {badge ? (
        <span style={{ padding: "3px 10px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: value === "active" ? "rgba(0,167,111,0.12)" : "rgba(255,86,48,0.12)", color: value === "active" ? "#00A76F" : "#FF5630" }}>
          {value}
        </span>
      ) : (
        <span style={{ fontSize: small ? 11 : 13, fontWeight: 600, color: "#1C252E", fontFamily: mono ? "monospace" : "inherit", wordBreak: "break-all", textAlign: "right" }}>
          {value}
        </span>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: "#637381", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
      {children}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

const TABS: { id: Tab; label: string }[] = [
  { id: "profile",      label: "Personal Info" },
  { id: "organization", label: "Organization" },
  { id: "plan",         label: "Plan & Limits" },
];

export default function ProfilePage() {
  const { user } = useAuth();
  const [tab, setTab] = useState<Tab>("profile");

  return (
    <div style={{ padding: 32, maxWidth: 720, margin: "0 auto", fontFamily: "Inter, Arial, sans-serif" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 32 }}>
        <div style={{
          width: 64, height: 64, borderRadius: "50%", background: "#00A76F",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 26, fontWeight: 900, color: "#fff", flexShrink: 0,
        }}>
          {user?.name?.charAt(0).toUpperCase() ?? "U"}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#1C252E", margin: 0 }}>{user?.name}</h1>
          <p style={{ fontSize: 13, color: "#637381", margin: "4px 0 0" }}>{user?.email}</p>
          <span style={{
            display: "inline-block", marginTop: 6, padding: "2px 10px", borderRadius: 20,
            fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em",
            background: "rgba(0,167,111,0.1)", color: "#00A76F",
          }}>
            {user?.role}
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 4, borderBottom: "2px solid rgba(145,158,171,0.15)", marginBottom: 28 }}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            style={{
              padding: "10px 18px", border: "none", background: "transparent", cursor: "pointer",
              fontSize: 14, fontWeight: tab === id ? 700 : 500,
              color: tab === id ? "#00A76F" : "#637381",
              borderBottom: `2px solid ${tab === id ? "#00A76F" : "transparent"}`,
              marginBottom: -2, fontFamily: "Inter, sans-serif", transition: "color 0.15s",
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {tab === "profile"      && <ProfileTab />}
      {tab === "organization" && <OrgTab />}
      {tab === "plan"         && <PlanTab />}
    </div>
  );
}
