import React from 'react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import { Card } from './Card';
import { TrendingUp } from 'lucide-react';
import { ChartTooltip } from './ChartTooltip';
import { fontInfo, getFont } from '../../../utils/helpers/getFont';


interface ChartDataPoint {
    day: string;
    clicks: number;
}

interface ClicksChartProps {
    chartData: ChartDataPoint[];
    totalClicks: number;

}

const ChartSection: React.FC<ClicksChartProps> = ({
    chartData,
    totalClicks,

}) => {
    return (
        <Card className='p-6'>
            <div className='flex items-center justify-between mb-4'>
                <div>
                    <h2 style={getFont(fontInfo.F.size.lg, fontInfo.F.weight.bold, { color: fontInfo.C.textPrimary, margin: 0 })}>
                        Clicks over time
                    </h2>
                    <p style={getFont(fontInfo.F.size.sm, fontInfo.F.weight.normal, { color: fontInfo.C.textMuted, marginTop: 3, marginBottom: 0 })}>
                        Daily click volume
                    </p>
                </div>
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    background: fontInfo.C.primaryBg,
                    border: `1px solid ${fontInfo.C.primaryBorder}`,
                    borderRadius: fontInfo.R.full,
                    padding: "5px 12px",
                    ...getFont(fontInfo.F.size.sm, fontInfo.F.weight.semibold, { color: fontInfo.C.primary }),
                }}>
                    <TrendingUp size={12} /> {totalClicks} total
                </div>
            </div>
            <ResponsiveContainer width="100%" height={210}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#081C45" stopOpacity={0.15} />
                            <stop offset="100%" stopColor="#081C45" stopOpacity={0.01} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke={fontInfo.C.chartGrid} />
                    <XAxis
                        dataKey="day"
                        tick={{ fill: fontInfo.C.textMuted, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                    />
                    <YAxis
                        tick={{ fill: fontInfo.C.textMuted, fontSize: 11 }}
                        axisLine={false}
                        tickLine={false}
                        allowDecimals={false}
                    />
                    <Tooltip content={<ChartTooltip />} />
                    <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke={fontInfo.C.chartLine}
                        strokeWidth={2.5}
                        fill="url(#areaGrad)"
                        dot={{ r: 3, fill: "#fff", stroke: fontInfo.C.chartLine, strokeWidth: 2 }}
                        activeDot={{ r: 5, fill: fontInfo.C.chartLine, stroke: "#fff", strokeWidth: 2 }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </Card>
    );
};

export default ChartSection;
