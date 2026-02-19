import { motion } from "framer-motion";
import { PlusCircle, MinusCircle, Shapes, Star, Trophy } from "lucide-react";
import MissionMap from "@/components/game/MissionMap";
import { useMissionProgress } from "@/hooks/useMissionProgress";

const FloatingElement = ({ delay, duration, left, top, scale, children }: any) => (
  <motion.div
    initial={{ y: 0, rotate: 0 }}
    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute text-slate-400/30 pointer-events-none z-0"
    style={{ left, top, scale }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  const { missions } = useMissionProgress();

  return (
    <section className="min-h-[calc(100vh-4rem)] pb-20 relative overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Floating Decor - More elements, subtle animation */}
      <FloatingElement delay={0} duration={25} left="10%" top="15%" scale={1.5}><Shapes size={64} className="text-secondary/40" /></FloatingElement>
      <FloatingElement delay={2} duration={28} left="80%" top="10%" scale={1.2}><PlusCircle size={48} className="text-primary/30" /></FloatingElement>
      <FloatingElement delay={1} duration={30} left="15%" top="60%" scale={1}><MinusCircle size={48} className="text-accent/40" /></FloatingElement>
      <FloatingElement delay={3} duration={32} left="85%" top="50%" scale={1.8}><Star size={56} className="text-yellow-400/30" /></FloatingElement>
      <FloatingElement delay={5} duration={35} left="5%" top="80%" scale={0.8}><Trophy size={40} className="text-primary/20" /></FloatingElement>
      <FloatingElement delay={4} duration={22} left="70%" top="85%" scale={1.1}><Shapes size={50} className="text-secondary/30" /></FloatingElement>
      <FloatingElement delay={6} duration={26} left="40%" top="20%" scale={0.6}><Star size={30} className="text-yellow-400/20" /></FloatingElement>


      <div className="container max-w-md mx-auto px-4 py-8 relative z-10">

        {/* Header Area */}
        <div className="text-center space-y-2 mb-12 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-card border border-border text-card-foreground px-4 py-1.5 rounded-full font-bold shadow-sm"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm tracking-wide">Unit 1: Number Operations</span>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-foreground drop-shadow-sm">
            Mission Map
          </h1>
          <p className="text-muted-foreground text-lg font-medium">
            Your journey to math mastery starts here!
          </p>
        </div>

        {/* The Mission Map */}
        <div className="relative min-h-[500px]">
          <MissionMap missions={missions} />
        </div>

      </div>
    </section>
  );
};

export default Home;
