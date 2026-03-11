"use client";

import React from "react";
import Image from "next/image";

export default function TutorSummary() {
    return (
        <div className="space-y-6">
            {/* Tutor Card */}
            <div className="bg-white rounded-3xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="relative aspect-4/3 w-full">
                    <Image
                        src="/demotutor.png"
                        alt="Nohan.T"
                        fill
                        className="object-cover"
                    />
                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full flex items-center gap-1">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="#F59E0B">
                            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
                        </svg>
                        <span className="text-[10px] font-bold text-[#0D1C35]">5 (85+)</span>
                    </div>
                    
                    <div className="absolute bottom-3 left-3 flex gap-2">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                            </svg>
                            Mathematic
                        </span>
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg flex items-center gap-1.5 text-[10px] font-bold text-gray-500">
                             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18L12 21L19 17.18V13.18L12 17L5 13.18Z" />
                            </svg>
                            British
                        </span>
                    </div>
                </div>

                <div className="p-6 space-y-3">
                    <div className="space-y-1">
                        <span className="text-[10px] font-bold tracking-widest text-[#F59E0B] uppercase">PER HOUR <span className="text-[#0D1C35]">$25</span></span>
                        <h3 className="text-xl font-bold text-[#0D1C35]">Nohan.T</h3>
                    </div>
                    <p className="text-xs text-gray-500 leading-relaxed font-sans">
                        Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.
                    </p>
                    
                    <button className="w-full py-3.5 bg-[#0A47C2] text-white font-bold rounded-2xl font-sans hover:bg-[#083a9e] transition-all shadow-[0_10px_20px_-5px_rgba(10,71,194,0.3)] mt-2">
                        Book Now
                    </button>
                </div>
            </div>

            {/* Price Summary */}
            <div className="space-y-6 pt-4">
                <div className="flex items-center justify-between">
                    <span className="text-2xl font-extrabold text-[#0D1C35]">Total :</span>
                    <span className="text-2xl font-extrabold text-[#0D1C35]">$75.00 USD</span>
                </div>

                <button className="w-full py-4 bg-[#0A47C2] text-white font-bold rounded-2xl font-sans hover:bg-[#083a9e] transition-all shadow-lg flex items-center justify-center text-lg">
                    Complete Payment
                </button>
            </div>
        </div>
    );
}
