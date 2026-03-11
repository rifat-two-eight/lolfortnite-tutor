"use client";

import React from "react";
import Image from "next/image";
import { Upload, Eye, EyeOff, ChevronDown } from "lucide-react";
import { toast } from "sonner";

export default function TeacherSettingsPage() {
    const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
    const [showNewPassword, setShowNewPassword] = React.useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState<string | null>(null);

    const handleSaveAccount = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Account settings updated successfully!");
    };

    const handleSavePassword = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Password changed successfully!");
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 animate-in fade-in duration-500">
            {/* Account Settings Section */}
            <div className="bg-white border border-gray-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Account Settings</h2>
                
                <div className="flex flex-col lg:flex-row gap-12">
                    {/* Left Side: Form */}
                    <form onSubmit={handleSaveAccount} className="flex-1 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 font-sans">First name</label>
                                <input 
                                    type="text" 
                                    placeholder="First name"
                                    className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 font-sans">Last name</label>
                                <input 
                                    type="text" 
                                    placeholder="Last name"
                                    className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Phone Number</label>
                            <div className="flex h-12 border border-gray-100 focus-within:border-[#0A47C2] transition-colors">
                                <div className="flex items-center gap-1 px-4 border-r border-gray-100 bg-gray-50/50 cursor-pointer">
                                    <span className="text-sm font-sans text-blue-600 font-semibold">+880</span>
                                    <ChevronDown size={14} className="text-gray-400" />
                                </div>
                                <input 
                                    type="text" 
                                    placeholder="Your Phone number..."
                                    className="flex-1 px-4 text-sm font-sans focus:outline-none"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Email</label>
                            <input 
                                type="email" 
                                placeholder="Your Email Adress"
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Title</label>
                            <div className="relative">
                                <input 
                                    type="text" 
                                    placeholder="Your Title"
                                    className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors"
                                />
                                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] text-gray-300 font-sans">0/50</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Professional Summary</label>
                            <textarea 
                                placeholder="Your Professional Summary"
                                rows={4}
                                className="w-full border border-gray-100 p-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors resize-none"
                            />
                        </div>

                        <button 
                            type="submit"
                            className="bg-[#0A47C2] text-white font-bold py-3 px-8 text-xs font-sans hover:bg-[#083a9e] transition-colors uppercase tracking-wider shadow-sm"
                        >
                            Save Changes
                        </button>
                    </form>

                    {/* Right Side: Avatar Upload */}
                    <div className="w-full lg:w-64 space-y-4">
                        <div className="aspect-square bg-gray-50 border border-gray-100 flex flex-col items-center justify-center p-8 relative overflow-hidden group">
                            {profileImage ? (
                                <Image src={profileImage} alt="Profile" fill className="object-cover" />
                            ) : (
                                <Image src="/demotutor.png" alt="Placeholder" width={200} height={200} className="object-cover opacity-80" />
                            )}
                            <div className="absolute bottom-0 left-0 w-full bg-black/40 backdrop-blur-sm py-3 flex flex-col items-center gap-1 translate-y-full group-hover:translate-y-0 transition-transform cursor-pointer">
                                <Upload size={16} className="text-white" />
                                <span className="text-[10px] text-white font-bold uppercase tracking-tight">Upload Photo</span>
                                <input 
                                    type="file" 
                                    className="absolute inset-0 opacity-0 cursor-pointer" 
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) setProfileImage(URL.createObjectURL(file));
                                    }}
                                />
                            </div>
                        </div>
                        <p className="text-[10px] text-gray-400 text-center leading-relaxed font-sans px-4">
                            Image size should be under 1MB and image ration needs to be 1:1
                        </p>
                    </div>
                </div>
            </div>

            {/* Change Password Section */}
            <div className="bg-white border border-gray-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Change password</h2>
                
                <form onSubmit={handleSavePassword} className="space-y-6 max-w-4xl">
                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Current Password</label>
                        <div className="relative group">
                            <input 
                                type={showCurrentPassword ? "text" : "password"} 
                                placeholder="Password"
                                className="w-full h-12 border border-gray-100 px-4 pr-12 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">New Password</label>
                        <div className="relative group">
                            <input 
                                type={showNewPassword ? "text" : "password"} 
                                placeholder="Password"
                                className="w-full h-12 border border-gray-100 px-4 pr-12 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-semibold text-gray-400 font-sans">Confirm Password</label>
                        <div className="relative group">
                            <input 
                                type={showConfirmPassword ? "text" : "password"} 
                                placeholder="Confirm new password"
                                className="w-full h-12 border border-gray-100 px-4 pr-12 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors"
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit"
                        className="bg-[#0A47C2] text-white font-bold py-3 px-8 text-xs font-sans hover:bg-[#083a9e] transition-colors uppercase tracking-wider shadow-sm"
                    >
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
