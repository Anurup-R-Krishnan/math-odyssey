import { motion, AnimatePresence } from "framer-motion";
import { Lightbulb } from "lucide-react";

interface HintDisplayProps {
  hint: string | null;
  isReveal?: boolean;
}

export function HintDisplay({ hint, isReveal = false }: HintDisplayProps) {
  if (!hint) return null;

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95 },
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={hint}
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.4 }}
        className={`rounded-2xl px-6 py-4 text-lg font-medium text-center border-2 flex items-center justify-center gap-3 shadow-sm ${isReveal
            ? "bg-secondary/20 text-secondary-foreground border-secondary/50"
            : "bg-amber-50 text-amber-900 border-amber-200"
          }`}
        role="status"
        aria-live="polite"
      >
        <Lightbulb className={`w-6 h-6 flex-shrink-0 ${isReveal ? "text-secondary-foreground" : "text-amber-500"}`} />
        <span>{hint}</span>
      </motion.div>
    </AnimatePresence>
  );
}
