"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface CountdownTimerProps {
  duration: number; // in seconds
  onComplete: () => void;
}

export default function CountdownTimer({
  duration,
  onComplete,
}: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState(duration);

  useEffect(() => {
    setTimeLeft(duration);
  }, [duration]);

  useEffect(() => {
    if (timeLeft <= 0) {
      onComplete();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onComplete]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const percentage = ((duration - timeLeft) / duration) * 100;

  return (
    <div className="keno-card rounded-2xl p-6 shadow-2xl w-full max-w-md">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white mb-4">TIME REMAINING</h3>
        <motion.div
          className="text-6xl font-bold mb-4"
          animate={{
            color: timeLeft <= 10 ? "#ef4444" : "#fbbf24",
            scale: timeLeft <= 10 ? [1, 1.05, 1] : 1,
          }}
          transition={{
            duration: 0.5,
            repeat: timeLeft <= 10 ? Infinity : 0,
          }}
        >
          {minutes}:{seconds.toString().padStart(2, "0")}
        </motion.div>
        <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-yellow-400 to-orange-500"
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
