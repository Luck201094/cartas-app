import React, { useState } from "react";

// Datos ejemplo de cartas
const cartasData = [
  { id: 1, nombre: "Melanie", rareza: "comun", imagen: "/imagene/carta/melanie.png" },
  { id: 2, nombre: "Scar", rareza: "poco-comun", imagen: "/imagene/carta/scar.png" },
  { id: 3, nombre: "Rika", rareza: "rara", imagen: "/imagene/carta/pika.png" },
  { id: 4, nombre: "Metis", rareza: "mitica", imagen: "/imagene/carta/metis.png" },
  { id: 5, nombre: "Joker", rareza: "mitica", imagen: "/imagene/carta/joker.png" },
  { id: 6, nombre: "Luck", rareza: "legendaria", imagen: "/imagene/carta/luck.png" },
];

// Usuario simulado con foto y datos
const usuario = {
  nombre: "Luck",
  fotoPerfil: "/imagenes/perfil/luck.png",
  amigos: 12,
  logros: 5,
};

function App() {
  const [coleccion, setColeccion] = useState([
    { cartaId: 1, cantidad: 2 },
    { cartaId: 3, cantidad: 1 },
    { cartaId: 5, cantidad: 1 },
  ]);

  const [mostrarIntercambio, setMostrarIntercambio] = useState(false);

  const [cartaDoy, setCartaDoy] = useState(null);
  const [cartaQuiero, setCartaQuiero] = useState(null);

  const getCartaById = (id) => cartasData.find((carta) => carta.id === id);

  const getCantidadCarta = (id) => {
    const c = coleccion.find((c) => c.cartaId === id);
    return c ? c.cantidad : 0;
  };

  const tieneCarta = (id) => getCantidadCarta(id) > 0;

  const toggleIntercambio = () => setMostrarIntercambio(!mostrarIntercambio);

  // Propuesta simple - por ahora solo alerta
  const enviarPropuesta = () => {
    if (!cartaDoy || !cartaQuiero) {
      alert("Selecciona cartas para intercambiar.");
      return;
    }
    if (cartaDoy === cartaQuiero) {
      alert("No puedes intercambiar la misma carta.");
      return;
    }
    if (getCantidadCarta(cartaDoy) === 0) {
      alert("No tienes la carta para dar.");
      return;
    }
    alert(
      `Propuesta enviada: das "${getCartaById(cartaDoy).nombre}" y quieres "${getCartaById(
        cartaQuiero
      ).nombre}".`
    );
    setCartaDoy(null);
    setCartaQuiero(null);
    setMostrarIntercambio(false);
  };

  return (
    <div className="contenedor-principal" style={{ position: "relative", minHeight: "100vh" }}>
      {/* PERFIL EN ESQUINA */}
      <div
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          backgroundColor: "white",
          padding: "1rem",
          borderRadius: "10px",
          boxShadow: "0 0 10px rgba(0,0,0,0.15)",
          width: "220px",
          textAlign: "center",
          zIndex: 1000,
        }}
      >
        <img
          src={usuario.fotoPerfil}
          alt="Perfil"
          style={{ width: "80px", height: "80px", borderRadius: "50%", marginBottom: "0.5rem" }}
        />
        <h3>{usuario.nombre}</h3>
        <p>Amigos: {usuario.amigos}</p>
        <p>Cartas: {coleccion.reduce((acc, c) => acc + c.cantidad, 0)}</p>
        <p>Logros: {usuario.logros}</p>
        <button
          onClick={() => alert("Sesión cerrada")}
          style={{
            marginTop: "0.5rem",
            backgroundColor: "#ff4d4d",
            border: "none",
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          Salir
        </button>
      </div>

      <h1>Catálogo de Cartas</h1>

      <div className="catalogo-container" style={{ marginTop: "2rem" }}>
        {cartasData.map((carta) => {
          const clasesCarta = `card ${carta.rareza} ${!tieneCarta(carta.id) ? "no-obtenida" : ""}`;
          return (
            <div key={carta.id} className={clasesCarta}>
              <img src={carta.imagen} alt={carta.nombre} />
              <div>{carta.nombre}</div>
              {!tieneCarta(carta.id) && <div className="faltante">¡Te falta!</div>}
            </div>
          );
        })}
      </div>

      {/* BOTÓN OPCIONAL DE INTERCAMBIO */}
      <div style={{ marginTop: "1rem", textAlign: "center" }}>
        <button onClick={toggleIntercambio}>
          {mostrarIntercambio ? "Cancelar intercambio" : "Intercambiar (opcional)"}
        </button>
      </div>

      {/* SECCIÓN INTERCAMBIO OPCIONAL */}
      {mostrarIntercambio && (
        <section style={{ marginTop: "2rem", maxWidth: "400px", marginLeft: "auto", marginRight: "auto" }}>
          <h3>Proponer Intercambio</h3>
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
            <div>
              <label>Te doy:</label>
              <br />
              <select value={cartaDoy || ""} onChange={(e) => setCartaDoy(Number(e.target.value))}>
                <option value="">Selecciona una carta</option>
                {coleccion
                  .filter(({ cantidad }) => cantidad > 0)
                  .map(({ cartaId, cantidad }) => {
                    const carta = getCartaById(cartaId);
                    return (
                      <option key={cartaId} value={cartaId}>
                        {carta.nombre} (x{cantidad})
                      </option>
                    );
                  })}
              </select>
            </div>

            <div>
              <label>Quiero:</label>
              <br />
              <select value={cartaQuiero || ""} onChange={(e) => setCartaQuiero(Number(e.target.value))}>
                <option value="">Selecciona una carta</option>
                {cartasData.map((carta) => (
                  <option key={carta.id} value={carta.id}>
                    {carta.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button onClick={enviarPropuesta} style={{ marginTop: "1rem" }}>
            Enviar Propuesta
          </button>
        </section>
      )}
    </div>
  );
}

export default App;
