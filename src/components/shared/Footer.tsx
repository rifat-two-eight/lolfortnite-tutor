"use client";

import { Facebook, Instagram, Linkedin, Twitter, Youtube } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const stats = [
    { value: "6.3k", label: "Students" },
    { value: "26k", label: "Tutors" },
    { value: "99.9%", label: "Sucess Rate" },
];

const footerLinks = {
    HOME: ["What is educate", "How it work", "Benefits", "Client Says"],
    SUPPORT: ["Terms & Condition", "Privacy Policy", "FAQs"],
    CONTACT: [
        { icon: "email", text: "hello@email.com" },
        { icon: "phone", text: "+915678871056" },
        { icon: "location", text: "Dhaka, Bangladesh" },
        { icon: "support", text: "Support" },
    ],
};

const socials = [
    {
        label: "Facebook",
        href: "#",
        icon: <Facebook size={16} />,
    },
    {
        label: "Instagram",
        href: "#",
        icon: <Instagram size={16} />,
    },
    {
        label: "LinkedIn",
        href: "#",
        icon: <Linkedin size={16} />,
    },
    {
        label: "Twitter",
        href: "#",
        icon: <Twitter size={16} />,
    },
    {
        label: "YouTube",
        href: "#",
        icon: <Youtube size={16} />,
    },
];

function ContactIcon({ type }: { type: string }) {
    const cls = "w-3.5 h-3.5 flex-shrink-0";
    if (type === "email") return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
        </svg>
    );
    if (type === "phone") return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1.18h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.73a16 16 0 0 0 6.29 6.29l.92-.92a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
        </svg>
    );
    if (type === "location") return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
        </svg>
    );
    return (
        <svg className={cls} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
    );
}

export default function Footer() {
    return (
        <footer className="w-full bg-[#1E1E1E]">
            {/* CTA Banner */}
            <div className="max-w-7xl mx-auto px-4 md:px-0 py-10 md:py-14 border-b border-white/10">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
                    {/* Left */}
                    <div className="space-y-5">
                        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-sans leading-snug">
                            Start learning with 67.1k <br /> students around the world.
                        </h2>
                        <div className="flex flex-wrap gap-3">
                            <button className="flex items-center gap-2 px-5 py-2.5 bg-[#0A47C2] text-white text-sm font-bold rounded-lg font-sans hover:bg-[#083a9e] transition-all">
                                Browse All Class
                                <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                            </button>
                            <button className="flex items-center gap-2 px-5 py-2.5 border border-white/20 text-white text-sm font-bold rounded-lg font-sans hover:bg-white/5 transition-all">
                                Browse All Tutor
                            </button>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex gap-8 sm:gap-12">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center">
                                <p className="text-2xl sm:text-3xl font-extrabold text-white font-sans">{stat.value}</p>
                                <p className="text-gray-400 text-xs sm:text-sm font-sans mt-0.5">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer Links */}
            <div className="max-w-7xl mx-auto px-4 md:px-0 py-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8">
                {/* Brand */}
                <div className="col-span-2 sm:col-span-3 lg:col-span-1 space-y-4">
                    <div className="flex items-center gap-2">
                        <Image src="/logo1.svg" alt="Logo" width={160} height={160} />
                    </div>
                    <p className="text-gray-400 text-xs leading-relaxed font-sans max-w-[180px]">
                        Aliquam rhoncus ligula est, non pulvinar elit convallis nec. Donec mattis odio ut.
                    </p>
                    {/* Socials */}
                    <div className="flex gap-2 flex-wrap">
                        {socials.map((s) => (
                            <Link
                                key={s.label}
                                href={s.href}
                                aria-label={s.label}
                                className="w-8 h-8 bg-[#0A47C2] flex items-center justify-center text-white hover:bg-[#0A47C2] hover:text-white transition-all"
                            >
                                {s.icon}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Home Links */}
                <div className="space-y-3">
                    <p className="text-white text-xs font-bold tracking-widest uppercase font-sans">Home</p>
                    <ul className="space-y-2.5">
                        {footerLinks.HOME.map((item) => (
                            <li key={item}>
                                <Link href="#" className="text-gray-400 text-xs hover:text-white transition-all font-sans">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Support Links */}
                <div className="space-y-3">
                    <p className="text-white text-xs font-bold tracking-widest uppercase font-sans">Support</p>
                    <ul className="space-y-2.5">
                        {footerLinks.SUPPORT.map((item) => (
                            <li key={item}>
                                <Link href="#" className="text-gray-400 text-xs hover:text-white transition-all font-sans">
                                    {item}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Contact */}
                <div className="space-y-3">
                    <p className="text-white text-xs font-bold tracking-widest uppercase font-sans">Contact</p>
                    <ul className="space-y-2.5">
                        {footerLinks.CONTACT.map((item) => (
                            <li key={item.text} className="flex items-center gap-2 text-gray-400 text-xs font-sans">
                                <ContactIcon type={item.icon} />
                                {item.text}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* App Download */}
                <div className="space-y-3">
                    <p className="text-white text-xs font-bold tracking-widest uppercase font-sans">Download Our App</p>
                    <div className="flex flex-col gap-2.5">
                        {/* App Store */}
                        <Link href="#" className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 transition-all w-40 px-3 py-2.5">
                            <Image src="/apple.svg" alt="Apple" width={18} height={18} />
                            <div>
                                <p className="text-gray-400 text-[9px] font-sans leading-none">Download on the</p>
                                <p className="text-white text-xs font-bold font-sans">App Store</p>
                            </div>
                        </Link>
                        {/* Play Store */}
                        <Link href="#" className="flex items-center gap-2.5 bg-white/10 hover:bg-white/15 transition-all w-40 px-3 py-2.5">
                            <Image src="/play.svg" alt="Play" width={18} height={18} />
                            <div>
                                <p className="text-gray-400 text-[9px] font-sans leading-none">Get it on</p>
                                <p className="text-white text-xs font-bold font-sans">Play Store</p>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-white/10 py-4 text-center">
                <p className="text-gray-500 text-xs font-sans">
                    © {new Date().getFullYear()} - Educate. All rights reserved.
                </p>
            </div>
        </footer>
    );
}