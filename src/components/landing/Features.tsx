import { Mic } from "lucide-react";
import { useProductFeatures } from "@/hooks/useProductFeatures";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/context/LanguageContext";

const Features = () => {
  const { data: features = [], isLoading } = useProductFeatures();
  const { lang } = useLanguage();

  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="max-w-[1200px] mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          {lang === "ka" ? "პროდუქტის ფუნქციები" : "Product Features"}
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-12 md:gap-16">
            {[0, 1].map((i) => (
              <div key={i} className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center">
                <Skeleton className="w-full aspect-video max-h-[400px] rounded-xl" />
                <div className="flex flex-col justify-center space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-12 md:gap-16">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={feature.id}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 items-center"
                >
                  {/* Image */}
                  <div className={`${isEven ? "md:order-1" : "md:order-2"} w-full`}>
                    {feature.image_url ? (
                      <img
                        src={feature.image_url}
                        alt={feature.title}
                        className="w-full aspect-video max-h-[400px] object-cover rounded-xl bg-muted"
                      />
                    ) : (
                      <div className="w-full aspect-video max-h-[400px] rounded-xl bg-muted flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Mic className="h-8 w-8 text-secondary" />
                          <span className="text-xs font-medium">Feature Image</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className={`flex flex-col justify-center ${isEven ? "md:order-2" : "md:order-1"}`}>
                    <h3 className="text-xl md:text-2xl font-bold text-primary">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};

export default Features;
