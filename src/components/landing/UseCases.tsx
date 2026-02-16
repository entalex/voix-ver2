import { useCases } from "@/data/landingData";
import { Card, CardContent } from "@/components/ui/card";

const UseCases = () => {
  return (
    <section id="use-cases" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Use Cases
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto">
          VOIX adapts to any industry where voice interactions matter.
        </p>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {useCases.map((uc) => (
            <Card key={uc.title} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <uc.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">{uc.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{uc.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
