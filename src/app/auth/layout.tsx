import Image from "next/image";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="relative min-h-screen w-full flex items-center justify-center p-4">
            {/* Background Image */}
            <div className="fixed inset-0 z-0">
                <Image
                    src="/authpic.jpg"
                    alt="Auth Background"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Overlay for better readability if needed */}
                <div className="absolute inset-0 bg-black/20" />
            </div>

            {/* Auth Card Container */}
            <div className="relative z-10 w-full max-w-md md:max-w-xl transition-all duration-300">
                <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl p-8 md:p-12 overflow-hidden">
                    {children}
                </div>
            </div>
        </div>
    );
}
