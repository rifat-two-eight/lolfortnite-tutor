import React from "react";
import Image from "next/image";
import { getImageUrl, cn } from "@/lib/utils";

interface UserAvatarProps {
    src?: string;
    name?: string;
    size?: string;
    className?: string;
    showInitial?: boolean;
}

const UserAvatar: React.FC<UserAvatarProps> = ({
    src,
    name = "User",
    size = "w-10 h-10",
    className,
    showInitial = true
}) => {
    const imageUrl = getImageUrl(src);
    const initial = name.trim().charAt(0).toUpperCase() || "U";

    // Common container styles
    const containerClasses = cn(
        "relative rounded-full overflow-hidden shrink-0 flex items-center justify-center",
        size,
        !imageUrl && "bg-gradient-to-br from-[#0A47C2] to-[#4F46E5] text-white font-bold",
        className
    );

    if (imageUrl) {
        return (
            <div className={containerClasses}>
                <Image
                    src={imageUrl}
                    alt={name}
                    fill
                    className="object-cover"
                    unoptimized
                />
            </div>
        );
    }

    return (
        <div className={containerClasses}>
            {showInitial && (
                <span className={cn(
                    "select-none font-sans",
                    size.includes("w-8") ? "text-xs" : size.includes("w-12") ? "text-base" : "text-sm"
                )}>
                    {initial}
                </span>
            )}
        </div>
    );
};

export default UserAvatar;
