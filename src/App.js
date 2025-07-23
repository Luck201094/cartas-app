import React, { useState, useEffect } from "react";

const cartasDisponibles = [
  { nombre: "Melanie", imagen: process.env.PUBLIC_URL + "/imagene/carta/melanie.png", rareza: "Común" },
  { nombre: "Joker", imagen: process.env.PUBLIC_URL + "/imagene/carta/joker.png", rareza: "Mítica" },
  { nombre: "Rika", imagen: process.env.PUBLIC_URL + "/imagene/carta/rika.png", rareza: "Rara" },
  { nombre: "Luck", imagen: process.env.PUBLIC_URL + "/imagene/carta/luck.png", rareza: "Legendaria" },
  { nombre: "Scar", imagen: process.env.PUBLIC_URL + "/imagene/carta/scar.png", rareza: "Poco Común" },
  { nombre: "Metis", imagen: process.env.PUBLIC_URL + "/imagene/carta/metis.png", rareza: "Mítica" },
];

const jugadores = [
  { id: "Luck", nombre: "Luck" },
  { id: "Metis", nombre: "Metis" },
];

// Probabilidades normalizadas según tus porcentajes
const probabilidades = [
  { rareza: "Legendaria", porcentaje: 0.59 },
  { rareza: "Mítica", porcentaje: 1.78 },
  { rareza: "Rara", porcentaje: 8.88 },
  { rareza: "Poco Común", porcentaje: 29.59 },
  { rareza: "Común", porcentaje: 59.17 },
];

// Helper para elegir rareza según probabilidad
function elegirRareza() {
  const rand = Math.random() * 100;
  let acumulado = 0;
  for (const prob of probabilidades) {
    acumulado += prob.porcentaje;
    if (rand <= acumulado) return prob.rareza;
  }
  return "Común"; // fallback
}

// Elegir una carta aleatoria dado rareza
function cartaAleatoriaPorRareza(rareza) {
  const filtradas = cartasDisponibles.filter((c) => c.rareza === rareza);
  if (filtradas.length === 0) return null;
  return filtradas[Math.floor(Math.random() * filtradas.length)];
}

function App() {
  const [usuarioActual, setUsuarioActual] = useState("Luck");
  const [coleccion, setColeccion] = useState([]);
  const [propuestas, setPropuestas] = useState([]);
  const [jugadorDestino, setJugadorDestino] = useState(jugadores.find((j) => j.id !== usuarioActual).id);
  const [cartaOfrecida, setCartaOfrecida] = useState(null);
  const [cartaDeseada, setCartaDeseada] = useState(null);

  // Para abrir sobres
  const [cartasAbrir, setCartasAbrir] = useState([]);
  const [abriendoSobre, setAbriendoSobre] = useState(false);

  // Modal perfil abierto o no
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  // Pantalla actual: "principal" o "intercambio"
  const [pantalla, setPantalla] = useState("principal");

  useEffect(() => {
    const guardadoColeccion = localStorage.getItem(`coleccion_${usuarioActual}`);
    if (guardadoColeccion) setColeccion(JSON.parse(guardadoColeccion));
    else setColeccion([]);

    const guardadoPropuestas = localStorage.getItem("propuestas");
    if (guardadoPropuestas) setPropuestas(JSON.parse(guardadoPropuestas));
    else setPropuestas([]);

    setJugadorDestino(jugadores.find((j) => j.id !== usuarioActual).id);
    setCartaOfrecida(null);
    setCartaDeseada(null);
    setCartasAbrir([]);
    setAbriendoSobre(false);
    setPerfilAbierto(false);
    setPantalla("principal");
  }, [usuarioActual]);

  useEffect(() => {
    localStorage.setItem(`coleccion_${usuarioActual}`, JSON.stringify(coleccion));
  }, [coleccion, usuarioActual]);

  useEffect(() => {
    localStorage.setItem("propuestas", JSON.stringify(propuestas));
  }, [propuestas]);

  const abrirSobre = () => {
    setAbriendoSobre(true);
    const nuevasCartas = [];
    // Abre 5 cartas con rarezas según probabilidad
    for (let i = 0; i < 5; i++) {
      const rareza = elegirRareza();
      const carta = cartaAleatoriaPorRareza(rareza);
      if (carta) nuevasCartas.push(carta);
      else {
        // fallback: carta común random
        nuevasCartas.push(
          cartasDisponibles.find((c) => c.rareza === "Común") || cartasDisponibles[0]
        );
      }
    }
    setCartasAbrir(nuevasCartas);

    setTimeout(() => {
      setColeccion((prev) => [...prev, ...nuevasCartas]);
      setAbriendoSobre(false);
      alert("¡Abriste un sobre y obtuviste 5 cartas!");
    }, 2000);
  };

  const contarCopias = () => {
    const conteo = {};
    coleccion.forEach((carta) => {
      conteo[carta.nombre] = (conteo[carta.nombre] || 0) + 1;
    });
    return conteo;
  };
  const conteo = contarCopias();

  const propuestasRecibidas = propuestas.filter((p) => p.destino === usuarioActual);
  const propuestasEnviadas = propuestas.filter((p) => p.origen === usuarioActual);

  // Intercambio funciones...

  const enviarPropuesta = () => {
    if (!cartaOfrecida || !cartaDeseada) {
      alert("Seleccioná la carta que ofrecés y la que querés");
      return;
    }
    if (!coleccion.find((c) => c.nombre === cartaOfrecida)) {
      alert("No tenés esa carta para ofrecer");
      return;
    }
    setPropuestas([
      ...propuestas,
      {
        id: Date.now(),
        origen: usuarioActual,
        destino: jugadorDestino,
        cartaOfrecida,
        cartaDeseada,
        estado: "pendiente",
      },
    ]);
    alert("¡Propuesta enviada con éxito!");
    setCartaOfrecida(null);
    setCartaDeseada(null);
  };

  const aceptarPropuesta = (id) => {
    const propuesta = propuestas.find((p) => p.id === id);
    if (!propuesta) return;

    if (!coleccion.find((c) => c.nombre === propuesta.cartaDeseada)) {
      alert("No tenés la carta requerida para hacer el intercambio.");
      return;
    }

    const nuevaColeccionActual = coleccion
      .filter((c) => c.nombre !== propuesta.cartaDeseada)
      .concat(cartasDisponibles.find((c) => c.nombre === propuesta.cartaOfrecida));
    setColeccion(nuevaColeccionActual);

    const coleccionOrigenStr = localStorage.getItem(`coleccion_${propuesta.origen}`);
    let coleccionOrigen = coleccionOrigenStr ? JSON.parse(coleccionOrigenStr) : [];

    coleccionOrigen = coleccionOrigen
      .filter((c) => c.nombre !== propuesta.cartaOfrecida)
      .concat(cartasDisponibles.find((c) => c.nombre === propuesta.cartaDeseada));

    localStorage.setItem(`coleccion_${propuesta.origen}`, JSON.stringify(coleccionOrigen));

    setPropuestas((prevPropuestas) =>
      prevPropuestas.map((p) =>
        p.id === id ? { ...p, estado: "aceptada" } : p
      )
    );

    alert("✅ Intercambio realizado con éxito");
  };

  const rechazarPropuesta = (id) => {
    setPropuestas((prevPropuestas) =>
      prevPropuestas.map((p) => (p.id === id ? { ...p, estado: "rechazada" } : p))
    );
    alert("❌ Propuesta rechazada");
  };

  // Datos para perfil
  const numCartas = coleccion.length;
  const numAmigos = jugadores.length - 1;
  const logros = []; // Podés agregar logros reales si querés

  // Render perfil modal
  const PerfilModal = () => (
    <div
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 1000,
      }}
      onClick={() => setPerfilAbierto(false)}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 10,
          width: 300,
          position: "relative",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Perfil: {usuarioActual}</h2>
        <p><b>Logros:</b></p>
        {logros.length === 0 ? (
          <p>No tenés insignias aún.</p>
        ) : (
          <ul>{logros.map((l, i) => <li key={i}>{l}</li>)}</ul>
        )}
        <p><b>Amigos:</b> {numAmigos}</p>
        <p><b>Número de cartas:</b> {numCartas}</p>
        <button onClick={() => setPerfilAbierto(false)}>Cerrar</button>
      </div>
    </div>
  );

  if (pantalla === "intercambio") {
    // Render interfaz de intercambio (puedes adaptar la que ya tienes)
    return (
      <div style={{ padding: "1rem" }}>
        <button onClick={() => setPantalla("principal")} style={{ marginBottom: 16 }}>
          ← Volver a sobres
        </button>

        <h2>Intercambio de cartas</h2>

        {/* Aquí tu código de intercambio: selección, propuestas, aceptar, rechazar */}
        {/* Reutilizo parte del código intercambio abajo */}

        <label>
          A jugador:
          <select
            value={jugadorDestino}
            onChange={(e) => setJugadorDestino(e.target.value)}
          >
            {jugadores
              .filter((j) => j.id !== usuarioActual)
              .map((j) => (
                <option key={j.id} value={j.id}>
                  {j.nombre}
                </option>
              ))}
          </select>
        </label>
        <br />
        <label>
          Carta que ofrecés:
          <select
            value={cartaOfrecida || ""}
            onChange={(e) => setCartaOfrecida(e.target.value)}
          >
            <option value="">--Elegí--</option>
            {Object.entries(conteo).map(([nombre, cantidad]) => (
              <option key={nombre} value={nombre}>
                {nombre} (x{cantidad})
              </option>
            ))}
          </select>
        </label>
        <br />
        <label>
          Carta que querés:
          <select
            value={cartaDeseada || ""}
            onChange={(e) => setCartaDeseada(e.target.value)}
          >
            <option value="">--Elegí--</option>
            {cartasDisponibles.map((c) => (
              <option key={c.nombre} value={c.nombre}>
                {c.nombre}
              </option>
            ))}
          </select>
        </label>
        <br />
        <button onClick={enviarPropuesta}>Enviar propuesta</button>

        <div style={{ marginTop: 16 }}>
          <h3>Propuestas recibidas</h3>
          {propuestasRecibidas.length === 0 && <p>No hay propuestas recibidas.</p>}
          {propuestasRecibidas.map((p) => {
            const cartaOfrecidaObj = cartasDisponibles.find((c) => c.nombre === p.cartaOfrecida);
            const cartaDeseadaObj = cartasDisponibles.find((c) => c.nombre === p.cartaDeseada);
            return (
              <div key={p.id} style={{ marginBottom: "0.5rem", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem" }}>
                <b>{p.origen}</b> te propone:
                <br />
                <img
                  src={cartaOfrecidaObj.imagen}
                  alt={p.cartaOfrecida}
                  width={40}
                  className={
                    cartaOfrecidaObj.rareza === "Legendaria" || cartaOfrecidaObj.rareza === "Mítica"
                      ? "brillo"
                      : ""
                  }
                  style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                />
                Te da <b>{p.cartaOfrecida}</b> por
                <img
                  src={cartaDeseadaObj.imagen}
                  alt={p.cartaDeseada}
                  width={40}
                  className={
                    cartaDeseadaObj.rareza === "Legendaria" || cartaDeseadaObj.rareza === "Mítica"
                      ? "brillo"
                      : ""
                  }
                  style={{ verticalAlign: "middle", marginLeft: "0.5rem", marginRight: "0.5rem" }}
                />
                <b>{p.cartaDeseada}</b>.
                <br />
                Estado: {p.estado}
                {p.estado === "pendiente" && (
                  <>
                    <button onClick={() => aceptarPropuesta(p.id)} style={{ marginRight: "0.5rem" }}>
                      Aceptar
                    </button>
                    <button onClick={() => rechazarPropuesta(p.id)}>Rechazar</button>
                  </>
                )}
              </div>
            );
          })}
        </div>

        <div style={{ marginTop: 16 }}>
          <h3>Propuestas enviadas</h3>
          {propuestasEnviadas.length === 0 && <p>No hay propuestas enviadas.</p>}
          {propuestasEnviadas.map((p) => {
            const cartaOfrecidaObj = cartasDisponibles.find((c) => c.nombre === p.cartaOfrecida);
            const cartaDeseadaObj = cartasDisponibles.find((c) => c.nombre === p.cartaDeseada);
            return (
              <div key={p.id} style={{ marginBottom: "0.5rem", borderBottom: "1px solid #ddd", paddingBottom: "0.5rem" }}>
                Propuesta a <b>{p.destino}</b>:
                <br />
                <img
                  src={cartaOfrecidaObj.imagen}
                  alt={p.cartaOfrecida}
                  width={40}
                  className={
                    cartaOfrecidaObj.rareza === "Legendaria" || cartaOfrecidaObj.rareza === "Mítica"
                      ? "brillo"
                      : ""
                  }
                  style={{ verticalAlign: "middle", marginRight: "0.5rem" }}
                />
                Ofrecés <b>{p.cartaOfrecida}</b> por
                <img
                  src={cartaDeseadaObj.imagen}
                  alt={p.cartaDeseada}
                  width={40}
                  className={
                    cartaDeseadaObj.rareza === "Legendaria" || cartaDeseadaObj.rareza === "Mítica"
                      ? "brillo"
                      : ""
                  }
                  style={{ verticalAlign: "middle", marginLeft: "0.5rem", marginRight: "0.5rem" }}
                />
                <b>{p.cartaDeseada}</b>.
                <br />
                Estado: {p.estado}
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Pantalla principal (sobres + botones)
  return (
    <div style={{ padding: "1rem", position: "relative" }}>
      {/* Botón perfil arriba a la derecha */}
      <button
        onClick={() => setPerfilAbierto(true)}
        style={{
          position: "fixed",
          top: 10,
          right: 10,
          borderRadius: "50%",
          width: 50,
          height: 50,
          backgroundImage: `url(${process.env.PUBLIC_URL + "/imagene/carta/" + usuarioActual.toLowerCase()}.png)`,
          backgroundSize: "cover",
          border: "2px solid #333",
          cursor: "pointer",
        }}
        title="Ver perfil"
      />

      <h2>Bienvenido, {usuarioActual}!</h2>

      <div style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
        <h3>Elegí un sobre para abrir</h3>
        <button onClick={abrirSobre} disabled={abriendoSobre}>
          {abriendoSobre ? "Abriendo..." : "Abrir sobre (5 cartas)"}
        </button>

        {cartasAbrir.length > 0 && (
          <div style={{ marginTop: "1rem", display: "flex", gap: "1rem", justifyContent: "center" }}>
            {cartasAbrir.map((carta, i) => (
              <div key={i} className={`card ${["Legendaria", "Mítica"].includes(carta.rareza) ? "brillo" : ""}`} style={{ width: 100 }}>
                <img src={carta.imagen} alt={carta.nombre} style={{ width: "100%", borderRadius: 8 }} />
                <div><b>{carta.nombre}</b></div>
                <div style={{ fontSize: "0.8em", color: "#666" }}>{carta.rareza}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button onClick={() => setPantalla("intercambio")} style={{ display: "block", margin: "0 auto", padding: "0.5rem 1rem" }}>
        Ir a intercambio
      </button>

      {perfilAbierto && <PerfilModal />}
    </div>
  );
}

export default App;
