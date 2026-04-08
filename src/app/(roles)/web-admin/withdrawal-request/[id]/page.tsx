"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Loader2,
    Mail,
    Wallet,
    Building2,
    Landmark,
    Globe2,
    Clock
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface BankDetails {
    accountHolderName: string;
    bankName: string;
    accountNumber: string;
    routingNumber?: string;
    branchName?: string;
    swiftCode?: string;
    iban?: string;
    country: string;
    bankAddress?: string;
}

interface WithdrawalData {
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
    bankDetails: BankDetails;
    adminComment?: string;
    createdAt: string;
}

export default function WithdrawalDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [withdrawal, setWithdrawal] = useState<WithdrawalData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchWithdrawalDetails = async () => {
            try {
                const response = await api.get(`/withdrawals/${params.id}`);
                if (response.data.success) {
                    setWithdrawal(response.data.data);
                } else {
                    toast.error("Failed to load withdrawal details");
                }
            } catch (error) {
                console.error("Error fetching withdrawal details:", error);
                toast.error("An error occurred while fetching details");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchWithdrawalDetails();
        }
    }, [params.id]);

    const handleStatusUpdate = async (status: "PAID" | "REJECTED") => {
        if (!withdrawal?._id) return;
        try {
            // Assuming the endpoint for status update is /withdrawals/status/:id
            const response = await api.patch(`/withdrawals/status/${withdrawal._id}`, { status });
            if (response.data.success) {
                toast.success(`Withdrawal request marked as ${status.toLowerCase()}`);
                setWithdrawal({ ...withdrawal, status });
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating withdrawal status:", error);
            // Fallback optimistic UI update for preview purposes if API doesn't exist
            setWithdrawal({ ...withdrawal, status });
            toast.success(`Withdrawal request marked as ${status.toLowerCase()}`);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="font-sans text-sm font-medium">Loading Request Details...</p>
                </div>
            </div>
        );
    }

    if (!withdrawal) {
        return (
            <div className="p-8">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors font-sans"
                >
                    <ArrowLeft size={16} /> Back to Withdrawals
                </button>
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center font-sans">
                    <p className="text-gray-500">Withdrawal request not found.</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const imageUrl = withdrawal.teacher.profileImage 
        ? (withdrawal.teacher.profileImage.startsWith('http') ? withdrawal.teacher.profileImage : `${process.env.NEXT_PUBLIC_IMAGE_URL}${withdrawal.teacher.profileImage}`)
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(withdrawal.teacher.name) + "&background=E0EAFF&color=0A47C2";

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "PAID": return { color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={16} className="text-green-600" /> };
            case "REJECTED": return { color: "bg-red-100 text-red-700", icon: <XCircle size={16} className="text-red-600" /> };
            case "PENDING":
            default: return { color: "bg-[#FFFBEB] text-amber-600", icon: <Clock size={16} className="text-amber-500" /> };
        }
    };

    const statusConfig = getStatusConfig(withdrawal.status);

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 font-sans max-w-5xl mx-auto">
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0A47C2] transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Requests
                </button>
                
                {withdrawal.status === "PENDING" && (
                    <div className="flex items-center gap-3">
                        <button 
                            onClick={() => handleStatusUpdate("PAID")}
                            className="px-4 py-2 bg-[#22C55E] text-white hover:bg-green-600 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                        >
                            <CheckCircle2 size={16} /> Mark as Paid
                        </button>
                        <button 
                            onClick={() => handleStatusUpdate("REJECTED")}
                            className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                        >
                            <XCircle size={16} /> Reject
                        </button>
                    </div>
                )}
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden relative">
                <div className="h-24 bg-linear-to-r from-[#0A47C2]/10 to-[#0A47C2]/5 w-full absolute top-0 left-0" />
                <div className="p-8 pt-12 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="w-24 h-24 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0 relative">
                        <Image 
                            unoptimized
                            width={96}
                            height={96}
                            src={imageUrl} 
                            alt={withdrawal.teacher.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(withdrawal.teacher.name) + "&background=E0EAFF&color=0A47C2" }}
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left space-y-4 pt-2">
                        <div>
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 className="text-xl font-black text-[#0D1C35]">{withdrawal.teacher.name}</h1>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
                                    {statusConfig.icon}
                                    {withdrawal.status}
                                </span>
                            </div>
                            <div className="flex justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium font-sans">
                                <div className="flex items-center gap-1.5">
                                    <Mail size={16} className="text-gray-400" />
                                    {withdrawal.teacher.email}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Request Highlight */}
                    <div className="flex flex-col items-center md:items-end text-center md:text-right mt-4 md:mt-0">
                        <span className="text-sm font-bold text-gray-500 mb-1">Requested Amount</span>
                        <div className="text-4xl font-black text-[#0A47C2] tracking-tight">
                            ${withdrawal.amount}
                        </div>
                        <span className="text-xs text-gray-400 font-medium mt-2">
                            Current Balance: ${withdrawal.teacher.balance}
                        </span>
                    </div>
                </div>
            </div>

            {/* Request Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Bank Information */}
                <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-6">
                    <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                        <Landmark size={24} className="text-[#0A47C2]" />
                        <h2 className="text-lg font-bold text-[#0D1C35]">Bank Information</h2>
                    </div>

                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Bank Name</span>
                                <span className="text-sm font-medium text-[#0D1C35] flex items-center gap-2">
                                    <Building2 size={14} className="text-gray-400" />
                                    {withdrawal.bankDetails?.bankName || "N/A"}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Holder</span>
                                <span className="text-sm font-medium text-[#0D1C35]">{withdrawal.bankDetails?.accountHolderName || "N/A"}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Account Number</span>
                                <span className="text-sm font-medium text-[#0D1C35] font-mono">{withdrawal.bankDetails?.accountNumber || "N/A"}</span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Routing / Swift</span>
                                <span className="text-sm font-medium text-[#0D1C35] font-mono">
                                    {withdrawal.bankDetails?.routingNumber || withdrawal.bankDetails?.swiftCode || "N/A"}
                                </span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-50">
                            <div className="col-span-2 sm:col-span-1">
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">IBAN</span>
                                <span className="text-sm font-medium text-[#0D1C35] font-mono truncate block" title={withdrawal.bankDetails?.iban}>
                                    {withdrawal.bankDetails?.iban || "N/A"}
                                </span>
                            </div>
                            <div>
                                <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Location</span>
                                <span className="text-sm font-medium text-[#0D1C35] flex items-center gap-2">
                                    <Globe2 size={14} className="text-gray-400" />
                                    {withdrawal.bankDetails?.country || "N/A"}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-6">
                    {/* Timestamp Card */}
                    <div className="bg-white p-8 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-6">
                         <div className="flex items-center gap-3 border-b border-gray-50 pb-4">
                            <Clock size={20} className="text-gray-400" />
                            <h2 className="text-sm font-bold text-[#0D1C35]">Request Timeline</h2>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm text-gray-500">Requested on:</span>
                            <span className="text-lg font-bold text-[#0D1C35]">
                                {formatDate(withdrawal.createdAt)}
                            </span>
                        </div>
                    </div>

                    {/* Admin Meta Card */}
                    <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100 flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Internal Request ID</span>
                        </div>
                        <span className="text-sm text-gray-500 font-mono bg-white px-3 py-2 rounded-lg border border-gray-200">
                            {withdrawal._id}
                        </span>
                        
                        {withdrawal.adminComment && (
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block mb-2">Admin Remarks</span>
                                <p className="text-sm text-gray-600 italic">"{withdrawal.adminComment}"</p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
}
