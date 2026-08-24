import formatTime from "../../../utils/helpers/formatTime";

interface Props {
    stats: any;
    clicks: any;
}
export default function AnalyticsTable({ stats, clicks }: Props) {
    return (
        <>
            <div className="overflow-auto rounded-[10px] border border-[#D9E2EC] bg-white">
                <div className='p-6'>
                    <h2 className="mb-4 text-[18px] font-bold text-[#1C2433]">Recent Clicks</h2>
                    <p className="text-[#667085] text-[13px]">
                        {stats.totalLinks} links are being tracked.
                    </p>
                </div>
                <table
                    className="w-full border-collapse"
                >
                    <thead>
                        <tr className="border-b border-[#D9E2EC]">
                            {[
                                'Time',
                                'Slug',
                                'Country',
                                'City',
                                'Device',
                                'Browser',
                                'Referrer',
                                'IP',
                            ].map((col) => (
                                <th key={col} className="px-4 py-[10px] text-left text-[13px] font-semibold text-[#667085]">
                                    {col}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {clicks.slice(0, 30).map((row: any) => (
                            <tr key={row.id} className="border-b border-[#D9E2EC]">
                                <td className="px-4 py-3 text-[13px] text-[#1C2433]">{formatTime(row.clickedAt)}</td>
                                <td className="px-4 py-3 text-[13px] text-[#1C2433]">/{row.slug}</td>
                                <td className="px-4 py-3 text-[13px] text-[#1C2433]">{row.country || '-'}</td>
                                <td className="px-4 py-3 text-[13px] text-[#1C2433]">{row.city || '-'}</td>
                                <td className="px-4 py-3 text-[13px] text-[#1C2433]">{row.device || '-'}</td>
                                <td className="px-4 py-3 text-[13px] text-[#1C2433]">{row.browser || '-'}</td>
                                <td className="px-4 py-3 text-[13px] text-[#1C2433]">{row.referrer || 'Direct'}</td>
                                <td className="px-4 py-3 text-[13px] text-[#1C2433]">
                                    {row.ip || '-'}
                                </td>
                            </tr>
                        ))}
                        {!clicks.length && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-4 py-3 text-[13px] text-[#1C2433]"
                                >
                                    No clicks match these filters.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </>
    )
}