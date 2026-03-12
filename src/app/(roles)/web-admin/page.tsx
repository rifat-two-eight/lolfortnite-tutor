"use client";

import React from "react";
import { Users, GraduationCap, CreditCard, ArrowUpRight, ChevronDown } from "lucide-react";
import {
    Area,
    AreaChart,
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import Image from "next/image";

// Chart Data Types & Configs
const totalUserChartData = [
    { month: "Jan", user: 80000 },
    { month: "Feb", user: 65000 },
    { month: "Mar", user: 82000 },
    { month: "Apr", user: 68000 },
    { month: "May", user: 58000 },
    { month: "Jun", user: 45000 },
    { month: "Jul", user: 55000 },
    { month: "Aug", user: 42000 },
    { month: "Sep", user: 60000 },
    { month: "Oct", user: 52000 },
    { month: "Nov", user: 92000 },
    { month: "Dec", user: 78000 },
];

const totalUserChartConfig = {
    user: {
        label: "User",
        color: "#0A47C2",
    },
} satisfies ChartConfig;

const studentTeacherData = [
    { name: "Teacher", value: 35000, color: "#0A47C2" },
    { name: "Student", value: 24000, color: "#E5E7EB" },
];

const earningChartData = [
    { month: "Jan", earning: 55000 },
    { month: "Feb", earning: 40000 },
    { month: "Mar", earning: 58000 },
    { month: "Apr", earning: 42000 },
    { month: "May", earning: 30000 },
    { month: "Jun", earning: 32000 },
    { month: "Jul", earning: 48000 },
    { month: "Aug", earning: 35000 },
    { month: "Sep", earning: 45000 },
    { month: "Oct", earning: 38000 },
    { month: "Nov", earning: 55000 },
    { month: "Dec", earning: 48000 },
];

const payoutChartData = [
    { month: "Jan", payout: 55000 },
    { month: "Feb", payout: 40000 },
    { month: "Mar", payout: 58000 },
    { month: "Apr", payout: 42000 },
    { month: "May", payout: 30000 },
    { month: "Jun", payout: 32000 },
    { month: "Jul", payout: 48000 },
    { month: "Aug", payout: 35000 },
    { month: "Sep", payout: 42000 },
    { month: "Oct", payout: 32000 },
    { month: "Nov", payout: 52000 },
    { month: "Dec", payout: 45000 },
];

export default function AdminDashboard() {
    return (
        <div className="px-4 md:px-8 py-8 space-y-8 bg-[#F9FAFB]">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {/* Total Teacher */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Teacher</p>
                        <span className="text-[10px] text-amber-500 font-bold">+ 2k</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">7,670</p>
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Users size={16} className="text-amber-500" />
                        </div>
                    </div>
                </div>

                {/* Total Student */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Student</p>
                        <span className="text-[10px] text-green-500 font-bold">+ 0.5k</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">1,500</p>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <GraduationCap size={16} className="text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Total Earning */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Earning</p>
                        <span className="text-[10px] text-red-500 font-bold">+01k</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">$7,283</p>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <CreditCard size={16} className="text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Total Payout */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Payout</p>
                        <span className="text-[10px] text-green-500 font-bold">+ 0.1k</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">$6,000</p>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <ArrowUpRight size={16} className="text-green-500" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total User Line Chart */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-bold text-[#0D1C35] font-sans">Total User</h3>
                        <button className="flex items-center gap-1 text-[10px] px-2 py-1 border border-gray-100 rounded text-gray-400 font-sans">
                            2026 <ChevronDown size={12} />
                        </button>
                    </div>
                    <div className="h-[240px] w-full">
                        <ChartContainer config={totalUserChartConfig} className="h-full w-full">
                            <AreaChart data={totalUserChartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9CA3AF'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9CA3AF'}}
                                    tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="user" 
                                    stroke="#0A47C2" 
                                    strokeWidth={3} 
                                    fill="url(#colorUser)" 
                                />
                                <defs>
                                    <linearGradient id="colorUser" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0A47C2" stopOpacity={0.1}/>
                                        <stop offset="95%" stopColor="#0A47C2" stopOpacity={0}/>
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Total Student & Teacher Doughnut Chart */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                    <h3 className="text-sm font-bold text-[#0D1C35] font-sans mb-6">Total Student & Teacher</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-8 h-[240px]">
                        <div className="relative h-full aspect-square">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={studentTeacherData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={85}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {studentTeacherData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-2xl font-bold text-[#0D1C35]">59k</span>
                                <span className="text-[10px] text-gray-400">Total User</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            {studentTeacherData.map((item) => (
                                <div key={item.name} className="flex items-center gap-2">
                                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: item.color }} />
                                    <span className="text-[11px] text-gray-500 font-medium">{item.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total Earning Line Chart */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                    <h3 className="text-sm font-bold text-[#0D1C35] font-sans mb-6">Total Earning</h3>
                    <div className="h-[240px] w-full">
                        <ChartContainer config={{ earning: { label: "Earning", color: "#EF4444" } }} className="h-full w-full">
                            <AreaChart data={earningChartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9CA3AF'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9CA3AF'}}
                                    tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="earning" 
                                    stroke="#EF4444" 
                                    strokeWidth={3} 
                                    fill="none" 
                                    dot={{ r: 4, fill: "#EF4444", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Total Payout Line Chart */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50">
                    <h3 className="text-sm font-bold text-[#0D1C35] font-sans mb-6">Total Payout</h3>
                    <div className="h-[240px] w-full">
                        <ChartContainer config={{ payout: { label: "Payout", color: "#22C55E" } }} className="h-full w-full">
                            <AreaChart data={payoutChartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                                <XAxis 
                                    dataKey="month" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9CA3AF'}}
                                    dy={10}
                                />
                                <YAxis 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fontSize: 10, fill: '#9CA3AF'}}
                                    tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                                />
                                <ChartTooltip content={<ChartTooltipContent hideLabel />} />
                                <Area 
                                    type="monotone" 
                                    dataKey="payout" 
                                    stroke="#22C55E" 
                                    strokeWidth={3} 
                                    fill="none" 
                                    dot={{ r: 4, fill: "#22C55E", strokeWidth: 2, stroke: "#fff" }}
                                    activeDot={{ r: 6, strokeWidth: 0 }}
                                />
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
