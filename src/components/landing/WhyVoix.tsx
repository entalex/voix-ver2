import { whyVoix } from "@/data/landingData";
import { Card, CardContent } from "@/components/ui/card";

const WhyVoix = () => {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center">
          Why VOIX?
        </h2>
        <p className="mt-4 text-muted-foreground text-center max-w-2xl mx-auto mb-12">
          Built for teams that demand objectivity, speed, and security.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {whyVoix.map((item) => (
            <Card key={item.title} className="bg-background border-0 shadow-md">
              <CardContent className="pt-8 pb-8 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-5">
                  <item.icon className="h-6 w-6 text-secondary" />
                </div>
                <h3 className="text-lg font-semibold text-primary">{item.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyVoix;
