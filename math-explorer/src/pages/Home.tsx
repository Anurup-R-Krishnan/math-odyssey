import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { PlusCircle, MinusCircle, Shapes, Star } from "lucide-react";

const missions = [
  {
    id: "addition",
    title: "Addition Mission",
    desc: "Join numbers together",
    icon: PlusCircle,
    color: "bg-primary/20 text-primary",
  },
  {
    id: "subtraction",
    title: "Subtraction Mission",
    desc: "Take numbers away",
    icon: MinusCircle,
    color: "bg-destructive/20 text-destructive",
  },
  {
    id: "pattern",
    title: "Pattern Mission",
    desc: "Find the sequence",
    icon: Shapes,
    color: "bg-accent/40 text-accent-foreground",
  },
];

const Home = () => {
  return (
    <section className="container max-w-4xl py-12 px-6">
      <div className="text-center space-y-4 mb-12">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl md:text-4xl font-bold tracking-tight"
        >
          Your Mission Map
        </motion.h1>
        <p className="text-muted-foreground max-w-md mx-auto">
          Choose a mission station to start your math adventure.
        </p>
      </div>

      <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Connection lines (simplified) */}
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-muted -translate-y-1/2 -z-10 rounded-full" />

        {missions.map((mission, idx) => (
          <motion.div
            key={mission.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <Link to={`/game?type=${mission.id}`} className="group block h-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-[2.5rem]" aria-label={`Start ${mission.title}`}>
              <div className="relative overflow-hidden bg-card border-2 border-transparent group-hover:border-primary/30 group-focus-visible:border-primary/30 transition-all rounded-[2.5rem] p-8 text-center space-y-4 shadow-sm group-hover:shadow-md h-full flex flex-col items-center justify-center">
                {/* Active Pulse */}
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary/40 rounded-full animate-ping" />
                <div className="absolute top-4 right-4 w-3 h-3 bg-primary/60 rounded-full" />

                <div className={`w-20 h-20 rounded-3xl ${mission.color} flex items-center justify-center mb-2 shadow-inner group-hover:scale-110 transition-transform duration-300`}>
                  <mission.icon className="w-8 h-8" />
                </div>
                <div className="space-y-2">
                  <h3 className="font-black text-xl tracking-tight">{mission.title}</h3>
                  <p className="text-sm font-medium text-muted-foreground leading-snug">{mission.desc}</p>
                </div>
                <Button variant="secondary" className="mt-6 rounded-full px-8 h-12 font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  Start Station
                </Button>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="mt-16 bg-secondary/30 rounded-3xl p-8 text-center flex items-center justify-center gap-4 border-2 border-dashed border-secondary">
        <Star className="text-accent-foreground w-6 h-6" />
        <p className="font-medium text-secondary-foreground">
          Complete missions to earn stars and level up your skills!
        </p>
      </div>
    </section>
  );
};

export default Home;
