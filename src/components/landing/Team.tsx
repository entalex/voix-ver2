import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLandingData } from "@/context/LandingDataContext";
import { useLanguage, t } from "@/context/LanguageContext";

const Team = () => {
  const { teamMembers, teamSection } = useLandingData();
  const { lang } = useLanguage();

  return (
    <section id="team" className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          {t(teamSection.heading, lang)}
        </h2>

        {/* Banner image */}
        <div className="rounded-xl overflow-hidden">
          <div className="w-full aspect-[21/9] bg-muted flex items-center justify-center">
            {teamSection.bannerImageUrl ? (
              <img
                src={teamSection.bannerImageUrl}
                alt="Team Banner"
                className="w-full h-full object-cover rounded-xl"
              />
            ) : (
              <span className="text-muted-foreground text-lg">{teamSection.bannerLabel}</span>
            )}
          </div>
        </div>

        {/* Text Bar */}
        <div className="mt-1 rounded-xl w-full px-6 py-5" style={{ backgroundColor: "#F8F9FA" }}>
          <p className="text-center text-muted-foreground text-base md:text-lg leading-relaxed">
            {t(teamSection.barText, lang) || (lang === "ka" ? "ჩვენი მისია არის გუნდების გაძლიერება ხმოვანი ინტელექტით." : "Our mission is to empower teams with voice intelligence.")}
          </p>
        </div>
      </div>
    </section>
  );
};

export default Team;
