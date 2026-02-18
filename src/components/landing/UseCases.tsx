import { useCases } from "@/data/landingData";

const UseCases = () => {
  return (
    <section id="use-cases" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Use Cases
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-xl bg-card p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-lg font-bold text-primary mb-2">{uc.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {uc.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;
