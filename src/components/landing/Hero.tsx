import { Button } from "@/components/ui/button";
import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import ParticleWave from "./ParticleWave";

const Hero = () => {
  const { hero } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-[#07101f]">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white max-w-4xl mx-auto leading-tight">
          {t(hero.headline, lang)}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
          {t(hero.subheadline, lang)}
        </p>
        <Button className="mt-8 rounded-full bg-secondary text-white hover:bg-secondary/90 px-8 py-6 text-lg">
          {t(hero.buttonText, lang)}
        </Button>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {[
            "10,000+ Conversations Analyzed",
            "40% Compliance Improvement",
            "< 5min Setup",
          ].map((stat) => (
            <span
              key={stat}
              className="bg-white/10 text-white/60 rounded-full text-sm px-4 py-1"
            >
              {stat}
            </span>
          ))}
        </div>

        <div className="mt-12 w-full aspect-video relative bg-transparent">
          <ParticleWave />
        </div>
      </div>
    </section>
  );
};

export default Hero;
