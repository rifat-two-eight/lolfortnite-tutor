"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    BookOpen, ChevronLeft, ChevronRight,
    ChevronDown, Loader2, Star, Users,
    Globe, ArrowRight, GraduationCap
} from "lucide-react";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ClassData {
    _id: string;
    subject: string;
    level: string;
    language: string;
    curriculum: string;
    price: number;
    tutorGender: string;
    maxStudents: number;
    classType: string;
    description: string;
    youtubeVideoLink?: string;
    whatsappGroupLink?: string;
    images: string[];
    status: string;
    runningStatus: string;
    averageRating: number;
    ratingCount: number;
    enrolledStudents?: number;
    createdAt?: string;
}

const getImageUrl = (path: string) => {
    if (!path) return "/democourse.png";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
};

const STATUS_STYLES: Record<string, string> = {
    APPROVED: "bg-emerald-500",
    PENDING: "bg-amber-500",
    REJECTED: "bg-red-500",
};

export default function TeacherEnrolledClassesPage() {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("All");

    const fetchClasses = useCallback(async (currentPage: number, status: string) => {
        setLoading(true);
        try {
            const statusQuery = status !== "All" ? `&status=${status}` : "";
            const response = await api.get(`/classes/enrolled-classes?page=${currentPage}&limit=8${statusQuery}`);
            if (response.data.success) {
                setClasses(response.data.data);
                if (response.data.meta) {
                    setTotalPages(response.data.meta.totalPages);
                }
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Failed to load classes");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClasses(page, statusFilter);
    }, [page, statusFilter, fetchClasses]);

    const handleFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        setPage(1);
    };

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">

                    <h1 className="text-2xl font-black text-[#0D1C35] font-sans">Enrolled Classes</h1>
                    <p className="text-sm text-gray-400 font-sans">All classes you have created and published</p>
                </div>

                {/* Status Filter */}
                <div className="relative">
                    <select
                        value={statusFilter}
                        onChange={(e) => handleFilterChange(e.target.value)}
                        className="bg-white border border-gray-200 text-[#0D1C35] text-sm font-bold py-3 pl-4 pr-10 rounded-none focus:outline-none focus:border-[#0A47C2] appearance-none transition-all shadow-sm"
                    >
                        <option value="All">All Statuses</option>
                        <option value="PENDING">Pending</option>
                        <option value="APPROVED">Approved</option>
                        <option value="REJECTED">Rejected</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                </div>
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-80 gap-4">
                    <Loader2 className="w-10 h-10 text-[#0A47C2] animate-spin" />
                    <p className="text-gray-400 font-medium animate-pulse font-sans">Loading classes...</p>
                </div>
            ) : classes.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {classes.map((cls) => (
                            <div
                                key={cls._id}
                                className="bg-white border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group"
                            >
                                {/* Image */}
                                <div className="relative w-full aspect-video overflow-hidden">
                                    <Image
                                        src={getImageUrl(cls.images?.[0])}
                                        alt={cls.subject}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    {/* Status */}
                                    <div className={cn(
                                        "absolute top-3 left-3 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white",
                                        STATUS_STYLES[cls.status] || "bg-gray-500"
                                    )}>
                                        {cls.status}
                                    </div>
                                    {/* Rating */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white px-2.5 py-1 text-[10px] font-semibold text-[#0D1C35] shadow-sm">
                                        <Star size={10} className="fill-amber-400 text-amber-400" />
                                        <span>{cls.averageRating || 0}</span>
                                        <span className="text-gray-400">({cls.ratingCount || 0})</span>
                                    </div>
                                </div>

                                {/* Body */}
                                <div className="p-5 flex flex-col gap-3 flex-1">
                                    <p className="text-[10px] font-black tracking-[0.15em] uppercase text-[#0A47C2] font-sans">
                                        {cls.level} · {cls.curriculum}
                                    </p>
                                    <h3 className="text-base font-bold text-[#0D1C35] font-sans leading-tight line-clamp-2">
                                        {cls.subject}
                                    </h3>

                                    <div className="flex items-center gap-3 text-[11px] text-gray-400 font-sans flex-wrap">
                                        <span className="flex items-center gap-1">
                                            <Globe size={11} />
                                            {cls.language}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Users size={11} />
                                            {cls.classType === "GROUP" ? "Group" : "1-on-1"}
                                        </span>
                                        <span className="ml-auto text-[#0A47C2] font-black text-sm">
                                            {cls.price} KD
                                        </span>
                                    </div>

                                    <div className="h-px bg-gray-100 mt-auto" />

                                    <Link
                                        href={`/teacher/enrolled-classes/${cls._id}`}
                                        className="w-full py-3 bg-[#0A47C2] text-white text-center text-xs font-bold flex items-center justify-center gap-2 hover:bg-[#083a9e] transition-all shadow-md shadow-blue-50 font-sans"
                                    >
                                        View Details
                                        <ArrowRight size={14} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 pt-6">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-[#0A47C2] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={cn(
                                            "w-10 h-10 font-bold text-sm transition-all shadow-sm border",
                                            page === i + 1
                                                ? "bg-[#0A47C2] text-white border-[#0A47C2]"
                                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 text-gray-500 hover:bg-blue-50 hover:text-[#0A47C2] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white p-20 flex flex-col items-center justify-center gap-6 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-blue-50 flex items-center justify-center text-[#0A47C2]">
                        <BookOpen size={36} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-[#0D1C35] font-sans">No Classes Found</h3>
                        <p className="text-gray-400 text-sm mt-2 font-sans max-w-xs mx-auto">
                            You haven't created any classes yet. Go to <strong>My Class</strong> to create one.
                        </p>
                    </div>
                    <Link
                        href="/teacher/classes"
                        className="px-8 py-4 bg-[#0A47C2] text-white font-bold text-sm hover:bg-[#083a9e] transition-all font-sans"
                    >
                        Go to My Class
                    </Link>
                </div>
            )}
        </div>
    );
}
