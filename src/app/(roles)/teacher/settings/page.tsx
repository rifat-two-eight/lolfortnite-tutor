"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff, Save, Loader2, Plus, X, Camera, User } from "lucide-react";
import Image from "next/image";
import { getImageUrl } from "@/lib/utils";
import { toast } from "sonner";
import api from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

interface ProfileForm {
    name: string;
    phone: number;
    language: string;
    location: { lat: number | string; lng: number | string };
    address: {
        street: string;
        city: string;
        state: string;
        zipCode: string;
        country: string;
    };
    availabilityLocation: {
        address: string;
        lat: number | string;
        lng: number | string;
        radiusKm: number | string;
    };
    preferences: {
        subjects: string[];
        curriculum: string[];
        teacherGender: string;
        languages: string[];
    };
}

const defaultForm: ProfileForm = {
    name: "",
    phone: "",
    language: "",
    location: { lat: "", lng: "" },
    address: { street: "", city: "", state: "", zipCode: "", country: "" },
    availabilityLocation: { address: "", lat: "", lng: "", radiusKm: "" },
    preferences: { subjects: [], curriculum: [], teacherGender: "", languages: [] },
};

function TagInput({
    label,
    values,
    onChange,
    placeholder,
}: {
    label: string;
    values: string[];
    onChange: (v: string[]) => void;
    placeholder?: string;
}) {
    const [input, setInput] = useState("");

    const add = () => {
        const v = input.trim();
        if (v && !values.includes(v)) {
            onChange([...values, v]);
        }
        setInput("");
    };

    return (
        <div className="space-y-2">
            <label className="text-xs font-semibold text-gray-400 font-sans">{label}</label>
            <div className="flex flex-wrap gap-2 min-h-[44px] border border-gray-100 px-3 py-2 focus-within:border-[#0A47C2]">
                {values.map((v) => (
                    <span key={v} className="inline-flex items-center gap-1 bg-blue-50 text-[#0A47C2] text-xs font-bold px-3 py-1 rounded-full">
                        {v}
                        <button type="button" onClick={() => onChange(values.filter((x) => x !== v))}>
                            <X size={10} />
                        </button>
                    </span>
                ))}
                <input
                    className="flex-1 min-w-[120px] text-sm font-sans focus:outline-none"
                    placeholder={placeholder || `Add ${label.toLowerCase()}...`}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") { e.preventDefault(); add(); }
                    }}
                />
                <button type="button" onClick={add} className="text-[#0A47C2] hover:opacity-70">
                    <Plus size={16} />
                </button>
            </div>
        </div>
    );
}

export default function TeacherSettingsPage() {
    const setUser = useAuthStore((state) => state.setUser);
    const [form, setForm] = useState<ProfileForm>(defaultForm);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Image upload
    const [currentImage, setCurrentImage] = useState<string | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [imageUploading, setImageUploading] = useState(false);

    // Password fields
    const [showCurrentPw, setShowCurrentPw] = useState(false);
    const [showNewPw, setShowNewPw] = useState(false);
    const [showConfirmPw, setShowConfirmPw] = useState(false);
    const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

    useEffect(() => {
        api.get("/auth/me")
            .then((res) => {
                if (res.data.success) {
                    const d = res.data.data;
                    if (d.profileImage) setCurrentImage(getImageUrl(d.profileImage));
                    setForm({
                        name: d.name || "",
                        phone: d.phone || "",
                        language: d.language || "",
                        location: { lat: d.location?.lat ?? "", lng: d.location?.lng ?? "" },
                        address: {
                            street: d.address?.street || "",
                            city: d.address?.city || "",
                            state: d.address?.state || "",
                            zipCode: d.address?.zipCode || "",
                            country: d.address?.country || "",
                        },
                        availabilityLocation: {
                            address: d.availabilityLocation?.address || "",
                            lat: d.availabilityLocation?.lat ?? "",
                            lng: d.availabilityLocation?.lng ?? "",
                            radiusKm: d.availabilityLocation?.radiusKm ?? "",
                        },
                        preferences: {
                            subjects: d.preferences?.subjects || [],
                            curriculum: d.preferences?.curriculum || [],
                            teacherGender: d.preferences?.teacherGender || "",
                            languages: d.preferences?.languages || [],
                        },
                    });
                }
            })
            .catch(() => toast.error("Failed to load profile"))
            .finally(() => setLoading(false));
    }, []);

    const setField = <K extends keyof ProfileForm>(key: K, value: ProfileForm[K]) =>
        setForm((prev) => ({ ...prev, [key]: value }));

    const handleImageUpload = async () => {
        if (!imageFile) return;
        setImageUploading(true);
        try {
            const formData = new FormData();
            formData.append("profileImage", imageFile);
            const res = await api.patch("/auth/profile", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            if (res.data.success) {
                toast.success("Profile image updated!");
                if (imagePreview) setCurrentImage(imagePreview);
                setImageFile(null);
                setImagePreview(null);

                // Refresh global auth store using fresh data to guarantee UI updates sync across navbars
                const meRes = await api.get("/auth/me");
                if (meRes.data.success) {
                    setUser(meRes.data.data);
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to upload image");
        } finally {
            setImageUploading(false);
        }
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await api.patch("/auth/profile", {
                name: form.name,
                phone: form.phone,
                language: form.language,
                location: {
                    lat: Number(form.location.lat),
                    lng: Number(form.location.lng),
                },
                address: form.address,
                availabilityLocation: {
                    address: form.availabilityLocation.address,
                    lat: Number(form.availabilityLocation.lat),
                    lng: Number(form.availabilityLocation.lng),
                    radiusKm: Number(form.availabilityLocation.radiusKm),
                },
                preferences: form.preferences,
            });
            if (res.data.success) {
                toast.success("Profile updated successfully!");
                // Keep the global auth store in sync with the latest data
                const meRes = await api.get("/auth/me");
                if (meRes.data.success) {
                    setUser(meRes.data.data);
                }
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    const handleSavePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pwForm.newPassword !== pwForm.confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }
        setSaving(true);
        try {
            const res = await api.post("/auth/change-password", {
                currentPassword: pwForm.currentPassword,
                newPassword: pwForm.newPassword,
            });
            if (res.data.success) {
                toast.success("Password changed successfully!");
                setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to change password");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-[#0A47C2] animate-spin" />
            </div>
        );
    }

    return (
        <div className="px-4 md:px-8 py-8 space-y-8">
            {/* Profile Settings */}
            <form onSubmit={handleSave} className="space-y-8">

                {/* Profile Image Upload */}
                <div className="bg-white border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Profile Image</h2>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                        {/* Preview */}
                        <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-md overflow-hidden bg-gray-50 flex items-center justify-center group shrink-0">
                            {imagePreview || currentImage ? (
                                <Image
                                    src={imagePreview || currentImage!}
                                    alt="Profile"
                                    fill
                                    unoptimized
                                    className="object-cover"
                                />
                            ) : (
                                <User size={40} className="text-blue-200" />
                            )}
                            {/* Hover Overlay */}
                            <label className="absolute inset-0 bg-black/40 backdrop-blur-sm flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 cursor-pointer">
                                <Camera size={20} className="text-white" />
                                <span className="text-[10px] text-white font-bold uppercase tracking-tight">Change</span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={(e) => {
                                        const file = e.target.files?.[0];
                                        if (file) {
                                            setImageFile(file);
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                />
                            </label>
                        </div>

                        {/* Info + Upload Button */}
                        <div className="space-y-3">
                            <p className="text-sm text-gray-500 font-sans">Hover over the avatar to select a new image.</p>
                            <p className="text-xs text-gray-400 font-sans">Recommended: Square image, under 2MB (JPG, PNG).</p>
                            {imageFile && (
                                <div className="flex items-center gap-3">
                                    <span className="text-xs text-gray-500 font-sans truncate max-w-[200px]">{imageFile.name}</span>
                                    <button
                                        type="button"
                                        onClick={handleImageUpload}
                                        disabled={imageUploading}
                                        className="flex items-center gap-2 bg-[#0A47C2] text-white font-bold py-2 px-6 text-xs font-sans hover:bg-[#083a9e] uppercase tracking-wider disabled:opacity-50"
                                    >
                                        {imageUploading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                        Upload
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setImageFile(null); setImagePreview(null); }}
                                        className="text-gray-400 hover:text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Basic Info */}
                <div className="bg-white border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setField("name", e.target.value)}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Phone</label>
                            <input
                                type="number"
                                value={form.phone}
                                onChange={(e) => setField("phone", e.target.value)}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Language</label>
                            <input
                                type="text"
                                value={form.language}
                                onChange={(e) => setField("language", e.target.value)}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div className="bg-white border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Address</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(["street", "city", "state", "zipCode", "country"] as const).map((field) => (
                            <div key={field} className="space-y-2">
                                <label className="text-xs font-semibold text-gray-400 font-sans capitalize">{field === "zipCode" ? "Zip Code" : field}</label>
                                <input
                                    type="text"
                                    value={form.address[field]}
                                    onChange={(e) => setField("address", { ...form.address, [field]: e.target.value })}
                                    className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Location */}
                <div className="bg-white border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Location Coordinates</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Latitude</label>
                            <input
                                type="number"
                                value={form.location.lat}
                                onChange={(e) => setField("location", { ...form.location, lat: e.target.value })}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Longitude</label>
                            <input
                                type="number"
                                value={form.location.lng}
                                onChange={(e) => setField("location", { ...form.location, lng: e.target.value })}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                    </div>
                </div>

                {/* Availability Location */}
                <div className="bg-white border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Availability Location</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Address</label>
                            <input
                                type="text"
                                value={form.availabilityLocation.address}
                                onChange={(e) => setField("availabilityLocation", { ...form.availabilityLocation, address: e.target.value })}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Latitude</label>
                            <input
                                type="number"
                                value={form.availabilityLocation.lat}
                                onChange={(e) => setField("availabilityLocation", { ...form.availabilityLocation, lat: e.target.value })}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Longitude</label>
                            <input
                                type="number"
                                value={form.availabilityLocation.lng}
                                onChange={(e) => setField("availabilityLocation", { ...form.availabilityLocation, lng: e.target.value })}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Radius (km)</label>
                            <input
                                type="number"
                                value={form.availabilityLocation.radiusKm}
                                onChange={(e) => setField("availabilityLocation", { ...form.availabilityLocation, radiusKm: e.target.value })}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                            />
                        </div>
                    </div>
                </div>

                {/* Preferences */}
                <div className="bg-white border border-gray-100 shadow-sm p-8">
                    <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Preferences</h2>
                    <div className="space-y-6">
                        <TagInput
                            label="Subjects"
                            values={form.preferences.subjects}
                            onChange={(v) => setField("preferences", { ...form.preferences, subjects: v })}
                            placeholder="e.g. Math, Physics..."
                        />
                        <TagInput
                            label="Curriculum"
                            values={form.preferences.curriculum}
                            onChange={(v) => setField("preferences", { ...form.preferences, curriculum: v })}
                            placeholder="e.g. English Medium..."
                        />
                        <TagInput
                            label="Languages"
                            values={form.preferences.languages}
                            onChange={(v) => setField("preferences", { ...form.preferences, languages: v })}
                            placeholder="e.g. English, Bangla..."
                        />
                        <div className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">Teacher Gender</label>
                            <select
                                value={form.preferences.teacherGender}
                                onChange={(e) => setField("preferences", { ...form.preferences, teacherGender: e.target.value })}
                                className="w-full h-12 border border-gray-100 px-4 text-sm font-sans focus:outline-none focus:border-[#0A47C2] transition-colors bg-white"
                            >
                                <option value="">Select Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#0A47C2] text-white font-bold py-3 px-10 text-xs font-sans hover:bg-[#083a9e] transition-colors uppercase tracking-wider shadow-sm disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </div>
            </form>

            {/* Change Password */}
            <div className="bg-white border border-gray-100 shadow-sm p-8">
                <h2 className="text-xl font-bold text-[#0D1C35] font-sans mb-8">Change Password</h2>
                <form onSubmit={handleSavePassword} className="space-y-6 max-w-xl">
                    {[
                        { key: "currentPassword", label: "Current Password", show: showCurrentPw, toggle: setShowCurrentPw },
                        { key: "newPassword", label: "New Password", show: showNewPw, toggle: setShowNewPw },
                        { key: "confirmPassword", label: "Confirm New Password", show: showConfirmPw, toggle: setShowConfirmPw },
                    ].map(({ key, label, show, toggle }) => (
                        <div key={key} className="space-y-2">
                            <label className="text-xs font-semibold text-gray-400 font-sans">{label}</label>
                            <div className="relative">
                                <input
                                    type={show ? "text" : "password"}
                                    value={pwForm[key as keyof typeof pwForm]}
                                    onChange={(e) => setPwForm((p) => ({ ...p, [key]: e.target.value }))}
                                    className="w-full h-12 border border-gray-100 px-4 pr-12 text-sm font-sans focus:outline-none focus:border-[#0A47C2]"
                                />
                                <button
                                    type="button"
                                    onClick={() => toggle(!show)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {show ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    ))}
                    <button
                        type="submit"
                        disabled={saving}
                        className="flex items-center gap-2 bg-[#0A47C2] text-white font-bold py-3 px-8 text-xs font-sans hover:bg-[#083a9e] transition-colors uppercase tracking-wider shadow-sm disabled:opacity-50"
                    >
                        {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                        Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
}
