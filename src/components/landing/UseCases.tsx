import { useLandingData } from "@/context/LandingDataContext";

const UseCases = () => {
  const { useCases } = useLandingData();

  return (
    <section id="use-cases" className="py-16x md:py-20x">
      <div className="max-w-[1200px] mx-auto px-4x">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center mb-10x">
          Use Cases
        </h2>

        <div className="bento-grid grid-cols-1 md:grid-cols-2 gap-2x">
          {useCases.map((uc) => (
            <div key={uc.title} className="glass-card p-8x md:p-10x">
              <h3 className="text-lg font-bold mb-2x text-foreground">{uc.title}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{uc.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default UseCases;