"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    ChevronRight,
    ChevronLeft,
    X,
    Eye,
    ArrowRight,
    Phone,
    Mail,
    Loader2
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import api from "@/lib/axios";

interface Payment {
    _id: string;
    student: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    teacher: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    amount: number;
    commission: number;
    teacherFee: number;
    currency: string;
    status: "PAID" | "PENDING" | "FAILED";
    createdAt: string;
    invoiceId?: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
}

export default function AdminPaymentPage() {
    const [activeTab, setActiveTab] = useState<"All" | "PAID" | "PENDING" | "FAILED">("All");
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
    const [page, setPage] = useState(1);

    const [payments, setPayments] = useState<Payment[]>([]);
    const [meta, setMeta] = useState<Meta>({ page: 1, limit: 10, total: 0 });
    const [loading, setLoading] = useState(true);

    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isSideModalOpen, setIsSideModalOpen] = useState(false);

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

    const getImageUrl = (path?: string, name?: string) => {
        if (path) {
            return path.startsWith('http') ? path : `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
        }
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Unknown')}&background=E0EAFF&color=0A47C2`;
    };

    // Fetch Payments
    useEffect(() => {
        const fetchPayments = async () => {
            setLoading(true);
            try {
                const params: any = {
                    page,
                    limit: 10,
                };
                if (debouncedSearchQuery) {
                    params.search = debouncedSearchQuery;
                }
                const response = await api.get(`/dashboard/all-payments`, { params });
                if (response.data.success) {
                    setPayments(response.data.data.data);
                    if (response.data.data.meta) {
                        setMeta(response.data.data.meta);
                    }
                }
            } catch (error) {
                console.error("Error fetching payments:", error);
                toast.error("Failed to load payments");
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [page, debouncedSearchQuery]);

    // Client-side filtering fallback for exact tab status routing
    const filteredPayments = payments.filter((payment) => {
        const query = debouncedSearchQuery.toLowerCase();
        const matchesSearch =
            payment.student.name.toLowerCase().includes(query) ||
            payment.teacher.name.toLowerCase().includes(query) ||
            payment.student.email.toLowerCase().includes(query) ||
            (payment.invoiceId || "").toLowerCase().includes(query);

        const matchesTab = activeTab === "All" || payment.status === activeTab;

        return matchesSearch && matchesTab;
    });

    const handleViewDetail = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsSideModalOpen(true);
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8">
            {/* Top Bar Card */}
            <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => { setActiveTab("All"); setPage(1); }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "All"
                            ? "bg-[#E0EAFF] text-[#0A47C2]"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => { setActiveTab("PAID"); setPage(1); }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "PAID"
                            ? "bg-green-50 text-green-600"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Paid
                    </button>
                    <button
                        onClick={() => { setActiveTab("PENDING"); setPage(1); }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "PENDING"
                            ? "bg-amber-50 text-amber-600"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => { setActiveTab("FAILED"); setPage(1); }}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "FAILED"
                            ? "bg-red-50 text-red-500"
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Failed
                    </button>
                </div>

                <div className="relative w-full md:w-64">
                    <input
                        type="text"
                        placeholder="Search by name..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                    />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                </div>
            </div>

            {/* Payment Table Card */}
            <div className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                {["Invoice ID", "Student", "Teacher", "Student Pay", "Commission", "Teacher fee", "Date", "Status", "Actions"].map((header) => (
                                    <th key={header} className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider font-sans text-center first:text-left">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading && payments.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center">
                                        <div className="flex justify-center items-center gap-2 text-gray-500">
                                            <Loader2 className="animate-spin" size={20} />
                                            <span className="font-sans text-sm">Loading payments...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredPayments.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-6 py-12 text-center font-sans text-sm text-gray-500">
                                        No payments found.
                                    </td>
                                </tr>
                            ) : (
                                filteredPayments.map((payment) => (
                                    <tr key={payment._id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4 text-xs font-semibold text-gray-500 font-mono tracking-wider">{payment.invoiceId || '-'}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-[#0D1C35] font-sans truncate max-w-[150px]">{payment.student.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center truncate max-w-[150px]">{payment.teacher.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center font-bold text-[#0D1C35]">{payment.amount} KD</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{payment.commission} KD</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center font-bold text-[#0D1C35]">{payment.teacherFee} KD</td>
                                        <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{formatDate(payment.createdAt)}</td>
                                        <td className="px-6 py-4 text-center">
                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${payment.status === "PAID"
                                                    ? "bg-green-50 text-green-500"
                                                    : payment.status === "FAILED"
                                                        ? "bg-red-50 text-red-500"
                                                        : "bg-amber-50 text-amber-500"
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button
                                                onClick={() => handleViewDetail(payment)}
                                                className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 hover:text-[#0A47C2]"
                                            >
                                                <Eye size={20} />
                                            </button>
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

            {/* Transaction Detail Small Modal */}
            {isSideModalOpen && selectedPayment && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
                        onClick={() => setIsSideModalOpen(false)}
                    />
                    <div className="relative w-full max-w-2xl bg-white shadow-2xl rounded-3xl p-8 animate-in zoom-in duration-300">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Payment Details</h2>
                            <button onClick={() => setIsSideModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
                            {/* Student Info Card */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-full md:w-64">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                        <Image
                                            unoptimized
                                            src={getImageUrl(selectedPayment.student.profileImage, selectedPayment.student.name)}
                                            alt="Student"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-[#0D1C35] font-sans truncate" title={selectedPayment.student.name}>{selectedPayment.student.name}</h3>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium truncate" title={selectedPayment.student.email}>
                                            <Mail size={10} /> {selectedPayment.student.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500">Student Paid</span>
                                    <span className="text-xs font-bold text-[#0D1C35]">{selectedPayment.amount} KD</span>
                                </div>
                            </div>

                            {/* Arrow Indicator */}
                            <div className="flex flex-col items-center justify-center text-green-500 rotate-90 md:rotate-0 py-2">
                                <span className="text-[10px] uppercase font-bold text-gray-400 absolute -top-4 whitespace-nowrap">Commission: {selectedPayment.commission} KD</span>
                                <ArrowRight size={24} className="mt-2" />
                            </div>

                            {/* Teacher Info Card */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-full md:w-64">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                        <Image
                                            unoptimized
                                            src={getImageUrl(selectedPayment.teacher.profileImage, selectedPayment.teacher.name)}
                                            alt="Teacher"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-[#0D1C35] font-sans truncate" title={selectedPayment.teacher.name}>{selectedPayment.teacher.name}</h3>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium truncate" title={selectedPayment.teacher.email}>
                                            <Mail size={10} /> {selectedPayment.teacher.email}
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                                    <span className="text-xs font-semibold text-gray-500">Teacher Fee</span>
                                    <span className="text-xs font-bold text-[#0A47C2]">{selectedPayment.teacherFee} KD</span>
                                </div>
                            </div>
                        </div>

                        {/* Transaction ID & Date Footer */}
                        <div className="mt-8 flex justify-between items-center pt-4 border-t border-gray-50">
                            <span className="text-xs text-gray-400 font-mono tracking-widest">{selectedPayment._id}</span>
                            <span className="text-xs font-medium text-gray-500">{formatDate(selectedPayment.createdAt)}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
