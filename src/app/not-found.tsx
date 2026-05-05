"use client";

import React from "react";
import Link from "next/link";
import { Search, Home, ArrowLeft, BookOpen } from "lucide-react";
import Image from "next/image";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            {/* 404 Number Visual */}
            <div className="relative mb-8">
                <h2 className="text-[120px] md:text-[200px] font-black text-gray-50 leading-none select-none">
                    404
                </h2>
                <div className="absolute inset-0 flex items-center justify-center pt-8">
                    <div className="relative w-32 h-32 md:w-48 md:h-48">
                        <div className="absolute inset-0 bg-blue-50 rounded-full animate-ping opacity-20" />
                        <div className="relative z-10 w-full h-full bg-white rounded-full flex items-center justify-center shadow-2xl border border-gray-100">
                            <Search size={64} className="text-[#0A47C2] md:size-[80px]" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Message */}
            <div className="max-w-md space-y-6">
                <h1 className="text-3xl md:text-4xl font-bold text-[#0D1C35] font-sans tracking-tight">
                    Page not found
                </h1>
                <p className="text-gray-500 text-lg font-sans leading-relaxed">
                    The page you're looking for doesn't exist or has been moved to a new location.
                </p>

                {/* Action */}
                <div className="pt-8 flex justify-center">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-12 py-4 bg-[#0A47C2] text-white font-bold shadow-xl shadow-blue-100 hover:bg-[#083a9e] transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>

            {/* Branded Footer */}
            <div className="absolute bottom-12 opacity-30 grayscale pointer-events-none">
                <Image src="/logo2.svg" alt="Logo" width={120} height={40} unoptimized />
            </div>
        </div>
    );
}
