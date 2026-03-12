"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";

export default function AdminTopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const pathname = usePathname();

    const getTitle = () => {
        if (pathname === "/web-admin/teacher") return "Teacher";
        if (pathname === "/web-admin/student") return "Student";
        if (pathname === "/web-admin/payment") return "Payment";
        if (pathname === "/web-admin/withdrawer-request" || pathname === "/web-admin/withdrawal-request") return "Withdrawal Request";
        if (pathname === "/web-admin/settings") return "Settings";
        if (pathname === "/web-admin/profile") return "Admin Profile";
        return "Dashboard";
    };

    return (
        <header className="h-20 bg-white border-b border-gray-50 flex items-center justify-between px-4 md:px-8 shrink-0 sticky top-0 z-30">
            <div className="flex items-center gap-4">
                {/* Mobile Menu Toggle */}
                <button
                    onClick={onMenuClick}
                    className="p-2 lg:hidden text-gray-500 hover:bg-gray-50 transition-colors"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="12" x2="21" y2="12" />
                        <line x1="3" y1="6" x2="21" y2="6" />
                        <line x1="3" y1="18" x2="21" y2="18" />
                    </svg>
                </button>

                <div>
                    <p className="text-gray-400 text-[10px] md:text-xs font-medium font-sans">Super Admin</p>
                    <h1 className="text-lg md:text-xl font-bold text-[#0D1C35] font-sans capitalize">{getTitle()}</h1>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <Link href="/messages" className="p-2 text-gray-400 hover:text-[#0A47C2] hover:bg-blue-50 rounded-full transition-all">
                    <MessageSquare size={20} />
                </Link>
                <Link href="/web-admin/profile" className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm hover:ring-2 hover:ring-blue-100 transition-all">
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
