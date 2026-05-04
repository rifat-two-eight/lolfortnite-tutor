"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
    PlayCircle,
    BookOpen,
    Globe,
    MoreVertical,
    Edit2,
    Trash2,
    Plus,
    Search,
    X,
    Upload,
    Video,
    MessageCircle,
    Users as UsersIcon,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Loader2,
    ShieldCheck,
    Star
} from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";


// --- Types ---
interface ClassData {
    _id: string;
    subject: string;
    level: string;
    language: string;
    curriculum: string;
    price: number;
    tutorGender: string;
    maxStudents: number;
    classType: string;
    description: string;
    youtubeVideoLink?: string;
    whatsappGroupLink?: string;
    images: string[];
    createdAt?: string;
    status: string;
    runningStatus: string;
    averageRating: number;
    ratingCount: number;
    createdBy?: {
        name: string;
        profileImage: string;
    };
}

interface PaginationMeta {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
}

// --- Helper for Image  ---
const getImageUrl = (path: string) => {
    if (!path) return "/democourse.png";
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
};

// --- Helper Icons (Shared with Homepage) ---
function StarIcon() {
    return (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="#F59E0B" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 1L7.545 4.13L11 4.635L8.5 7.07L9.09 10.5L6 8.875L2.91 10.5L3.5 7.07L1 4.635L4.455 4.13L6 1Z" />
        </svg>
    );
}

function CertIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="8" r="6" />
            <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11" />
        </svg>
    );
}

function UserIcon() {
    return (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
        </svg>
    );
}

export default function MyClassPage() {
    const [classes, setClasses] = useState<ClassData[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [openMenuId, setOpenMenuId] = useState<string | null>(null);
    const [popoverPosition, setPopoverPosition] = useState({ top: 0, left: 0 });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
    const [statusFilter, setStatusFilter] = useState("All");

    // Fetch Classes
    const fetchClasses = useCallback(async (currentPage: number, status: string) => {
        setLoading(true);
        try {
            const statusQuery = status !== "All" ? `&status=${status}` : "";
            const response = await api.get(`/classes/my-classes?page=${currentPage}&limit=8${statusQuery}`);
            if (response.data.success) {
                setClasses(response.data.data);
                if (response.data.meta) {
                    setTotalPages(response.data.meta.totalPages);
                }
            }
        } catch (error) {
            console.error("Error fetching classes:", error);
            toast.error("Failed to load classes");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchClasses(page, statusFilter);
    }, [page, statusFilter, fetchClasses]);

    // Close menu on scroll
    useEffect(() => {
        const handleScroll = () => {
            if (openMenuId) {
                setOpenMenuId(null);
            }
        };

        window.addEventListener("scroll", handleScroll, true);
        return () => window.removeEventListener("scroll", handleScroll, true);
    }, [openMenuId]);

    const handleFilterChange = (newStatus: string) => {
        setStatusFilter(newStatus);
        setPage(1);
    };

    const handleCreateSuccess = () => {
        setShowCreateModal(false);
        setPage(1);
        fetchClasses(1, "All");
        setStatusFilter("All");
    };

    const handleDelete = async (id: string) => {
        setOpenMenuId(null);

        try {
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this class deletion!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#3085d6",
                confirmButtonText: "Yes, delete it!"
            });

            if (result.isConfirmed) {
                const response = await api.delete(`/classes/${id}`);
                if (response.data.success) {
                    Swal.fire(
                        "Deleted!",
                        "Your class has been deleted.",
                        "success"
                    );
                    fetchClasses(page, statusFilter);
                }
            }
        } catch (error) {
            Swal.fire(
                "Error!",
                "Failed to delete the class.",
                "error"
            );
        }
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 min-h-screen bg-[#F9FAFB]">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0D1C35] font-sans">My Classes</h1>
                    <p className="text-sm text-gray-500 font-sans">Manage and create your academic sessions</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative">
                        <select
                            value={statusFilter}
                            onChange={(e) => handleFilterChange(e.target.value)}
                            className="bg-white border border-gray-200 text-[#0D1C35] text-sm font-bold py-3 pl-4 pr-10 rounded-none focus:outline-none focus:border-[#0A47C2] appearance-none transition-all shadow-sm"
                        >
                            <option value="All">All Statuses</option>
                            <option value="PENDING">Pending</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0A47C2] text-white font-semibold rounded-none text-sm font-sans hover:bg-[#083a9e] transition-all shadow-lg shadow-blue-100"
                    >
                        <Plus size={18} />
                        Create New Class
                    </button>
                </div>
            </div>

            {/* Grid display */}
            {loading ? (
                <div className="flex flex-col items-center justify-center h-96 space-y-4">
                    <Loader2 className="w-10 h-10 text-[#0A47C2] animate-spin" />
                    <p className="text-gray-400 font-medium animate-pulse">Loading classes...</p>
                </div>
            ) : classes.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {classes.map((cls) => (
                            <div
                                key={cls._id}
                                className="bg-white rounded-none border border-gray-100 overflow-hidden flex flex-col hover:shadow-xl transition-all duration-300 group relative"
                            >
                                {/* Image Area */}
                                <div className="relative w-full aspect-video overflow-hidden">
                                    <Image
                                        src={getImageUrl(cls.images?.[0])}
                                        alt={cls.subject}
                                        fill
                                        unoptimized
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />

                                    {/* Status Badge (Top Left) */}
                                    <div className={cn(
                                        "absolute top-3 left-3 px-3 py-1 text-[10px] font-medium font-sans uppercase tracking-wider text-white",
                                        cls.status === "APPROVED" ? "bg-emerald-500" :
                                            cls.status === "PENDING" ? "bg-amber-500" :
                                                cls.status === "REJECTED" ? "bg-red-500" : "bg-gray-500"
                                    )}>
                                        {cls.status}
                                    </div>

                                    {/* Rating (Top Right) */}
                                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white rounded-none px-2.5 py-1 text-[10px] font-medium text-[#0D1C35] font-sans shadow-sm">
                                        <StarIcon />
                                        <span>{cls.averageRating || 0}</span>
                                        <span className="text-gray-400 font-normal">({cls.ratingCount || 0})</span>
                                    </div>

                                    {/* Actions Menu (More Button) */}
                                    <div className="absolute bottom-3 right-3 z-20">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                const rect = e.currentTarget.getBoundingClientRect();
                                                setPopoverPosition({ top: rect.top, left: rect.left });
                                                setOpenMenuId(openMenuId === cls._id ? null : cls._id);
                                            }}
                                            className="w-8 h-8 flex items-center justify-center bg-white/90 backdrop-blur-md text-[#0D1C35] hover:text-[#0A47C2] transition-colors rounded-none shadow-sm"
                                        >
                                            <MoreVertical size={16} />
                                        </button>

                                        {openMenuId === cls._id && (
                                            <div
                                                style={{
                                                    position: 'fixed',
                                                    top: `${popoverPosition.top - 85}px`, // Opening above the button
                                                    left: `${popoverPosition.left - 150}px`,
                                                    zIndex: 9999
                                                }}
                                                className="w-44 bg-white border border-gray-100 shadow-2xl rounded-none py-2 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200"
                                            >
                                                <button
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-gray-700 hover:bg-blue-50 hover:text-[#0A47C2] transition-colors"
                                                    onClick={() => {
                                                        setSelectedClass(cls);
                                                        setShowDetailModal(true);
                                                        setOpenMenuId(null);
                                                    }}
                                                >
                                                    <BookOpen size={16} />
                                                    View Details
                                                </button>
                                                <button
                                                    className="w-full flex items-center gap-3 px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors"
                                                    onClick={() => handleDelete(cls._id)}
                                                >
                                                    <Trash2 size={16} />
                                                    Delete Class
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Card Body */}
                                <div className="p-5 flex flex-col gap-4 flex-1">
                                    {/* Badge Metadata */}
                                    <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#0A47C2] font-sans">
                                        {cls.level} • {cls.curriculum}
                                    </p>

                                    {/* Subject Title */}
                                    <h3
                                        className="text-lg font-semibold text-[#0D1C35] font-sans leading-tight line-clamp-1 cursor-pointer hover:text-[#0A47C2] transition-colors"
                                        onClick={() => {
                                            setSelectedClass(cls);
                                            setShowDetailModal(true);
                                        }}
                                    >
                                        {cls.subject}
                                    </h3>

                                    {/* Icons Row */}
                                    <div className="flex items-center gap-4 text-[11px] text-gray-400 font-sans font-medium">
                                        <span className="flex items-center gap-1.5">
                                            <UserIcon /> {cls.classType === "GROUP" ? "Group Class" : "1-on-1"}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <CertIcon /> {cls.language}
                                        </span>
                                        <span className="flex items-center gap-1.5 ml-auto text-[#0A47C2] font-semibold italic">
                                            {cls.price} KD
                                        </span>
                                    </div>

                                    {/* Divider */}
                                    <div className="w-full h-px border-t border-gray-100" />

                                    {/* CTA Section */}
                                    <div className="flex items-center gap-3 mt-auto">
                                        <button
                                            onClick={() => {
                                                setSelectedClass(cls);
                                                setShowDetailModal(true);
                                            }}
                                            className="flex-1 py-3 bg-[#0A47C2] text-white text-center text-xs font-semibold rounded-none font-sans hover:bg-[#083a9e] transition-all shadow-md shadow-blue-50"
                                        >
                                            View Class Management
                                        </button>

                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center gap-3 pt-10">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-none text-gray-500 hover:bg-blue-50 hover:text-[#0A47C2] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronLeft size={20} />
                            </button>
                            <div className="flex items-center gap-2">
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={cn(
                                            "w-10 h-10 rounded-none font-bold text-sm transition-all shadow-sm border",
                                            page === i + 1
                                                ? "bg-[#0A47C2] text-white border-[#0A47C2]"
                                                : "bg-white text-gray-500 border-gray-200 hover:bg-gray-50"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="w-10 h-10 flex items-center justify-center bg-white border border-gray-200 rounded-none text-gray-500 hover:bg-blue-50 hover:text-[#0A47C2] disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
                            >
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-white rounded-none p-20 flex flex-col items-center justify-center space-y-6 text-center shadow-sm border border-gray-100">
                    <div className="w-24 h-24 bg-blue-50 rounded-none flex items-center justify-center text-[#0A47C2]">
                        <BookOpen size={40} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-[#0D1C35] font-sans">No Classes Found</h3>
                        <p className="text-gray-400 max-w-xs mx-auto mt-2">You haven't created any classes yet. Start teaching by creating your first session.</p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="px-8 py-4 bg-[#0A47C2] text-white font-semibold rounded-none text-sm font-sans hover:bg-[#083a9e] transition-all"
                    >
                        Create My First Class
                    </button>
                </div>
            )}

            {/* Modals */}
            {showCreateModal && (
                <CreateClassModal
                    onClose={() => setShowCreateModal(false)}
                    onSuccess={handleCreateSuccess}
                />
            )}

            {showDetailModal && selectedClass && (
                <ClassDetailModal
                    cls={selectedClass}
                    onClose={() => {
                        setShowDetailModal(false);
                        setSelectedClass(null);
                    }}
                />
            )}
        </div>
    );
}

// --- Create Class Modal ---
function CreateClassModal({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        subject: "",
        level: "",
        language: "",
        curriculum: "",
        price: "",
        tutorGender: "MALE",
        maxStudents: "",
        classType: "GROUP",
        description: "",
        youtubeVideoLink: "",
        whatsappGroupLink: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        
        if (name === "maxStudents") {
            const count = Number(value);
            setFormData(prev => ({
                ...prev,
                maxStudents: value,
                classType: count === 1 ? "ONE_TO_ONE" : count > 1 ? "GROUP" : prev.classType,
                whatsappGroupLink: count === 1 ? "" : prev.whatsappGroupLink
            }));
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const data = new FormData();

        // Object containing all class details as per requirement
        const classDetails = {
            subject: formData.subject,
            level: formData.level,
            language: formData.language,
            curriculum: formData.curriculum,
            price: Number(formData.price),
            tutorGender: formData.tutorGender,
            maxStudents: Number(formData.maxStudents),
            classType: formData.classType,
            description: formData.description,
            youtubeVideoLink: formData.youtubeVideoLink || "",
            whatsappGroupLink: formData.whatsappGroupLink || ""
        };

        // Send the JSON under the 'data' key
        data.append("data", JSON.stringify(classDetails));

        if (image) {
            data.append("images", image);
        }

        try {
            const response = await api.post("/classes", data, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data.success) {
                toast.success("Class created successfully!");
                onSuccess();
            }
        } catch (error: any) {
            console.error("Creation error:", error);
            toast.error(error.response?.data?.message || "Failed to create class");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#0D1C35]/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-none w-full max-w-4xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-300">
                <div className="p-8 space-y-8">
                    {/* Modal Header */}
                    <div className="flex items-center justify-between border-b border-gray-50 pb-6">
                        <div>
                            <h2 className="text-2xl font-semibold text-[#0D1C35] font-sans">Create New Class</h2>
                            <p className="text-gray-400 text-sm">Fill in the details to list a new academic class</p>
                        </div>
                        <button onClick={onClose} className="p-2 text-gray-400 hover:text-[#0A47C2] hover:bg-blue-50 rounded-none transition-all">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Image Upload Area */}
                        <div className="md:col-span-2">
                            <label className="text-sm font-bold text-gray-700 font-sans mb-3 block">Class Cover Image</label>
                            <div
                                onClick={() => document.getElementById("class-image")?.click()}
                                className={cn(
                                    "relative h-56 rounded-none border-2 border-dashed border-gray-100 flex flex-col items-center justify-center cursor-pointer hover:bg-blue-50/50 hover:border-blue-200 transition-all overflow-hidden group",
                                    preview && "border-solid"
                                )}
                            >
                                {preview ? (
                                    <Image src={preview} alt="Preview" fill className="object-cover" />
                                ) : (
                                    <div className="flex flex-col items-center text-gray-300 group-hover:text-[#0A47C2] transition-all">
                                        <Upload size={40} className="mb-2" />
                                        <span className="text-sm font-bold font-sans">Click to upload class image</span>
                                        <span className="text-[10px] mt-1">Recommended: 16:9 aspect ratio</span>
                                    </div>
                                )}
                                <input id="class-image" type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                            </div>
                        </div>

                        {/* Basic Info */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Subject Name</label>
                            <input
                                required name="subject" value={formData.subject} onChange={handleChange}
                                placeholder="e.g. Advanced Physics"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Educational Level</label>
                            <input
                                required name="level" value={formData.level} onChange={handleChange}
                                placeholder="e.g. Grade 12 or Undergraduate"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Instruction Language</label>
                            <input
                                required name="language" value={formData.language} onChange={handleChange}
                                placeholder="e.g. English"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Curriculum</label>
                            <input
                                required name="curriculum" value={formData.curriculum} onChange={handleChange}
                                placeholder="e.g. British, IB, Edexcel"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none"
                            />
                        </div>

                        {/* Pricing & Capacity */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Price (KD)</label>
                            <input
                                required type="number" name="price" value={formData.price} onChange={handleChange}
                                placeholder="0.00"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Max Students</label>
                            <input
                                required type="number" name="maxStudents" value={formData.maxStudents} onChange={handleChange}
                                placeholder="e.g. 10"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none"
                            />
                        </div>

                        {/* Toggles */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Tutor Gender</label>
                            <select
                                name="tutorGender" value={formData.tutorGender} onChange={handleChange}
                                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none appearance-none"
                            >
                                <option value="MALE">Male</option>
                                <option value="FEMALE">Female</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Class Type</label>
                            <select
                                name="classType" value={formData.classType} disabled
                                className="w-full px-5 py-3.5 bg-gray-200 border border-transparent rounded-none text-[#0D1C35] font-sans text-sm outline-none appearance-none cursor-not-allowed opacity-70"
                            >
                                <option value="GROUP">Group Class</option>
                                <option value="ONE_TO_ONE">1-on-1 Session</option>
                            </select>
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1">Description</label>
                            <textarea
                                required name="description" value={formData.description} onChange={handleChange}
                                rows={4}
                                placeholder="Describe your course curriculum and learning outcomes..."
                                className="w-full px-5 py-4 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none resize-none"
                            />
                        </div>

                        {/* Links */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 font-sans uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <Video size={14} className="text-red-500" /> Youtube Link
                            </label>
                            <input
                                name="youtubeVideoLink" value={formData.youtubeVideoLink} onChange={handleChange}
                                placeholder="Paste your video link here"
                                className="w-full px-5 py-3.5 bg-gray-50 border border-transparent rounded-none focus:bg-white focus:border-[#0A47C2] transition-all text-[#0D1C35] font-sans text-sm outline-none"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-500 font-sans uppercase tracking-wider ml-1 flex items-center gap-1.5">
                                <MessageCircle size={14} className="text-green-500" /> WhatsApp Link
                            </label>
                            <input
                                name="whatsappGroupLink" value={formData.whatsappGroupLink} onChange={handleChange}
                                disabled={Number(formData.maxStudents) === 1}
                                placeholder={Number(formData.maxStudents) === 1 ? "Not available for 1-on-1" : "Your Whatsapp Link"}
                                className={cn(
                                    "w-full px-5 py-3.5 border border-transparent rounded-none transition-all text-[#0D1C35] font-sans text-sm outline-none",
                                    Number(formData.maxStudents) === 1 
                                        ? "bg-gray-200 cursor-not-allowed opacity-70" 
                                        : "bg-gray-50 focus:bg-white focus:border-[#0A47C2]"
                                )}
                            />
                        </div>

                        {/* Footer Actions */}
                        <div className="md:col-span-2 pt-6 flex items-center justify-end gap-3 border-t border-gray-50 mt-4">
                            <button
                                type="button" onClick={onClose}
                                className="px-8 py-4 text-gray-500 font-semibold hover:bg-gray-50 rounded-none transition-all"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-10 py-4 bg-[#0A47C2] text-white font-semibold rounded-none shadow-xl shadow-blue-100 hover:bg-[#083a9e] disabled:opacity-70 transition-all flex items-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 size={20} className="animate-spin" />
                                        Creating...
                                    </>
                                ) : "Publish Class"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

// --- Class Detail Modal ---
function ClassDetailModal({ cls, onClose }: { cls: ClassData; onClose: () => void }) {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-[#0D1C35]/40 backdrop-blur-sm" onClick={onClose} />
            <div className="bg-white rounded-none w-full max-w-2xl max-h-[90vh] overflow-y-auto relative z-10 shadow-2xl animate-in zoom-in-95 duration-200">
                <div className="relative h-64 w-full">
                    <Image src={getImageUrl(cls.images?.[0])} alt={cls.subject} fill className="object-cover" unoptimized />
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />

                    {/* Rating Badge in Detail Modal */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-none px-3 py-1.5 text-xs font-semibold text-[#0D1C35] font-sans shadow-lg">
                        <StarIcon />
                        <span>{cls.averageRating || 0}</span>
                        <span className="text-gray-400 font-normal">({cls.ratingCount || 0} reviews)</span>
                    </div>

                    <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-none text-white transition-all">
                        <X size={20} />
                    </button>
                    <div className="absolute bottom-6 left-8 text-white">
                        <p className="text-[10px] font-semibold tracking-[0.2em] uppercase opacity-80">{cls.curriculum} • {cls.level}</p>
                        <h2 className="text-3xl font-bold font-sans mt-1">{cls.subject}</h2>
                    </div>
                </div>

                <div className="p-8 space-y-8">
                    {/* Meta info cards */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="bg-gray-50 p-4 rounded-none border border-gray-100/50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Price</p>
                            <p className="text-lg font-black text-[#0A47C2]">{cls.price} KD</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-none border border-gray-100/50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Capacity</p>
                            <p className="text-lg font-black text-gray-700">{cls.maxStudents} <span className="text-[10px] font-medium text-gray-400">Slots</span></p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-none border border-gray-100/50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Language</p>
                            <p className="text-lg font-black text-gray-700">{cls.language}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-none border border-gray-100/50">
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Gender</p>
                            <p className="text-lg font-black text-gray-700 leading-none">{cls.tutorGender}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-bold text-gray-800 text-sm flex items-center gap-2">
                            <div className="w-1 h-4 bg-[#0A47C2] rounded-full" />
                            Class Description
                        </h3>
                        <p className="text-gray-500 text-sm leading-relaxed italic">
                            {cls.description}
                        </p>
                    </div>

                    {(cls.youtubeVideoLink || cls.whatsappGroupLink) && (
                        <div className="space-y-4 pt-4">
                            <h3 className="font-bold text-gray-800 text-sm">Class Resources</h3>
                            <div className="space-y-3">
                                {cls.youtubeVideoLink && (
                                    <a
                                        href={cls.youtubeVideoLink} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-red-50 text-red-700 rounded-none hover:bg-red-100 transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center shadow-sm">
                                            <Video className="text-red-500" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold">Watch Video Introduction</p>
                                            <p className="text-[10px] opacity-70">External Youtube Link</p>
                                        </div>
                                    </a>
                                )}
                                {cls.whatsappGroupLink && (
                                    <a
                                        href={cls.whatsappGroupLink.startsWith("http") ? cls.whatsappGroupLink : `https://${cls.whatsappGroupLink}`} target="_blank" rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-none hover:bg-emerald-100 transition-all group"
                                    >
                                        <div className="w-10 h-10 bg-white rounded-none flex items-center justify-center shadow-sm">
                                            <MessageCircle className="text-emerald-500" size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-bold">Join Class Discussion Group</p>
                                            <p className="text-[10px] opacity-70">Official WhatsApp Link</p>
                                        </div>
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
