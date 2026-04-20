"use client";

import React from "react";
import TeacherSidebar from "@/components/roles/TeacherSidebar";
import TeacherTopNavbar from "@/components/roles/TeacherTopNavbar";
import { usePathname } from "next/navigation";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    const pathname = usePathname();

    // Hide sidebar and navbar for messages page to match homepage design
    if (pathname === "/teacher/messages") {
        return <div className="h-screen w-full overflow-hidden">{children}</div>;
    }

    return (
        <div className="flex bg-[#F9FAFB] h-screen overflow-hidden">
            <TeacherSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
            <div className="flex-1 flex flex-col min-w-0 h-full">
                <TeacherTopNavbar onMenuClick={() => setIsSidebarOpen(true)} />
                <main className="flex-1 overflow-y-auto">
                    <div className="px-4 md:px-8 py-6">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
