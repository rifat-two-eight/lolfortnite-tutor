"use client";

import Image from "next/image";
import { PlayCircle, BookOpen, Globe } from "lucide-react";

const adminActivities = [
    {
        id: 1,
        image: "/demotutor.png",
        status: "Completed",
        date: "OCT 12, 2023 - 2:30 PM",
        title: "System Maintenance",
        description: "Scheduled database cleanup and indexing completed successfully. All services optimal.",
        category: "System",
        type: "Maintenance"
    },
    {
        id: 2,
        image: "/demotutor.png",
        status: "Active",
        date: "OCT 12, 2023 - 3:30 PM",
        title: "New Teacher Verification",
        description: "Reviewing 15 new teacher applications for subject 'Physics' and 'Mathematics'.",
        category: "Verification",
        type: "Teacher"
    },
    {
        id: 3,
        image: "/demotutor.png",
        status: "Completed",
        date: "OCT 13, 2023 - 2:30 PM",
        title: "Payout Processing",
        description: "Quarterly teacher payout batch #542 processed and verified. Total $15,400.",
        category: "Finance",
        type: "Payout"
    },
    {
        id: 4,
        image: "/demotutor.png",
        status: "Active",
        date: "OCT 13, 2023 - 3:30 PM",
        title: "Dispute Resolution",
        description: "Investigating student refund request for class ID #1293. Communication ongoing.",
        category: "Support",
        type: "Dispute"
    },
];

export default function AdminProfilePage() {
    return (
        <div className="px-4 md:px-8 py-8 space-y-10">
            {/* Profile Header Block */}
            <div className="bg-white border border-blue-100 p-10 flex flex-col items-center text-center space-y-4 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-24 bg-blue-50/50 -z-10" />
                <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-100">
                    <Image src="/authpic.jpg" alt="Super Admin" fill className="object-cover" />
                </div>
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold text-[#0D2451] font-sans">Ibrahim M</h1>
                    <p className="text-gray-400 font-medium font-sans">Super Admin & System Architect</p>
                </div>
                <div className="flex items-center gap-2 text-[#0A47C2] font-bold text-sm bg-blue-50 px-4 py-1.5 rounded-full font-sans">
                    <PlayCircle size={16} fill="currentColor" className="text-white" />
                    <span>Managing 120 Teachers (5,500 Students)</span>
                </div>
            </div>

            {/* Professional Summary */}
            <div className="bg-white border border-gray-100 p-8 shadow-sm space-y-4">
                <h2 className="text-[10px] font-bold uppercase tracking-[2px] text-gray-400 text-center font-sans">Administrative Summary</h2>
                <p className="text-gray-500 text-sm leading-relaxed text-center max-w-4xl mx-auto font-sans">
                    Ibrahim is the lead architect and supervisor of the LolFortnite Tutor platform. With a background in educational technology and systems management, he oversees all administrative operations, ensuring data integrity, financial accuracy, and a seamless experience for both teachers and students. His focus is on scaling the platform while maintaining the highest standards of educational quality and user support.
                </p>
            </div>

            {/* Activities Section */}
            <div className="space-y-6">
                <div className="flex items-center gap-8 border-b border-gray-100">
                    <button className="pb-4 border-b-2 border-[#0A47C2] text-[#0A47C2] font-bold text-sm font-sans tracking-tight">Recent Activities</button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {adminActivities.map((item) => (
                        <div key={item.id} className="bg-white border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                            <div className="relative aspect-5/4 overflow-hidden bg-gray-100 text-gray-500/10 flex items-center justify-center">
                                <Image src={item.image} alt={item.title} fill className="object-cover opacity-80" />
                                <span className={`absolute top-2 right-2 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md font-sans ${
                                    item.status === "Completed" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                                }`}>
                                    {item.status}
                                </span>
                                <div className="absolute bottom-2 left-2 flex gap-1.5">
                                    <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg flex items-center gap-1.5 border border-gray-100">
                                        <BookOpen size={10} className="text-gray-600" />
                                        <span className="text-[9px] font-bold text-gray-700">{item.category}</span>
                                    </div>
                                    <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg flex items-center gap-1.5 border border-gray-100">
                                        <Globe size={10} className="text-gray-600" />
                                        <span className="text-[9px] font-bold text-gray-700">{item.type}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 space-y-3 flex-1 flex flex-col">
                                <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 font-sans">
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                    </svg>
                                    <span>{item.date}</span>
                                </div>

                                <h3 className="text-lg font-bold text-[#0D1C35] font-sans">
                                    {item.title}
                                </h3>

                                <p className="text-gray-400 text-xs leading-relaxed font-sans line-clamp-2 flex-1">
                                    {item.description}
                                </p>

                                <div className="pt-2 mt-auto">
                                    <button className="w-full py-2.5 bg-[#0A47C2] text-white font-bold rounded-none text-xs font-sans hover:bg-[#083a9e] transition-colors flex items-center justify-center gap-2 text-center">
                                        <PlayCircle size={14} fill="currentColor" className="text-white" />
                                        View Details
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
