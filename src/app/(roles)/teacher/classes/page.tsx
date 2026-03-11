"use client";

import React from "react";
import Image from "next/image";
import { PlayCircle, BookOpen, Globe, MoreVertical, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";

const classSections = [
    {
        title: "Upcoming Class",
        items: [
            { id: 1, image: "/demotutor.png", status: "Active", date: "OCT 12, 2023 - 2:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 2, image: "/demotutor.png", status: "Active", date: "OCT 12, 2023 - 3:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 3, image: "/demotutor.png", status: "Active", date: "OCT 13, 2023 - 2:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 10, image: "/demotutor.png", status: "Active", date: "OCT 13, 2023 - 4:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
        ]
    },
    {
        title: "Group Listing",
        items: [
            { id: 4, image: "/demotutor.png", status: "Active", date: "OCT 14, 2023 - 2:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 5, image: "/demotutor.png", status: "Active", date: "OCT 14, 2023 - 3:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 6, image: "/demotutor.png", status: "Active", date: "OCT 15, 2023 - 2:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 11, image: "/demotutor.png", status: "Active", date: "OCT 15, 2023 - 4:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
        ]
    },
    {
        title: "One to One",
        items: [
            { id: 7, image: "/demotutor.png", status: "Active", date: "OCT 16, 2023 - 2:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 8, image: "/demotutor.png", status: "Active", date: "OCT 16, 2023 - 3:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 9, image: "/demotutor.png", status: "Active", date: "OCT 17, 2023 - 2:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
            { id: 12, image: "/demotutor.png", status: "Active", date: "OCT 17, 2023 - 4:30 PM", tutor: "Nohan.T", description: "Experienced mathematics tutor specializing in GCSE. 8 years of teaching experience.", subjects: ["Mathematic", "British"] },
        ]
    }
];

export default function MyClassPage() {
    const [openMenuId, setOpenMenuId] = React.useState<number | null>(null);

    const toggleMenu = (id: number) => {
        setOpenMenuId(openMenuId === id ? null : id);
    };

    const handleEdit = (id: number) => {
        toast.info(`Editing class ${id}`);
        setOpenMenuId(null);
    };

    const handleDelete = (id: number) => {
        toast.error(`Class ${id} deleted`);
        setOpenMenuId(null);
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-12">
            {classSections.map((section) => (
                <div key={section.title} className="space-y-6">
                    <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                        <h2 className="text-xl font-bold text-[#0D1C35] font-sans">{section.title}</h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {section.items.map((item) => (
                            <div key={item.id} className="bg-white border border-gray-100 overflow-visible shadow-sm hover:shadow-md transition-shadow group flex flex-col relative">
                                <div className="relative aspect-5/4 overflow-hidden bg-gray-100">
                                    <Image src={item.image} alt={item.tutor} fill className="object-cover" />
                                    <span className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[10px] font-bold px-2 py-1 rounded-md text-emerald-600 font-sans">
                                        {item.status}
                                    </span>
                                    <div className="absolute bottom-2 left-2 flex gap-1.5">
                                        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg flex items-center gap-1.5 border border-gray-100">
                                            <BookOpen size={10} className="text-gray-600" />
                                            <span className="text-[9px] font-bold text-gray-700">Mathematic</span>
                                        </div>
                                        <div className="bg-white/90 backdrop-blur-sm p-1.5 rounded-lg flex items-center gap-1.5 border border-gray-100">
                                            <Globe size={10} className="text-gray-600" />
                                            <span className="text-[9px] font-bold text-gray-700">British</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 space-y-3 relative">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500 font-sans">
                                            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                                            </svg>
                                            <span>{item.date}</span>
                                        </div>
                                        
                                        {/* 3-Dot Menu */}
                                        <div className="relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    toggleMenu(item.id);
                                                }}
                                                className="p-1 text-gray-400 hover:text-[#0A47C2] transition-colors rounded-none"
                                            >
                                                <MoreVertical size={18} />
                                            </button>

                                            {openMenuId === item.id && (
                                                <>
                                                    <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                                    <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 shadow-xl z-20 py-1 transition-all">
                                                        <button 
                                                            onClick={() => handleEdit(item.id)}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-[#0A47C2] transition-colors text-left"
                                                        >
                                                            <Edit2 size={14} />
                                                            Edit Class
                                                        </button>
                                                        <button 
                                                            onClick={() => handleDelete(item.id)}
                                                            className="w-full flex items-center gap-2 px-4 py-2 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors text-left"
                                                        >
                                                            <Trash2 size={14} />
                                                            Delete Class
                                                        </button>
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    <h3 className="text-lg font-bold text-[#0D1C35] font-sans">
                                        {item.tutor}
                                    </h3>

                                    <p className="text-gray-400 text-xs leading-relaxed font-sans line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="pt-2">
                                        <button className="w-full py-2.5 bg-[#0A47C2] text-white font-bold rounded-none text-xs font-sans hover:bg-[#083a9e] transition-colors flex items-center justify-center gap-2 text-center">
                                            <PlayCircle size={14} fill="currentColor" className="text-white" />
                                            View Recording
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
