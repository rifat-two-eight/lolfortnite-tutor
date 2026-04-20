"use client";

import React from "react";
import { Users, GraduationCap, CreditCard, ArrowUpRight, ChevronDown, DollarSign } from "lucide-react";
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
import { useEffect, useState, useMemo } from "react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface AdminStats {
    totalTeachers: number;
    totalStudents: number;
    totalEarning: number;
    totalPayout: number;
    totalRevenue: number;
}

interface RegistrationData {
    month: string;
    teachers: number;
    students: number;
    total: number;
}

interface PaymentData {
    month: string;
    revenue: number;
    earning: number;
    transactions: number;
}

interface WithdrawalData {
    month: string;
    payout: number;
    withdrawals: number;
}

// Chart Data Types & Configs

const totalUserChartConfig = {
    teachers: {
        label: "Teacher",
        color: "#0A47C2",
    },
    students: {
        label: "Student",
        color: "#E5E7EB",
    },
} satisfies ChartConfig;

const studentTeacherData = [
    { name: "Teacher", value: 35000, color: "#0A47C2" },
    { name: "Student", value: 24000, color: "#E5E7EB" },
];




export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [registrationStats, setRegistrationStats] = useState<RegistrationData[]>([]);
    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
    const [showYearDropdown, setShowYearDropdown] = useState(false);
    
    // Payment Stats (Earnings)
    const [paymentStats, setPaymentStats] = useState<PaymentData[]>([]);
    const [selectedPaymentYear, setSelectedPaymentYear] = useState(new Date().getFullYear());
    const [showPaymentYearDropdown, setShowPaymentYearDropdown] = useState(false);

    // Withdrawal Stats (Payouts)
    const [withdrawalStats, setWithdrawalStats] = useState<WithdrawalData[]>([]);
    const [selectedPayoutYear, setSelectedPayoutYear] = useState(new Date().getFullYear());
    const [showPayoutYearDropdown, setShowPayoutYearDropdown] = useState(false);

    const [loading, setLoading] = useState(true);

    const years = useMemo(() => {
        const currentYear = new Date().getFullYear();
        const yearList = [];
        for (let i = currentYear - 5; i <= currentYear + 5; i++) {
            yearList.push(i);
        }
        return yearList;
    }, []);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get("/dashboard/admin-stats");
                if (response.data.success) {
                    setStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching admin stats:", error);
            } finally {
                setLoading(false);
            }
        };

        const fetchRegistrationStats = async () => {
            try {
                const response = await api.get(`/dashboard/monthly-registration?year=${selectedYear}`);
                if (response.data.success) {
                    setRegistrationStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching registration stats:", error);
            }
        };

        fetchStats();
        fetchRegistrationStats();
    }, [selectedYear]);

    useEffect(() => {
        const fetchPaymentStats = async () => {
            try {
                const response = await api.get(`/dashboard/monthly-payments?year=${selectedPaymentYear}`);
                if (response.data.success) {
                    setPaymentStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching payment stats:", error);
            }
        };

        fetchPaymentStats();
    }, [selectedPaymentYear]);

    useEffect(() => {
        const fetchWithdrawalStats = async () => {
            try {
                const response = await api.get(`/dashboard/monthly-withdrawals?year=${selectedPayoutYear}`);
                if (response.data.success) {
                    setWithdrawalStats(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching withdrawal stats:", error);
            }
        };

        fetchWithdrawalStats();
    }, [selectedPayoutYear]);

    const studentTeacherData = stats ? [
        { name: "Teacher", value: stats.totalTeachers, color: "#0A47C2" },
        { name: "Student", value: stats.totalStudents, color: "#E5E7EB" },
    ] : [
        { name: "Teacher", value: 35000, color: "#0A47C2" },
        { name: "Student", value: 24000, color: "#E5E7EB" },
    ];

    const totalUsers = stats ? stats.totalTeachers + stats.totalStudents : 0;
    const formatTotalUsers = (val: number) => {
        if (val >= 1000) return `${(val / 1000).toFixed(1)}k`;
        return val.toString();
    };

    if (loading) {
        return (
            <div className="px-4 md:px-8 py-8 space-y-8 bg-[#F9FAFB] min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A47C2]"></div>
            </div>
        );
    }
    return (
        <div className="px-4 md:px-8 py-8 space-y-8 bg-[#F9FAFB]">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                {/* Total Teacher */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Teacher</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">{stats?.totalTeachers.toLocaleString() || 0}</p>
                        <div className="p-2 bg-amber-50 rounded-lg">
                            <Users size={16} className="text-amber-500" />
                        </div>
                    </div>
                </div>

                {/* Total Student */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Student</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">{stats?.totalStudents.toLocaleString() || 0}</p>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <GraduationCap size={16} className="text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Total Earning */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Earning</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">{stats?.totalEarning.toLocaleString() || 0} KD</p>
                        <div className="p-2 bg-red-50 rounded-lg">
                            <CreditCard size={16} className="text-red-500" />
                        </div>
                    </div>
                </div>

                {/* Total Payout */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Payout</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">{stats?.totalPayout.toLocaleString() || 0} KD</p>
                        <div className="p-2 bg-green-50 rounded-lg">
                            <ArrowUpRight size={16} className="text-green-500" />
                        </div>
                    </div>
                </div>

                {/* Total Revenue */}
                {/* <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-between">
                    <div className="flex justify-between items-start">
                        <p className="text-xs text-gray-400 font-sans font-medium">Total Revenue</p>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">{stats?.totalRevenue.toLocaleString() || 0} KD</p>
                        <div className="p-2 bg-blue-50 rounded-lg">
                            <DollarSign size={16} className="text-blue-500" />
                        </div>
                    </div>
                </div> */}
            </div>

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total User Line Chart */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col min-h-[350px]">
                    <div className="flex justify-between items-center mb-6 relative">
                        <h3 className="text-sm font-bold text-[#0D1C35] font-sans">Total User</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowYearDropdown(!showYearDropdown)}
                                className="flex items-center gap-1 text-[10px] px-3 py-1.5 border border-gray-100 rounded-lg text-gray-500 font-sans hover:bg-gray-50 transition-all font-medium"
                            >
                                {selectedYear} <ChevronDown size={12} className={cn("transition-transform duration-200", showYearDropdown && "rotate-180")} />
                            </button>

                            {showYearDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowYearDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20 max-h-48 overflow-y-auto">
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => {
                                                    setSelectedYear(year);
                                                    setShowYearDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-3 py-1.5 text-[10px] font-sans transition-colors hover:bg-blue-50 hover:text-[#0A47C2]",
                                                    selectedYear === year ? "bg-blue-50 text-[#0A47C2] font-bold" : "text-gray-500"
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <ChartContainer config={totalUserChartConfig} className="h-full w-full">
                            <AreaChart data={registrationStats} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    tickFormatter={(val) => val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
                                />
                                <ChartTooltip content={<ChartTooltipContent indicator="line" />} />
                                <Area
                                    type="monotone"
                                    dataKey="teachers"
                                    stroke="#0A47C2"
                                    strokeWidth={3}
                                    fill="url(#colorTeachers)"
                                />
                                <Area
                                    type="monotone"
                                    dataKey="students"
                                    stroke="#E5E7EB"
                                    strokeWidth={3}
                                    fill="url(#colorStudents)"
                                />
                                <defs>
                                    <linearGradient id="colorTeachers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#0A47C2" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#0A47C2" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#E5E7EB" stopOpacity={0.1} />
                                        <stop offset="95%" stopColor="#E5E7EB" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                            </AreaChart>
                        </ChartContainer>
                    </div>
                </div>

                {/* Total Student & Teacher Doughnut Chart */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col justify-center items-center">
                    <h3 className="text-sm font-bold text-[#0D1C35] font-sans mb-6 w-full text-left">Total Student & Teacher</h3>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-12 h-[350px] w-full">
                        <div className="relative h-full aspect-square">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={studentTeacherData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={80}
                                        outerRadius={115}
                                        paddingAngle={0}
                                        dataKey="value"
                                        stroke="none"
                                    >
                                        {studentTeacherData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-3xl font-bold text-[#0D1C35]">{formatTotalUsers(totalUsers)}</span>
                                <span className="text-[10px] text-gray-400">Total User</span>
                            </div>
                        </div>
                        <div className="space-y-4">
                            {studentTeacherData.map((item) => (
                                <div key={item.name} className="flex items-center gap-3">
                                    <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: item.color }} />
                                    <div className="flex flex-col">
                                        <span className="text-[12px] text-gray-500 font-bold">{item.name}</span>
                                        <span className="text-[10px] text-gray-400 font-medium">{item.value.toLocaleString()} Users</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Total Earning Line Chart */}
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col min-h-[350px]">
                    <div className="flex justify-between items-center mb-6 relative">
                        <h3 className="text-sm font-bold text-[#0D1C35] font-sans">Total Earning</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowPaymentYearDropdown(!showPaymentYearDropdown)}
                                className="flex items-center gap-1 text-[10px] px-3 py-1.5 border border-gray-100 rounded-lg text-gray-500 font-sans hover:bg-gray-50 transition-all font-medium"
                            >
                                {selectedPaymentYear} <ChevronDown size={12} className={cn("transition-transform duration-200", showPaymentYearDropdown && "rotate-180")} />
                            </button>

                            {showPaymentYearDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowPaymentYearDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20 max-h-48 overflow-y-auto">
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => {
                                                    setSelectedPaymentYear(year);
                                                    setShowPaymentYearDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-3 py-1.5 text-[10px] font-sans transition-colors hover:bg-blue-50 hover:text-[#0A47C2]",
                                                    selectedPaymentYear === year ? "bg-blue-50 text-[#0A47C2] font-bold" : "text-gray-500"
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <ChartContainer config={{ earning: { label: "Earning", color: "#EF4444" } }} className="h-full w-full">
                            <AreaChart data={paymentStats} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
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
                <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col min-h-[350px]">
                    <div className="flex justify-between items-center mb-6 relative">
                        <h3 className="text-sm font-bold text-[#0D1C35] font-sans">Total Payout</h3>
                        <div className="relative">
                            <button
                                onClick={() => setShowPayoutYearDropdown(!showPayoutYearDropdown)}
                                className="flex items-center gap-1 text-[10px] px-3 py-1.5 border border-gray-100 rounded-lg text-gray-500 font-sans hover:bg-gray-50 transition-all font-medium"
                            >
                                {selectedPayoutYear} <ChevronDown size={12} className={cn("transition-transform duration-200", showPayoutYearDropdown && "rotate-180")} />
                            </button>

                            {showPayoutYearDropdown && (
                                <>
                                    <div
                                        className="fixed inset-0 z-10"
                                        onClick={() => setShowPayoutYearDropdown(false)}
                                    />
                                    <div className="absolute right-0 mt-1 w-24 bg-white border border-gray-100 rounded-xl shadow-lg py-1 z-20 max-h-48 overflow-y-auto">
                                        {years.map((year) => (
                                            <button
                                                key={year}
                                                onClick={() => {
                                                    setSelectedPayoutYear(year);
                                                    setShowPayoutYearDropdown(false);
                                                }}
                                                className={cn(
                                                    "w-full text-left px-3 py-1.5 text-[10px] font-sans transition-colors hover:bg-blue-50 hover:text-[#0A47C2]",
                                                    selectedPayoutYear === year ? "bg-blue-50 text-[#0A47C2] font-bold" : "text-gray-500"
                                                )}
                                            >
                                                {year}
                                            </button>
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="flex-1 w-full">
                        <ChartContainer config={{ payout: { label: "Payout", color: "#22C55E" } }} className="h-full w-full">
                            <AreaChart data={withdrawalStats} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 10, fill: '#9CA3AF' }}
                                    tickFormatter={(val) => val >= 1000 ? `${val / 1000}k` : val}
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
