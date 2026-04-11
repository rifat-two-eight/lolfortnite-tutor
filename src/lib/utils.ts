import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getImageUrl(path: string | undefined) {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "";
    const cleanPath = path.replace(/\\/g, "/").replace(/^\//, "");
    return `${baseUrl}/${cleanPath}`;
}
