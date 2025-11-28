"use client";

import { useEffect, useState } from "react";
import KenoGrid from "./KenoGrid";
import CountdownTimer from "./CountdownTimer";
import { motion } from "framer-motion";

interface SelectionScreenProps {
  onTimerComplete: (selectedNumbers: number[]) => void;
  duration: number;
  drawId: number;
}

export default function SelectionScreen({
  onTimerComplete,
  duration,
  drawId,
}: SelectionScreenProps) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);

  // Auto-select random numbers one by one for imaginary players
  useEffect(() => {
    const allNumbers = Array.from({ length: 80 }, (_, i) => i + 1);
    const shuffled = [...allNumbers].sort(() => Math.random() - 0.5);
    const numbersToSelect = shuffled.slice(0, 20);
    
    setSelectedNumbers([]); // Reset
    
    let index = 0;
    const interval = setInterval(() => {
      if (index < numbersToSelect.length) {
        setSelectedNumbers((prev) => [...prev, numbersToSelect[index]]);
        index++;
      } else {
        clearInterval(interval);
      }
    }, 300); // Select one number every 300ms (6 seconds total for 20 numbers)
    
    return () => clearInterval(interval);
  }, [drawId]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 w-full max-w-7xl mx-auto">
      {/* Left side - Grid */}
      <div className="flex-1">
        {/* Draw number header */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-6"
        >
          <h1 className="text-6xl font-black tracking-tight">
            <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">
              DRAW
            </span>{" "}
            <span className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
              {drawId}
            </span>
          </h1>
        </motion.div>

        {/* Grid */}
        <div className="keno-card rounded-3xl p-6 shadow-2xl">
          <KenoGrid
            selectedNumbers={selectedNumbers}
            drawnNumbers={[]}
            onNumberSelect={() => {}}
            selectable={false}
          />
        </div>

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6"
        >
          <h2 
            className="text-6xl font-black text-red-900/50 tracking-widest"
            style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}
          >
            KENO
          </h2>
        </motion.div>
      </div>

      {/* Right side - Controls */}
      <div className="lg:w-80 flex flex-col gap-6">
        {/* Counter */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-right"
        >
          <div className="inline-block">
            <motion.span 
              key={selectedNumbers.length}
              initial={{ scale: 1.3, color: "#fbbf24" }}
              animate={{ scale: 1, color: "#ffffff" }}
              transition={{ duration: 0.3 }}
              className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
            >
              {selectedNumbers.length}
            </motion.span>
            <span className="text-5xl font-black text-white/60"> / </span>
            <span className="text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
              20
            </span>
          </div>
        </motion.div>

        {/* Timer */}
        <CountdownTimer
          duration={duration}
          onComplete={() => onTimerComplete(selectedNumbers)}
        />

        {/* Info text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-white/70 text-sm font-medium mt-4"
        >
          {selectedNumbers.length < 20 
            ? "Numbers are being selected by players..." 
            : "All numbers selected! Draw starting soon..."}
        </motion.div>
      </div>
    </div>
  );
}