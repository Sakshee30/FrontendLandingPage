import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil, UserX, UserCheck, X } from "lucide-react";
import { blockUser, createUser, deleteUser, listUsers, unblockUser, updateUser } from "../services/team";
import { AuthUser, Role } from "../services/auth";

type EditingUser = { id: string; name: string; role: Role };

export function TeamMembers() {
  const [users, setUsers] = useState<AuthUser[]>([]);
  const [form, setForm] = useState({ name: "", email: "", role: "user" as Role, password: "user123" });
  const [editing, setEditing] = useState<EditingUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  async function load(silent = false) {
    if (!silent) setLoading(true);
    setError(null);
    try {
      setUsers(await listUsers());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load team");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  useEffect(() => {
    const refreshSilently = () => {
      if (document.visibilityState === "visible") load(true);
    };
    const interval = window.setInterval(refreshSilently, 6000);
    window.addEventListener("focus", refreshSilently);
    document.addEventListener("visibilitychange", refreshSilently);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener("focus", refreshSilently);
      document.removeEventListener("visibilitychange", refreshSilently);
    };
  }, []);

  async function addMember() {
    if (!form.name.trim() || !form.email.trim()) {
      setError("Name and email are required");
      return;
    }
    setSaving(true);
    setError(null);
    try {
      const user = await createUser(form);
      setUsers((current) => [...current, user]);
      setForm({ name: "", email: "", role: "user", password: "user123" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create user");
    } finally {
      setSaving(false);
    }
  }

  async function saveEdit() {
    if (!editing) return;
    setSaving(true);
    setActionError(null);
    try {
      const updated = await updateUser(editing.id, { name: editing.name, role: editing.role });
      setUsers((current) => current.map((item) => item.id === updated.id ? { ...item, ...updated } : item));
      setEditing(null);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update user");
    } finally {
      setSaving(false);
    }
  }

  async function toggleBlock(user: AuthUser) {
    const isBlocked = user.status === "blocked";
    if (!confirm(`${isBlocked ? "Unblock" : "Block"} ${user.email}?`)) return;
    setActionError(null);
    try {
      if (isBlocked) {
        await unblockUser(user.id);
        setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: "active" } : item));
      } else {
        await blockUser(user.id);
        setUsers((current) => current.map((item) => item.id === user.id ? { ...item, status: "blocked" } : item));
      }
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not update user status");
    }
  }

  async function removeMember(user: AuthUser) {
    if (!confirm(`Permanently delete ${user.email}? This cannot be undone.`)) return;
    setActionError(null);
    try {
      await deleteUser(user.id);
      setUsers((current) => current.filter((item) => item.id !== user.id));
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Could not delete user");
    }
  }

  return (
    <div style={{ padding: 32, fontFamily: "Inter, sans-serif", maxWidth: 860 }}>
      {/* Add member */}
      <div style={card}>
        <h2 style={title}>Team Members</h2>
        <p style={muted}>Invite collaborators and control their access level.</p>
        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr 1fr 130px 140px auto", gap: 10, alignItems: "end" }}>
          <div>
            <label style={label}>Full name</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Jane Doe" style={input} />
          </div>
          <div>
            <label style={label}>Email</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="jane@example.com" style={input} type="email" />
          </div>
          <div>
            <label style={label}>Role</label>
            <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value as Role })} style={input}>
              <option value="admin">Admin</option>
              <option value="user">User</option>
            </select>
          </div>
          <div>
            <label style={label}>Temp password</label>
            <input value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Password" style={input} />
          </div>
          <button onClick={addMember} disabled={saving} style={{ ...btn, alignSelf: "end", opacity: saving ? 0.65 : 1 }}>
            <Plus size={15} /> Add member
          </button>
        </div>
        {error && <div style={{ ...err, marginTop: 12 }}>{error}</div>}
      </div>

      {/* User list */}
      <div style={card}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <h3 style={{ ...title, fontSize: 16, marginBottom: 0 }}>Workspace users</h3>
          <span style={{ fontSize: 12, color: "#667085" }}>{users.length} member{users.length !== 1 ? "s" : ""}</span>
        </div>
        {loading && <p style={muted}>Loading team...</p>}
        {actionError && <div style={{ ...err, margin: "8px 0 12px" }}>{actionError}</div>}
        {!loading && users.length === 0 && <p style={muted}>No team members yet. Add one above.</p>}
        {users.map((user, index) => {
          const isOwner = user.role === "owner";
          const isBlocked = user.status === "blocked";
          const isEditing = editing?.id === user.id;
          return (
            <div key={user.id}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 0" }}>
                {/* Avatar */}
                <div style={{ width: 38, height: 38, borderRadius: "50%", flexShrink: 0, background: isOwner ? "#F0FDF4" : isBlocked ? "#F3F4F6" : "#EEF4FF", color: isOwner ? "#16A34A" : isBlocked ? "#9CA3AF" : "#2F80ED", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 15 }}>
                  {user.name?.charAt(0).toUpperCase() || "?"}
                </div>

                {/* Name / email */}
                {isEditing ? (
                  <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })} style={{ ...input, width: 160 }} autoFocus />
                ) : (
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: isBlocked ? "#9CA3AF" : "#1C2433", fontWeight: 700, fontSize: 14, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</div>
                    <div style={{ color: "#667085", fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                  </div>
                )}

                {/* Status badge */}
                {isOwner ? (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: "#F0FDF4", color: "#16A34A", textTransform: "uppercase" as const, letterSpacing: 0.5, flexShrink: 0 }}>
                    Owner
                  </span>
                ) : (
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 9px", borderRadius: 99, background: isBlocked ? "#FEE2E2" : "#DCFCE7", color: isBlocked ? "#DC2626" : "#16A34A", textTransform: "uppercase" as const, letterSpacing: 0.5, flexShrink: 0 }}>
                    {isBlocked ? "Blocked" : "Active"}
                  </span>
                )}

                {/* Role */}
                {isEditing ? (
                  <select value={editing.role} onChange={(e) => setEditing({ ...editing, role: e.target.value as Role })} style={{ ...input, width: 110 }}>
                    <option value="admin">Admin</option>
                    <option value="user">User</option>
                  </select>
                ) : (
                  <span style={{ fontSize: 12, color: "#667085", fontWeight: 600, width: 58, textAlign: "center" as const, flexShrink: 0 }}>{user.role}</span>
                )}

                {/* Actions — owner row is read-only */}
                {isOwner ? (
                  <div style={{ width: 90, flexShrink: 0 }} />
                ) : isEditing ? (
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={saveEdit} disabled={saving} style={{ ...btn, padding: "6px 14px", fontSize: 13, opacity: saving ? 0.65 : 1 }}>Save</button>
                    <button onClick={() => setEditing(null)} style={ghost}><X size={15} /></button>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
                    <button onClick={() => setEditing({ id: user.id, name: user.name, role: user.role })} title="Edit" style={ghost}><Pencil size={15} /></button>
                    <button onClick={() => toggleBlock(user)} title={isBlocked ? "Unblock" : "Block"} style={{ ...ghost, color: isBlocked ? "#16A34A" : "#D97706" }}>
                      {isBlocked ? <UserCheck size={15} /> : <UserX size={15} />}
                    </button>
                    <button onClick={() => removeMember(user)} title="Delete" style={danger}><Trash2 size={15} /></button>
                  </div>
                )}
              </div>
              {index < users.length - 1 && <div style={{ height: 1, background: "#E5EAF1" }} />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const card = { background: "#fff", border: "1px solid #D9E2EC", borderRadius: 10, padding: "24px 28px", marginBottom: 20 };
const title = { color: "#1C2433", fontSize: 20, fontWeight: 700, marginBottom: 6 } as const;
const muted = { color: "#667085", fontSize: 14, lineHeight: 1.6 } as const;
const label = { display: "block", fontSize: 12, fontWeight: 600, color: "#667085", marginBottom: 4 } as const;
const input: React.CSSProperties = { padding: "10px 14px", borderRadius: 8, border: "1px solid #D9E2EC", fontSize: 14, outline: "none", fontFamily: "Inter, sans-serif", width: "100%", boxSizing: "border-box" };
const btn: React.CSSProperties = { display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "10px 18px", borderRadius: 8, border: "none", background: "#2F80ED", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "Inter, sans-serif", whiteSpace: "nowrap" };
const ghost: React.CSSProperties = { background: "none", border: "1px solid #D9E2EC", color: "#667085", cursor: "pointer", padding: "5px 8px", borderRadius: 6, display: "inline-flex", alignItems: "center", justifyContent: "center" };
const danger: React.CSSProperties = { background: "none", border: "none", color: "#F04438", cursor: "pointer", padding: 4, display: "inline-flex", alignItems: "center" };
const err: React.CSSProperties = { background: "#FEF3F2", border: "1px solid #FDA29B", color: "#B42318", borderRadius: 10, padding: 12, fontWeight: 700, fontSize: 13 };
