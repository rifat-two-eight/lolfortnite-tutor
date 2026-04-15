"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Search,
    MoreHorizontal,
    ChevronRight,
    ChevronLeft,
    X,
    Trash2,
    Eye,
    Ban,
    RefreshCw,
    Loader2
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useRouter } from "next/navigation";

interface Student {
    _id: string;
    name: string;
    phone: string;
    email: string;
    totalPurchaseClass: number;
    totalSpend: number;
    createdAt: string;
    isActive: boolean;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
}

export default function AdminStudentPage() {
    const [activeTab, setActiveTab] = useState<"Active" | "Deactivate">("Active");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    const [students, setStudents] = useState<Student[]>([]);
    const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
    const popoverRef = useRef<HTMLDivElement>(null);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

    // Close popover when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setActivePopoverId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Format Date Helper
    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    // Fetch Students dynamically
    useEffect(() => {
        const fetchStudents = async () => {
            setLoading(true);
            try {
                const params: any = {
                    page,
                    limit: 10,
                };
                if (debouncedSearchQuery) {
                    params.search = debouncedSearchQuery;
                }
                const response = await api.get(`/users/students`, { params });
                if (response.data.success) {
                    setStudents(response.data.data);
                    if (response.data.meta) {
                        setMeta(response.data.meta);
                    }
                }
            } catch (error) {
                console.error("Error fetching students:", error);
                toast.error("Failed to load students");
            } finally {
                setLoading(false);
            }
        };

        fetchStudents();
    }, [page, debouncedSearchQuery]);

    // Local filtering fallback for search robustness and Activity tabs
    const filteredStudents = students.filter((student) => {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch =
            (student.name || "").toLowerCase().includes(query) ||
            (student.email || "").toLowerCase().includes(query) ||
            (student.phone || "").toLowerCase().includes(query);

        const matchesTab = activeTab === "Active" ? student.isActive : !student.isActive;
        return matchesSearch && matchesTab;
    });

    const router = useRouter();

    const handleActionClick = (id: string) => {
        setActivePopoverId(activePopoverId === id ? null : id);
    };

    const handleToggleActive = async (id: string, currentStatus: boolean) => {
        try {
            const response = await api.patch(`/users/toggle-active/${id}`);
            if (response.data.success) {
                toast.success(`Student ${currentStatus ? 'Deactivated' : 'Activated'} successfully`);
                setStudents(current => current.map(s =>
                    s._id === id ? { ...s, isActive: !s.isActive } : s
                ));
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error toggling status:", error);
            toast.error("An error occurred");
        } finally {
            setActivePopoverId(null);
        }
    };

    const handleTabChange = (tab: "Active" | "Deactivate") => {
        setActiveTab(tab);
        setPage(1);
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8">
            {/* Top Bar Card */}
            <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => handleTabChange("Active")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Active"
                            ? "bg-[#22C55E] text-white"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Active
                    </button>
                    <button
                        onClick={() => handleTabChange("Deactivate")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Deactivate"
                            ? "bg-[#E0EAFF] text-[#0A47C2]"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Deactivate
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

            {/* Student Table Card */}
            <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                {["Name", "Phone", "Email", "Total Purchases", "Total Spend", "Date", "Status", "Actions"].map((header) => (
                                    <th key={header} className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider font-sans text-center first:text-left">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && students.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center gap-2 text-gray-500">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="font-sans text-sm">Loading students...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredStudents.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-12 text-center font-sans text-sm text-gray-500">
                                        No students found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredStudents.map((student) => (
                                    <tr key={student._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-[#0D1C35] font-sans">{student.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{student.phone || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{student.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 text-center font-sans">{student.totalPurchaseClass || 0}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">${(student.totalSpend || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{formatDate(student.createdAt)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${student.isActive
                                                ? "bg-green-50 text-green-500"
                                                : "bg-[#E0EAFF] text-[#0A47C2]"
                                                }`}>
                                                {student.isActive ? "Active" : "Deactivate"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center relative">
                                            <button
                                                onClick={() => handleActionClick(student._id)}
                                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 group-hover:text-blue-600"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>

                                            {/* Action Popover */}
                                            {activePopoverId === student._id && (
                                                <div
                                                    ref={popoverRef}
                                                    className="absolute right-full mr-2 top-0 z-50 w-48 bg-white shadow-xl rounded-xl border border-gray-100 p-2 animate-in fade-in zoom-in duration-200 flex flex-col gap-1"
                                                >
                                                    {student.isActive ? (
                                                        <button
                                                            onClick={() => handleToggleActive(student._id, true)}
                                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <Ban size={14} className="text-amber-500" />
                                                            Deactivate
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleToggleActive(student._id, false)}
                                                            className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                        >
                                                            <RefreshCw size={14} className="text-[#22C55E]" />
                                                            Reactivate
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => router.push(`/web-admin/student/${student._id}`)}
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

            {/* Pagination UI */}
            <div className="flex items-center justify-end gap-2 mt-6">
                <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page === 1}
                    className="p-2 text-gray-400 hover:text-blue-600 disabled:opacity-50 transition-colors"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1">
                    {Array.from({ length: Math.ceil(meta.total / meta.limit) || 1 }, (_, i) => i + 1).map((pageNum) => (
                        <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${page === pageNum
                                ? "bg-[#0A47C2] text-white shadow-lg shadow-blue-200"
                                : "text-gray-400 hover:text-blue-600 hover:bg-gray-50"
                                }`}
                        >
                            {pageNum.toString().padStart(2, '0')}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => setPage(Math.min(Math.ceil(meta.total / meta.limit), page + 1))}
                    disabled={page >= Math.ceil(meta.total / meta.limit)}
                    className="p-2 text-blue-600 hover:bg-blue-50 disabled:opacity-50 rounded-full transition-colors"
                >
                    <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
