"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import KenoGrid from "./KenoGrid";

interface ResultsScreenProps {
  selectedNumbers: number[];
  drawnNumbers: number[];
  onContinue: () => void;
  displayDuration: number;
}

export default function ResultsScreen({
  selectedNumbers,
  drawnNumbers,
  onContinue,
  displayDuration,
}: ResultsScreenProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onContinue();
    }, displayDuration);

    return () => clearTimeout(timer);
  }, [onContinue, displayDuration]);

  return (
    <div className="flex flex-col items-center gap-6 w-full">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <h1 className="text-5xl font-bold text-white mb-2">DRAW COMPLETE</h1>
        <p className="text-yellow-400 text-2xl">20 Numbers Drawn</p>
      </motion.div>

      <div className="w-full max-w-4xl keno-card rounded-2xl p-6">
        <h3 className="text-white font-bold mb-4 text-center text-xl">
          DRAWN NUMBERS
        </h3>
        <div className="flex flex-wrap gap-3 justify-center mb-6">
          {drawnNumbers.slice(0, 10).map((num) => (
            <div
              key={num}
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{
                background: "linear-gradient(145deg, #fbbf24, #f59e0b)",
                boxShadow: "0 0 12px rgba(251, 191, 36, 0.5)",
              }}
            >
              {num}
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 justify-center">
          {drawnNumbers.slice(10, 20).map((num) => (
            <div
              key={num}
              className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold text-white"
              style={{
                background: "linear-gradient(145deg, #f97316, #ea580c)",
                boxShadow: "0 0 12px rgba(249, 115, 22, 0.5)",
              }}
            >
              {num}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full max-w-4xl keno-card rounded-2xl">
        <KenoGrid
          selectedNumbers={selectedNumbers}
          drawnNumbers={drawnNumbers}
          selectable={false}
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="text-white text-lg"
      >
        Starting new game soon...
      </motion.div>
    </div>
  );
}