import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { Store, HeartPulse, GraduationCap, Building2 } from "lucide-react";

const icons = [Store, HeartPulse, GraduationCap, Building2];

const UseCases = () => {
  const { useCases } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section id="use-cases" className="py-16 md:py-24 animate-fade-up bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          {lang === "ka" ? "გამოყენების სფეროები" : "Use Cases"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <div
                key={idx}
                className="rounded-xl bg-white p-8 md:p-10 transition-shadow border border-border shadow-sm"
              >
                <div className="mb-4">
                  <Icon className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold mb-3 text-primary">
                  {t(uc.title, lang)}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(uc.description, lang)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
