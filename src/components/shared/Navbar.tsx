"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, User, LogOut, Home, LayoutDashboard } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState as useMountedState } from "react";
import { getImageUrl } from "@/lib/utils";
import api from "@/lib/axios";

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const user = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const logout = useAuthStore((state) => state.logout);
    const [mounted, setMounted] = useMountedState(false);

    // To prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
        // Fetch fresh user data on mount to ensure sync across the platform
        api.get("/auth/me").then((res) => {
            if (res.data.success) {
                setUser(res.data.data);
            }
        });
    }, [setUser]);

    const profileImageUrl = getImageUrl(user?.profileImage) || "/demotutor.png";

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Classes", href: "/classes" },
        { name: "Tutors", href: "/tutors" },
    ];


    const isActive = (href: string) => {
        if (href === "/" && pathname === "/") return true;
        if (href === "/tutors") return pathname === "/tutors";
        if (href !== "/" && pathname.startsWith(href)) return true;
        return false;
    };

    return (
        <nav className="flex items-center justify-between px-4 sm:px-8 md:px-16 mt-0 md:-mt-10 mx-auto w-full relative">
            {/* Logo */}
            <Link href="/">
                <Image src="/logo.svg" alt="Educate Logo" width={140} height={140} className="md:w-[180px] md:h-[180px]" />
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={cn(
                            "px-6 py-2 rounded-md font-bold transition-all duration-200",
                            isActive(link.href)
                                ? "bg-[#0A47C2] text-white"
                                : "text-[#0A47C2] hover:bg-gray-50"
                        )}
                    >
                        {link.name}
                    </Link>
                ))}
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-4">
                <Link href="/messages" className="p-2 text-[#0A47C2] hover:bg-blue-50 rounded-full transition-all">
                    <MessageSquare size={22} />
                </Link>

                {mounted && user ? (
                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                            className="flex items-center gap-2 group focus:outline-none"
                        >
                            <div className="relative w-11 h-11 ring-2 ring-primary/20 rounded-full overflow-hidden transition-all group-hover:ring-primary/50 shadow-md">
                                <Image
                                    src={profileImageUrl}
                                    alt={user.name}
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            </div>

                        </button>

                        {/* Dropdown Menu */}
                        {showProfileDropdown && (
                            <>
                                <div
                                    className="fixed inset-0 z-40"
                                    onClick={() => setShowProfileDropdown(false)}
                                />
                                <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
                                    <div className="px-4 py-3 border-b border-gray-50 bg-blue-50/30">
                                        <p className="text-xs font-medium text-gray-500">Currently logged in as</p>
                                        <p className="text-sm font-bold text-[#0A47C2] truncate">{user.name}</p>
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
                                            href={user.role === "TEACHER" ? "/teacher" : (user.role === "STUDENT" ? "/student/dashboard" : "/web-admin")}
                                            onClick={() => setShowProfileDropdown(false)}
                                            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-600 hover:bg-blue-50 hover:text-[#0A47C2] rounded-xl transition-all group"
                                        >
                                            <div className="p-1.5 bg-gray-50 group-hover:bg-white rounded-lg transition-colors">
                                                <LayoutDashboard size={16} />
                                            </div>
                                            <span>Dashboard</span>
                                        </Link>
                                        <Link
                                            href={user.role === "TEACHER" ? "/teacher/profile" : (user.role === "STUDENT" ? "/student/profile" : "/web-admin/profile")}
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
                                                setShowProfileDropdown(false);
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                        >
                                            <div className="p-1.5 bg-red-50 group-hover:bg-white rounded-lg transition-colors">
                                                <LogOut size={16} />
                                            </div>
                                            <span className="font-medium">Logout</span>
                                        </button>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <Link
                            href="/auth"
                            className="px-8 py-2 border border-[#0A47C2] text-[#0A47C2] font-bold rounded-lg hover:bg-gray-50 transition-all font-sans"
                        >
                            Log In
                        </Link>
                        <Link
                            href="/auth"
                            className="px-8 py-2 bg-[#0A47C2] text-white font-bold rounded-lg hover:bg-[#083a9e] transition-all font-sans"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>

            {/* Hamburger Button - Mobile/Tablet */}
            <button
                className="md:hidden flex flex-col justify-center items-center gap-[5px] w-8 h-8"
                onClick={() => setMenuOpen(!menuOpen)}
                aria-label="Toggle menu"
            >
                <span className={cn("block w-6 h-0.5 bg-[#0A47C2] transition-all duration-300", menuOpen && "rotate-45 translate-y-[7px]")} />
                <span className={cn("block w-6 h-0.5 bg-[#0A47C2] transition-all duration-300", menuOpen && "opacity-0")} />
                <span className={cn("block w-6 h-0.5 bg-[#0A47C2] transition-all duration-300", menuOpen && "-rotate-45 -translate-y-[7px]")} />
            </button>

            {/* Mobile Dropdown Menu */}
            {menuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-gray-100 z-50 px-4 py-4 flex flex-col gap-3">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setMenuOpen(false)}
                            className={cn(
                                "w-full text-left px-4 py-2.5 rounded-md font-bold transition-all duration-200",
                                isActive(link.href)
                                    ? "bg-[#0A47C2] text-white"
                                    : "text-[#0A47C2] hover:bg-gray-50"
                            )}
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
                        {mounted && user ? (
                            <div className="flex flex-col gap-2 p-2 bg-blue-50 rounded-2xl">
                                <div className="flex items-center justify-between px-2 py-1">
                                    <div className="flex items-center gap-3">
                                        <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20 bg-white">
                                            <Image
                                                src={profileImageUrl}
                                                alt={user.name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="font-bold text-[#0A47C2] text-sm leading-tight">{user.name}</span>
                                            <span className="text-[10px] text-gray-500">{user.role}</span>
                                        </div>
                                    </div>
                                    <button onClick={() => { logout(); setMenuOpen(false); }} className="text-red-500 p-2 hover:bg-red-50 rounded-full transition-colors">
                                        <LogOut size={20} />
                                    </button>
                                </div>
                                <div className="grid grid-cols-2 gap-2 pt-1">
                                    <Link
                                        href={user.role === "TEACHER" ? "/teacher" : (user.role === "STUDENT" ? "/student/dashboard" : "/web-admin")}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 py-2 bg-white rounded-xl text-xs font-bold text-[#0A47C2] border border-blue-100"
                                    >
                                        <LayoutDashboard size={14} />
                                        Dashboard
                                    </Link>
                                    <Link
                                        href={user.role === "TEACHER" ? "/teacher/profile" : (user.role === "STUDENT" ? "/student/profile" : "/web-admin/profile")}
                                        onClick={() => setMenuOpen(false)}
                                        className="flex items-center justify-center gap-2 py-2 bg-white rounded-xl text-xs font-bold text-[#0A47C2] border border-blue-100"
                                    >
                                        <User size={14} />
                                        Profile
                                    </Link>
                                </div>
                            </div>
                        ) : (
                            <>
                                <Link
                                    href="/auth"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-center px-8 py-2.5 border border-[#0A47C2] text-[#0A47C2] font-bold rounded-lg hover:bg-gray-50 transition-all font-sans"
                                >
                                    Log In
                                </Link>
                                <Link
                                    href="/auth"
                                    onClick={() => setMenuOpen(false)}
                                    className="w-full text-center px-8 py-2.5 bg-[#0A47C2] text-white font-bold rounded-lg hover:bg-[#083a9e] transition-all font-sans"
                                >
                                    Sign Up
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}