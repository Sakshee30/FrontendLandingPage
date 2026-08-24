import React from "react";
import { Zap } from "lucide-react";
import { HelpButton } from "../HelpButton";

interface HeaderComponentProps {
    user?: any;
    today: string;
    onCreateLink: () => void;
    getGreeting: () => string;
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    user,
    today,
    onCreateLink,
    getGreeting,
}) => {
    return (
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
                <h1 className="m-0 text-2xl font-bold tracking-[-0.5px] text-slate-900">
                    {getGreeting()}
                    {user?.name ? `, ${user.name.split(" ")[0]}` : ""} 👋
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                    {today} · Here's what's happening with your links.
                </p>
            </div>
            <div className="flex items-center gap-2">
                <button
                    onClick={onCreateLink}
                    className="flex items-center gap-1.5 rounded-md bg-[#081C45] px-4 py-2 text-sm font-bold text-white transition-all hover:bg-[#0E2F73]"
                >
                    <Zap size={14} />
                    Create Link
                </button>
                <HelpButton
                    topicId="create-link"
                    label="Create Link"
                />
            </div>
        </div>
    );
};

export default HeaderComponent;
