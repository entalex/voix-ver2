import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";
import { Linkedin, Twitter, Mail } from "lucide-react";

const footerLinks = [
  { label: { en: "Product", ka: "პროდუქტი" }, href: "#features" },
  { label: { en: "Team", ka: "გუნდი" }, href: "#team" },
  { label: { en: "Use Cases", ka: "გამოყენება" }, href: "#use-cases" },
];

const Footer = () => {
  const { footer } = useLandingData();
  const { lang } = useLanguage();

  const socialLinks = [
    { icon: Linkedin, label: "LinkedIn", href: "#" },
    { icon: Twitter, label: "Twitter", href: "#" },
    { icon: Mail, label: "Email", href: "#" },
  ];

  return (
    <footer className="py-10 bg-primary">
      <div className="container mx-auto px-4 flex flex-col items-center gap-6">
        <div className="flex flex-col items-center">
          <span className="text-xl font-bold text-primary-foreground tracking-tight">VOIX</span>
          <span className="text-xs text-primary-foreground/60 mt-1">
            {lang === "ka" ? "ხმოვანი ინტელექტის პლატფორმა" : "Voice Intelligence Platform"}
          </span>
        </div>

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

        <div className="flex items-center gap-3">
          {socialLinks.map(({ icon: Icon, label, href }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              className="w-9 h-9 rounded-full border border-primary-foreground/20 flex items-center justify-center text-primary-foreground/60 hover:text-primary-foreground hover:border-primary-foreground/60 transition-colors"
            >
              <Icon className="h-4 w-4" />
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
