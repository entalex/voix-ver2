const footerLinks = [
  { label: "Product", href: "#features" },
  { label: "Team", href: "#team" },
  { label: "Use Cases", href: "#use-cases" },
];

const Footer = () => {
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
              {link.label}
            </a>
          ))}
        </div>
        <span className="text-sm text-primary-foreground/50">© 2026 VOIX. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
