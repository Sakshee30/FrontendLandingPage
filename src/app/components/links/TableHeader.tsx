import { TOKEN_COLOR } from "../../../utils/constants/colors.constants";

interface TableHeaderProps {
    allVisibleSelected: boolean;
    onToggleAllVisible: () => void;
}

const headerCell = {
    fontSize: 10,
    fontWeight: 900,
    color: TOKEN_COLOR.FAINT,
    textTransform: "uppercase" as const,
    letterSpacing: "0.03em",
};

export const TableHeader: React.FC<TableHeaderProps> = ({
    allVisibleSelected,
    onToggleAllVisible,
}) => {
    return (
        <div
            className="hidden lg:grid"
            style={{
                gridTemplateColumns: "36px minmax(260px, 1.5fr) 110px 150px 130px 112px",
                alignItems: "center",
                columnGap: 16,
                padding: "12px 18px",
                background: "#F8FAFC",
                borderBottom: `1px solid ${TOKEN_COLOR.BORDER}`,
            }}
        >
            <input
                type="checkbox"
                checked={allVisibleSelected}
                onChange={onToggleAllVisible}
                style={{ width: 14, height: 14, accentColor: "#0B3B78", cursor: "pointer" }}
                aria-label="Select all visible links"
            />
            <div style={headerCell}>Link</div>
            <div style={{ ...headerCell, textAlign: "center" }}>Clicks</div>
            <div style={headerCell}>Link Note</div>
            <div style={headerCell}>Channels</div>
            <div style={{ ...headerCell, textAlign: "right" }}>Actions</div>
        </div>
    );
};
