"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import api from "@/lib/axios";
import { ShieldCheck } from "lucide-react";

interface Policy {
    _id: string;
    type: string;
    title: string;
    content: string;
    publishedAt: string;
    updatedAt: string;
}

export default function PrivacyPage() {
    const [policy, setPolicy] = useState<Policy | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/public")
            .then((res) => {
                if (res.data.success) {
                    const data: Policy[] = res.data.data;
                    // Match "privacy-policy" or "PRIVACY_POLICY"
                    const found = data.find(
                        (p) =>
                            p.type.toLowerCase() === "privacy-policy" ||
                            p.type.toUpperCase() === "PRIVACY_POLICY"
                    );
                    setPolicy(found ?? null);
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="bg-white shadow-sm">
                <Navbar compact />
            </div>

            {/* Hero Banner */}
            <div className="bg-linear-to-r from-[#0f5132] to-[#198754] py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
                        <ShieldCheck className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 font-sans">
                        {loading ? "Privacy Policy" : policy?.title ?? "Privacy Policy"}
                    </h1>
                    {policy?.updatedAt && (
                        <p className="text-green-200 text-sm mt-2">
                            Last updated:{" "}
                            {new Date(policy.updatedAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                            })}
                        </p>
                    )}
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                {loading ? (
                    <div className="space-y-4 animate-pulse">
                        {[...Array(8)].map((_, i) => (
                            <div
                                key={i}
                                className="h-4 bg-gray-200 rounded-full"
                                style={{ width: `${80 + (i % 3) * 10}%` }}
                            />
                        ))}
                    </div>
                ) : policy ? (
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
                        <div
                            className="prose prose-green max-w-none text-gray-600 leading-relaxed font-sans text-sm sm:text-base rich-text-content"
                            dangerouslySetInnerHTML={{ __html: policy.content }}
                        />
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <ShieldCheck size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-sans">Content not available.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
