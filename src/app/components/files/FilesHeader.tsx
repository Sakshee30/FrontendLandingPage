import { FileUp } from "lucide-react";
import { HelpButton } from "../HelpButton";

interface Props {
    onUpload: (file: File) => void;
}

export default function FileHeader({ onUpload }: Props) {
    return (
        <>
            <div className="flex flex-col md:flex-row justify-between items-start gap-5 mb-6 w-full">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 m-0 flex items-center gap-2">
                        Files <HelpButton topicId="files" label="Files" />
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 m-0">
                        Upload files, share branded download pages, and track downloads.
                    </p>
                </div>
                <label className="inline-flex items-center gap-2 bg-[#081C45] text-white px-5 py-2.5 rounded-md text-sm font-bold cursor-pointer transition-colors shadow-sm focus:outline-none">
                    <FileUp size={16} /> Upload file
                    <input type="file" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) { onUpload(file); event.target.value = ""; } }} />
                </label>
            </div>
        </>
    )
}
