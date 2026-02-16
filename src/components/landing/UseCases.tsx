import { useCases } from "@/data/landingData";
import { Card } from "@/components/ui/card";

const UseCases = () => {
  return (
    <section id="use-cases" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Use Cases
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          VOIX adapts to any industry where voice interactions matter.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {useCases.map((uc) => (
            <Card key={uc.title} className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-shadow">
              {/* Banner image placeholder */}
              <div className="aspect-[16/9] bg-muted flex items-center justify-center">
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <uc.icon className="h-8 w-8 text-secondary" />
                  <span className="text-xs font-medium">{uc.imageLabel}</span>
                </div>
              </div>
              {/* Text content */}
              <div className="p-5">
                <h3 className="text-lg font-semibold text-primary">{uc.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">{uc.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
