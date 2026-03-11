"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, Upload, X } from "lucide-react";
import Image from "next/image";

export default function CreateClassPage() {
    const router = useRouter();
    const [imagePreview, setImagePreview] = React.useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Class has been submitted for review!", {
            description: "We'll notify you once it's approved.",
        });
        // Optional: router.push("/teacher");
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-10">
            <form onSubmit={handleSubmit} className="bg-white shadow-[0_4px_20px_rgba(0,0,0,0.03)] border border-gray-50 p-8 space-y-10">
                <div className="border-b border-gray-100 pb-4">
                    <h1 className="text-xl font-bold text-[#0D1C35] font-sans">Basic Information</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    {/* Subject */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Subject</label>
                        <div className="relative">
                            <select className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm text-gray-400 font-sans focus:outline-none focus:border-[#0A47C2] appearance-none cursor-pointer">
                                <option>Your class subject</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Session / Set */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Session / Set</label>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Intermediate" 
                                className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-sans">0/120</span>
                        </div>
                    </div>

                    {/* Class Language */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Class Language</label>
                        <div className="relative">
                            <select className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm text-gray-300 font-sans focus:outline-none focus:border-[#0A47C2] appearance-none cursor-pointer">
                                <option>Select...</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Curriculum */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Curriculum</label>
                        <div className="relative">
                            <select className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm text-gray-300 font-sans focus:outline-none focus:border-[#0A47C2] appearance-none cursor-pointer">
                                <option>Select...</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Class Price */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Class Price</label>
                        <input 
                            type="text" 
                            placeholder="$765" 
                            className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                        />
                    </div>

                    {/* Tutor Gender */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Tutor Gender</label>
                        <div className="relative">
                            <select className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm text-gray-300 font-sans focus:outline-none focus:border-[#0A47C2] appearance-none cursor-pointer">
                                <option>Select...</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>

                    {/* Maximum Student */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Maximum student</label>
                        <input 
                            type="text" 
                            placeholder="Maximum a student" 
                            className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                        />
                    </div>

                    {/* Whatsapp Group Link */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Whatsapp group link</label>
                        <input 
                            type="text" 
                            placeholder="Past link here" 
                            className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                        />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Description</label>
                        <textarea 
                            placeholder="Demo description" 
                            rows={3}
                            className="w-full bg-white border border-gray-100 px-4 py-3 text-sm font-sans focus:outline-none focus:border-[#0A47C2] resize-none"
                        />
                    </div>

                    {/* YouTube Video Link */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">YouTube Video Link</label>
                        <input 
                            type="text" 
                            placeholder="Past link here" 
                            className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                        />
                    </div>

                    {/* Group / One to one class */}
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Group / One to one class</label>
                        <div className="relative">
                            <select className="w-full h-12 bg-white border border-gray-100 px-4 py-2 text-sm text-gray-300 font-sans focus:outline-none focus:border-[#0A47C2] appearance-none cursor-pointer">
                                <option>Select...</option>
                            </select>
                            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                        </div>
                    </div>
                </div>

                {/* Course Thumbnail */}
                <div className="space-y-6 flex flex-col items-center">
                    <h3 className="text-sm font-bold text-[#0D1C35] font-sans w-full text-center">Course Thumbnail</h3>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 w-full">
                        <div className="w-full md:w-64 aspect-12/8 bg-gray-50 flex items-center justify-center border border-gray-100 relative group overflow-hidden">
                            {imagePreview ? (
                                <>
                                    <Image src={imagePreview} alt="Preview" fill className="object-cover" />
                                    <button 
                                        type="button"
                                        onClick={() => setImagePreview(null)}
                                        className="absolute top-2 right-2 bg-white/80 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={16} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col items-center gap-2 text-gray-300">
                                    <Image src="/upload-placeholder.svg" alt="Placeholder" width={64} height={64} className="opacity-10" />
                                </div>
                            )}
                        </div>

                        <div className="flex-1 space-y-4 text-center md:text-left">
                            <p className="text-[11px] leading-relaxed text-gray-400 font-sans max-w-sm">
                                <span className="text-[#0A47C2] cursor-pointer hover:underline font-bold">Upload your course Thumbnail here.</span> Important guidelines: <span className="text-[#0A47C2] font-semibold">1200x800 pixels or 12:8 Ratio.</span> <br />
                                <span className="font-bold">Supported format:</span> .jpg, .jpeg, or .png
                            </p>
                            
                            <label className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0A47C2] text-white font-bold text-xs font-sans cursor-pointer hover:bg-[#083a9e] transition-colors">
                                <Upload size={16} />
                                Upload Image
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setImagePreview(URL.createObjectURL(file));
                                }} />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <button 
                        type="button"
                        onClick={() => router.push("/teacher")}
                        className="px-8 py-3 bg-white border border-gray-100 text-[#0A47C2] font-bold text-xs font-sans hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        type="submit"
                        className="px-8 py-3 bg-[#0A47C2] text-white font-bold text-xs font-sans hover:bg-[#083a9e] transition-colors"
                    >
                        Submit For Review
                    </button>
                </div>
            </form>
        </div>
    );
}
