import { motion } from "framer-motion";
import { PlusCircle, MinusCircle, Shapes, Star, Trophy } from "lucide-react";
import MissionMap from "@/components/game/MissionMap";
import { Mission } from "@/types/game";

// Mock Data - In a real app, this would come from a database/user state
const missions: Mission[] = [
  {
    id: "addition-1",
    title: "Addition Basics",
    type: "addition",
    status: "completed",
    description: "Learn to add single digit numbers.",
    stars: 3,
  },
  {
    id: "addition-2",
    title: "More Addition",
    type: "addition",
    status: "completed",
    description: "Add numbers up to 20.",
    stars: 2,
  },
  {
    id: "subtraction-1",
    title: "Subtraction Start",
    type: "subtraction",
    status: "active",
    description: "Take away numbers from 10.",
    stars: 0,
  },
  {
    id: "subtraction-2",
    title: "Subtraction Pro",
    type: "subtraction",
    status: "locked",
    description: "Complex subtraction problems.",
    stars: 0,
  },
  {
    id: "pattern-1",
    title: "Pattern Recognition",
    type: "pattern",
    status: "locked",
    description: "Find the next shape or number.",
    stars: 0,
  },
  {
    id: "pattern-2",
    title: "Advanced Patterns",
    type: "pattern",
    status: "locked",
    description: "Complete complex number sequences.",
    stars: 0,
  },
  {
    id: "boss-1",
    title: "Math Master",
    type: "addition", // Placeholder type
    status: "locked",
    description: "Prove your skills in the final challenge!",
    stars: 0,
  }
];

const FloatingElement = ({ delay, duration, left, top, scale, children }: any) => (
  <motion.div
    initial={{ y: 0, rotate: 0 }}
    animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
    transition={{ duration, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute text-white/20 pointer-events-none z-0"
    style={{ left, top, scale }}
  >
    {children}
  </motion.div>
);

const Home = () => {
  return (
    <section className="min-h-screen bg-indigo-900 pb-20 relative overflow-hidden">
      {/* Immersive Background */}
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-800 via-indigo-900 to-black z-0" />

      {/* Floating Decor */}
      <FloatingElement delay={0} duration={5} left="10%" top="15%" scale={1.5}><Shapes size={64} /></FloatingElement>
      <FloatingElement delay={2} duration={7} left="80%" top="10%" scale={1.2}><PlusCircle size={48} /></FloatingElement>
      <FloatingElement delay={1} duration={6} left="15%" top="60%" scale={1}><MinusCircle size={48} /></FloatingElement>
      <FloatingElement delay={3} duration={8} left="85%" top="50%" scale={1.8}><Star size={56} /></FloatingElement>
      <FloatingElement delay={0.5} duration={9} left="50%" top="85%" scale={2}><Trophy size={120} className="text-white/5" /></FloatingElement>


      <div className="container max-w-md mx-auto px-4 py-8 relative z-10">

        {/* Header Area */}
        <div className="text-center space-y-2 mb-12 mt-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 text-indigo-100 px-4 py-1.5 rounded-full font-bold shadow-lg"
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span className="text-sm tracking-wide">Unit 1: Number Operations</span>
          </motion.div>
          <h1 className="text-4xl font-black tracking-tight text-white drop-shadow-md">
            Mission Map
          </h1>
          <p className="text-indigo-200 text-lg font-medium">
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
