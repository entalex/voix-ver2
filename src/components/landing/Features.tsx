import { Mic } from "lucide-react";
import { useProductFeatures } from "@/hooks/useProductFeatures";
import { Skeleton } from "@/components/ui/skeleton";

const Features = () => {
  const { data: features = [], isLoading } = useProductFeatures();

  return (
    <section id="features" className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-4 max-w-4xl">
        <h2 className="text-3xl md:text-4xl font-bold text-primary text-center mb-12">
          Product Features
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-16">
            {[0, 1].map((i) => (
              <div key={i} className="flex flex-col md:flex-row items-center gap-8">
                <Skeleton className="w-full md:w-1/2 aspect-[4/3] rounded-xl" />
                <div className="w-full md:w-1/2 space-y-3">
                  <Skeleton className="h-7 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-16">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={feature.id}
                  className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8`}
                >
                  {/* Image */}
                  <div className="w-full md:w-1/2 flex-shrink-0">
                    {feature.image_url ? (
                      <img
                        src={feature.image_url}
                        alt={feature.title}
                        className="w-full aspect-[4/3] object-cover rounded-xl bg-muted"
                      />
                    ) : (
                      <div className="w-full aspect-[4/3] rounded-xl bg-muted flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Mic className="h-8 w-8 text-secondary" />
                          <span className="text-xs font-medium">Feature Image</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className="w-full md:w-1/2 flex-shrink-0 flex flex-col justify-center">
                    <h3 className="text-xl font-bold text-primary">{feature.title}</h3>
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
