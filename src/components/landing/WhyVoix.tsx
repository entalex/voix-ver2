import { useLandingData } from "@/context/LandingDataContext";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Lock, TrendingUp, Shield, Eye, Mic, BarChart3, Search, FileText, Upload, Store, HeartPulse, GraduationCap, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  Zap, Lock, TrendingUp, Shield, Eye, Mic, BarChart3, Search, FileText, Upload, Store, HeartPulse, GraduationCap, Building2,
};

const WhyVoix = () => {
  const { whyVoix } = useLandingData();

  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          {whyVoix.sectionTitle}
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          {whyVoix.sectionSubtitle}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyVoix.cards.map((item) => {
            const Icon = iconMap[item.iconName] || Zap;
            return (
              <Card key={item.title} className="bg-background border-0 shadow-md">
                <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                  <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-5">
                    <Icon className="h-6 w-6 text-secondary" />
                  </div>
                  <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
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
