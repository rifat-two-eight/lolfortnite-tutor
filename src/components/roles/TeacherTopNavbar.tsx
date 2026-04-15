"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { User, LogOut, Home, LayoutDashboard, ChevronDown } from "lucide-react";
import { getImageUrl, cn } from "@/lib/utils";
import api from "@/lib/axios";

export default function TeacherTopNavbar({ onMenuClick }: { onMenuClick?: () => void }) {
    const pathname = usePathname();
    const router = useRouter();
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [mounted, setMounted] = useState(false);

    React.useEffect(() => {
        setMounted(true);
        // Ensure the navbar always has the latest data from the server
        api.get("/auth/me").then((res) => {
            if (res.data.success) {
                setUser(res.data.data);
            }
        });
    }, [setUser]);

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
                {/* Profile Dropdown */}
                <div className="relative">
                    <button
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        className="flex items-center gap-2 p-1 hover:bg-gray-50 rounded-full transition-all border border-transparent hover:border-gray-100"
                    >
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm transition-all bg-gray-100 flex items-center justify-center">
                            {mounted && user?.profileImage ? (
                                <Image
                                    src={getImageUrl(user.profileImage)}
                                    unoptimized
                                    alt="Profile"
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <User size={20} className="text-[#0A47C2]" />
                            )}
                        </div>
                        <ChevronDown size={14} className={cn("text-gray-400 transition-transform duration-200", showProfileDropdown && "rotate-180")} />
                    </button>

                    {showProfileDropdown && (
                        <>
                            {/* Backdrop for closing */}
                            <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowProfileDropdown(false)}
                            />

                            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-gray-50 py-2 z-50 animate-in fade-in zoom-in duration-200">
                                <div className="px-4 py-3 border-b border-gray-50">
                                    <p className="text-xs text-gray-400 font-sans">Signed in as</p>
                                    <p className="text-sm font-bold text-[#0D1C35] font-sans truncate">{user?.name || "Teacher"}</p>
                                    <p className="text-[10px] text-gray-400 font-sans truncate">{user?.email}</p>
                                </div>

                                <div className="p-1">
                                    <Link
                                        href="/"
                                        onClick={() => setShowProfileDropdown(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#0A47C2] rounded-xl transition-all group"
                                    >
                                        <div className="p-1.5 bg-gray-50 group-hover:bg-white rounded-lg transition-colors">
                                            <Home size={16} />
                                        </div>
                                        <span>Home</span>
                                    </Link>
                                    <Link
                                        href="/teacher"
                                        onClick={() => setShowProfileDropdown(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#0A47C2] rounded-xl transition-all group"
                                    >
                                        <div className="p-1.5 bg-gray-50 group-hover:bg-white rounded-lg transition-colors">
                                            <LayoutDashboard size={16} />
                                        </div>
                                        <span>Dashboard</span>
                                    </Link>
                                    <Link
                                        href="/teacher/profile"
                                        onClick={() => setShowProfileDropdown(false)}
                                        className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#0A47C2] rounded-xl transition-all group"
                                    >
                                        <div className="p-1.5 bg-gray-50 group-hover:bg-white rounded-lg transition-colors">
                                            <User size={16} />
                                        </div>
                                        <span>Profile</span>
                                    </Link>
                                </div>

                                <div className="p-1 border-t border-gray-50 mt-1">
                                    <button
                                        onClick={() => {
                                            logout();
                                            router.push("/auth");
                                        }}
                                        className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-500 hover:bg-red-50 rounded-xl transition-all group"
                                    >
                                        <div className="p-1.5 bg-red-50 group-hover:bg-white rounded-lg transition-colors">
                                            <LogOut size={16} />
                                        </div>
                                        <span>Logout</span>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
