"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Search,
    MoreHorizontal,
    ChevronRight,
    ChevronLeft,
    ChevronDown,
    Check,
    X,
    Clock,
    Eye,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Teacher {
    _id: string;
    name: string;
    email: string;
    phone: string;
    teacherApprovalStatus: "APPROVED" | "PENDING" | "REJECTED";
    createdAt: string;
    totalSellClass: number;
    totalEarning: number;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
}

export default function AdminTeacherPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<"Pending" | "Approved" | "Rejected">("Pending");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(true);

    const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [isApproveSubMenuOpen, setIsApproveSubMenuOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Format Date Helper
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setActivePopoverId(null);
                setIsApproveSubMenuOpen(false);
            }
        };

        const handleScroll = () => {
            if (activePopoverId) {
                setActivePopoverId(null);
                setIsApproveSubMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true); // true to catch scrolls in overflow containers
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [activePopoverId]);

    // Fetch Teachers
    useEffect(() => {
        const fetchTeachers = async () => {
            setLoading(true);
            try {
                const params: any = {
                    page,
                    limit: 10,
                };
                if (debouncedSearchQuery) {
                    params.search = debouncedSearchQuery;
                }
                if (activeTab) {
                    params.teacherApprovalStatus = activeTab.toUpperCase();
                }

                const response = await api.get(`/users/teachers`, { params });
                if (response.data.success) {
                    setTeachers(response.data.data);
                    if (response.data.meta) {
                        setMeta(response.data.meta);
                    }
                }
            } catch (error) {
                console.error("Error fetching teachers:", error);
                toast.error("Failed to load teachers");
            } finally {
                setLoading(false);
            }
        };

        fetchTeachers();
    }, [page, activeTab, debouncedSearchQuery]);

    const handleTabChange = (tab: "Pending" | "Approved" | "Rejected") => {
        setActiveTab(tab);
        setPage(1);
    };

    const handleActionClick = (e: React.MouseEvent, id: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopoverPosition({ top: rect.top, left: rect.left });
        setActivePopoverId(activePopoverId === id ? null : id);
        setIsApproveSubMenuOpen(false);
    };

    const handleStatusUpdate = async (status: "PENDING" | "APPROVED" | "REJECTED") => {
        if (!activePopoverId) return;

        try {
            const response = await api.patch(`/users/teacher-status/${activePopoverId}`, {
                status
            });

            if (response.data.success) {
                toast.success(`Teacher moved to ${status.toLowerCase()}`);

                // Instantly update UI reflection
                setTeachers(current => current.map(t =>
                    t._id === activePopoverId ? { ...t, teacherApprovalStatus: status } : t
                ));
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating teacher status:", error);
            toast.error("An error occurred while updating status");
        } finally {
            setActivePopoverId(null);
            setIsApproveSubMenuOpen(false);
        }
    };

    const filteredTeachers = teachers.filter((teacher) => {
        const matchesSearch =
            (teacher.name || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            (teacher.email || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
            (teacher.phone || "").toLowerCase().includes(debouncedSearchQuery.toLowerCase());

        const matchesTab = teacher.teacherApprovalStatus?.toUpperCase() === activeTab.toUpperCase();

        return matchesSearch && matchesTab;
    });



    return (
        <div className="px-4 md:px-8 py-8 space-y-8">
            {/* Top Bar Card */}
            <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleTabChange("Pending")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Pending"
                            ? "bg-[#E0EAFF] text-[#0A47C2]"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => handleTabChange("Approved")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Approved"
                            ? "bg-[#22C55E] text-white"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => handleTabChange("Rejected")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Rejected"
                            ? "bg-[#FEE2E2] text-red-600"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Rejected
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            {/* Teacher Table Card */}
            <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                {["Name", "Phone", "Email", "Total Sell Class", "Total Earning", "Date", "Status", "Actions"].map((header) => (
                                    <th key={header} className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider font-sans text-center first:text-left">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && teachers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center gap-2 text-gray-500">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="font-sans text-sm">Loading teachers...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredTeachers.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center font-sans text-sm text-gray-500">
                                        No teachers found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredTeachers.map((teacher) => (
                                    <tr key={teacher._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-[#0D1C35] font-sans">{teacher.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{teacher.phone || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{teacher.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-center font-sans">{teacher.totalSellClass || 0}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">${teacher.totalEarning || 0}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{formatDate(teacher.createdAt)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${teacher.teacherApprovalStatus === "APPROVED"
                                                ? "bg-green-50 text-green-500"
                                                : teacher.teacherApprovalStatus === "PENDING"
                                                    ? "bg-amber-50 text-amber-500"
                                                    : "bg-red-50 text-red-500"
                                                }`}>
                                                {teacher.teacherApprovalStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center relative">
                                            <button
                                                onClick={(e) => handleActionClick(e, teacher._id)}
                                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 group-hover:text-blue-600"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>

                                            {activePopoverId === teacher._id && (
                                                <div
                                                    ref={popoverRef}
                                                    style={{
                                                        position: 'fixed',
                                                        top: `${popoverPosition.top}px`,
                                                        left: `${popoverPosition.left - 200}px`,
                                                        zIndex: 9999
                                                    }}
                                                    className="w-48 bg-white shadow-xl rounded-xl border border-gray-100 p-2 animate-in fade-in zoom-in duration-200 flex flex-col gap-1"
                                                >
                                                    <div className="relative group/approve">
                                                        <button
                                                            onClick={() => handleStatusUpdate("APPROVED")}
                                                            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors text-gray-700 hover:bg-gray-50"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <Check size={14} className="text-[#22C55E]" />
                                                                Approve
                                                            </div>
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleStatusUpdate("PENDING")}
                                                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Clock size={14} className="text-amber-500" />
                                                        Pending
                                                    </button>

                                                    <button
                                                        onClick={() => handleStatusUpdate("REJECTED")}
                                                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <X size={14} className="text-red-500" />
                                                        Reject
                                                    </button>

                                                    <button
                                                        onClick={() => router.push(`/web-admin/teacher/${teacher._id}`)}
                                                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Eye size={14} className="text-[#0A47C2]" />
                                                        View
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            {meta.total > 0 && (
                <div className="flex items-center justify-end gap-2 mt-6">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-colors"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <div className="flex items-center gap-1">
                        {Array.from({ length: Math.ceil(meta.total / meta.limit) }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${page === pageNum
                                    ? "bg-[#0A47C2] text-white shadow-lg shadow-blue-200"
                                    : "text-gray-400 hover:bg-gray-50 hover:text-blue-600"
                                    }`}
                            >
                                {pageNum.toString().padStart(2, '0')}
                            </button>
                        ))}
                    </div>
                    <button
                        onClick={() => setPage(p => Math.min(Math.ceil(meta.total / meta.limit), p + 1))}
                        disabled={page === Math.ceil(meta.total / meta.limit)}
                        className="p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-full transition-colors"
                    >
                        <ChevronRight size={20} />
                    </button>
                </div>
            )}
        </div>
    );
}
