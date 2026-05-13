import { useLanguage } from "@/context/LanguageContext";
import Reveal from "@/components/motion/Reveal";
import { StaggerGroup, StaggerItem } from "@/components/motion/StaggerGroup";
import { motion } from "framer-motion";
import SectionBackground from "@/components/motion/SectionBackground";

const Team = () => {
  const { lang } = useLanguage();

  const heading = lang === "ka" ? "გუნდი Voix-ის უკან" : "The Team Behind Voix";
  const description =
    lang === "ka"
      ? "მცირე ფოკუსირებული გუნდი, რომელიც აშენებს ხმოვანი ინტელექტის მომავალს საქართველოში."
      : "A small focused team building the future of voice intelligence in Georgia.";

  const badges =
    lang === "ka"
      ? ["🇬🇪 თბილისში", "AI-First", "Enterprise Ready"]
      : ["🇬🇪 Based in Tbilisi", "AI-First", "Enterprise Ready"];

  return (
    <section id="team" className="relative overflow-hidden py-16 md:py-24 bg-[hsl(40_50%_98%)]">
      <SectionBackground variant="soft-blobs" />
      <div className="max-w-3xl mx-auto px-4 text-center relative">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold text-primary">{heading}</h2>
        </Reveal>
        <Reveal delay={0.1}>
          <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
            {description}
          </p>
        </Reveal>

        <StaggerGroup className="mt-8 flex flex-wrap items-center justify-center gap-3" stagger={0.1} delay={0.2}>
          {badges.map((badge) => (
            <StaggerItem key={badge}>
              <motion.span
                whileHover={{ scale: 1.06 }}
                className="inline-block rounded-full bg-amber-100 text-amber-800 px-5 py-2 text-sm font-medium"
              >
                {badge}
              </motion.span>
            </StaggerItem>
          ))}
        </StaggerGroup>
      </div>
    </section>
  );
};

export default Team;
