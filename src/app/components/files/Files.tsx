import { useEffect, useState } from "react";
import { deleteFile, FileAsset, listFiles, updateFile, uploadFile } from "../../services/files";
import FileHeader from "./FilesHeader";
import DownloadCard from "./DownloadCard";
import SharedFile from "./SharedFile";

function readAsDataUrl(file: File) {
    return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ""));
        reader.onerror = () => reject(reader.error);
        reader.readAsDataURL(file);
    });
}


export default function Files() {
    const [files, setFiles] = useState<FileAsset[]>([]);
    const [description, setDescription] = useState("");
    const [password, setPassword] = useState("");
    const [downloadLimit, setDownloadLimit] = useState("");
    const [subscribeGate, setSubscribeGate] = useState(false);
    const [status, setStatus] = useState("");

    async function load() {
        setFiles(await listFiles());
    }

    useEffect(() => { load(); }, []);

    async function onUpload(file?: File) {
        if (!file) return;
        setStatus("Uploading file...");
        try {
            const base64 = await readAsDataUrl(file);
            const saved = await uploadFile({
                originalName: file.name,
                mimeType: file.type || "application/octet-stream",
                base64,
                description,
                settings: {
                    title: file.name,
                    pageDescription: description,
                    password,
                    downloadLimit: Number(downloadLimit) || 0,
                    subscribeGate,
                },
            });
            setFiles((current) => [saved, ...current]);
            setDescription("");
            setPassword("");
            setDownloadLimit("");
            setSubscribeGate(false);
            setStatus("File uploaded and branded download page created.");
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Upload failed");
        }
    }

    async function remove(id: string) {
        if (!confirm("Delete this file?")) return;
        await deleteFile(id);
        setFiles((current) => current.filter((file) => file.id !== id));
    }

    async function updateSharedFile(
        id: string,
        payload: Parameters<typeof updateFile>[1],
    ) {
        try {
            setStatus("Saving file link settings...");
            const saved = await updateFile(id, payload);
            setFiles((current) => current.map((file) => file.id === id ? saved : file));
            setStatus("File link settings updated.");
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "File update failed");
            throw error;
        }
    }

    return (
        <div className="p-8 font-sans bg-slate-50/30 min-h-screen max-w-[1600px]">
            <FileHeader onUpload={onUpload} />
            <DownloadCard
                description={description}
                password={password}
                downloadLimit={downloadLimit}
                subscribeGate={subscribeGate}
                status={status}
                setDescription={setDescription}
                setPassword={setPassword}
                setDownloadLimit={setDownloadLimit}
                setSubscribeGate={setSubscribeGate}
                setStatus={setStatus}
            />
            <SharedFile files={files} remove={remove} update={updateSharedFile} />
        </div>
    );
}
