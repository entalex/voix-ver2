import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const navLinks = [
  { label: "Product", href: "#features" },
  { label: "Team", href: "#team" },
  { label: "Use Cases", href: "#use-cases" },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b border-border" style={{ background: "hsla(0,0%,0.4%,0.85)" }}>
      <div className="max-w-[1200px] mx-auto flex items-center justify-between h-16 px-4x">
        <a href="#" className="text-xl font-extrabold text-primary tracking-tight cyan-glow-text">
          VOIX
        </a>

        {/* Desktop */}
        <div className="hidden md:flex items-center gap-8x">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors duration-200"
            >
              {link.label}
            </a>
          ))}
          <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6x text-sm font-semibold">
            Request Demo
          </Button>
        </div>

        {/* Mobile */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="text-foreground">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 bg-card border-border">
            <div className="flex flex-col gap-6x mt-8x">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg font-medium text-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90">
                Request Demo
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;