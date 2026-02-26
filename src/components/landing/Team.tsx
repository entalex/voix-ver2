import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLandingData } from "@/context/LandingDataContext";

const Team = () => {
  const { teamMembers, teamSection } = useLandingData();

  return (
    <section id="team" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          {teamSection.heading}
        </h2>

        <div className="rounded-xl overflow-hidden">
          <div className="w-full aspect-[21/9] bg-muted flex items-center justify-center overflow-hidden">
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

          {/* Text Bar — same width as banner */}
          <div className="w-full px-6 py-5" style={{ backgroundColor: "#F8F9FA" }}>
            <p className="text-center text-muted-foreground text-base md:text-lg leading-relaxed">
              {teamSection.barText || "Our mission is to empower teams with voice intelligence."}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Team;
