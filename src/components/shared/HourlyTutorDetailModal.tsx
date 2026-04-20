"use client";

import React, { useState } from "react";
import { X, Star, Globe, BookOpen, Clock, Tag, MessageCircle, DollarSign, GraduationCap } from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import api from "@/lib/axios";
import { toast } from "sonner";

interface HourlyClassData {
    _id: string;
    createdBy: {
        _id: string;
        name: string;
        email: string;
        profileImage?: string;
    };
    createdAt: string;
    curriculum: string;
    description: string;
    language: string;
    pricePerHour: number;
    subjects: string[];
    averageRating: number;
    ratingCount: number;
}

interface HourlyTutorDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: HourlyClassData | null;
}

export default function HourlyTutorDetailModal({ isOpen, onClose, data }: HourlyTutorDetailModalProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    if (!isOpen || !data) return null;

    const handleHire = async () => {
        setLoading(true);
        try {
            const response = await api.post("/messages/conversations", {
                participantIds: [data.createdBy._id]
            });
            if (response.data.success && response.data.data?._id) {
                router.push(`/messages?conversationId=${response.data.data._id}`);
            } else {
                router.push("/messages");
            }
        } catch (error: any) {
            console.error("Failed to create conversation:", error);
            toast.error("Failed to initiate conversation with instructor.");
            router.push("/messages");
        } finally {
            setLoading(false);
        }
    };

    const getImageUrl = (path: string) => {
        if (!path) return "/demotutor.png";
        if (path.startsWith("http")) return path;
        return `http://10.10.7.24:5010${path}`;
    };

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center px-4 py-6 sm:p-10">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-[#0D1C35]/30 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-4xl max-h-full bg-white rounded-none shadow-2xl overflow-y-auto animate-in zoom-in-95 duration-300">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full text-[#0D1C35] transition-all shadow-md group"
                >
                    <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Left Side: Photo & Quick Info */}
                    <div className="space-y-4 p-6 lg:p-8 bg-gray-50 border-r border-gray-100">
                        <div className="relative aspect-3/4 bg-white rounded-xl overflow-hidden shadow-lg border border-gray-200">
                            <Image
                                src={getImageUrl(data.createdBy.profileImage || "")}
                                alt={data.createdBy.name}
                                fill
                                unoptimized
                                className="object-cover object-top"
                            />
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 gap-3 mt-6">
                            <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
                                <Star className="mx-auto text-amber-400 mb-1" size={20} fill="currentColor" />
                                <p className="text-sm font-extrabold text-[#0D1C35]">{data.averageRating || 0}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Average Rating</p>
                            </div>
                            <div className="p-4 bg-white border border-gray-200 rounded-xl text-center">
                                <Clock className="mx-auto text-[#0A47C2] mb-1" size={20} />
                                <p className="text-sm font-extrabold text-[#0D1C35]">{data.ratingCount || 0}</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Total Reviews</p>
                            </div>
                        </div>

                        {/* Features List */}
                        <div className="space-y-3 pt-4">
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <Globe size={18} className="text-[#0A47C2]" />
                                <span>Fluent in: <span className="font-bold">{data.language}</span></span>
                            </div>
                            <div className="flex items-center gap-3 text-sm text-gray-600">
                                <GraduationCap size={18} className="text-[#0A47C2]" />
                                <span>Curriculum: <span className="font-bold">{data.curriculum}</span></span>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Detailed Bio & Subjects */}
                    <div className="p-6 lg:p-8 flex flex-col h-full">
                        <div className="mb-6">
                            <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#0A47C2] mb-1">Expert Faculty</p>
                            <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0D1C35] font-sans leading-tight">
                                {data.createdBy.name}
                            </h2>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* Bio Section */}
                            <div>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <BookOpen size={14} /> About the Instructor
                                </h4>
                                <p className="text-sm text-gray-600 leading-relaxed font-sans whitespace-pre-line bg-blue-50/30 p-4 rounded-xl border border-blue-50">
                                    {data.description || "No biography provided."}
                                </p>
                            </div>

                            {/* Subjects Section */}
                            <div>
                                <h4 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                                    <Tag size={14} /> Specializes In
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {data.subjects.map((subject, idx) => (
                                        <span
                                            key={idx}
                                            className="px-4 py-2 bg-white border border-gray-200 rounded-full text-xs font-bold text-[#0A47C2] shadow-sm"
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Price Insight */}
                            <div className="p-5 bg-[#0D1C35] rounded-none text-white flex items-center justify-between">
                                <div>
                                    <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest mb-0.5">Booking Fee</p>
                                    <p className="text-2xl font-extrabold font-sans">
                                        {data.pricePerHour} KD<span className="text-sm font-normal opacity-70">/hour</span>
                                    </p>
                                </div>
                                <DollarSign size={32} className="opacity-20" />
                            </div>
                        </div>

                        <div className="mt-10 flex items-center gap-4 pt-6 border-t border-gray-100">
                            <button
                                onClick={handleHire}
                                disabled={loading}
                                className="flex-1 py-4 bg-[#0A47C2] text-white font-bold rounded-none text-sm font-sans hover:bg-[#083a9e] transition-all shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? "Processing..." : "Hire this Instructor"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
