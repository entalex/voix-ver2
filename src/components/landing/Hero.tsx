import { Button } from "@/components/ui/button";
import { Mic } from "lucide-react";
import { useLandingData } from "@/context/LandingDataContext";

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

        {/* TODO: Replace placeholder with dynamic hero image from Supabase Storage */}
        <div className="mt-12 mx-auto max-w-3xl aspect-video rounded-2xl bg-primary/5 border-2 border-dashed border-primary/20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <Mic className="h-12 w-12 text-secondary" />
            <span className="text-sm font-medium">Hero Image / 3D Illustration</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
