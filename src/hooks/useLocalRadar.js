import { useState, useEffect, useCallback, useRef } from 'react';


const RADAR_RADIUS = 150;      // radio máximo en metros (escala)
const CENTER_X = 0, CENTER_Y = 0;


const TIPO_COLOR = {
  air: '#88ccff',
  ground: '#88ff88',
  sea: '#ffaa88'
};
const TIPO_ICONO = {
  air: '✈️',
  ground: '🚜',
  sea: '🚢'
};

export const useLocalRadar = () => {
  const [targets, setTargets] = useState([]);
  const [nextId, setNextId] = useState(1);
  const [threatCount, setThreatCount] = useState(0);
  const [lostTargets, setLostTargets] = useState(new Set()); // IDs de objetivos perdidos temporalmente
  const intervalRef = useRef(null);
  const animationRef = useRef(null);

  
  const addRandomTarget = useCallback(() => {
    
    if (Math.random() < 0.2) return;

    const tipo = ['air', 'ground', 'sea'][Math.floor(Math.random() * 3)];
    
    const angle = Math.random() * 2 * Math.PI;
    const x = RADAR_RADIUS * Math.cos(angle);
    const y = RADAR_RADIUS * Math.sin(angle);
    
    const speed = 0.8 + Math.random() * 1.5;
    const dirAngle = angle + (Math.random() - 0.5) * Math.PI / 3; 
    const vx = -speed * Math.cos(dirAngle);
    const vy = -speed * Math.sin(dirAngle);
    const isThreat = true; 

    setTargets(prev => {
      const newTarget = {
        id: nextId,
        tipo,
        x, y, vx, vy,
        isThreat,
        lastSeen: Date.now()
      };
      const updated = [...prev, newTarget];
      if (updated.length > 30) updated.shift();
      setNextId(prevId => prevId + 1);
      setThreatCount(updated.filter(t => t.isThreat).length);
      return updated;
    });
  }, [nextId]);

  
  const updatePositions = useCallback(() => {
    setTargets(prev => {
      const now = Date.now();
      let anyThreat = false;
      const updated = prev
        .map(t => {
          let newX = t.x + t.vx;
          let newY = t.y + t.vy;
          let distance = Math.hypot(newX, newY);
          
          if (distance > RADAR_RADIUS + 10 || distance < -10) return null;
          
          if (distance < 5) anyThreat = true;
          
          const lost = Math.random() < 0.05;
          return { ...t, x: newX, y: newY, lastSeen: now, lost };
        })
        .filter(t => t !== null);
      
      const newLost = new Set(updated.filter(t => t.lost).map(t => t.id));
      setLostTargets(newLost);
      setThreatCount(updated.filter(t => t.isThreat && Math.hypot(t.x, t.y) < 40).length);
      return updated;
    });
  }, []);

  
  const simulateIncursion = useCallback(() => {
    for (let i = 0; i < 5; i++) {
      setTimeout(() => addRandomTarget(), i * 150);
    }
  }, [addRandomTarget]);

  
  useEffect(() => {
    const interval = setInterval(() => {
      addRandomTarget();
      
      if (Math.random() < 0.3) setTimeout(() => addRandomTarget(), 300);
    }, 1800);
    intervalRef.current = interval;
    return () => clearInterval(interval);
  }, [addRandomTarget]);

  
  useEffect(() => {
    const animate = () => {
      updatePositions();
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationRef.current);
  }, [updatePositions]);

  return {
    targets,
    threatCount,
    addRandomTarget,
    simulateIncursion,
    TIPO_COLOR,
    TIPO_ICONO,
    lostTargets
  };
};