// src/pages/Boletas.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ClipboardCheck,
  History,
  FolderOpen,
  Download,
  ShieldCheck,
  FileText,
  Printer,
  Users,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  FilePlus
} from "lucide-react";

// IMPORTAMOS MOCK DATA
import { documentosActas } from "../data/documentosActas.";
import { alumnosEstatus } from "../data/alumnosEstatus.";

const Boletas = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("gestion");

  const currentRole = localStorage.getItem("userRole") || "Docente";

  const menuOptions = [
    {
      title: "Redactar Boleta",
      description: "Cargar indicadores y evaluar competencias.",
      icon: <FilePlus size={32} color="#008B8F" />,
      path: "/crear-boleta",
      roles: ["Docente", "Administrador", "Invitado"]
    },
    {
      title: "Panel de Revisión",
      description: "Supervisar y aprobar boletas enviadas.",
      icon: <ClipboardCheck size={32} color="#f57c00" />,
      path: "/revision-boletas",
      roles: ["Directivo", "Administrador", "Secretaria", "Invitado"]
    },
    {
      title: "Historial Escolar",
      description: "Consulta de boletas aprobadas.",
      icon: <History size={32} color="#1976d2" />,
      path: "/evaluaciones",
      roles: ["Docente", "Directivo", "Administrador", "Secretaria"]
    },
    {
      title: "Impresión Masiva",
      description: "Generar boletas por lote.",
      icon: <Printer size={32} color="#b666" />,
      path: "/reportes-impresion",
      roles: ["Secretaria", "Administrador"]
    }
  ];

  const tabs = [
    { id: "gestion", label: "Gestión de Boletas", icon: <FileText size={18} /> },
    { id: "seguimiento", label: "Estatus del Aula", icon: <Users size={18} /> },
    { id: "actas", label: "Repositorio de Actas", icon: <FolderOpen size={18} /> },
    { id: "auditoria", label: "Auditoría Alcaldía/Zona", icon: <ShieldCheck size={18} /> }
  ];

  return (
    <div style={{ padding: "20px" }}>
      {/* BOTÓN VOLVER */}
      <div style={{ display: "flex", alignItems: "center", gap: "15px", marginBottom: "10px" }}>
        <button
          onClick={() => navigate(-1)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px"
          }}
        >
          <ArrowLeft size={20} />
          Volver
        </button>
      </div>

      {/* TÍTULO */}
      <h2 style={{ marginBottom: "20px" }}>Gestión de Boletas Informativas</h2>

      {/* TABS */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
        {tabs.map((tab: any) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: "10px 15px",
              borderRadius: "8px",
              border: activeTab === tab.id ? "2px solid #008B8F" : "1px solid #ccc",
              backgroundColor: activeTab === tab.id ? "#e0f7f7" : "white",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENIDO SEGÚN TAB */}
      {activeTab === "gestion" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
          {menuOptions
            .filter((opt) => opt.roles.includes(currentRole))
            .map((opt: any, i: number) => (
              <div
                key={i}
                onClick={() => navigate(opt.path)}
                style={{
                  padding: "20px",
                  borderRadius: "12px",
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  backgroundColor: "white",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px"
                }}
              >
                {opt.icon}
                <h3>{opt.title}</h3>
                <p>{opt.description}</p>
              </div>
            ))}
        </div>
      )}

      {activeTab === "seguimiento" && (
        <div>
          <h3>Estatus del Aula</h3>
          <table style={{ width: "100%", marginTop: "15px", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Estudiante</th>
                <th>Estatus</th>
                <th>Observación</th>
              </tr>
            </thead>
            <tbody>
              {alumnosEstatus.map((al: any) => (
                <tr key={al.id}>
                  <td>{al.nombre}</td>
                  <td>
                    {al.estatus === "Aprobada" && <CheckCircle color="green" />}
                    {al.estatus === "Observada" && <AlertCircle color="orange" />}
                    {al.estatus === "En Revisión" && <AlertCircle color="gray" />}
                    {al.estatus}
                  </td>
                  <td>{al.obs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "actas" && (
        <div>
          <h3>Documentos y Actas Administrativas</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginTop: "15px" }}>
            {documentosActas.map((doc: any, i: number) => (
              <button
                key={i}
                style={{
                  backgroundColor: "#008f39",
                  color: "white",
                  padding: "16px",
                  borderRadius: "12px",
                  border: "1px solid #008f39",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  cursor: "pointer"
                }}
              >
                <Download size={16} />
                {doc.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {activeTab === "auditoria" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
          <div style={{ padding: "12px", backgroundColor: "#fc8c69", borderRadius: "12px" }}>
            <p>Estadísticas de Carga Municipal</p>
            <p style={{ fontSize: "24px", fontWeight: "bold" }}>85.4%</p>
            <p>Sincronizado con Alcaldía</p>
          </div>

          <div style={{ padding: "12px", backgroundColor: "#fc8c69", borderRadius: "12px" }}>
            <p>Reporte de Supervisión</p>
            <button
              style={{
                marginTop: "15px",
                padding: "15px",
                backgroundColor: "#b04c20",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer"
              }}
            >
              Generar reporte consolidado
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Boletas;