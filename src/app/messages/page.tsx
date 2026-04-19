"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import {
    Search,
    Send,
    Smile,
    Paperclip,
    MoreHorizontal,
    Loader2,
    Calendar as CalendarIcon,
    Clock,
    Check,
    X
} from "lucide-react";
import api from "@/lib/axios";
import { toast } from "sonner";
import Link from "next/link";
import CreateOfferModal from "@/components/shared/CreateOfferModal";
import { formatDistanceToNow } from "date-fns";
import { io } from "socket.io-client";
import Swal from "sweetalert2";

interface Participant {
    _id: string;
    name: string;
    email: string;
    profileImage?: string;
}

interface LastMessage {
    _id: string;
    text: string;
    createdAt: string;
    senderId: string;
}

interface Conversation {
    _id: string;
    participantIds: Participant[];
    lastMessage?: LastMessage;
    unreadCount: number;
    updatedAt: string;
}

const getImageUrl = (path?: string) => {
    if (!path) return "/authpic.jpg"; // Default fallback
    if (path.startsWith("http")) return path;
    return `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://10.10.7.24:5010'}${path}`;
};

export default function MessagesPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const targetConversationId = searchParams.get("conversationId");

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(targetConversationId);

    // Fallback/Mock for messages in the selected conversation
    const [messages, setMessages] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [sending, setSending] = useState(false);
    const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

    const [hourlyClass, setHourlyClass] = useState<any>(null);
    const [loadingHourlyClass, setLoadingHourlyClass] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);

    // File attachments
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedConvRef = useRef<string | null>(selectedConvId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        selectedConvRef.current = selectedConvId;
    }, [selectedConvId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Setup Socket
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || 'http://10.10.7.24:5010';

        const socket = io(baseUrl, {
            auth: { token },
            query: { token }
        });

        socket.on("newMessage", (data: any) => {
            const msg = data.message || data.data || data; // Extract message object based on backend structure

            // If the message belongs to the current open conversation, show it at the bottom
            if (msg.conversationId === selectedConvRef.current) {
                setMessages(prev => {
                    if (prev.some(m => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });
            }

            // Update conversations sidebar (push to top)
            setConversations(prev => {
                const targetConv = prev.find(c => c._id === msg.conversationId);
                if (targetConv) {
                    const updatedConv = {
                        ...targetConv,
                        lastMessage: msg,
                        updatedAt: msg.createdAt || new Date().toISOString()
                    };
                    const remaining = prev.filter(c => c._id !== msg.conversationId);
                    return [updatedConv, ...remaining]; // Top of the list
                }
                return prev;
            });
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await api.get("/messages/conversations?page=1&limit=50");
                if (response.data.success) {
                    setConversations(response.data.data);

                    // If no target ID from URL, but we have conversations, select the first one
                    if (!selectedConvId && response.data.data.length > 0) {
                        setSelectedConvId(response.data.data[0]._id);
                    }
                }
            } catch (error) {
                console.error("Failed to load conversations:", error);
                toast.error("Could not load conversations.");
            } finally {
                setLoadingConversations(false);
            }
        };

        fetchConversations();
    }, []);

    // Derived selected conversation
    const selectedConversation = conversations.find(c => c._id === selectedConvId);
    // Assuming 1-on-1, participantIds[0] is the other user
    const recipient = selectedConversation?.participantIds?.[0];

    const fetchMessages = async (convId: string) => {
        setLoadingMessages(true);
        try {
            const response = await api.get(`/messages/conversations/${convId}/messages?page=1&limit=50`);
            if (response.data.success) {
                setMessages(response.data.data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            // Ignore error for now, as endpoint might not exist yet
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        if (selectedConvId) {
            fetchMessages(selectedConvId);
            // Optionally, update URL without refresh
            router.replace(`/messages?conversationId=${selectedConvId}`, { scroll: false });
        }
    }, [selectedConvId, router]);

    useEffect(() => {
        const fetchHourlyClass = async () => {
            if (!recipient?._id) return;
            setLoadingHourlyClass(true);
            try {
                const response = await api.get(`/hourly-classes/teacher/${recipient._id}`);
                if (response.data.success) {
                    setHourlyClass(response.data.data);
                } else {
                    setHourlyClass(null);
                }
            } catch (error) {
                console.error("Failed to fetch hourly class:", error);
                setHourlyClass(null);
            } finally {
                setLoadingHourlyClass(false);
            }
        };

        if (recipient?._id) {
            fetchHourlyClass();
        } else {
            setHourlyClass(null);
        }
    }, [recipient]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!messageInput.trim() && selectedFiles.length === 0) || !selectedConvId) return;

        setSending(true);
        try {
            let response;
            const formData = new FormData();
            formData.append("conversationId", selectedConvId);
            if (messageInput.trim()) {
                formData.append("text", messageInput.trim());
            }
            if (selectedFiles.length > 0) {
                selectedFiles.forEach((file) => {
                    formData.append("files", file);
                });
            }

            response = await api.post("/messages/send", formData);

            if (response.data.success) {
                const newMessage = response.data.data;
                setMessages(prev => [...prev, newMessage]);
                setMessageInput("");
                setSelectedFiles([]);
                scrollToBottom();

                // Optimistically update conversation list to jump to top
                setConversations(prev => {
                    const existing = prev.find(c => c._id === selectedConvId);
                    if (!existing) return prev;
                    const updatedConv = {
                        ...existing,
                        lastMessage: newMessage,
                        updatedAt: new Date().toISOString()
                    };
                    const remaining = prev.filter(c => c._id !== selectedConvId);
                    return [updatedConv, ...remaining];
                });
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            toast.error("Failed to send message.");
        } finally {
            setSending(false);
        }
    };

    const handleSendOffer = async (offerData: any) => {
        if (!selectedConvId) return;

        try {
            const formData = new FormData();
            formData.append("conversationId", selectedConvId);
            formData.append("type", "OFFER");
            formData.append("text", `OFFER:${JSON.stringify(offerData)}`);
            
            const response = await api.post("/messages/send", formData);
            if (response.data.success) {
                const newMessage = response.data.data;
                setMessages(prev => [...prev, newMessage]);
                scrollToBottom();
                toast.success("Offer sent successfully!");
            }
        } catch (error) {
            console.error("Failed to send offer:", error);
            toast.error("Failed to send offer.");
        }
    };

    const handleEditMessage = async (msg: any) => {
        const { value: newText } = await Swal.fire({
            title: "Edit Message",
            input: "text",
            inputValue: msg.text,
            showCancelButton: true,
            confirmButtonText: "Save Changes",
            confirmButtonColor: "#0A47C2",
        });

        if (newText !== undefined && newText.trim() !== "" && newText !== msg.text) {
            try {
                const response = await api.patch(`/messages/${msg._id}`, { text: newText.trim() });
                if (response.data.success) {
                    setMessages(prev => prev.map(m => m._id === msg._id ? { ...m, text: newText.trim(), isEdited: true } : m));
                    toast.success("Message updated successfully!");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to update message.");
            }
        }
    };

    const handleDeleteMessage = async (id: string) => {
        const result = await Swal.fire({
            title: "Delete message?",
            text: "This action cannot be undone.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/messages/${id}`);
                if (response.data.success) {
                    setMessages(prev => prev.filter(m => m._id !== id));
                    toast.success("Message deleted successfully!");
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to delete message.");
            }
        }
    };

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            {/* Chat Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col shrink-0 bg-white">
                <div className="p-6 space-y-4">
                    <Link href="/" className="inline-block">
                        <Image src="/logo2.svg" alt="Educate Logo" width={161} height={60} className="w-32 h-auto" />
                    </Link>
                    <h2 className="text-xl font-bold text-[#0D1C35] font-sans">Messages</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search conversations..."
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {loadingConversations ? (
                        <div className="flex justify-center py-10 text-[#0A47C2]">
                            <Loader2 className="animate-spin" />
                        </div>
                    ) : conversations.length === 0 ? (
                        <div className="text-center py-10 px-4 text-sm text-gray-400">
                            No conversations found.
                        </div>
                    ) : (
                        conversations.map((conv) => {
                            const otherUser = conv.participantIds?.[0];
                            if (!otherUser) return null;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => setSelectedConvId(conv._id)}
                                    className={`px-6 py-4 flex items-center gap-3 cursor-pointer transition-colors relative ${selectedConvId === conv._id ? "bg-[#E0EAFF]" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden bg-gray-100">
                                        <Image
                                            src={getImageUrl(otherUser.profileImage)}
                                            unoptimized
                                            alt={otherUser.name || "User"}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-0.5">
                                            <h3 className="text-sm font-bold text-[#0D1C35] font-sans truncate">{otherUser.name || "Unknown User"}</h3>
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {conv.lastMessage?.createdAt
                                                    ? formatDistanceToNow(new Date(conv.lastMessage.createdAt), { addSuffix: true })
                                                    : ""}
                                            </span>
                                        </div>
                                        <p className="text-[11px] text-gray-500 font-medium font-sans truncate line-clamp-1">
                                            {conv.lastMessage?.text || "Started a conversation"}
                                        </p>
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 bg-[#0A47C2] flex items-center justify-center rounded-full text-white text-[9px] font-bold">
                                            {conv.unreadCount}
                                        </div>
                                    )}
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col bg-gray-50/30">
                {selectedConversation && recipient ? (
                    <>
                        {/* Chat Header */}
                        <div className="h-20 border-b border-gray-100 flex items-center justify-between px-8 shrink-0 bg-white shadow-sm z-10">
                            <div className="flex items-center gap-4">
                                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 border border-gray-100">
                                    <Image src={getImageUrl(recipient.profileImage)} alt={recipient.name} unoptimized fill className="object-cover" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-[#0D1C35] font-sans">{recipient.name}</h2>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-4">
                                {hourlyClass && (
                                    <button 
                                        onClick={() => setIsOfferModalOpen(true)}
                                        className="px-6 py-2.5 bg-[#0A47C2] text-white text-xs font-bold rounded-xl font-sans hover:bg-[#083a9e] transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                                    >
                                        <CalendarIcon size={14} />
                                        Create a offer
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Offer Modal */}
                        <CreateOfferModal
                            isOpen={isOfferModalOpen}
                            onClose={() => setIsOfferModalOpen(false)}
                            tutor={hourlyClass}
                            onSendOffer={handleSendOffer}
                        />

                        {/* Messages Window */}
                        <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-4">
                            {loadingMessages ? (
                                <div className="flex justify-center items-center h-full text-[#0A47C2]">
                                    <Loader2 className="animate-spin w-8 h-8" />
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="flex justify-center items-center h-full flex-col gap-3 text-gray-400">
                                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center text-[#0A47C2]">
                                        <Send size={24} className="ml-1" />
                                    </div>
                                    <p className="text-sm font-medium">Say hello to {recipient.name}!</p>
                                </div>
                            ) : (
                                messages.map((msg, idx) => {
                                    // A very simple heuristic for "is me": usually API doesn't populate Participant object for your own self id if you are the user, 
                                    // or you need a persistent `user` context. For mockup, we can check if senderId !== recipient._id
                                    const isMe = msg.senderId !== recipient._id;

                                    if (!isMe) {
                                        if (msg.type === "OFFER" || msg.text?.startsWith("OFFER:")) {
                                            let offerData: any = {};
                                            try {
                                                const jsonStr = msg.text.replace("OFFER:", "");
                                                offerData = JSON.parse(jsonStr);
                                            } catch (e) {
                                                console.error("Failed to parse offer data", e);
                                            }

                                            return (
                                                <div key={msg._id || idx} className="flex items-start gap-3 max-w-2xl">
                                                    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                                                        <Image src={getImageUrl(recipient.profileImage)} alt={recipient.name} fill className="object-cover" />
                                                    </div>
                                                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 max-w-xs space-y-6">
                                                        <h4 className="text-sm font-bold text-gray-700">Booking offer</h4>
                                                        
                                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                                                            <p className="text-sm font-bold text-[#0D1C35]">{offerData.subject || "General Class"}</p>
                                                        </div>

                                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                                            <p className="text-sm font-bold text-[#0D1C35]">${offerData.totalPrice || 0}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{offerData.slots?.length || 0} Slots</p>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3">
                                                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2">
                                                                <Clock size={14} className="text-blue-400" />
                                                                <span className="text-[10px] font-bold text-[#0D1C35]">
                                                                    {offerData.slots?.[0].startTime} – {offerData.slots?.[0].endTime}
                                                                </span>
                                                            </div>
                                                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2">
                                                                <CalendarIcon size={14} className="text-blue-400" />
                                                                <span className="text-[10px] font-bold text-[#0D1C35]">{offerData.date || "Date"}</span>
                                                            </div>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 pt-2">
                                                            <button className="py-3 border border-red-100 text-red-500 font-bold text-[10px] rounded-2xl hover:bg-red-50 transition-all uppercase tracking-widest">Decline</button>
                                                            <button className="py-3 bg-[#0A47C2] text-white font-bold text-[10px] rounded-2xl hover:bg-[#083a9e] transition-all uppercase tracking-widest shadow-lg shadow-blue-100">Accept</button>
                                                            <button className="py-3 border border-amber-100 text-amber-500 font-bold text-[10px] rounded-2xl hover:bg-amber-50 transition-all uppercase tracking-widest">Cancel</button>
                                                            <button className="py-3 border border-blue-100 text-blue-500 font-bold text-[10px] rounded-2xl hover:bg-blue-50 transition-all uppercase tracking-widest">Reschedule</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }

                                        return (
                                            <div key={msg._id || idx} className="flex items-start gap-3 max-w-2xl">
                                                <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                                                    <Image src={getImageUrl(recipient.profileImage)} alt={recipient.name} fill className="object-cover" />
                                                </div>
                                                <div className="space-y-1">
                                                    <div className="bg-[#E0EAFF] p-4 rounded-2xl rounded-tl-none text-sm text-[#0D1C35] font-sans leading-relaxed">
                                                        {msg.text}
                                                        {msg.files && msg.files.map((file: any) => (
                                                            <div key={file._id} className="mt-2">
                                                                {file.mimeType?.startsWith("image/") ? (
                                                                    <img src={getImageUrl(file.url)} alt="attachment" className="rounded-xl max-w-full h-auto" />
                                                                ) : file.mimeType?.startsWith("video/") ? (
                                                                    <video src={getImageUrl(file.url)} controls className="rounded-xl max-w-full h-auto" />
                                                                ) : (
                                                                    <a href={getImageUrl(file.url)} target="_blank" rel="noreferrer" className="underline text-blue-600 font-bold block">{file.fileName || "Download Attachment"}</a>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-bold ml-1">
                                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                    </span>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        if (msg.type === "OFFER" || msg.text?.startsWith("OFFER:")) {
                                            let offerData: any = {};
                                            try {
                                                const jsonStr = msg.text.replace("OFFER:", "");
                                                offerData = JSON.parse(jsonStr);
                                            } catch (e) {
                                                console.error("Failed to parse offer data", e);
                                            }

                                            return (
                                                <div key={msg._id || idx} className="flex flex-col items-end gap-1 mb-4">
                                                    <div className="bg-white rounded-3xl p-6 shadow-xl border border-blue-50 w-full max-w-xs space-y-6">
                                                        <h4 className="text-sm font-bold text-gray-700">Sent booking offer</h4>
                                                        
                                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Subject</p>
                                                            <p className="text-sm font-bold text-[#0D1C35]">{offerData.subject || "General Class"}</p>
                                                        </div>

                                                        <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                                                            <p className="text-sm font-bold text-[#0D1C35]">${offerData.totalPrice || 0}</p>
                                                            <p className="text-[10px] font-bold text-gray-400 uppercase">{offerData.slots?.length || 0} Slots</p>
                                                        </div>

                                                        <div className="grid grid-cols-2 gap-3 text-right">
                                                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2 justify-end">
                                                                <span className="text-[10px] font-bold text-[#0D1C35]">
                                                                    {offerData.slots?.[0].startTime} – {offerData.slots?.[0].endTime}
                                                                </span>
                                                                <Clock size={14} className="text-blue-400" />
                                                            </div>
                                                            <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 flex items-center gap-2 justify-end">
                                                                <span className="text-[10px] font-bold text-[#0D1C35]">{offerData.date || "Date"}</span>
                                                                <CalendarIcon size={14} className="text-blue-400" />
                                                            </div>
                                                        </div>

                                                        <div className="pt-2">
                                                            <p className="text-center text-[10px] font-bold text-gray-400 uppercase tracking-widest">Waiting for response</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-[10px] text-gray-400 font-bold block text-right">
                                                        {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                    </span>
                                                </div>
                                            );
                                        }
                                        const isActive = activeMessageId === (msg._id || idx);
                                        return (
                                            <div key={msg._id || idx} className="flex flex-col items-end gap-1">
                                                <div
                                                    onClick={() => setActiveMessageId(isActive ? null : (msg._id || idx))}
                                                    className="flex items-start justify-end gap-3 group cursor-pointer max-w-xl"
                                                >
                                                    <div className="space-y-1">
                                                        <div className="bg-[#0A47C2] p-4 rounded-2xl rounded-tr-none text-sm text-white font-sans leading-relaxed text-right">
                                                            {msg.text}
                                                            {msg.files && msg.files.map((file: any) => (
                                                                <div key={file._id} className="mt-2">
                                                                    {file.mimeType?.startsWith("image/") ? (
                                                                        <img src={getImageUrl(file.url)} alt="attachment" className="rounded-xl max-w-full h-auto" />
                                                                    ) : file.mimeType?.startsWith("video/") ? (
                                                                        <video src={getImageUrl(file.url)} controls className="rounded-xl max-w-full h-auto" />
                                                                    ) : (
                                                                        <a href={getImageUrl(file.url)} target="_blank" rel="noreferrer" className="underline text-blue-200 font-bold block">{file.fileName || "Download Attachment"}</a>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <span className="text-[10px] text-gray-400 font-bold block text-right">
                                                            {msg.isEdited && <span className="italic mr-2 text-gray-300 font-normal">(edited)</span>}
                                                            {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                                                        </span>
                                                    </div>
                                                </div>

                                                {isActive && (
                                                    <div className="flex items-center justify-end gap-3 px-2 py-1 bg-white border border-gray-100 rounded-lg shadow-sm animate-in fade-in slide-in-from-top-2 duration-200 mr-2">
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleEditMessage(msg);
                                                                setActiveMessageId(null);
                                                            }}
                                                            className="text-xs font-bold text-blue-600 hover:text-blue-700 font-sans"
                                                        >
                                                            Edit
                                                        </button>
                                                        <div className="w-[1px] h-3 bg-gray-200" />
                                                        <button
                                                            type="button"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleDeleteMessage(msg._id);
                                                                setActiveMessageId(null);
                                                            }}
                                                            className="text-xs font-bold text-red-500 hover:text-red-600 font-sans"
                                                        >
                                                            Delete
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    }
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Message Input */}
                        <form onSubmit={handleSendMessage} className="p-6 border-t border-gray-100 bg-white relative">
                            {selectedFiles.length > 0 && (
                                <div className="absolute bottom-full left-6 mb-2 p-3 bg-white rounded-xl shadow-lg border border-gray-100 flex gap-3 overflow-x-auto max-w-[calc(100%-3rem)] z-20">
                                    {selectedFiles.map((f, i) => (
                                        <div key={i} className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                            {f.type.startsWith('image/') ? (
                                                <Image src={URL.createObjectURL(f)} alt="preview" fill className="object-cover" />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[10px] text-gray-500 font-bold p-1 overflow-hidden break-all text-center">
                                                    {f.name.substring(0, 10)}..
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute top-0 right-0 bg-red-500 text-white w-5 h-5 flex items-center justify-center rounded-bl-md hover:bg-red-600 transition-colors"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="relative group flex items-center gap-2">
                                <input
                                    type="file"
                                    hidden
                                    multiple
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                                        }
                                        e.target.value = ""; // reset
                                    }}
                                />
                                <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-[#0A47C2] hover:bg-blue-50 rounded-full transition-all shrink-0">
                                    <Paperclip size={20} />
                                </button>
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={messageInput}
                                        onChange={(e) => setMessageInput(e.target.value)}
                                        placeholder="Write your message..."
                                        className="w-full pl-6 pr-14 py-4 bg-gray-50 border border-gray-100 shadow-inner rounded-full text-sm focus:outline-none focus:ring-1 focus:bg-white focus:ring-blue-100 font-sans transition-all"
                                    />
                                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
                                        <button
                                            type="submit"
                                            disabled={sending || (!messageInput.trim() && selectedFiles.length === 0)}
                                            className="p-2.5 bg-[#0A47C2] text-white rounded-full hover:shadow-lg disabled:opacity-50 transition-all flex items-center justify-center"
                                        >
                                            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} className="ml-0.5" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-gray-50/50">
                        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center text-[#0A47C2] mb-6 shadow-inner">
                            <Send size={40} className="ml-2" />
                        </div>
                        <h2 className="text-2xl font-bold text-[#0D1C35] mb-2 font-sans">Your Messages</h2>
                        <p className="text-gray-500 max-w-sm">Select a conversation from the sidebar to start chatting, or browse tutors to start a new conversation.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
