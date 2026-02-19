import React, { useRef, useEffect, useState } from "react";
import { Mission } from "@/types/game";
import MissionNode from "./MissionNode";
import { motion } from "framer-motion";

interface MissionMapProps {
    missions: Mission[];
}

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

    // Constants for layout
    const NODE_HEIGHT = 160; // Vertical spacing
    const AMPLITUDE = 80; // How wide the zigzag is
    const OFFSET_Y = 60; // Initial top padding

    // Calculate position for a node
    const getNodePosition = (index: number) => {
        const y = index * NODE_HEIGHT + OFFSET_Y;
        // Sine wave pattern: Center + Amplitude * sin(frequency)
        // Using index directly gives a nice zigzag if we adjust phase
        const xOffset = Math.sin(index * 2) * AMPLITUDE;
        return { x: xOffset, y };
    };

    // Generate SVG Path
    const generatePath = () => {
        if (missions.length === 0) return "";

        let path = "";
        missions.forEach((_, index) => {
            const current = getNodePosition(index);

            // We need to convert from relative center offset to absolute SVG coordinates
            // Center of container is dimensions.width / 2
            const cx = dimensions.width / 2 + current.x;
            const cy = current.y + 40; // +40 to center in the 80px high node (approx)

            if (index === 0) {
                path += `M ${cx} ${cy}`;
            } else {
                const prev = getNodePosition(index - 1);
                const px = dimensions.width / 2 + prev.x;
                const py = prev.y + 40;

                // Cubic bezier for smooth curve
                // Control points: vertical from previous, vertical to current
                const cp1x = px;
                const cp1y = py + (cy - py) * 0.5;
                const cp2x = cx;
                const cp2y = cy - (cy - py) * 0.5;

                path += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${cx} ${cy}`;
            }
        });
        return path;
    };

    return (
        <div className="relative w-full max-w-md mx-auto py-12" ref={containerRef}>
            {/* Connector Line SVG */}
            <svg
                className="absolute top-0 left-0 w-full h-full pointer-events-none z-0"
                style={{ height: missions.length * NODE_HEIGHT + 100 }}
            >
                <path
                    d={generatePath()}
                    fill="none"
                    stroke="#e2e8f0" // muted color
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray="16 8"
                    className="opacity-50"
                />
                <motion.path
                    d={generatePath()}
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="8"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
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

            {/* Spacer to give the container height since elements are absolute */}
            <div style={{ height: (missions.length - 1) * NODE_HEIGHT + 150 }} />
        </div>
    );
};

export default MissionMap;
