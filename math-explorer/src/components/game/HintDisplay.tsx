import { motion, AnimatePresence } from "framer-motion";

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
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`rounded-2xl px-6 py-4 text-base font-medium text-center border-2 ${
          isReveal
            ? "bg-success text-success-foreground border-success-foreground/10"
            : "bg-hint text-hint-foreground border-hint-foreground/10"
        }`}
        role="status"
        aria-live="polite"
      >
        {hint}
      </motion.div>
    </AnimatePresence>
  );
}
