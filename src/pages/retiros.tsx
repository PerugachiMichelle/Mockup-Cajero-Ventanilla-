import { useState } from "react";
import "../styles/retiros.css";

function Retiros() {
  const [cuenta, setCuenta] = useState("");
  const [monto, setMonto] = useState("");

  const [confirmacion, setConfirmacion] = useState<null | {
    cuenta: string;
    monto: string;
  }>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!/^\d{10}$/.test(cuenta)) {
      alert("El número de cuenta debe tener exactamente 10 dígitos.");
      return;
    }

    if (parseFloat(monto) <= 0) {
      alert("El monto a retirar debe ser mayor a cero.");
      return;
    }

    setConfirmacion({ cuenta, monto });

    console.log("RETIRO ENVIADO AL BACKEND (mock):", { cuenta, monto });
  };

  const cancelar = () => {
    setCuenta("");
    setMonto("");
    setConfirmacion(null);
  };

  return (
    <>
      {/* Respeta las clases que tu CSS necesita */}
      <div className="retiro-container">
        <h2 className="retiro-title">Registrar retiro</h2>
        <p className="retiro-subtitle">
          Registro de salida de efectivo desde la cuenta del cliente.
        </p>

        <div className="retiro-card">
          <h3 className="retiro-section-title">Datos de la operación</h3>
          <p className="retiro-description">
            Verifique el saldo disponible antes de confirmar el retiro.
          </p>

          <form className="retiro-form" onSubmit={handleSubmit}>
            <div className="retiro-group">
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

            <div className="retiro-group">
              <label>Monto a retirar</label>
              <input
                type="number"
                step="0.01"
                value={monto}
                onChange={(e) => setMonto(e.target.value)}
                placeholder="0.00"
              />
            </div>

            <div className="retiro-buttons">
              <button type="submit" className="btn-retirar">
                Confirmar retiro
              </button>
              <button type="button" className="btn-cancelar" onClick={cancelar}>
                Cancelar
              </button>
            </div>
          </form>

          {confirmacion && (
            <div className="retiro-summary">
              <h3>Retiro registrado</h3>
              <p>
                <strong>Número de cuenta:</strong> {confirmacion.cuenta}
              </p>
              <p>
                <strong>Monto retirado:</strong>{" "}
                {"$" + parseFloat(confirmacion.monto).toFixed(2)}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Retiros;
