"use client";

import React from "react";
import TeacherSidebar from "@/components/roles/TeacherSidebar";
import TeacherTopNavbar from "@/components/roles/TeacherTopNavbar";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

    return (
        <div className="flex bg-[#F9FAFB] h-screen overflow-hidden">
            <TeacherSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <TeacherTopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto px-4 md:px-0">
                    {children}
                    <div className="h-10" />
                </main>
            </div>
        </div>
    );
}
