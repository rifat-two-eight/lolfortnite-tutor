"use client";

import { Suspense } from "react";
import MessagingContainer from "@/components/shared/MessagingContainer";

export default function MessagesPage() {
    return (
        <div className="h-screen bg-white">
            <Suspense fallback={<div className="flex h-full items-center justify-center">Loading...</div>}>
                <MessagingContainer />
            </Suspense>
        </div>
    );
}
