"use client";

import React from "react";
import AdminSidebar from "@/components/roles/AdminSidebar";
import AdminTopNavbar from "@/components/roles/AdminTopNavbar";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="flex bg-[#F9FAFB] h-screen overflow-hidden text-sans">
            <AdminSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <AdminTopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto px-4 md:px-0">
                    {children}
                    <div className="h-10" />
                </main>
            </div>
        </div>
    );
}
