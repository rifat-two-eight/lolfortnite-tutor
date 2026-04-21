"use client";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Globe, Users, PlayCircle, Loader2, BookOpen, Clock, BadgeCheck, MessageCircle } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { cn, getImageUrl } from "@/lib/utils";
import UserAvatar from "@/components/ui/UserAvatar";


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
    runningStatus: "RUNNING" | "STOPPED" | "PAUSED";
    images: string[];
    status: string;
    createdBy: string;
    averageRating?: number;
    ratingCount?: number;
}

interface TeacherInfo {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
}

interface PaymentData {
    classId: any;
    _id: string;
    teacher: TeacherInfo;
    amount: number;
    currency: string;
    status: string;
    classDetails: ClassDetails;
}

function StarIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
        </svg>
    );
}

function CertIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export default function MyEnrolledClasses() {
    const [enrollments, setEnrollments] = useState<PaymentData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEnrolledClasses = async () => {
            try {
                const response = await api.get("/class-payments/student/normal");
                if (response.data.success) {
                    setEnrollments(response.data.data);
                } else {
                    toast.error("Failed to load enrolled classes.");
                }
            } catch (error) {
                console.error("Error fetching enrolled classes:", error);
                toast.error("An error occurred while fetching your classes.");
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolledClasses();
    }, []);

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-12">
                <div className="mb-10 text-center">
                    <h1 className="text-3xl md:text-4xl font-bold text-[#0A47C2] font-sans">
                        My Enrolled Classes
                    </h1>
                    <p className="text-gray-500 mt-2 font-sans">
                        Manage your lessons and join your virtual classrooms.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A47C2]"></div>
                    </div>
                ) : enrollments.length === 0 ? (
                    <div className="text-center py-20 bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#0A47C2]">
                            <BookOpen size={40} />
                        </div>
                        <h3 className="text-xl font-bold text-[#0D1C35] font-sans">No enrollments found</h3>
                        <p className="text-gray-500 mt-2 mb-8 font-sans max-w-xs mx-auto">
                            You haven't joined any classes yet. Start exploring now!
                        </p>
                        <Link
                            href="/classes"
                            className="inline-flex items-center px-8 py-3 bg-[#0A47C2] text-white font-bold rounded-xl hover:bg-[#083a9e] transition-all font-sans"
                        >
                            Browse All Classes
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {enrollments.map((item) => {
                            const cls = item.classDetails;
                            const teacher = item.teacher;

                            return (
                                <div
                                    key={item._id}
                                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 group"
                                >
                                    <div className="relative w-full aspect-video overflow-hidden">
                                        <Image
                                            src={getImageUrl(cls.images?.[0]) || "/democourse.png"}
                                            alt={cls.subject}
                                            fill
                                            unoptimized
                                            className="object-cover"

                                        />

                                        {/* Status Badge Removed per user request */}


                                        {/* Dynamic Rating - Only show if in API */}
                                        {cls.averageRating && (
                                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-full px-2.5 py-1 text-xs font-bold text-[#0D1C35] font-sans shadow-sm">
                                                <StarIcon />
                                                <span>{cls.averageRating}</span>
                                                {cls.ratingCount && <span className="text-gray-400 font-normal">({cls.ratingCount})</span>}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4 flex flex-col gap-3 flex-1">
                                        <p className="text-left text-[10px] font-bold tracking-widest uppercase text-[#0A47C2] font-sans">
                                            {cls.level} • {cls.curriculum}
                                        </p>

                                        <h3 className="text-left text-lg font-extrabold text-[#0D1C35] font-sans leading-snug group-hover:text-[#0A47C2] transition-colors">
                                            {cls.subject}
                                        </h3>

                                        <p className="text-left text-xs text-gray-500 font-sans leading-relaxed line-clamp-2">
                                            {cls.description}
                                        </p>

                                        <div className="flex items-center gap-3 text-xs text-gray-400 font-sans mt-1">
                                            <span className="flex items-center gap-1">
                                                <UserIcon /> {cls.classType === "GROUP" ? "Group Class" : "1-on-1 Session"}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <CertIcon /> {cls.language}
                                            </span>
                                            <span className="ml-auto font-extrabold text-[#0D1C35]">
                                                {item.amount} {item.currency === "KWD" ? "KD" : item.currency}
                                            </span>
                                        </div>

                                        <div className="w-full h-px border border-gray-100 mt-2" />

                                        <div className="mt-auto pt-3">
                                            <div className="flex items-center justify-between gap-3 mb-4">
                                                <div className="flex items-center gap-2">
                                                    <UserAvatar
                                                        src={teacher.profileImage}
                                                        name={teacher.name}
                                                        size="w-8 h-8"
                                                        className="rounded-lg"
                                                    />
                                                    <div className="flex flex-col text-left">
                                                        <span className="text-[9px] font-bold text-gray-400 uppercase leading-none mb-0.5 tracking-tighter">Taught by</span>
                                                        <span className="text-[13px] font-extrabold text-[#0D1C35] tracking-tight">{teacher.name}</span>
                                                    </div>
                                                </div>
                                                <div className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full border border-green-100 uppercase tracking-tighter italic">
                                                    {item.status === "PAID" ? "Enrolled" : item.status}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <Link
                                                    href={`/classes/${item.classId}`}

                                                    className="flex-1 py-2.5 text-center text-sm font-bold rounded-xl font-sans transition-all flex items-center justify-center gap-2 bg-[#0A47C2] text-white hover:bg-[#083a9e]"
                                                >
                                                    View Details
                                                </Link>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <Footer />
        </main>
    );
}
