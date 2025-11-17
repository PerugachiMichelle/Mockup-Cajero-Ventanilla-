import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/login";
import Panel from "../pages/panel";
import ConsultarCuenta from "../pages/consultarCuenta";
import Depositos from "../pages/depositos";
import Retiros from "../pages/retiros";
import Historial from "../pages/historial";

import PanelLayout from "../layouts/PanelLayout";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>

    
        <Route path="/" element={<Login />} />

       
        <Route
          path="/panel"
          element={
            <PanelLayout>
              <Panel />
            </PanelLayout>
          }
        />

        <Route
          path="/panel/consultar"
          element={
            <PanelLayout>
              <ConsultarCuenta />
            </PanelLayout>
          }
        />

        <Route
          path="/panel/depositos"
          element={
            <PanelLayout>
              <Depositos />
            </PanelLayout>
          }
        />

        <Route
          path="/panel/retiros"
          element={
            <PanelLayout>
              <Retiros />
            </PanelLayout>
          }
        />

        <Route
          path="/panel/historial"
          element={
            <PanelLayout>
              <Historial />
            </PanelLayout>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
