// ...existing code...
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import logo from "../assets/logo-ecusol.jpg";

function Login() {
  const navigate = useNavigate();
  const [sucursal, setSucursal] = useState("Quito Norte"); // valor por defecto
  const [codigo, setCodigo] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sucursal.trim() || !codigo.trim()) {
      alert("Ingrese sucursal y código de empleado.");
      return;
    }
    navigate("/panel");
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="logo-area">
          <img src={logo} alt="Banco ECUSOL" />
        </div>

        <h2 className="login-title">Ingreso al módulo de ventanilla</h2>
        <p className="login-subtitle">
          Seleccione la sucursal y el código de cajero con el que va a operar.
        </p>

        <form onSubmit={handleSubmit}>
          <label className="section-title" htmlFor="sucursal">Sucursal</label>
          <select
            id="sucursal"
            className="login-select"
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
          >
            <option value="Quito Norte">Quito Norte</option>
            <option value="Quito Sur">Quito Sur</option>
            <option value="Guayaquil Centro">Guayaquil Centro</option>
          </select>

          <label className="section-title" htmlFor="codigo">Código de N° (cajero)</label>
          <input
            id="codigo"
            className="login-input"
            placeholder="Ej. CJR-021"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
          />

          <button type="submit" className="login-button">Entrar a ventanilla</button>
        </form>

      </div>
    </div>
  );
}

export default Login;
