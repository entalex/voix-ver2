import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { howItWorks } from "@/data/landingData";

const HowItWorks = () => {
  const { howItWorks: hiwData } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section id="how-it-works" className="bg-white py-20 md:py-28">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          {t(hiwData.sectionTitle, lang)}
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto">
          {t(hiwData.sectionSubtitle, lang)}
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {hiwData.steps.map((step, idx) => {
            const Icon = howItWorks[idx]?.icon;
            return (
              <div key={idx} className="flex flex-col items-center text-center">
                <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4 ring-4 ring-amber-200/60">
                  <span className="text-2xl font-bold text-secondary-foreground">{idx + 1}</span>
                </div>
                {Icon && <Icon className="h-8 w-8 text-primary mb-3" />}
                <h3 className="text-xl font-semibold text-primary">{t(step.title, lang)}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t(step.description, lang)}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
