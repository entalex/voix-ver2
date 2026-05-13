type Variant = "grid-orb" | "soft-blobs" | "dotted-field" | "aurora";

const SectionBackground = ({ variant }: { variant: Variant }) => {
  const base = "pointer-events-none absolute inset-0 -z-10 overflow-hidden";

  if (variant === "grid-orb") {
    return (
      <div className={base} aria-hidden="true">
        {/* perspective grid */}
        <div
          className="absolute inset-x-0 bottom-0 h-[60%] opacity-[0.18] motion-reduce:animate-none animate-grid-pan hidden md:block"
          style={{
            backgroundImage:
              "linear-gradient(hsl(42 90% 55% / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(42 90% 55% / 0.5) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
            transform: "perspective(700px) rotateX(60deg)",
            transformOrigin: "center bottom",
            maskImage: "linear-gradient(to top, black, transparent)",
          }}
        />
        {/* dotted orb (top-right) */}
        <div className="absolute -top-10 -right-10 h-[420px] w-[420px] rounded-full opacity-60 blur-[2px] motion-reduce:animate-none animate-drift-slow"
          style={{
            backgroundImage:
              "radial-gradient(circle, hsl(216 25% 34% / 0.35) 1.2px, transparent 1.5px)",
            backgroundSize: "10px 10px",
            maskImage: "radial-gradient(circle, black 40%, transparent 70%)",
          }}
        />
        {/* drifting pale circles */}
        <div className="absolute top-1/3 left-[8%] h-72 w-72 rounded-full bg-[hsl(42_80%_88%)] blur-3xl opacity-70 motion-reduce:animate-none animate-drift-slow" />
        <div className="absolute bottom-10 right-1/4 h-64 w-64 rounded-full bg-[hsl(220_40%_92%)] blur-3xl opacity-60 motion-reduce:animate-none animate-blob-morph" />
      </div>
    );
  }

  if (variant === "soft-blobs") {
    return (
      <div className={base} aria-hidden="true">
        <div className="absolute -top-20 -left-20 h-[420px] w-[420px] rounded-full bg-[hsl(42_80%_90%)] blur-3xl opacity-80 motion-reduce:animate-none animate-blob-morph" />
        <div className="absolute top-10 right-[10%] h-[360px] w-[360px] rounded-full bg-[hsl(25_70%_92%)] blur-3xl opacity-70 motion-reduce:animate-none animate-drift-slow" style={{ animationDelay: "-6s" }} />
        <div className="absolute bottom-0 left-1/3 h-[460px] w-[460px] rounded-full bg-[hsl(220_40%_94%)] blur-3xl opacity-70 motion-reduce:animate-none animate-blob-morph" style={{ animationDelay: "-12s" }} />
        <div className="absolute -bottom-20 -right-10 h-[300px] w-[300px] rounded-full bg-[hsl(42_70%_92%)] blur-3xl opacity-60 motion-reduce:animate-none animate-drift-slow" style={{ animationDelay: "-3s" }} />
      </div>
    );
  }

  if (variant === "dotted-field") {
    return (
      <div className={base} aria-hidden="true">
        <div
          className="absolute inset-0 opacity-[0.35] motion-reduce:animate-none animate-grid-pan"
          style={{
            backgroundImage:
              "radial-gradient(hsl(216 25% 34% / 0.22) 1px, transparent 1.4px)",
            backgroundSize: "22px 22px",
            maskImage: "radial-gradient(ellipse at center, black 50%, transparent 85%)",
          }}
        />
        <div className="absolute top-1/4 -left-16 h-80 w-80 rounded-full bg-[hsl(42_80%_90%)] blur-3xl opacity-70 motion-reduce:animate-none animate-drift-slow" />
        <div className="absolute bottom-10 right-[5%] h-72 w-72 rounded-full bg-[hsl(220_40%_94%)] blur-3xl opacity-70 motion-reduce:animate-none animate-blob-morph" />
      </div>
    );
  }

  // aurora
  return (
    <div className={base} aria-hidden="true">
      <div
        className="absolute inset-0 opacity-80 motion-reduce:animate-none animate-aurora-shift"
        style={{
          background:
            "conic-gradient(from 0deg at 50% 50%, hsl(40 60% 97%), hsl(42 80% 92%), hsl(25 70% 94%), hsl(220 40% 95%), hsl(40 60% 97%))",
          filter: "blur(60px)",
        }}
      />
      <div className="absolute top-1/3 left-1/4 h-80 w-80 rounded-full bg-[hsl(42_80%_88%)] blur-3xl opacity-60 motion-reduce:animate-none animate-drift-slow" />
      <div className="absolute bottom-10 right-1/4 h-80 w-80 rounded-full bg-[hsl(25_70%_92%)] blur-3xl opacity-60 motion-reduce:animate-none animate-blob-morph" />
    </div>
  );
};

export default SectionBackground;
