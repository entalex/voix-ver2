import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLandingData } from "@/context/LandingDataContext";

const Team = () => {
  const { teamMembers, teamSection } = useLandingData();

  return (
    <section id="team" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          {teamSection.heading}
        </h2>

        {/* Wide Banner Image */}
        <div className="max-w-5xl mx-auto">
          <div className="w-full aspect-[3/1] rounded-t-xl bg-muted flex items-center justify-center border border-border border-b-0 overflow-hidden">
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
          <div className="w-full rounded-b-xl px-6 py-5" style={{ backgroundColor: "#F8F9FA" }}>
            <p className="text-center text-muted-foreground text-base md:text-lg leading-relaxed">
              {teamSection.barText}
            </p>
          </div>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto mt-12">
          {teamMembers.map((member, index) => (
            <div key={index} className="flex flex-col items-center">
              <Avatar className="h-28 w-28 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              <p className="text-base font-semibold text-primary">{member.name}</p>
              <p className="text-sm text-muted-foreground mt-0.5">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
