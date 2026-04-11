"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function TeacherTopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === "/teacher/create") return "create a new class";
        if (pathname === "/teacher/profile") return "Teacher Profile";
        if (pathname === "/teacher/classes") return "My Class";
        if (pathname === "/teacher/settings") return "Settings";
        if (pathname === "/teacher/earning") return "Earning";
        return "Dashboard";
    };

    return (
        <header className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2 lg:hidden text-gray-500 hover:bg-gray-50 transition-colors rounded-none"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <div>
                    <p className="text-gray-500 text-[10px] md:text-xs font-medium font-sans">Good Morning</p>
                    <h1 className="text-lg md:text-xl font-bold text-[#0D1C35] font-sans capitalize">{getTitle()}</h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/teacher/profile" className="relative w-10 h-10 rounded-none overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-100 transition-all">
                    <Image
                        src="/authpic.jpg"
                        alt="Profile"
                        fill
                        className="object-cover"
                    />
                </Link>
            </div>
        </header>
    );
}
