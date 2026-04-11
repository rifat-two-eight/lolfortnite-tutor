"use client";

import React, { useEffect, useRef, useState } from "react";
import { Users, CalendarDays } from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
} from "recharts"

import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import Image from "next/image";
import api from "@/lib/axios";

// ── Types ─────────────────────────────────────────────────────────────────────
interface RatingDistribution {
    star: number;
    count: number;
    percentage: number;
}

interface TeacherRatings {
    averageRating: number;
    totalRatings: number;
    distribution: RatingDistribution[];
}

interface EarningDay {
    day: string;
    earning: number;
}

interface WeeklyEarningsData {
    startDate: string;
    endDate: string;
    earnings: EarningDay[];
}

// ── Chart config ──────────────────────────────────────────────────────────────
const earningChartConfig = {
    earning: { label: "Earning", color: "#0A47C2" },
} satisfies ChartConfig;

// ── Helpers ───────────────────────────────────────────────────────────────────
function StarIcon({ filled }: { filled: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 12 12" fill={filled ? "#F59E0B" : "#D1D5DB"}>
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
        </svg>
    );
}

function BlueStarIcon({ filled }: { filled: boolean }) {
    return (
        <svg width="16" height="16" viewBox="0 0 12 12" fill={filled ? "#0A47C2" : "#D1D5DB"}>
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
        </svg>
    );
}

/** Format Date → "YYYY-MM-DD" */
function toISODate(d: Date): string {
    return d.toISOString().split("T")[0];
}

/** Format "YYYY-MM-DD" → "DD MMM YYYY" for display */
function formatDisplayDate(iso: string): string {
    const [year, month, day] = iso.split("-");
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day} ${months[parseInt(month) - 1]} ${year}`;
}

// ── Types (stats) ────────────────────────────────────────────────────────────
interface TeacherStats {
    activeClasses: number;
    totalStudents: number;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function TeacherDashboard() {
    const [ratings, setRatings] = useState<TeacherRatings | null>(null);
    const [ratingsLoading, setRatingsLoading] = useState(true);

    // Stats
    const [stats, setStats] = useState<TeacherStats | null>(null);

    // Earning chart state
    const [earningData, setEarningData] = useState<EarningDay[]>([]);
    const [earningMeta, setEarningMeta] = useState<{ startDate: string; endDate: string } | null>(null);
    const [earningLoading, setEarningLoading] = useState(true);

    // Calendar picker state
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(toISODate(new Date()));
    const calendarRef = useRef<HTMLDivElement>(null);

    // Close calendar on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCalendar(false);
            }
        }
        if (showCalendar) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [showCalendar]);

    // Fetch stats
    useEffect(() => {
        api.get("/dashboard/teacher-stats")
            .then(res => {
                if (res.data.success) setStats(res.data.data);
            })
            .catch(console.error);
    }, []);

    // Fetch ratings
    useEffect(() => {
        api.get("/dashboard/teacher-ratings")
            .then(res => {
                if (res.data.success) setRatings(res.data.data);
            })
            .catch(console.error)
            .finally(() => setRatingsLoading(false));
    }, []);

    // Fetch weekly earnings
    const fetchEarnings = (startDate: string) => {
        setEarningLoading(true);
        api.get<{ success: boolean; data: WeeklyEarningsData }>(
            `/dashboard/teacher-weekly-earnings?startDate=${startDate}`
        )
            .then(res => {
                if (res.data.success) {
                    setEarningData(res.data.data.earnings);
                    setEarningMeta({ startDate: res.data.data.startDate, endDate: res.data.data.endDate });
                }
            })
            .catch(console.error)
            .finally(() => setEarningLoading(false));
    };

    useEffect(() => {
        fetchEarnings(selectedDate);
    }, [selectedDate]);

    // Build ordered distribution (5 → 1)
    const distribution: RatingDistribution[] = ratings?.distribution
        ? [...ratings.distribution].sort((a, b) => b.star - a.star)
        : [5, 4, 3, 2, 1].map(star => ({ star, count: 0, percentage: 0 }));

    const avg = ratings?.averageRating ?? 0;
    const filledStars = Math.round(avg);

    // Y-axis tick labels derived from max earning
    const maxEarning = earningData.length
        ? Math.max(...earningData.map(d => d.earning))
        : 0;

    const yLabels = maxEarning > 0
        ? [
            maxEarning,
            Math.round(maxEarning * 0.75),
            Math.round(maxEarning * 0.5),
            Math.round(maxEarning * 0.25),
            0,
        ]
        : [1000, 750, 500, 250, 0];

    function formatY(val: number): string {
        if (val >= 1_000_000) return `${(val / 1_000_000).toFixed(1)}m`;
        if (val >= 1_000) return `${(val / 1_000).toFixed(0)}k`;
        return `${val}`;
    }

    return (
        <div className="px-4 md:px-8 py-8 space-y-8">
            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-8 flex items-center justify-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 rounded-none">
                    <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-none text-[#0A47C2]">
                        <Image src="/active.svg" alt="Active" width={24} height={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">
                            {stats ? stats.activeClasses.toLocaleString() : "—"}
                        </p>
                        <p className="text-sm text-gray-400 font-sans">Active Class</p>
                    </div>
                </div>

                <div className="bg-white p-8 flex items-center justify-center gap-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 rounded-none">
                    <div className="w-12 h-12 bg-blue-50 flex items-center justify-center rounded-none text-[#0A47C2]">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-2xl font-bold text-[#0D1C35] font-sans">
                            {stats ? stats.totalStudents.toLocaleString() : "—"}
                        </p>
                        <p className="text-sm text-gray-400 font-sans">Total Student</p>
                    </div>
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* ── Overall Class Rating ── */}
                <div className="bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 rounded-none space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-[#0D1C35] font-sans">Overall Class Rating</h3>
                        {ratings && (
                            <span className="text-xs text-gray-400 font-sans">
                                {ratings.totalRatings} review{ratings.totalRatings !== 1 ? "s" : ""}
                            </span>
                        )}
                    </div>

                    {ratingsLoading ? (
                        <div className="flex items-center justify-center h-40">
                            <div className="w-8 h-8 border-2 border-[#0A47C2] border-t-transparent animate-spin rounded-none" />
                        </div>
                    ) : (
                        <>
                            {/* Average score box */}
                            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8 pt-4">
                                <div className="bg-blue-50 p-11 flex flex-col items-center justify-center w-full sm:min-w-[160px] lg:min-w-[200px] rounded-none">
                                    <span className="text-5xl lg:text-6xl font-medium text-[#0D1C35] font-sans">
                                        {avg > 0 ? avg.toFixed(1) : "—"}
                                    </span>
                                    <div className="flex gap-1 mt-2">
                                        {[1, 2, 3, 4, 5].map(s => (
                                            <StarIcon key={s} filled={s <= filledStars} />
                                        ))}
                                    </div>
                                    <span className="text-xs text-gray-400 mt-2 font-sans font-bold text-center">Overall Rating</span>
                                </div>
                            </div>

                            {/* Star Breakdown */}
                            <div className="space-y-4 pt-4">
                                {distribution.map((item) => (
                                    <div key={item.star} className="flex items-center gap-6 lg:gap-10 w-full">
                                        <div className="flex gap-1.5 w-40 shrink-0">
                                            {[...Array(5)].map((_, i) => (
                                                <BlueStarIcon key={i} filled={i < item.star} />
                                            ))}
                                            <span className="text-sm text-gray-400 font-sans ml-2">{item.star} Star</span>
                                        </div>
                                        <div className="flex-1 h-4 bg-gray-100 overflow-hidden rounded-none">
                                            <div
                                                style={{ width: `${item.percentage}%`, transition: "width 0.6s ease" }}
                                                className="h-full bg-[#0A47C2] rounded-none"
                                            />
                                        </div>
                                        <span className="text-sm text-gray-400 font-sans w-12 text-right font-medium shrink-0">
                                            {item.percentage > 0 ? `${item.percentage}%` : "0%"}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ── Total Earning ── */}
                <div className="bg-white p-8 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 rounded-none space-y-6">
                    {/* Header with calendar */}
                    <div className="flex items-center justify-between">
                        <h3 className="text-base font-medium text-[#0D1C35] font-sans">Total Earning</h3>

                        {/* Calendar icon + picker */}
                        <div className="relative" ref={calendarRef}>
                            <button
                                onClick={() => setShowCalendar(prev => !prev)}
                                title="Select start date"
                                className="flex items-center gap-1.5 text-[#0A47C2] hover:bg-blue-50 transition-colors px-2 py-1 rounded-none"
                            >
                                <CalendarDays size={16} />
                                <span className="text-xs font-sans text-gray-500 hidden sm:inline">
                                    {formatDisplayDate(selectedDate)}
                                </span>
                            </button>

                            {/* Native date input shown as a floating picker */}
                            {showCalendar && (
                                <div className="absolute right-0 top-full mt-2 z-50 bg-white border border-gray-200 shadow-lg rounded-none p-4 min-w-[220px]">
                                    <p className="text-xs text-gray-400 font-sans mb-2 font-medium">Select start date</p>
                                    <input
                                        type="date"
                                        value={selectedDate}
                                        onChange={e => {
                                            if (e.target.value) {
                                                setSelectedDate(e.target.value);
                                                setShowCalendar(false);
                                            }
                                        }}
                                        className="w-full text-sm font-sans border border-gray-200 rounded-none px-3 py-2 text-[#0D1C35] focus:outline-none focus:ring-2 focus:ring-[#0A47C2] focus:border-transparent"
                                    />
                                    {earningMeta && (
                                        <p className="text-[10px] text-gray-400 mt-2 font-sans">
                                            Showing: {formatDisplayDate(earningMeta.startDate)} – {formatDisplayDate(earningMeta.endDate)}
                                        </p>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Date range label */}
                    {earningMeta && (
                        <p className="text-xs text-gray-400 font-sans -mt-4">
                            {formatDisplayDate(earningMeta.startDate)} – {formatDisplayDate(earningMeta.endDate)}
                        </p>
                    )}

                    {earningLoading ? (
                        <div className="flex items-center justify-center h-48">
                            <div className="w-8 h-8 border-2 border-[#0A47C2] border-t-transparent animate-spin rounded-none" />
                        </div>
                    ) : (
                        <div className="relative pt-4">
                            <div className="w-full aspect-4/3 relative flex flex-col justify-between pt-4">
                                {/* Grid Lines */}
                                {yLabels.map((val, idx) => (
                                    <div key={idx} className="flex items-center gap-4 w-full">
                                        <span className="text-[10px] text-gray-300 w-8 font-sans text-right">
                                            {formatY(val)}
                                        </span>
                                        <div className="flex-1 h-px bg-gray-50" />
                                    </div>
                                ))}

                                {/* Earnings Area Chart */}
                                <div className="absolute inset-0 left-12 top-8">
                                    <ChartContainer config={earningChartConfig} className="h-full w-full">
                                        <AreaChart data={earningData} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
                                            <defs>
                                                <linearGradient id="earningGradient" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#0A47C2" stopOpacity={0.15} />
                                                    <stop offset="95%" stopColor="#0A47C2" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <ChartTooltip
                                                cursor={false}
                                                content={<ChartTooltipContent indicator="dot" />}
                                            />
                                            <Area
                                                dataKey="earning"
                                                type="monotone"
                                                fill="url(#earningGradient)"
                                                stroke="#0A47C2"
                                                strokeWidth={2.5}
                                                dot={{ fill: "#0A47C2", r: 3 }}
                                                activeDot={{ r: 5, fill: "#0A47C2" }}
                                            />
                                        </AreaChart>
                                    </ChartContainer>
                                </div>

                                {/* X-Axis labels */}
                                <div className="flex items-center justify-between pl-12 pt-4">
                                    {earningData.map(d => (
                                        <span key={d.day} className="text-[10px] text-gray-300 font-sans">{d.day}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
