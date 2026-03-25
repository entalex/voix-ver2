import { useLandingData } from "@/context/LandingDataContext";

const Team = () => {
  const { teamSection } = useLandingData();

  return (
    <section id="team" className="py-16x md:py-20x">
      <div className="max-w-[1200px] mx-auto px-4x">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center mb-10x">
          {teamSection.heading}
        </h2>

        {/* Banner image */}
        <div className="glass-card overflow-hidden">
          <div className="w-full aspect-[21/9] bg-muted flex items-center justify-center">
            {teamSection.bannerImageUrl ? (
              <img
                src={teamSection.bannerImageUrl}
                alt="Team Banner"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-muted-foreground text-lg">{teamSection.bannerLabel}</span>
            )}
          </div>
        </div>

        {/* Text Bar */}
        <div className="glass-card mt-2x px-6x py-5x">
          <p className="text-center text-muted-foreground text-base md:text-lg leading-relaxed">
            {teamSection.barText || "Our mission is to empower teams with voice intelligence."}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Team;