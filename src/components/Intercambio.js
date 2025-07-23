// src/components/Intercambio.js
import React, { useState } from "react";

function Intercambio({ coleccion, cartasDisponibles, onPropuesta }) {
  const [cartaOfrecida, setCartaOfrecida] = useState("");
  const [cartaDeseada, setCartaDeseada] = useState("");

  const enviarPropuesta = () => {
    if (!cartaOfrecida || !cartaDeseada) return alert("Elegí ambas cartas.");
    onPropuesta({ cartaOfrecida, cartaDeseada });
    setCartaOfrecida("");
    setCartaDeseada("");
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Proponer un intercambio</h2>

      <div>
        <h4>Elegí una carta de tu colección para ofrecer:</h4>
        <select value={cartaOfrecida} onChange={(e) => setCartaOfrecida(e.target.value)}>
          <option value="">-- Elegí una carta --</option>
          {[...new Set(coleccion.map(c => c.nombre))].map((nombre) => (
            <option key={nombre} value={nombre}>{nombre}</option>
          ))}
        </select>
      </div>

      <div>
        <h4>Elegí la carta que querés recibir:</h4>
        <select value={cartaDeseada} onChange={(e) => setCartaDeseada(e.target.value)}>
          <option value="">-- Elegí una carta --</option>
          {cartasDisponibles.map((carta) => (
            <option key={carta.nombre} value={carta.nombre}>{carta.nombre}</option>
          ))}
        </select>
      </div>

      <button onClick={enviarPropuesta} style={{ marginTop: "1rem" }}>
        Enviar propuesta
      </button>
    </div>
  );
}

export default Intercambio;
