import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { howItWorks } from "@/data/landingData";
import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useRef } from "react";
import type { LucideIcon } from "lucide-react";

const Step = ({
  idx,
  total,
  progress,
  Icon,
  title,
  description,
}: {
  idx: number;
  total: number;
  progress: MotionValue<number>;
  Icon?: LucideIcon;
  title: string;
  description: string;
}) => {
  // Spread reveals across the first ~70% of scroll so the final step
  // becomes fully active well before the section ends.
  const span = 0.7 / total;
  const start = idx * span;
  const end = start + span;
  const opacity = useTransform(
    progress,
    [Math.max(0, start - 0.02), start + span * 0.4, 1],
    [0.35, 1, 1]
  );
  const scale = useTransform(progress, [Math.max(0, start - 0.02), end], [0.95, 1]);
  return (
    <motion.div style={{ opacity, scale }} className="flex flex-col items-center text-center">
      <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4 ring-4 ring-amber-200/60">
        <span className="text-2xl font-bold text-secondary-foreground">{idx + 1}</span>
      </div>
      {Icon && <Icon className="h-8 w-8 text-primary mb-3" />}
      <h3 className="text-xl font-semibold text-primary">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </motion.div>
  );
};

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
      style={{ height: `${100 + stepCount * 20}vh` }}
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
            {hiwData.steps.map((step, idx) => (
              <Step
                key={idx}
                idx={idx}
                total={stepCount}
                progress={scrollYProgress}
                Icon={howItWorks[idx]?.icon}
                title={t(step.title, lang)}
                description={t(step.description, lang)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
