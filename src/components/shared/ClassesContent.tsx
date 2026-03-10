"use client";

import Image from "next/image";
import { Search, ChevronDown, Settings2, ShieldCheck, MessageCircle } from "lucide-react";

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
import { useState } from "react";
import FilterModal from "./FilterModal";

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

    return (
        <section className="w-full max-w-7xl mb-10 mx-auto px-4 sm:px-8 md:px-16 py-6">
            {/* Filter Modal */}
            <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />

            {/* Top Bar Filters */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
                {/* Left side dropdowns */}
                <div className="flex items-center gap-2">
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-[#0A47C2] text-white font-bold rounded-md text-[13px] font-sans">
                        Group class <ChevronDown size={14} />
                    </button>
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-[#0A47C2] text-white font-bold rounded-md text-[13px] font-sans">
                        Set <ChevronDown size={14} />
                    </button>
                </div>

                {/* Center Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A47C2] font-sans text-center">
                    Live Classes
                </h1>

                {/* Right side search + filter */}
                <div className="flex items-center gap-2">
                    <div className="relative w-48 md:w-56">
                        <input
                            type="text"
                            placeholder="Search"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {courses.map((course) => (
                    <div
                        key={course.id}
                        className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col"
                    >
                        {/* Image */}
                        <div className="relative w-full aspect-video overflow-hidden">
                            <Image
                                src={course.image}
                                alt={course.title}
                                fill
                                className="object-cover"
                            />
                            {/* Rating Badge */}
                            <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-full px-2.5 py-1 text-xs font-bold text-[#0D1C35] font-sans">
                                <StarIcon />
                                <span>{course.rating}</span>
                                <span className="text-gray-400 font-normal">({course.reviews})</span>
                            </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 flex flex-col gap-3 flex-1">
                            {/* Badge */}
                            <p className="text-[10px] font-bold tracking-widest uppercase text-[#0A47C2] font-sans">
                                {course.badge}
                            </p>

                            {/* Title */}
                            <h3 className="text-lg font-extrabold text-[#0D1C35] font-sans leading-snug">
                                {course.title}
                            </h3>

                            {/* Tags */}
                            <div className="flex items-center gap-3 text-xs text-gray-400 font-sans">
                                <span className="flex items-center gap-1">
                                    <UserIcon /> {course.tags[0]}
                                </span>
                                <span className="flex items-center gap-1">
                                    <CertIcon /> {course.tags[1]}
                                </span>
                            </div>

                            {/* Divider */}
                            <div className="w-full h-px border border-gray-300 mt-4" />

                            {/* CTA Row */}
                            <div className="flex items-center gap-3 mt-auto">
                                <button className="flex-1 py-2.5 bg-[#0A47C2] text-white text-sm font-bold rounded-xl font-sans hover:bg-[#083a9e] transition-all">
                                    Book Now
                                </button>
                                <button className="w-10 h-10 flex items-center justify-center border border-gray-200 rounded-xl text-gray-400 hover:text-[#0A47C2] hover:border-[#0A47C2] transition-all">
                                    <MessageCircle />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
