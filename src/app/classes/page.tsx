import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import ClassesContent from "@/components/shared/ClassesContent";

export default function ClassesPage() {
    return (
        <main className="min-h-screen bg-white">
            <Navbar />
            <ClassesContent />
            <Footer />
        </main>
    );
}
