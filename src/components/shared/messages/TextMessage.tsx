import React from "react";
import Image from "next/image";
import { Loader2, MoreVertical } from "lucide-react";
import { getImageUrl, cn } from "@/lib/utils";

import UserAvatar from "@/components/ui/UserAvatar";

interface TextMessageProps {
    msg: any;
    isMe: boolean;
    recipient: any;
    onEdit?: (msg: any) => void;
    onDelete?: (id: string) => void;
    isActive?: boolean;
    onToggleActive?: () => void;
}

const TextMessage: React.FC<TextMessageProps> = ({
    msg,
    isMe,
    recipient,
    onEdit,
    onDelete,
    isActive,
    onToggleActive
}) => {
    return (
        <div className={cn("flex items-start gap-3 max-w-2xl", isMe && "flex-col items-end gap-1 ml-auto")}>
            {!isMe && (
                <UserAvatar 
                    src={recipient.profileImage} 
                    name={recipient.name} 
                    size="w-8 h-8" 
                    className="mt-1"
                />
            )}
            
            <div className={cn("flex flex-col gap-1 w-full max-w-xl", isMe ? "items-end" : "items-start")}>
                <div 
                    onClick={onToggleActive}
                    className={cn(
                        "p-4 rounded-2xl text-sm font-sans leading-relaxed transition-all cursor-pointer relative",
                        isMe 
                            ? (msg.status === "sending" ? "bg-blue-400 opacity-70 rounded-tr-none" : "bg-[#0A47C2] text-white rounded-tr-none")
                            : "bg-[#E0EAFF] text-[#0D1C35] rounded-tl-none"
                    )}
                >
                    {msg.text}
                    {msg.files && msg.files.map((file: any) => (
                        <div key={file._id} className="mt-2">
                            {file.mimeType?.startsWith("image/") ? (
                                <div className="mt-2 max-w-[280px] rounded-xl overflow-hidden border border-gray-100 shadow-sm transition-transform hover:scale-[1.02]">
                                    <img 
                                        src={getImageUrl(file.url)} 
                                        alt="attachment" 
                                        className="w-full h-auto max-h-[350px] object-cover cursor-zoom-in"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            window.open(getImageUrl(file.url), '_blank');
                                        }}
                                    />
                                </div>
                            ) : file.mimeType?.startsWith("video/") ? (
                                <div className="mt-2 max-w-[280px] rounded-xl overflow-hidden border border-gray-100 shadow-sm">
                                    <video 
                                        src={getImageUrl(file.url)} 
                                        controls 
                                        className="w-full h-auto max-h-[350px] object-cover" 
                                    />
                                </div>
                            ) : (
                                <div className="mt-2">
                                    <a 
                                        href={getImageUrl(file.url)} 
                                        target="_blank" 
                                        rel="noreferrer" 
                                        className={cn("underline font-bold block", isMe ? "text-blue-200" : "text-blue-600")}
                                    >
                                        {file.fileName || "Download Attachment"}
                                    </a>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {isMe && isActive && msg.status !== "sending" && (
                    <div className="flex items-center justify-end gap-3 px-2 py-1 bg-white border border-gray-100 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 mr-2">
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onEdit?.(msg);
                            }}
                            className="text-xs font-bold text-blue-600 hover:text-blue-700 font-sans"
                        >
                            Edit
                        </button>
                        <div className="w-1px h-3 bg-gray-200" />
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onDelete?.(msg._id);
                            }}
                            className="text-xs font-bold text-red-500 hover:text-red-600 font-sans"
                        >
                            Delete
                        </button>
                    </div>
                )}

                <span className={cn(
                    "text-[10px] text-gray-400 font-bold flex items-center gap-1",
                    isMe ? "justify-end text-right" : "justify-start text-left ml-1"
                )}>
                    {msg.isEdited && <span className="italic mr-1 text-gray-300 font-normal">(edited)</span>}
                    {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                    {isMe && msg.status === "sending" && <Loader2 size={10} className="animate-spin" />}
                </span>
            </div>
        </div>
    );
};

export default TextMessage;
