import React, { forwardRef } from 'react';

const RadarCanvas = forwardRef((props, ref) => {
  return (
    <div className="radar-canvas-container">
      <canvas ref={ref} width="300" height="300"></canvas>
    </div>
  );
});

export default RadarCanvas;