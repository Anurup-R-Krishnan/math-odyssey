import React, { useRef, useEffect, useState, useMemo } from "react";
import { Mission } from "@/types/game";
import MissionNode from "./MissionNode";
import { motion } from "framer-motion";

interface MissionMapProps {
    missions: Mission[];
}

// Constants for layout
const NODE_HEIGHT = 180; // Vertical spacing (Increased for breathing room)
const AMPLITUDE = 100; // How wide the zigzag is
const OFFSET_Y = 80; // Initial top padding

// Calculate position for a node
const getNodePosition = (index: number) => {
    const y = index * NODE_HEIGHT + OFFSET_Y;
    const xOffset = Math.sin(index * 2) * AMPLITUDE;
    return { x: xOffset, y };
};

const MissionMap: React.FC<MissionMapProps> = ({ missions }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    // Update dimensions on resize for SVG calculation
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.offsetWidth,
                    height: containerRef.current.scrollHeight,
                });
            }
        };

        updateDimensions();
        window.addEventListener("resize", updateDimensions);
        return () => window.removeEventListener("resize", updateDimensions);
    }, [missions]);

    // Generate SVG Path
    const path = useMemo(() => {
        if (missions.length === 0) return "";

        let pathStr = "";
        missions.forEach((_, index) => {
            const current = getNodePosition(index);

            const cx = dimensions.width / 2 + current.x;
            const cy = current.y + 48; // Center in the 96px high node (approx)

            if (index === 0) {
                pathStr += `M ${cx} ${cy}`;
            } else {
                const prev = getNodePosition(index - 1);
                const px = dimensions.width / 2 + prev.x;
                const py = prev.y + 48;

                const cp1x = px;
                const cp1y = py + (cy - py) * 0.5;
                const cp2x = cx;
                const cp2y = cy - (cy - py) * 0.5;

                pathStr += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cx} ${cy}`;
            }
        });
        return pathStr;
    }, [missions, dimensions]);

    return (
        <div className="relative w-full max-w-lg mx-auto py-12" ref={containerRef}>
            {/* Connector Line SVG */}
            <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-0 overflow-visible"
                style={{ height: missions.length * NODE_HEIGHT + 150 }}
            >
                {/* Glow effect for path (adjusted for light theme) */}
                <path
                    d={path}
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.2)" // slate-400/20
                    strokeWidth="20"
                    strokeLinecap="round"
                    className="blur-md"
                />

                {/* Dashed Base Path */}
                <path
                    d={path}
                    fill="none"
                    stroke="rgba(148, 163, 184, 0.4)" // slate-400/40
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray="20 15"
                />

                {/* Animated Progress Path (Optional overlay) */}
                <motion.path
                    d={path}
                    fill="none"
                    stroke="rgba(99, 102, 241, 0.4)" // indigo-500/40
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeDasharray="10 10"
                    animate={{ strokeDashoffset: [0, -20] }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
            </svg>

            {/* Nodes */}
            {missions.map((mission, index) => {
                const pos = getNodePosition(index);
                return (
                    <div
                        key={mission.id}
                        className="absolute left-1/2 transform -translate-x-1/2"
                        style={{ top: pos.y, marginLeft: pos.x }}
                    >
                        <MissionNode
                            mission={mission}
                            index={index}
                            isLeft={pos.x < 0} // Tooltip direction hint
                        />
                    </div>
                );
            })}

            {/* Spacer */}
            <div style={{ height: (missions.length - 1) * NODE_HEIGHT + 200 }} />
        </div>
    );
};

export default MissionMap;
