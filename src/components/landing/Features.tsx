import { Mic } from "lucide-react";
import { useProductFeatures } from "@/hooks/useProductFeatures";
import { Skeleton } from "@/components/ui/skeleton";

const Features = () => {
  const { data: features = [], isLoading } = useProductFeatures();

  return (
    <section id="features" className="py-16x md:py-20x">
      <div className="max-w-[1200px] mx-auto px-4x">
        <h2 className="text-3xl md:text-4xl font-extrabold text-foreground text-center mb-10x">
          Product Features
        </h2>

        {isLoading ? (
          <div className="flex flex-col gap-4x">
            {[0, 1].map((i) => (
              <div key={i} className="glass-card p-6x grid grid-cols-1 md:grid-cols-2 gap-4x items-center">
                <Skeleton className="w-full aspect-video rounded-xl bg-muted" />
                <div className="space-y-2x">
                  <Skeleton className="h-6 w-3/4 bg-muted" />
                  <Skeleton className="h-4 w-full bg-muted" />
                  <Skeleton className="h-4 w-5/6 bg-muted" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col gap-2x">
            {features.map((feature, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={feature.id}
                  className="glass-card p-6x md:p-8x grid grid-cols-1 md:grid-cols-2 gap-4x md:gap-6x items-center"
                >
                  {/* Image */}
                  <div className={`${isEven ? "md:order-1" : "md:order-2"} w-full`}>
                    {feature.image_url ? (
                      <img
                        src={feature.image_url}
                        alt={feature.title}
                        className="w-full aspect-video max-h-[400px] object-cover rounded-xl"
                      />
                    ) : (
                      <div className="w-full aspect-video max-h-[400px] rounded-xl bg-muted flex items-center justify-center">
                        <div className="flex flex-col items-center gap-2x text-muted-foreground">
                          <Mic className="h-8 w-8 text-primary" />
                          <span className="text-xs font-medium">Feature Image</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Text */}
                  <div className={`flex flex-col justify-center ${isEven ? "md:order-2" : "md:order-1"}`}>
                    <h3 className="text-xl md:text-2xl font-bold text-foreground">{feature.title}</h3>
                    <p className="mt-2x text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
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