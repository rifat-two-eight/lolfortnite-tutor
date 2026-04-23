"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
    Search,
    MoreHorizontal,
    ChevronRight,
    ChevronLeft,
    Clock,
    Check,
    X,
    Eye,
    Loader2,
    BookOpen,
    Users as UserIcon,
    DollarSign,
    Calendar,
    ArrowRight
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import Image from "next/image";

interface ClassData {
    _id: string;
    subject: string;
    level: string;
    language: string;
    price: number;
    status: "PENDING" | "APPROVED" | "REJECTED";
    images: string[];
    createdAt: string;
    createdBy: {
        _id: string;
        name: string;
        profileImage?: string;
        email?: string;
    };
    classType: string;
    curriculum?: string;
    maxStudents: number;
    description: string;
    averageRating: number;
    ratingCount: number;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

function StarIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
        </svg>
    );
}

const getImageUrl = (path: string) => {
    if (!path) return "/democourse.png";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
};

export default function AdminClassesPage() {
    const [activeTab, setActiveTab] = useState<"PENDING" | "APPROVED" | "REJECTED">("PENDING");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const [classes, setClasses] = useState<ClassData[]>([]);
    const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0, totalPages: 0 });
    const [loading, setLoading] = useState(true);

    const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef<HTMLDivElement>(null);

    const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
    const [showDetailModal, setShowDetailModal] = useState(false);

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
            }
        };

        const handleScroll = () => {
            if (activePopoverId) {
                setActivePopoverId(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [activePopoverId]);

    // Fetch Classes
    const fetchClasses = useCallback(async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                limit: 10,
                status: activeTab,
            };
            if (debouncedSearchQuery) {
                params.search = debouncedSearchQuery;
            }

            const response = await api.get(`/classes/admin/all`, { params });
            if (response.data.success) {
                setClasses(response.data.data);
                if (response.data.meta) {
                    setMeta(response.data.meta);
                }
            }
        } catch (error) {
            console.error("Error fetching admin classes:", error);
            toast.error("Failed to load classes");
        } finally {
            setLoading(false);
        }
    }, [page, activeTab, debouncedSearchQuery]);

    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    const handleStatusUpdate = async (id: string, newStatus: "APPROVED" | "REJECTED" | "PENDING") => {
        try {
            const response = await api.patch(`/classes/${id}/status`, {
                status: newStatus
            });

            if (response.data.success) {
                toast.success(`Class ${newStatus.toLowerCase()} successfully`);
                fetchClasses();
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating class status:", error);
            toast.error("An error occurred while updating status");
        } finally {
            setActivePopoverId(null);
        }
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 font-sans bg-[#F9FAFB] min-h-screen">

            {/* Filter Bar */}
            <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-none">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => { setActiveTab("PENDING"); setPage(1); }}
                        className={`px-6 py-2 rounded-3xl text-sm font-medium transition-all ${activeTab === "PENDING"
                            ? "bg-[#FFFBEB] text-amber-600 border border-amber-100/50"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Pending Review
                    </button>
                    <button
                        onClick={() => { setActiveTab("APPROVED"); setPage(1); }}
                        className={`px-6 py-2 rounded-3xl text-sm font-medium transition-all ${activeTab === "APPROVED"
                            ? "bg-[#ECFDF5] text-emerald-600 border border-emerald-100/50"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Approved
                    </button>
                    <button
                        onClick={() => { setActiveTab("REJECTED"); setPage(1); }}
                        className={`px-6 py-2 rounded-3xl text-sm font-medium transition-all ${activeTab === "REJECTED"
                            ? "bg-[#FEF2F2] text-red-600 border border-red-100/50"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Rejected
                    </button>
                </div>

                <div className="relative w-full md:w-80">
                    <input
                        type="text"
                        placeholder="Search by subject or teacher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-100 rounded-none text-sm focus:outline-none focus:border-[#0A47C2] transition-all font-medium placeholder:text-gray-400"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            {/* Table Card */}
            <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden rounded-none">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1100px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                {["Subject", "Teacher Info", "Level/Curriculum", "Pricing", "Rating", "Submitted Date", "Status", "Actions"].map((header) => (
                                    <th key={header} className="px-6 py-5 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-center first:text-left">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && classes.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-24 text-center">
                                        <div className="flex flex-col justify-center items-center gap-4">
                                            <Loader2 className="animate-spin text-[#0A47C2]" size={36} />
                                            <p className="text-gray-400 font-medium text-sm tracking-widest uppercase animate-pulse">Loading Classes...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : classes.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-24 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-gray-50 flex items-center justify-center text-gray-200">
                                                <BookOpen size={32} />
                                            </div>
                                            <p className="text-gray-500 font-medium text-sm font-sans">No classes found in {activeTab.toLowerCase()} status.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                classes.map((cls) => (
                                    <tr key={cls._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-4">
                                                <div className="relative w-14 h-14 bg-gray-100 border border-gray-200 overflow-hidden rounded-none flex-shrink-0">
                                                    <Image
                                                        src={getImageUrl(cls.images?.[0])}
                                                        alt={cls.subject}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                        unoptimized
                                                    />
                                                </div>
                                                <span className="text-sm font-medium text-[#0D1C35] line-clamp-2 max-w-[200px] font-sans">{cls.subject}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5">
                                            <div className="flex items-center justify-center gap-3">
                                                <div className="relative w-8 h-8 flex-shrink-0 bg-gray-50 border border-gray-100 overflow-hidden ring-1 ring-blue-50">
                                                    {cls.createdBy?.profileImage ? (
                                                        <Image src={getImageUrl(cls.createdBy.profileImage)} alt={cls.createdBy.name} fill className="object-cover" unoptimized />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-[#0A47C2]">{cls.createdBy?.name?.charAt(0)}</div>
                                                    )}
                                                </div>
                                                <div className="flex flex-col items-start translate-y-[2px]">
                                                    <span className="text-xs font-medium text-gray-700">{cls.createdBy?.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-medium">{cls.createdBy?.email || "No Email"}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col">
                                                <span className="text-[11px] font-bold text-[#0A47C2] uppercase tracking-tight">{cls.level}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">{cls.curriculum || "Standard"}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-sm font-semibold text-[#0A47C2]">{cls.price} KD</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex items-center justify-center gap-1.5 font-sans">
                                                <StarIcon />
                                                <span className="text-xs font-medium text-gray-700">{cls.averageRating || "0"}</span>
                                                <span className="text-[10px] text-gray-400 font-medium">({cls.ratingCount || "0"})</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className="text-xs font-medium text-gray-500">{formatDate(cls.createdAt)}</span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <span className={`px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest ${cls.status === "APPROVED"
                                                ? "bg-green-50 text-green-500"
                                                : cls.status === "PENDING"
                                                    ? "bg-amber-50 text-amber-500"
                                                    : "bg-red-50 text-red-500"
                                                }`}>
                                                {cls.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center relative">
                                            <button
                                                onClick={(e) => {
                                                    const rect = e.currentTarget.getBoundingClientRect();
                                                    setPopoverPosition({ top: rect.top, left: rect.left });
                                                    setActivePopoverId(activePopoverId === cls._id ? null : cls._id);
                                                }}
                                                className="p-2 hover:bg-gray-100 text-gray-400 hover:text-[#0A47C2] transition-colors rounded-none"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>

                                            {activePopoverId === cls._id && (
                                                <div
                                                    ref={popoverRef}
                                                    style={{
                                                        position: 'fixed',
                                                        top: `${popoverPosition.top}px`,
                                                        left: `${popoverPosition.left - 200}px`,
                                                        zIndex: 9999
                                                    }}
                                                    className="w-52 bg-white shadow-2xl border border-gray-100 p-2 animate-in fade-in zoom-in duration-200 flex flex-col gap-1 rounded-none font-sans"
                                                >
                                                    {cls.status === "PENDING" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleStatusUpdate(cls._id, "APPROVED")}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors uppercase tracking-widest"
                                                            >
                                                                <Check size={16} />
                                                                Approve Class
                                                            </button>
                                                            <button
                                                                onClick={() => handleStatusUpdate(cls._id, "REJECTED")}
                                                                className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors uppercase tracking-widest"
                                                            >
                                                                <X size={16} />
                                                                Reject Class
                                                            </button>
                                                            <div className="h-px bg-gray-100 my-1" />
                                                        </>
                                                    )}
                                                    <button
                                                        onClick={() => {
                                                            setSelectedClass(cls);
                                                            setShowDetailModal(true);
                                                            setActivePopoverId(null);
                                                        }}
                                                        className="w-full flex items-center gap-3 px-3 py-2.5 text-[11px] font-medium text-gray-700 hover:bg-blue-50 hover:text-[#0A47C2] transition-colors uppercase tracking-widest"
                                                    >
                                                        <Eye size={16} />
                                                        View Details
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
                <div className="flex items-center justify-between mt-10">
                    <p className="text-[10px] font-medium text-gray-400 uppercase tracking-[0.2em]">
                        Showing {(meta.page - 1) * meta.limit + 1} to {Math.min(meta.page * meta.limit, meta.total)} of {meta.total} Sessions
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-[#0A47C2] disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-none"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div className="flex items-center gap-2">
                            {Array.from({ length: meta.totalPages || 0 }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => setPage(pageNum)}
                                    className={`w-10 h-10 flex items-center justify-center text-xs font-medium transition-all rounded-none ${page === pageNum
                                        ? "bg-[#0A47C2] text-white shadow-lg shadow-blue-100"
                                        : "bg-white border border-gray-100 text-gray-400 hover:text-[#0A47C2] hover:bg-blue-50"
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => Math.min(meta.totalPages || 1, p + 1))}
                            disabled={page === meta.totalPages}
                            className="w-10 h-10 flex items-center justify-center bg-white border border-gray-100 text-gray-400 hover:text-[#0A47C2] disabled:opacity-30 disabled:cursor-not-allowed transition-all rounded-none"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            )}

            {/* Preview Modal */}
            {showDetailModal && selectedClass && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-[2px] animate-in fade-in duration-300">
                    <div className="relative w-full max-w-4xl bg-white shadow-2xl overflow-hidden rounded-none animate-in zoom-in duration-300 max-h-[90vh] flex flex-col font-sans">
                        <div className="relative h-64 shrink-0 overflow-hidden">
                            <Image src={getImageUrl(selectedClass.images?.[0])} alt={selectedClass.subject} fill className="object-cover" unoptimized />
                            <div className="absolute inset-0 bg-linear-to-t from-[#0D1C35] via-black/20 to-transparent" />
                            <button onClick={() => setShowDetailModal(false)} className="absolute top-6 right-6 p-2 bg-white/20 hover:bg-white text-white hover:text-[#0D1C35] transition-all rounded-none">
                                <X size={20} />
                            </button>
                            <div className="absolute bottom-8 left-8">
                                <span className="bg-[#0A47C2] text-white text-[10px] font-semibold uppercase tracking-widest px-3 py-1 mb-3 inline-block">Reviewing Content</span>
                                <h3 className="text-3xl font-bold text-white italic">{selectedClass.subject}</h3>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-10 grid grid-cols-1 md:grid-cols-3 gap-10 font-sans">
                            <div className="md:col-span-2 space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-[#0A47C2] uppercase tracking-[0.2em] flex items-center gap-2">
                                        <ArrowRight size={14} /> Description
                                    </h4>
                                    <p className="text-sm leading-relaxed text-gray-600 font-medium">{selectedClass.description}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-8 border-t border-gray-50 pt-8">
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Level</h4>
                                        <p className="font-semibold text-[#0D1C35]">{selectedClass.level}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Curriculum</h4>
                                        <p className="font-semibold text-[#0D1C35]">{selectedClass.curriculum || "N/A"}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Language</h4>
                                        <p className="font-semibold text-[#0D1C35]">{selectedClass.language}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Class Type</h4>
                                        <p className="font-semibold text-[#0D1C35] tracking-tighter uppercase">{selectedClass.classType}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 space-y-8">
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pricing</h4>
                                    <div className="text-4xl font-bold text-[#0A47C2] italic">{selectedClass.price} KD</div>
                                </div>

                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Teacher</h4>
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 relative overflow-hidden bg-white border border-gray-200">
                                            {selectedClass.createdBy?.profileImage ? (
                                                <Image src={getImageUrl(selectedClass.createdBy.profileImage)} alt="Teacher" fill className="object-cover" unoptimized />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs font-bold text-[#0A47C2]">{selectedClass.createdBy?.name?.charAt(0)}</div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-[#0D1C35] leading-tight">{selectedClass.createdBy?.name}</p>
                                            <p className="text-[10px] text-gray-400 font-medium">{selectedClass.createdBy?.email}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedClass.status === "PENDING" && (
                                    <div className="space-y-3 pt-6 border-t border-gray-200">
                                        <button
                                            onClick={() => handleStatusUpdate(selectedClass._id, "APPROVED")}
                                            className="w-full py-4 bg-[#0A47C2] text-white font-semibold text-[10px] uppercase tracking-[0.2em] hover:bg-[#083a9e] transition-all shadow-lg shadow-blue-100"
                                        >
                                            Approve Class
                                        </button>
                                        <button
                                            onClick={() => handleStatusUpdate(selectedClass._id, "REJECTED")}
                                            className="w-full py-4 bg-white border border-red-100 text-red-600 font-semibold text-[10px] uppercase tracking-[0.2em] hover:bg-red-50 transition-all"
                                        >
                                            Reject Submission
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
