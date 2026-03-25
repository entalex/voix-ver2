import { Button } from "@/components/ui/button";
import { useLandingData } from "@/context/LandingDataContext";
import AudioReactiveAura from "./AudioReactiveAura";

const Hero = () => {
  const { hero } = useLandingData();

  return (
    <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 overflow-hidden">
      <div className="max-w-[1200px] mx-auto px-4x">
        {/* Bento Hero Grid */}
        <div className="bento-grid grid-cols-1 md:grid-cols-3 gap-2x">
          {/* Main Hero Card — spans 2 cols */}
          <div className="glass-card cyan-glow md:col-span-2 md:row-span-2 p-8x md:p-12x relative overflow-hidden flex flex-col justify-center items-center text-center min-h-[420px]">
            {/* Aura behind text */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
              <AudioReactiveAura />
            </div>

            <div className="relative z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-gradient-cyan">
                VOIX
              </h1>
              <p className="mt-4x text-lg md:text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                {hero.subheadline}
              </p>
              <Button
                className="mt-6x rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8x py-3x text-base font-semibold"
                onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
              >
                {hero.buttonText}
              </Button>
            </div>
          </div>

          {/* Side tile 1: Live Transcription */}
          <div className="glass-card p-6x flex flex-col justify-end min-h-[200px]">
            <div className="flex items-center gap-2x mb-2x">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
              <span className="text-xs text-primary font-semibold uppercase tracking-widest">Live</span>
            </div>
            <h3 className="text-base font-bold text-foreground">Intelligent Capture</h3>
            <p className="mt-1x text-sm text-muted-foreground leading-relaxed">
              Streaming words appear in real-time via typewriter-effect orchestration.
            </p>
          </div>

          {/* Side tile 2: Predictive Insights */}
          <div className="glass-card p-6x flex flex-col justify-end min-h-[200px]">
            {/* Mini bar chart visualization */}
            <div className="flex items-end gap-1 mb-3x h-10x">
              {[40, 65, 35, 80, 55, 90, 45, 70].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-sm bg-primary/30"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
            <h3 className="text-base font-bold text-foreground">Predictive Insights</h3>
            <p className="mt-1x text-sm text-muted-foreground leading-relaxed">
              Anticipating business outcomes before the call ends.
            </p>
          </div>
        </div>

        {/* CTA Banner Row */}
        <div className="glass-card mt-2x p-6x md:p-8x flex flex-col md:flex-row items-center justify-between gap-4x">
          <div>
            <h3 className="text-lg font-bold text-foreground">Ready to audit?</h3>
            <p className="text-sm text-muted-foreground mt-1x">
              Experience the unbiased truth in your voice data.
            </p>
          </div>
          <Button
            className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6x py-2x text-sm font-bold uppercase tracking-wider whitespace-nowrap"
            onClick={() => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })}
          >
            Get Started
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Hero;