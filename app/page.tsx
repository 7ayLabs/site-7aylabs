import Navbar from "@/components/layout/navbar/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Projects from "@/components/landing/Projects";
import Token from "@/components/landing/Token";
import Roadmap from "@/components/landing/Roadmap";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-[#060606] text-white">
        <Hero />
        <About />
        <Projects />
        <Token />
        <Roadmap />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
