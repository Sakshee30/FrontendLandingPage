import { Plus } from "lucide-react";
import { HelpButton } from "../HelpButton";
import { Dispatch, SetStateAction } from "react";
import { Campaign } from "../../services/campaigns";

interface CampaignHeaderProps {
    setEditing: Dispatch<SetStateAction<Campaign | null>>;
    setShowForm: Dispatch<SetStateAction<boolean>>;
}

export default function CampaignHeader({ setEditing, setShowForm }: CampaignHeaderProps) {
    return (
        <>
            <div className="flex flex-col gap-3 md:flex-row items-start justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800 m-0 flex items-center gap-2">
                        Campaigns <HelpButton topicId="campaigns" label="Campaigns" />
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 m-0">
                        Track UTM campaigns and measure link performance.
                    </p>
                </div>
                <button
                    onClick={() => { setEditing(null); setShowForm(true); }}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-md border-none bg-[#081C45] text-white font-bold text-sm cursor-pointer transition-colors focus:outline-none shadow-sm shadow-[#081C45]/10"
                >
                    <Plus size={16} /> New Campaign
                </button>
            </div>
        </>
    )
}
