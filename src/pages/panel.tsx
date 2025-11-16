import "../styles/panel.css";
import { Link } from "react-router-dom";

function Panel() {
  return (
    <div className="panel-main">
      
      {/* HEADER */}
      <header className="panel-header">
        <div className="panel-header-title">Panel de ventanilla</div>
        <div className="panel-header-info">
          Sucursal: Quito Norte · Cajero: Michelle Ruiz
        </div>
      </header>

      {/* CONTENIDO */}
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
      </main>

    </div>
  );
}

export default Panel;
