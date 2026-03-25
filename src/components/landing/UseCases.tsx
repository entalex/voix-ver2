import { useLandingData } from "@/context/LandingDataContext";

const UseCases = () => {
  const { useCases } = useLandingData();

  return (
    <section id="use-cases" className="py-16 md:py-24 bg-muted/40">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Use Cases
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {useCases.map((uc) => (
            <div
              key={uc.title}
              className="rounded-xl bg-background p-8 md:p-10 transition-shadow border border-border shadow-sm"
            >
              <h3 className="text-lg font-semibold mb-3 text-primary">
                {uc.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
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
