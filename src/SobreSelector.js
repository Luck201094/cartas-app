import React from 'react';
import './SobreSelector.css';

const sobres = new Array(20).fill(null);

function SobreSelector({ onSeleccionar }) {
  return (
    <div className="circulo-sobres">
      {sobres.map((_, i) => {
        const angulo = (360 / sobres.length) * i;
        const x = 150 + 100 * Math.cos((angulo * Math.PI) / 180);
        const y = 150 + 100 * Math.sin((angulo * Math.PI) / 180);
        return (
          <div
            key={i}
            className="sobre"
            style={{
              position: 'absolute',
              left: `${x}px`,
              top: `${y}px`,
              transform: 'translate(-50%, -50%)',
              cursor: 'pointer'
            }}
            onClick={() => onSeleccionar(i)}
          >
            📨
          </div>
        );
      })}
    </div>
  );
}

export default SobreSelector;
