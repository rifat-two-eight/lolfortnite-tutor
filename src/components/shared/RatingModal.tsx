"use client";

import React, { useState } from "react";
import { X, Star, Loader2, Send } from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface RatingModalProps {
    isOpen: boolean;
    onClose: () => void;
    tutorId: string;
    classId: string;
    studentId: string;
    tutorName: string;
    onSuccess?: () => void;
}

export default function RatingModal({
    isOpen,
    onClose,
    tutorId,
    classId,
    studentId,
    tutorName,
    onSuccess
}: RatingModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [review, setReview] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please select a rating");
            return;
        }

        setSubmitting(true);
        try {
            const response = await api.post("/ratings", {
                tutor: tutorId,
                class: classId,
                student: studentId,
                rating,
                review: review.trim()
            });

            if (response.data.success) {
                toast.success("Rating submitted successfully!");
                onSuccess?.();
                onClose();
                // Reset state
                setRating(0);
                setReview("");
            }
        } catch (error: any) {
            console.error("Failed to submit rating:", error);
            const errorMsg = error.response?.data?.message || "Failed to submit rating.";
            toast.error(errorMsg);
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-[32px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
                <div className="p-8">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-[#0D1C35] font-sans">Rate your experience</h2>
                        <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                            <X size={20} className="text-gray-400" />
                        </button>
                    </div>

                    <div className="text-center mb-8">
                        <p className="text-gray-500 font-sans mb-1">How was your lesson with</p>
                        <h3 className="text-lg font-bold text-[#0A47C2] font-sans uppercase tracking-wider">{tutorName}</h3>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Star Rating */}
                        <div className="flex flex-col items-center gap-3">
                            <div className="flex items-center gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHover(star)}
                                        onMouseLeave={() => setHover(0)}
                                        className="p-1 transition-transform hover:scale-110 active:scale-95"
                                    >
                                        <Star
                                            size={40}
                                            className={cn(
                                                "transition-colors",
                                                (hover || rating) >= star
                                                    ? "text-amber-400 fill-amber-400"
                                                    : "text-gray-200"
                                            )}
                                        />
                                    </button>
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-400 font-sans uppercase tracking-widest">
                                {rating === 5 ? "Amazing!" : rating === 4 ? "Great" : rating === 3 ? "Good" : rating === 2 ? "Fair" : rating === 1 ? "Poor" : "Select Rating"}
                            </span>
                        </div>

                        {/* Review Text */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Write a Review (Optional)</label>
                            <textarea
                                value={review}
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Share your experience with other students..."
                                className="w-full h-32 px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-200 transition-all resize-none font-sans"
                            />
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={submitting || rating === 0}
                            className="w-full py-4 bg-[#0A47C2] text-white font-bold rounded-2xl shadow-lg shadow-blue-100 hover:bg-[#083a9e] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2 group"
                        >
                            {submitting ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <>
                                    <span>Submit Review</span>
                                    <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
