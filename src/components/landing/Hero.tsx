import { Button } from "@/components/ui/button";
import { useLandingData } from "@/context/LandingDataContext";
import ParticleWave from "./ParticleWave";

const Hero = () => {
  const { hero } = useLandingData();

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary max-w-4xl mx-auto leading-tight">
          {hero.headline}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {hero.subheadline}
        </p>
        <Button className="mt-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg">
          {hero.buttonText}
        </Button>

        <div className="mt-12 mx-auto max-w-3xl aspect-video rounded-2xl overflow-hidden relative">
          <ParticleWave />
        </div>
      </div>
    </section>
  );
};

export default Hero;
