import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import TutorsContent from "@/components/shared/TutorsContent";

export default function TutorsPage() {
    return (
        <main className="min-h-screen">
            <Navbar />
            <TutorsContent />
            <Footer />
        </main>
    );
}
