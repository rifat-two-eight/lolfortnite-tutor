"use client";

import React, { useEffect, useState, use } from "react";
import {
    X, Star, Users, Globe, BookOpen, Clock,
    PlayCircle, ChevronLeft, Calendar,
    MessageCircle, ArrowLeft,
    Loader2
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import api from "@/lib/axios";
import { cn, getImageUrl } from "@/lib/utils";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import UserAvatar from "@/components/ui/UserAvatar";
import { toast } from "sonner";

interface TeacherInfo {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
}

interface ClassDetails {
    _id: string;
    subject: string;
    level: string;
    language: string;
    curriculum: string;
    price: number;
    tutorGender: string;
    maxStudents: number;
    enrolledStudents: number;
    whatsappGroupLink?: string;
    description: string;
    youtubeVideoLink?: string;
    classType: string;
    runningStatus: string;
    images: string[];
    status: string;
    createdBy: TeacherInfo;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    averageRating?: number;
    ratingCount?: number;
}

export default function ClassDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [classroom, setClassroom] = useState<ClassDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeMediaIndex, setActiveMediaIndex] = useState(0);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/classes/${id}`);
                if (response.data.success) {
                    setClassroom(response.data.data);
                } else {
                    toast.error("Failed to load class details.");
                }
            } catch (error) {
                console.error("Error fetching class details:", error);
                toast.error("An error occurred while fetching details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchDetail();
        }
    }, [id]);

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="flex flex-col items-center justify-center h-[70vh] gap-4">
                    <Loader2 className="animate-spin text-[#0A47C2]" size={48} />
                    <p className="text-slate-500 font-bold animate-pulse font-sans">Loading class details...</p>
                </div>
                <Footer />
            </div>
        );
    }

    if (!classroom) {
        return (
            <div className="min-h-screen bg-white">
                <Navbar />
                <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                    <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
                        <X size={40} />
                    </div>
                    <h2 className="text-2xl font-bold text-[#0D1C35] font-sans">Class not found</h2>
                    <p className="text-gray-500 mt-2 mb-8 font-sans">We couldn't find the class details you're looking for.</p>
                    <Link href="/classes" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A47C2] text-white font-bold rounded-xl hover:bg-[#083a9e] transition-all font-sans">
                        <ArrowLeft size={18} /> Back to Classes
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const teacher = classroom.createdBy;

    // Construct media items list: Images first, then video
    const mediaItems = [
        ...(classroom.images || []).map(img => ({ type: 'image' as const, url: img })),
        ...(classroom.youtubeVideoLink ? [{ type: 'video' as const, url: classroom.youtubeVideoLink }] : [])
    ];

    const nextMedia = () => setActiveMediaIndex((prev) => (prev + 1) % mediaItems.length);
    const prevMedia = () => setActiveMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);

    return (
        <main className="min-h-screen bg-slate-50/50 flex flex-col">
            <Navbar />

            {/* Hero / Header Section */}
            <div className="bg-white border-b border-slate-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Link
                            href="/classes/enrolled-classes"
                            className="inline-flex items-center gap-2 text-slate-400 hover:text-[#0A47C2] transition-colors text-sm font-bold font-sans group"
                        >
                            <ChevronLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                            My Enrolled Classes
                        </Link>
                        <span className="text-slate-200">/</span>
                        <span className="text-slate-400 text-sm font-bold font-sans">Class Details</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-50 text-[#0A47C2] text-[10px] font-black uppercase tracking-widest rounded-xl border border-blue-100 font-sans">
                                    {classroom.level}
                                </span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-xl font-sans">
                                    {classroom.curriculum}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-[#0D1C35] font-sans leading-tight">
                                {classroom.subject}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Price</p>
                                <p className="text-2xl font-black text-[#0A47C2] font-sans">
                                    {classroom.price} KD
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-12 flex-grow w-full text-left">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                    {/* Left Column: Media & Description (Col Span 8) */}
                    <div className="lg:col-span-8 space-y-10">
                        {/* Premium Media Slider (Compact Size) */}
                        <div className="space-y-6 max-w-[640px]">
                            <div className="bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 relative group">
                                <div className="relative aspect-video w-full bg-slate-900 overflow-hidden text-left">
                                    {mediaItems.length > 0 ? (
                                        mediaItems[activeMediaIndex].type === 'video' ? (
                                            <div className="w-full h-full">
                                                <iframe
                                                    src={`https://www.youtube.com/embed/${getYouTubeId(mediaItems[activeMediaIndex].url)}?autoplay=0`}
                                                    title={classroom.subject}
                                                    className="w-full h-full border-none"
                                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                    allowFullScreen
                                                />
                                            </div>
                                        ) : (
                                            <Image
                                                src={getImageUrl(mediaItems[activeMediaIndex].url) || "/democourse.png"}
                                                alt={classroom.subject}
                                                fill
                                                unoptimized
                                                className="object-cover transition-all duration-700"
                                            />
                                        )
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                            No media available
                                        </div>
                                    )}

                                    {/* Slider Controls */}
                                    {mediaItems.length > 1 && (
                                        <>
                                            <button
                                                onClick={prevMedia}
                                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 active:scale-90 border border-white/20"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={nextMedia}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 p-2.5 bg-white/10 backdrop-blur-md rounded-lg text-white hover:bg-white/30 transition-all opacity-0 group-hover:opacity-100 active:scale-90 border border-white/20"
                                            >
                                                <ChevronLeft size={20} className="rotate-180" />
                                            </button>
                                        </>
                                    )}

                                    {/* Slide Indicator */}
                                    {mediaItems.length > 1 && (
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-black/20 backdrop-blur-md rounded-full border border-white/10 flex gap-1.5">
                                            {mediaItems.map((_, i) => (
                                                <div
                                                    key={i}
                                                    className={cn(
                                                        "h-1 rounded-full transition-all duration-300",
                                                        activeMediaIndex === i ? "w-4 bg-white" : "w-1 bg-white/40"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Slider Navigation / Thumbnails */}
                            {mediaItems.length > 1 && (
                                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {mediaItems.map((item, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setActiveMediaIndex(idx)}
                                            className={cn(
                                                "relative w-20 aspect-video rounded-lg overflow-hidden border-2 transition-all flex-shrink-0",
                                                activeMediaIndex === idx ? "border-[#0A47C2] ring-2 ring-blue-50" : "border-transparent opacity-60 hover:opacity-100"
                                            )}
                                        >
                                            {item.type === 'video' ? (
                                                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-white">
                                                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
                                                        <PlayCircle size={16} />
                                                    </div>
                                                </div>
                                            ) : (
                                                <Image
                                                    src={getImageUrl(item.url)}
                                                    alt={`Thumbnail ${idx}`}
                                                    fill
                                                    unoptimized
                                                    className="object-cover"
                                                />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description Section */}
                        <div className="bg-white rounded-xl p-8 md:p-12 shadow-sm border border-slate-100 space-y-8 max-w-[640px]">
                            <div className="flex items-center gap-3 border-b border-slate-50 pb-6 text-left">
                                <div className="p-2.5 bg-blue-50 rounded-xl text-[#0A47C2]">
                                    <BookOpen size={24} />
                                </div>
                                <h2 className="text-2xl font-black text-[#0D1C35] font-sans">Classroom Overview</h2>
                            </div>
                            <div className="prose prose-slate max-w-none text-left">
                                <p className="text-slate-600 text-base md:text-lg leading-relaxed font-medium font-sans whitespace-pre-line text-left">
                                    {classroom.description}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Sidebar Info (Col Span 4) */}
                    <div className="lg:col-span-4 space-y-8 h-fit lg:sticky lg:top-24">

                        {/* Instructor Card */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4 text-left">Principal Instructor</h4>
                            <div className="flex items-center gap-4 text-left">
                                <UserAvatar
                                    src={teacher.profileImage}
                                    name={teacher.name}
                                    size="w-16 h-16"
                                    className="rounded-xl border-4 border-slate-50 shadow-sm"
                                />
                                <div className="space-y-0.5">
                                    <h3 className="text-xl font-black text-[#0D1C35] font-sans">{teacher.name}</h3>
                                    <p className="text-slate-400 text-xs font-bold font-sans">Verified Subject Expert</p>
                                </div>
                            </div>
                            {classroom.whatsappGroupLink ? (
                                <a
                                    href={classroom.whatsappGroupLink.startsWith('http') ? classroom.whatsappGroupLink : `https://${classroom.whatsappGroupLink}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full py-4 bg-[#25D366] text-white text-sm font-black rounded-xl flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-all font-sans shadow-lg shadow-green-100"
                                >
                                    <MessageCircle size={20} />
                                    Join WhatsApp Group
                                </a>
                            ) : (
                                <div className="w-full py-4 bg-slate-50 text-slate-400 text-sm font-black rounded-xl flex items-center justify-center gap-3 font-sans border border-slate-100 cursor-not-allowed">
                                    <Clock size={20} />
                                    Link Pending
                                </div>
                            )}


                        </div>

                        {/* Specifications Card */}
                        <div className="bg-white rounded-xl p-8 shadow-sm border border-slate-100 space-y-6 text-left">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4 text-left">Class Specifications</h4>
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} className="text-[#0A47C2]" />
                                        <span className="text-xs font-bold text-slate-500 font-sans">Language</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0D1C35] font-sans">{classroom.language}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <Star size={18} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-slate-500 font-sans">Rating</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0D1C35] font-sans">
                                        {classroom.averageRating || 0} ({classroom.ratingCount || 0})
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <Users size={18} className="text-[#0A47C2]" />
                                        <span className="text-xs font-bold text-slate-500 font-sans">Class Mode</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0D1C35] font-sans">
                                        {classroom.classType === "GROUP" ? "Group Session" : "Private 1-on-1"}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
