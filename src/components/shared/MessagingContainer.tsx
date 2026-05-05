"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
    Search,
    Send,
    Paperclip,
    MoreVertical,
    Calendar as CalendarIcon,
    Clock,
    Shield,
    Check,
    X,
    Loader2,
    Calendar,
    ChevronLeft
} from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { io } from "socket.io-client";
import Swal from "sweetalert2";
import { toast } from "sonner";

import api from "@/lib/axios";
import { getImageUrl, cn } from "@/lib/utils";
import CreateOfferModal from "@/components/shared/CreateOfferModal";
import UserAvatar from "@/components/ui/UserAvatar";
import MessageItem from "./messages/MessageItem";
import { useAuthStore } from "@/store/useAuthStore";

interface Participant {
    _id: string;
    name: string;
    profileImage?: string;
    role: string;
}

interface Message {
    _id: string;
    senderId: string | Participant;
    text: string;
    type: string;
    files?: any[];
    status?: string;
    isEdited?: boolean;
    createdAt: string;
}

interface Conversation {
    _id: string;
    participantIds: Participant[];
    lastMessage?: Message;
    unreadCount: number;
    updatedAt: string;
}

interface MessagingContainerProps {
    hideLogo?: boolean;
    showHeader?: boolean;
}

export default function MessagingContainer({ hideLogo = false, showHeader = true }: MessagingContainerProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const targetConversationId = searchParams.get("conversationId");
    const user = useAuthStore((state) => state.user);

    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [loadingConversations, setLoadingConversations] = useState(true);
    const [selectedConvId, setSelectedConvId] = useState<string | null>(targetConversationId);

    const [messages, setMessages] = useState<any[]>([]);
    const [loadingMessages, setLoadingMessages] = useState(false);
    const [messageInput, setMessageInput] = useState("");
    const [sending, setSending] = useState(false);
    const [activeMessageId, setActiveMessageId] = useState<string | null>(null);

    const [hourlyClass, setHourlyClass] = useState<any>(null);
    const [loadingHourlyClass, setLoadingHourlyClass] = useState(false);
    const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
    const [editingOfferId, setEditingOfferId] = useState<string | null>(null);
    const [initialOfferData, setInitialOfferData] = useState<any>(null);
    const [payingOfferId, setPayingOfferId] = useState<string | null>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const selectedConvRef = useRef<string | null>(selectedConvId);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        selectedConvRef.current = selectedConvId;
        if (selectedConvId) {
            fetchMessages(selectedConvId);
        }
    }, [selectedConvId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Setup Socket
    useEffect(() => {
        if (!user?._id) return;

        const token = localStorage.getItem("accessToken");
        const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '') || process.env.NEXT_PUBLIC_IMAGE_URL || '';

        const socket = io(baseUrl, {
            auth: { 
                token,
                _id: user._id 
            },
            query: { token }
        });

        // 1. New Conversation Event
        socket.on("conversation", (newConversation: any) => {
            setConversations(prev => {
                if (prev.some(c => c._id === newConversation._id)) return prev;
                return [newConversation, ...prev];
            });
        });

        // 2. New Message Event
        socket.on("message", (msg: any) => {
            // Update messages list if it's the current conversation
            if (msg.conversationId === selectedConvRef.current) {
                setMessages(prev => {
                    if (prev.some(m => m._id === msg._id)) return prev;
                    return [...prev, msg];
                });
                
                // Mark as read immediately if active
                api.patch(`/messages/${msg._id}/read`).catch(console.error);
            }

            // Update conversation preview and unread count in sidebar
            setConversations(prev => {
                return prev.map(c => {
                    if (c._id === msg.conversationId) {
                        return {
                            ...c,
                            lastMessage: msg,
                            updatedAt: msg.createdAt,
                            unreadCount: msg.conversationId === selectedConvRef.current ? c.unreadCount : (c.unreadCount || 0) + 1
                        };
                    }
                    return c;
                }).sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
            });
        });

        // 3. Notification Event
        socket.on("notification", (data: any) => {
            const { conversationId, message } = data;
            if (conversationId !== selectedConvRef.current) {
                toast.info(`New message from ${message.senderId?.name || 'User'}`, {
                    description: message.text?.substring(0, 50) + (message.text?.length > 50 ? '...' : ''),
                    action: {
                        label: "View",
                        onClick: () => setSelectedConvId(conversationId)
                    }
                });
            }
        });

        // 4. Update Message Event (Offer status changes)
        socket.on("update", (updatedMessage: any) => {
            if (updatedMessage.conversationId === selectedConvRef.current) {
                setMessages(prev => prev.map(m => m._id === updatedMessage._id ? { ...m, ...updatedMessage } : m));
            }
            
            setConversations(prev => prev.map(c => {
                if (c._id === updatedMessage.conversationId && c.lastMessage?._id === updatedMessage._id) {
                    return { ...c, lastMessage: updatedMessage };
                }
                return c;
            }));
        });

        // 5. Read Receipt Event
        socket.on("read", (data: any) => {
            const { conversationId, userId } = data;
            if (conversationId === selectedConvRef.current) {
                // If the other user read our messages, we could show read indicators
                // For now, let's just update the local status if needed
            }
            
            if (userId === user._id) {
                setConversations(prev => prev.map(c => 
                    c._id === conversationId ? { ...c, unreadCount: 0 } : c
                ));
            }
        });

        // 6. Delete Message Event
        socket.on("delete", (data: any) => {
            const { messageId, conversationId } = data;
            if (conversationId === selectedConvRef.current) {
                setMessages(prev => prev.filter(m => m._id !== messageId));
            }
            
            setConversations(prev => prev.map(c => {
                if (c._id === conversationId && c.lastMessage?._id === messageId) {
                    // This is tricky as we don't know the previous message without fetching
                    // For now, let's just clear the last message preview
                    return { ...c, lastMessage: undefined };
                }
                return c;
            }));
        });

        return () => {
            socket.disconnect();
        };
    }, [user?._id]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const response = await api.get("/messages/conversations?page=1&limit=50");
                if (response.data.success) {
                    // Filter conversations to ensure lastMessage doesn't show deleted content
                    const processedConvs = response.data.data.map((conv: any) => {
                        if (conv.lastMessage && (conv.lastMessage.isDeleted || conv.lastMessage.status === "DELETED")) {
                            return { ...conv, lastMessage: undefined };
                        }
                        return conv;
                    });
                    setConversations(processedConvs);
                    if (!selectedConvId && response.data.data.length > 0) {
                        setSelectedConvId(response.data.data[0]._id);
                    }
                }
            } catch (error) {
                console.error("Failed to load conversations:", error);
            } finally {
                setLoadingConversations(false);
            }
        };

        fetchConversations();
    }, []);

    const selectedConversation = conversations.find(c => c._id === selectedConvId);
    const recipient = selectedConversation?.participantIds?.find(p => p._id !== user?._id);

    const fetchMessages = async (convId: string) => {
        setLoadingMessages(true);
        try {
            const response = await api.get(`/messages/conversations/${convId}/messages?page=1&limit=50`);
            if (response.data.success) {
                // Filter out soft-deleted messages
                const activeMessages = response.data.data.filter((m: any) =>
                    !m.isDeleted && m.status !== "DELETED"
                );
                setMessages(activeMessages);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
            setMessages([]);
        } finally {
            setLoadingMessages(false);
        }
    };

    useEffect(() => {
        const fetchHourlyClass = async () => {
            // Determine whose hourly class to fetch:
            // - If student: fetch the recipient's class (tutor)
            // - If teacher: fetch their own class (themselves)
            const targetId = user?.role === "TEACHER" ? user?._id : recipient?._id;

            if (!targetId) return;
            setLoadingHourlyClass(true);
            try {
                const response = await api.get(`/hourly-classes/teacher/${targetId}`);
                if (response.data.success) {
                    setHourlyClass(response.data.data);
                } else {
                    setHourlyClass(null);
                }
            } catch (error) {
                setHourlyClass(null);
            } finally {
                setLoadingHourlyClass(false);
            }
        };

        if (recipient?._id || user?.role === "TEACHER") {
            fetchHourlyClass();
        } else {
            setHourlyClass(null);
        }
    }, [recipient, user]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!messageInput.trim() && selectedFiles.length === 0) || !selectedConvId) return;

        const originalText = messageInput;
        setMessageInput("");
        setSending(true);

        // Optimistic message
        const tempId = Date.now().toString();
        const optimisticMsg = {
            _id: tempId,
            senderId: user?._id,
            text: originalText,
            createdAt: new Date().toISOString(),
            status: "sending"
        };
        setMessages(prev => [...prev, optimisticMsg]);

        try {
            const formData = new FormData();
            formData.append("conversationId", selectedConvId);
            formData.append("text", originalText);
            selectedFiles.forEach(file => formData.append("files", file));

            const response = await api.post("/messages/send", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (response.data.success) {
                const realMsg = response.data.data;
                setMessages(prev => prev.map(m => m._id === tempId ? realMsg : m));
                setSelectedFiles([]);

                // Update conversation list
                setConversations(prev => {
                    const targetConv = prev.find(c => c._id === selectedConvId);
                    if (targetConv) {
                        const updatedConv = {
                            ...targetConv,
                            lastMessage: realMsg,
                            updatedAt: new Date().toISOString()
                        };
                        const remaining = prev.filter(c => c._id !== selectedConvId);
                        return [updatedConv, ...remaining];
                    }
                    return prev;
                });
            }
        } catch (error) {
            console.error("Failed to send message:", error);
            setMessages(prev => prev.filter(m => m._id !== tempId));
            setMessageInput(originalText);
            toast.error("Failed to send message.");
        } finally {
            setSending(false);
        }
    };

    const handleSendOffer = async (offerData: any) => {
        if (!selectedConvId) return;

        try {
            if (editingOfferId) {
                const response = await api.post(`/messages/${editingOfferId}/reschedule`, {
                    conversationId: selectedConvId,
                    type: "OFFER",
                    slotId: offerData.slotId,
                    subject: offerData.subject,
                    text: `OFFER:${JSON.stringify(offerData)}`
                });
                if (response.data.success) {
                    const updatedMsg = response.data.data;
                    setMessages(prev => prev.map(m => m._id === editingOfferId ? { ...m, ...updatedMsg } : m));
                    toast.success("Offer rescheduled successfully!");
                }
            } else {
                const formData = new FormData();
                formData.append("conversationId", selectedConvId);
                formData.append("type", "OFFER");
                formData.append("slotId", offerData.slotId);
                formData.append("subject", offerData.subject);
                formData.append("text", `OFFER:${JSON.stringify(offerData)}`);

                const response = await api.post("/messages/send", formData, {
                    headers: { "Content-Type": "multipart/form-data" }
                });
                if (response.data.success) {
                    const newMessage = response.data.data;
                    setMessages(prev => [...prev, newMessage]);
                    toast.success("Offer sent successfully!");
                }
            }
        } catch (error) {
            toast.error("Failed to process offer.");
        } finally {
            setEditingOfferId(null);
            setInitialOfferData(null);
        }
    };

    const handleCancelOffer = async (messageId: string) => {
        const msg = messages.find(m => m._id === messageId);
        const isMe = msg?.senderId?._id === user?._id || msg?.senderId === user?._id;

        try {
            const response = await api.post(`/messages/${messageId}/reject`);
            if (response.data.success) {
                const updatedMsg = response.data.data || { _id: messageId, status: "REJECTED" };
                setMessages(prev => prev.map(m => m._id === messageId ? { ...m, ...updatedMsg, status: "REJECTED" } : m));
                toast.success(`Offer ${isMe ? "cancelled" : "declined"}.`);
            }
        } catch (error) {
            toast.error(`Failed to ${isMe ? "cancel" : "decline"} offer.`);
        }
    };

    const handleAcceptOffer = async (messageId: string) => {
        try {
            const response = await api.post(`/messages/${messageId}/accept`);
            if (response.data.success) {
                const updatedMsg = response.data.data || { _id: messageId, status: "ACCEPTED" };
                setMessages(prev => prev.map(m => m._id === messageId ? { ...m, ...updatedMsg, status: "ACCEPTED" } : m));
                toast.success("Offer accepted!");
            }
        } catch (error) {
            toast.error("Failed to accept offer.");
        }
    };

    const handlePayOffer = async (msg: any) => {
        setPayingOfferId(msg._id);
        try {
            let offerData: any = {};
            try {
                const jsonStr = msg.text.replace("OFFER:", "");
                offerData = JSON.parse(jsonStr);
            } catch (e) {
                console.error("Failed to parse offer data for payment", e);
                toast.error("Invalid offer data.");
                return;
            }

            const response = await api.post("/class-payments/initiate-payment", {
                classType: "HOURLY_CLASS",
                classId: offerData.hourlyClassId,
                slotId: offerData.slotId,
                messageId: msg._id,
                currency: "KWD"
            });

            if (response.data.success && response.data.data.paymentUrl) {
                window.location.href = response.data.data.paymentUrl;
            } else {
                toast.error("Failed to get payment link.");
            }
        } catch (error: any) {
            console.error("Payment initiation failed:", error);
            const errorMsg = error.response?.data?.message || "Failed to initiate payment. Please try again.";
            toast.error(errorMsg);
        } finally {
            setPayingOfferId(null);
        }
    };

    const handleRescheduleOffer = (msg: any) => {
        try {
            let offerData: any = {};
            if (msg.text?.startsWith("OFFER:")) {
                const jsonStr = msg.text.replace("OFFER:", "");
                offerData = JSON.parse(jsonStr);
            } else {
                // Support new structured API response
                offerData = {
                    subject: msg.subject,
                    slotId: msg.slot?._id || msg.slotId,
                    slots: msg.slot ? [msg.slot] : (msg.slots || []),
                    date: msg.date || msg.slot?.date,
                    totalPrice: msg.totalPrice || msg.price || msg.slot?.price || 0,
                    hourlyClassId: msg.slot?.hourlyClassId || msg.hourlyClassId,
                };
            }
            setInitialOfferData(offerData);
            setEditingOfferId(msg._id);
            setIsOfferModalOpen(true);
        } catch (e) {
            toast.error("Could not load offer data.");
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
            confirmButtonText: "Yes, delete it!"
        });

        if (result.isConfirmed) {
            try {
                const response = await api.delete(`/messages/${id}`);
                if (response.data.success) {
                    // 1. Calculate the new messages list first
                    const updatedMessages = messages.filter(m => m._id !== id);

                    // 2. Remove from current message list
                    setMessages(updatedMessages);

                    // 3. Update conversation list last message preview
                    setConversations(prev => prev.map(conv => {
                        if (conv._id === selectedConvId && conv.lastMessage?._id === id) {
                            // Use the updated list we just calculated
                            const newLastMessage = updatedMessages.length > 0
                                ? updatedMessages[updatedMessages.length - 1]
                                : undefined;

                            return {
                                ...conv,
                                lastMessage: newLastMessage
                            };
                        }
                        return conv;
                    }));

                    toast.success("Message deleted successfully!");
                }
            } catch (error) {
                toast.error("Failed to delete message.");
            }
        }
    };

    return (
        <div className="flex h-full overflow-hidden bg-white">
            {/* Chat Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col shrink-0 bg-white">
                {showHeader && (
                    <div className="p-6 space-y-4">
                        {!hideLogo && (
                            <Link href="/" className="inline-block">
                                <Image src="/logo2.svg" alt="Educate Logo" width={161} height={60} className="w-32 h-auto" unoptimized />
                            </Link>
                        )}
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
                )}

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
                            const otherUser = conv.participantIds?.find(p => p._id !== user?._id);
                            if (!otherUser) return null;

                            return (
                                <div
                                    key={conv._id}
                                    onClick={() => setSelectedConvId(conv._id)}
                                    className={`px-6 py-4 flex items-center gap-3 cursor-pointer transition-colors relative ${selectedConvId === conv._id ? "bg-[#E0EAFF]" : "hover:bg-gray-50"
                                        }`}
                                >
                                    <UserAvatar
                                        src={otherUser.profileImage}
                                        name={otherUser.name}
                                        size="w-12 h-12"
                                    />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline mb-0.5">
                                            <h3 className="text-sm font-bold text-[#0D1C35] truncate font-sans">{otherUser.name}</h3>
                                            {conv.updatedAt && (
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    {formatDistanceToNow(new Date(conv.updatedAt), { addSuffix: false }).replace('about ', '')}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <p className="text-[11px] text-gray-400 truncate max-w-[140px] font-medium font-sans">
                                                {conv.lastMessage?.text?.startsWith("OFFER:") ? "Sent an offer" : conv.lastMessage?.text || "Started a conversation"}
                                            </p>
                                            {conv.unreadCount > 0 && (
                                                <div className="w-4 h-4 bg-[#0A47C2] rounded-full flex items-center justify-center">
                                                    <span className="text-[8px] text-white font-bold">{conv.unreadCount}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    {selectedConvId === conv._id && (
                                        <div className="absolute right-0 top-0 bottom-0 w-1 bg-[#0A47C2]" />
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
                                <UserAvatar
                                    src={recipient.profileImage}
                                    name={recipient.name}
                                    size="w-12 h-12"
                                    className="border border-gray-100"
                                />
                                <div>
                                    <h2 className="text-lg font-bold text-[#0D1C35] font-sans">{recipient.name}</h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                {user?.role === "STUDENT" && hourlyClass && (
                                    <button
                                        onClick={() => {
                                            setEditingOfferId(null);
                                            setInitialOfferData(null);
                                            setIsOfferModalOpen(true);
                                        }}
                                        className="px-6 py-2.5 bg-[#0A47C2] text-white text-xs font-bold rounded-xl font-sans hover:bg-[#083a9e] transition-all shadow-lg shadow-blue-100 flex items-center gap-2"
                                    >
                                        <CalendarIcon size={14} />
                                        Create an offer
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Offer Modal */}
                        <CreateOfferModal
                            isOpen={isOfferModalOpen}
                            onClose={() => {
                                setIsOfferModalOpen(false);
                                setEditingOfferId(null);
                                setInitialOfferData(null);
                            }}
                            tutor={hourlyClass}
                            onSendOffer={handleSendOffer}
                            initialData={initialOfferData}
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
                                messages.map((msg, idx) => (
                                    <MessageItem
                                        key={msg._id || idx}
                                        msg={msg}
                                        user={user}
                                        recipient={recipient}
                                        onAccept={handleAcceptOffer}
                                        onReject={handleCancelOffer}
                                        onReschedule={handleRescheduleOffer}
                                        onEdit={handleEditMessage}
                                        onDelete={handleDeleteMessage}
                                        onPay={handlePayOffer}
                                        payingOfferId={payingOfferId}
                                        activeMessageId={activeMessageId}
                                        setActiveMessageId={setActiveMessageId}
                                        index={idx}
                                    />
                                ))
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
                                                <Image src={URL.createObjectURL(f)} alt="preview" fill className="object-cover" unoptimized />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[10px] text-gray-500 font-bold p-1 overflow-hidden break-all text-center">
                                                    {f.name.substring(0, 10)}..
                                                </div>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedFiles(prev => prev.filter((_, idx) => idx !== i))}
                                                className="absolute top-0.5 right-0.5 p-0.5 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                            >
                                                <X size={10} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}

                            <div className="flex items-center gap-4 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    className="p-2.5 text-gray-400 hover:text-[#0A47C2] hover:bg-blue-50 rounded-xl transition-all"
                                >
                                    <Paperclip size={20} />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setSelectedFiles(prev => [...prev, ...Array.from(e.target.files!)]);
                                        }
                                    }}
                                    multiple
                                    className="hidden"
                                />
                                <input
                                    type="text"
                                    value={messageInput}
                                    onChange={(e) => setMessageInput(e.target.value)}
                                    placeholder="Type your message..."
                                    className="flex-1 bg-transparent border-none text-sm focus:outline-none font-sans py-2"
                                />
                                <button
                                    type="submit"
                                    disabled={sending || (!messageInput.trim() && selectedFiles.length === 0)}
                                    className="p-2.5 bg-[#0A47C2] text-white rounded-xl shadow-lg shadow-blue-100 hover:bg-[#083a9e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {sending ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                                </button>
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-4">
                        <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center text-[#0A47C2]">
                            <Send size={32} />
                        </div>
                        <div className="text-center">
                            <h3 className="text-lg font-bold text-[#0D1C35]">Your Messages</h3>
                            <p className="text-sm">Select a conversation to start chatting</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
