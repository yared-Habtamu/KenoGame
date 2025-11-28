"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import KenoGrid from "./KenoGrid";

interface LiveDrawProps {
  selectedNumbers: number[];
  onDrawComplete: (drawnNumbers: number[]) => void;
  testMode?: boolean;
}

export default function LiveDraw({
  selectedNumbers,
  onDrawComplete,
  testMode = false,
}: LiveDrawProps) {
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentBall, setCurrentBall] = useState<number | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Generate 20 random unique numbers from 1-80
    const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
    const shuffled = [...allNumbers].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, 20);

    let index = 0;
    const interval = setInterval(() => {
      if (index < drawn.length) {
        const ball = drawn[index];
        setCurrentBall(ball);
        setDrawnNumbers((prev) => [...prev, ball]);
        index++;
      } else {
        setIsComplete(true);
        clearInterval(interval);
        setTimeout(() => {
          onDrawComplete(drawn);
        }, 2000);
      }
    }, testMode ? 200 : 800);

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
                className="w-32 h-32 rounded-full keno-ball-drawn flex items-center justify-center text-5xl font-bold text-white"
                style={{
                  background:
                    drawnNumbers.length <= 10
                      ? "linear-gradient(145deg, #fbbf24, #f59e0b)"
                      : "linear-gradient(145deg, #f97316, #ea580c)",
                }}
              >
                {currentBall}
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
              className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{
                background:
                  drawnNumbers.indexOf(num) < 10
                    ? "linear-gradient(145deg, #fbbf24, #f59e0b)"
                    : "linear-gradient(145deg, #f97316, #ea580c)",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            >
              {num}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="w-full max-w-4xl keno-card rounded-2xl">
        <KenoGrid
          selectedNumbers={selectedNumbers}
          drawnNumbers={drawnNumbers}
          selectable={false}
        />
      </div>

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