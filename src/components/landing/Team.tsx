import { teamMembers } from "@/data/landingData";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Team = () => {
  return (
    <section id="team" className="py-16 md:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Meet the Team
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          The people building the future of voice intelligence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-5xl mx-auto">
          {teamMembers.map((member) => (
            <div key={member.name} className="flex flex-col items-center">
              <Avatar className="h-28 w-28 mb-4">
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl font-semibold">
                  {member.initials}
                </AvatarFallback>
              </Avatar>
              {/* Editable-style text box */}
              <div className="w-full rounded-lg border border-border bg-background p-4 text-center shadow-sm">
                <p className="text-base font-semibold text-primary">{member.name}</p>
                <p className="text-sm text-muted-foreground mt-0.5">{member.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
