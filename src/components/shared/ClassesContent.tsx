"use client";

import Image from "next/image";
import { Search, ChevronDown, Settings2, ShieldCheck, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

function StarIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
        </svg>
    );
}

function VerifiedIcon() {
    return (
        <ShieldCheck className="text-[#0A47C2]" size={14} />
    );
}

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

import Link from "next/link";
import { useState, useEffect } from "react";
import axios from "axios";
import api from "@/lib/axios";
import FilterModal from "./FilterModal";
import ClassDetailModal from "./ClassDetailModal";

interface ClassData {
    _id: string;
    subject: string;
    level: string;
    language: string;
    curriculum: string;
    price: number;
    tutorGender: string;
    maxStudents: number;
    description: string;
    classType: string;
    images: string[];
    createdAt: string;
    averageRating: number;
    ratingCount: number;
    youtubeVideoLink?: string;
    whatsappGroupLink?: string;
    createdBy: {
        name: string;
        profileImage?: string;
    };
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

export default function ClassesContent() {
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [activeClassType, setActiveClassType] = useState("all");
    const [isTypeDropdownOpen, setIsTypeDropdownOpen] = useState(false);
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
        } catch (error) {
            console.error("Payment initiation failed:", error);
            alert("Failed to initiate payment. Please try again.");
        } finally {
            setBookingClassId(null);
        }
    };

    const fetchClasses = async (currentPage: number) => {
        setLoading(true);
        try {
            let url = `${process.env.NEXT_PUBLIC_API_URL}/classes?page=${currentPage}&limit=9`;
            
            if (searchTerm) {
                url += `&searchTerm=${encodeURIComponent(searchTerm)}`;
            }
            if (activeClassType !== "all") {
                url += `&classType=${activeClassType}`;
            }

            const response = await axios.get(url);
            if (response.data.success) {
                // Sorting New to Old based on createdAt
                const sorted = response.data.data.sort((a: ClassData, b: ClassData) =>
                    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                );
                setClasses(sorted);
                setTotalPages(response.data.meta.totalPages);
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
        } finally {
            setLoading(false);
        }
    };

    // Effect for pagination
    useEffect(() => {
        fetchClasses(page);
    }, [page]);

    // Effect for filters - reset to page 1
    useEffect(() => {
        if (page !== 1) {
            setPage(1);
        } else {
            fetchClasses(1);
        }
    }, [activeClassType]);

    // Debounced search effect
    useEffect(() => {
        const handler = setTimeout(() => {
            if (page !== 1) {
                setPage(1);
            } else {
                fetchClasses(1);
            }
        }, 500);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    const getImageUrl = (path: string) => {
        if (!path) return "/democourse.png";
        if (path.startsWith("http")) return path;
        // Base URL from env or hardcoded as per next.config.ts
        return `http://10.10.7.53:5010${path}`;
    };

    return (
        <section className="w-full max-w-7xl mb-10 mx-auto px-4 sm:px-8 md:px-16 py-6">
            {/* Filter Modal */}
            <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />

            {/* Detail Modal */}
            <ClassDetailModal
                isOpen={isDetailModalOpen}
                onClose={() => setIsDetailModalOpen(false)}
                data={selectedClass}
            />

            {/* Top Bar Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                {/* Left side dropdowns */}
                <div className="flex items-center gap-2 relative">
                    <div className="relative">
                        <button 
                            onClick={() => setIsTypeDropdownOpen(!isTypeDropdownOpen)}
                            className="flex items-center gap-2 px-4 py-1.5 bg-[#0A47C2] text-white font-bold rounded-md text-[13px] font-sans min-w-[130px] justify-between"
                        >
                            {activeClassType === "all" ? "All Classes" : 
                             activeClassType === "GROUP" ? "Group Class" : "1-on-1 Session"} 
                            <ChevronDown size={14} className={cn("transition-transform", isTypeDropdownOpen && "rotate-180")} />
                        </button>
                        
                        {isTypeDropdownOpen && (
                            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <button 
                                    onClick={() => { setActiveClassType("all"); setIsTypeDropdownOpen(false); }}
                                    className={cn("w-full text-left px-4 py-2 text-sm font-bold font-sans hover:bg-gray-50", activeClassType === "all" ? "text-[#0A47C2]" : "text-gray-600")}
                                >
                                    All Classes
                                </button>
                                <button 
                                    onClick={() => { setActiveClassType("GROUP"); setIsTypeDropdownOpen(false); }}
                                    className={cn("w-full text-left px-4 py-2 text-sm font-bold font-sans hover:bg-gray-50", activeClassType === "GROUP" ? "text-[#0A47C2]" : "text-gray-600")}
                                >
                                    Group Class
                                </button>
                                <button 
                                    onClick={() => { setActiveClassType("ONE_TO_ONE"); setIsTypeDropdownOpen(false); }}
                                    className={cn("w-full text-left px-4 py-2 text-sm font-bold font-sans hover:bg-gray-50", activeClassType === "ONE_TO_ONE" ? "text-[#0A47C2]" : "text-gray-600")}
                                >
                                    1-on-1 Session
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Center Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A47C2] font-sans text-center">
                    All Classes
                </h1>

                {/* Right side search + filter */}
                <div className="flex items-center gap-2">
                    <div className="relative w-48 md:w-56">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search classes..."
                            className="w-full pl-4 pr-10 py-1.5 border border-gray-200 rounded-md focus:outline-none font-sans text-sm text-gray-700 bg-white shadow-sm"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                    </div>
                    <button
                        onClick={() => setIsFilterModalOpen(true)}
                        className="p-1.5 border border-gray-200 rounded-md text-gray-600 bg-white shadow-sm"
                    >
                        <Settings2 size={18} />
                    </button>
                </div>
            </div>

            {/* Class Cards */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0A47C2]"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {classes.map((cls) => (
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
                                    {cls.description?.split(" ").slice(0, 3).join(" ")}...
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
                                        ${cls.price}
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
                                    <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:text-[#0A47C2] hover:border-[#0A47C2] transition-all">
                                        <MessageCircle />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center gap-4 mt-12">
                    <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-4 py-2 border border-gray-200 rounded-md disabled:opacity-50 text-sm font-bold text-[#0A47C2]"
                    >
                        Previous
                    </button>
                    <span className="text-sm font-bold text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-4 py-2 border border-gray-200 rounded-md disabled:opacity-50 text-sm font-bold text-[#0A47C2]"
                    >
                        Next
                    </button>
                </div>
            )}
        </section>
    );
}
