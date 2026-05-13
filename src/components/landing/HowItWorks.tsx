import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { howItWorks } from "@/data/landingData";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const HowItWorks = () => {
  const { howItWorks: hiwData } = useLandingData();
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const stepCount = hiwData.steps.length;

  return (
    <section
      id="how-it-works"
      ref={ref}
      className="bg-white"
      style={{ height: `${100 + stepCount * 60}vh` }}
    >
      <div className="sticky top-0 h-screen flex items-center">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="text-3xl md:text-4xl font-bold text-primary text-center"
          >
            {t(hiwData.sectionTitle, lang)}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto"
          >
            {t(hiwData.sectionSubtitle, lang)}
          </motion.p>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {hiwData.steps.map((step, idx) => {
              const Icon = howItWorks[idx]?.icon;
              const start = idx / stepCount;
              const end = (idx + 1) / stepCount;
              const opacity = useTransform(scrollYProgress, [start, start + 0.05, end - 0.05, end], [0.25, 1, 1, 0.45]);
              const scale = useTransform(scrollYProgress, [start, start + 0.1], [0.92, 1]);
              return (
                <motion.div
                  key={idx}
                  style={{ opacity, scale }}
                  className="flex flex-col items-center text-center"
                >
                  <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4 ring-4 ring-amber-200/60">
                    <span className="text-2xl font-bold text-secondary-foreground">{idx + 1}</span>
                  </div>
                  {Icon && <Icon className="h-8 w-8 text-primary mb-3" />}
                  <h3 className="text-xl font-semibold text-primary">{t(step.title, lang)}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{t(step.description, lang)}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
