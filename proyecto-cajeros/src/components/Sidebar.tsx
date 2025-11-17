import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/logo-ecusol.jpg";
import "../styles/panel.css";

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();


  const isActive = (path: string) =>
    location.pathname === path
      ? "sidebar-link sidebar-link--active"
      : "sidebar-link";

  
  const handleLogout = () => {

    navigate("/"); 
  };

  return (
    <aside className="sidebar">

    
      <div className="sidebar-logo">
        <img src={logo} alt="Banco ECUSOL" />
      </div>

      <div className="sidebar-title">Módulo</div>
      <div className="sidebar-bank-name">Ventanilla bancaria</div>

      <div className="sidebar-separator" />

   
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

    
      <button className="sidebar-logout-btn" onClick={handleLogout}>
        Cerrar sesión
      </button>
    </aside>
  );
}

export default Sidebar;
