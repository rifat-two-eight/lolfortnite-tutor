"use client";

import React from "react";
import { X, ExternalLink } from "lucide-react";
import { FaGoogleDrive } from "react-icons/fa";

interface GoogleDriveVideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    driveLink: string;
    title?: string;
}

export default function GoogleDriveVideoModal({ isOpen, onClose, driveLink, title }: GoogleDriveVideoModalProps) {
    if (!isOpen || !driveLink) return null;

    // Convert Drive link to preview link if it's not already
    const getPreviewLink = (url: string) => {
        try {
            // Handle /d/ID format
            const driveIdMatch = url.match(/\/d\/([^/|\?]+)/);
            if (driveIdMatch && driveIdMatch[1]) {
                return `https://drive.google.com/file/d/${driveIdMatch[1]}/preview`;
            }
            // Handle ?id=ID format
            const urlObj = new URL(url);
            const id = urlObj.searchParams.get("id");
            if (id) {
                return `https://drive.google.com/file/d/${id}/preview`;
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    const previewLink = getPreviewLink(driveLink);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-[#0D1C35]/60 backdrop-blur-sm animate-in fade-in duration-300"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/10">
                {/* Header */}
                <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/20 backdrop-blur-sm flex items-center justify-center text-blue-400 border border-blue-500/30">
                            <FaGoogleDrive size={20} />
                        </div>
                        <div className="text-left">
                            <h3 className="text-white font-bold text-sm sm:text-base font-sans truncate max-w-[200px] sm:max-w-md">
                                {title || "Google Drive Video"}
                            </h3>
                            <p className="text-blue-400/80 text-[10px] font-bold uppercase tracking-widest">Recording Preview</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <a 
                            href={driveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-white transition-all backdrop-blur-sm border border-white/10 group"
                            title="Open in Google Drive"
                        >
                            <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
                        </a>
                        <button
                            onClick={onClose}
                            className="p-2.5 bg-white/10 hover:bg-red-500 rounded-xl text-white transition-all backdrop-blur-sm border border-white/10 group"
                        >
                            <X size={20} className="group-hover:rotate-90 transition-transform duration-300" />
                        </button>
                    </div>
                </div>

                {/* Video Iframe */}
                <div className="w-full h-full pt-16">
                    <iframe
                        src={previewLink}
                        className="w-full h-full border-none"
                        allow="autoplay"
                        allowFullScreen
                    />
                </div>
            </div>
        </div>
    );
}
