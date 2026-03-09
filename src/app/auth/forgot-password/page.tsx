"use client";

import { Mail, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const router = useRouter();

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

            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); router.push('/auth/otp'); }}>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="email"
                            required
                            placeholder="Enter your Email"
                            className="w-full pl-12 pr-4 py-4 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99]"
                >
                    Send OTP
                </button>
            </form>
        </div>
    );
}
