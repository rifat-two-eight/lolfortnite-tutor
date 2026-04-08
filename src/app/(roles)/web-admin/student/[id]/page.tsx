"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft,
    CheckCircle2,
    XCircle,
    Loader2,
    Calendar,
    Mail,
    Phone,
    ShoppingCart,
    CreditCard,
    Ban,
    RefreshCw
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";

interface StudentData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
    isActive: boolean;
    createdAt: string;
    totalPurchaseClass: number;
    totalSpend: number;
}

export default function StudentDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [student, setStudent] = useState<StudentData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStudentDetails = async () => {
            try {
                const response = await api.get(`/users/${params.id}`);
                if (response.data.success) {
                    setStudent(response.data.data);
                } else {
                    toast.error("Failed to load student details");
                }
            } catch (error) {
                console.error("Error fetching student details:", error);
                toast.error("An error occurred while fetching details");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchStudentDetails();
        }
    }, [params.id]);

    const handleToggleActive = async () => {
        if (!student?._id) return;
        try {
            const response = await api.patch(`/users/toggle-active/${student._id}`);
            if (response.data.success) {
                const action = student.isActive ? "Deactivated" : "Activated";
                toast.success(`Student ${action} successfully`);
                setStudent({ ...student, isActive: !student.isActive });
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating student status:", error);
            toast.error("An error occurred while updating status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="font-sans text-sm font-medium">Loading Student Profile...</p>
                </div>
            </div>
        );
    }

    if (!student) {
        return (
            <div className="p-8">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors font-sans"
                >
                    <ArrowLeft size={16} /> Back to Students
                </button>
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center font-sans">
                    <p className="text-gray-500">Student not found.</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const imageUrl = student.profileImage 
        ? (student.profileImage.startsWith('http') ? student.profileImage : `${process.env.NEXT_PUBLIC_IMAGE_URL}${student.profileImage}`)
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(student.name) + "&background=E0EAFF&color=0A47C2";

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 font-sans max-w-6xl mx-auto">
            {/* Header & Breadcrumb */}
            <div className="flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-[#0A47C2] transition-colors"
                >
                    <ArrowLeft size={16} /> Back to Directory
                </button>
                <div className="flex items-center gap-3">
                     <button 
                         onClick={handleToggleActive}
                         className={`px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2 text-white ${
                             student.isActive ? "bg-amber-500 hover:bg-amber-600" : "bg-[#22C55E] hover:bg-green-600"
                         }`}
                     >
                         {student.isActive ? (
                             <><Ban size={16} /> Deactivate</>
                         ) : (
                             <><RefreshCw size={16} /> Activate</>
                         )}
                     </button>
                </div>
            </div>

            {/* Profile Hero Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden relative">
                <div className="h-32 bg-linear-to-r from-[#0A47C2]/10 to-[#0A47C2]/5 w-full absolute top-0 left-0" />
                <div className="p-8 pt-16 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0 relative">
                        <Image 
                            unoptimized
                            width={128}
                            height={128}
                            src={imageUrl} 
                            alt={student.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(student.name) + "&background=E0EAFF&color=0A47C2" }}
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left space-y-4 pt-2">
                        <div>
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 className="text-2xl font-black text-[#0D1C35]">{student.name}</h1>
                                {student.isActive ? (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                        <CheckCircle2 size={16} className="text-green-600" /> Active
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#FEE2E2] text-red-600">
                                        <XCircle size={16} className="text-red-500" /> Deactivated
                                    </span>
                                )}
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium font-sans">
                                <div className="flex items-center gap-1.5">
                                    <Mail size={16} className="text-gray-400" />
                                    {student.email}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Phone size={16} className="text-gray-400" />
                                    {student.phone || "Not provided"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-gray-400" />
                                    Joined {formatDate(student.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <h2 className="text-lg font-bold text-[#0D1C35] mb-4 pt-4">User Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Total Spend */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 group hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                            <CreditCard size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500">Total Spend</span>
                    </div>
                    <p className="text-3xl font-black text-[#0D1C35]">${(student.totalSpend || 0).toLocaleString()}</p>
                </div>

                {/* Sell Class / Purchased Classes */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 group hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0A47C2] group-hover:scale-110 transition-transform">
                            <ShoppingCart size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500">Classes Purchased</span>
                    </div>
                    <p className="text-3xl font-black text-[#0D1C35]">{student.totalPurchaseClass || 0}</p>
                </div>
            </div>
        </div>
    );
}
