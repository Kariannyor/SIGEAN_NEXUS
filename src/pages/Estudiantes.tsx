// src/pages/Estudiantes.tsx
import React from "react";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

// MOCK DATA
const estudiantesMock = [
  { id: 1, nombre: "María Cisneros", edad: 10, grado: "5to Grado" },
  { id: 2, nombre: "José Ramírez", edad: 11, grado: "6to Grado" },
  { id: 3, nombre: "Ana Torres", edad: 10, grado: "5to Grado" },
  { id: 4, nombre: "Luis Mendoza", edad: 12, grado: "6to Grado" }
];

const Estudiantes: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={18} /> Volver
          </button>
          <h2 style={styles.title}>Gestión de Estudiantes</h2>
        </div>

        {/* TABLA */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Edad</th>
              <th style={styles.th}>Grado</th>
            </tr>
          </thead>

          <tbody>
            {estudiantesMock.map((e) => (
              <tr key={e.id} style={styles.tr}>
                <td style={styles.td}>{e.nombre}</td>
                <td style={styles.td}>{e.edad}</td>
                <td style={styles.td}>{e.grado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

/* ============================
   ESTILOS
============================ */
const styles: { [key: string]: React.CSSProperties } = {
  container: {
    width: "100%",
    display: "flex",
    justifyContent: "center",
    padding: "20px"
  },

  card: {
    width: "100%",
    maxWidth: "900px",
    backgroundColor: "#fff",
    padding: "25px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px"
  },

  backButton: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    background: "none",
    border: "none",
    cursor: "pointer",
    color: "#008f39",
    fontWeight: "bold"
  },

  title: {
    margin: 0,
    fontSize: "22px",
    fontWeight: "bold",
    textAlign: "center" as const
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"
  },

  th: {
    textAlign: "left" as const,
    padding: "12px",
    backgroundColor: "#f0f0f0",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold"
  },

  tr: {
    borderBottom: "1px solid #eee"
  },

  td: {
    padding: "12px",
    textAlign: "left" as const
  }
};

export default Estudiantes;
