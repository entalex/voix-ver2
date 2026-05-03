import { useLanguage } from "@/context/LanguageContext";

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
    <section id="team" className="py-16 md:py-24 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary">{heading}</h2>
        <p className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed">
          {description}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          {badges.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-amber-100 text-amber-800 px-5 py-2 text-sm font-medium"
            >
              {badge}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
