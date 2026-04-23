"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import api from "@/lib/axios";
import { toast } from "sonner";
import HourlyTutorDetailModal from "./HourlyTutorDetailModal";

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

function StarIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
        </svg>
    );
}

function VerifiedIcon() {
    return (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0A47C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );
}


export default function TopTutors() {
    const [tutors, setTutors] = useState<HourlyClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTutor, setSelectedTutor] = useState<HourlyClassData | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const router = useRouter();
    const [hiringId, setHiringId] = useState<string | null>(null);

    const handleHire = async (e: React.MouseEvent, tutorId: string) => {
        e.stopPropagation();
        setHiringId(tutorId);
        try {
            const response = await api.post("/messages/conversations", {
                participantIds: [tutorId]
            });
            if (response.data.success && response.data.data?._id) {
                router.push(`/messages?conversationId=${response.data.data._id}`);
            } else {
                router.push("/messages");
            }
        } catch (error: any) {
            console.error("Failed to create conversation:", error);
            toast.error("Failed to initiate conversation with tutor.");
            router.push("/messages");
        } finally {
            setHiringId(null);
        }
    };

    useEffect(() => {
        const fetchTopTutors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/hourly-classes`);
                if (response.data.success) {
                    // Sort by average rating high to low
                    const sorted = response.data.data.sort((a: HourlyClassData, b: HourlyClassData) =>
                        (b.averageRating || 0) - (a.averageRating || 0)
                    );
                    setTutors(sorted.slice(0, 3));
                }
            } catch (error) {
                console.error("Error fetching homepage tutors:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchTopTutors();
    }, []);

    const getImageUrl = (path: string) => {
        if (!path) return "/demotutor.png";
        if (path.startsWith("http")) return path;
        return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
    };

    return (
        <section className="w-full max-w-7xl mx-auto px-4 md:px-0 py-10 md:py-14">
            {/* Modal */}
            <HourlyTutorDetailModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                data={selectedTutor}
            />

            {/* Header */}
            <div className="text-center mb-10 space-y-3">
                <h2 className="text-3xl md:text-4xl font-extrabold text-[#0D1C35] font-sans">
                    Meet Our Top Tutors
                </h2>
                <p className="text-gray-400 text-sm md:text-base mx-auto leading-relaxed font-sans">
                    Educated at the world's most prestigious universities, our tutors are <br className="hidden md:block" /> dedicated to your intellectual growth.
                </p>
            </div>

            {/* Tutor Cards */}
            <div className="flex flex-col gap-6">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#0A47C2]"></div>
                    </div>
                ) : (
                    <>
                        {tutors.map((tutor) => (
                            <div
                                key={tutor._id}
                                className="border border-[#0A47C2] rounded-2xl p-4 flex flex-col sm:flex-row gap-5 bg-white shadow-sm hover:shadow-md transition-shadow"
                            >
                                {/* Photo */}
                                <div className="relative w-full sm:w-28 md:w-60 h-80 md:h-60 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100">
                                {tutor.createdBy.profileImage ? (
                                    <Image
                                        src={getImageUrl(tutor.createdBy.profileImage)}
                                        alt={tutor.createdBy.name}
                                        fill
                                        unoptimized
                                        className="object-cover object-top"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A47C2] to-[#4F46E5] text-white text-5xl font-bold font-sans">
                                        {tutor.createdBy.name.charAt(0).toUpperCase()}
                                    </div>
                                )}
                                </div>

                                {/* Main Info */}
                                <div className="flex-1 flex flex-col gap-2 min-w-0 py-1">
                                    {/* Name + Rating */}
                                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                                        <h3 className="text-lg font-extrabold text-[#0D1C35] font-sans">
                                            {tutor.createdBy.name}
                                        </h3>
                                        <div className="flex items-center gap-1.5 bg-amber-50 px-2 py-0.5 rounded-full">
                                            <StarIcon />
                                            <span className="text-xs font-bold text-[#D97706] font-sans">{tutor.averageRating || 0}</span>
                                            <span className="text-xs text-amber-600/70 font-sans">({tutor.ratingCount || 0})</span>
                                        </div>
                                    </div>

                                    {/* Quick Credential / Medium */}
                                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold uppercase tracking-wider">
                                        <VerifiedIcon />
                                        <span>{tutor.curriculum} • {tutor.language}</span>
                                    </div>

                                    {/* Bio */}
                                    <p className="text-gray-500 text-sm leading-relaxed font-sans line-clamp-2 max-w-2xl mt-2">
                                        {tutor.description}
                                    </p>

                                    {/* View Details */}
                                    <button
                                        onClick={() => {
                                            setSelectedTutor(tutor);
                                            setIsModalOpen(true);
                                        }}
                                        className="text-[#0A47C2] text-xs font-bold font-sans text-left hover:underline w-fit mt-auto pt-4"
                                    >
                                        View Details
                                    </button>
                                </div>

                                {/* Right — Highlights + Price */}
                                <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-start gap-6 sm:min-w-[160px] py-1">
                                    {/* Teaches */}
                                    <div className="text-right hidden sm:block">
                                        <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 font-sans mb-2">
                                            Expertise
                                        </p>
                                        <div className="flex flex-col gap-1 items-end">
                                            {tutor.subjects.slice(0, 3).map((subject) => (
                                                <span
                                                    key={subject}
                                                    className="text-xs font-bold text-[#0D1C35] bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100 font-sans"
                                                >
                                                    {subject}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Price / Static CTA */}
                                    <div className="sm:mt-auto flex flex-col items-end">
                                        <p className="text-sm font-extrabold text-[#0D1C35] mb-2 font-sans">{tutor.pricePerHour} KD<span className="text-[10px] font-normal text-gray-400">/hr</span></p>
                                        <button
                                            onClick={(e) => handleHire(e, tutor.createdBy._id)}
                                            disabled={hiringId === tutor.createdBy._id}
                                            className="px-6 py-2.5 bg-[#0A47C2] text-white text-xs font-bold rounded-xl font-sans hover:bg-[#083a9e] transition-all whitespace-nowrap shadow-lg shadow-blue-100 disabled:opacity-70 disabled:cursor-not-allowed">
                                            {hiringId === tutor.createdBy._id ? "Processing..." : "Hire"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}

                    </>
                )}
            </div>

            {/* View All Button */}
            <div className="flex justify-center mt-10">
                <Link
                    href="/tutors"
                    className="px-8 py-3 bg-[#0D1C35] text-white text-sm font-bold rounded-full font-sans hover:bg-[#0A47C2] transition-all"
                >
                    View all tutors →
                </Link>
            </div>
        </section>
    );
}