"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
    DollarSign,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    Plus,
    MoreHorizontal,
    ChevronDown,
    X,
    Check,
    CalendarDays,
    Trash2,
    Pencil
} from "lucide-react";
import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";
import { toast } from "sonner";
import api from "@/lib/axios";
import Swal from "sweetalert2";

interface FinancialStats {
    totalRevenue: number;
    currentBalance: number;
    totalWithdrawals: number;
    todayRevenue: number;
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

interface WithdrawRequest {
    _id: string;
    amount: number;
    status: "PENDING" | "APPROVED" | "CANCELLED" | "PAID";
    adminComment: string;
    bankDetails: {
        bankName: string;
        accountNumber: string;
    };
    createdAt: string;
    updatedAt: string;
}

interface BankDetails {
    _id?: string;
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    routingNumber: string;
    branchName: string;
    swiftCode: string;
    iban: string;
    country: string;
    bankAddress: string;
    beneficiaryAddress: string;
    isDefault: boolean;
}

interface WithdrawMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function TeacherEarningPage() {
    const [isBankModalOpen, setIsBankModalOpen] = useState(false);
    const [editingBankId, setEditingBankId] = useState<string | null>(null);
    const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
    const [withdrawAmount, setWithdrawAmount] = useState("");
    const [selectedPayment, setSelectedPayment] = useState<string | null>(null);
    const [activeActionId, setActiveActionId] = useState<string | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [stats, setStats] = useState<FinancialStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Bank account state
    const [bankAccounts, setBankAccounts] = useState<BankDetails[]>([]);
    const [bankLoading, setBankLoading] = useState(true);
    const [bankFormData, setBankFormData] = useState<BankDetails>({
        accountHolderName: "",
        bankName: "",
        accountNumber: "",
        routingNumber: "",
        branchName: "",
        swiftCode: "",
        iban: "",
        country: "",
        bankAddress: "",
        beneficiaryAddress: "",
        isDefault: true
    });

    // Withdraw history state
    const [withdrawHistory, setWithdrawHistory] = useState<WithdrawRequest[]>([]);
    const [withdrawLoading, setWithdrawLoading] = useState(true);
    const [withdrawMeta, setWithdrawMeta] = useState<WithdrawMeta | null>(null);

    // Earning chart state
    const [earningData, setEarningData] = useState<EarningDay[]>([]);
    const [earningMeta, setEarningMeta] = useState<{ startDate: string; endDate: string } | null>(null);
    const [earningLoading, setEarningLoading] = useState(true);

    // Calendar picker state
    const [showCalendar, setShowCalendar] = useState(false);
    const [selectedDate, setSelectedDate] = useState<string>(toISODate(new Date()));
    const calendarRef = useRef<HTMLDivElement>(null);

    // Close calendar/popover on outside click/scroll
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCalendar(false);
            }
        }

        const handleScroll = () => {
            if (activeActionId) {
                setActiveActionId(null);
            }
        };

        if (showCalendar) document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener("scroll", handleScroll, true);
        
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("scroll", handleScroll, true);
        };
    }, [showCalendar, activeActionId]);

    useEffect(() => {
        api.get("/dashboard/teacher-financial-stats")
            .then((res) => {
                if (res.data.success) {
                    setStats(res.data.data);
                }
            })
            .catch((err) => {
                console.error("Error fetching financial stats:", err);
            })
            .finally(() => {
                setLoading(false);
            });
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

    // Fetch withdrawal history
    const fetchWithdrawHistory = () => {
        setWithdrawLoading(true);
        api.get<{ success: boolean; data: WithdrawRequest[]; meta: WithdrawMeta }>(
            "/withdrawals/my-requests"
        )
            .then(res => {
                if (res.data.success) {
                    setWithdrawHistory(res.data.data);
                    setWithdrawMeta(res.data.meta);
                }
            })
            .catch(console.error)
            .finally(() => setWithdrawLoading(false));
    };

    useEffect(() => {
        fetchWithdrawHistory();
        fetchBankAccounts();
    }, []);

    // Fetch bank accounts
    const fetchBankAccounts = () => {
        setBankLoading(true);
        api.get<{ success: boolean; data: BankDetails[] }>("/bank-details")
            .then(res => {
                if (res.data.success) {
                    setBankAccounts(res.data.data);
                    // Select default bank account if any
                    const defaultBank = res.data.data.find(b => b.isDefault);
                    if (defaultBank) setSelectedPayment(defaultBank._id || null);
                }
            })
            .catch(console.error)
            .finally(() => setBankLoading(false));
    };

    const handleDeleteBank = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this bank account?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#3B82F6",
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "No, keep it"
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/bank-details/${id}`)
                    .then(res => {
                        if (res.data.success) {
                            Swal.fire("Deleted!", "Bank account has been deleted.", "success");
                            fetchBankAccounts();
                            if (selectedPayment === id) setSelectedPayment(null);
                        }
                    })
                    .catch(err => {
                        toast.error(err.response?.data?.message || "Failed to delete bank account");
                    });
            }
        });
    };

    const handleWithdrawRequest = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPayment) {
            Swal.fire("Error", "Please select a bank account first", "error");
            return;
        }

        const amount = parseFloat(withdrawAmount);
        if (isNaN(amount) || amount <= 0) {
            Swal.fire("Error", "Please enter a valid amount", "error");
            return;
        }

        if (stats && amount > stats.currentBalance) {
            Swal.fire("Error", "Insufficient balance", "error");
            return;
        }

        setWithdrawLoading(true);
        api.post("/withdrawals/request", {
            amount,
            bankDetailsId: selectedPayment
        })
            .then(res => {
                if (res.data.success) {
                    Swal.fire("Success", "Withdrawal request submitted successfully", "success");
                    setIsWithdrawModalOpen(false);
                    setWithdrawAmount("");
                    // Refresh data
                    fetchWithdrawHistory();
                    // Refetch stats
                    api.get("/dashboard/teacher-financial-stats").then(r => r.data.success && setStats(r.data.data));
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || "Failed to submit withdrawal request");
            })
            .finally(() => setWithdrawLoading(false));
    };

    const handleEditBank = (e: React.MouseEvent, bank: BankDetails) => {
        e.stopPropagation();
        setBankFormData({
            accountHolderName: bank.accountHolderName,
            bankName: bank.bankName,
            accountNumber: bank.accountNumber,
            routingNumber: bank.routingNumber || "",
            branchName: bank.branchName || "",
            swiftCode: bank.swiftCode || "",
            iban: bank.iban || "",
            country: bank.country,
            bankAddress: bank.bankAddress || "",
            beneficiaryAddress: bank.beneficiaryAddress || "",
            isDefault: bank.isDefault
        });
        setEditingBankId(bank._id || null);
        setIsBankModalOpen(true);
    };

    const handleCancelWithdraw = (id: string) => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to cancel this withdrawal request?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#3B82F6",
            confirmButtonText: "Yes, cancel it!",
            cancelButtonText: "No, keep it"
        }).then((result) => {
            if (result.isConfirmed) {
                api.patch(`/withdrawals/cancel/${id}`)
                    .then(res => {
                        if (res.data.success) {
                            Swal.fire("Cancelled!", "Your request has been cancelled.", "success");
                            fetchWithdrawHistory();
                        }
                    })
                    .catch(err => {
                        toast.error(err.response?.data?.message || "Failed to cancel withdrawal");
                    })
                    .finally(() => setActiveActionId(null));
            } else {
                setActiveActionId(null);
            }
        });
    };

    const handleSubmitBank = (e: React.FormEvent) => {
        e.preventDefault();
        setBankLoading(true);
        const request = editingBankId
            ? api.patch(`/bank-details/${editingBankId}`, bankFormData)
            : api.post("/bank-details", bankFormData);

        request
            .then(res => {
                if (res.data.success) {
                    Swal.fire("Success", `Bank details ${editingBankId ? "updated" : "added"} successfully`, "success");
                    setIsBankModalOpen(false);
                    setEditingBankId(null);
                    fetchBankAccounts();
                    setBankFormData({
                        accountHolderName: "",
                        bankName: "",
                        accountNumber: "",
                        routingNumber: "",
                        branchName: "",
                        swiftCode: "",
                        iban: "",
                        country: "",
                        bankAddress: "",
                        beneficiaryAddress: "",
                        isDefault: true
                    });
                }
            })
            .catch(err => {
                toast.error(err.response?.data?.message || `Failed to ${editingBankId ? "update" : "add"} bank details`);
            })
            .finally(() => setBankLoading(false));
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 bg-[#F9FAFB] min-h-screen">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: "Total Revenue", value: stats ? `${stats.totalRevenue.toLocaleString()} KD` : "0.00 KD", icon: DollarSign, color: "bg-amber-50 text-amber-500" },
                    { label: "Current Balance", value: stats ? `${stats.currentBalance.toLocaleString()} KD` : "0.00 KD", icon: CreditCard, color: "bg-blue-50 text-blue-500" },
                    { label: "Total Withdrawals", value: stats ? `${stats.totalWithdrawals.toLocaleString()} KD` : "0.00 KD", icon: TrendingUp, color: "bg-red-50 text-red-500" },
                    { label: "Today Revenue", value: stats ? `${stats.todayRevenue.toLocaleString()} KD` : "0.00 KD", icon: ArrowUpRight, color: "bg-emerald-50 text-emerald-500" },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-none border border-gray-100 shadow-sm flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div>
                            {loading ? (
                                <div className="h-5 w-20 bg-gray-100 animate-pulse mb-1" />
                            ) : (
                                <p className="text-sm font-bold text-[#0D1C35]">{stat.value}</p>
                            )}
                            <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Statistic Chart */}
                <div className="lg:col-span-2 bg-white p-8 border border-gray-100 rounded-none shadow-sm space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold text-[#0D1C35]">Statistic</h2>
                        <div className="flex items-center gap-1 text-xs font-medium text-gray-400">
                            {/* Calendar icon + picker */}
                            <div className="relative" ref={calendarRef}>
                                <button
                                    onClick={() => setShowCalendar(prev => !prev)}
                                    title="Select start date"
                                    className="flex items-center gap-1.5 text-[#0A47C2] hover:bg-blue-50 transition-colors px-2 py-1 rounded-none border border-gray-100"
                                >
                                    <CalendarDays size={16} />
                                    <span className="text-xs font-sans text-gray-500">
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
                    </div>
                    <div className="h-64 w-full relative">
                        {earningLoading ? (
                            <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-10">
                                <div className="w-8 h-8 border-2 border-[#0A47C2] border-t-transparent animate-spin rounded-full" />
                            </div>
                        ) : null}
                        <ChartContainer config={{ earning: { label: "Earning", color: "#22C55E" } }} className="h-full w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={earningData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
                                    <CartesianGrid vertical={false} stroke="#F3F4F6" strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="day"
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
                                        stroke="#22C55E"
                                        strokeWidth={3}
                                        fill="none"
                                        dot={{ r: 4, fill: "#22C55E", strokeWidth: 2, stroke: "#fff" }}
                                        activeDot={{ r: 6, strokeWidth: 0 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </ChartContainer>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Withdraw Your Money */}
                <div className="bg-white p-8 border border-gray-100 rounded-none shadow-sm space-y-8">
                    <h2 className="text-lg font-bold text-[#0D1C35]">Withdraw your money</h2>

                    <div className="space-y-4">
                        <p className="text-xs font-bold text-gray-300 uppercase tracking-widest">Saved bank accounts:</p>

                        {/* Card Options */}
                        <div className="space-y-3">
                            {bankLoading ? (
                                <div className="py-4 text-center">
                                    <div className="w-5 h-5 border-2 border-orange-500 border-t-transparent animate-spin rounded-full mx-auto" />
                                </div>
                            ) : bankAccounts.length === 0 ? (
                                <p className="text-xs text-gray-400 font-sans text-center py-4 italic">No bank accounts added yet.</p>
                            ) : (
                                bankAccounts.map((bank) => (
                                    <div
                                        key={bank._id}
                                        onClick={() => setSelectedPayment(bank._id || null)}
                                        className={`p-4 border  flex items-center justify-between cursor-pointer transition-all ${selectedPayment === bank._id ? "border-emerald-400 bg-emerald-50/10" : "border-gray-100"
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                                <CreditCard size={14} />
                                            </div>
                                            <div>
                                                <p className="text-xs font-bold text-[#0D1C35]">{bank.bankName}</p>
                                                <p className="text-[10px] text-gray-400 font-medium">Account: ****{bank.accountNumber.slice(-4)}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${selectedPayment === bank._id ? "bg-emerald-500 text-white" : "border border-gray-200"
                                                }`}>
                                                {selectedPayment === bank._id && <Check size={12} />}
                                            </div>
                                            <button
                                                onClick={(e) => handleEditBank(e, bank)}
                                                className="p-1.5 text-gray-300 hover:text-[#0A47C2] transition-colors"
                                            >
                                                <Pencil size={14} />
                                            </button>
                                            <button
                                                onClick={(e) => handleDeleteBank(e, bank._id || "")}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}

                            {/* Add New Bank Button */}
                            <button
                                onClick={() => setIsBankModalOpen(true)}
                                className="w-full border-2 border-dashed border-gray-100 py-4 flex items-center justify-center gap-2 text-gray-400 hover:border-blue-200 hover:text-blue-500 transition-all font-bold text-xs mt-2"
                            >
                                <Plus size={14} className="text-orange-400" />
                                Add Bank Account
                            </button>
                        </div>

                    </div>

                    <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xl font-bold text-[#0D1C35]">
                                {stats ? `${stats.currentBalance.toLocaleString()} KD` : "0.00 KD"}
                            </p>
                            <p className="text-xs text-gray-400 font-medium">Current Balance</p>
                        </div>
                        <button
                            onClick={() => {
                                if (!selectedPayment) {
                                    toast.error("Please select a bank account first");
                                    return;
                                }
                                setIsWithdrawModalOpen(true);
                            }}
                            className="bg-orange-500 text-white px-8 py-4 rounded-none font-bold text-sm shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-colors"
                        >
                            Withdraw Money
                        </button>
                    </div>
                </div>

                {/* Withdraw History */}
                <div className="lg:col-span-2 bg-white p-8 border border-gray-100 rounded-none shadow-sm space-y-6">
                    <h2 className="text-lg font-bold text-[#0D1C35]">Withdraw History</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="text-[10px] uppercase font-bold text-gray-400 tracking-[1.5px] border-b border-gray-50">
                                    <th className="pb-4 font-bold">Date</th>
                                    <th className="pb-4 font-bold">Method</th>
                                    <th className="pb-4 font-bold">Amount</th>
                                    <th className="pb-4 font-bold text-right pr-12">Status</th>
                                    <th className="pb-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {withdrawLoading ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center">
                                            <div className="flex items-center justify-center gap-2">
                                                <div className="w-4 h-4 border-2 border-orange-500 border-t-transparent animate-spin rounded-full" />
                                                <span className="text-xs font-bold text-gray-400">Loading history...</span>
                                            </div>
                                        </td>
                                    </tr>
                                ) : withdrawHistory.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-xs font-bold text-gray-400">
                                            No withdrawal requests found.
                                        </td>
                                    </tr>
                                ) : (
                                    withdrawHistory.map((row) => (
                                        <tr key={row._id} className="group hover:bg-gray-50/50 transition-all">
                                            <td className="py-5 text-xs font-bold text-[#0D1C35] font-sans">
                                                {new Date(row.createdAt).toLocaleDateString('en-GB', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>
                                            <td className="py-5 text-xs font-bold text-gray-400 font-sans">{row.bankDetails?.bankName || "—"}</td>
                                            <td className="py-5 text-xs font-bold text-gray-400 font-sans">{row.amount.toLocaleString()} KD</td>
                                            <td className="py-5 text-right pr-12">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-sm ${row.status === "PENDING" ? "text-orange-400 bg-orange-50" :
                                                    row.status === "PAID" ? "text-emerald-500 bg-emerald-50" :
                                                        row.status === "APPROVED" ? "text-blue-500 bg-blue-50" : "text-red-400 bg-red-50"
                                                    }`}>
                                                    {row.status === "REJECTED" ? "CANCELLED" : row.status}
                                                </span>
                                            </td>
                                            <td className="py-5 text-right relative">
                                                <button
                                                    onClick={(e) => {
                                                        const rect = e.currentTarget.getBoundingClientRect();
                                                        setPopoverPosition({ top: rect.top, left: rect.left });
                                                        setActiveActionId(activeActionId === row._id ? null : row._id);
                                                    }}
                                                    className="p-2 text-gray-200 group-hover:text-gray-400 transition-colors"
                                                >
                                                    <MoreHorizontal size={18} />
                                                </button>
                                                {activeActionId === row._id && (
                                                    <div 
                                                        style={{
                                                            position: 'fixed',
                                                            top: `${popoverPosition.top}px`,
                                                            left: `${popoverPosition.left - 180}px`,
                                                            zIndex: 9999
                                                        }}
                                                        className="bg-white shadow-xl border border-gray-100 py-3 px-6 whitespace-nowrap animate-in fade-in zoom-in duration-200"
                                                    >
                                                        {row.status === "PENDING" ? (
                                                            <button
                                                                onClick={() => handleCancelWithdraw(row._id)}
                                                                className="text-[10px] font-bold text-gray-400 hover:text-[#0D1C35]"
                                                            >
                                                                Cancel Request
                                                            </button>
                                                        ) : (
                                                            <span className="text-[10px] font-bold text-gray-300">No Actions Available</span>
                                                        )}
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
            </div>


            {/* Add Bank Account Modal */}
            {isBankModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-none shadow-2xl w-full max-w-4xl overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                            <h2 className="text-xl font-bold text-[#0D1C35]">{editingBankId ? "Update Bank Details" : "Add Bank Account"}</h2>
                            <button onClick={() => { setIsBankModalOpen(false); setEditingBankId(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmitBank} className="overflow-y-auto p-8 space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Holder Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={bankFormData.accountHolderName}
                                        onChange={e => setBankFormData({ ...bankFormData, accountHolderName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bank Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={bankFormData.bankName}
                                        onChange={e => setBankFormData({ ...bankFormData, bankName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Account Number</label>
                                    <input
                                        type="number"
                                        required
                                        value={bankFormData.accountNumber}
                                        onChange={e => setBankFormData({ ...bankFormData, accountNumber: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Routing Number</label>
                                    <input
                                        type="text"
                                        value={bankFormData.routingNumber}
                                        onChange={e => setBankFormData({ ...bankFormData, routingNumber: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Branch Name</label>
                                    <input
                                        type="text"
                                        value={bankFormData.branchName}
                                        onChange={e => setBankFormData({ ...bankFormData, branchName: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Swift Code</label>
                                    <input
                                        type="text"
                                        value={bankFormData.swiftCode}
                                        onChange={e => setBankFormData({ ...bankFormData, swiftCode: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">IBAN</label>
                                    <input
                                        type="text"
                                        value={bankFormData.iban}
                                        onChange={e => setBankFormData({ ...bankFormData, iban: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Country</label>
                                    <input
                                        type="text"
                                        required
                                        value={bankFormData.country}
                                        onChange={e => setBankFormData({ ...bankFormData, country: e.target.value })}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Bank Address</label>
                                <textarea
                                    value={bankFormData.bankAddress}
                                    onChange={e => setBankFormData({ ...bankFormData, bankAddress: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans min-h-[80px]"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Beneficiary Address</label>
                                <textarea
                                    value={bankFormData.beneficiaryAddress}
                                    onChange={e => setBankFormData({ ...bankFormData, beneficiaryAddress: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans min-h-[80px]"
                                />
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <input
                                    type="checkbox"
                                    id="isDefault"
                                    checked={bankFormData.isDefault}
                                    onChange={e => setBankFormData({ ...bankFormData, isDefault: e.target.checked })}
                                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="isDefault" className="text-xs font-bold text-gray-500 cursor-pointer">Set as default payment method</label>
                            </div>

                            <div className="flex items-center justify-between pt-6 shrink-0">
                                <button
                                    type="button"
                                    onClick={() => setIsBankModalOpen(false)}
                                    className="px-8 py-3.5 border border-gray-200 text-gray-500 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={bankLoading}
                                    className="px-10 py-3.5 bg-[#0A47C2] text-white rounded-xl text-sm font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-opacity disabled:opacity-50"
                                >
                                    {bankLoading ? (editingBankId ? "Updating..." : "Adding...") : (editingBankId ? "Update Details" : "Add Bank Account")}
                                    {!bankLoading && <ArrowUpRight size={18} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Withdraw Request Modal */}
            {isWithdrawModalOpen && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
                    <div className="bg-white rounded-none shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="flex items-center justify-between px-8 py-6 border-b border-gray-50">
                            <h2 className="text-lg font-bold text-[#0D1C35]">Withdraw Money</h2>
                            <button onClick={() => setIsWithdrawModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleWithdrawRequest} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Bank Account (bankDetailsId)</label>
                                    <select
                                        required
                                        value={selectedPayment || ""}
                                        onChange={e => setSelectedPayment(e.target.value)}
                                        className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-orange-500 font-sans"
                                    >
                                        <option value="" disabled>Choose a bank</option>
                                        {bankAccounts.map(bank => (
                                            <option key={bank._id} value={bank._id}>
                                                {bank.bankName} (****{bank.accountNumber.slice(-4)})
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Withdrawal Amount</label>
                                    <div className="relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">KD</div>
                                        <input
                                            type="number"
                                            required
                                            min="1"
                                            step="0.01"
                                            value={withdrawAmount}
                                            onChange={e => setWithdrawAmount(e.target.value)}
                                            className="w-full pl-10 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-lg text-xl font-bold text-[#0D1C35] focus:outline-none focus:ring-1 focus:ring-orange-500 font-sans"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400">Available Balance: <span className="font-bold text-emerald-500">${stats?.currentBalance.toLocaleString() || "0"}</span></p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsWithdrawModalOpen(false)}
                                    className="px-6 py-3 text-gray-500 text-xs font-bold hover:bg-gray-50 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={withdrawLoading || !selectedPayment}
                                    className="px-8 py-3.5 bg-orange-500 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-orange-500/20"
                                >
                                    {withdrawLoading ? "Processing..." : "Submit Request"}
                                    {!withdrawLoading && <ArrowUpRight size={18} />}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
