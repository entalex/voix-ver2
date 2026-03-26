import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";

const footerLinks = [
  { label: { en: "Product", ka: "პროდუქტი" }, href: "#features" },
  { label: { en: "Team", ka: "გუნდი" }, href: "#team" },
  { label: { en: "Use Cases", ka: "გამოყენება" }, href: "#use-cases" },
];

const Footer = () => {
  const { footer } = useLandingData();
  const { lang } = useLanguage();

  return (
    <footer className="py-10 bg-primary">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        <span className="text-xl font-bold text-primary-foreground tracking-tight">VOIX</span>
        <div className="flex flex-wrap justify-center gap-6">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors"
            >
              {t(link.label, lang)}
            </a>
          ))}
        </div>
        <span className="text-sm text-primary-foreground/50">
          {t(footer.copyrightText, lang) || "© 2026 VOIX. All rights reserved."}
        </span>
      </div>
    </footer>
  );
};

export default Footer;
