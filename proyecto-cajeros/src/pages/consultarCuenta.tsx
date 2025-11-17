import { useState } from "react";
import "../styles/consultarCuenta.css";

function ConsultarCuenta() {
  const [numeroCuenta, setNumeroCuenta] = useState("");
  const [tipoCuenta, setTipoCuenta] = useState("Ahorros");

 
  const [datos, setDatos] = useState({
    nombre: "-",
    identificacion: "-",
    saldo: "-",
    estado: "-",
  });

  
  const buscarCuenta = async () => {
    if (numeroCuenta.length !== 10) {
      alert("El número de cuenta debe tener exactamente 10 dígitos.");
      return;
    }

    try {
      const response = await fetch(
        `/api/cuentas/consultar?numero=${numeroCuenta}&tipo=${tipoCuenta}`
      );

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || "Error al consultar la cuenta");
      }

      const data = await response.json();

      setDatos({
        nombre: data.nombreCliente || "-",
        identificacion: data.identificacion || "-",
        saldo: data.saldoDisponible || "-",
        estado: data.estadoCuenta || "-",
      });
    } catch (error: any) {
      alert(`No se pudo consultar la cuenta: ${error.message || error}`);
    
      setDatos({ nombre: "-", identificacion: "-", saldo: "-", estado: "-" });
    }
  };


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

       
          <div className="campo">
            <label htmlFor="consulta-numero">Número de cuenta</label>
            <input
              id="consulta-numero"
              type="text"
              maxLength={10}
              value={numeroCuenta}
              onChange={(e) => {
                const soloNumeros = e.target.value.replaceAll(/\D/g, "");
                setNumeroCuenta(soloNumeros);
              }}
              placeholder="Ej. 1234567890"
            />
          </div>

    
          <div className="campo">
            <label htmlFor="consulta-tipo">Tipo de cuenta</label>
            <select
              id="consulta-tipo"
              value={tipoCuenta}
              onChange={(e) => setTipoCuenta(e.target.value)}
            >
              <option value="Ahorros">Ahorros</option>
              <option value="Corriente">Corriente</option>
              <option value="Plazo Fijo">Plazo fijo</option>
            </select>
          </div>
        </div>

    
        <div className="consultar-buttons">
          <button className="btn-buscar" onClick={buscarCuenta}>
            Buscar cuenta
          </button>

          <button className="btn-limpiar" onClick={limpiar}>
            Limpiar
          </button>
        </div>

        <hr className="consultar-divider" />


        <h3 className="consultar-subtitle">Datos del titular</h3>
        <p className="consultar-desc">
         
        </p>

        <div className="consultar-resultados">
          <div>
            <label htmlFor="consulta-nombre">Nombre del cliente</label>
            <input id="consulta-nombre" type="text" value={datos.nombre} disabled />
          </div>

          <div>
            <label htmlFor="consulta-id">Identificación</label>
            <input id="consulta-id" type="text" value={datos.identificacion} disabled />
          </div>

          <div>
            <label htmlFor="consulta-saldo">Saldo disponible</label>
            <input id="consulta-saldo" type="text" value={datos.saldo} disabled />
          </div>

          <div>
            <label htmlFor="consulta-estado">Estado de la cuenta</label>
            <input id="consulta-estado" type="text" value={datos.estado} disabled />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConsultarCuenta;
