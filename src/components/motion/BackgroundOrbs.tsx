import { motion, useScroll, useTransform } from "framer-motion";

const BackgroundOrbs = () => {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, 300]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -120]);

  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      <motion.div
        style={{ y: y1 }}
        className="absolute top-[10%] -left-32 w-[420px] h-[420px] rounded-full bg-amber-300/15 blur-[120px]"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-[40%] -right-40 w-[520px] h-[520px] rounded-full bg-primary/10 blur-[140px]"
      />
      <motion.div
        style={{ y: y3 }}
        className="absolute top-[75%] left-1/3 w-[360px] h-[360px] rounded-full bg-amber-400/10 blur-[120px]"
      />
    </div>
  );
};

export default BackgroundOrbs;