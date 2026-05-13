import { Button } from "@/components/ui/button";
import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import ProceduralVoiceWave from "./ProceduralVoiceWave";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const Hero = () => {
  const { hero } = useLandingData();
  const { lang } = useLanguage();
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const waveScale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);
  const waveY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  const headline = t(hero.headline, lang);
  const words = headline.split(" ");

  return (
    <section ref={ref} className="relative pt-24 pb-16 md:pt-32 md:pb-24 bg-muted/30 overflow-hidden">
      <div className="container mx-auto px-4 text-center relative">
        <motion.div style={{ y: textY, opacity: textOpacity }}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary max-w-4xl mx-auto leading-tight">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ duration: 0.7, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block mr-[0.25em]"
              >
                {w}
              </motion.span>
            ))}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 + words.length * 0.05 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto"
          >
            {t(hero.subheadline, lang)}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 + words.length * 0.05 }}
          >
            <Button className="mt-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg">
              {t(hero.buttonText, lang)}
            </Button>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.9 + words.length * 0.05 }}
            className="mt-6 text-xs text-muted-foreground tracking-widest uppercase"
          >
            {lang === "ka" ? "AI-ით აღჭურვილი" : "Powered by AI"}
          </motion.p>
        </motion.div>

        <motion.div
          style={{ scale: waveScale, y: waveY }}
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 mx-auto max-w-5xl aspect-video rounded-2xl overflow-hidden relative bg-muted shadow-xl"
        >
          <ProceduralVoiceWave />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
