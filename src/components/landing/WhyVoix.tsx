import { useLandingData } from "@/context/LandingDataContext";
import { Zap, Lock, TrendingUp, Shield, Eye, Mic, BarChart3, Search, FileText, Upload, Store, HeartPulse, GraduationCap, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap, Lock, TrendingUp, Shield, Eye, Mic, BarChart3, Search, FileText, Upload, Store, HeartPulse, GraduationCap, Building2,
};

const WhyVoix = () => {
  const { whyVoix } = useLandingData();

  return (
    <section className="py-16x md:py-20x">
      <div className="max-w-[1200px] mx-auto px-4x">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center">
          {whyVoix.sectionTitle}
        </h2>
        <p className="mt-2x text-muted-foreground text-center max-w-2xl mx-auto mb-10x">
          {whyVoix.sectionSubtitle}
        </p>

        <div className="bento-grid grid-cols-1 md:grid-cols-3 gap-2x">
          {whyVoix.cards.map((item) => {
            const Icon = iconMap[item.iconName] || Zap;
            return (
              <div key={item.title} className="glass-card p-6x flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-xl flex items-center justify-center mb-4x" style={{ background: "hsla(187,100%,63%,0.1)" }}>
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-base font-bold text-foreground">{item.title}</h3>
                <p className="mt-1x text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default WhyVoix;