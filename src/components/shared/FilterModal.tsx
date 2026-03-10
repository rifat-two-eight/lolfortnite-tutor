"use client";

import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FilterSectionProps {
    title: string;
    options: string[];
    selectedOptions: string[];
    onToggle: (option: string) => void;
}

function FilterSection({ title, options, selectedOptions, onToggle }: FilterSectionProps) {
    return (
        <div className="space-y-3">
            <h4 className="text-sm font-bold text-[#0D1C35] font-sans">{title}</h4>
            <div className="space-y-2">
                {options.map((option) => (
                    <label key={option} className="flex items-center gap-3 cursor-pointer group">
                        <div className="relative flex items-center justify-center">
                            <input
                                type="checkbox"
                                className="peer appearance-none w-5 h-5 border-2 border-[#0A47C2] rounded-md checked:bg-[#0A47C2] transition-all"
                                checked={selectedOptions.includes(option)}
                                onChange={() => onToggle(option)}
                            />
                            <svg
                                className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                viewBox="0 0 24 24"
                            >
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <span className={cn(
                            "text-sm font-medium transition-colors font-sans",
                            selectedOptions.includes(option) ? "text-[#0D1C35]" : "text-gray-500 group-hover:text-gray-700"
                        )}>
                            {option}
                        </span>
                    </label>
                ))}
            </div>
        </div>
    );
}

export default function FilterModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    // State for each section
    const [selectedFilters, setSelectedFilters] = useState<Record<string, string[]>>({
        "Subject": [],
        "Session / Set": [],
        "Curriculum": [],
        "Teacher Gender": [],
        "Class language": [],
    });

    const [priceRange, setPriceRange] = useState({ min: "", max: "" });

    if (!isOpen) return null;

    const sections = [
        {
            title: "Subject",
            options: ["Math", "Physics", "IELTS", "English"],
        },
        {
            title: "Session / Set",
            options: ["Beginner", "Intermediate", "Advanced"],
        },
        {
            title: "Curriculum",
            options: ["British", "American", "GCSE", "AP", "IB", "IELTS"],
        },
        {
            title: "Teacher Gender",
            options: ["Female", "Male"],
        },
        {
            title: "Class language",
            options: ["English", "Arabic"],
        },
    ];

    const toggleOption = (sectionTitle: string, option: string) => {
        setSelectedFilters(prev => {
            const current = prev[sectionTitle] || [];
            const updated = current.includes(option)
                ? current.filter(item => item !== option)
                : [...current, option];
            return { ...prev, [sectionTitle]: updated };
        });
    };

    const handleReset = () => {
        setSelectedFilters({
            "Subject": [],
            "Session / Set": [],
            "Curriculum": [],
            "Teacher Gender": [],
            "Class language": [],
        });
        setPriceRange({ min: "", max: "" });
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-end md:pr-16 md:py-16">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-sm h-full md:h-[90vh] bg-white rounded-l-2xl md:rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-300">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <h3 className="text-xl font-extrabold text-[#0D1C35] font-sans">Filters</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-400">
                        <X size={20} />
                    </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">
                    {sections.map((section) => (
                        <FilterSection
                            key={section.title}
                            title={section.title}
                            options={section.options}
                            selectedOptions={selectedFilters[section.title] || []}
                            onToggle={(option) => toggleOption(section.title, option)}
                        />
                    ))}

                    {/* Price Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-[#0D1C35] font-sans">Price</h4>
                        <div className="flex items-center gap-3">
                            <input
                                type="text"
                                value={priceRange.min}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, min: e.target.value }))}
                                placeholder="Min"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A47C2] text-sm font-sans"
                            />
                            <span className="text-gray-400">-</span>
                            <input
                                type="text"
                                value={priceRange.max}
                                onChange={(e) => setPriceRange(prev => ({ ...prev, max: e.target.value }))}
                                placeholder="Max"
                                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#0A47C2] text-sm font-sans"
                            />
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                    <button
                        onClick={handleReset}
                        className="w-full py-3 bg-[#EB434E] text-white font-bold rounded-xl text-sm font-sans hover:bg-[#d03b44] transition-colors"
                    >
                        Reset
                    </button>
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-[#0A47C2] text-white font-bold rounded-xl text-sm font-sans hover:bg-[#083a9e] transition-colors shadow-lg"
                    >
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
}
