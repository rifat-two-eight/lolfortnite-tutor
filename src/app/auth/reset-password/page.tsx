"use client";

import { Lock, Eye, EyeOff, ChevronLeft } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    return (
        <div className="flex flex-col">
            <h2 className="text-2xl font-medium text-center text-gray-800 mb-10">
                Reset Password
            </h2>

            <button
                onClick={() => router.push('/auth')}
                className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors mb-10"
            >
                <ChevronLeft className="h-5 w-5" />
                <span className="text-sm font-medium">Back to Login</span>
            </button>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); router.push('/auth'); }}>
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            required
                            placeholder="Set new password"
                            className="w-full pl-12 pr-12 py-4 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">Confirm Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            required
                            placeholder="Confirm new password"
                            className="w-full pl-12 pr-12 py-4 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-4"
                >
                    Confirm
                </button>
            </form>
        </div>
    );
}
