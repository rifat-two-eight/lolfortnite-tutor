"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { PlayCircle, BookOpen, Globe, User, Mail, Phone, DollarSign, Award, Loader2 } from "lucide-react";
import api from "@/lib/axios";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";

const teacherCourses = [
    {
        id: 1,
        image: "/demotutor.png",
        status: "Active",
        date: "OCT 12, 2023 - 2:30 PM",
        tutor: "Nohan.T",
        description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.",
        subjects: ["Mathematic", "British"]
    },
    {
        id: 2,
        image: "/demotutor.png",
        status: "Active",
        date: "OCT 12, 2023 - 3:30 PM",
        tutor: "Nohan.T",
        description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.",
        subjects: ["Mathematic", "British"]
    },
    {
        id: 3,
        image: "/demotutor.png",
        status: "Active",
        date: "OCT 13, 2023 - 2:30 PM",
        tutor: "Nohan.T",
        description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.",
        subjects: ["Mathematic", "British"]
    },
    {
        id: 4,
        image: "/demotutor.png",
        status: "Active",
        date: "OCT 13, 2023 - 3:30 PM",
        tutor: "Nohan.T",
        description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.",
        subjects: ["Mathematic", "British"]
    },
];

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    role: string;
    phone: string;
    balance: number;
    teacherApprovalStatus: string;
    profileImage?: string;
}

export default function TeacherProfilePage() {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/auth/me")
            .then(res => {
                if (res.data.success) {
                    setProfile(res.data.data);
                }
            })
            .catch(err => {
                toast.error("Failed to load profile details");
                console.error(err);
            })
            .finally(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[#0A47C2] animate-spin" />
            </div>
        );
    }

    if (!profile) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-gray-400">
                Profile not found
            </div>
        );
    }
    return (
        <div className="px-4 md:px-8 py-8 space-y-10">
            {/* Profile Header Block */}
            <div className="bg-white border border-blue-100 p-10 flex flex-col items-center text-center space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-blue-50/50 -z-10" />
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-50 flex items-center justify-center">
                    {profile.profileImage ? (
                        <Image src={getImageUrl(profile.profileImage)} alt={profile.name} unoptimized fill className="object-cover" />
                    ) : (
                        <User size={48} className="text-blue-200" />
                    )}
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-[#0D2451] font-sans">{profile.name}</h1>
                    <p className="text-gray-400 font-medium font-sans uppercase tracking-wider text-xs">{profile.role}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-2xl pt-4">
                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0A47C2]">
                            <Mail size={16} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Email</p>
                            <p className="text-xs font-bold text-[#0D1C35] truncate">{profile.email}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-[#0A47C2]">
                            <Phone size={16} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Phone</p>
                            <p className="text-xs font-bold text-[#0D1C35] truncate">{profile.phone || "Not set"}</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-xl border border-emerald-100">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                            <DollarSign size={16} />
                        </div>
                        <div className="text-left overflow-hidden">
                            <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Balance</p>
                            <p className="text-xs font-bold text-emerald-700 truncate">${profile.balance.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2 text-[#0A47C2] font-bold text-sm bg-blue-50 px-4 py-1.5 rounded-full font-sans mt-4">
                    <Award size={16} fill="currentColor" className="text-white" />
                    <span>Approval Status: {profile.teacherApprovalStatus}</span>
                </div>
            </div>

        </div>
    );
}
