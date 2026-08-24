import { useEffect, useState } from "react";
import { DatabaseBackup, RotateCcw } from "lucide-react";
import { BackupFile, BackupStatus, createBackup, getBackupStatus, listBackups, restoreBackup } from "../../services/backups";

function formatBytes(value: number) {
    if (value < 1024) return `${value} B`;
    if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
    return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function InfoTile({ label, value, tone = "neutral" }: { label: string; value: string; tone?: "neutral" | "good" | "warn" }) {
    const colorClass = tone === "good" ? "text-[#12B76A]" : tone === "warn" ? "text-[#F79009]" : "text-[#1C2433]";
    return (
        <div className="bg-[#F8FAFC] border border-[#D9E2EC] rounded-xl p-3.5 min-w-0">
            <div className="text-[#667085] text-[12px] font-extrabold mb-1.5 uppercase tracking-wider">{label}</div>
            <div className={`${colorClass} text-sm font-black truncate`}>{value}</div>
        </div>
    );
}

export function BackupSection() {
    const [status, setStatus] = useState<BackupStatus | null>(null);
    const [backups, setBackups] = useState<BackupFile[]>([]);
    const [loading, setLoading] = useState(true);
    const [working, setWorking] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function load(silent = false) {
        if (!silent) setLoading(true);
        setError(null);
        try {
            const [nextStatus, nextBackups] = await Promise.all([getBackupStatus(), listBackups()]);
            setStatus(nextStatus);
            setBackups(nextBackups);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Could not load backups");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => { load(); }, []);

    async function runBackup() {
        setWorking("backup");
        setError(null);
        try {
            setBackups(await createBackup());
            await load(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Backup failed");
        } finally {
            setWorking("");
        }
    }

    async function runRestore(file: BackupFile) {
        if (!confirm(`Restore ${file.name}? This can replace current database data. Create a fresh backup first if you are unsure.`)) return;
        setWorking(file.name);
        setError(null);
        try {
            await restoreBackup(file.name);
            alert("Restore completed. Restart the backend if you restored JSON fallback data.");
            await load(true);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Restore failed");
        } finally {
            setWorking("");
        }
    }

    return (
        <div className="space-y-5">
            <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 shadow-sm">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h2 className="text-[#1C2433] text-xl font-bold mb-1.5">Backups</h2>
                        <p className="text-[#667085] text-sm leading-relaxed">Create encrypted backups, restore previous snapshots, and verify retention settings.</p>
                    </div>
                    <button
                        onClick={runBackup}
                        disabled={Boolean(working)}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-md bg-[#081C45] text-white font-bold text-sm cursor-pointer active:scale-[0.98] transition-all disabled:opacity-65 shadow-sm shrink-0"
                    >
                        <DatabaseBackup size={15} /> {working === "backup" ? "Creating..." : "Create backup now"}
                    </button>
                </div>

                {status && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mt-4.5">
                        <InfoTile label="Encrypted" value={status.encrypted ? "Enabled" : "Not configured"} tone={status.encrypted ? "good" : "warn"} />
                        <InfoTile label="Retention" value={`${status.retentionDays} days`} />
                        <InfoTile label="Scheduled" value={status.scheduled ? `Daily ${status.scheduleTime}` : "Off"} tone={status.scheduled ? "good" : "warn"} />
                        <InfoTile label="Remote copy" value={status.remoteBackupDir || "Not configured"} tone={status.remoteBackupDir ? "good" : "warn"} />
                    </div>
                )}

                {status && (
                    <div className="mt-3.5 bg-[#F4F7FB] border border-[#D9E2EC] rounded-lg p-3.5 font-mono text-[13px] text-[#1C2433] grid gap-1">
                        <div><strong>Backup folder:</strong> {status.backupDir}</div>
                        <div><strong>Tip:</strong> set ZIPLIN_BACKUP_PASSPHRASE and ZIPLIN_REMOTE_BACKUP_DIR in .env, then restart.</div>
                    </div>
                )}
            </div>

            {error && (
                <div className="bg-[#FEF3F2] border border-[#FDA29B] text-[#B42318] rounded-xl p-3.5 font-bold text-sm">
                    {error}
                </div>
            )}

            {loading ? <div className="bg-white border border-[#D9E2EC] rounded-xl p-4.5 text-[#667085] text-sm">Loading backups...</div> : null}

            <div className="bg-white border border-[#D9E2EC] rounded-xl p-6 md:p-7 shadow-sm">
                <h3 className="text-[#1C2433] text-base font-bold mb-4">Available backups</h3>
                {!backups.length && !loading ? (
                    <p className="text-[#667085] text-sm leading-relaxed">No backups yet. Create one now to protect the current database.</p>
                ) : null}
                <div className="divide-y divide-[#D9E2EC]">
                    {backups.map((backup) => (
                        <div key={backup.name} className="py-3 flex flex-col sm:grid sm:grid-cols-[2fr_100px_100px_120px_100px] gap-3 items-start sm:items-center text-sm">
                            <div className="min-w-0">
                                <strong className="color-[#1C2433] block truncate" title={backup.name}>{backup.name}</strong>
                                <span className="text-[#667085] text-xs">{new Date(backup.updatedAt).toLocaleString()}</span>
                            </div>
                            <div>
                                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${backup.kind === "postgres" ? "bg-[#EAFBF3] text-[#12B76A]" : "bg-[#FFF7EC] text-[#F79009]"}`}>
                                    {backup.kind}
                                </span>
                            </div>
                            <span className="text-[#667085]">{formatBytes(backup.size)}</span>
                            <span className={`font-extrabold text-[13px] ${backup.encrypted ? "text-[#12B76A]" : "text-[#F79009]"}`}>
                                {backup.encrypted ? "Encrypted" : "Plain"}
                            </span>
                            <button
                                onClick={() => runRestore(backup)}
                                disabled={Boolean(working)}
                                className="inline-flex items-center gap-1 text-[#081C45] cursor-pointer font-bold text-sm disabled:opacity-65"
                            >
                                <RotateCcw size={14} /> Restore
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

