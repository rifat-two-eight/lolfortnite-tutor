"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCcw, Home, MessageCircle, ArrowLeft } from "lucide-react";
import Image from "next/image";

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error("Global Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
            {/* Visual Element */}
            <div className="relative mb-12">
                <div className="absolute inset-0 bg-blue-50 rounded-full scale-[2.5] opacity-50 animate-pulse" />
                <div className="relative w-48 h-48 md:w-64 md:h-64 mx-auto">
                    <Image
                        src="/logo2.svg"
                        alt="Logo"
                        fill
                        className="object-contain opacity-20 grayscale"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <AlertTriangle size={80} className="text-[#0A47C2] md:size-[120px]" />
                    </div>
                </div>
            </div>

            {/* Error Message */}
            <div className="max-w-md space-y-6">
                <h1 className="text-4xl md:text-5xl font-extrabold text-[#0D1C35] font-sans tracking-tight">
                    Oops! Something went wrong
                </h1>
                <p className="text-gray-500 text-lg font-sans leading-relaxed">
                    We encountered an unexpected error. Don't worry, our team has been notified and we're working on it.
                </p>
                
                {process.env.NODE_ENV === "development" && (
                    <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-left">
                        <p className="text-xs font-bold text-red-400 uppercase tracking-widest mb-1">Error Details</p>
                        <p className="text-sm font-mono text-red-600 break-all">{error.message}</p>
                    </div>
                )}

                {/* Actions */}
                <div className="pt-6">
                    <button
                        onClick={() => window.history.back()}
                        className="w-full sm:w-auto px-12 py-4 bg-[#0A47C2] text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#083a9e] transition-all flex items-center justify-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        Go Back
                    </button>
                </div>
            </div>

            {/* Support Footer */}
            <div className="mt-16 flex items-center gap-2 text-gray-400 text-sm font-medium">
                <MessageCircle size={18} />
                <span>Need help? <Link href="/contact" className="text-[#0A47C2] font-bold hover:underline">Contact Support</Link></span>
            </div>
        </div>
    );
}
