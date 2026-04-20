"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import {
    Search,
    MoreHorizontal,
    ChevronRight,
    ChevronLeft,
    Clock,
    XCircle,
    CheckCircle2,
    Loader2,
    Eye,
    X,
    Landmark,
    Building2,
    Globe2,
    Mail
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface WithdrawalRequest {
    _id: string;
    teacher: {
        _id: string;
        name: string;
        email: string;
        profileImage: string;
        balance: number;
    };
    amount: number;
    status: "PENDING" | "PAID" | "REJECTED";
    bankDetails: any;
    adminComment?: string;
    createdAt: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
}

export default function AdminWithdrawalPage() {
    const [activeTab, setActiveTab] = useState<"PENDING" | "PAID" | "REJECTED">("PENDING");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const [withdrawals, setWithdrawals] = useState<WithdrawalRequest[]>([]);
    const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(true);

    const [activePopoverId, setActivePopoverId] = useState<string | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const popoverRef = useRef<HTMLDivElement>(null);

    const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
    const [isSideModalOpen, setIsSideModalOpen] = useState(false);

    // Debounce search
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setPage(1);
        }, 500);
        return () => clearTimeout(handler);
    }, [searchQuery]);

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

    const fetchWithdrawals = async () => {
        setLoading(true);
        try {
            const params: any = {
                page,
                limit: 10,
            };
            if (debouncedSearchQuery) {
                params.search = debouncedSearchQuery;
            }
            const response = await api.get(`/withdrawals/all`, { params });
            if (response.data.success) {
                setWithdrawals(response.data.data);
                if (response.data.meta) {
                    setMeta(response.data.meta);
                }
            }
        } catch (error) {
            console.error("Error fetching withdrawals:", error);
            toast.error("Failed to load withdrawals");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWithdrawals();
    }, [page, debouncedSearchQuery]);

    // Client-side filtering fallback
    const filteredWithdrawals = withdrawals.filter((item) => {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch =
            item.teacher.name.toLowerCase().includes(query) ||
            item.teacher.email.toLowerCase().includes(query);

        const matchesTab = item.status === activeTab;

        return matchesSearch && matchesTab;
    });

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const handleActionClick = (e: React.MouseEvent, id: string, withdrawalStatus: string) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setPopoverPosition({ top: rect.top, left: rect.left });
        setActivePopoverId(activePopoverId === id ? null : id);
    };

    const handleViewDetail = (withdrawal: WithdrawalRequest) => {
        setSelectedWithdrawal(withdrawal);
        setIsSideModalOpen(true);
        setActivePopoverId(null); // Close popover when opening modal
    };

    const handleAction = async (action: "PAID" | "REJECTED", withdrawalId: string) => {
        try {
            const payload = {
                status: action,
                adminComment: action === "PAID" ? "Paid via bank transfer." : "Withdrawal request rejected."
            };
            const response = await api.patch(`/withdrawals/status/${withdrawalId}`, payload);
            if (response.data.success) {
                toast.success(`Withdrawal request marked as ${action === "PAID" ? "Paid" : "Rejected"}`);
                fetchWithdrawals(); // Refresh list to reflect correct tab location

                // If modal is open for this withdrawal, update it too optimistically
                if (selectedWithdrawal && selectedWithdrawal._id === withdrawalId) {
                    setSelectedWithdrawal({ ...selectedWithdrawal, status: action });
                }
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating withdrawal status:", error);
            toast.error("An error occurred while updating the status");
        }
        setActivePopoverId(null);
    };

    const getImageUrl = (path?: string, name?: string) => {
        if (path) {
            return path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Unknown')}&background=E0EAFF&color=0A47C2`;
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 relative font-sans">
            {/* Top Bar Card */}
            <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { setActiveTab("PENDING"); setPage(1); }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "PENDING"
                            ? "bg-[#FFFBEB] text-amber-600"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => { setActiveTab("PAID"); setPage(1); }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "PAID"
                            ? "bg-[#22C55E] text-white"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Paid
                    </button>
                    <button
                        onClick={() => { setActiveTab("REJECTED"); setPage(1); }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "REJECTED"
                            ? "bg-red-50 text-red-500"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Rejected
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search teacher..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            {/* Withdrawal Table Card */}
            <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                {["Teacher AC", "Total balance", "Withdraw request", "Date", "Status", "Actions"].map((header) => (
                                    <th key={header} className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider font-sans text-center first:text-left">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && withdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center gap-2 text-gray-500">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="font-sans text-sm">Loading withdrawals...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredWithdrawals.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center font-sans text-sm text-gray-500">
                                        No withdrawal requests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredWithdrawals.map((withdrawal) => (
                                    <tr key={withdrawal._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-sm font-medium text-[#0D1C35] font-sans truncate max-w-[200px]" title={withdrawal.teacher.email}>
                                            {withdrawal.teacher.name}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center font-bold text-[#0D1C35]">
                                            {withdrawal.teacher.balance} KD
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center font-bold text-[#0D1C35]">
                                            {withdrawal.amount} KD
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">
                                            {formatDate(withdrawal.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${withdrawal.status === "PAID"
                                                ? "bg-green-50 text-green-500"
                                                : withdrawal.status === "REJECTED"
                                                    ? "bg-red-50 text-red-500"
                                                    : "bg-[#FFFBEB] text-amber-600"
                                                }`}>
                                                {withdrawal.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center relative">
                                            <button
                                                onClick={(e) => handleActionClick(e, withdrawal._id, withdrawal.status)}
                                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 group-hover:text-blue-600"
                                            >
                                                <MoreHorizontal size={20} />
                                            </button>

                                            {activePopoverId === withdrawal._id && (
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
                                                    {withdrawal.status === "PENDING" && (
                                                        <>
                                                            <button
                                                                onClick={() => handleAction("PAID", withdrawal._id)}
                                                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <CheckCircle2 size={14} className="text-green-500" />
                                                                Paid
                                                            </button>

                                                            <button
                                                                onClick={() => handleAction("REJECTED", withdrawal._id)}
                                                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                            >
                                                                <XCircle size={14} className="text-red-500" />
                                                                Rejected
                                                            </button>
                                                        </>
                                                    )}

                                                    <button
                                                        onClick={() => handleViewDetail(withdrawal)}
                                                        className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                                    >
                                                        <Eye size={14} className="text-[#0A47C2]" />
                                                        Details
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

            {/* Transaction Detail Modal */}
            {isSideModalOpen && selectedWithdrawal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/40 backdrop-blur-[2px]"
                        onClick={() => setIsSideModalOpen(false)}
                    />
                    <div className="relative w-full max-w-3xl bg-white shadow-2xl rounded-3xl p-6 md:p-8 animate-in zoom-in duration-300 max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Withdrawal Details</h2>
                            <button onClick={() => setIsSideModalOpen(false)} className="bg-gray-50 p-2 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        {selectedWithdrawal.status === "PENDING" && (
                            <div className="flex items-center gap-3 mb-6 bg-amber-50/50 p-4 rounded-xl border border-amber-100/50">
                                <button
                                    onClick={() => handleAction("PAID", selectedWithdrawal._id)}
                                    className="px-4 py-2 bg-[#22C55E] text-white hover:bg-green-600 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                                >
                                    <CheckCircle2 size={16} /> Mark as Paid
                                </button>
                                <button
                                    onClick={() => handleAction("REJECTED", selectedWithdrawal._id)}
                                    className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                                >
                                    <XCircle size={16} /> Reject Request
                                </button>
                            </div>
                        )}

                        <div className="flex flex-col md:flex-row gap-8 mb-8">
                            {/* Left: Overview Card */}
                            <div className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 flex flex-col justify-center items-center text-center">
                                <span className="text-sm font-bold text-gray-500 mb-2">Requested Amount</span>
                                <div className="text-4xl font-black text-[#0A47C2] tracking-tight mb-4">
                                    {selectedWithdrawal.amount} KD
                                </div>
                                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-white border border-gray-100 shadow-sm">
                                    {selectedWithdrawal.status === "PAID" && <CheckCircle2 size={14} className="text-green-500" />}
                                    {selectedWithdrawal.status === "REJECTED" && <XCircle size={14} className="text-red-500" />}
                                    {selectedWithdrawal.status === "PENDING" && <Clock size={14} className="text-amber-500" />}
                                    <span className={
                                        selectedWithdrawal.status === "PAID" ? "text-green-600" :
                                            selectedWithdrawal.status === "REJECTED" ? "text-red-600" :
                                                "text-amber-600"
                                    }>{selectedWithdrawal.status}</span>
                                </div>
                            </div>

                            {/* Right: Teacher Info Profile */}
                            <div className="flex-1 bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex flex-col items-center text-center gap-3">
                                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-gray-50 relative shrink-0">
                                    <Image
                                        unoptimized
                                        src={getImageUrl(selectedWithdrawal.teacher.profileImage, selectedWithdrawal.teacher.name)}
                                        alt={selectedWithdrawal.teacher.name}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-[#0D1C35] font-sans">{selectedWithdrawal.teacher.name}</h3>
                                    <div className="flex items-center justify-center gap-1 text-[11px] text-gray-500 mt-1">
                                        <Mail size={12} /> {selectedWithdrawal.teacher.email}
                                    </div>
                                </div>
                                <div className="mt-2 text-sm font-bold text-gray-600 bg-gray-50 px-4 py-1.5 rounded-full">
                                    Available Balance: <span className="text-[#0D1C35]">{selectedWithdrawal.teacher.balance} KD</span>
                                </div>
                            </div>
                        </div>

                        {/* Bank Details Grid */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100">
                            <div className="flex items-center gap-2 border-b border-gray-50 pb-4 mb-4">
                                <Landmark size={20} className="text-[#0A47C2]" />
                                <h3 className="text-base font-bold text-[#0D1C35]">Bank Information</h3>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Bank Name</span>
                                    <span className="text-sm font-medium text-[#0D1C35] flex items-center gap-2">
                                        <Building2 size={14} className="text-gray-400" />
                                        {selectedWithdrawal.bankDetails?.bankName || "N/A"}
                                    </span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Account Holder</span>
                                    <span className="text-sm font-medium text-[#0D1C35]">{selectedWithdrawal.bankDetails?.accountHolderName || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Account Number</span>
                                    <span className="text-sm font-medium text-[#0D1C35] font-mono">{selectedWithdrawal.bankDetails?.accountNumber || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Routing / Swift</span>
                                    <span className="text-sm font-medium text-[#0D1C35] font-mono">
                                        {selectedWithdrawal.bankDetails?.routingNumber || selectedWithdrawal.bankDetails?.swiftCode || "N/A"}
                                    </span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">IBAN</span>
                                    <span className="text-sm font-medium text-[#0D1C35] font-mono">{selectedWithdrawal.bankDetails?.iban || "N/A"}</span>
                                </div>
                                <div className="md:col-span-2">
                                    <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Location</span>
                                    <span className="text-sm font-medium text-[#0D1C35] flex items-center gap-2">
                                        <Globe2 size={14} className="text-gray-400" />
                                        {selectedWithdrawal.bankDetails?.bankAddress || selectedWithdrawal.bankDetails?.country || "N/A"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Footer Timestamps */}
                        <div className="mt-8 flex justify-between items-center pt-6 border-t border-gray-50">
                            <span className="text-[10px] text-gray-400 font-mono tracking-widest">{selectedWithdrawal._id}</span>
                            <span className="text-xs font-bold text-gray-400">{formatDate(selectedWithdrawal.createdAt)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
