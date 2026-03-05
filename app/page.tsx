import Navbar from "@/components/layout/navbar/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Projects from "@/components/landing/Projects";
import Roadmap from "@/components/landing/Roadmap";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/layout/Footer";
import AmbientBackground from "@/components/background/AmbientBackground";

export default function Home() {
  return (
    <>
      <AmbientBackground />
      <Navbar />
      <main id="main-content">
        <Hero />
        <About />
        <Projects />
        <Roadmap />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
