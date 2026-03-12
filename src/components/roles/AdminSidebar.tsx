"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    CreditCard,
    ArrowUpRight,
    Settings,
    LogOut
} from "lucide-react";
import Image from "next/image";

const navItems = [
    { name: "Dashboard", href: "/web-admin", icon: LayoutDashboard },
    { name: "Teacher", href: "/web-admin/teacher", icon: Users },
    { name: "Student", href: "/web-admin/student", icon: GraduationCap },
    { name: "Payment", href: "/web-admin/payment", icon: CreditCard },
    { name: "Withdrawal Request", href: "/web-admin/withdrawal-request", icon: ArrowUpRight },
    { name: "Settings", href: "/web-admin/settings", icon: Settings },
];

export default function AdminSidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
    const pathname = usePathname();

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside className={`fixed lg:static inset-y-0 left-0 w-64 bg-white border-r border-gray-100 flex flex-col shrink-0 z-50 transition-transform duration-300 transform ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                }`}>
                {/* Logo */}
                <div className="px-6 flex items-center justify-between lg:justify-start gap-2 h-20">
                    <div className="flex items-center gap-2">
                        <Image src="/logo2.svg" alt="Logo" width={161} height={60} />
                    </div>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="lg:hidden text-gray-400 p-1">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    </button>
                </div>

                {/* Nav Items */}
                <nav className="flex-1 py-4 space-y-1 overflow-y-auto">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={onClose}
                                className={`flex items-center gap-3 px-8 py-3 text-sm font-medium transition-all ${isActive
                                    ? "bg-[#0A47C2] text-white font-semibold"
                                    : "text-gray-600 hover:text-[#0A47C2] hover:bg-blue-50"
                                    }`}
                            >
                                <item.icon size={20} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Sign Out */}
                <div className="p-4 mb-safe">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-red-100 text-red-500 rounded-none text-sm font-bold hover:bg-red-50 transition-all">
                        <LogOut size={18} />
                        Sign-out
                    </button>
                </div>
            </aside>
        </>
    );
}
