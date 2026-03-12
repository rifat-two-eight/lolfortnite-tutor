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
    Eye
} from "lucide-react";
import { toast } from "sonner";

interface Teacher {
    id: number;
    name: string;
    phone: string;
    email: string;
    totalSellClass: number;
    totalEarning: string;
    date: string;
    status: "Approved" | "Pending";
}

const mockTeachers: Teacher[] = Array(7).fill(null).map((_, i) => ({
    id: i + 1,
    name: "Anna Jensen",
    phone: "+88 01745826592",
    email: "user@gmail.com",
    totalSellClass: 5015,
    totalEarning: "$5,765",
    date: "1 Jan, 2026",
    status: "Approved"
}));

export default function AdminTeacherPage() {
    const [activeTab, setActiveTab] = useState<"Pending" | "Approved">("Pending");
    const [searchQuery, setSearchQuery] = useState("");
    const [activePopoverId, setActivePopoverId] = useState<number | null>(null);
    const [isApproveSubMenuOpen, setIsApproveSubMenuOpen] = useState(false);
    const popoverRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
                setActivePopoverId(null);
                setIsApproveSubMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleActionClick = (id: number) => {
        setActivePopoverId(activePopoverId === id ? null : id);
        setIsApproveSubMenuOpen(false);
    };

    const handleStatusUpdate = (status: string, subType?: string) => {
        const message = subType 
            ? `Teacher ${status} for ${subType}` 
            : `Teacher moved to ${status}`;
        
        toast.success(message);
        setActivePopoverId(null);
        setIsApproveSubMenuOpen(false);
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8">
            {/* Top Bar Card */}
            <div className="bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => setActiveTab("Pending")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                            activeTab === "Pending" 
                            ? "bg-[#E0EAFF] text-[#0A47C2]" 
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        Pending
                    </button>
                    <button 
                        onClick={() => setActiveTab("Approved")}
                        className={`px-6 py-2 rounded-full text-sm font-medium transition-all ${
                            activeTab === "Approved" 
                            ? "bg-[#22C55E] text-white" 
                            : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                        }`}
                    >
                        Approved
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
                        {mockTeachers.map((teacher) => (
                            <tr key={teacher.id} className="hover:bg-gray-50/50 transition-colors group">
                                <td className="px-6 py-4 text-sm font-medium text-[#0D1C35] font-sans">{teacher.name}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{teacher.phone}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{teacher.email}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 text-center font-sans">{teacher.totalSellClass}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{teacher.totalEarning}</td>
                                <td className="px-6 py-4 text-sm text-gray-600 font-sans text-center">{teacher.date}</td>
                                <td className="px-6 py-4 text-center">
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold ${
                                        teacher.status === "Approved" 
                                        ? "bg-green-50 text-green-500" 
                                        : "bg-blue-50 text-blue-500"
                                    }`}>
                                        {teacher.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center relative">
                                    <button 
                                        onClick={() => handleActionClick(teacher.id)}
                                        className="p-1 hover:bg-gray-100 rounded-md transition-colors text-gray-400 group-hover:text-blue-600"
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>

                                    {/* Small Popover Modal */}
                                    {activePopoverId === teacher.id && (
                                        <div 
                                            ref={popoverRef}
                                            className="absolute right-full mr-2 top-0 z-50 w-48 bg-white shadow-xl rounded-xl border border-gray-100 p-2 animate-in fade-in zoom-in duration-200 flex flex-col gap-1"
                                        >
                                            <div className="relative group/approve">
                                                <button 
                                                    onClick={() => setIsApproveSubMenuOpen(!isApproveSubMenuOpen)}
                                                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-bold transition-colors ${
                                                        isApproveSubMenuOpen ? "bg-[#22C55E] text-white" : "text-gray-700 hover:bg-gray-50"
                                                    }`}
                                                >
                                                    <div className="flex items-center gap-2">
                                                        <Check size={14} className={isApproveSubMenuOpen ? "text-white" : "text-[#22C55E]"} />
                                                        Approve
                                                    </div>
                                                    <ChevronRight size={14} className={isApproveSubMenuOpen ? "rotate-90 transition-transform" : ""} />
                                                </button>

                                                {/* Approve Sub-menu */}
                                                {isApproveSubMenuOpen && (
                                                    <div className="absolute right-full top-0 mr-1 w-40 bg-white shadow-xl rounded-xl border border-gray-100 p-2 animate-in fade-in slide-in-from-right-2 duration-200 flex flex-col gap-1">
                                                        {["For All", "Group listing", "One-To-One"].map((option) => (
                                                            <button 
                                                                key={option}
                                                                onClick={() => handleStatusUpdate("Approved", option)}
                                                                className="w-full text-left px-3 py-2 rounded-lg text-[11px] font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                                                            >
                                                                {option}
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>

                                            <button 
                                                onClick={() => handleStatusUpdate("Pending")}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Clock size={14} className="text-amber-500" />
                                                Pending
                                            </button>

                                            <button 
                                                onClick={() => handleStatusUpdate("Rejected")}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <X size={14} className="text-red-500" />
                                                Reject
                                            </button>

                                            <button 
                                                onClick={() => handleStatusUpdate("Viewed")}
                                                className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors"
                                            >
                                                <Eye size={14} className="text-[#0A47C2]" />
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
                            className={`w-8 h-8 flex items-center justify-center rounded-full text-xs font-bold transition-all ${
                                page === 2 
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
        </div>
    );
}
