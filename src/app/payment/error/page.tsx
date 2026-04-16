"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { XCircle, RefreshCcw, Loader2, Home } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

function PaymentErrorContent() {
    const searchParams = useSearchParams();
    const classPaymentId = searchParams.get("classPaymentId");
    const paymentId = searchParams.get("paymentId"); // MyFatoorah might return paymentId

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!classPaymentId) {
                setLoading(false);
                return;
            }

            try {
                let url = `/class-payments/verify-payment?classPaymentId=${classPaymentId}`;
                if (paymentId) {
                    url += `&paymentId=${paymentId}`;
                }

                const response = await api.get(url);
                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    setError(response.data.message);
                }
            } catch (err: any) {
                console.error("Verification error:", err);
                setError(err.response?.data?.message || "An error occurred while verifying the payment.");
            } finally {
                setLoading(false);
            }
        };

        verifyPayment();
    }, [classPaymentId, paymentId]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] p-4 text-center">
                <Loader2 className="w-16 h-16 animate-spin text-red-500 mb-4" />
                <h2 className="text-2xl font-extrabold text-[#0D1C35] mb-2 font-sans">Checking Status...</h2>
                <p className="text-gray-500 font-sans">Verifying your recent payment attempt.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] p-4 bg-gray-50/50">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center animate-in zoom-in duration-500">
                <div className="relative w-24 h-24 mx-auto mb-6 bg-red-50 rounded-full flex items-center justify-center border-4 border-red-100">
                    <XCircle className="w-12 h-12 text-red-500" />
                </div>

                <h1 className="text-3xl font-extrabold text-[#0D1C35] mb-2 font-sans tracking-tight">Payment Failed</h1>
                <p className="text-gray-500 text-sm mb-8 font-sans leading-relaxed">
                    {error || "Unfortunately, your transaction could not be processed. Your account has not been charged."}
                </p>

                {data && (
                    <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 text-left space-y-3">
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Amount</span>
                            <span className="text-[#0D1C35] font-extrabold">${data?.amount} {data?.currency}</span>
                        </div>
                        <div className="w-full h-px bg-gray-200"></div>
                        <div className="flex justify-between text-sm items-center">
                            <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Status</span>
                            <span className="text-red-600 font-bold bg-red-50 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">
                                {data?.status || "FAILED"}
                            </span>
                        </div>
                    </div>
                )}

                <div className="flex flex-col gap-3">
                    <Link href="/classes" className="w-full py-3.5 bg-[#0D1C35] text-white text-sm font-bold rounded-xl font-sans hover:bg-[#0A47C2] transition-all shadow-lg flex items-center justify-center gap-2">
                        <RefreshCcw size={16} /> Try Again
                    </Link>
                    <Link href="/" className="w-full py-3.5 bg-white border-2 border-gray-100 text-gray-600 text-sm font-bold rounded-xl font-sans hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <Home size={16} /> Return Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentErrorPage() {
    return (
        <Suspense fallback={<div className="min-h-[calc(100vh-90px)] flex items-center justify-center"><Loader2 className="animate-spin text-red-500" size={32} /></div>}>
            <PaymentErrorContent />
        </Suspense>
    );
}
