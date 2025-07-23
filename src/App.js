import React, { useState, useEffect } from "react";

const cartasDisponibles = [
  { nombre: "Melanie", imagen: process.env.PUBLIC_URL + "/imagenes/cartas/melanie.png", rareza: "Común" },
  { nombre: "Joker", imagen: process.env.PUBLIC_URL + "/imagenes/cartas/joker.png", rareza: "Mítica" },
  { nombre: "Rika", imagen: process.env.PUBLIC_URL + "/imagenes/cartas/rika.png", rareza: "Rara" },
  { nombre: "Luck", imagen: process.env.PUBLIC_URL + "/imagenes/cartas/luck.png", rareza: "Legendaria" },
  { nombre: "Scar", imagen: process.env.PUBLIC_URL + "/imagenes/cartas/scar.png", rareza: "Poco Común" },
  { nombre: "Metis", imagen: process.env.PUBLIC_URL + "/imagenes/cartas/metis.png", rareza: "Mítica" },
];



const probabilidades = {
  "Común": 100,
  "Poco Común": 50,
  "Rara": 10,
  "Mítica": 3,
  "Legendaria": 1,
};

const coloresRareza = {
  "Común": "#aaa",
  "Poco Común": "#0a0",
  "Rara": "#00f",
  "Mítica": "#a0f",
  "Legendaria": "#f5a623",
};

function obtenerCartaAleatoria() {
  const pool = cartasDisponibles.flatMap(carta => {
    const chance = probabilidades[carta.rareza];
    return Array(chance).fill(carta);
  });
  return pool[Math.floor(Math.random() * pool.length)];
}

function App() {
  const [fase, setFase] = useState("inicio");
  const [cartas, setCartas] = useState([]);
  const [cartaActual, setCartaActual] = useState(0);
  const [mostrarCarta, setMostrarCarta] = useState(false);
  const [coleccion, setColeccion] = useState([]);
  const [viendoColeccion, setViendoColeccion] = useState(false);
  const [animacionSobre, setAnimacionSobre] = useState(false);
  const [mensajeCompartir, setMensajeCompartir] = useState("");

  // Cargar colección desde localStorage al inicio
  useEffect(() => {
    const coleccionGuardada = localStorage.getItem("coleccionCartas");
    if (coleccionGuardada) {
      setColeccion(JSON.parse(coleccionGuardada));
    }
  }, []);

  // Guardar colección automáticamente solo si tiene cartas
  useEffect(() => {
    if (coleccion.length > 0) {
      localStorage.setItem("coleccionCartas", JSON.stringify(coleccion));
      console.log("Guardado automático:", coleccion);
    }
  }, [coleccion]);

  const abrirSobre = () => {
    setAnimacionSobre(true);
    setFase("animando");
    setMensajeCompartir("");

    setTimeout(() => {
      const nuevasCartas = Array.from({ length: 5 }, () => obtenerCartaAleatoria());
      setCartas(nuevasCartas);
      setCartaActual(0);
      setFase("abriendo");
      setMostrarCarta(true);
      setAnimacionSobre(false);
    }, 2000);
  };

  const mostrarSiguienteCarta = () => {
    if (cartaActual < cartas.length - 1) {
      setCartaActual(cartaActual + 1);
      setMensajeCompartir("");
    } else {
      setColeccion(prev => [...prev, ...cartas]);
      setFase("fin");
      setMensajeCompartir("");
    }
  };

  const contarCopias = () => {
    const conteo = {};
    coleccion.forEach(carta => {
      conteo[carta.nombre] = (conteo[carta.nombre] || 0) + 1;
    });
    return conteo;
  };
  const conteo = contarCopias();

  const compartirCarta = () => {
    if (!cartas[cartaActual]) return;
    const texto = `¡Mira esta carta! ${cartas[cartaActual].nombre} - Rareza: ${cartas[cartaActual].rareza}`;
    navigator.clipboard.writeText(texto).then(() => {
      setMensajeCompartir("Texto copiado al portapapeles para compartir.");
      setTimeout(() => setMensajeCompartir(""), 3000);
    });
  };

  return (
    <div style={{ textAlign: "center", backgroundColor: "#fff", minHeight: "100vh", padding: "2rem" }}>
      <h1>¡Abrí tu sobre de cartas!</h1>

      <button onClick={() => setViendoColeccion(!viendoColeccion)} style={{ marginBottom: "1rem" }}>
        {viendoColeccion ? "Volver a abrir sobres" : "Ver mi colección"}
      </button>

      {!viendoColeccion && fase === "inicio" && (
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "1rem" }}>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              onClick={abrirSobre}
              style={{
                width: "100px",
                height: "150px",
                backgroundColor: "#eee",
                border: "2px solid #aaa",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer",
                fontWeight: "bold",
                fontSize: "1rem",
                userSelect: "none",
                ...(animacionSobre ? { animation: "abrirSobre 2s ease forwards" } : {}),
              }}
            >
              Sobre {i + 1}
            </div>
          ))}
        </div>
      )}

      <style>
        {`
          @keyframes abrirSobre {
            0% { transform: scale(1); background-color: #eee; }
            50% { transform: scale(1.2) rotate(10deg); background-color: #ccc; }
            100% { transform: scale(1) rotate(0deg); background-color: #eee; }
          }
        `}
      </style>

      {!viendoColeccion && fase === "abriendo" && mostrarCarta && (
        <div>
          <h2 style={{ color: coloresRareza[cartas[cartaActual].rareza] }}>
            {cartas[cartaActual].nombre}
          </h2>
          <img
            src={cartas[cartaActual].imagen}
            alt={cartas[cartaActual].nombre}
            width={200}
            style={{
              border: `4px solid ${coloresRareza[cartas[cartaActual].rareza]}`,
              borderRadius: "10px",
              boxShadow: `0 0 15px ${coloresRareza[cartas[cartaActual].rareza]}99`,
              transition: "transform 0.3s",
            }}
          />
          <p>Rareza: {cartas[cartaActual].rareza}</p>
          <button onClick={mostrarSiguienteCarta} style={{ marginTop: "1rem", fontSize: "1.2rem", marginRight: "1rem" }}>
            {cartaActual < 4 ? "Siguiente carta" : "Finalizar sobre"}
          </button>
          <button onClick={compartirCarta} style={{ fontSize: "1.2rem" }}>
            Compartir carta
          </button>
          {mensajeCompartir && <p style={{ color: "green" }}>{mensajeCompartir}</p>}
        </div>
      )}

      {!viendoColeccion && fase === "fin" && (
        <div>
          <h2>¡Sobre completo!</h2>
          <button onClick={() => setFase("inicio")} style={{ marginTop: "1rem" }}>
            Volver a elegir un sobre
          </button>
        </div>
      )}

      {viendoColeccion && (
        <div>
          <h2>Mi colección</h2>
          {coleccion.length === 0 && <p>No tienes cartas aún.</p>}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "1rem",
              marginTop: "1rem",
            }}
          >
            {Object.entries(conteo).map(([nombre, cantidad]) => {
              const carta = cartasDisponibles.find((c) => c.nombre === nombre);
              return (
                <div
                  key={nombre}
                  style={{
                    border: `3px solid ${coloresRareza[carta.rareza]}`,
                    padding: "0.5rem",
                    width: "150px",
                    textAlign: "center",
                    borderRadius: "8px",
                    boxShadow: `0 0 10px ${coloresRareza[carta.rareza]}99`,
                  }}
                >
                  <img src={carta.imagen} alt={nombre} width={120} />
                  <p><b>{nombre}</b></p>
                  <p>Cantidad: {cantidad}</p>
                  <p>Rareza: {carta.rareza}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
