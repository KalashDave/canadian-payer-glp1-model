"use client"

import {
    ComposedChart,
    Line,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface ChartData {
    year: number;
    net_budget_impact: number;
    cumulative_uptake: number;
}

interface ImpactChartProps {
    data: ChartData[];
}

export function ImpactChart({ data }: ImpactChartProps) {
    return (
        <Card className="col-span-4 lg:col-span-3 h-full min-h-[400px]">
            <CardHeader>
                <CardTitle>5-Year Budget Impact Forecast</CardTitle>
                <CardDescription>
                    Net Budget Impact (Bars) vs. Population Uptake (Line)
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
                <div className="h-[350px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart
                            data={data}
                            margin={{
                                top: 20,
                                right: 20,
                                bottom: 20,
                                left: 20,
                            }}
                        >
                            <CartesianGrid stroke="#f5f5f5" vertical={false} />
                            <XAxis
                                dataKey="year"
                                scale="band"
                                tickMargin={10}
                                tickFormatter={(val) => `Year ${val}`}
                            />
                            <YAxis
                                yAxisId="left"
                                orientation="left"
                                tickFormatter={(val) => `$${(val / 1000000).toFixed(1)}M`}
                            />
                            <YAxis
                                yAxisId="right"
                                orientation="right"
                                unit="%"
                                tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
                            />
                            <Tooltip
                                formatter={(value: number, name: string) => {
                                    if (name === "Net Impact") return `$${value.toLocaleString()}`;
                                    if (name === "Uptake") return `${(value * 100).toFixed(1)}%`;
                                    return value;
                                }}
                                labelFormatter={(label) => `Year ${label}`}
                            />
                            <Legend />
                            <Bar
                                yAxisId="left"
                                dataKey="net_budget_impact"
                                name="Net Impact"
                                barSize={50}
                                fill="#0f172a"
                                radius={[4, 4, 0, 0]}
                            />
                            <Line
                                yAxisId="right"
                                type="monotone"
                                dataKey="cumulative_uptake"
                                name="Uptake"
                                stroke="#2563eb"
                                strokeWidth={3}
                                dot={{ r: 4, strokeWidth: 2 }}
                            />
                        </ComposedChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    )
}
