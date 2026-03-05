import Navbar from "@/components/layout/navbar/Navbar";
import Hero from "@/components/landing/Hero";
import About from "@/components/landing/About";
import Projects from "@/components/landing/Projects";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content" className="bg-[var(--color-bg-primary)] text-fg">
        <Hero />
        <About />
        <Projects />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
