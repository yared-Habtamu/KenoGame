"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import KenoGrid from "./KenoGrid";

interface LiveDrawProps {
  selectedNumbers: number[];
  onDrawComplete: (drawnNumbers: number[]) => void;
  testMode?: boolean;
  onBallDrawn?: (num: number) => void;
  drawSequence?: number[];
}

export default function LiveDraw({
  selectedNumbers,
  onDrawComplete,
  testMode = false,
  onBallDrawn,
  drawSequence = [],
}: LiveDrawProps) {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentBall, setCurrentBall] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    if (!drawSequence || drawSequence.length === 0) return;

    // reset local state
    setDrawnNumbers([]);
    setCurrentBall(null);
    setIsComplete(false);

    let index = 0;
    const interval = setInterval(
      () => {
        if (index < drawSequence.length) {
          const ball = drawSequence[index];
          setCurrentBall(ball);
          setDrawnNumbers((prev) => {
            if (prev.includes(ball)) return prev;
            return [...prev, ball];
          });
          if (onBallDrawn) onBallDrawn(ball);
          index++;
        } else {
          setIsComplete(true);
          clearInterval(interval);
          setTimeout(() => {
            onDrawComplete(drawSequence);
          }, 2000);
        }
      },
      testMode ? 200 : 800
    );

    return () => clearInterval(interval);
  }, [onDrawComplete, testMode]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      {/* Ball Machine Display */}
      <div className="keno-card rounded-3xl p-8 shadow-2xl w-full max-w-md">
        <div className="text-center mb-4">
          <h2 className="text-2xl font-bold text-white mb-2">LIVE DRAW</h2>
          <div className="text-yellow-400 text-lg font-semibold">
            Ball {drawnNumbers.length} of 20
          </div>
        </div>

        <div className="relative h-48 flex items-center justify-center">
          <AnimatePresence mode="wait">
            {currentBall && (
              <motion.div
                key={currentBall}
                initial={{ scale: 0, y: -100, opacity: 0 }}
                animate={{ scale: 1, y: 0, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                transition={{
                  type: "spring",
                  stiffness: 200,
                  damping: 15,
                }}
                className="w-32 h-32 rounded-full keno-ball-drawn flex items-center justify-center"
              >
                <img
                  src={`/balls5/${currentBall}.png`}
                  alt={`ball-${currentBall}`}
                  className="w-3/4 h-3/4 object-contain select-none pointer-events-none"
                  draggable={false}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Recent Balls */}
        <div className="flex flex-wrap gap-2 justify-center mt-6 min-h-[60px]">
          {drawnNumbers.slice(-5).map((num, idx) => (
            <motion.div
              key={`${num}-${idx}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-12 h-12 rounded-full flex items-center justify-center keno-ball-drawn"
              style={{
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              <img
                src={`/balls5/${num}.png`}
                alt={`ball-${num}`}
                className="w-3/4 h-3/4 object-contain select-none pointer-events-none"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Grid is rendered by parent alongside this component */}

      {isComplete && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-white text-2xl font-bold"
        >
          Draw Complete! 🎉
        </motion.div>
      )}
    </div>
  );
}
