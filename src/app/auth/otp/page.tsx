"use client";

import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useRef } from "react";

export default function OTPPage() {
    const router = useRouter();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        if (value !== "" && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && otp[index] === "" && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-medium text-center text-gray-800 mb-10">
                OTP For Forgot
            </h2>

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-10"
            >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="space-y-8">
                <div className="space-y-4">
                    <label className="text-sm font-medium text-gray-600 opacity-80">OTP</label>
                    <div className="flex justify-between gap-2 sm:gap-4">
                        {otp.map((digit, index) => (
                            <input
                                key={index}
                                ref={(el) => { inputRefs.current[index] = el; }}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleChange(index, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(index, e)}
                                className="w-12 h-12 sm:w-14 sm:h-14 text-center text-xl font-bold bg-white border border-primary rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
                            />
                        ))}
                    </div>
                </div>

                <button
                    onClick={() => router.push('/auth/reset-password')}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-4"
                >
                    Confirm
                </button>
            </div>
        </div>
    );
}
