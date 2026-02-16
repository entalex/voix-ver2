import { Mic } from "lucide-react";
import { useLandingData } from "@/context/LandingDataContext";

const Features = () => {
  const { features } = useLandingData();

  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Product Features
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto mb-16">
          A closer look at the tools that power objective voice intelligence.
        </p>

        <div className="flex flex-col gap-20">
          {features.map((feature, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
              >
                {/* Image container — strict 50% width, max-height 400px */}
                <div className="w-full md:w-1/2 md:flex-shrink-0">
                  {feature.imageUrl ? (
                    <img
                      src={feature.imageUrl}
                      alt={feature.imageLabel}
                      className="w-full max-h-[400px] object-cover rounded-2xl"
                    />
                  ) : (
                    <div className="w-full max-h-[400px] aspect-[4/3] rounded-2xl bg-muted border-2 border-dashed border-primary/15 flex items-center justify-center">
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <Mic className="h-8 w-8 text-secondary" />
                        <span className="text-xs font-medium">{feature.imageLabel}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Text container — strict 50% width, vertically centered */}
                <div className="w-full md:w-1/2 md:flex-shrink-0 flex flex-col justify-center">
                  <h3 className="text-2xl font-bold text-primary">{feature.title}</h3>
                  <p className="mt-3 text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;
