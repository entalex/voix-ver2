import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import WhyVoix from "@/components/landing/WhyVoix";
import HowItWorks from "@/components/landing/HowItWorks";
import Features from "@/components/landing/Features";
import UseCases from "@/components/landing/UseCases";
import Team from "@/components/landing/Team";
import Contact from "@/components/landing/Contact";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";
import BackgroundOrbs from "@/components/motion/BackgroundOrbs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background relative">
      <BackgroundOrbs />
      <Navbar />
      <main>
        <Hero />
        <WhyVoix />
        <HowItWorks />
        <Features />
        <Team />
        <UseCases />
        <CTABanner />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
