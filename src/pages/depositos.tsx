import { useState } from "react";
import "../styles/depositos.css";

function Depositos() {
  const [cuenta, setCuenta] = useState("");
  const [monto, setMonto] = useState("");
  const [medio, setMedio] = useState("Efectivo");
  const [detalle, setDetalle] = useState("");

  // Estado para mostrar el resumen del depósito
  const [confirmacion, setConfirmacion] = useState<null | {
    cuenta: string;
    monto: string;
    medio: string;
    detalle: string;
  }>(null);

  // FUNCIÓN PARA VALIDAR Y "REGISTRAR" DEPÓSITO
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validar cuenta
    if (!/^\d{10}$/.test(cuenta)) {
      alert("El número de cuenta debe tener exactamente 10 dígitos.");
      return;
    }

    // Validar monto
    if (parseFloat(monto) <= 0) {
      alert("El monto debe ser mayor a cero.");
      return;
    }

    // Crear objeto para mostrar abajo
    setConfirmacion({
      cuenta,
      monto,
      medio,
      detalle,
    });

    // Aquí se llamará al backend (solo preparado)
    console.log("DEPÓSITO ENVIADO AL BACKEND:", {
      cuenta,
      monto,
      medio,
      detalle,
    });
  };

  // FUNCIÓN PARA CANCELAR → solo limpia, NO navega
  const cancelar = () => {
    setCuenta("");
    setMonto("");
    setMedio("Efectivo");
    setDetalle("");
    setConfirmacion(null);
  };

  return (
    <div className="deposit-container">
      <h2 className="deposit-title">Registrar depósito</h2>
      <p className="deposit-subtitle">
        Registro de ingreso de efectivo o cheques en cuentas del cliente.
      </p>

      <div className="deposit-card">
        <h3 className="deposit-section-title">Datos de la operación</h3>
        <p className="deposit-description">
          Complete la información del depósito antes de confirmar.
        </p>

        <form className="deposit-form" onSubmit={handleSubmit}>
          {/* Número de cuenta */}
          <div className="form-group">
            <label>Número de cuenta</label>
            <input
              type="text"
              maxLength={10}
              value={cuenta}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value)) setCuenta(e.target.value);
              }}
              placeholder="Ej. 1234567890"
            />
          </div>

          {/* Monto */}
          <div className="form-group">
            <label>Monto a depositar</label>
            <input
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
            />
          </div>

          {/* Medio */}
          <div className="form-group">
            <label>Medio de depósito</label>
            <select value={medio} onChange={(e) => setMedio(e.target.value)}>
              <option value="Efectivo">Efectivo</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          {/* Detalle */}
          <div className="form-group textarea-group">
            <label>Detalle / Observación</label>
            <textarea
              rows={3}
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Ej. Depósito ventanilla - cliente presenta cédula"
            />
          </div>

          <div className="form-buttons">
            <button type="submit" className="btn-primary">
              Confirmar depósito
            </button>
            <button type="button" className="btn-secondary" onClick={cancelar}>
              Cancelar
            </button>
          </div>
        </form>

        {confirmacion && (
          <div className="deposit-summary">
            <h3>Depósito registrado</h3>

            <p><strong>Número de cuenta:</strong> {confirmacion.cuenta}</p>
            <p><strong>Monto:</strong> ${parseFloat(confirmacion.monto).toFixed(2)}</p>
            <p><strong>Medio de depósito:</strong> {confirmacion.medio}</p>
            <p><strong>Detalle:</strong> {confirmacion.detalle || "N/A"}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Depositos;
