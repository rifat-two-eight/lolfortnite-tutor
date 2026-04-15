"use client";

import React, { useState, useEffect } from "react";
import {
    ChevronDown,
    Upload,
    Camera,
    Eye,
    EyeOff,
    Loader2,
    User as UserIcon
} from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";
import { getImageUrl } from "@/lib/utils";

export default function AdminSettingsPage() {
    const setUser = useAuthStore((state) => state.setUser);
    const [webSettings, setWebSettings] = useState([
        { id: 1, label: "Student rating off", active: true },
        { id: 2, label: "Student name change", active: true },
        { id: 3, label: "Student name change", active: true },
        { id: 4, label: "Student name change", active: true },
        { id: 5, label: "Student name change", active: true },
        { id: 6, label: "Student name change", active: true },
        { id: 7, label: "Student name change", active: true },
    ]);

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: ""
    });
    
    const [passwords, setPasswords] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [passSaving, setPassSaving] = useState(false);
    
    // Password visibility
    const [showOld, setShowOld] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    // Image state
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    useEffect(() => {
        api.get("/auth/me")
            .then(res => {
                if (res.data.success) {
                    const d = res.data.data;
                    setForm({
                        name: d.name || "",
                        phone: d.phone || "",
                        email: d.email || ""
                    });
                    if (d.profileImage) setCurrentImage(d.profileImage);
                }
            })
            .finally(() => setLoading(false));
    }, []);

    const toggleSetting = (id: number) => {
        setWebSettings(prev => prev.map(s =>
            s.id === id ? { ...s, active: !s.active } : s
        ));
    };

    const handleUpdateInfo = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.patch("/auth/profile", {
                name: form.name,
                phone: form.phone
            });
            if (res.data.success) {
                toast.success("Account information updated successfully");
                // Refresh global store
                const meRes = await api.get("/auth/me");
                if (meRes.data.success) setUser(meRes.data.data);
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update info");
        } finally {
            setSaving(false);
        }
    };

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("New passwords do not match");
        }
        setPassSaving(true);
        try {
            const res = await api.post("/auth/change-password", {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            if (res.data.success) {
                toast.success("Password changed successfully");
                setPasswords({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setPassSaving(false);
        }
    };

    const handleImageUpload = async () => {
        if (!imageFile) return;
        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append("profileImage", imageFile);
            const res = await api.patch("/auth/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            if (res.data.success) {
                toast.success("Profile photo updated!");
                setCurrentImage(res.data.data.profileImage);
                setImageFile(null);
                setImagePreview(null);
                // Refresh global store
                const meRes = await api.get("/auth/me");
                if (meRes.data.success) setUser(meRes.data.data);
            }
        } catch (err: any) {
            toast.error("Failed to upload image");
        } finally {
            setImageUploading(false);
        }
    };

    return (
        <div className="px-4 md:px-8 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 max-w-7xl">

                {/* Left Side: Web Setting */}
                {/* <div className="lg:col-span-5 space-y-6">
                    <h2 className="text-xl font-bold text-[#0D1C35] mb-8">Web Setting</h2>
                    <div className="space-y-4">
                        {webSettings.map((setting) => (
                            <div 
                                key={setting.id}
                                className="bg-white px-8 py-5 rounded-full border border-gray-100 shadow-sm flex items-center justify-between group hover:border-blue-100"
                            >
                                <span className="text-sm font-medium text-gray-600 font-sans">{setting.label}</span>
                                <button 
                                    onClick={() => toggleSetting(setting.id)}
                                    className={`relative inline-flex h-7 w-14 items-center rounded-full focus:outline-none ${
                                        setting.active ? "bg-[#0A47C2]" : "bg-gray-200"
                                    }`}
                                >
                                    <span 
                                        className={`inline-block h-5 w-5 transform rounded-full bg-white ${
                                            setting.active ? "translate-x-8" : "translate-x-1"
                                        }`} 
                                    />
                                </button>
                            </div>
                        ))}
                    </div>
                </div> */}

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
                                            value={form.name}
                                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                                            placeholder="Enter your name"
                                            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-sans"
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
                                                value={form.phone}
                                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                                placeholder="01712345678"
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-sans"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</label>
                                        <input
                                            type="email"
                                            value={form.email}
                                            readOnly
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-none text-sm focus:outline-none font-sans text-gray-400 cursor-not-allowed"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="px-8 py-3 bg-[#0A47C2] text-white rounded-none text-sm font-bold hover:opacity-90 flex items-center gap-2"
                                    >
                                        {saving && <Loader2 size={16} className="animate-spin" />}
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
                                        <div className="relative">
                                            <input
                                                type={showOld ? "text" : "password"}
                                                value={passwords.currentPassword}
                                                onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                                placeholder="****************"
                                                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-sans"
                                            />
                                            <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                {showOld ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Create New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showNew ? "text" : "password"}
                                                    value={passwords.newPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                                    placeholder="****************"
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-sans"
                                                />
                                                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Confirm New Password</label>
                                            <div className="relative">
                                                <input
                                                    type={showConfirm ? "text" : "password"}
                                                    value={passwords.confirmPassword}
                                                    onChange={(e) => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                                    placeholder="****************"
                                                    className="w-full px-4 py-3 bg-white border border-gray-200 rounded-none text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 font-sans"
                                                />
                                                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={passSaving}
                                        className="px-8 py-3 bg-[#0A47C2] text-white rounded-none text-sm font-bold hover:opacity-90 flex items-center gap-2"
                                    >
                                        {passSaving && <Loader2 size={16} className="animate-spin" />}
                                        Change Password
                                    </button>
                                </form>
                            </section>
                        </div>

                        {/* Profile Photo */}
                        <div className="md:col-span-4 self-start">
                            <div className="bg-[#f8f9fa] rounded-xl p-8 flex flex-col items-center gap-6">
                                <div className="relative w-40 h-40 group cursor-pointer" onClick={() => document.getElementById("admin-pfp-input")?.click()}>
                                    <input 
                                        type="file" 
                                        id="admin-pfp-input" 
                                        className="hidden" 
                                        accept="image/*"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) {
                                                setImageFile(file);
                                                const reader = new FileReader();
                                                reader.onloadend = () => setImagePreview(reader.result as string);
                                                reader.readAsDataURL(file);
                                            }
                                        }}
                                    />
                                    <div className="absolute inset-0 rounded-2xl overflow-hidden border-4 border-white shadow-xl bg-gray-100 flex items-center justify-center">
                                        {imagePreview || currentImage ? (
                                            <Image
                                                src={imagePreview || getImageUrl(currentImage!)}
                                                alt="Profile"
                                                fill
                                                unoptimized
                                                className="object-cover group-hover:scale-110"
                                            />
                                        ) : (
                                            <UserIcon size={48} className="text-gray-200" />
                                        )}
                                    </div>
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 rounded-2xl flex flex-col items-center justify-center text-white gap-2">
                                        <Camera size={24} />
                                        <span className="text-[10px] font-bold uppercase tracking-widest">
                                            {imageUploading ? "Uploading..." : "Upload Photo"}
                                        </span>
                                    </div>
                                </div>

                                {imageFile && (
                                    <button 
                                        onClick={handleImageUpload}
                                        disabled={imageUploading}
                                        className="w-full py-2 bg-[#0A47C2] text-white text-[10px] font-bold uppercase tracking-widest rounded-lg hover:opacity-90 flex items-center justify-center gap-2"
                                    >
                                        {imageUploading && <Loader2 size={12} className="animate-spin" />}
                                        Save Photo
                                    </button>
                                )}

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
