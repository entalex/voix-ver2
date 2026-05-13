import { motion, useReducedMotion, type Variants } from "framer-motion";
import type { ReactNode } from "react";

type Direction = "up" | "down" | "left" | "right" | "none";

interface RevealProps {
  children: ReactNode;
  direction?: Direction;
  delay?: number;
  distance?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

const offset = (d: Direction, dist: number) => {
  switch (d) {
    case "up": return { y: dist };
    case "down": return { y: -dist };
    case "left": return { x: dist };
    case "right": return { x: -dist };
    default: return {};
  }
};

const Reveal = ({
  children,
  direction = "up",
  delay = 0,
  distance = 24,
  duration = 0.7,
  className,
  once = true,
  amount = 0.2,
}: RevealProps) => {
  const reduce = useReducedMotion();
  const variants: Variants = reduce
    ? { hidden: { opacity: 1 }, show: { opacity: 1 } }
    : {
        hidden: { opacity: 0, ...offset(direction, distance) },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          transition: { duration, delay, ease: [0.22, 1, 0.36, 1] },
        },
      };

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount }}
      variants={variants}
    >
      {children}
    </motion.div>
  );
};

export default Reveal;