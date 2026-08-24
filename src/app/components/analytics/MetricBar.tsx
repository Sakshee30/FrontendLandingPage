export default function MetricBar({ name, percent }: { name: string; percent: number }) {
    return (
        <div>
            <div className="flex justify-between mb-2">
                <span className="text-[13px] text-[#1C2433]">{name}</span>
                <span className="text-[13px] font-semibold text-[#667085]">
                    {percent}%
                </span>
            </div>
            <div className="bg-[#EEF4FF] rounded-md h-2">
                <div
                    className="bg-[#2F80ED] rounded-md h-2"
                    style={{
                        width: `${percent}%`,
                    }}
                />
            </div>
        </div>
    );
}