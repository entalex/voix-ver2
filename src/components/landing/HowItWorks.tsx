import { howItWorks } from "@/data/landingData";

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          How It Works
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto">
          Get started in three simple steps.
        </p>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {howItWorks.map((step) => (
            <div key={step.step} className="flex flex-col items-center text-center">
              <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center mb-4">
                <span className="text-2xl font-bold text-secondary-foreground">{step.step}</span>
              </div>
              <step.icon className="h-8 w-8 text-primary mb-3" />
              <h3 className="text-xl font-semibold text-primary">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
