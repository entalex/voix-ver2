import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import WhyVoix from "@/components/landing/WhyVoix";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import Team from "@/components/landing/Team";
import Contact from "@/components/landing/Contact";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <WhyVoix />
        <Features />
        <Team />
        <UseCases />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;