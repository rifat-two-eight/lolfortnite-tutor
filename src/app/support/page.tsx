"use client";

import Image from "next/image";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import { Globe, MessageCircle, Facebook, Twitter, Instagram } from "lucide-react";

export default function SupportPage() {
    const contactLinks = [
        { name: "WhatsApp", icon: <MessageCircle size={20} className="text-gray-700" />, href: "#" },
        { name: "Website", icon: <Globe size={20} className="text-gray-700" />, href: "#" },
        { name: "Facebook", icon: <Facebook size={20} className="text-gray-700" />, href: "#" },
        { name: "Twitter", icon: <Twitter size={20} className="text-gray-700" />, href: "#" },
        { name: "Instagram", icon: <Instagram size={20} className="text-gray-700" />, href: "#" },
    ];

    return (
        <main className="min-h-screen bg-white">
            <Navbar />

            <div className="max-w-[1400px] mx-auto px-4 sm:px-8 md:px-16 py-12 md:py-20">
                <div className="w-full grid lg:grid-cols-2 lg:items-start justify-between gap-12 lg:gap-24">

                    {/* Left side: Header + Contact List */}
                    <div className="space-y-12">
                        {/* Contact Us Tab — width matches max-w-md content */}
                        <div className="max-w-md">
                            <div className="w-fit pb-2 h-8">
                                <h1 className="text-[13px] font-bold text-gray-700 uppercase tracking-widest">Contact Us</h1>
                            </div>
                            <div className="w-full h-px bg-gray-200 -mt-px"></div>
                        </div>

                        <div className="space-y-4 max-w-md">
                            {contactLinks.map((link) => (
                                <a
                                    key={link.name}
                                    href={link.href}
                                    className="flex items-center gap-6 p-4 bg-white border border-gray-100 rounded-[24px] shadow-[0_4px_20px_rgba(0,0,0,0.02)] hover:shadow-[0_4px_25px_rgba(0,0,0,0.05)] transition-all group"
                                >
                                    <div className="w-10 h-10 flex items-center justify-center bg-gray-50 rounded-full group-hover:bg-blue-50 transition-colors">
                                        {link.icon}
                                    </div>
                                    <span className="text-base font-bold text-gray-700 font-sans tracking-tight">{link.name}</span>
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Right side: Illustration */}
                    <div className="flex justify-center lg:justify-end items-center h-full">
                        <div className="relative w-full max-w-[900px] aspect-[1.4/1]">
                            <Image
                                src="/support.svg"
                                alt="Support Illustration"
                                fill
                                className="object-contain"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}