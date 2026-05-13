import { Button } from "@/components/ui/button";
import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const CTABanner = () => {
  const { cta } = useLandingData();
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bgX = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);

  const headline = t(cta.headline, lang);
  const words = headline.split(" ");

  return (
    <section ref={ref} className="relative py-16 md:py-24 overflow-hidden">
      <motion.div
        style={{ backgroundPositionX: bgX }}
        className="absolute inset-0 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500"
        aria-hidden
      />
      <div className="container mx-auto px-4 text-center relative">
        <h2 className="text-3xl md:text-4xl font-bold text-white">
          {words.map((w, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="inline-block mr-[0.25em]"
            >
              {w}
            </motion.span>
          ))}
        </h2>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-4 text-white/90 max-w-xl mx-auto"
        >
          {t(cta.description, lang)}
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.45 }}
        >
          <Button className="mt-8 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg">
            {t(cta.buttonText, lang)}
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CTABanner;
