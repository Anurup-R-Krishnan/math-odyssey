import { motion } from "framer-motion";
import { useFocusMode } from "@/hooks/useFocusMode";

interface ObjectVisualizerProps {
  count: number;
  color?: string;
  fadeOut?: boolean;
  groupSize?: number;
  label?: string;
}

const DOT_COLORS: Record<string, string> = {
  red: "bg-red-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  yellow: "bg-yellow-400",
  purple: "bg-purple-400",
  default: "bg-primary",
};

export function ObjectVisualizer({
  count,
  color = "default",
  fadeOut = false,
  groupSize = 5,
  label,
}: ObjectVisualizerProps) {
  const { shouldAnimate } = useFocusMode();
  const dots = Array.from({ length: count }, (_, i) => i);
  const colorClass = DOT_COLORS[color] ?? DOT_COLORS.default;

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <span className="text-xs font-medium text-muted-foreground">{label}</span>
      )}
      <div className="flex flex-wrap gap-1.5 justify-center max-w-[200px]">
        {dots.map((i) => {
          const isGroupBoundary = groupSize > 0 && i > 0 && i % groupSize === 0;
          return (
            <motion.div
              key={i}
              initial={shouldAnimate ? { scale: 0, opacity: 0 } : false}
              animate={
                fadeOut
                  ? { scale: 0, opacity: 0 }
                  : { scale: 1, opacity: 1 }
              }
              transition={{
                delay: shouldAnimate ? i * 0.04 : 0,
                duration: shouldAnimate ? 0.25 : 0.05,
              }}
              className={`w-4 h-4 rounded-full ${colorClass} ${isGroupBoundary ? "ml-2" : ""
                }`}
              aria-hidden="true"
            />
          );
        })}
      </div>
    </div>
  );
}

interface PatternVisualizerProps {
  sequence: string[];
}

export function PatternVisualizer({ sequence }: PatternVisualizerProps) {
  const { shouldAnimate } = useFocusMode();

  return (
    <div className="flex items-center gap-4 justify-center flex-wrap">
      {sequence.map((color, i) => {
        if (color === "?") {
          return (
            <motion.div
              key={i}
              initial={shouldAnimate ? { scale: 0 } : false}
              animate={{ scale: 1 }}
              transition={{ delay: shouldAnimate ? i * 0.08 : 0 }}
              className="flex flex-col items-center gap-1"
            >
              <div className="w-12 h-12 rounded-xl border-2 border-dashed border-muted-foreground flex items-center justify-center text-muted-foreground font-bold bg-muted/20">
                ?
              </div>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Next</span>
            </motion.div>
          );
        }
        const colorClass = DOT_COLORS[color] ?? DOT_COLORS.default;

        // Add specific border styles for better distinction (shape-like effect)
        let borderClass = "";
        if (color === "red") borderClass = "rounded-xl"; // Square-ish
        else if (color === "blue") borderClass = "rounded-full"; // Circle
        else if (color === "green") borderClass = "rounded-tr-3xl rounded-bl-3xl rounded-tl-lg rounded-br-lg"; // Leaf-like
        else if (color === "yellow") borderClass = "rounded-lg rotate-45 scale-90"; // Diamond-ish
        else borderClass = "rounded-xl";

        return (
          <motion.div
            key={i}
            initial={shouldAnimate ? { scale: 0 } : false}
            animate={{ scale: 1 }}
            transition={{ delay: shouldAnimate ? i * 0.08 : 0 }}
            className="flex flex-col items-center gap-1"
          >
            <div
              className={`w-12 h-12 shadow-sm border-2 border-white/20 ${colorClass} ${borderClass}`}
              aria-label={`${color} block`}
            />
            {/* Color label for accessibility/color-blindness */}
            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
              {color}
            </span>
          </motion.div>
        );
      })}
    </div>
  );
}
