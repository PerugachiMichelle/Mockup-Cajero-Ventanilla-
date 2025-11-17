import { useMemo, useState } from "react";
import "../styles/depositos.css";
import type { Denominacion } from "../services/apiVentanilla";
import { registrarTransaccion, sumaDenominaciones } from "../services/apiVentanilla";
import { getCodigoTurnoActivo } from "../services/turnoStore";

function Depositos() {
  const [cuenta, setCuenta] = useState("");
  const [monto, setMonto] = useState("");
  const [medio, setMedio] = useState("Efectivo");
  const [detalle, setDetalle] = useState("");
  const [denoms, setDenoms] = useState<Denominacion[]>([
    { billete: 20, cantidad: 0 },
    { billete: 10, cantidad: 0 },
    { billete: 5, cantidad: 0 },
    { billete: 1, cantidad: 0 },
  ]);
  const montoDenoms = useMemo(()=> sumaDenominaciones(denoms), [denoms]);

  const [confirmacion, setConfirmacion] = useState<null | {
    cuenta: string;
    monto: string;
    medio: string;
    detalle: string;
    estadoCore?: string;
    mensajeCore?: string;
  }>(null);

  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const codigoTurno = getCodigoTurnoActivo();
    if (!codigoTurno) {
      alert("No hay turno activo. Abra un turno en el Panel.");
      return;
    }

   
    if (!/^\d{12}$/.test(cuenta)) {
      alert("El número de cuenta debe tener exactamente 12 dígitos.");
      return;
    }
    const montoNum = Number.parseFloat(monto || "0");
    if (montoNum <= 0) {
      alert("El monto debe ser mayor a cero.");
      return;
    }
    if (Math.abs(montoDenoms - montoNum) > 0.001) {
      alert(`El monto (${montoNum.toFixed(2)}) debe coincidir con las denominaciones (${montoDenoms.toFixed(2)}).`);
      return;
    }

    try {
      const res: any = await registrarTransaccion({
        codigoTurnoActivo: codigoTurno,
        tipoTransaccion: "DEPOSITO",
        montoTotal: montoNum,
        cuentaReferencia: cuenta,
        denominaciones: denoms,
      });
      setConfirmacion({ cuenta, monto, medio, detalle, estadoCore: res?.estadoCore, mensajeCore: res?.mensajeCore });
    } catch (err: any) {
      alert(`Error al registrar depósito: ${err.message}`);
    }
  };

 
  const cancelar = () => {
    setCuenta("");
    setMonto("");
    setMedio("Efectivo");
    setDetalle("");
    setConfirmacion(null);
    setDenoms([
      { billete: 20, cantidad: 0 },
      { billete: 10, cantidad: 0 },
      { billete: 5, cantidad: 0 },
      { billete: 1, cantidad: 0 },
    ]);
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
    
          <div className="form-group">
            <label htmlFor="dep-cuenta">Número de cuenta</label>
            <input
              id="dep-cuenta"
              type="text"
              maxLength={12}
              value={cuenta}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 12) setCuenta(e.target.value);
              }}
              placeholder="Ej. 123456789012"
            />
          </div>

     
          <div className="form-group">
            <label htmlFor="dep-monto">Monto a depositar</label>
            <input
              id="dep-monto"
              type="number"
              step="0.01"
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              placeholder="0.00"
            />
          </div>

  
          <div className="form-group">
            <label htmlFor="dep-medio">Medio de depósito</label>
            <select id="dep-medio" value={medio} onChange={(e) => setMedio(e.target.value)}>
              <option value="Efectivo">Efectivo</option>
              <option value="Cheque">Cheque</option>
            </select>
          </div>

          <div className="form-group textarea-group">
            <label htmlFor="dep-detalle">Detalle / Observación</label>
            <textarea
              id="dep-detalle"
              rows={3}
              value={detalle}
              onChange={(e) => setDetalle(e.target.value)}
              placeholder="Ej. Depósito ventanilla - cédula cliente"
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

          <div className="deposit-summary" style={{ marginTop: 12 }}>
          <h3>Denominaciones recibidas</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {denoms.map((d, i)=> (
              <div key={d.billete}>
                <label htmlFor={`deposito-den-${d.billete}`}>${d.billete}</label>
                <input id={`deposito-den-${d.billete}`} type="number" min={0} value={d.cantidad} onChange={(e)=>{
                  const val = Math.max(0, Number.parseInt(e.target.value || '0'));
                  setDenoms(prev => {
                    const copy = [...prev];
                    const curr = copy[i];
                    copy[i] = { ...curr, cantidad: val };
                    return copy;
                  });
                }} />
              </div>
            ))}
          </div>
          <p style={{ marginTop: 8 }}><strong>Total por denominaciones:</strong> ${montoDenoms.toFixed(2)}</p>
        </div>

        {confirmacion && (
          <div className="deposit-summary">
            <h3>Depósito registrado</h3>

            <p><strong>Número de cuenta:</strong> {confirmacion.cuenta}</p>
            <p><strong>Monto:</strong> ${Number.parseFloat(confirmacion.monto).toFixed(2)}</p>
            <p><strong>Medio de depósito:</strong> {confirmacion.medio}</p>
            <p><strong>Detalle:</strong> {confirmacion.detalle || "N/A"}</p>
            {confirmacion.estadoCore && (
              <>
                <p><strong>Estado CORE:</strong> {confirmacion.estadoCore}</p>
                <p><strong>Mensaje CORE:</strong> {confirmacion.mensajeCore || ""}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Depositos;
