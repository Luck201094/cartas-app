// src/components/AnimacionSobre.js
import React from "react";

export default function AnimacionSobre({ onFinish }) {
  // Duración de animación (ms)
  const duracion = 2000;

  React.useEffect(() => {
    const timer = setTimeout(() => {
      onFinish();
    }, duracion);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div style={{
      width: "200px",
      height: "200px",
      margin: "auto",
      background: "url('/animaciones/sobre-cerrado.gif') no-repeat center",
      backgroundSize: "contain",
      filter: "drop-shadow(0 0 10px gold)",
    }}>
      {/* Aquí podrías poner texto o efectos adicionales */}
    </div>
  );
}
