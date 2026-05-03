import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Lock, TrendingUp, Shield, Eye, Mic, BarChart3, Search, FileText, Upload, Store, HeartPulse, GraduationCap, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap, Lock, TrendingUp, Shield, Eye, Mic, BarChart3, Search, FileText, Upload, Store, HeartPulse, GraduationCap, Building2,
};

const WhyVoix = () => {
  const { whyVoix } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section className="py-16 md:py-24 animate-fade-up bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          {t(whyVoix.sectionTitle, lang)}
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          {t(whyVoix.sectionSubtitle, lang)}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyVoix.cards.map((item, idx) => {
            const Icon = iconMap[item.iconName] || Zap;
            return (
              <Card
                key={idx}
                className="bg-white border-t-4 border-amber-400 rounded-xl shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <CardContent className="p-8 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-primary">{t(item.title, lang)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(item.description, lang)}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyVoix;
