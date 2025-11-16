import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo-ecusol.jpg";
import "../styles/panel.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Función para marcar el link activo
  const isActive = (path: string) =>
    location.pathname === path
      ? "sidebar-link sidebar-link--active"
      : "sidebar-link";

  // Cerrar sesión
  const handleLogout = () => {
    // Si después tienes tokens, aquí se borran:
    // localStorage.removeItem("token");

    navigate("/"); // vuelve al login
  };

  return (
    <aside className="sidebar">

      {/* LOGO */}
      <div className="sidebar-logo">
        <img src={logo} alt="Banco ECUSOL" />
      </div>

      {/* TÍTULOS */}
      <div className="sidebar-title">Módulo</div>
      <div className="sidebar-bank-name">Ventanilla bancaria</div>

      <div className="sidebar-separator" />

      {/* MENÚ */}
      <ul className="sidebar-menu">
        <li>
          <Link to="/panel" className={isActive("/panel")}>
            Panel principal
          </Link>
        </li>

        <li>
          <Link to="/panel/consultar" className={isActive("/panel/consultar")}>
            Consultar cuenta
          </Link>
        </li>

        <li>
          <Link to="/panel/depositos" className={isActive("/panel/depositos")}>
            Depósitos
          </Link>
        </li>

        <li>
          <Link to="/panel/retiros" className={isActive("/panel/retiros")}>
            Retiros
          </Link>
        </li>

        <li>
          <Link to="/panel/historial" className={isActive("/panel/historial")}>
            Historial 
          </Link>
        </li>
      </ul>

      {/* CERRAR SESIÓN — botón separado al final */}
      <button className="sidebar-logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;
