import React from "react";
import Image from "next/image";
import { Clock, Calendar, RefreshCcw } from "lucide-react";
import { format, isValid } from "date-fns";
import { getImageUrl, cn } from "@/lib/utils";

interface RescheduledMessageProps {
    msg: any;
    isMe: boolean;
    recipient: any;
}

import UserAvatar from "@/components/ui/UserAvatar";

const RescheduledMessage: React.FC<RescheduledMessageProps> = ({ msg, isMe, recipient }) => {
    let offerData: any = {};
    if (msg.text?.startsWith("OFFER:")) {
        try {
            const jsonStr = msg.text.replace("OFFER:", "");
            offerData = JSON.parse(jsonStr);
        } catch (e) { }
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
                <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 w-full space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-5 rotate-45">
                        <RefreshCcw size={80} className="text-blue-500" />
                    </div>

                    <h4 className="text-sm font-bold text-gray-700">Offer Rescheduled</h4>

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
                        <div className="py-3 bg-blue-50 text-blue-600 font-bold text-[10px] rounded-2xl text-center uppercase tracking-widest border border-blue-100 flex items-center justify-center gap-2">
                            <RefreshCcw size={14} />
                            Offer Rescheduled
                        </div>
                    </div>
                </div>
                <span className={cn("text-[10px] text-gray-400 font-bold block", isMe ? "text-right" : "text-left ml-11")}>
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </span>
            </div>
        </div>
    );
};

export default RescheduledMessage;
