import { Button } from "@/components/ui/button";
import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import ProceduralVoiceWave from "./ProceduralVoiceWave";

const Hero = () => {
  const { hero } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-muted/30">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary max-w-4xl mx-auto leading-tight">
          {t(hero.headline, lang)}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          {t(hero.subheadline, lang)}
        </p>
        <Button className="mt-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg">
          {t(hero.buttonText, lang)}
        </Button>

        <p className="mt-6 text-xs text-muted-foreground tracking-widest uppercase">
          {lang === "ka" ? "AI-ით აღჭურვილი" : "Powered by AI"}
        </p>

        <div className="mt-12 mx-auto max-w-5xl aspect-video rounded-2xl overflow-hidden relative bg-muted">
          <ProceduralVoiceWave />
        </div>
      </div>
    </section>
  );
};

export default Hero;
