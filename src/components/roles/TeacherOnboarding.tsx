"use client";

import React, { useRef, useState } from "react";
import {
    BookOpen, GraduationCap, DollarSign, FileText,
    Clock, ChevronRight, ChevronLeft, Check, Loader2,
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const SUBJECTS_LIST = [
    "Math", "Physics", "Chemistry", "Biology", "English", "Bangla",
    "History", "Geography", "ICT", "Economics", "Accounting",
    "Business Studies", "Calculus", "Statistics",
];
const CURRICULUM_LIST = [
    "English Medium", "Bangla Medium", "SET A", "SET B",
    "O Level", "A Level", "IGCSE", "HSC", "SSC",
];

// Pre-defined 1-hour blocks from 06:00 to 22:00
const ALL_SLOTS: { startTime: string; endTime: string }[] = Array.from({ length: 16 }, (_, i) => {
    const h = i + 6;
    const pad = (n: number) => String(n).padStart(2, "0");
    return { startTime: `${pad(h)}:00`, endTime: `${pad(h + 1)}:00` };
});

// per-day: Set of selected slot indices
type DaySlots = Record<string, Set<number>>;

interface TeacherOnboardingProps { onComplete: () => void; }

export default function TeacherOnboarding({ onComplete }: TeacherOnboardingProps) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const dayTabsRef = useRef<HTMLDivElement>(null);

    // Step 1 — Hourly Classes
    const [subjects, setSubjects] = useState<string[]>([]);
    const [curriculum, setCurriculum] = useState("English Medium");
    const [pricePerHour, setPricePerHour] = useState("");
    const [description, setDescription] = useState("");

    // Step 2 — Availability
    const [activeDay, setActiveDay] = useState(0);
    // daySlots[dayName] = Set of selected slot indices
    const [daySlots, setDaySlots] = useState<DaySlots>(() =>
        Object.fromEntries(DAYS.map(d => [d, new Set<number>([2, 3])]))  // default: 08-09, 09-10 selected
    );

    const toggleSubject = (sub: string) =>
        setSubjects(prev => prev.includes(sub) ? prev.filter(s => s !== sub) : [...prev, sub]);

    const toggleSlot = (slotIdx: number) => {
        setDaySlots(prev => {
            const day = DAYS[activeDay];
            const cur = new Set(prev[day]);
            cur.has(slotIdx) ? cur.delete(slotIdx) : cur.add(slotIdx);
            return { ...prev, [day]: cur };
        });
    };

    // How many slots selected for a day (for badge)
    const slotCount = (day: string) => daySlots[day]?.size ?? 0;

    // Step 1 submit
    const handleStep1Next = (e: React.FormEvent) => {
        e.preventDefault();
        if (subjects.length === 0) { toast.error("Please select at least one subject"); return; }
        if (!pricePerHour || parseFloat(pricePerHour) <= 0) { toast.error("Please enter a valid price per hour"); return; }
        setStep(2);
    };

    // Step 2 submit — POST both APIs
    const handleStep2Submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const availability = DAYS
            .filter(d => (daySlots[d]?.size ?? 0) > 0)
            .map(d => ({
                day: d,
                slots: [...(daySlots[d] ?? [])].sort((a, b) => a - b).map(i => ALL_SLOTS[i]),
            }));

        if (availability.length === 0) {
            toast.error("Please select at least one time slot");
            return;
        }

        setIsLoading(true);
        try {
            await api.post("/hourly-classes", {
                subjects,
                curriculum,
                pricePerHour: parseFloat(pricePerHour),
                description,
            });
            await api.post("/availability", { availability });
            toast.success("Setup complete! Welcome to your teacher dashboard 🎉");
            onComplete();
            router.push("/teacher");
        } catch (err: any) {
            toast.error(err?.response?.data?.message || "Failed to complete setup");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* ── Header ── */}
                <div className="bg-gradient-to-r from-[#0A47C2] to-[#2563EB] px-8 py-6 text-white shrink-0">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h2 className="text-xl font-bold">Complete Your Profile</h2>
                            <p className="text-blue-100 text-sm mt-0.5">Just 2 quick steps to get started</p>
                        </div>
                        <span className="text-sm font-semibold bg-white/20 rounded-full px-4 py-1.5">{step} / 2</span>
                    </div>
                    <div className="flex gap-2">
                        {[{ num: 1, label: "Hourly Classes" }, { num: 2, label: "Availability" }].map(s => (
                            <div key={s.num} className="flex-1">
                                <div className={`h-1.5 rounded-full mb-1.5 transition-all duration-500 ${step >= s.num ? "bg-white" : "bg-white/30"}`} />
                                <span className={`text-xs ${step >= s.num ? "text-white" : "text-blue-200"}`}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto">

                    {/* ── STEP 1: Hourly Classes ── */}
                    {step === 1 && (
                        <form id="step1-form" onSubmit={handleStep1Next} className="px-8 py-6 space-y-6">
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                                    <BookOpen size={15} className="text-[#0A47C2]" /> Subjects <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-2">
                                    {SUBJECTS_LIST.map(sub => (
                                        <button key={sub} type="button" onClick={() => toggleSubject(sub)}
                                            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${subjects.includes(sub)
                                                ? "bg-[#0A47C2] text-white border-[#0A47C2]"
                                                : "bg-white text-gray-600 border-gray-200 hover:border-[#0A47C2]/50"}`}>
                                            {sub}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <GraduationCap size={15} className="text-[#0A47C2]" /> Curriculum
                                </label>
                                <select value={curriculum} onChange={e => setCurriculum(e.target.value)}
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0A47C2]/20 focus:border-[#0A47C2]">
                                    {CURRICULUM_LIST.map(c => <option key={c}>{c}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <DollarSign size={15} className="text-[#0A47C2]" /> Price Per Hour <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                    <input value={pricePerHour} onChange={e => setPricePerHour(e.target.value)}
                                        type="number" min="1" step="0.01" placeholder="e.g. 30" required
                                        className="w-full pl-8 pr-4 border border-gray-200 rounded-xl py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0A47C2]/20 focus:border-[#0A47C2]" />
                                </div>
                            </div>

                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                    <FileText size={15} className="text-[#0A47C2]" /> Description <span className="text-red-500">*</span>
                                </label>
                                <textarea value={description} onChange={e => setDescription(e.target.value)}
                                    rows={3} placeholder="e.g. Expert tutoring in STEM subjects." required
                                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#0A47C2]/20 focus:border-[#0A47C2] resize-none" />
                            </div>
                        </form>
                    )}

                    {/* ── STEP 2: Availability ── */}
                    {step === 2 && (
                        <form id="step2-form" onSubmit={handleStep2Submit} className="flex flex-col h-full">

                            {/* Day Tabs — scrollable */}
                            <div ref={dayTabsRef} className="flex gap-2 px-6 pt-5 pb-3 overflow-x-auto scrollbar-hide shrink-0">
                                {DAYS.map((day, idx) => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => setActiveDay(idx)}
                                        className={`relative shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${activeDay === idx
                                            ? "bg-[#0A47C2] text-white shadow-md shadow-blue-200"
                                            : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                                        }`}>
                                        {DAY_SHORT[idx]}
                                        {slotCount(day) > 0 && (
                                            <span className={`absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center ${activeDay === idx ? "bg-white text-[#0A47C2]" : "bg-[#0A47C2] text-white"}`}>
                                                {slotCount(day)}
                                            </span>
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Day heading */}
                            <div className="px-6 pb-3 shrink-0">
                                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                    <Clock size={14} className="text-[#0A47C2]" />
                                    Availability for {DAYS[activeDay]}
                                </h3>
                            </div>

                            {/* Slot grid */}
                            <div className="flex-1 overflow-y-auto px-6 pb-4">
                                <div className="grid grid-cols-2 gap-2.5">
                                    {ALL_SLOTS.map((slot, idx) => {
                                        const selected = daySlots[DAYS[activeDay]]?.has(idx) ?? false;
                                        return (
                                            <button
                                                key={idx}
                                                type="button"
                                                onClick={() => toggleSlot(idx)}
                                                className={`flex items-center gap-2.5 px-4 py-3 rounded-2xl border text-sm font-medium transition-all ${selected
                                                    ? "bg-[#0A47C2] text-white border-[#0A47C2] shadow-sm shadow-blue-200"
                                                    : "bg-white text-gray-600 border-gray-200 hover:border-[#0A47C2]/40 hover:bg-blue-50/40"
                                                }`}>
                                                <Clock size={14} className={selected ? "text-blue-200" : "text-gray-400"} />
                                                <span>{slot.startTime} – {slot.endTime}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </form>
                    )}
                </div>

                {/* ── Footer ── */}
                <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between shrink-0">
                    {step === 2 ? (
                        <button type="button" onClick={() => setStep(1)}
                            className="flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-all">
                            <ChevronLeft size={16} /> Back
                        </button>
                    ) : <div />}

                    <button
                        type="submit"
                        form={step === 1 ? "step1-form" : "step2-form"}
                        disabled={isLoading}
                        className="flex items-center gap-2 px-8 py-3 bg-[#0A47C2] hover:bg-[#0A47C2]/90 text-white font-semibold text-sm rounded-full shadow-lg shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed">
                        {isLoading ? (
                            <><Loader2 size={16} className="animate-spin" /> Saving...</>
                        ) : step === 1 ? (
                            <>Next <ChevronRight size={16} /></>
                        ) : (
                            <>Complete Setup <Check size={16} /></>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
