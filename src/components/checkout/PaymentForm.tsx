"use client";

import React, { useState } from "react";
import Image from "next/image";

interface PaymentOption {
    id: string;
    name: string;
    icon: string;
    details?: string;
    isCard?: boolean;
}

const paymentOptions: PaymentOption[] = [
    { id: "visa", name: "VISA", icon: "/visa.svg", details: "4855 **** **** ****", isCard: true },
    { id: "mastercard", name: "Mastercard", icon: "/mastercard.svg", details: "5795 **** **** ****", isCard: true },
    { id: "paypal", name: "PayPal", icon: "/paypal.svg", details: "You will be redirected to the PayPal site after reviewing your order." },
    { id: "new-card", name: "New Payment Cards", icon: "/card-icon.png", isCard: true },
];

export default function PaymentForm() {
    const [selectedOption, setSelectedOption] = useState("new-card");
    const [rememberCard, setRememberCard] = useState(true);

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-[#0D1C35] font-sans">Payment Method</h2>

            {/* Payment Options */}
            <div className="space-y-3">
                {paymentOptions.map((option) => (
                    <div
                        key={option.id}
                        onClick={() => setSelectedOption(option.id)}
                        className={`flex items-center justify-between p-4 border rounded-none cursor-pointer transition-all ${
                            selectedOption === option.id ? "border-[#22C55E] bg-white ring-1 ring-[#22C55E]/20" : "border-gray-200 bg-white"
                        }`}
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-6 relative shrink-0">
                                {option.id !== "new-card" ? (
                                    <Image
                                        src={option.icon}
                                        alt={option.name}
                                        fill
                                        className="object-contain"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center text-[8px] font-bold text-gray-400">
                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                            <line x1="1" y1="10" x2="23" y2="10" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col">
                                <span className={`text-sm font-sans ${option.isCard ? "font-bold text-[#0D1C35]" : "text-[#4B5563]"}`}>
                                    {option.id === "new-card" ? "New Payment Cards" : option.details}
                                </span>
                                {option.id !== "new-card" && option.isCard && (
                                    <span className="text-[10px] text-gray-400 font-sans">04/24 Vako Shvili</span>
                                )}
                            </div>
                        </div>
                        {selectedOption === option.id && (
                            <div className="w-5 h-5 bg-[#22C55E] rounded-full flex items-center justify-center">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Card Form */}
            {selectedOption === "new-card" && (
                <div className="space-y-4 pt-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#0D1C35] font-sans">Name</label>
                        <input
                            type="text"
                            placeholder="Name on card"
                            className="w-full px-4 py-3 border border-gray-200 rounded-none text-sm font-sans outline-none focus:border-[#0A47C2]"
                        />
                    </div>

                    <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-[#0D1C35] font-sans">Card Number</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0A47C2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                                    <line x1="1" y1="10" x2="23" y2="10" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                placeholder="Label"
                                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-none text-sm font-sans outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#0D1C35] font-sans">MM / YY</label>
                            <input
                                type="text"
                                placeholder="MM / YY"
                                className="w-full px-4 py-3 border border-gray-200 rounded-none text-sm font-sans outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#0D1C35] font-sans">CVC</label>
                            <input
                                type="text"
                                placeholder="Security Code"
                                className="w-full px-4 py-3 border border-gray-200 rounded-none text-sm font-sans outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div 
                            onClick={() => setRememberCard(!rememberCard)}
                            className={`w-4 h-4 rounded-sm border flex items-center justify-center cursor-pointer transition-colors ${
                                rememberCard ? "bg-[#0A47C2] border-[#0A47C2]" : "bg-white border-gray-300"
                            }`}
                        >
                            {rememberCard && (
                                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            )}
                        </div>
                        <span className="text-[11px] text-gray-500 font-sans">Remember this card, save it on my card list</span>
                    </div>

                    <div className="space-y-1.5 pt-2">
                        <label className="text-xs font-bold text-[#0D1C35] font-sans uppercase">Email For Gate Zoom Link</label>
                        <input
                            type="email"
                            placeholder="Email"
                            className="w-full px-4 py-3 border border-gray-200 rounded-none text-sm font-sans outline-none focus:border-[#0A47C2]"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
