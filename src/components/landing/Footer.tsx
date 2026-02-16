const Footer = () => {
  return (
    <footer className="py-8 bg-primary/95 border-t border-primary/80">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <span className="text-lg font-bold text-primary-foreground tracking-tight">VOIX</span>
        <div className="flex gap-6">
          <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Privacy</a>
          <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Terms</a>
          <a href="#" className="text-sm text-primary-foreground/70 hover:text-primary-foreground transition-colors">Contact</a>
        </div>
        <span className="text-sm text-primary-foreground/50">© 2026 VOIX. All rights reserved.</span>
      </div>
    </footer>
  );
};

export default Footer;
