import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { Store, HeartPulse, GraduationCap, Building2 } from "lucide-react";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import Reveal from "@/components/motion/Reveal";
import { motion } from "framer-motion";
import SectionBackground from "@/components/motion/SectionBackground";

const icons = [Store, HeartPulse, GraduationCap, Building2];

const UseCases = () => {
  const { useCases } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section id="use-cases" className="relative overflow-hidden py-16 md:py-24 bg-[hsl(220_30%_98%)]">
      <SectionBackground variant="dotted-field" />
      <div className="max-w-[1200px] mx-auto px-4 relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
            {lang === "ka" ? "გამოყენების სფეროები" : "Use Cases"}
          </h2>
        </Reveal>

        <StaggerGroup className="grid grid-cols-1 md:grid-cols-2 gap-6" stagger={0.1}>
          {useCases.map((uc, idx) => {
            const Icon = icons[idx % icons.length];
            return (
              <StaggerItem key={idx}>
                <motion.div
                  whileHover={{ y: -6 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className="rounded-xl bg-white p-8 md:p-10 border border-border shadow-sm hover:shadow-lg transition-shadow"
                >
                  <motion.div whileHover={{ rotate: -8, scale: 1.1 }} className="mb-4 inline-block">
                    <Icon className="h-8 w-8 text-amber-500" />
                  </motion.div>
                  <h3 className="text-lg font-semibold mb-3 text-primary">
                    {t(uc.title, lang)}
                  </h3>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(uc.description, lang)}
                  </p>
                </motion.div>
              </StaggerItem>
            );
          })}
        </StaggerGroup>
      </div>
    </section>
  );
};

export default UseCases;
