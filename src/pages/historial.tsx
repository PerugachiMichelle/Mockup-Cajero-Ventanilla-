import { useState } from "react";
import "../styles/historial.css";

type Movimiento = {
  fecha: string;
  hora: string;
  tipo: string;
  monto: number;
  saldo: number;
  cajero: string;
};

function Historial() {
  const [cuenta, setCuenta] = useState("");
  const [desde, setDesde] = useState("");
  const [hasta, setHasta] = useState("");

  // 👇 Al inicio NO hay movimientos
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);

  // Solo números, máximo 10 dígitos
  const handleCuentaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setCuenta(value);
    }
  };

  // 👉 Función FRONT: solo valida y carga MOCK
  const buscarMovimientos = () => {
    if (cuenta.length !== 10) {
      alert("El número de cuenta debe tener exactamente 10 dígitos.");
      return;
    }

    // Aquí tus amigos luego llamarán al backend
    // fetch(`/api/historial?cuenta=${cuenta}&desde=${desde}&hasta=${hasta}`)

    // 🟡 Por ahora: datos de ejemplo (mock)
    const mock: Movimiento[] = [
      {
        fecha: "2025-11-07",
        hora: "10:23",
        tipo: "Depósito",
        monto: 150.0,
        saldo: 1250.0,
        cajero: "SR",
      },
    ];

    setMovimientos(mock);
  };

  // 👉 Limpiar filtro + limpiar tabla
  const limpiar = () => {
    setCuenta("");
    setDesde("");
    setHasta("");
    setMovimientos([]); // ← importante
  };

  return (
    <>
      {/* HEADER SUPERIOR (ya se monta dentro de PanelLayout) */}
      <header className="panel-header">
        <div className="panel-header-title">Historial de transacciones</div>
        <div className="panel-header-info">
          Sucursal: Quito Norte · Cajero: Michelle Ruiz
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="panel-content">
        <div className="historial-container">
          <div className="historial-title">Filtros de búsqueda</div>
          <div className="historial-subtitle">
            Defina cuenta y rango de fechas para obtener el historial.
          </div>

          {/* FORMULARIO */}
          <div className="form-row">
            <div className="form-group">
              <label>Número de cuenta</label>
              <input
                type="text"
                className="input"
                placeholder="Ej. 1234567890"
                value={cuenta}
                onChange={handleCuentaChange}
                maxLength={10}
              />
            </div>

            <div className="form-group">
              <label>Desde</label>
              <input
                type="date"
                className="date-input"
                value={desde}
                onChange={(e) => setDesde(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Hasta</label>
              <input
                type="date"
                className="date-input"
                value={hasta}
                onChange={(e) => setHasta(e.target.value)}
              />
            </div>
          </div>

          {/* BOTONES */}
          <div className="btn-row">
            <button className="btn-primary" onClick={buscarMovimientos}>
              Buscar
            </button>
            <button className="btn-secondary" onClick={limpiar}>
              Limpiador
            </button>
          </div>

          {/* TABLA RESULTADOS */}
          <div className="historial-table-container">
            <table className="historial-table">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Hora</th>
                  <th>Tipo</th>
                  <th>Monto</th>
                  <th>Saldo resultante</th>
                  <th>Cajero</th>
                </tr>
              </thead>

              <tbody>
                {movimientos.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: "center", padding: "16px" }}>
                      No hay movimientos todavía. Ingrese los filtros y presione{" "}
                      <strong>Buscar</strong>.
                    </td>
                  </tr>
                ) : (
                  movimientos.map((mov, index) => (
                    <tr key={index}>
                      <td>{mov.fecha}</td>
                      <td>{mov.hora}</td>
                      <td>{mov.tipo}</td>
                      <td>{mov.monto.toFixed(2)}</td>
                      <td>{mov.saldo.toLocaleString()}</td>
                      <td>{mov.cajero}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}

export default Historial;
