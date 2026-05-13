import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, Lock, TrendingUp, Shield, Eye, Mic, BarChart3, Search, FileText, Upload, Store, HeartPulse, GraduationCap, Building2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import Reveal from "@/components/motion/Reveal";
import { motion } from "framer-motion";

const iconMap: Record<string, LucideIcon> = {
  Zap, Lock, TrendingUp, Shield, Eye, Mic, BarChart3, Search, FileText, Upload, Store, HeartPulse, GraduationCap, Building2,
};

const WhyVoix = () => {
  const { whyVoix } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-4">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
            {t(whyVoix.sectionTitle, lang)}
          </h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto mb-12">
            {t(whyVoix.sectionSubtitle, lang)}
          </p>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-3 gap-6" stagger={0.12}>
          {whyVoix.cards.map((item, idx) => {
            const Icon = iconMap[item.iconName] || Zap;
            return (
              <StaggerItem key={idx}>
                <motion.div whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
                  <Card className="bg-white border-t-4 border-amber-400 rounded-xl shadow-sm hover:shadow-lg transition-shadow h-full">
                    <CardContent className="p-8 flex flex-col items-center text-center">
                      <div className="h-12 w-12 rounded-full bg-amber-50 flex items-center justify-center mb-5">
                        <Icon className="h-6 w-6 text-amber-500" />
                      </div>
                      <h3 className="text-xl font-bold text-primary">{t(item.title, lang)}</h3>
                      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t(item.description, lang)}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
};

export default WhyVoix;
