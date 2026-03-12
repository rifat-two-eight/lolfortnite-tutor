"use client";

import React, { useState, useRef, useEffect } from "react";
import {
    Search,
    MoreHorizontal,
    ChevronRight,
    ChevronLeft,
    X,
    Eye,
    ArrowRight,
    Phone,
    Mail
} from "lucide-react";
import Image from "next/image";

interface Payment {
    id: number;
    studentAc: string;
    teacherAc: string;
    studentPay: string;
    commission: string;
    teacherFee: string;
    date: string;
    status: "Paid" | "Pending" | "Failed";
    studentName: string;
    teacherName: string;
}

const mockPayments: Payment[] = Array(7).fill(null).map((_, i) => ({
    id: i + 1,
    studentAc: "12345678901",
    teacherAc: "12345678901",
    studentPay: "$100",
    commission: "$20",
    teacherFee: "$80",
    date: "1 Jan, 2026",
    status: i % 3 === 0 ? "Paid" : i % 3 === 1 ? "Failed" : "Pending",
    studentName: "Vako Shvili-S",
    teacherName: "Vako Shvili-T"
}));

export default function AdminPaymentPage() {
    const [activeTab, setActiveTab] = useState<"Paid" | "Pending" | "Failed">("Paid");
    const [searchQuery, setSearchQuery] = useState("");
    const [activePopoverId, setActivePopoverId] = useState<number | null>(null);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const [isSideModalOpen, setIsSideModalOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setActivePopoverId(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleActionClick = (id: number) => {
        setActivePopoverId(activePopoverId === id ? null : id);
    };

    const handleViewDetail = (payment: Payment) => {
        setSelectedPayment(payment);
        setIsSideModalOpen(true);
        setActivePopoverId(null);
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8">
            {/* Top Bar Card */}
            <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setActiveTab("Paid")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Paid"
                                ? "bg-[#E0EAFF] text-[#0A47C2]"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Paid
                    </button>
                    <button
                        onClick={() => setActiveTab("Pending")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Pending"
                                ? "bg-[#E0EAFF] text-[#0A47C2]"
                                : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                            }`}
                    >
                        Pending
                    </button>
                    <button
                        onClick={() => setActiveTab("Failed")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${activeTab === "Failed"
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
                        placeholder="Search"
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
                                {["Student AC", "Teacher AC", "Student Pay", "Commission", "Teacher fee", "Date", "Status", "Actions"].map((header) => (
                                    <th key={header} className="px-6 py-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider font-sans text-center first:text-left">
                                        {header}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {mockPayments.map((payment) => (
                                <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium text-[#0D1C35] font-sans">{payment.studentAc}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{payment.teacherAc}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center font-bold text-[#0D1C35]">{payment.studentPay}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{payment.commission}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center font-bold text-[#0D1C35]">{payment.teacherFee}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{payment.date}</td>
                                    <td className="px-6 py-4 text-center">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${payment.status === "Paid"
                                                ? "bg-green-50 text-green-500"
                                                : payment.status === "Failed"
                                                    ? "bg-red-50 text-red-500"
                                                    : "bg-blue-50 text-blue-500"
                                            }`}>
                                            {payment.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center relative">
                                        <button
                                            onClick={() => handleActionClick(payment.id)}
                                            className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 group-hover:text-blue-600"
                                        >
                                            <MoreHorizontal size={20} />
                                        </button>

                                        {/* Action Popover */}
                                        {activePopoverId === payment.id && (
                                            <div
                                                ref={popoverRef}
                                                className="absolute right-full mr-2 top-0 z-50 w-32 bg-white shadow-xl rounded-xl border border-gray-100 p-2 animate-in fade-in zoom-in duration-200"
                                            >
                                                <button
                                                    onClick={() => handleViewDetail(payment)}
                                                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-[#0A47C2] text-white rounded-lg text-xs font-bold hover:opacity-90 transition-opacity"
                                                >
                                                    View
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-end gap-2 mt-6">
                <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors">
                    <ChevronLeft size={20} />
                </button>
                <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((page) => (
                        <button
                            key={page}
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${page === 2
                                    ? "bg-[#0A47C2] text-white shadow-lg shadow-blue-200"
                                    : "text-gray-400 hover:text-blue-600"
                                }`}
                        >
                            {page.toString().padStart(2, '0')}
                        </button>
                    ))}
                </div>
                <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors">
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
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Details</h2>
                            <button onClick={() => setIsSideModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row items-center justify-center gap-6 py-4">
                            {/* Student Info Card */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-full md:w-64">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                        <Image src="/authpic.jpg" alt="Student" fill className="object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-[#0D1C35] font-sans truncate">{selectedPayment.studentName}</h3>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                            <Phone size={10} /> +1234567890
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium truncate">
                                            <Mail size={10} /> {selectedPayment.studentName.toLowerCase().replace(' ', '')}@gmail.com
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-[#0A47C2]">{selectedPayment.studentPay}</span>
                                </div>
                            </div>

                            {/* Arrow Indicator */}
                            <div className="flex items-center justify-center text-gray-300 rotate-90 md:rotate-0 py-2">
                                <ArrowRight size={20} />
                            </div>

                            {/* Teacher Info Card */}
                            <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-sm w-full md:w-64">
                                <div className="flex items-start gap-4">
                                    <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0 border border-gray-100">
                                        <Image src="/authpic.jpg" alt="Teacher" fill className="object-cover" />
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="text-sm font-bold text-[#0D1C35] font-sans truncate">{selectedPayment.teacherName}</h3>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium">
                                            <Phone size={10} /> +1234567890
                                        </div>
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 font-medium truncate">
                                            <Mail size={10} /> {selectedPayment.teacherName.toLowerCase().replace(' ', '')}@gmail.com
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50">
                                    <span className="text-xs font-bold text-[#0A47C2]">{selectedPayment.teacherFee}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
