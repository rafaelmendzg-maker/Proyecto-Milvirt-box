import { useState, useEffect, useCallback } from 'react';

export const useLocalRadar = () => {
  const [targets, setTargets] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [threatCount, setThreatCount] = useState(0);


  const addRandomTarget = useCallback(() => {
    const angle = Math.random() * 360;
    const distance = 40 + Math.random() * 110;
    const speed = 0.6 + Math.random() * 2.2;
    const isThreat = distance < 50 || distance < 38;
    setTargets(prev => {
      const newTarget = {
        id: nextId,
        distance,
        angleDeg: angle,
        speed,
        isThreat
      };
      const updated = [...prev, newTarget];
      if (updated.length > 24) updated.shift(); // Mantener solo 24 objetivos
      setNextId(prevId => prevId + 1);
      setThreatCount(updated.filter(t => t.isThreat).length);
      return updated;
    });
  }, [nextId]);

  // Simula una incursión aérea (3 objetivos en rápida sucesión)
  const simulateIncursion = useCallback(() => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => addRandomTarget(), i * 200);
    }
  }, [addRandomTarget]);

  
  useEffect(() => {
    const interval = setInterval(() => addRandomTarget(), 1900);
    return () => clearInterval(interval);
  }, [addRandomTarget]);

  return {
    targets,
    threatCount,
    addRandomTarget,
    simulateIncursion
  };
};