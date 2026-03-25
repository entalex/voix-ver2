import { useLandingData } from "@/context/LandingDataContext";

const footerLinks = [
  { label: "Product", href: "#features" },
  { label: "Team", href: "#team" },
  { label: "Use Cases", href: "#use-cases" },
];

const Footer = () => {
  const { footer } = useLandingData();

  return (
    <footer className="py-10x border-t border-border">
      <div className="max-w-[1200px] mx-auto px-4x flex flex-col md:flex-row items-center justify-between gap-6x">
        <span className="text-xl font-extrabold text-primary tracking-tight cyan-glow-text">VOIX</span>
        <div className="flex flex-wrap justify-center gap-6x">
          {footerLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
        </div>
        <span className="text-sm text-muted-foreground">
          {footer.copyrightText || "© 2026 VOIX. All rights reserved."}
        </span>
      </div>
    </footer>
  );
};

export default Footer;