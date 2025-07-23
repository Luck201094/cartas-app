import React from "react";
import "./Catalogo.css"; // si tenés estilos separados, sino podes quitar esta línea

const Catalogo = ({ todasLasCartas, coleccion }) => {
  return (
    <div className="catalogo-container">
      {todasLasCartas.map((carta) => {
        const obtenida = coleccion.some((c) => c.nombre === carta.nombre);
        const esHolo = ["Mítica", "Legendaria"].includes(carta.rareza);

        return (
          <div
            key={carta.nombre}
            className={`card ${esHolo ? "holo" : ""} ${obtenida ? "" : "no-obtenida"}`}
          >
            <img src={carta.imagen} alt={carta.nombre} />
            <h3>{carta.nombre}</h3>
            <p>Rareza: {carta.rareza}</p>
            {!obtenida && <p className="faltante">No obtenida</p>}
          </div>
        );
      })}
    </div>
  );
};

export default Catalogo;
