"use client";

import React, { useState } from "react";
import { 
    ChevronDown, 
    Upload, 
    Camera
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";

export default function AdminSettingsPage() {
    const [webSettings, setWebSettings] = useState([
        { id: 1, label: "Student rating off", active: true },
        { id: 2, label: "Student name change", active: true },
        { id: 3, label: "Student name change", active: true },
        { id: 4, label: "Student name change", active: true },
        { id: 5, label: "Student name change", active: true },
        { id: 6, label: "Student name change", active: true },
        { id: 7, label: "Student name change", active: true },
    ]);

    const toggleSetting = (id: number) => {
        setWebSettings(prev => prev.map(s => 
            s.id === id ? { ...s, active: !s.active } : s
        ));
    };

    const handleUpdateInfo = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Account information updated successfully");
    };

    const handleUpdatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Password changed successfully");
    };

    return (
        <div className="px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 max-w-7xl">
                
                {/* Left Side: Web Setting */}
                <div className="lg:col-span-5 space-y-6">
                    <h2 className="text-xl font-bold text-[#0D1C35] mb-8">Web Setting</h2>
                    <div className="space-y-4">
                        {webSettings.map((setting) => (
                            <div 
                                key={setting.id}
                                className="bg-white px-8 py-5 rounded-full border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100 transition-colors"
                            >
                                <span className="text-sm font-medium text-gray-600 font-sans">{setting.label}</span>
                                <button 
                                    onClick={() => toggleSetting(setting.id)}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition-colors focus:outline-none ${
                                        setting.active ? "bg-[#0A47C2]" : "bg-gray-200"
                                    }`}
                                >
                                    <span 
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white transition-transform ${
                                            setting.active ? "translate-x-8" : "translate-x-1"
                                        }`} 
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Center/Right: Account Settings */}
                <div className="lg:col-span-7">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
                        
                        {/* Information Forms */}
                        <div className="md:col-span-8 space-y-12">
                            <section>
                                <h2 className="text-xl font-bold text-[#0D1C35] mb-8">Your Account Settings</h2>
                                <form onSubmit={handleUpdateInfo} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Full name</label>
                                        <input 
                                            type="text" 
                                            defaultValue="Ibrahim M"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Phone Number</label>
                                        <div className="flex gap-2">
                                            <div className="relative shrink-0">
                                                <select className="appearance-none bg-white border border-gray-200 rounded-none px-4 py-3 text-sm font-medium text-[#0A47C2] focus:outline-none min-w-[100px] cursor-pointer">
                                                    <option>+880</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0A47C2] pointer-events-none" />
                                            </div>
                                            <input 
                                                type="tel" 
                                                defaultValue="+88 017489376702"
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                                        <input 
                                            type="email" 
                                            defaultValue="users@gmail.com"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                                        />
                                    </div>

                                    <button 
                                        type="submit"
                                        className="px-8 py-3 bg-[#0A47C2] text-white rounded-none text-sm font-bold hover:opacity-90 transition-opacity"
                                    >
                                        Change Info
                                    </button>
                                </form>
                            </section>

                            <hr className="border-gray-100" />

                            <section>
                                <h2 className="text-xl font-bold text-[#0D1C35] mb-8">Change Password</h2>
                                <form onSubmit={handleUpdatePassword} className="space-y-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Old Password</label>
                                        <input 
                                            type="password" 
                                            placeholder="****************"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Create New Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="****************"
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                                            <input 
                                                type="password" 
                                                placeholder="****************"
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all font-sans"
                                            />
                                        </div>
                                    </div>

                                    <button 
                                        type="submit"
                                        className="px-8 py-3 bg-[#0A47C2] text-white rounded-none text-sm font-bold hover:opacity-90 transition-opacity"
                                    >
                                        Change Password
                                    </button>
                                </form>
                            </section>
                        </div>

                        {/* Profile Photo */}
                        <div className="md:col-span-4 self-start">
                            <div className="bg-[#f8f9fa] rounded-xl p-8 flex flex-col items-center gap-6">
                                <div className="relative w-40 h-40 group cursor-pointer">
                                    <div className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-white shadow-xl">
                                        <Image 
                                            src="/authpic.jpg" 
                                            alt="Profile" 
                                            fill 
                                            className="object-cover group-hover:scale-110 transition-transform duration-500" 
                                        />
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex flex-col items-center justify-center text-white gap-2">
                                        <Camera size={24} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">Upload Photo</span>
                                    </div>
                                </div>
                                
                                <div className="text-center space-y-1">
                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed uppercase">
                                        Image size should be under 1MB<br />
                                        and image ration needs to be 1:1
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
