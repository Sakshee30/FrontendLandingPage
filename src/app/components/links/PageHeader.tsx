import React from "react";
import { Plus, RefreshCw } from "lucide-react";
import { TOKEN_COLOR } from "../../../utils/constants/colors.constants";

interface PageHeaderProps {
    linksCount: number;
    totalClicks: number;
    onRefresh: () => void;
    onCreateLink: () => void;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
    onRefresh,
    onCreateLink,
}) => {
    return (
        <div
            className="sticky top-0 z-40 flex h-auto items-center gap-4 bg-white px-4 py-3 md:h-[70px] md:px-8"
            style={{
                borderBottom: `1px solid ${TOKEN_COLOR.BORDER}`,
            }}
        >
            <div>
                <h1
                    className="m-0 text-[22px] font-extrabold leading-[1.2]"
                    style={{ color: TOKEN_COLOR.TEXT }}
                >
                    Links Management
                </h1>
                <p
                    className="m-0 text-xs md:text-[13px]"
                    style={{ color: TOKEN_COLOR.MUTED }}
                >
                    Manage and optimize your shortened URLs and redirects
                </p>
            </div>
            <div className="ml-auto flex flex-col gap-2 md:flex-row">
                <button
                    onClick={onRefresh}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded border bg-white px-[14px] py-2 text-[13px] font-semibold"
                    style={{
                        borderColor: TOKEN_COLOR.BORDER,
                        color: TOKEN_COLOR.MUTED,
                    }}
                >
                    <RefreshCw size={13} />
                    Refresh
                </button>
                <button
                    onClick={onCreateLink}
                    className="flex cursor-pointer items-center justify-center gap-1.5 rounded border-0 px-[18px] py-[9px] text-[13px] font-bold text-white"
                    style={{
                        background: "#0B3B78",
                        boxShadow: "0 2px 8px rgba(11,59,120,0.2)",
                        whiteSpace: "nowrap",
                        minWidth: 150,
                    }}
                >
                    <Plus size={14} />
                    Create new link
                </button>
            </div>
        </div>
    );
};
