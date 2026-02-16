import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import WhyVoix from "@/components/landing/WhyVoix";
import Features from "@/components/landing/Features";
import HowItWorks from "@/components/landing/HowItWorks";
import UseCases from "@/components/landing/UseCases";
import Team from "@/components/landing/Team";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <WhyVoix />
        <Features />
        <HowItWorks />
        <UseCases />
        <Team />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
