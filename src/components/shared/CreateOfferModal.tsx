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
}

export default function CreateOfferModal({ isOpen, onClose, tutor, onSendOffer }: CreateOfferModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
    const [currentMonth, setCurrentMonth] = useState<Date>(startOfMonth(startOfToday()));
    const [availableSlots, setAvailableSlots] = useState<any[]>([]);
    const [selectedSlot, setSelectedSlot] = useState<any>(null);
    const [selectedSubject, setSelectedSubject] = useState<string>(tutor?.subjects[0] || "");
    const [loadingSlots, setLoadingSlots] = useState(false);
    const [sending, setSending] = useState(false);

    const getImageUrl = (path: string) => {
        if (!path) return "/demotutor.png";
        if (path.startsWith("http")) return path;
        return `http://10.10.7.24:5010${path}`;
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

        setSending(true);
        try {
            const totalPrice = tutor.pricePerHour; // Only one slot allowed now
            const offerData = {
                tutorId: tutor.createdBy._id,
                hourlyClassId: tutor._id,
                slotId: selectedSlot._id,
                date: format(selectedDate, 'yyyy-MM-dd'),
                slots: [selectedSlot], // Keeping as array for backward compat in UI if needed, but only contains 1
                totalPrice,
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />

            {/* Modal Content */}
            <div className="relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in zoom-in-95 duration-300">
                
                {/* Header: Tutor Info */}
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-blue-100 shadow-sm">
                            <Image src={getImageUrl(tutor.createdBy.profileImage || "")} alt={tutor.createdBy.name} fill className="object-cover" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-[#0D1C35]">{tutor.createdBy.name}</h3>
                            <div className="flex items-center gap-3">
                                <span className="text-[10px] text-gray-400 font-bold tracking-wider">${tutor.pricePerHour}/hr</span>
                            </div>
                            <div className="flex items-center gap-1 mt-0.5">
                                <Star size={10} className="text-amber-400 fill-amber-400" />
                                <span className="text-[10px] font-bold text-[#0D1C35]">{tutor.averageRating || 0}</span>
                                <span className="text-[10px] text-gray-400">({tutor.ratingCount || 0} reviews)</span>
                            </div>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={20} className="text-gray-400" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    
                    {/* Subject Selection Section */}
                    <div>
                        <h4 className="text-sm font-bold text-[#0D1C35] font-sans px-2 mb-4">Select Subject</h4>
                        <div className="flex flex-wrap gap-2 px-1">
                            {tutor.subjects.map((sub, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setSelectedSubject(sub)}
                                    className={cn(
                                        "px-4 py-2 rounded-xl border text-xs font-bold transition-all",
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
                    
                    {/* Calendar Section */}
                    <div>
                        <div className="flex items-center justify-between mb-4 px-2">
                            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <ChevronLeft size={18} className="text-gray-400" />
                            </button>
                            <h4 className="text-sm font-bold text-[#0D1C35] font-sans">
                                {format(currentMonth, 'MMMM yyyy')}
                            </h4>
                            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors">
                                <ChevronRight size={18} className="text-gray-400" />
                            </button>
                        </div>

                        <div className="grid grid-cols-7 gap-1 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => (
                                <span key={d} className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{d}</span>
                            ))}
                        </div>

                        <div className="grid grid-cols-7 gap-1">
                            {/* Empty pads for first day of month */}
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
                                            "aspect-square text-xs font-bold rounded-xl flex items-center justify-center transition-all",
                                            isSelected ? "bg-[#0A47C2] text-white shadow-lg shadow-blue-100" : 
                                            disabled ? "text-gray-200 cursor-not-allowed" : "text-gray-600 hover:bg-blue-50 hover:text-[#0A47C2]"
                                        )}
                                    >
                                        {format(day, 'd')}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Time Slots Section */}
                    <div className="space-y-4">
                        <h4 className="text-sm font-bold text-[#0D1C35] font-sans px-2">Select Time Slot</h4>
                        {loadingSlots ? (
                            <div className="flex justify-center py-8">
                                <Loader2 className="animate-spin text-[#0A47C2]" />
                            </div>
                        ) : availableSlots.length === 0 ? (
                            <div className="text-center py-8 px-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <p className="text-xs text-gray-500 font-medium">No slots available for this date.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-3 gap-2 px-1">
                                {availableSlots.map((slot, idx) => {
                                    const isSelected = selectedSlot?.startTime === slot.startTime;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => selectSlot(slot)}
                                            className={cn(
                                                "py-3 rounded-2xl border text-[10px] font-bold transition-all",
                                                isSelected 
                                                    ? "bg-[#0A47C2] text-white border-[#0A47C2] shadow-md shadow-blue-100" 
                                                    : "bg-blue-50/50 text-[#0A47C2] border-transparent hover:bg-blue-100"
                                            )}
                                        >
                                            {format(new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${slot.startTime}`), 'hh:mm a')} – {format(new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${slot.endTime}`), 'hh:mm a')}
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer: Price & Submit */}
                <div className="p-6 border-t border-gray-100 bg-gray-50/30">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total amount</p>
                            <p className="text-2xl font-bold text-[#0D1C35] leading-none">${tutor.pricePerHour.toFixed(2)}</p>
                        </div>
                        <div className="flex flex-col items-end">
                            <p className="text-xs font-bold text-[#0A47C2] text-right">
                                {selectedSlot ? format(selectedDate, 'MMM dd, yyyy') : "Select a time"}
                            </p>
                            <p className="text-[10px] text-gray-400 font-medium">{selectedSlot ? "1 hour session" : "No slot selected"}</p>
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={sending || !selectedSlot}
                        className="w-full py-4 bg-[#0A47C2] text-white font-bold rounded-2xl shadow-xl shadow-blue-100 hover:bg-[#083a9e] transition-all flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? <Loader2 size={18} className="animate-spin" /> : "Send Offer"}
                        {!sending && <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />}
                    </button>
                </div>
            </div>
        </div>
    );
}
