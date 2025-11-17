import { useMemo, useState } from "react";
import "../styles/retiros.css";
import type { Denominacion } from "../services/apiVentanilla";
import { registrarTransaccion, sumaDenominaciones } from "../services/apiVentanilla";
import { getCodigoTurnoActivo } from "../services/turnoStore";

function Retiros() {
  const [cuenta, setCuenta] = useState("");
  const [monto, setMonto] = useState("");

  const [confirmacion, setConfirmacion] = useState<null | {
    cuenta: string;
    monto: string;
    estadoCore?: string;
    mensajeCore?: string;
  }>(null);
  const [denoms, setDenoms] = useState<Denominacion[]>([
    { billete: 20, cantidad: 0 },
    { billete: 10, cantidad: 0 },
    { billete: 5, cantidad: 0 },
    { billete: 1, cantidad: 0 },
  ]);
  const montoDenoms = useMemo(()=> sumaDenominaciones(denoms), [denoms]);

  const onChangeDenom = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value || '0';
    const val = Math.max(0, Number.parseInt(raw));
    setDenoms(prev => {
      const copy = [...prev];
      const curr = copy[index];
      copy[index] = { ...curr, cantidad: val };
      return copy;
    });
  };

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
      alert("El monto a retirar debe ser mayor a cero.");
      return;
    }
    if (Math.abs(montoDenoms - montoNum) > 0.001) {
      alert(`El monto (${montoNum.toFixed(2)}) debe coincidir con las denominaciones (${montoDenoms.toFixed(2)}).`);
      return;
    }

    try {
      const res: any = await registrarTransaccion({
        codigoTurnoActivo: codigoTurno,
        tipoTransaccion: "RETIRO",
        montoTotal: montoNum,
        cuentaReferencia: cuenta,
        denominaciones: denoms,
      });
      setConfirmacion({ cuenta, monto, estadoCore: res?.estadoCore, mensajeCore: res?.mensajeCore });
    } catch (err: any) {
      alert(`Error al registrar retiro: ${err.message}`);
    }
  };

  const cancelar = () => {
    setCuenta("");
    setMonto("");
    setConfirmacion(null);
    setDenoms([
      { billete: 20, cantidad: 0 },
      { billete: 10, cantidad: 0 },
      { billete: 5, cantidad: 0 },
      { billete: 1, cantidad: 0 },
    ]);
  };

  return (
    <>
     
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
              <label htmlFor="retiro-cuenta">Número de cuenta</label>
              <input
                id="retiro-cuenta"
                type="text"
                maxLength={12}
                value={cuenta}
                onChange={(e) => {
                  if (/^\d*$/.test(e.target.value) && e.target.value.length <= 12) setCuenta(e.target.value);
                }}
                placeholder="Ej. 123456789012"
              />
            </div>

            <div className="retiro-group">
              <label htmlFor="retiro-monto">Monto a retirar</label>
              <input
                id="retiro-monto"
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

          <div className="retiro-summary" style={{ marginTop: 12 }}>
            <h3>Denominaciones entregadas</h3>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {denoms.map((d, i)=> (
                <div key={d.billete}>
                  <label htmlFor={`retiro-den-${d.billete}`}>${d.billete}</label>
                  <input id={`retiro-den-${d.billete}`} type="number" min={0} value={d.cantidad} onChange={onChangeDenom(i)} />
                </div>
              ))}
            </div>
            <p style={{ marginTop: 8 }}><strong>Total por denominaciones:</strong> ${montoDenoms.toFixed(2)}</p>
          </div>

          {confirmacion && (
            <div className="retiro-summary">
              <h3>Retiro registrado</h3>
              <p>
                <strong>Número de cuenta:</strong> {confirmacion.cuenta}
              </p>
              <p>
                <strong>Monto retirado:</strong>{" "}
                {"$" + Number.parseFloat(confirmacion.monto).toFixed(2)}
              </p>
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
    </>
  );
}

export default Retiros;
