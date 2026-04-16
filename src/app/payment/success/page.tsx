"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle, Home, Loader2, Sparkles } from "lucide-react";
import api from "@/lib/axios";
import Link from "next/link";

function PaymentSuccessContent() {
    const searchParams = useSearchParams();
    const classPaymentId = searchParams.get("classPaymentId");
    const paymentId = searchParams.get("paymentId"); // MyFatoorah might return paymentId

    const [loading, setLoading] = useState(true);
    const [data, setData] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const verifyPayment = async () => {
            if (!classPaymentId) {
                setError("Payment reference not found.");
                setLoading(false);
                return;
            }

            try {
                // Pass both classPaymentId and paymentId (if exists) so backend can verify
                let url = `/class-payments/verify-payment?classPaymentId=${classPaymentId}`;
                if (paymentId) {
                    url += `&paymentId=${paymentId}`;
                }

                const response = await api.get(url);
                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    setError(response.data.message || "Failed to verify payment.");
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
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh-90px)] p-4 text-center">
                <Loader2 className="w-16 h-16 animate-spin text-[#0A47C2] mb-4" />
                <h2 className="text-2xl font-extrabold text-[#0D1C35] mb-2 font-sans">Verifying Payment...</h2>
                <p className="text-gray-500 font-sans">Please wait while we confirm your transaction securely.</p>
            </div>
        );
    }

    if (error || (data && data.status !== "PAID")) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] p-4 text-center">
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
                    <span className="text-4xl">⚠️</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-[#0D1C35] mb-3 font-sans">Verification Failed</h2>
                <p className="text-gray-500 max-w-md font-sans mb-8 leading-relaxed">
                    {error || "Your payment could not be verified or has not been completed."}
                </p>
                <Link href="/classes" className="px-8 py-3 bg-[#0A47C2] text-white text-sm font-bold rounded-xl font-sans hover:bg-[#083a9e] transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                    Return to Classes
                </Link>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh)] p-4 bg-gray-50/50">
            <div className="w-full max-w-md bg-white p-8 md:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 text-center animate-in zoom-in duration-500">
                <div className="relative w-24 h-24 mx-auto mb-6 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-100">
                    <CheckCircle className="w-12 h-12 text-green-500" />
                    <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-amber-400 animate-pulse" />
                </div>

                <h1 className="text-3xl font-extrabold text-[#0D1C35] mb-2 font-sans tracking-tight">Payment Successful!</h1>
                <p className="text-gray-500 text-sm mb-8 font-sans leading-relaxed">
                    Thank you for your purchase. Your session has been booked and a confirmation email is on its way.
                </p>

                <div className="bg-gray-50 rounded-2xl p-5 mb-8 border border-gray-100 text-left space-y-3">
                    <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Amount Paid</span>
                        <span className="text-[#0D1C35] font-extrabold">${data?.amount} {data?.currency}</span>
                    </div>
                    <div className="w-full h-px bg-gray-200"></div>
                    <div className="flex justify-between text-sm items-center">
                        <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Invoice ID</span>
                        <span className="text-[#0D1C35] font-bold text-xs">{data?.invoiceId || "N/A"}</span>
                    </div>
                    {data?.classDetailType && (
                        <>
                            <div className="w-full h-px bg-gray-200"></div>
                            <div className="flex justify-between text-sm items-center">
                                <span className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Class Type</span>
                                <span className="text-[#0A47C2] font-bold bg-blue-50 px-2.5 py-1 rounded-md text-[10px] uppercase tracking-wider">{data?.classDetailType}</span>
                            </div>
                        </>
                    )}
                </div>

                <div className="flex flex-col gap-3">
                    <Link href="/classes" className="w-full py-3.5 bg-white border-2 border-gray-100 text-gray-600 text-sm font-bold rounded-xl font-sans hover:border-gray-200 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                        <Home size={16} /> Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-[calc(100vh-90px)] flex items-center justify-center"><Loader2 className="animate-spin text-[#0A47C2]" size={32} /></div>}>
            <PaymentSuccessContent />
        </Suspense>
    );
}
