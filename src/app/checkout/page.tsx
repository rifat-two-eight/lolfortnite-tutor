"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PaymentForm from "@/components/checkout/PaymentForm";
import TutorSummary from "@/components/checkout/TutorSummary";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export default function CheckoutPage() {
    const router = useRouter();

    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 md:py-16">
                
                {/* Back Button */}
                <button 
                    onClick={() => router.back()}
                    className="mb-10 w-12 h-12 rounded-full bg-[#0A47C2] flex items-center justify-center text-white hover:bg-[#083a9e] transition-all shadow-lg"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M19 12H5M12 19l-7-7 7-7" />
                    </svg>
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
                    
                    {/* Left: Payment Form */}
                    <div className="lg:col-span-7">
                        <PaymentForm />
                    </div>

                    {/* Right: Tutor Summary */}
                    <div className="lg:col-span-5">
                        <TutorSummary />
                    </div>

                </div>
            </div>
            <Footer />
        </main>
    );
}
