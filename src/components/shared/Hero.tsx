"use client";

import Image from "next/image";

export default function Hero() {
    return (
        <section className="relative w-full max-w-7xl mx-auto px-4 sm:px-8 md:px-0 py-10 md:py-6 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12 overflow-hidden">
            {/* Left Content */}
            <div className="flex-1 space-y-6 sm:space-y-8 text-center md:text-left">
                <div className="space-y-3 sm:space-y-4">
                    <p className="text-[#0A47C2] font-bold tracking-[0.2em] uppercase text-xs sm:text-sm font-sans">
                        Excellence Redefined
                    </p>
                    <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-[#0D1C35] leading-[1.1] font-sans">
                        Excellence in <br />
                        <span className="text-[#0D1C35]">Elite Tutoring</span>
                    </h1>
                    <p className="text-gray-500 text-base sm:text-lg md:text-xl max-w-lg mx-auto md:mx-0 leading-relaxed font-sans">
                        Unlock your academic potential with world-class 1-on-1 sessions from top-tier educators sourced from the world's leading institutions.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 items-center md:items-start justify-center md:justify-start">
                    <button className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-[#0A47C2] text-white font-bold rounded-xl transition-all font-sans">
                        Book a Consultation
                    </button>
                    <button className="w-full sm:w-auto px-8 sm:px-10 py-4 bg-white border border-gray-200 text-[#0D1C35] font-bold rounded-xl hover:bg-gray-50 transition-all font-sans">
                        Explore Courses
                    </button>
                </div>
            </div>

            {/* Right Content - Hero Image */}
            <div className="flex-1 relative flex justify-center items-center w-full">
                <div className="relative w-full max-w-xs sm:max-w-sm md:max-w-md aspect-3/4 overflow-hidden transform rotate-1">
                    <Image
                        src="/heropic.png"
                        alt="Elite Tutoring"
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            </div>
        </section>
    );
}