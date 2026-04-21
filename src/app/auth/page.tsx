"use client";

import { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Phone, Camera } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import api from "@/lib/axios";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useEffect } from "react";
import TeacherOnboarding from "@/components/roles/TeacherOnboarding";

export default function AuthPage() {
    const router = useRouter();
    const { user, setUser, setToken, accessToken } = useAuthStore();
    const [activeTab, setActiveTab] = useState<"login" | "register">("login");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
    const [showTeacherOnboarding, setShowTeacherOnboarding] = useState(false);

    // Auto-redirection for already authenticated users
    // Guard: don't redirect while teacher onboarding is in progress
    useEffect(() => {
        if (accessToken && user && !showTeacherOnboarding) {
            if (user.role === "STUDENT") {
                router.push("/");
            } else if (user.role === "TEACHER") {
                router.push("/teacher");
            } else {
                router.push("/web-admin");
            }
        }
    }, [accessToken, user, router, showTeacherOnboarding]);

    // Remember Me pre-fill
    useEffect(() => {
        const savedEmail = localStorage.getItem("rememberedEmail");
        if (savedEmail) {
            setFormData((prev) => ({ ...prev, email: savedEmail }));
            setRememberMe(true);
        }
    }, []);

    // Form State
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "STUDENT",
        phone: "",
        fullAddress: "",
        lat: "",
        lng: "",
    });
    const [image, setImage] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            if (activeTab === "register") {
                const data = new FormData();
                const body = {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: formData.role,
                    phone: formData.phone,
                    location: {
                        fullAddress: formData.fullAddress || "",
                        lat: Number(formData.lat) || 0,
                        lng: Number(formData.lng) || 0,
                    }
                };

                data.append("body", JSON.stringify(body));

                if (image) {
                    data.append("profileImage", image);
                }

                const response = await api.post("/auth/register", data, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (response.data.success) {
                    toast.success("Registration successful!");
                    const { user, accessToken } = response.data.data;
                    setUser(user);
                    setToken(accessToken);
                    localStorage.setItem("accessToken", accessToken);

                    if (user.role === "TEACHER") {
                        // Show onboarding wizard for teachers
                        setShowTeacherOnboarding(true);
                    } else if (user.role === "STUDENT") {
                        router.push("/");
                    } else {
                        router.push("/web-admin");
                    }
                }
            } else {
                const response = await api.post("/auth/login", {
                    email: formData.email,
                    password: formData.password,
                });

                if (response.data.success) {
                    toast.success("Login successful!");
                    const { user, accessToken } = response.data.data;
                    setUser(user);
                    setToken(accessToken);

                    if (accessToken) {
                        localStorage.setItem("accessToken", accessToken);
                    }

                    // Handle Remember Me
                    if (rememberMe) {
                        localStorage.setItem("rememberedEmail", formData.email);
                    } else {
                        localStorage.removeItem("rememberedEmail");
                    }

                    if (user.role === "STUDENT") {
                        router.push("/");
                    } else if (user.role === "TEACHER") {
                        router.push("/teacher");
                    } else {
                        router.push("/web-admin");
                    }
                }
            }
        } catch (error: any) {
            console.error(error);
            const errorMessage = error.response?.data?.message || "Something went wrong";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {showTeacherOnboarding && (
                <TeacherOnboarding onComplete={() => setShowTeacherOnboarding(false)} />
            )}
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
                <form onSubmit={handleSubmit} className="w-full space-y-4">
                    {activeTab === "register" && (
                        <>
                            {/* Avatar Upload */}
                            <div className="flex flex-col items-center justify-center mb-6">
                                <div
                                    onClick={() => document.getElementById("avatar-upload")?.click()}
                                    className="relative w-24 h-24 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center cursor-pointer hover:bg-primary/5 transition-all overflow-hidden group"
                                >
                                    {preview ? (
                                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="flex flex-col items-center text-gray-400 group-hover:text-primary transition-colors">
                                            <Camera className="h-8 w-8 mb-1" />
                                            <span className="text-[10px] font-medium">Upload</span>
                                        </div>
                                    )}

                                    {preview && (
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="h-6 w-6 text-white" />
                                        </div>
                                    )}
                                </div>
                                <input
                                    id="avatar-upload"
                                    type="file"
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter your Name"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Role</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleInputChange}
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
                                    >
                                        <option value="STUDENT">Student</option>
                                        <option value="TEACHER">Teacher</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 ml-1">Phone</label>
                                <div className="relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your Phone"
                                        required
                                        className="w-full pl-12 pr-4 py-3 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                                    />
                                </div>
                            </div>
                        </>
                    )}

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Email</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                placeholder="Enter your @ Email"
                                required
                                className="w-full pl-12 pr-4 py-3 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700 ml-1">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 h-5 w-5" />
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter your Password"
                                required
                                className="w-full pl-12 pr-12 py-3 bg-white border border-primary rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
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
                                <input
                                    type="checkbox"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-4 h-4 rounded border-primary/30 text-primary focus:ring-primary"
                                />
                                Remember me
                            </label>
                            <Link href="/auth/forgot-password" title="Forgot Password" className="text-gray-500 hover:text-primary transition-colors">
                                Forgot Password ?
                            </Link>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full py-4 bg-primary hover:bg-primary/90 text-white font-medium rounded-full shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? "Processing..." : activeTab === "login" ? "Login" : "Register"}
                    </button>
                </form>
            </div>
        </>
    );
}
