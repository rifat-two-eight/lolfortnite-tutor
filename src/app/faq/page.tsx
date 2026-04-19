"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import api from "@/lib/axios";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

interface FAQ {
    _id: string;
    question: string;
    answer: string;
    category?: string;
}

interface Policy {
    _id: string;
    type: string;
    title: string;
    content: string;
    publishedAt: string;
    updatedAt: string;
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div className={`border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 ${open ? "shadow-md" : "shadow-sm"}`}>
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 px-6 py-5 bg-white hover:bg-blue-50/40 transition-colors text-left"
            >
                <span className="font-semibold text-gray-800 text-sm sm:text-base font-sans">{question}</span>
                <span className="flex-shrink-0 text-[#0A47C2]">
                    {open ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                </span>
            </button>
            {open && (
                <div className="px-6 pb-5 bg-white border-t border-gray-50">
                    <p className="text-gray-500 text-sm leading-relaxed font-sans pt-4">{answer}</p>
                </div>
            )}
        </div>
    );
}

export default function FAQPage() {
    const [faqs, setFaqs] = useState<FAQ[]>([]);
    const [policy, setPolicy] = useState<Policy | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        // Try fetching from a FAQ-specific endpoint or fallback to content
        api.get("/public/FAQ")
            .then((res) => {
                if (res.data.success) {
                    const data = res.data.data;
                    // If data comes as array of FAQ items
                    if (Array.isArray(data)) {
                        setFaqs(data);
                    } else {
                        // If it's a policy object with content, parse or display as-is
                        setPolicy(data);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const filtered = faqs.filter(
        (f) =>
            f.question.toLowerCase().includes(search.toLowerCase()) ||
            f.answer.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <div className="bg-white shadow-sm">
                <Navbar compact />
            </div>

            {/* Hero Banner */}
            <div className="bg-linear-to-r from-[#6f42c1] to-[#9c6dd8] py-8">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <div className="inline-flex items-center justify-center w-14 h-14 bg-white/20 rounded-2xl mb-4">
                        <HelpCircle className="text-white" size={28} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 font-sans">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-purple-200 text-sm mb-6">
                        Find answers to the most common questions about Educate
                    </p>
                    {/* Search */}
                    {faqs.length > 0 && (
                        <div className="max-w-md mx-auto relative">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search questions..."
                                className="w-full px-5 py-3 rounded-full bg-white/20 text-white placeholder-purple-200 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50 text-sm backdrop-blur-sm"
                            />
                        </div>
                    )}
                </div>
            </div>

            {/* Content */}
            <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-12">
                {loading ? (
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-16 bg-white rounded-2xl animate-pulse border border-gray-100" />
                        ))}
                    </div>
                ) : faqs.length > 0 ? (
                    <>
                        {search && (
                            <p className="text-gray-500 text-sm mb-4 font-sans">
                                {filtered.length} result{filtered.length !== 1 ? "s" : ""} for &quot;{search}&quot;
                            </p>
                        )}
                        <div className="space-y-3">
                            {(search ? filtered : faqs).map((faq) => (
                                <FAQItem key={faq._id} question={faq.question} answer={faq.answer} />
                            ))}
                            {search && filtered.length === 0 && (
                                <div className="text-center py-16 text-gray-400">
                                    <HelpCircle size={40} className="mx-auto mb-3 opacity-30" />
                                    <p className="font-sans">No results found for &quot;{search}&quot;</p>
                                </div>
                            )}
                        </div>
                    </>
                ) : policy ? (
                    /* Fallback: show as rich content if response is a policy doc */
                    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8 sm:p-12">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 font-sans">{policy.title}</h2>
                        <div
                            className="prose max-w-none text-gray-600 leading-relaxed font-sans text-sm sm:text-base"
                            dangerouslySetInnerHTML={{ __html: policy.content.replace(/\n/g, "<br/>") }}
                        />
                    </div>
                ) : (
                    <div className="text-center py-20 text-gray-400">
                        <HelpCircle size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-sans">No FAQs available at the moment.</p>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
