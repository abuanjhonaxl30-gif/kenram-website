import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhyKenram from "@/components/WhyKenram";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhyKenram />
      </main>
      <Footer />
    </>
  );
}