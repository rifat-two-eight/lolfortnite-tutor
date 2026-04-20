"use client";

import { ChevronLeft, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useRef, useEffect, Suspense } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

function OTPContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const email = searchParams.get("email");
    
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isLoading, setIsLoading] = useState(false);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (!email) {
            toast.error("Invalid session. Please start again.");
            router.push("/auth/forgot-password");
        }
    }, [email, router]);

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

    const handleConfirm = async () => {
        const otpString = otp.join("");
        if (otpString.length < 6) {
            toast.error("Please enter the full 6-digit OTP");
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.post("/auth/verify-otp", { 
                email, 
                otp: otpString 
            });

            if (response.data.success) {
                toast.success("OTP verified successfully!");
                const token = response.data.data.token; // Corrected: backend returns { data: { token: '...' } }
                router.push(`/auth/reset-password?email=${encodeURIComponent(email || "")}&token=${encodeURIComponent(token)}`);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid OTP. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-medium text-center text-gray-800 mb-10">
                Verify OTP
            </h2>

            <button
                onClick={() => router.back()}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-10 w-fit"
            >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back</span>
            </button>

            <div className="space-y-8">
                <div className="space-y-4 text-center">
                    <p className="text-sm text-gray-500">
                        Please enter the 6-digit code sent to <br />
                        <span className="font-semibold text-gray-700">{email}</span>
                    </p>
                    <div className="flex justify-between gap-2 sm:gap-4 mt-6">
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
                    onClick={handleConfirm}
                    disabled={isLoading}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-4 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Verifying...
                        </>
                    ) : (
                        "Confirm OTP"
                    )}
                </button>
            </div>
        </div>
    );
}

export default function OTPPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        }>
            <OTPContent />
        </Suspense>
    );
}
