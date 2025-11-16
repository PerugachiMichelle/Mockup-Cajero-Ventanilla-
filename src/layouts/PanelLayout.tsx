import Sidebar from "../components/Sidebar";
import "../styles/panel.css";

function PanelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="panel-container">
      <Sidebar />
      <div className="panel-main">
        {children}
      </div>
    </div>
  );
}

export default PanelLayout;
