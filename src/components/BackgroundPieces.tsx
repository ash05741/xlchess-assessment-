import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

// 1. Wrap the entire component in React.memo. 
// This tells React: "Unless my props change, NEVER re-render this component."
export const BackgroundPieces = React.memo(function BackgroundPieces() {
    const pieces = ['♞', '♝', '♜', '♛', '♚', '♟'];

    // 2. Wrap the random math in useMemo with an empty dependency array [].
    // This tells React: "Calculate these random numbers exactly once on initial load, and lock them in forever."
    const pieceData = useMemo(() => {
        return [...Array(20)].map(() => {
            const duration = Math.random() * 15 + 25;
            return {
                startRotation: Math.random() * 360,
                sizeScale: Math.random() * 0.8 + 0.5,
                startLeft: Math.random() * 100,
                duration: duration,
                delay: -(Math.random() * duration)
            };
        });
    }, []);

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0" aria-hidden="true">
            {/* 3. Map over the locked-in pieceData instead of calculating on the fly */}
            {pieceData.map((data, i) => (
                <motion.div
                    key={i}
                    className="absolute text-white/[0.03] text-7xl md:text-9xl select-none flex items-center justify-center"
                    initial={{
                        top: '-20%',
                        left: `${data.startLeft}%`,
                        rotate: data.startRotation,
                        scale: data.sizeScale
                    }}
                    animate={{
                        top: '120%',
                        rotate: data.startRotation + 90
                    }}
                    transition={{
                        duration: data.duration,
                        repeat: Infinity,
                        ease: 'linear',
                        delay: data.delay,
                    }}
                >
                    {pieces[i % pieces.length]}
                </motion.div>
            ))}
        </div>
    );
});