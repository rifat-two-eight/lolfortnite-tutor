"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import ClassDetailModal from "./ClassDetailModal";
import { toast } from "sonner";


interface ClassData {
    _id: string;
    subject: string;
    level: string;
    language: string;
    curriculum: string;
    price: number;
    tutorGender: string;
    description: string;
    classType: string;
    images: string[];
    averageRating: number;
    ratingCount: number;
}

const filterTabs = ["All Programs", "1-on-1 Sessions", "Group Classes"];

const dropdowns = ["Subject"];

const courses = [
    {
        id: 1,
        image: "/democourse.png",
        badge: "PHD LEVEL TUTOR",
        title: "Advanced Mathematics",
        rating: 4.9,
        reviews: "125+",
        tags: ["1-on-1 Sessions", "Certificate"],
    },
    {
        id: 2,
        image: "/democourse.png",
        badge: "IVY LEAGUE EXPERT",
        title: "Classical Literature",
        rating: 5,
        reviews: "185+",
        tags: ["1-on-1 Sessions", "Certificate"],
    },
    {
        id: 3,
        image: "/democourse.png",
        badge: "SENIOR RESEARCHER",
        title: "Quantum Physics",
        rating: 4.8,
        reviews: "94+",
        tags: ["1-on-1 Sessions", "Certificate"],
    },
];

function StarIcon() {
    return (
        <svg width="10" height="10" viewBox="0 0 12 12" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
        </svg>
    );
}

function BookmarkIcon() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
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

function CertIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
    );
}

function ChevronDown() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
        </svg>
    );
}

export default function Courses() {
    const [activeTab, setActiveTab] = useState("All Programs");
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [bookingClassId, setBookingClassId] = useState<string | null>(null);

    const handleBookNow = async (e: React.MouseEvent, classId: string) => {
        e.stopPropagation();
        setBookingClassId(classId);
        try {
            const response = await api.post("/class-payments/initiate-payment", {
                classType: "CLASS",
                classId: classId
            });
            if (response.data.success && response.data.data.paymentUrl) {
                window.location.href = response.data.data.paymentUrl;
            }
        } catch (error: any) {
            console.error("Payment initiation failed:", error);
            const errorMsg = error.response?.data?.message || "Failed to initiate payment. Please try again.";
            toast.error(errorMsg);
        } finally {
            setBookingClassId(null);
        }
    };

    useEffect(() => {
        const fetchClasses = async () => {
            setLoading(true);
            try {
                // Fetch more items to ensure we find the top rated ones globally
                let url = `${process.env.NEXT_PUBLIC_API_URL}/classes?page=1&limit=50`;

                // Add classType filter
                if (activeTab === "1-on-1 Sessions") {
                    url += "&classType=ONE_TO_ONE";
                } else if (activeTab === "Group Classes") {
                    url += "&classType=GROUP";
                }

                const response = await axios.get(url);
                if (response.data.success) {
                    // Sort by rating High to Low and pick top 3
                    const sorted = response.data.data
                        .sort((a: ClassData, b: ClassData) =>
                            (b.averageRating || 0) - (a.averageRating || 0)
                        )
                        .slice(0, 3);
                    setClasses(sorted);
                }
            } catch (error) {
                console.error("Error fetching courses:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchClasses();
    }, [activeTab]);

    const getImageUrl = (path: string) => {
        if (!path) return "/democourse.png";
        if (path.startsWith("http")) return path;
        return `http://10.10.7.24:5010${path}`;
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-0 py-10 md:py-14">
            {/* Detail Modal */}
            <ClassDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                data={selectedClass}
            />

            {/* Header Row */}
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
                {/* Title */}
                <div className="max-w-xs">
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-[#0D1C35] font-sans leading-tight">
                        World-Class Courses
                    </h2>
                    <p className="text-gray-400 text-sm mt-1.5 leading-relaxed font-sans">
                        Discover ultra-premium programs tailored to the highest academic standards.
                    </p>
                </div>

                {/* Filter Tabs + Dropdowns */}
                <div className="flex flex-wrap items-center gap-2 border border-gray-200 rounded-full px-2 py-1.5 w-fit">
                    {filterTabs.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={cn(
                                "px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 font-sans whitespace-nowrap",
                                activeTab === tab
                                    ? "bg-[#0A47C2] text-white"
                                    : "text-gray-500 hover:text-[#0A47C2]"
                            )}
                        >
                            {tab}
                        </button>
                    ))}

                    {/* Divider */}
                    <div className="w-px h-5 bg-gray-200 mx-1" />

                    {dropdowns.map((label) => (
                        <button
                            key={label}
                            className="flex items-center gap-1 px-3 py-1.5 text-sm font-semibold text-gray-600 hover:text-[#0A47C2] transition-all font-sans whitespace-nowrap"
                        >
                            {label} <ChevronDown />
                        </button>
                    ))}
                </div>
            </div>

            {/* Course Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {loading
                    ? Array.from({ length: 3 }).map((_, i) => (
                        <div key={i} className="bg-gray-50 rounded-2xl aspect-video animate-pulse" />
                    ))
                    : classes.map((cls) => (
                        <div
                            key={cls._id}
                            onClick={() => {
                                setSelectedClass(cls);
                                setIsDetailModalOpen(true);
                            }}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col hover:shadow-lg transition-shadow duration-300 cursor-pointer group"
                        >
                            {/* Image */}
                            <div className="relative w-full aspect-video overflow-hidden">
                                <Image
                                    src={getImageUrl(cls.images[0])}
                                    alt={cls.subject}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                                {/* Rating Badge */}
                                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-full px-2.5 py-1 text-xs font-bold text-[#0D1C35] font-sans">
                                    <StarIcon />
                                    <span>{cls.averageRating || 0}</span>
                                    <span className="text-gray-400 font-normal">({cls.ratingCount || 0})</span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 flex flex-col gap-3 flex-1">
                                {/* Badge */}
                                <p className="text-[10px] font-bold tracking-widest uppercase text-[#0A47C2] font-sans">
                                    {cls.level} • {cls.curriculum}
                                </p>

                                {/* Title */}
                                <h3 className="text-lg font-extrabold text-[#0D1C35] font-sans leading-snug">
                                    {cls.subject}
                                </h3>

                                {/* Description Truncated to 3 words */}
                                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                                    {cls.description.split(" ").slice(0, 3).join(" ")}...
                                </p>

                                {/* Tags */}
                                <div className="flex items-center gap-3 text-xs text-gray-400 font-sans">
                                    <span className="flex items-center gap-1">
                                        <UserIcon /> {cls.classType === "GROUP" ? "Group Class" : "1-on-1 Session"}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <CertIcon /> {cls.language}
                                    </span>
                                    <span className="ml-auto font-extrabold text-[#0D1C35]">
                                        {cls.price} KD
                                    </span>
                                </div>

                                {/* Divider */}
                                <div className="w-full h-px border border-gray-300 mt-4" />

                                {/* CTA Row */}
                                <div className="flex items-center gap-3 mt-auto">
                                    <button
                                        onClick={(e) => handleBookNow(e, cls._id)}
                                        disabled={bookingClassId === cls._id}
                                        className="flex-1 py-2.5 bg-[#0A47C2] text-white text-center text-sm font-bold rounded-xl font-sans hover:bg-[#083a9e] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {bookingClassId === cls._id ? "Booking..." : "Book Now"}
                                    </button>

                                </div>
                            </div>
                        </div>
                    ))}
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-10">
                <Link href="/classes" className="px-8 py-3 bg-[#0D1C35] text-white text-sm font-bold rounded-full font-sans hover:bg-[#0A47C2] transition-all">
                    View All Programs →
                </Link>
            </div>
        </section>
    );
}