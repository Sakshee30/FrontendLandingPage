import { useEffect, useState } from "react";
import { createPreviewSite, deletePreviewSite, LinkPreviewSite, listPreviewSites } from "../../services/linkPreviews";
import { HelpButton } from "../HelpButton";
import RegistarCard from "./RegistarCard";
import ScriptsCard from "./ScriptsCard";

export function LinkPreviews() {
    const [sites, setSites] = useState<LinkPreviewSite[]>([]);
    const [domain, setDomain] = useState("");
    const [placement, setPlacement] = useState("bottom-right");
    const [status, setStatus] = useState("");

    async function load() {
        setSites(await listPreviewSites());
    }

    useEffect(() => { load(); }, []);

    async function addSite() {
        try {
            const site = await createPreviewSite({ domain, placement });
            setSites((current) => [site, ...current]);
            setDomain("");
            setStatus("Preview script generated.");
        } catch (error) {
            setStatus(error instanceof Error ? error.message : "Could not create script");
        }
    }

    async function remove(id: string) {
        await deletePreviewSite(id);
        setSites((current) => current.filter((site) => site.id !== id));
    }

    function scriptFor(site: LinkPreviewSite) {
        return `<script src="${window.location.origin}/preview/script/${site.scriptKey}.js" async></script>`;
    }

    return (
        <div className="p-8 font-sans bg-slate-50/30 min-h-screen max-w-[1600px]">
            <h1 className="text-2xl font-bold text-slate-800 m-0 flex items-center gap-2">
                Live Link Previews <HelpButton topicId="previews" label="Link Previews" />
            </h1>
            <p className="text-sm text-slate-500 mt-1 m-0">
                Install one script on any site to show hover previews for links automatically.
            </p>

            <RegistarCard domain={domain} placement={placement} status={status} setDomain={setDomain} setPlacement={setPlacement} addSite={addSite} />
            <ScriptsCard remove={remove} scriptFor={scriptFor} sites={sites} />
        </div>
    );
}
