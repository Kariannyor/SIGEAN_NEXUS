// src/components/Sidebar.tsx
import React from "react";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  FileText,
  BookOpen,
  ClipboardList,
  Settings,
  LogOut
} from "lucide-react";
import { usePermisos } from "../hooks/usePermisos";

interface SidebarProps {
  onLogout: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onLogout }) => {
  const { rol, puede } = usePermisos();
  const username = localStorage.getItem("username") || "Usuario";

  return (
    <div style={styles.sidebar}>
      {/* HEADER */}
      <div style={styles.header}>
        <h2 style={styles.logo}>SIGEAN</h2>
        <p style={styles.user}>{username}</p>
        <p style={styles.rol}>{rol}</p>
      </div>

      {/* MENÚ */}
      <nav style={styles.menu}>
        {puede("ver_dashboard") && (
          <NavLink to="/dashboard" style={styles.link}>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>
        )}

        {puede("ver_estudiantes") && (
          <NavLink to="/estudiantes" style={styles.link}>
            <Users size={18} /> Estudiantes
          </NavLink>
        )}

        {puede("ver_calificaciones") && (
          <NavLink to="/calificaciones" style={styles.link}>
            <BookOpen size={18} /> Calificaciones
          </NavLink>
        )}

        {puede("crear_boleta") && (
          <NavLink to="/crear-boleta" style={styles.link}>
            <FileText size={18} /> Crear Boleta
          </NavLink>
        )}

        {puede("ver_asistencia") && (
          <NavLink to="/asistencia" style={styles.link}>
            <ClipboardList size={18} /> Asistencia
          </NavLink>
        )}

        {puede("configuracion") && (
          <NavLink to="/configuracion" style={styles.link}>
            <Settings size={18} /> Configuración
          </NavLink>
        )}
      </nav>

      {/* LOGOUT */}
      <button onClick={onLogout} style={styles.logoutBtn}>
        <LogOut size={18} /> Cerrar sesión
      </button>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "240px",
    height: "100vh",
    backgroundColor: "#ffffff",
    borderRight: "1px solid #e0e0e0",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    position: "fixed",
    left: 0,
    top: 0
  },

  header: {
    textAlign: "center" as const,
    marginBottom: "20px"
  },

  logo: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    color: "#008f39"
  },

  user: {
    margin: 0,
    fontSize: "14px",
    color: "#333"
  },

  rol: {
    margin: 0,
    fontSize: "12px",
    color: "#777"
  },

  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },

  link: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px",
    borderRadius: "6px",
    textDecoration: "none",
    color: "#333",
    fontWeight: "500",
    cursor: "pointer"
  },

  logoutBtn: {
    marginTop: "20px",
    padding: "10px",
    backgroundColor: "#b00020",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "10px"
  }
};

export default Sidebar;
