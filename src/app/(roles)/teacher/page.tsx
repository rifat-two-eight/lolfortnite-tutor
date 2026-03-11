"use client";

import React from "react";
import { Users, GraduationCap, ChevronDown } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    XAxis,
    YAxis,
} from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import Image from "next/image";

const ratingChartData = [
    { day: "Sun", rating: 4.0 },
    { day: "Mon", rating: 4.2 },
    { day: "Tue", rating: 4.1 },
    { day: "Wed", rating: 4.4 },
    { day: "Thu", rating: 4.3 },
    { day: "Fri", rating: 4.6 },
    { day: "Sat", rating: 4.5 },
]

const ratingChartConfig = {
    rating: {
        label: "Rating",
        color: "#0A47C2",
    },
} satisfies ChartConfig

const earningChartData = [
    { day: "Sun", mobile: 60000, desktop: 80000 },
    { day: "Mon", mobile: 140000, desktop: 120000 },
    { day: "Tue", mobile: 100000, desktop: 150000 },
    { day: "Wed", mobile: 80000, desktop: 90000 },
    { day: "Thu", mobile: 120000, desktop: 130000 },
    { day: "Fri", mobile: 60000, desktop: 110000 },
    { day: "Sat", mobile: 30000, desktop: 80000 },
]

const earningChartConfig = {
    desktop: {
        label: "Desktop",
        color: "#0A47C2",
    },
    mobile: {
        label: "Mobile",
        color: "rgba(10, 71, 194, 0.3)",
    },
} satisfies ChartConfig

export default function TeacherDashboard() {
    return (
        <div className="p-8 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 flex items-center justify-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 rounded-none">
                    <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-none text-[#0A47C2]">
                        <Image src="/active.svg" alt="Active" width={24} height={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">19</p>
                        <p className="text-sm text-gray-400 font-sans">Active Class</p>
                    </div>
                </div>

                <div className="bg-white p-8 flex items-center justify-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 rounded-none">
                    <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-none text-[#0A47C2]">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">1,674,767</p>
                        <p className="text-sm text-gray-400 font-sans">Total Student</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Overall Class Rating */}
                <div className="bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 rounded-none space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-[#0D1C35] font-sans">Overall Class Rating</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-sans cursor-pointer">
                            This week <ChevronDown size={14} />
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-4">
                        <div className="bg-blue-50 p-11 flex flex-col items-center justify-center w-full sm:min-w-[160px] lg:min-w-[200px] rounded-none">
                            <span className="text-5xl lg:text-6xl font-medium text-[#0D1C35] font-sans">4.6</span>
                            <div className="flex gap-1 mt-2">
                                {[1, 2, 3, 4].map(s => (
                                    <svg key={s} width="16" height="16" viewBox="0 0 12 12" fill="#F59E0B">
                                        <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
                                    </svg>
                                ))}
                                <svg width="16" height="16" viewBox="0 0 12 12" fill="#D1D5DB">
                                    <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
                                </svg>
                            </div>
                            <span className="text-xs text-gray-400 mt-2 font-sans font-bold text-center">Overall Rating</span>
                        </div>

                        {/* Overall Rating Wavy Area Chart */}
                        <div className="w-full flex-1 h-32 lg:h-48 relative mt-4 sm:mt-0">
                            <ChartContainer config={ratingChartConfig} className="h-full w-full">
                                <AreaChart
                                    data={ratingChartData}
                                    margin={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                >
                                    <ChartTooltip
                                        cursor={false}
                                        content={<ChartTooltipContent hideLabel indicator="line" />}
                                    />
                                    <Area
                                        dataKey="rating"
                                        type="monotone"
                                        fill="var(--color-rating)"
                                        fillOpacity={0.1}
                                        stroke="var(--color-rating)"
                                        strokeWidth={2}
                                    />
                                </AreaChart>
                            </ChartContainer>
                        </div>
                    </div>

                    {/* Star Breakdown */}
                    <div className="space-y-4 pt-8">
                        {[
                            { stars: 5, percent: 56 },
                            { stars: 4, percent: 37 },
                            { stars: 3, percent: 8 },
                            { stars: 2, percent: 1 },
                            { stars: 1, percent: "<1" },
                        ].map((item) => (
                            <div key={item.stars} className="flex items-center gap-6 lg:gap-10 w-full">
                                <div className="flex gap-1.5 w-40 shrink-0">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} width="16" height="16" viewBox="0 0 12 12" fill={i < item.stars ? "#0A47C2" : "#D1D5DB"}>
                                            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
                                        </svg>
                                    ))}
                                    <span className="text-sm text-gray-400 font-sans ml-2">{item.stars} Star</span>
                                </div>
                                <div className="flex-1 h-4 bg-gray-100 overflow-hidden rounded-none">
                                    <div
                                        style={{ width: typeof item.percent === 'number' ? `${item.percent}%` : '0.5%' }}
                                        className="h-full bg-[#0A47C2] rounded-none"
                                    />
                                </div>
                                <span className="text-sm text-gray-400 font-sans w-12 text-right font-medium shrink-0">{item.percent}%</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Total Earning */}
                <div className="bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 rounded-none space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-[#0D1C35] font-sans">Total Earning</h3>
                        <div className="flex items-center gap-1 text-xs text-gray-400 font-sans cursor-pointer">
                            This week <ChevronDown size={14} />
                        </div>
                    </div>

                    <div className="relative pt-4">
                        {/* Earning Chart Placeholder (Styled like Figma) */}
                        <div className="w-full aspect-4/3 relative flex flex-col justify-between pt-4">
                            {/* Grid Lines */}
                            {[100, 75, 50, 25, 0].map(val => (
                                <div key={val} className="flex items-center gap-4 w-full">
                                    <span className="text-[10px] text-gray-300 w-8 font-sans">
                                        {val === 100 ? "1m" : val === 75 ? "500k" : val === 50 ? "100k" : val === 25 ? "50k" : val === 0 ? "10k" : "0"}
                                    </span>
                                    <div className="flex-1 h-px bg-gray-50" />
                                </div>
                            ))}

                            {/* Shadcn Area Chart for Earnings */}
                            <div className="absolute inset-0 left-8 top-8">
                                <ChartContainer config={earningChartConfig} className="h-full w-full">
                                    <AreaChart
                                        data={earningChartData}
                                        margin={{ left: 0, right: 0, top: 10, bottom: 0 }}
                                    >
                                        <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                        <ChartTooltip
                                            cursor={false}
                                            content={<ChartTooltipContent indicator="dot" />}
                                        />
                                        <Area
                                            dataKey="mobile"
                                            type="monotone"
                                            fill="none"
                                            stroke="var(--color-mobile)"
                                            strokeWidth={3}
                                        />
                                        <Area
                                            dataKey="desktop"
                                            type="monotone"
                                            fill="none"
                                            stroke="var(--color-desktop)"
                                            strokeWidth={3}
                                        />
                                    </AreaChart>
                                </ChartContainer>
                            </div>

                            {/* X-Axis labels */}
                            <div className="flex items-center justify-between pl-12 pt-4">
                                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
                                    <span key={day} className="text-[10px] text-gray-300 font-sans">{day}</span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
