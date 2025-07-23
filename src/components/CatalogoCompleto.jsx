import React from "react";
import "./CatalogoCompleto.css";

const CatalogoCompleto = ({ todasLasCartas, cartasDelJugador }) => {
  return (
    <div className="catalogo-container">
      {todasLasCartas.map((carta) => {
        const obtenida = cartasDelJugador.includes(carta.id);

        return (
          <div
            key={carta.id}
            className={`card ${!obtenida ? "no-obtenida" : ""} ${
              carta.rara ? "holo brillo" : ""
            }`}
          >
            <img
              src={carta.imagen}
              alt={carta.nombre}
              style={{ opacity: obtenida ? 1 : 0.3 }}
            />
            <div>{carta.nombre}</div>
            {!obtenida && <div className="faltante">No obtenida</div>}
          </div>
        );
      })}
    </div>
  );
};

export default CatalogoCompleto;
