"use client";

import MessagingContainer from "@/components/shared/MessagingContainer";

export default function TeacherMessagesPage() {
    return (
        <div className="h-[calc(100vh-80px)] -mt-1 -mx-4 md:-mx-0">
            <MessagingContainer hideLogo={true} showHeader={false} />
        </div>
    );
}
