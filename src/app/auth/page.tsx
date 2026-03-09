"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function AuthPage() {
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="flex flex-col items-center">
            <h2 className="text-3xl font-medium text-gray-800 mb-8">
                Welcome To Educate..!
            </h2>

            {/* Tabs */}
            <div className="flex w-full max-w-sm bg-[#8DA5ED] rounded-full p-1 mb-10">
                <button
                    onClick={() => setActiveTab("login")}
                    className={cn(
                        "flex-1 py-3 text-sm font-medium rounded-full transition-all duration-200",
                        activeTab === "login"
                            ? "bg-primary text-white shadow-lg"
                            : "text-white hover:bg-primary/10"
                    )}
                >
                    Login
                </button>
                <button
                    onClick={() => setActiveTab("register")}
                    className={cn(
                        "flex-1 py-3 text-sm font-medium rounded-full transition-all duration-200",
                        activeTab === "register"
                            ? "bg-primary text-white shadow-lg"
                            : "text-white hover:bg-primary/10"
                    )}
                >
                    Register
                </button>
            </div>

            {/* Forms */}
            <form className="w-full space-y-6">
                {activeTab === "register" && (
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="text"
                                placeholder="Enter your Name"
                                className="w-full pl-12 pr-4 py-4 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="email"
                            placeholder="Enter your @ Email"
                            className="w-full pl-12 pr-4 py-4 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your Password"
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

                {activeTab === "login" && (
                    <div className="flex items-center justify-between text-xs sm:text-sm px-1">
                        <label className="flex items-center gap-2 cursor-pointer text-gray-500">
                            <input type="checkbox" className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary" />
                            Remember me
                        </label>
                        <Link href="/auth/forgot-password" title="Forgot Password" className="text-gray-500 hover:text-primary transition-colors">
                            Forgot Password ?
                        </Link>
                    </div>
                )}

                <button
                    type="submit"
                    className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-4"
                >
                    {activeTab === "login" ? "Login" : "Register"}
                </button>
            </form>
        </div>
    );
}
