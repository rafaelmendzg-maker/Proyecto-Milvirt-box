import React, { useRef, useEffect } from 'react';
import { useLocalRadar } from '../../hooks/useLocalRadar';
import RadarCanvas from './RadarCanvas';

const RadarPartition = () => {
  const canvasRef = useRef(null);
  const { targets, threatCount } = useLocalRadar();

  // Función para dibujar el radar (similar a la original)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let sweepAngle = 0;
    let animationId;

    const draw = () => {
      if (!ctx || !canvas) return;
      const w = canvas.width, h = canvas.height;
      if (w === 0) return;
      const cx = w/2, cy = h/2, rad = w/2 - 4;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#05180e';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#44cf9a';
      ctx.beginPath();
      ctx.arc(cx, cy, rad, 0, 2 * Math.PI);
      ctx.stroke();
      for (let r = rad/3; r <= rad; r += rad/3) {
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, 2 * Math.PI);
        ctx.strokeStyle = '#2e805e';
        ctx.stroke();
      }
      for (let ang = 0; ang < 360; ang += 45) {
        const radAng = ang * Math.PI / 180;
        const x2 = cx + rad * Math.cos(radAng);
        const y2 = cy + rad * Math.sin(radAng);
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = '#2f6e53';
        ctx.stroke();
      }
      targets.forEach(t => {
        const radAngle = (t.angleDeg - 90) * Math.PI / 180;
        const r = (t.distance / 150) * rad;
        const x = cx + r * Math.cos(radAngle);
        const y = cy + r * Math.sin(radAngle);
        ctx.beginPath();
        ctx.fillStyle = t.isThreat ? '#ff8855' : '#66ffcc';
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = 'bold 10px monospace';
        ctx.fillText(t.id, x + 4, y - 3);
      });
      const sweepRad = (sweepAngle - 90) * Math.PI / 180;
      const ex = cx + rad * Math.cos(sweepRad);
      const ey = cy + rad * Math.sin(sweepRad);
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(ex, ey);
      ctx.strokeStyle = '#f5ffbe';
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.lineWidth = 1;
      sweepAngle = (sweepAngle + 5) % 360;
      animationId = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animationId);
  }, [targets]);

  return (
    <div className="vm-card">
      <div className="card-header">
        <h2>📡 RADAR</h2>
        <span className="criticality critical-high">⚡ TIEMPO REAL</span>
      </div>
      <div className="card-content">
        <RadarCanvas ref={canvasRef} />
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>🎯 Amenazas: {threatCount}</span>
          <span>🔄 Latencia &lt; 15ms</span>
        </div>
        <div className="targets-list">
          {targets.length === 0 ? <div>✈️ Sin contactos activos</div> :
            targets.slice().reverse().map(t => (
              <div key={t.id} className="target-item">
                <span>ID:{t.id}</span>
                <span>{t.distance.toFixed(0)}m</span>
                <span>{t.angleDeg.toFixed(0)}°</span>
                <span className={t.isThreat ? 'threat' : ''}>{t.isThreat ? '⚠️ AMENAZA' : '● CONTACTO'}</span>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
};

export default RadarPartition;