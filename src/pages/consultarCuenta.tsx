import { useState } from "react";
import "../styles/consultarCuenta.css";

function ConsultarCuenta() {
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("Ahorros");

  // Datos que regresarán del backend (mock por ahora)
  const [datos, setDatos] = useState({
    nombre: "-",
    identificacion: "-",
    saldo: "-",
    estado: "-",
  });

  // ==========================================================
  // FUNCIÓN LISTA PARA CONECTARSE CON EL BACKEND
  // ==========================================================
  const buscarCuenta = async () => {
    if (numeroCuenta.length !== 10) {
      alert("El número de cuenta debe tener exactamente 10 dígitos.");
      return;
    }

    try {
      // 🔵 Cuando tus compañeros hagan la API,
      //    solo reemplazan esta URL:
      const response = await fetch(
        `http://localhost:3000/api/cuentas/consultar?numero=${numeroCuenta}&tipo=${tipoCuenta}`
      );

      if (!response.ok) {
        throw new Error("Error al consultar la cuenta");
      }

      const data = await response.json();

      // 🔵 Actualizar datos en pantalla
      setDatos({
        nombre: data.nombreCliente || "-",
        identificacion: data.identificacion || "-",
        saldo: data.saldoDisponible || "-",
        estado: data.estadoCuenta || "-",
      });
    } catch (error) {
      console.log(error);

      // 🟡 Mock temporal mientras backend no existe
      alert("Backend no disponible, cargando datos de prueba…");

      setDatos({
        nombre: "Juan Pérez",
        identificacion: "0912345678",
        saldo: "$1,250.00",
        estado: "Activa",
      });
    }
  };

  // ==========================================================
  // LIMPIAR FORMULARIO
  // ==========================================================
  const limpiar = () => {
    setNumeroCuenta("");
    setTipoCuenta("Ahorros");
    setDatos({
      nombre: "-",
      identificacion: "-",
      saldo: "-",
      estado: "-",
    });
  };

  return (
    <div className="consultar-container">

      <header className="consultar-header">
        <h2>Consultar cuenta</h2>
        <p>Consulta de datos del cliente y saldos de la cuenta.</p>
      </header>

      <div className="consultar-box">
        <h3 className="consultar-subtitle">Búsqueda de cuenta</h3>

        <p className="consultar-desc">
          Ingrese el número de cuenta del cliente que desea consultar.
        </p>

        <div className="consultar-form">

          {/* Número de Cuenta */}
          <div className="campo">
            <label>Número de cuenta</label>
            <input
              type="text"
              maxLength={10}
              value={numeroCuenta}
              onChange={(e) => {
                const soloNumeros = e.target.value.replace(/[^0-9]/g, "");
                setNumeroCuenta(soloNumeros);
              }}
              placeholder="Ej. 1234567890"
            />
          </div>

          {/* Tipo de cuenta */}
          <div className="campo">
            <label>Tipo de cuenta</label>
            <select
              value={tipoCuenta}
              onChange={(e) => setTipoCuenta(e.target.value)}
            >
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
              <option value="Plazo Fijo">Plazo fijo</option>
            </select>
          </div>
        </div>

        {/* Botones */}
        <div className="consultar-buttons">
          <button className="btn-buscar" onClick={buscarCuenta}>
            Buscar cuenta
          </button>

          <button className="btn-limpiar" onClick={limpiar}>
            Limpiar
          </button>
        </div>

        <hr className="consultar-divider" />

        {/* Datos del titular */}
        <h3 className="consultar-subtitle">Datos del titular</h3>
        <p className="consultar-desc">
          Información traída desde la base de datos (mockup por ahora).
        </p>

        <div className="consultar-resultados">
          <div>
            <label>Nombre del cliente</label>
            <input type="text" value={datos.nombre} disabled />
          </div>

          <div>
            <label>Identificación</label>
            <input type="text" value={datos.identificacion} disabled />
          </div>

          <div>
            <label>Saldo disponible</label>
            <input type="text" value={datos.saldo} disabled />
          </div>

          <div>
            <label>Estado de la cuenta</label>
            <input type="text" value={datos.estado} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultarCuenta;
