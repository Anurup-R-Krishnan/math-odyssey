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

const Home = () => {
  return (
    <section className="min-h-screen bg-gradient-to-b from-background to-secondary/20 pb-20">
      <div className="container max-w-md mx-auto px-4 py-8">

        {/* Header Area */}
        <div className="text-center space-y-2 mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full font-bold shadow-sm"
          >
            <Trophy className="w-5 h-5" />
            <span>Unit 1: Number Operations</span>
          </motion.div>
          <h1 className="text-3xl font-extrabold tracking-tight text-primary">
            Mission Path
          </h1>
          <p className="text-muted-foreground text-sm">
            Complete stations to unlock new challenges!
          </p>
        </div>

        {/* The Mission Map */}
        <div className="relative">
          <MissionMap missions={missions} />
        </div>

      </div>
    </section>
  );
};

export default Home;
