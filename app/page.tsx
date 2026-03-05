import Navbar from "@/components/layout/navbar/Navbar";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import About from "@/components/landing/About";
import ProtocolModules from "@/components/landing/ProtocolModules";
import DevnetStatus from "@/components/landing/DevnetStatus";
import Projects from "@/components/landing/Projects";
import Newsletter from "@/components/landing/Newsletter";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main id="main-content">
        <Hero />
        <HowItWorks />
        <About />
        <ProtocolModules />
        <DevnetStatus />
        <Projects />
        <Newsletter />
      </main>
      <Footer />
    </>
  );
}
