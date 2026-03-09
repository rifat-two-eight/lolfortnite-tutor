"use client";

function PersonalizedIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4B7BF5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
        </svg>
    );
}

function StandardsIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4B7BF5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            <path d="M9 12l2 2 4-4" />
        </svg>
    );
}

function SuccessIcon() {
    return (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#4B7BF5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
            <polyline points="17 6 23 6 23 12" />
        </svg>
    );
}

const features = [
    {
        icon: <PersonalizedIcon />,
        title: "Personalized Pedagogy",
        description:
            "Deeply tailored curricula adjusted in real-time to match individual learning styles and ambitious goals.",
    },
    {
        icon: <StandardsIcon />,
        title: "Rigorous Standards",
        description:
            "Our tutors undergo the strictest selection process globally, with only the top 1% from Ivy League and Oxbridge.",
    },
    {
        icon: <SuccessIcon />,
        title: "Proven Success",
        description:
            "A track record of placing students into top-tier universities and helping them master complex disciplines.",
    },
];

export default function AcademicExcellence() {
    return (
        <section className="w-full bg-[#101828] py-16 md:py-20 px-4 sm:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-12 space-y-4">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-white font-sans">
                        Our Academic Excellence
                    </h2>
                    <p className="text-gray-400 text-sm md:text-base mx-auto leading-relaxed font-sans">
                        Our unique pedagogy is meticulously designed for elite learners <br className="hidden md:block" /> who demand nothing but the absolute best in educational <br className="hidden md:block" /> outcomes.
                    </p>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature) => (
                        <div
                            key={feature.title}
                            className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col gap-4"
                        >
                            {/* Icon Box */}
                            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                                {feature.icon}
                            </div>

                            {/* Title */}
                            <h3 className="text-white font-bold text-base font-sans">
                                {feature.title}
                            </h3>

                            {/* Description */}
                            <p className="text-gray-400 text-sm leading-relaxed font-sans">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}