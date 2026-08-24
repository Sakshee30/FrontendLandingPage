import { Check, Copy, Pencil, Trash2, X } from "lucide-react";
import { useState } from "react";
import formatBytes from "../../../utils/helpers/format-bytes";
import { FileAsset } from "../../services/files";

interface Props {
    files: FileAsset[];
    remove: (id: string) => void;
    update: (id: string, payload: {
        originalName?: string;
        slug?: string;
        description?: string;
        settings?: Record<string, unknown>;
    }) => Promise<void>;
}

function textSetting(file: FileAsset, key: string) {
    return String(file.settings?.[key] ?? "");
}

function boolSetting(file: FileAsset, key: string) {
    return Boolean(file.settings?.[key]);
}

export default function SharedFile({ files, remove, update }: Props) {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [draft, setDraft] = useState({
        originalName: "",
        slug: "",
        description: "",
        password: "",
        downloadLimit: "",
        subscribeGate: false,
    });

    function startEdit(file: FileAsset) {
        setEditingId(file.id);
        setDraft({
            originalName: file.originalName,
            slug: file.slug,
            description: file.description || textSetting(file, "pageDescription"),
            password: textSetting(file, "password"),
            downloadLimit: String(file.settings?.downloadLimit || ""),
            subscribeGate: boolSetting(file, "subscribeGate"),
        });
    }

    async function save(file: FileAsset) {
        setSavingId(file.id);
        try {
            await update(file.id, {
                originalName: draft.originalName,
                slug: draft.slug,
                description: draft.description,
                settings: {
                    ...(file.settings || {}),
                    title: draft.originalName,
                    pageDescription: draft.description,
                    password: draft.password,
                    downloadLimit: Number(draft.downloadLimit) || 0,
                    subscribeGate: draft.subscribeGate,
                },
            });
            setEditingId(null);
        } finally {
            setSavingId(null);
        }
    }

    return (
        <section className="bg-white border border-slate-200 rounded-xl p-5 mb-6 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-4 m-0">Shared files</h2>
            {!files.length ? (
                <p className="text-sm text-slate-400 font-medium py-2 m-0">
                    No files uploaded yet.
                </p>
            ) : (
                <div className="divide-y divide-slate-100">
                    {files.map((file) => (
                        <div key={file.id} className="py-3.5 first:pt-0 last:pb-0">
                            {editingId === file.id ? (
                                <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px_180px_auto] gap-3 items-end">
                                    <label className="text-xs font-bold text-slate-600">
                                        File name
                                        <input
                                            value={draft.originalName}
                                            onChange={(event) => setDraft((current) => ({ ...current, originalName: event.target.value }))}
                                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                        />
                                    </label>
                                    <label className="text-xs font-bold text-slate-600">
                                        Link slug
                                        <input
                                            value={draft.slug}
                                            onChange={(event) => setDraft((current) => ({ ...current, slug: event.target.value }))}
                                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                        />
                                    </label>
                                    <label className="text-xs font-bold text-slate-600">
                                        Password
                                        <input
                                            type="password"
                                            value={draft.password}
                                            onChange={(event) => setDraft((current) => ({ ...current, password: event.target.value }))}
                                            placeholder="Optional"
                                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                        />
                                    </label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => save(file)}
                                            disabled={savingId === file.id}
                                            className="inline-flex items-center justify-center rounded-lg bg-[#081C45] text-white border-none w-10 h-10 cursor-pointer disabled:opacity-50"
                                            title="Save file settings"
                                        >
                                            <Check size={16} />
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setEditingId(null)}
                                            className="inline-flex items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 w-10 h-10 cursor-pointer"
                                            title="Cancel"
                                        >
                                            <X size={16} />
                                        </button>
                                    </div>
                                    <label className="text-xs font-bold text-slate-600 lg:col-span-2">
                                        Description
                                        <input
                                            value={draft.description}
                                            onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                        />
                                    </label>
                                    <label className="text-xs font-bold text-slate-600">
                                        Download limit
                                        <input
                                            type="number"
                                            min="0"
                                            value={draft.downloadLimit}
                                            onChange={(event) => setDraft((current) => ({ ...current, downloadLimit: event.target.value }))}
                                            placeholder="0 unlimited"
                                            className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm"
                                        />
                                    </label>
                                    <label className="inline-flex items-center gap-2 text-xs font-bold text-slate-600 pb-2">
                                        <input
                                            type="checkbox"
                                            checked={draft.subscribeGate}
                                            onChange={(event) => setDraft((current) => ({ ...current, subscribeGate: event.target.checked }))}
                                        />
                                        Subscribe gate
                                    </label>
                                </div>
                            ) : (
                                <div className="flex items-center gap-3">
                                    <div className="flex-1 min-w-0">
                                        <strong className="block text-sm font-semibold text-slate-800 truncate">
                                            {file.originalName}
                                        </strong>
                                        <div className="text-xs text-slate-500 font-medium mt-0.5">
                                            {file.mimeType} - {formatBytes(file.sizeBytes)} - {file.downloadCount} downloads
                                            {file.settings?.password ? " - password protected" : ""}
                                        </div>
                                    </div>
                                    <a
                                        href={file.shortUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-blue-600 hover:text-blue-700 text-sm font-semibold max-w-[320px] truncate leading-none"
                                    >
                                        {file.shortUrl}
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => navigator.clipboard.writeText(file.shortUrl)}
                                        className="bg-transparent border-none cursor-pointer text-blue-600 hover:text-blue-700 p-1.5 focus:outline-none transition-colors rounded-lg"
                                        title="Copy file link"
                                    >
                                        <Copy size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => startEdit(file)}
                                        className="bg-transparent border-none cursor-pointer text-slate-500 hover:text-[#081C45] p-1.5 focus:outline-none transition-colors rounded-lg"
                                        title="Edit file link"
                                    >
                                        <Pencil size={15} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => remove(file.id)}
                                        className="bg-transparent border-none cursor-pointer text-red-500 hover:text-red-650 p-1.5 focus:outline-none transition-colors rounded-lg"
                                        title="Delete file"
                                    >
                                        <Trash2 size={15} />
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

