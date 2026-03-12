"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
    Search,
    Send,
    Smile,
    Paperclip,
    MoreHorizontal,
    ChevronLeft
} from "lucide-react";

const contacts = [
    { id: 1, name: "Jane Cooper", lastMsg: "Yeah sure, tell me zafor", time: "Just now", status: "online", image: "/demotutor.png" },
    { id: 2, name: "Jenny Wilson", lastMsg: "Thank you so much, sir", time: "2 d", status: "online", image: "/demotutor.png", unread: true },
    { id: 3, name: "Marvin McKinney", lastMsg: "You're Welcome", time: "1 m", status: "online", image: "/demotutor.png", unread: true },
    { id: 4, name: "Eleanor Pena", lastMsg: "Thank you so much, sir", time: "1 m", status: "offline", image: "/demotutor.png" },

];

export default function AdminMessagesPage() {
    const [selectedContact, setSelectedContact] = useState(contacts[0]);

    return (
        <div className="flex h-screen overflow-hidden bg-white">
            {/* Chat Sidebar */}
            <div className="w-80 border-r border-gray-100 flex flex-col shrink-0">
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                        <Image src="/logo2.svg" alt="Educate" width={161} height={60} className="w-40 h-auto" />
                    </div>
                    <h2 className="text-xl font-bold text-[#0D1C35] font-sans">Chat</h2>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search"
                            className="w-full pl-4 pr-10 py-2.5 bg-gray-50 border-none rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 font-sans"
                        />
                        <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto">
                    {contacts.map((contact) => (
                        <div
                            key={contact.id}
                            onClick={() => setSelectedContact(contact)}
                            className={`px-6 py-4 flex items-center gap-3 cursor-pointer transition-colors relative ${selectedContact.id === contact.id ? "bg-[#E0EAFF]" : "hover:bg-gray-50"
                                }`}
                        >
                            <div className="relative shrink-0 w-12 h-12 rounded-full overflow-hidden">
                                <Image src={contact.image} alt={contact.name} fill className="object-cover" />
                                {contact.status === "online" && (
                                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full z-10" />
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between mb-0.5">
                                    <h3 className="text-sm font-bold text-[#0D1C35] font-sans truncate">{contact.name}</h3>
                                    <span className="text-[10px] text-gray-400 font-medium">{contact.time}</span>
                                </div>
                                <p className="text-[11px] text-gray-500 font-medium font-sans truncate line-clamp-1">{contact.lastMsg}</p>
                            </div>
                            {contact.unread && (
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full" />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Chat Area */}
            <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="h-20 border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden">
                            <Image src="/authpic.jpg" alt="Active User" fill className="object-cover" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-[#0D1C35] font-sans">Super Admin</h2>
                            <p className="text-[#0A47C2] text-xs font-bold font-sans">Active Now</p>
                        </div>
                    </div>
                    <button className="px-6 py-2.5 bg-[#0A47C2] text-white rounded-lg text-sm font-bold hover:opacity-90 transition-opacity font-sans">
                        Create A Offer
                    </button>
                </div>

                {/* Messages Window */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden p-8 space-y-8 bg-gray-50/30">
                    <div className="flex items-start gap-3 max-w-2xl">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                            <Image src="/demotutor.png" alt="Sender" fill className="object-cover" />
                        </div>
                        <div className="space-y-1">
                            <div className="bg-[#E0EAFF] p-4 rounded-2xl rounded-tl-none text-sm text-[#0D1C35] font-sans leading-relaxed">
                                Hello and thanks for signing up to the course. If you have any questions about the course or Adobe XD, feel free to get in touch and I'll be happy to help 😀
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold ml-1">9:45</span>
                        </div>
                    </div>

                    <div className="flex items-start justify-end gap-3">
                        <div className="space-y-4 max-w-xl">
                            <div className="bg-[#0A47C2] p-3 px-5 rounded-lg text-sm text-white font-sans font-bold inline-block float-right clear-both">
                                Hello, Good Evening.
                            </div>
                            <div className="bg-[#0A47C2] p-3 px-5 rounded-lg text-sm text-white font-sans font-bold inline-block float-right clear-both">
                                I'm Zafor
                            </div>
                            <div className="bg-[#0A47C2] p-5 rounded-xl rounded-tr-none text-sm text-white font-sans leading-relaxed float-right clear-both">
                                I only have a small doubt about your lecture. can you give me some time for this?
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold mr-1 block text-right clear-both">9:45</span>
                        </div>
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                            <Image src="/authpic.jpg" alt="Receiver" fill className="object-cover" />
                        </div>
                    </div>

                    <div className="flex items-start gap-3 max-w-2xl">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0 mt-1">
                            <Image src="/demotutor.png" alt="Sender" fill className="object-cover" />
                        </div>
                        <div className="space-y-1">
                            <div className="bg-[#E0EAFF] p-4 rounded-2xl rounded-tl-none text-sm text-[#0D1C35] font-sans leading-relaxed">
                                Yeah sure, tell me zafor
                            </div>
                            <span className="text-[10px] text-gray-400 font-bold ml-1">9:45</span>
                        </div>
                    </div>
                </div>

                {/* Message Input */}
                <div className="p-8 border-t border-gray-100">
                    <div className="relative group">
                        <input
                            type="text"
                            placeholder="Write your message"
                            className="w-full pl-6 pr-24 py-4 bg-white border border-gray-100 shadow-sm rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-blue-100 font-sans transition-all"
                        />
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-3">
                            <button className="p-1 text-gray-300 hover:text-gray-500 transition-colors">
                                <Smile size={20} />
                            </button>
                            <button className="p-1 text-gray-300 hover:text-gray-500 transition-colors">
                                <Paperclip size={20} />
                            </button>
                            <button className="p-2.5 bg-[#0A47C2] text-white rounded-full hover:shadow-lg transition-all">
                                <Send size={18} fill="currentColor" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
