"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Save, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import api from "@/lib/axios";
import dynamic from "next/dynamic";

// Dynamically import JoditEditor with SSR disabled
const JoditEditor = dynamic(() => import("jodit-react"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[60vh] bg-gray-50 flex items-center justify-center border border-gray-100">
            <Loader2 className="animate-spin text-[#0A47C2]" size={32} />
        </div>
    )
});

export default function PrivacyManagementPage() {
    const editor = useRef(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Jodit Configuration
    const config = useMemo(() => ({
        readonly: false,
        placeholder: '', // Remove placeholder to prevent overlap/overflow issues
        height: '600px',
        toolbarSticky: false,
        buttons: [
            'bold', 'italic', 'underline', 'strikethrough', '|',
            'superscript', 'subscript', '|',
            'ul', 'ol', '|',
            'outdent', 'indent', '|',
            'font', 'fontsize', 'brush', '|',
            'align', 'undo', 'redo', '|',
            'hr', 'eraser', 'copyformat', '|',
            'fullsize', 'print', 'about'
        ],
        removeButtons: ['image', 'video', 'file', 'image', 'video'],
        uploader: {
            insertImageAsBase64URI: false
        }
    }), []);

    useEffect(() => {
        fetchPrivacy();
    }, []);

    const fetchPrivacy = async () => {
        setLoading(true);
        try {
            const res = await api.get("/public/privacy-policy");
            if (res.data.success && res.data.data) {
                setContent(res.data.data.content || "");
            }
        } catch (err: any) {
            console.error("Error fetching privacy:", err);
            if (err.response?.status !== 404) {
                toast.error("Failed to load Privacy Policy");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!content.trim()) {
            return toast.error("Content cannot be empty");
        }
        setSaving(true);
        try {
            const res = await api.post("/public", {
                type: "privacy-policy",
                title: "Privacy Policy",
                content: content,
                publishedAt: new Date().toISOString()
            });
            if (res.data.success) {
                toast.success("Privacy Policy updated successfully");
            }
        } catch (err: any) {
            toast.error(err.response?.data?.message || "Failed to update Privacy Policy");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="px-4 md:px-8 py-8 space-y-8 bg-[#F9FAFB] min-h-screen">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0D1C35] font-sans">Privacy Policy</h1>
                    <p className="text-sm text-gray-500 font-sans">Manage how you handle user data with rich text</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving || loading}
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-[#0A47C2] text-white font-bold rounded-none text-sm font-sans hover:bg-[#083a9e] transition-all shadow-lg shadow-blue-100 disabled:opacity-50"
                >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save Changes
                </button>
            </div>

            {/* Content Area */}
            <div className="bg-white border border-gray-100 shadow-sm relative overflow-hidden">
                {loading && (
                    <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center gap-4">
                        <Loader2 size={40} className="text-[#0A47C2] animate-spin" />
                        <p className="text-sm font-bold text-gray-400 animate-pulse">Fetching documents...</p>
                    </div>
                )}

                <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-50 bg-gray-50/50">
                    <ShieldCheck size={16} className="text-[#0A47C2]" />
                    <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Privacy Editor</span>
                </div>

                <div className="p-0 prose max-w-none">
                    <JoditEditor
                        ref={editor}
                        value={content}
                        config={config}
                        onBlur={newContent => setContent(newContent)}
                    />
                </div>
            </div>
        </div>
    );
}
