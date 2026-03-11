"use client";

import Image from "next/image";
import Link from "next/link";

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

const tutors = [
    {
        id: 1,
        image: "/demotutor.png",
        name: "Dr. Elena Rostova",
        rating: 4.9,
        students: "201+ students",
        credential: "PGCE Qualified Teacher | PhD Oxford University",
        bio: "Specializing in Theoretical Physics with over 10 years of academic excellence. I have successfully guided students through rigorous university admissions and complex research projects, focusing on building strong analytical foundations and intuitive understanding of high-level Physics.",
        teaches: ["Theoretical Physics", "Advanced Calculus", "Quantum Mechanics"],
    },
    {
        id: 2,
        image: "/demotutor.png",
        name: "Prof. James Sterling",
        rating: 5,
        students: "154+ students",
        credential: "Senior Academic Fellow | Harvard University Graduate",
        bio: "Senior Fellow in Economic History with extensive experience in policy analysis. My approach integrates historical context with modern economic theory, providing students with a sophisticated toolkit for understanding global markets and institutional development.",
        teaches: ["Economic History", "Global Policy", "Macroeconomics"],
    },
    {
        id: 3,
        image: "/demotutor.png",
        name: "Dr. Sarah Chen",
        rating: 4.8,
        students: "310+ students",
        credential: "Expert Researcher | Stanford University Faculty",
        bio: "Leading expert in Artificial Intelligence and Computational Mathematics. I focus on bridging the gap between theoretical algorithms and practical implementations, helping students master the core principles of machine learning and its future applications in technology and society.",
        teaches: ["Artificial Intelligence", "Computer Science", "Deep Learning"],
    },
];

export default function TutorsContent() {
    return (
        <section className="w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-16 py-10">
            {/* Header */}
            <div className="text-center mb-12">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0A47C2] font-sans">
                    All Tutor
                </h1>
            </div>

            {/* Tutor Cards */}
            <div className="flex flex-col gap-6">
                {tutors.map((tutor) => (
                    <div
                        key={tutor.id}
                        className="border border-[#0A47C2] rounded-2xl p-4 flex flex-col sm:flex-row gap-5 bg-white"
                    >
                        {/* Photo */}
                        <div className="relative w-full sm:w-28 md:w-60 h-96 md:h-60 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                            <Image
                                src={tutor.image}
                                alt={tutor.name}
                                fill
                                className="object-cover object-top"
                            />
                        </div>

                        {/* Main Info */}
                        <div className="flex-1 flex flex-col gap-2.5 min-w-0">
                            {/* Name + Rating */}
                            <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-base font-extrabold text-[#0D1C35] font-sans">
                                    {tutor.name}
                                </h3>
                                <div className="flex items-center gap-1">
                                    <StarIcon />
                                    <span className="text-xs font-bold text-[#0D1C35] font-sans">{tutor.rating}</span>
                                    <span className="text-xs text-gray-400 font-sans">{tutor.students}</span>
                                </div>
                            </div>

                            {/* Credential */}
                            <div className="flex items-center gap-1.5 mt-16 text-xs text-gray-500 font-sans">
                                <VerifiedIcon />
                                <span>{tutor.credential}</span>
                            </div>

                            {/* Bio */}
                            <p className="text-gray-400 text-xs sm:text-sm leading-relaxed font-sans line-clamp-3">
                                {tutor.bio}
                            </p>

                            {/* View Profile */}
                            <Link
                                href={`/tutors/${tutor.id}`}
                                className="text-[#0A47C2] text-xs font-bold font-sans text-left hover:underline w-fit mt-0.5"
                            >
                                View profile
                            </Link>
                        </div>

                        {/* Right — Teaches + CTA */}
                        <div className="flex sm:flex-col items-start sm:items-end justify-between sm:justify-between gap-4 sm:min-w-[140px]">
                            {/* Teaches */}
                            <div className="text-right hidden sm:block">
                                <p className="text-[10px] font-bold tracking-widest uppercase text-gray-400 font-sans mb-1.5">
                                    Teaches
                                </p>
                                <div className="flex flex-col gap-0.5 items-end">
                                    {tutor.teaches.map((subject) => (
                                        <span
                                            key={subject}
                                            className="text-xs font-semibold text-[#0A47C2] font-sans"
                                        >
                                            {subject}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Mobile teaches */}
                            <div className="sm:hidden flex flex-wrap gap-1.5">
                                {tutor.teaches.map((subject) => (
                                    <span
                                        key={subject}
                                        className="text-xs font-semibold text-[#0A47C2] bg-blue-50 px-2 py-0.5 rounded-full font-sans"
                                    >
                                        {subject}
                                    </span>
                                ))}
                            </div>

                            {/* Hire Button */}
                            <Link href="/checkout" className="px-5 py-2 bg-[#0A47C2] text-white text-xs font-bold rounded-xl font-sans hover:bg-[#083a9e] transition-all whitespace-nowrap mt-auto text-center">
                                Hire a tutor
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
