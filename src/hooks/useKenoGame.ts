"use client";

import { useState, useEffect, useCallback } from "react";

type GameState = "selection" | "drawing" | "results" | "history";

interface Draw {
  id: number;
  numbers: number[];
  timestamp: number;
}

export function useKenoGame(testMode: boolean = false) {
  const [gameState, setGameState] = useState<GameState>("selection");
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [drawHistory, setDrawHistory] = useState<Draw[]>([]);
  const [currentDrawId, setCurrentDrawId] = useState(1);

  // Load draw history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("keno-draw-history");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDrawHistory(parsed.draws || []);
        setCurrentDrawId(parsed.nextId || 1);
      } catch (e) {
        console.error("Failed to parse draw history", e);
      }
    }
  }, []);

  // Save draw history to localStorage
  const saveDrawHistory = useCallback((draws: Draw[], nextId: number) => {
    localStorage.setItem(
      "keno-draw-history",
      JSON.stringify({ draws, nextId })
    );
  }, []);

  const handleSelectionComplete = useCallback((numbers: number[]) => {
    setSelectedNumbers(numbers);
    setGameState("drawing");
  }, []);

  const handleDrawComplete = useCallback(
    (numbers: number[]) => {
      setDrawnNumbers(numbers);
      
      // Add to history
      const newDraw: Draw = {
        id: currentDrawId,
        numbers,
        timestamp: Date.now(),
      };
      
      const updatedHistory = [newDraw, ...drawHistory].slice(0, 50); // Keep last 50 draws
      setDrawHistory(updatedHistory);
      setCurrentDrawId(currentDrawId + 1);
      saveDrawHistory(updatedHistory, currentDrawId + 1);
      
      setGameState("results");
    },
    [currentDrawId, drawHistory, saveDrawHistory]
  );

  const handleResultsComplete = useCallback(() => {
    setGameState("history");
  }, []);

  const handleHistoryComplete = useCallback(() => {
    setSelectedNumbers([]);
    setDrawnNumbers([]);
    setGameState("selection");
  }, []);

  return {
    gameState,
    selectedNumbers,
    drawnNumbers,
    drawHistory,
    currentDrawId,
    handleSelectionComplete,
    handleDrawComplete,
    handleResultsComplete,
    handleHistoryComplete,
    testMode,
  };
}