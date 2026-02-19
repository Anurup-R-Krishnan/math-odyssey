import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Lock, Play } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mission } from "@/types/game";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface MissionNodeProps {
    mission: Mission;
    index: number;
    isLeft: boolean;
}

const MissionNode: React.FC<MissionNodeProps> = ({ mission, index, isLeft }) => {
    const isLocked = mission.status === "locked";
    const isActive = mission.status === "active";
    const isCompleted = mission.status === "completed";

    // Base styles for the node
    const nodeBaseStyles = cn(
        "relative flex items-center justify-center w-20 h-20 rounded-full border-b-4 transition-all duration-300",
        isLocked
            ? "bg-muted border-muted-foreground/30 text-muted-foreground"
            : isActive
                ? "bg-primary border-primary/50 text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.5)]"
                : "bg-yellow-400 border-yellow-600 text-yellow-900"
    );

    const content = (
        <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
                type: "spring",
                stiffness: 260,
                damping: 20,
                delay: index * 0.1
            }}
            whileHover={!isLocked ? { scale: 1.1, translateY: -5 } : {}}
            className="relative z-10"
        >
            <div className={nodeBaseStyles}>
                {isLocked && <Lock className="w-8 h-8 opacity-50" />}
                {isActive && <Play className="w-8 h-8 ml-1" />}
                {isCompleted && <Star className="w-8 h-8 fill-yellow-900" />}

                {/* Pulse effect for active node */}
                {isActive && (
                    <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-20 animate-ping" />
                )}
            </div>

            {/* Stars display for completed/active */}
            {!isLocked && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 flex gap-1">
                    {[1, 2, 3].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                                "w-4 h-4 transition-colors",
                                star <= mission.stars
                                    ? "fill-yellow-400 text-yellow-600"
                                    : "text-muted-foreground/30"
                            )}
                        />
                    ))}
                </div>
            )}

            {/* Label */}
            <div className={cn(
                "absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-3 py-1 rounded-full text-xs font-bold border-2",
                isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-card text-card-foreground border-border"
            )}>
                {mission.title}
            </div>
        </motion.div>
    );

    if (isLocked) {
        return (
            <div className="flex flex-col items-center">
                {content}
            </div>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Link to={`/game?type=${mission.type}`}>
                        {content}
                    </Link>
                </TooltipTrigger>
                <TooltipContent side={isLeft ? "right" : "left"}>
                    <div className="text-center">
                        <p className="font-bold">{mission.title}</p>
                        <p className="text-xs text-muted-foreground">{mission.description}</p>
                        <Button size="sm" className="mt-2 w-full rounded-full">
                            {isActive ? "Start" : "Practice"}
                        </Button>
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default MissionNode;
