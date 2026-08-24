import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { createUser, deleteUser, listUsers, updateUser } from "../../services/team";
import { AuthUser, Role } from "../../services/auth";

const workspaceRoles = [
    { value: "admin", label: "Admin" },
    { value: "user", label: "User" },
] as const;

type WorkspaceRole = (typeof workspaceRoles)[number]["value"];

export function TeamSection() {
    const [users, setUsers] = useState<AuthUser[]>([]);
    const [form, setForm] = useState({ name: "", email: "", role: "user" as WorkspaceRole, password: "user123" });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

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

        try {
            const user = await createUser(form);
            setUsers((current) => [...current, user]);
            setForm({ name: "", email: "", role: "user", password: "user123" });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not create user");
        }
    }

    async function changeRole(user: AuthUser, role: Role) {
        try {
            const updated = await updateUser(user.id, { name: user.name, role });
            setUsers((current) => current.map((item) => item.id === updated.id ? updated : item));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Could not update role");
        }
    }

    async function removeMember(user: AuthUser) {
        if (!confirm(`Delete ${user.email}?`)) return;
        try {
            await deleteUser(user.id);
            setUsers((current) => current.filter((item) => item.id !== user.id));
        } catch (err) {
            alert(err instanceof Error ? err.message : "Could not delete user");
        }
    }

    return (
        <div className="space-y-5">
            <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 shadow-sm">
                <h2 className="text-[#1C2433] text-xl font-bold mb-1.5">Team Members</h2>
                <p className="text-[#667085] text-sm leading-relaxed">Invite collaborators and control admin/user access.</p>
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_120px_130px_80px] gap-2.5 items-end">
                    <input
                        value={form.name}
                        onChange={(event) => setForm({ ...form, name: event.target.value })}
                        placeholder="Name"
                        className="px-3.5 py-2.5 rounded-lg border border-[#D9E2EC] text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
                    />
                    <input
                        value={form.email}
                        onChange={(event) => setForm({ ...form, email: event.target.value })}
                        placeholder="email@example.com"
                        className="px-3.5 py-2.5 rounded-lg border border-[#D9E2EC] text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
                    />
                    <select
                        value={form.role}
                        onChange={(event) => setForm({ ...form, role: event.target.value as WorkspaceRole })}
                        className="px-3.5 py-2.5 rounded-lg border border-[#D9E2EC] text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full cursor-pointer"
                    >
                        {workspaceRoles.map((role) => (
                            <option key={role.value} value={role.value}>{role.label}</option>
                        ))}
                    </select>
                    <input
                        value={form.password}
                        onChange={(event) => setForm({ ...form, password: event.target.value })}
                        placeholder="Password"
                        className="px-3.5 py-2.5 rounded-lg border border-[#D9E2EC] text-sm text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full"
                    />
                    <button
                        onClick={addMember}
                        className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-[#081C45] text-white font-bold text-sm cursor-pointer  active:scale-[0.98] transition-all shadow-sm"
                    >
                        Add
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-[#FEF3F2] border border-[#FDA29B] text-[#B42318] rounded-xl p-3.5 font-bold text-sm">
                    {error}
                </div>
            )}

            <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 shadow-sm">
                <h3 className="text-[#1C2433] text-base font-bold mb-4">Workspace users</h3>
                {loading ? <p className="text-[#667085] text-sm">Loading team...</p> : null}
                <div className="divide-y divide-[#D9E2EC]">
                    {users.map((user) => (
                        <div key={user.id} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3.5">
                            <strong className="flex-1 color-[#1C2433] text-sm">{user.name}</strong>
                            <span className="flex-1 text-[#667085] text-[13px]">{user.email}</span>
                            <select
                                value={user.role}
                                onChange={(event) => changeRole(user, event.target.value as Role)}
                                disabled={user.role === "owner"}
                                className="px-2 py-1 rounded-md border border-[#D9E2EC] text-xs text-slate-800 bg-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-28 cursor-pointer"
                            >
                                {user.role === "owner" && <option value="owner">Owner</option>}
                                {workspaceRoles.map((role) => (
                                    <option key={role.value} value={role.value}>{role.label}</option>
                                ))}
                            </select>
                            <button
                                onClick={() => removeMember(user)}
                                className="inline-flex items-center justify-center p-2 rounded-md text-[#F04438] hover:bg-[#FEF3F2] cursor-pointer active:scale-[0.98] transition-all"
                            >
                                <Trash2 size={15} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

