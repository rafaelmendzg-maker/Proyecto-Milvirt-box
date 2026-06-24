import React, { useRef, useEffect } from 'react';
import { useLocalRadar } from '../../hooks/useLocalRadar';
import RadarCanvas from './RadarCanvas';

const RadarPartition = () => {
  const canvasRef = useRef(null);
  const { targets, threatCount, TIPO_COLOR, TIPO_ICONO, lostTargets } = useLocalRadar();
  const sweepAngle = useRef(0);     // 🔄 Ángulo persistente
  const animationId = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width, h = canvas.height;
      if (w === 0) return;
      const cx = w/2, cy = h/2;
      const radius = Math.min(w, h) / 2 - 4;
      const scale = radius / 150;  

      
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#05180e';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#44cf9a';
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, 2 * Math.PI);
      ctx.stroke();
      for (let r = radius/3; r <= radius; r += radius/3) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.strokeStyle = '#2e805e';
        ctx.stroke();
      }

      
      targets.forEach(t => {
        const x = cx + t.x * scale;
        const y = cy + t.y * scale;
        if (Math.abs(x) > w + 20 || Math.abs(y) > h + 20) return;
        ctx.beginPath();
        let color = TIPO_COLOR[t.tipo] || '#66ffcc';
        if (lostTargets.has(t.id)) color = '#666666';
        ctx.fillStyle = color;
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.font = '12px monospace';
        ctx.fillStyle = 'white';
        ctx.fillText(TIPO_ICONO[t.tipo] || '?', x + 6, y - 4);
        ctx.font = '8px monospace';
        ctx.fillStyle = '#cccccc';
        ctx.fillText(t.id, x + 2, y - 10);
      });

      
      const sweepRad = (sweepAngle.current - 90) * Math.PI / 180;
      const ex = cx + radius * Math.cos(sweepRad);
      const ey = cy + radius * Math.sin(sweepRad);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = '#f5ffbe';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 1;

      
      sweepAngle.current = (sweepAngle.current + 2) % 360;
      animationId.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationId.current) cancelAnimationFrame(animationId.current);
    };
  }, [targets, lostTargets, TIPO_COLOR, TIPO_ICONO]); // Dependencias necesarias

  return (
    <div className="vm-card">
      <div className="card-header">
        <h2>📡 RADAR EN TIEMPO REAL</h2>
        <span className="criticality critical-high"> SIMULACIÓN </span>
      </div>
      <div className="card-content">
        <RadarCanvas ref={canvasRef} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>🎯 Amenazas cercanas: {threatCount}</span>
          <span>🔄 Barrido continuo</span>
        </div>
        <div className="targets-list">
          {targets.length === 0 ? <div>✈️ Sin contactos</div> :
            targets.slice().reverse().map(t => (
              <div key={t.id} className="target-item">
                <span>{TIPO_ICONO[t.tipo]} ID:{t.id}</span>
                <span>Dist: {Math.hypot(t.x, t.y).toFixed(0)}m</span>
                <span className={lostTargets.has(t.id) ? 'lost' : (t.isThreat ? 'threat' : '')}>
                  {lostTargets.has(t.id) ? '⚠️ PÉRDIDA' : (t.isThreat ? '⚠️ AMENAZA' : '● CONTACTO')}
                </span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default RadarPartition;