import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Star, Lock, Play, Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { Mission, ProblemType } from "@/types/game";
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

const getTypeStyles = (type: ProblemType, status: Mission["status"]) => {
    if (status === "locked") {
        return "bg-slate-200 border-slate-300 text-slate-400";
    }

    switch (type) {
        case "addition":
            return "bg-blue-500 border-blue-700 text-white shadow-blue-500/40";
        case "subtraction":
            return "bg-red-500 border-red-700 text-white shadow-red-500/40";
        case "pattern":
            return "bg-purple-500 border-purple-700 text-white shadow-purple-500/40";
        default:
            return "bg-green-500 border-green-700 text-white";
    }
};

const MissionNode: React.FC<MissionNodeProps> = ({ mission, index, isLeft }) => {
    const isLocked = mission.status === "locked";
    const isActive = mission.status === "active";
    const isCompleted = mission.status === "completed";

    // 3D Button Style
    const nodeBaseStyles = cn(
        "relative flex items-center justify-center w-24 h-24 rounded-full border-b-[6px] transition-all duration-150 active:border-b-0 active:translate-y-[6px]",
        getTypeStyles(mission.type, mission.status),
        isActive && "animate-pulse-slow shadow-lg"
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
            whileHover={!isLocked ? { scale: 1.05, translateY: -5 } : {}}
            className="relative z-10 flex flex-col items-center"
        >
            {/* Stars Arc for Completed */}
            {!isLocked && (
                <div className="absolute -top-6 flex gap-1 justify-center w-full">
                    {[1, 2, 3].map((star) => (
                        <Star
                            key={star}
                            className={cn(
                                "w-5 h-5 drop-shadow-sm",
                                star <= mission.stars
                                    ? "fill-yellow-400 text-yellow-500"
                                    : "fill-slate-200 text-slate-300"
                            )}
                        />
                    ))}
                </div>
            )}

            <div className={nodeBaseStyles}>
                <div className="flex flex-col items-center">
                    {isLocked ? (
                        <Lock className="w-8 h-8 opacity-50" />
                    ) : isCompleted ? (
                        <Check className="w-10 h-10 stroke-[3]" />
                    ) : (
                        <Play className="w-10 h-10 fill-current" />
                    )}
                </div>

                {/* Shine effect */}
                {!isLocked && (
                    <div className="absolute top-2 left-4 w-4 h-4 bg-white/20 rounded-full blur-[2px]" />
                )}
            </div>

            {/* Label Badge */}
            <div className={cn(
                "absolute top-[calc(100%+8px)] whitespace-nowrap px-4 py-1.5 rounded-xl text-sm font-extrabold shadow-sm border-b-4",
                isActive
                    ? "bg-white text-primary border-slate-200 text-base"
                    : isLocked
                        ? "bg-slate-100 text-slate-400 border-slate-200"
                        : "bg-white text-slate-700 border-slate-200"
            )}>
                {mission.title}
            </div>
        </motion.div>
    );

    if (isLocked) {
        return (
            <div className="pb-12 grayscale-[0.5] opacity-80 hover:opacity-100 transition-opacity">
                {content}
            </div>
        );
    }

    return (
        <TooltipProvider>
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    <Link to={`/game?type=${mission.type}`} className="pb-12 block">
                        {content}
                    </Link>
                </TooltipTrigger>
                <TooltipContent
                    side={isLeft ? "right" : "left"}
                    className={cn(
                        "p-4 rounded-2xl border-b-4 border-slate-200 font-bold text-center",
                        "bg-white text-slate-800"
                    )}
                    sideOffset={10}
                >
                    <p className="text-lg">{mission.title}</p>
                    <p className="text-sm text-slate-500 font-medium mb-2">{mission.description}</p>
                    <div className={cn(
                        "uppercase text-xs py-1 px-3 rounded-lg inline-block",
                        isActive ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    )}>
                        {isActive ? "Start Lesson" : "Review"}
                    </div>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default MissionNode;
