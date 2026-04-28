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

export default function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
    const { classId } = use(params);
    const [classroom, setClassroom] = useState<ClassDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const response = await api.get(`/classes/${classId}`);
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

        if (classId) {
            fetchDetail();
        }
    }, [classId]);

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
                    <Link href="/classes/enrolled-classes" className="inline-flex items-center gap-2 px-6 py-3 bg-[#0A47C2] text-white font-bold rounded-xl hover:bg-[#083a9e] transition-all font-sans">
                        <ArrowLeft size={18} /> Back to My Enrolled Classes
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    const teacher = classroom.createdBy;

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
                            My Classes
                        </Link>
                        <span className="text-slate-200">/</span>
                        <span className="text-slate-400 text-sm font-bold font-sans">Class Details</span>
                    </div>

                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-blue-50 text-[#0A47C2] text-[10px] font-black uppercase tracking-widest rounded-lg border border-blue-100 font-sans">
                                    {classroom.level}
                                </span>
                                <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase tracking-widest rounded-lg font-sans">
                                    {classroom.curriculum}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-5xl font-black text-[#0D1C35] font-sans leading-tight">
                                {classroom.subject}
                            </h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right hidden md:block">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Registration Fee</p>
                                <p className="text-2xl font-black text-[#0A47C2] font-sans">
                                    {classroom.price} KD
                                </p>
                            </div>
                            <div className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest font-sans bg-amber-50 text-amber-600 border border-amber-100">
                                {classroom.status}
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
                        {/* Media Display */}
                        <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-sm border border-slate-100">
                            <div className="relative aspect-video w-full bg-slate-900 overflow-hidden text-left">
                                {classroom.youtubeVideoLink ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${getYouTubeId(classroom.youtubeVideoLink)}?autoplay=0`}
                                        title={classroom.subject}
                                        className="w-full h-full border-none"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                ) : (
                                    <Image
                                        src={getImageUrl(classroom.images?.[0]) || "/democourse.png"}
                                        alt={classroom.subject}
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                )}
                            </div>
                        </div>

                        {/* Description Section */}
                        <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-100 space-y-8">
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
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4 text-left">Principal Instructor</h4>
                            {teacher ? (
                                <div className="flex items-center gap-4 text-left">
                                    <UserAvatar
                                        src={teacher.profileImage}
                                        name={teacher.name}
                                        size="w-16 h-16"
                                        className="rounded-2xl border-4 border-slate-50 shadow-sm"
                                    />
                                    <div className="space-y-0.5">
                                        <h3 className="text-xl font-black text-[#0D1C35] font-sans">{teacher.name}</h3>
                                        <p className="text-slate-400 text-xs font-bold font-sans">Verified Subject Expert</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="p-4 bg-slate-50 rounded-2xl text-slate-400 text-center font-bold text-xs">
                                    Instructor info loading...
                                </div>
                            )}
                            <Link
                                href="/messages"
                                className="w-full py-4 bg-slate-50 text-slate-600 text-sm font-black rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-100 transition-all font-sans border border-slate-100"
                            >
                                <MessageCircle size={20} />
                                Contact Teacher
                            </Link>
                        </div>

                        {/* Specifications Card */}
                        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 space-y-6 text-left">
                            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-4 text-left">Class Specifications</h4>
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <Globe size={18} className="text-[#0A47C2]" />
                                        <span className="text-xs font-bold text-slate-500 font-sans">Language</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0D1C35] font-sans">{classroom.language}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <Star size={18} className="text-amber-400 fill-amber-400" />
                                        <span className="text-xs font-bold text-slate-500 font-sans">Rating</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0D1C35] font-sans">
                                        {classroom.averageRating || 0} ({classroom.ratingCount || 0})
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <Users size={18} className="text-[#0A47C2]" />
                                        <span className="text-xs font-bold text-slate-500 font-sans">Class Mode</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0D1C35] font-sans">
                                        {classroom.classType === "GROUP" ? "Group Session" : "Private 1-on-1"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                                    <div className="flex items-center gap-3">
                                        <Calendar size={18} className="text-[#0A47C2]" />
                                        <span className="text-xs font-bold text-slate-500 font-sans">Max Capacity</span>
                                    </div>
                                    <span className="text-sm font-black text-[#0D1C35] font-sans">{classroom.maxStudents} Students</span>
                                </div>
                            </div>

                            {/* Main Action Button */}
                            <button
                                onClick={() => {
                                    if (classroom.whatsappGroupLink) {
                                        const url = classroom.whatsappGroupLink.startsWith('http') ? classroom.whatsappGroupLink : `https://${classroom.whatsappGroupLink}`;
                                        window.open(url, '_blank');
                                    } else {
                                        toast.info("Join link pending.", {
                                            description: "Links are shared slightly before the session starts.",
                                            icon: <Clock size={16} className="text-blue-500" />
                                        });
                                    }
                                }}
                                className={cn(
                                    "w-full py-5 rounded-2xl font-black text-base shadow-xl transition-all flex items-center justify-center gap-3 active:scale-95 group/btn overflow-hidden relative font-sans mt-4",
                                    classroom.whatsappGroupLink
                                        ? "bg-slate-900 text-white hover:bg-black shadow-slate-200"
                                        : "bg-slate-100 text-slate-400 cursor-not-allowed shadow-none border border-slate-200"
                                )}
                            >
                                {classroom.whatsappGroupLink ? (
                                    <>
                                        <PlayCircle size={22} className="group-hover/btn:scale-110 transition-transform" />
                                        <span>Enter Classroom</span>
                                    </>
                                ) : (
                                    <>
                                        <Clock size={20} />
                                        <span>Join Link Pending</span>
                                    </>
                                )}
                            </button>

                            {classroom.whatsappGroupLink && (
                                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-tighter">
                                    Clicking above will open your virtual classroom.
                                </p>
                            )}
                        </div>

                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
