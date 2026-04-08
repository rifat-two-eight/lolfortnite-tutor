"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    CheckCircle2,
    Clock,
    XCircle,
    Star,
    Users,
    GraduationCap,
    DollarSign,
    Loader2,
    Calendar,
    Mail,
    Phone,
    MapPin,
    CloudCog
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import Image from "next/image";

interface TeacherData {
    _id: string;
    name: string;
    email: string;
    phone: string;
    profileImage?: string;
    isActive: boolean;
    teacherApprovalStatus: "PENDING" | "APPROVED" | "REJECTED";
    createdAt: string;
    totalEarning: number;
    totalSellClass: number;
    averageRating: number;
    reviewCount: number;
    studentCount: number;
    location?: { lat: number; lng: number };
}

export default function TeacherDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const [teacher, setTeacher] = useState<TeacherData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTeacherDetails = async () => {
            try {
                const response = await api.get(`/users/${params.id}`);
                if (response.data.success) {
                    setTeacher(response.data.data);
                } else {
                    toast.error("Failed to load teacher details");
                }
            } catch (error) {
                console.error("Error fetching teacher details:", error);
                toast.error("An error occurred while fetching details");
            } finally {
                setLoading(false);
            }
        };

        if (params.id) {
            fetchTeacherDetails();
        }
    }, [params.id]);

    const handleStatusUpdate = async (status: "PENDING" | "APPROVED" | "REJECTED") => {
        if (!teacher?._id) return;
        try {
            const response = await api.patch(`/users/teacher-status/${teacher._id}`, { status });
            if (response.data.success) {
                toast.success(`Teacher moved to ${status.toLowerCase()}`);
                setTeacher({ ...teacher, teacherApprovalStatus: status });
            } else {
                toast.error(response.data.message || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating teacher status:", error);
            toast.error("An error occurred while updating status");
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
                <div className="flex flex-col items-center gap-4 text-gray-500">
                    <Loader2 className="animate-spin" size={32} />
                    <p className="font-sans text-sm font-medium">Loading Teacher Profile...</p>
                </div>
            </div>
        );
    }

    if (!teacher) {
        return (
            <div className="p-8">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors font-sans"
                >
                    <ArrowLeft size={16} /> Back to Teachers
                </button>
                <div className="bg-white p-8 rounded-2xl border border-gray-100 text-center font-sans">
                    <p className="text-gray-500">Teacher not found.</p>
                </div>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-GB', options);
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case "APPROVED": return { color: "bg-green-100 text-green-700", icon: <CheckCircle2 size={16} className="text-green-600" /> };
            case "PENDING": return { color: "bg-amber-100 text-amber-700", icon: <Clock size={16} className="text-amber-600" /> };
            case "REJECTED": return { color: "bg-red-100 text-red-700", icon: <XCircle size={16} className="text-red-600" /> };
            default: return { color: "bg-gray-100 text-gray-700", icon: <Loader2 size={16} /> };
        }
    };

    const statusConfig = getStatusConfig(teacher.teacherApprovalStatus);
    const imageUrl = teacher.profileImage
        ? (teacher.profileImage.startsWith('http') ? teacher.profileImage : `${process.env.NEXT_PUBLIC_IMAGE_URL}${teacher.profileImage}`)
        : "https://ui-avatars.com/api/?name=" + encodeURIComponent(teacher.name) + "&background=E0EAFF&color=0A47C2";

    console.log(imageUrl)


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
                        onClick={() => handleStatusUpdate("APPROVED")}
                        disabled={teacher.teacherApprovalStatus === "APPROVED"}
                        className="px-4 py-2 bg-[#22C55E] text-white hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                        <CheckCircle2 size={16} /> Approve
                    </button>
                    <button
                        onClick={() => handleStatusUpdate("REJECTED")}
                        disabled={teacher.teacherApprovalStatus === "REJECTED"}
                        className="px-4 py-2 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-bold transition-all shadow-sm flex items-center gap-2"
                    >
                        <XCircle size={16} /> Reject
                    </button>
                </div>
            </div>

            {/* Profile Hero Card */}
            <div className="bg-white rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden relative">
                <div className="h-32 bg-linear-to-r from-[#0A47C2]/10 to-[#0A47C2]/5 w-full absolute top-0 left-0" />
                <div className="p-8 pt-16 relative z-10 flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* Avatar */}
                    <div className="w-32 h-32 rounded-full border-4 border-white shadow-xl overflow-hidden bg-white shrink-0">
                        <Image
                            unoptimized
                            width={128}
                            height={128}
                            src={imageUrl}
                            alt={teacher.name}
                            className="w-full h-full object-cover"
                            onError={(e) => { e.currentTarget.src = "https://ui-avatars.com/api/?name=" + encodeURIComponent(teacher.name) + "&background=E0EAFF&color=0A47C2" }}
                        />
                    </div>

                    {/* Basic Info */}
                    <div className="flex-1 text-center md:text-left space-y-4 pt-2">
                        <div>
                            <div className="flex flex-col md:flex-row items-center gap-3 mb-2">
                                <h1 className="text-2xl font-black text-[#0D1C35]">{teacher.name}</h1>
                                <span className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusConfig.color}`}>
                                    {statusConfig.icon}
                                    {teacher.teacherApprovalStatus}
                                </span>
                            </div>
                            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-sm text-gray-500 font-medium font-sans">
                                <div className="flex items-center gap-1.5">
                                    <Mail size={16} className="text-gray-400" />
                                    {teacher.email}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Phone size={16} className="text-gray-400" />
                                    {teacher.phone || "Not provided"}
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <Calendar size={16} className="text-gray-400" />
                                    Joined {formatDate(teacher.createdAt)}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Statistics Grid */}
            <h2 className="text-lg font-bold text-[#0D1C35] mb-4 pt-4">Performance Insights</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Earnings */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 group hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 group-hover:scale-110 transition-transform">
                            <DollarSign size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500">Total Earnings</span>
                    </div>
                    <p className="text-3xl font-black text-[#0D1C35]">${(teacher.totalEarning || 0).toLocaleString()}</p>
                </div>

                {/* Sell Class */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 group hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-[#0A47C2] group-hover:scale-110 transition-transform">
                            <GraduationCap size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500">Classes Sold</span>
                    </div>
                    <p className="text-3xl font-black text-[#0D1C35]">{teacher.totalSellClass || 0}</p>
                </div>

                {/* Students */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 group hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                            <Users size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500">Total Students</span>
                    </div>
                    <p className="text-3xl font-black text-[#0D1C35]">{teacher.studentCount || 0}</p>
                </div>

                {/* Ratings */}
                <div className="bg-white p-6 rounded-2xl shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 group hover:shadow-lg transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
                            <Star size={20} />
                        </div>
                        <span className="text-sm font-bold text-gray-500">Average Rating</span>
                    </div>
                    <div className="flex items-end gap-2">
                        <p className="text-3xl font-black text-[#0D1C35]">{teacher.averageRating?.toFixed(1) || "0.0"}</p>
                        <span className="text-sm text-gray-400 font-medium mb-1">({teacher.reviewCount || 0} reviews)</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
