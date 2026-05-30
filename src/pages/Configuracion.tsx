// src/pages/Configuracion.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings } from "lucide-react";
import { permisosPorRol } from "../roles/permissions";
import type { Rol } from "../roles/permissions";

const Configuracion: React.FC = () => {
  const navigate = useNavigate();

  const [rol, setRol] = useState<Rol>(
    (localStorage.getItem("userRole") as Rol) || "Invitado"
  );

  const [nombre, setNombre] = useState(
    localStorage.getItem("username") || "Usuario SIGEAN"
  );

  const cambiarRol = (nuevoRol: Rol) => {
    setRol(nuevoRol);
    localStorage.setItem("userRole", nuevoRol);
  };

  const guardarNombre = () => {
    localStorage.setItem("username", nombre);
    alert("Nombre actualizado");
  };

  const resetear = () => {
    localStorage.clear();
    alert("Datos locales eliminados");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={18} /> Volver
          </button>
          <h2 style={styles.title}>
            <Settings size={22} /> Configuración
          </h2>
        </div>

        {/* CAMBIAR NOMBRE */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Nombre Visible</h3>
          <input
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            style={styles.input}
          />
          <button onClick={guardarNombre} style={styles.btn}>
            Guardar Nombre
          </button>
        </div>

        {/* CAMBIAR ROL */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Rol Actual</h3>
          <select
            value={rol}
            onChange={(e) => cambiarRol(e.target.value as Rol)}
            style={styles.input}
          >
            {Object.keys(permisosPorRol).map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* PERMISOS DEL ROL */}
        <div style={styles.section}>
          <h3 style={styles.sectionTitle}>Permisos del Rol</h3>
          <ul>
            {permisosPorRol[rol].map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        {/* RESET */}
        <button onClick={resetear} style={styles.resetBtn}>
          Resetear Datos Locales
        </button>
      </div>
    </div>
  );
};

/* ESTILOS */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "20px"
  },
  card: {
    width: "100%",
    maxWidth: "600px",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },
  header: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
    marginBottom: "20px"
  },
  backButton: {
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#008f39",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    gap: "5px"
  },
  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    color: "#008f39"
  },
  section: {
    marginBottom: "25px"
  },
  sectionTitle: {
    fontSize: "16px",
    fontWeight: "bold",
    marginBottom: "10px"
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    marginBottom: "10px"
  },
  btn: {
    padding: "10px",
    backgroundColor: "#008f39",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold"
  },
  resetBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#b00020",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "20px"
  }
};

export default Configuracion;
