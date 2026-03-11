"use client";

import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function TutorDetailsPage() {
    return (
        <main className="min-h-screen bg-gray-50/50">
            <Navbar />

            <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
                {/* Main Header Card */}
                <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm flex flex-col md:flex-row gap-10 items-start">
                    {/* Image */}
                    <div className="relative w-full md:w-[280px] aspect-square rounded-[32px] overflow-hidden shrink-0">
                        <Image
                            src="/demotutor.png"
                            alt="Tutor"
                            fill
                            className="object-cover"
                        />
                    </div>

                    {/* Info */}
                    <div className="flex-1 space-y-6">
                        <div className="space-y-2">
                            <h1 className="text-4xl md:text-5xl font-bold text-[#0A47C2] font-sans">Aniket</h1>
                            <div className="flex items-center gap-2 text-gray-600 font-semibold font-sans">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" fill="#0A47C2" />
                                </svg>
                                <span>Cambridge University - Medicine</span>
                            </div>
                        </div>

                        <p className="text-gray-500 leading-relaxed text-sm font-sans max-w-2xl">
                            My name is Aniket, and I am presently pursuing a degree in Medicine at the University of Cambridge. I offer tutoring services for medical admissions tests, including the BMAT and UCAT, as well as Biology, Chemistry, Mathematics, and Physics at A-Level.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans shrink-0 w-24">TEACHES:</span>
                                <div className="flex flex-wrap gap-2">
                                    {["UCAT", "Math", "Physics", "BMAT"].map((tag) => (
                                        <span key={tag} className="px-4 py-1.5 bg-blue-50 text-[#0A47C2] text-xs font-bold rounded-full font-sans">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase font-sans shrink-0 w-24">CURRICULUM:</span>
                                <div className="flex flex-wrap gap-2">
                                    {["A-Level", "GCSE", "IGCSE"].map((tag) => (
                                        <span key={tag} className="px-4 py-1.5 bg-orange-50 text-orange-600 text-xs font-bold rounded-full font-sans">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTAs */}
                    <div className="w-full md:w-64 space-y-3">
                        <Link href="/checkout" className="w-full py-3 bg-[#0A47C2] text-white font-bold rounded-2xl font-sans hover:bg-[#083a9e] transition-colors shadow-lg text-center block">
                            Hire a tutor
                        </Link>
                        <button className="w-full py-3 bg-[#25D366] text-white font-bold rounded-2xl font-sans hover:bg-[#1ebe57] transition-colors flex items-center justify-center gap-2 shadow-lg">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                            </svg>
                            Join WhatsApp group
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    {/* Qualifications Column */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm space-y-8">
                            <h2 className="text-2xl font-bold text-[#0D1C35] font-sans">Qualifications</h2>

                            <div className="space-y-6">
                                <div className="space-y-1">
                                    <h4 className="text-[12px] font-bold text-[#0A47C2] uppercase tracking-wider font-sans">Cambridge University:</h4>
                                    <p className="text-gray-500 font-medium font-sans">Medicine (2019 - 2025)</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[12px] font-bold text-[#0A47C2] uppercase tracking-wider font-sans">A-Level:</h4>
                                    <p className="text-gray-500 font-medium font-sans">Qualified Online Tutor (Biology and Chemistry)</p>
                                </div>
                                <div className="space-y-1">
                                    <h4 className="text-[12px] font-bold text-[#0A47C2] uppercase tracking-wider font-sans">GCSE, IGCSE:</h4>
                                    <p className="text-gray-500 font-medium font-sans">Qualified Online Tutor (Biology, Physics and Chemistry)</p>
                                </div>
                            </div>
                        </div>

                        {/* Experience & Approach Card */}
                        <div className="bg-white rounded-[40px] p-8 md:p-12 shadow-sm space-y-12">
                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-[#0D1C35] font-sans">Tutoring Experience</h2>
                                <div className="space-y-4 text-gray-500 font-medium font-sans leading-relaxed">
                                    <p>A-level: I tutor A-level Biology and am currently tutoring a student who has successfully Year 12 and 13 year.</p>
                                    <p>I have also tutored A-level Chemistry.</p>
                                    <p>University admissions: I have helped mentor students for medicine applications. This involves all types of interview practice (I have experienced and given practice in Oxbridge Science Interviews, MMI and panel interviews).</p>
                                    <p>This also involves general advice on personal statements, extra-curricular and work experience.</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h2 className="text-2xl font-bold text-[#0D1C35] font-sans">Tutoring Approach</h2>
                                <div className="space-y-4 text-gray-500 font-medium font-sans leading-relaxed">
                                    <p>My approach is to teach concepts from first principles and get students to work out how things work.</p>
                                    <p>I combine this with board specific exam question practice to improve exam technique which is what actually brings the excellent marks to bright and engaged students.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right side placeholder / space (vetted tutor removed) */}
                    <div className="hidden lg:block lg:col-span-1">
                        {/* Space naturally left empty as requested to remove the box */}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
