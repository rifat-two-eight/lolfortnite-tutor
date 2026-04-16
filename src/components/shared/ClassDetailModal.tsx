"use client";

import React, { useState } from "react";
import { X, Star, Users, Globe, BookOpen, Clock, Tag, MessageCircle, PlayCircle } from "lucide-react";
import Image from "next/image";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";

interface ClassData {
    classType: string;
    _id: string;
    subject: string;
    level: string;
    language: string;
    curriculum?: string;
    price: number;
    tutorGender: string;
    maxStudents: number;
    enrolledStudents?: number;
    description: string;
    youtubeVideoLink?: string;
    whatsappGroupLink?: string;
    images: string[];
    averageRating: number;
    ratingCount: number;
    createdBy?: {
        name: string;
        profileImage?: string;
    };
}

interface ClassDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    data: ClassData | null;
}

export default function ClassDetailModal({ isOpen, onClose, data }: ClassDetailModalProps) {
    const [isBooking, setIsBooking] = useState(false);

    if (!isOpen || !data) return null;

    const handleBookSession = async () => {
        if (!data) return;
        setIsBooking(true);
        try {
            const response = await api.post("/class-payments/initiate-payment", {
                classType: "CLASS",
                classId: data._id
            });
            if (response.data.success && response.data.data.paymentUrl) {
                window.location.href = response.data.data.paymentUrl;
            }
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Failed to initiate payment. Please try again.");
        } finally {
            setIsBooking(false);
        }
    };

    const getImageUrl = (path: string) => {
        if (!path) return "/democourse.png";
        if (path.startsWith("http")) return path;
        return `http://10.10.7.53:5010${path}`;
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
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
                    {/* Left Side: Media & Gallery */}
                    <div className="space-y-4 p-6 lg:p-8 bg-gray-50 border-r border-gray-100">
                        {/* Video OR Primary Image */}
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-lg">
                            {data.youtubeVideoLink ? (
                                <iframe
                                    src={`https://www.youtube.com/embed/${getYouTubeId(data.youtubeVideoLink)}`}
                                    title={data.subject}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            ) : (
                                <Image
                                    src={getImageUrl(data.images[0])}
                                    alt={data.subject}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            )}
                        </div>

                        {/* WhatsApp Link below media */}
                        {data.whatsappGroupLink && (
                            <a
                                href={data.whatsappGroupLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full py-3 bg-[#25D366] text-white font-bold rounded-xl text-center text-sm flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-all"
                            >
                                <MessageCircle size={18} />
                                Join WhatsApp Group
                            </a>
                        )}

                        {/* Image Gallery */}
                        <div className="grid grid-cols-3 gap-3">
                            {data.images.slice(1, 4).map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                                    <Image
                                        src={getImageUrl(img)}
                                        alt={`${data.subject} ${idx + 2}`}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {/* Tutor Quick Info */}
                        <div className="mt-8 p-4 bg-white border border-gray-200 rounded-xl flex items-center gap-4">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#0A47C2]/10 bg-gray-100 flex items-center justify-center shrink-0">
                                {data.createdBy?.profileImage ? (
                                    <Image
                                        src={getImageUrl(data.createdBy.profileImage)}
                                        alt={data.createdBy.name}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-xl font-bold text-[#0A47C2]">{data.createdBy?.name?.[0]}</span>
                                )}
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-[#0D1C35]">{data.createdBy?.name}</h4>
                                {/* <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Lead Instructor</p> */}
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Information */}
                    <div className="p-6 lg:p-8 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="px-3 py-1 bg-blue-50 text-[#0A47C2] text-[10px] font-bold uppercase tracking-wider rounded-full border border-blue-100">
                                {data.level}
                            </span>
                        </div>

                        <h2 className="text-2xl lg:text-3xl font-extrabold text-[#0D1C35] font-sans mb-4 leading-tight">
                            {data.subject}
                        </h2>

                        <div className="flex flex-wrap items-center gap-6 mb-8 text-sm font-semibold text-gray-500">
                            <div className="flex items-center gap-2">
                                <Star className="text-amber-400 fill-amber-400" size={16} />
                                <span className="text-[#0D1C35]">{data.averageRating || 0}</span>
                                <span className="text-gray-400 font-normal">({data.ratingCount || 0} Reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe size={16} className="text-[#0A47C2]" />
                                <span>{data.language}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users size={16} className="text-[#0A47C2]" />
                                <span>Max {data.maxStudents} Students</span>
                            </div>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div>
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">About this Class</h4>
                                <p className="text-sm text-gray-600 leading-relaxed font-sans whitespace-pre-line">
                                    {data.description}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Price</p>
                                    <p className="text-lg font-extrabold text-[#0D1C35]">${data.price}</p>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                                    <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Class Type</p>
                                    <p className="text-sm font-bold text-[#0D1C35]">
                                        {data.classType === "GROUP" ? "Group Learning" : "1-on-1 Consultation"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* CTA Row */}
                        <div className="mt-10 flex items-center gap-4 pt-6 border-t border-gray-100">
                            <button 
                                onClick={handleBookSession}
                                disabled={isBooking}
                                className="flex-1 py-4 bg-[#0A47C2] text-white font-bold rounded-none text-sm font-sans hover:bg-[#083a9e] transition-all shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isBooking ? "Redirecting..." : "Book This Session"}
                            </button>
                            <button className="w-14 h-14 flex items-center justify-center border border-gray-200 rounded-none text-[#0D1C35] hover:bg-gray-50 transition-all">
                                <MessageCircle size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
