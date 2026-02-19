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
    <section className="min-h-screen bg-slate-50 pb-20 relative overflow-hidden">
      {/* Immersive Background - Lighter Theme */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-50 via-indigo-50/20 to-white z-0" />

      {/* Floating Decor - Adapted for Light Theme */}
      <FloatingElement delay={0} duration={5} left="10%" top="15%" scale={1.5}><Shapes size={64} className="text-blue-200" /></FloatingElement>
      <FloatingElement delay={2} duration={7} left="80%" top="10%" scale={1.2}><PlusCircle size={48} className="text-indigo-200" /></FloatingElement>
      <FloatingElement delay={1} duration={6} left="15%" top="60%" scale={1}><MinusCircle size={48} className="text-red-200" /></FloatingElement>
      <FloatingElement delay={3} duration={8} left="85%" top="50%" scale={1.8}><Star size={56} className="text-yellow-200" /></FloatingElement>
      <FloatingElement delay={0.5} duration={9} left="50%" top="85%" scale={2}><Trophy size={120} className="text-slate-100" /></FloatingElement>


      <div className="container max-w-md mx-auto px-4 py-8 relative z-10">

        {/* Header Area */}
        <div className="text-center space-y-2 mb-12 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-600 px-4 py-1.5 rounded-full font-bold shadow-sm"
          >
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-sm tracking-wide">Unit 1: Number Operations</span>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-slate-800 drop-shadow-sm">
            Mission Map
          </h1>
          <p className="text-slate-500 text-lg font-medium">
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
