import { Button } from "@/components/ui/button";

const CTABanner = () => {
  return (
    <section className="py-16 md:py-24 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground">
          Ready to Transform Your Operations?
        </h2>
        <p className="mt-4 text-primary-foreground/80 max-w-xl mx-auto">
          Join leading organizations using VOIX to unlock objective, data-driven insights from every interaction.
        </p>
        <Button className="mt-8 rounded-full bg-secondary text-secondary-foreground hover:bg-secondary/90 px-8 py-6 text-lg">
          Request Demo
        </Button>
      </div>
    </section>
  );
};

export default CTABanner;
