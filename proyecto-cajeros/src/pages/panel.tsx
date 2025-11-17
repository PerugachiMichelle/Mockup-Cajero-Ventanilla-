import "../styles/panel.css";
import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  abrirTurno,
  cerrarTurno,
  sumaDenominaciones,
} from "../services/apiVentanilla";
import type { Denominacion } from "../services/apiVentanilla";
import { setCodigoTurnoActivo, getCodigoTurnoActivo, clearCodigoTurnoActivo } from "../services/turnoStore";

function Panel() {

  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  
  const [codigoCaja, setCodigoCaja] = useState("VENT-01");
  const [codigoCajero, setCodigoCajero] = useState("jperez");
  const [contrasenia, setContrasenia] = useState("");
  const [fechaTurno, setFechaTurno] = useState<string>(() => {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}${m}${day}`;
  });
  const [denomsInicio, setDenomsInicio] = useState<Denominacion[]>([
    { billete: 20, cantidad: 0 },
    { billete: 10, cantidad: 0 },
    { billete: 5, cantidad: 0 },
    { billete: 1, cantidad: 0 },
  ]);
  const montoInicialCalc = useMemo(() => sumaDenominaciones(denomsInicio), [denomsInicio]);

  const codigoTurno = useMemo(() => `${codigoCaja}-${codigoCajero}-${fechaTurno}`, [codigoCaja, codigoCajero, fechaTurno]);
  const codigoTurnoStore = getCodigoTurnoActivo();

  const actualizarDenom = (index: number, cantidad: number) => {
    setDenomsInicio((prev) => prev.map((d, i) => i === index ? { ...d, cantidad } : d));
  };

  const onAbrirTurno = async () => {
    setLoading(true); setError(null); setResultado(null);
    try {
    
      const payload = {
        codigoCaja: codigoCaja,
        codigoCajero: codigoCajero,
        contrasenia,
        montoInicial: montoInicialCalc,
        denominacionesIniciales: denomsInicio,
      };
      const res: any = await abrirTurno(payload);
   
      if (res?.codigoTurno) setCodigoTurnoActivo(res.codigoTurno);
      
      const { contrasenia: _omit, ...safe } = (res || {});
      setResultado(safe);
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

 
  const [denomsFin, setDenomsFin] = useState<Denominacion[]>([
    { billete: 20, cantidad: 0 },
    { billete: 10, cantidad: 0 },
    { billete: 5, cantidad: 0 },
    { billete: 1, cantidad: 0 },
  ]);
  const montoFinalCalc = useMemo(() => sumaDenominaciones(denomsFin), [denomsFin]);
  const actualizarDenomFin = (index: number, cantidad: number) => {
    setDenomsFin((prev) => prev.map((d, i) => i === index ? { ...d, cantidad } : d));
  };
  const [codigoTurnoCerrar, setCodigoTurnoCerrar] = useState<string>(codigoTurnoStore || codigoTurno);

  const onCerrarTurno = async () => {
    if (!codigoTurnoCerrar) { setError("No hay código de turno para cerrar"); return; }
    setLoading(true); setError(null); setResultado(null);
    try {
      const payload = {
        codigoTurnoACerrar: codigoTurnoCerrar,
        montoFinal: montoFinalCalc,
        denominacionesFinales: denomsFin,
      };
      const res: any = await cerrarTurno(payload);
      clearCodigoTurnoActivo();
      const { contrasenia: _omit2, ...safe } = (res || {});
      setResultado(safe);
    } catch (e: any) {
      setError(e.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="panel-main">
      
  
      <header className="panel-header">
        <div className="panel-header-title">Panel de ventanilla</div>
        <div className="panel-header-info">
          Sucursal: Quito Norte · Cajero: Michelle Ruiz
        </div>
      </header>

 
      <main className="panel-content">
        <h3 className="panel-section-title">Operaciones rápidas</h3>

        <div className="panel-cards">

          <Link to="/panel/consultar" className="panel-card">
            <div className="panel-card-title">Consultar cuenta</div>
            <div className="panel-card-text">
              Buscar al cliente por número de cuenta o cédula y ver sus datos básicos.
            </div>
          </Link>

          <Link to="/panel/depositos" className="panel-card">
            <div className="panel-card-title">Registro depósito</div>
            <div className="panel-card-text">
              Ingresar efectivo o cheques en cuentas de ahorro o corriente.
            </div>
          </Link>

          <Link to="/panel/retiros" className="panel-card">
            <div className="panel-card-title">Registro de retiros</div>
            <div className="panel-card-text">
              Validar fondos disponibles y registrar retiros en ventanilla.
            </div>
          </Link>

          <Link to="/panel/transferencias" className="panel-card">
            <div className="panel-card-title">Transferencias internas</div>
            <div className="panel-card-text">
              Movimientos entre cuentas del mismo banco para clientes registrados.
            </div>
          </Link>

          <Link to="/panel/historial" className="panel-card">
            <div className="panel-card-title">Historial</div>
            <div className="panel-card-text">
              Consulte las últimas operaciones realizadas en esta ventanilla.
            </div>
          </Link>

        </div>

        <div className="panel-info-box">
          <div className="panel-info-title">Resumen del módulo</div>
          <div className="panel-info-text">
            Desde este panel puedes acceder a las principales operaciones de ventanilla:
            consulta de cuentas, depósitos, retiros, transferencias e historial.
          </div>
        </div>

      
        <div className="panel-info-box" style={{ marginTop: 24 }}>
          <div className="panel-info-title">Apertura de turno</div>
          <div className="panel-info-text" style={{ marginBottom: 12 }}>
            Código esperado: <strong>{codigoTurno}</strong> {codigoTurnoStore ? `(activo: ${codigoTurnoStore})` : ''}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(180px, 1fr))", gap: 12 }}>
            <div>
              <label htmlFor="turno-caja">Código caja</label>
              <input id="turno-caja" value={codigoCaja} onChange={(e)=>setCodigoCaja(e.target.value)} />
            </div>
            <div>
              <label htmlFor="turno-cajero">Código cajero</label>
              <input id="turno-cajero" value={codigoCajero} onChange={(e)=>setCodigoCajero(e.target.value)} />
            </div>
            <div>
              <label htmlFor="turno-fecha">Fecha turno (YYYYMMDD)</label>
              <input id="turno-fecha" value={fechaTurno} onChange={(e)=>setFechaTurno(e.target.value)} />
            </div>
            <div>
              <label htmlFor="turno-pass">Contraseña</label>
              <input id="turno-pass" type="password" value={contrasenia} onChange={(e)=>setContrasenia(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>Denominaciones inicio (total ${montoInicialCalc.toFixed(2)})</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {denomsInicio.map((d, i)=> (
              <div key={d.billete}>
                <label htmlFor={`turno-den-${d.billete}`}>${d.billete}</label>
                <input id={`turno-den-${d.billete}`} type="number" min={0} value={d.cantidad} onChange={(e)=>actualizarDenom(i, Math.max(0, Number.parseInt(e.target.value||'0')))} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button disabled={loading} onClick={onAbrirTurno} className="panel-card" style={{ cursor: "pointer" }}>Abrir turno</button>
            <button disabled={loading} onClick={()=>{ clearCodigoTurnoActivo(); globalThis.alert('Turno local limpiado'); }} className="panel-card" style={{ cursor: "pointer" }}>Limpiar turno local</button>
          </div>
        </div>

        <div className="panel-info-box" style={{ marginTop: 24 }}>
          <div className="panel-info-title">Cierre de turno</div>
          <div className="panel-info-text" style={{ marginBottom: 12 }}>
            Indique el código del turno a cerrar y el conteo físico.
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(240px, 1fr))", gap: 12 }}>
            <div>
              <label htmlFor="turno-cerrar">Código turno a cerrar</label>
              <input id="turno-cerrar" value={codigoTurnoCerrar} onChange={(e)=>setCodigoTurnoCerrar(e.target.value)} />
            </div>
            <div>
              <label htmlFor="turno-monto-final">Monto final (calculado)</label>
              <input id="turno-monto-final" value={montoFinalCalc.toFixed(2)} disabled />
            </div>
          </div>
          <div style={{ marginTop: 12 }}>Denominaciones fin</div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {denomsFin.map((d, i)=> (
              <div key={d.billete}>
                <label htmlFor={`turno-fin-den-${d.billete}`}>${d.billete}</label>
                <input id={`turno-fin-den-${d.billete}`} type="number" min={0} value={d.cantidad} onChange={(e)=>actualizarDenomFin(i, Math.max(0, Number.parseInt(e.target.value||'0')))} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <button disabled={loading} onClick={onCerrarTurno} className="panel-card" style={{ cursor: "pointer" }}>Cerrar turno</button>
          </div>
        </div>

        {loading && <p style={{ marginTop: 12 }}>Procesando...</p>}
        {error && (
          <p style={{ marginTop: 12, color: "#b40000" }}>Error: {error}</p>
        )}
        {resultado && (
          <pre style={{ marginTop: 12, background: "#111", padding: 12, borderRadius: 6, maxHeight: 260, overflow: "auto" }}>
{JSON.stringify(resultado, null, 2)}
          </pre>
        )}
      </main>

    </div>
  );
}

export default Panel;
