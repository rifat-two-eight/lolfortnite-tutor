import React from "react";
import Image from "next/image";
import { Clock, Calendar } from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { getImageUrl, cn } from "@/lib/utils";

interface OfferMessageProps {
    msg: any;
    isMe: boolean;
    recipient: any;
    onAccept: (id: string) => void;
    onReject: (id: string) => void;
    onReschedule: (msg: any) => void;
}

import UserAvatar from "@/components/ui/UserAvatar";

const OfferMessage: React.FC<OfferMessageProps> = ({
    msg,
    isMe,
    recipient,
    onAccept,
    onReject,
    onReschedule
}) => {
    let offerData: any = {};
    if (msg.text?.startsWith("OFFER:")) {
        try {
            const jsonStr = msg.text.replace("OFFER:", "");
            offerData = JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse offer data", e);
        }
    } else {
        // Support new structured API response
        offerData = {
            subject: msg.subject,
            slots: msg.slot ? [msg.slot] : (msg.slots || []),
            totalPrice: msg.totalPrice || msg.price || msg.slot?.price || 0,
            date: msg.date || msg.slot?.date
        };
    }

    return (
        <div className={cn("flex items-start gap-3 max-w-2xl w-full mb-4", isMe && "flex-col items-end gap-1 ml-auto")}>
            {!isMe && (
                <UserAvatar 
                    src={recipient.profileImage} 
                    name={recipient.name} 
                    size="w-8 h-8" 
                    className="mt-1"
                />
            )}

            <div className={cn("flex flex-col gap-1 w-full max-w-xs", isMe ? "items-end" : "items-start")}>
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 w-full space-y-6">
                    <h4 className="text-sm font-bold text-gray-700">{isMe ? "Sent booking offer" : "Booking offer"}</h4>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                        <p className="text-sm font-bold text-[#0D1C35]">{offerData.subject || "General Class"}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <p className="text-sm font-bold text-[#0D1C35]">{offerData.totalPrice || 0} KD</p>
                        <p className="text-[10px] font-bold text-gray-400 uppercase">{offerData.slots?.length || 0} Slots</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Clock size={14} className="text-blue-400" />
                            <span className="text-[10px] font-bold text-[#0D1C35]">
                                {offerData.slots?.[0]?.startTime} – {offerData.slots?.[0]?.endTime}
                            </span>
                        </div>
                        {offerData.date && (
                            <div className="flex items-center gap-2">
                                <Calendar size={14} className="text-blue-400" />
                                <span className="text-[10px] font-bold text-[#0D1C35]">
                                    {isValid(new Date(offerData.date)) ? format(new Date(offerData.date), "d-M-yyyy") : offerData.date}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="pt-2">
                        {offerData.slots?.[0]?.status && offerData.slots[0].status !== "available" ? (
                            <div className="space-y-3">
                                <div className="w-full py-3 bg-gray-50 text-gray-400 font-bold text-[10px] rounded-2xl text-center uppercase tracking-widest border border-gray-100 italic">
                                    Unavailable time
                                </div>
                                <button
                                    onClick={() => onReschedule(msg)}
                                    className="w-full py-3 border border-blue-100 text-[#0A47C2] font-bold text-[10px] rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-widest"
                                >
                                    Reschedule
                                </button>
                            </div>
                        ) : isMe ? (
                            <div className="grid grid-cols-2 gap-2">
                                <button
                                    onClick={() => onReject(msg._id)}
                                    className="py-2.5 border border-gray-200 text-gray-500 font-bold text-[9px] rounded-xl hover:bg-gray-50 transition-all uppercase tracking-widest"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => onReschedule(msg)}
                                    className="py-2.5 border border-blue-100 text-[#0A47C2] font-bold text-[9px] rounded-xl hover:bg-blue-50 transition-all uppercase tracking-widest"
                                >
                                    Reschedule
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        onClick={() => onReject(msg._id)}
                                        className="py-3 border border-red-100 text-red-500 font-bold text-[10px] rounded-2xl hover:bg-red-50 transition-all uppercase tracking-widest"
                                    >
                                        Decline
                                    </button>
                                    <button
                                        onClick={() => onReschedule(msg)}
                                        className="py-3 border border-blue-100 text-[#0A47C2] font-bold text-[10px] rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-widest"
                                    >
                                        Reschedule
                                    </button>
                                </div>
                                <button
                                    onClick={() => onAccept(msg._id)}
                                    className="w-full py-3 bg-[#0A47C2] text-white font-bold text-[10px] rounded-2xl hover:bg-[#083a9e] transition-all uppercase tracking-widest shadow-lg shadow-blue-100"
                                >
                                    Accept
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <span className={cn("text-[10px] text-gray-400 font-bold block", isMe ? "text-right" : "text-left ml-11")}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </span>
            </div>
        </div>
    );
};

export default OfferMessage;
