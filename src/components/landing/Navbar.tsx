import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Globe, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const scrollToSection = (id: string) => {
  if (id === "top") {
    window.scrollTo({ top: 0, behavior: "smooth" });
  } else {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }
};

const navLinks = {
  en: [
    { label: "Product", href: "#features" },
    { label: "Team", href: "#team" },
    { label: "Use Cases", href: "#use-cases" },
  ],
  ka: [
    { label: "პროდუქტი", href: "#features" },
    { label: "გუნდი", href: "#team" },
    { label: "გამოყენება", href: "#use-cases" },
  ],
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { lang, toggleLang } = useLanguage();

  const links = navLinks[lang];

  const handleNavClick = (href: string) => {
    setOpen(false);
    setTimeout(() => scrollToSection(href.replace("#", "")), 150);
  };

  const handleHomeClick = () => {
    setOpen(false);
    setTimeout(() => scrollToSection("top"), 150);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#" className="text-2xl font-bold text-primary tracking-tight">
          VOIX
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={toggleLang}
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <Globe className="h-4 w-4" />
            {lang === "en" ? "Eng" : "ქარ"}
          </button>
          <Button className="rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-6">
            {lang === "ka" ? "დემოს მოთხოვნა" : "Request Demo"}
          </Button>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full max-w-[320px] p-0 border-l border-white/10 [&>button]:hidden"
            style={{ backgroundColor: "hsl(216, 25%, 34%)" }}
          >
            <div className="flex flex-col h-full">
              {/* Header */}
              <div
                onClick={handleHomeClick}
                className="flex items-center justify-between px-5 py-4 border-b border-white/15 cursor-pointer"
              >
                <span className="text-xl font-bold text-white tracking-tight">VOIX</span>
                <div className="flex items-center gap-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleLang(); }}
                    className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors"
                  >
                    <Globe className="h-4 w-4" />
                    <span className="text-sm font-medium">{lang === "en" ? "Eng" : "ქარ"}</span>
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); setOpen(false); }}
                    className="text-white/70 hover:text-white transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Nav Links */}
              <div className="flex flex-col pt-4">
                {links.map((link) => (
                  <button
                    key={link.href}
                    onClick={() => handleNavClick(link.href)}
                    className="block w-full px-6 py-5 text-lg font-medium text-white/90 hover:text-white hover:bg-white/10 active:bg-white/15 border-b border-white/10 transition-colors text-right"
                  >
                    {link.label}
                  </button>
                ))}
              </div>

              {/* Empty space → Home */}
              <div className="flex-1 cursor-pointer" onClick={handleHomeClick} />

              {/* Footer: CTA + Socials */}
              <div className="px-6 pb-8 space-y-6">
                <Button
                  className="w-full rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 h-12 text-base font-semibold"
                  onClick={() => setOpen(false)}
                >
                  {lang === "ka" ? "დემოს მოთხოვნა" : "Request Demo"}
                </Button>
                <div className="flex items-center gap-4">
                  {[0, 1, 2].map((i) => (
                    <a
                      key={i}
                      href="#"
                      onClick={(e) => e.stopPropagation()}
                      className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center text-white/60 hover:text-white hover:border-white/60 transition-colors"
                    >
                      {i === 0 && (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
                        </svg>
                      )}
                      {i === 1 && (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <rect x="2" y="2" width="20" height="20" rx="5" />
                          <circle cx="12" cy="12" r="5" />
                          <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
                        </svg>
                      )}
                      {i === 2 && (
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19.1c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.43z" />
                          <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" fill="currentColor" stroke="none" />
                        </svg>
                      )}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
