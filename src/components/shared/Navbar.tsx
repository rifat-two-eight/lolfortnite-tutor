"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

export default function Navbar() {
    const [activeLink, setActiveLink] = useState("Home");
    const [menuOpen, setMenuOpen] = useState(false);

    const navLinks = ["Home", "Classes", "Tutors"];

    return (
        <nav className="flex items-center justify-between px-4 sm:px-8 md:px-16 mt-0 md:-mt-10 mx-auto w-full relative">
            {/* Logo */}
            <Link href="/">
                <Image src="/logo.svg" alt="Educate Logo" width={140} height={140} className="md:w-[180px] md:h-[180px]" />
            </Link>

            {/* Nav Links - Desktop */}
            <div className="hidden md:flex items-center gap-8">
                {navLinks.map((link) => (
                    <button
                        key={link}
                        onClick={() => setActiveLink(link)}
                        className={cn(
                            "px-6 py-2 rounded-md font-bold transition-all duration-200",
                            activeLink === link
                                ? "bg-[#0A47C2] text-white"
                                : "text-[#0A47C2] hover:bg-gray-50"
                        )}
                    >
                        {link}
                    </button>
                ))}
            </div>

            {/* Auth Buttons - Desktop */}
            <div className="hidden md:flex items-center gap-4">
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
                        <button
                            key={link}
                            onClick={() => { setActiveLink(link); setMenuOpen(false); }}
                            className={cn(
                                "w-full text-left px-4 py-2.5 rounded-md font-bold transition-all duration-200",
                                activeLink === link
                                    ? "bg-[#0A47C2] text-white"
                                    : "text-[#0A47C2] hover:bg-gray-50"
                            )}
                        >
                            {link}
                        </button>
                    ))}
                    <div className="flex flex-col gap-3 pt-2 border-t border-gray-100">
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
                    </div>
                </div>
            )}
        </nav>
    );
}