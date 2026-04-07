"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { MessageSquare, User, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect, useState as useMountedState } from "react";

export default function Navbar() {
    const pathname = usePathname();
    const [menuOpen, setMenuOpen] = useState(false);
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const { user, logout } = useAuthStore();
    const [mounted, setMounted] = useMountedState(false);

    // To prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "").replace(/\/$/, "");
    const profileImageUrl = user?.profileImage
        ? (user.profileImage.startsWith("http") ? user.profileImage : `${baseUrl}${user.profileImage}`)
        : "/demotutor.png";

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

                                    <Link
                                        href="/profile"
                                        onClick={() => setShowProfileDropdown(false)}
                                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 transition-colors group"
                                    >
                                        <User size={18} className="text-primary group-hover:scale-110 transition-transform" />
                                        <span>My Profile</span>
                                    </Link>

                                    <Link
                                        href="/messages"
                                        onClick={() => setShowProfileDropdown(false)}
                                        className="flex md:hidden items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-primary/5 transition-colors group"
                                    >
                                        <MessageSquare size={18} className="text-primary group-hover:scale-110 transition-transform" />
                                        <span>Messages</span>
                                    </Link>

                                    <button
                                        onClick={() => {
                                            logout();
                                            setShowProfileDropdown(false);
                                        }}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors group"
                                    >
                                        <LogOut size={18} className="group-hover:translate-x-1 transition-transform" />
                                        <span className="font-medium">Logout</span>
                                    </button>
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
                            <div className="flex items-center justify-between px-4 py-2 bg-blue-50 rounded-xl">
                                <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
                                    <div className="relative w-10 h-10 rounded-full overflow-hidden border border-primary/20">
                                        <Image
                                            src={profileImageUrl}
                                            alt={user.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <span className="font-bold text-[#0A47C2]">{user.name}</span>
                                </Link>
                                <button onClick={() => { logout(); setMenuOpen(false); }} className="text-red-500 p-2">
                                    <LogOut size={20} />
                                </button>
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