"use client";

import { Mail, ChevronLeft, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import api from "@/lib/axios";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await api.post("/auth/forgot-password", { email });
            if (response.data.success) {
                toast.success("OTP sent to your email!");
                router.push(`/auth/otp?email=${encodeURIComponent(email)}`);
            }
        } catch (error: any) {
            console.error(error);
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-medium text-center text-gray-800 mb-10">
                Forgot Password
            </h2>

            <button
                onClick={() => router.push("/auth")}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-10 w-fit"
            >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Login</span>
            </button>

            <form className="space-y-8" onSubmit={handleSubmit}>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your Email"
                            className="w-full pl-12 pr-4 py-4 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isLoading ? (
                        <>
                            <Loader2 className="h-5 w-5 animate-spin" />
                            Sending...
                        </>
                    ) : (
                        "Send OTP"
                    )}
                </button>
            </form>
        </div>
    );
}
