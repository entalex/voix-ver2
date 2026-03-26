import { Button } from "@/components/ui/button";
import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";

const CTABanner = () => {
  const { cta } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
          {t(cta.headline, lang)}
        </h2>
        <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
          {t(cta.description, lang)}
        </p>
        <Button className="mt-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg">
          {t(cta.buttonText, lang)}
        </Button>
      </div>
    </section>
  );
};

export default CTABanner;
