"use client";

import React, { useState, useEffect } from "react";
import { X, Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Star, Loader2 } from "lucide-react";
import Image from "next/image";
import {
    format,
    addDays,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    isSameDay,
    isBefore,
    startOfToday,
    addMonths,
    subMonths
} from "date-fns";
import api from "@/lib/axios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface HourlyClassData {
    _id: string;
    createdBy: {
        _id: string;
        name: string;
        profileImage?: string;
    };
    pricePerHour: number;
    subjects: string[];
    averageRating: number;
    ratingCount: number;
}

interface CreateOfferModalProps {
    isOpen: boolean;
    onClose: () => void;
    tutor: HourlyClassData | null;
    onSendOffer: (offerData: any) => void;
    initialData?: any;
}

export default function CreateOfferModal({ isOpen, onClose, tutor, onSendOffer, initialData }: CreateOfferModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(startOfToday()));
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [selectedSubject, setSelectedSubject] = useState<string>("");
    const [price, setPrice] = useState<string>("0");
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [sending, setSending] = useState(false);

    // Initialize state from initialData when modal opens
    useEffect(() => {
        if (isOpen) {
            if (initialData) {
                const date = initialData.date ? new Date(initialData.date) : startOfToday();
                setSelectedDate(date);
                setCurrentMonth(startOfMonth(date));
                setSelectedSlot(initialData.slots?.[0] || null);
                setSelectedSubject(initialData.subject || tutor?.subjects[0] || "");
                setPrice(initialData.totalPrice?.toString() || tutor?.pricePerHour.toString() || "0");
            } else {
                setSelectedDate(startOfToday());
                setCurrentMonth(startOfMonth(startOfToday()));
                setSelectedSlot(null);
                setSelectedSubject(tutor?.subjects[0] || "");
                setPrice(tutor?.pricePerHour.toString() || "0");
            }
        }
    }, [isOpen, initialData, tutor]);

    const getImageUrl = (path: string) => {
        if (!path) return "/demotutor.png";
        if (path.startsWith("http")) return path;
        return `${process.env.NEXT_PUBLIC_IMAGE_URL}${path}`;
    };

    // Fetch availability when date changes
    useEffect(() => {
        const fetchAvailability = async () => {
            if (!tutor || !selectedDate) return;
            setLoadingSlots(true);
            try {
                // Formatting date as YYYY-MM-DD
                const dateStr = format(selectedDate, 'yyyy-MM-dd');
                const response = await api.get(`/slots/available/${tutor.createdBy._id}?date=${dateStr}`);
                if (response.data.success) {
                    setAvailableSlots(response.data.data || []);
                } else {
                    setAvailableSlots([]);
                }
            } catch (error) {
                console.error("Failed to fetch slots:", error);
                setAvailableSlots([]);
            } finally {
                setLoadingSlots(false);
            }
        };

        if (isOpen && tutor) {
            fetchAvailability();
        }
    }, [selectedDate, tutor, isOpen]);

    if (!isOpen || !tutor) return null;

    const daysInMonth = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    });

    const selectSlot = (slot: any) => {
        setSelectedSlot(slot);
    };

    const handleSend = async () => {
        if (!selectedSlot) {
            toast.error("Please select a time slot");
            return;
        }

        if (!selectedSubject) {
            toast.error("Please select a subject");
            return;
        }

        const numericPrice = parseFloat(price);
        if (isNaN(numericPrice) || numericPrice < 0) {
            toast.error("Please enter a valid price");
            return;
        }

        setSending(true);
        try {
            const offerData = {
                tutorId: tutor.createdBy._id,
                hourlyClassId: tutor._id,
                slotId: selectedSlot._id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                slots: [selectedSlot], // Keeping as array for backward compat in UI if needed, but only contains 1
                totalPrice: numericPrice,
                subject: selectedSubject
            };

            await onSendOffer(offerData);
            onClose();
        } catch (error) {
            console.error("Failed to send offer:", error);
        } finally {
            setSending(false);
        }
    };



    return (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-md bg-white rounded-[24px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300 max-h-[85vh]">

                {/* Header: Tutor Info (Fixed) */}
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white z-10">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-blue-50 shadow-sm flex items-center justify-center">
                            {tutor.createdBy.profileImage ? (
                                <Image src={getImageUrl(tutor.createdBy.profileImage)} alt={tutor.createdBy.name} fill className="object-cover" unoptimized />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0A47C2] to-[#4F46E5] text-white text-lg font-bold font-sans">
                                    {tutor.createdBy.name.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                        <div>
                            <h3 className="text-base font-bold text-[#0D1C35]">{tutor.createdBy.name}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] text-gray-400 font-bold tracking-wider">{tutor.pricePerHour} KD/hr</span>
                                <div className="flex items-center gap-1">
                                    <Star size={8} className="text-amber-400 fill-amber-400" />
                                    <span className="text-[10px] font-bold text-[#0D1C35]">{tutor.averageRating || 0}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={18} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6 scrollbar-thin scrollbar-thumb-gray-200">

                    <div>
                        <h4 className="text-xs font-bold text-[#0D1C35] font-sans mb-3">Select Subject</h4>
                        <div className="flex flex-wrap gap-1.5">
                            {tutor.subjects.map((sub, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSubject(sub)}
                                    className={cn(
                                        "px-3 py-1.5 rounded-lg border text-[10px] font-bold transition-all",
                                        selectedSubject === sub
                                            ? "bg-[#0A47C2] text-white border-[#0A47C2] shadow-sm"
                                            : "bg-white text-gray-600 border-gray-100 hover:border-blue-200"
                                    )}
                                >
                                    {sub}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Calendar Section - Made Smaller */}
                    <div className="bg-gray-50/50 p-3 rounded-2xl border border-gray-100">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1 hover:bg-gray-200 rounded-md transition-colors">
                                <ChevronLeft size={16} className="text-gray-500" />
                            </button>
                            <h4 className="text-xs font-bold text-[#0D1C35] font-sans">
                                {format(currentMonth, 'MMMM yyyy')}
                            </h4>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1 hover:bg-gray-200 rounded-md transition-colors">
                                <ChevronRight size={16} className="text-gray-500" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-0.5 text-center mb-1">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <span key={d} className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{d}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-0.5">
                            {Array.from({ length: startOfMonth(currentMonth).getDay() }).map((_, i) => (
                                <div key={i} />
                            ))}
                            {daysInMonth.map((day) => {
                                const isSelected = isSameDay(day, selectedDate);
                                const isPast = isBefore(day, startOfToday());
                                const isTooFar = isBefore(addDays(startOfToday(), 30), day);
                                const disabled = isPast || isTooFar;

                                return (
                                    <button
                                        key={day.toISOString()}
                                        disabled={disabled}
                                        onClick={() => setSelectedDate(day)}
                                        className={cn(
                                            "h-7 w-full text-[10px] font-bold rounded-lg flex items-center justify-center transition-all",
                                            isSelected ? "bg-[#0A47C2] text-white shadow-md shadow-blue-100" :
                                                disabled ? "text-gray-200 cursor-not-allowed" : "text-gray-600 hover:bg-white hover:text-[#0A47C2] hover:shadow-sm"
                                        )}
                                    >
                                        {format(day, 'd')}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Slots Section */}
                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-[#0D1C35] font-sans">Select Time Slot</h4>
                        {loadingSlots ? (
                            <div className="flex justify-center py-4">
                                <Loader2 className="animate-spin text-[#0A47C2] size-5" />
                            </div>
                        ) : availableSlots.length === 0 ? (
                            <div className="text-center py-4 px-4 bg-gray-50 rounded-xl border border-gray-100">
                                <p className="text-[10px] text-gray-500 font-medium">No slots available for this date.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-1.5">
                                {availableSlots.map((slot, idx) => {
                                    const isSelected = selectedSlot?.startTime === slot.startTime;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => selectSlot(slot)}
                                            className={cn(
                                                "py-2 rounded-xl border text-[9px] font-bold transition-all",
                                                isSelected
                                                    ? "bg-[#0A47C2] text-white border-[#0A47C2] shadow-sm"
                                                    : "bg-blue-50/30 text-[#0A47C2] border-transparent hover:bg-blue-100"
                                            )}
                                        >
                                            {format(new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${slot.startTime}`), 'hh:mm a')}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="p-4 border-t border-gray-100 bg-white">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex-1 mr-4">
                            <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider mb-1">Set Offer Price (KD)</p>
                            <div className="relative">
                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-lg font-bold text-[#0D1C35] focus:outline-none focus:ring-2 focus:ring-blue-100 transition-all"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">KD</span>
                            </div>
                        </div>
                        <div className="flex flex-col items-end shrink-0">
                            <p className="text-[10px] font-bold text-[#0A47C2] text-right">
                                {selectedSlot ? format(selectedDate, 'MMM dd, yyyy') : "Select a time"}
                            </p>
                            <p className="text-[9px] text-gray-400 font-medium">{selectedSlot ? "1 hour session" : "No slot selected"}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={sending || !selectedSlot}
                        className="w-full py-3 bg-[#0A47C2] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-50 hover:bg-[#083a9e] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? <Loader2 size={16} className="animate-spin" /> : "Send Offer"}
                        {!sending && <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
