"use client";

import React, { useState, useEffect } from "react";
import {
    Search,
    Star,
    Loader2,
    ChevronLeft,
    ChevronRight,
    Filter,
    Calendar,
    User,
    BookOpen,
    Trash2
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import UserAvatar from "@/components/ui/UserAvatar";
import { cn } from "@/lib/utils";
import Swal from "sweetalert2";

interface Rating {
    _id: string;
    rating: number;
    review: string;
    student: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    tutor: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    class?: {
        _id: string;
        subject: string;
    };
    createdAt: string;
}

interface Meta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export default function AdminRatingsPage() {
    const [ratings, setRatings] = useState<Rating[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [meta, setMeta] = useState<Meta | null>(null);

    // Fetch Ratings
    const fetchRatings = async () => {
        setLoading(true);
        try {
            const response = await api.get(`/ratings/admin`, {
                params: {
                    page,
                    limit: 10,
                    sort: "-createdAt"
                }
            });
            if (response.data.success) {
                setRatings(response.data.data);
                setMeta(response.data.meta);
            }
        } catch (error) {
            console.error("Failed to fetch ratings:", error);
            toast.error("Failed to load ratings.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRatings();
    }, [page]);

    const handleDelete = async (id: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this rating deletion!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#EF4444",
            cancelButtonColor: "#0A47C2",
            confirmButtonText: "Yes, delete it!",
            customClass: {
                popup: 'rounded-[32px]',
                confirmButton: 'rounded-xl px-6 py-3 font-bold',
                cancelButton: 'rounded-xl px-6 py-3 font-bold'
            }
        });

        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/ratings/${id}`);
                if (response.data.success) {
                    Swal.fire({
                        title: "Deleted!",
                        text: "The rating has been deleted.",
                        icon: "success",
                        confirmButtonColor: "#0A47C2",
                        customClass: { popup: 'rounded-[32px]' }
                    });
                    fetchRatings();
                }
            } catch (error) {
                toast.error("Failed to delete rating.");
            }
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50/30 min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0D1C35] font-sans tracking-tight">Ratings Management</h1>
                    <p className="text-gray-500 text-sm mt-1">View and manage all student reviews across the platform.</p>
                </div>
            </div>

            {/* Content Card */}
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Student</th>
                                <th className="px-6 py-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Tutor</th>
                                <th className="px-6 py-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Class</th>
                                <th className="px-6 py-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Rating</th>
                                <th className="px-6 py-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Review</th>
                                <th className="px-6 py-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Date</th>
                                <th className="px-6 py-5 text-[10px] font-semibold text-gray-400 uppercase tracking-widest text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Loader2 className="w-8 h-8 text-[#0A47C2] animate-spin" />
                                            <p className="text-gray-500 font-sans text-sm font-medium">Loading ratings...</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : ratings.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center gap-3">
                                            <Star className="w-12 h-12 text-gray-200" />
                                            <p className="text-gray-500 font-sans text-sm font-medium">No ratings found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                ratings.map((rating) => (
                                    <tr key={rating._id} className="hover:bg-gray-50/30 transition-colors group">
                                        {/* Student */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar src={rating.student?.profileImage} name={rating.student?.name} size="w-10 h-10" />
                                                <div>
                                                    <p className="text-sm font-semibold text-[#0D1C35]">{rating.student?.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Student</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Tutor */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-3">
                                                <UserAvatar src={rating.tutor?.profileImage} name={rating.tutor?.name} size="w-10 h-10" />
                                                <div>
                                                    <p className="text-sm font-semibold text-[#0D1C35]">{rating.tutor?.name}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">Tutor</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Class */}
                                        <td className="px-6 py-5">
                                            {rating.class ? (
                                                <div>
                                                    <p className="text-sm font-semibold text-[#0D1C35]">{rating.class.subject}</p>
                                                    <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">ID: {rating.class._id.slice(-6)}</p>
                                                </div>
                                            ) : (
                                                <span className="text-gray-300 text-xs">Direct Tutor Rating</span>
                                            )}
                                        </td>

                                        {/* Rating */}
                                        <td className="px-6 py-5">
                                            <div className="flex items-center gap-1">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star
                                                        key={s}
                                                        size={14}
                                                        className={cn(
                                                            s <= rating.rating ? "text-amber-400 fill-amber-400" : "text-gray-200"
                                                        )}
                                                    />
                                                ))}
                                                <span className="ml-2 text-sm font-semibold text-[#0D1C35]">{rating.rating}</span>
                                            </div>
                                        </td>

                                        {/* Review */}
                                        <td className="px-6 py-5 max-w-[300px]">
                                            <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed" title={rating.review}>
                                                {rating.review || "No comment provided"}
                                            </p>
                                        </td>

                                        {/* Date */}
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar size={14} />
                                                <span className="text-xs font-medium font-sans uppercase">{formatDate(rating.createdAt)}</span>
                                            </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-6 py-5 text-center">
                                            <button
                                                onClick={() => handleDelete(rating._id)}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                                                title="Delete Rating"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {meta && meta.totalPages > 1 && (
                    <div className="px-8 py-6 border-t border-gray-100 flex items-center justify-between bg-white">
                        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest">
                            Showing <span className="text-[#0D1C35]">{(page - 1) * 10 + 1}</span> to <span className="text-[#0D1C35]">{Math.min(page * 10, meta.total)}</span> of <span className="text-[#0D1C35]">{meta.total}</span> ratings
                        </p>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft size={20} className="text-gray-600" />
                            </button>
                            <div className="flex items-center gap-1">
                                {[...Array(meta.totalPages)].map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setPage(i + 1)}
                                        className={cn(
                                            "w-10 h-10 text-xs font-bold rounded-xl transition-all",
                                            page === i + 1
                                                ? "bg-[#0A47C2] text-white shadow-lg shadow-blue-100"
                                                : "text-gray-500 hover:bg-gray-50"
                                        )}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                onClick={() => setPage(p => Math.min(meta.totalPages, p + 1))}
                                disabled={page === meta.totalPages}
                                className="p-2 border border-gray-100 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronRight size={20} className="text-gray-600" />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
