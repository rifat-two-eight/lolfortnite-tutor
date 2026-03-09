import Navbar from "@/components/shared/Navbar";
import Hero from "@/components/shared/Hero";
import Courses from "@/components/shared/Courses";
import AcademicExcellence from "@/components/shared/Academic";
import TopTutors from "@/components/shared/TopTutors";
import Footer from "@/components/shared/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <hr />
      <Courses />
      <AcademicExcellence />
      <TopTutors />
      <Footer />
    </main>
  );
}
