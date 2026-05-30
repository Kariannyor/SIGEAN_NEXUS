// src/pages/Asistencia.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react";

// MOCK DATA
const estudiantesMock = [
  { id: 1, nombre: "María Cisneros" },
  { id: 2, nombre: "José Ramírez" },
  { id: 3, nombre: "Ana Torres" },
  { id: 4, nombre: "Luis Mendoza" },
  { id: 5, nombre: "Pedro González" }
];

const Asistencia: React.FC = () => {
  const navigate = useNavigate();

  const [asistencia, setAsistencia] = useState<{ [key: number]: string }>({});

  const marcar = (id: number, estado: string) => {
    setAsistencia((prev) => ({ ...prev, [id]: estado }));
  };

  const guardarAsistencia = () => {
    console.log("Asistencia registrada:", asistencia);
    alert("Asistencia guardada correctamente");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={18} /> Volver
          </button>
          <h2 style={styles.title}>Control de Asistencia</h2>
        </div>

        {/* LISTA DE ESTUDIANTES */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Estudiante</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {estudiantesMock.map((e) => (
              <tr key={e.id} style={styles.tr}>
                <td style={styles.td}>{e.nombre}</td>

                <td style={styles.td}>
                  {asistencia[e.id] === "P" && (
                    <span style={styles.presente}>Presente</span>
                  )}
                  {asistencia[e.id] === "A" && (
                    <span style={styles.ausente}>Ausente</span>
                  )}
                  {!asistencia[e.id] && <span style={styles.pendiente}>—</span>}
                </td>

                <td style={styles.td}>
                  <button
                    style={styles.btnPresente}
                    onClick={() => marcar(e.id, "P")}
                  >
                    <CheckCircle size={16} />
                  </button>

                  <button
                    style={styles.btnAusente}
                    onClick={() => marcar(e.id, "A")}
                  >
                    <XCircle size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* BOTÓN GUARDAR */}
        <button onClick={guardarAsistencia} style={styles.saveBtn}>
          Guardar Asistencia
        </button>
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
    maxWidth: "800px",
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
    fontWeight: "bold"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px"
  },

  th: {
    textAlign: "left",
    padding: "12px",
    backgroundColor: "#f0f0f0",
    borderBottom: "2px solid #ddd",
    fontWeight: "bold"
  },

  tr: {
    borderBottom: "1px solid #eee"
  },

  td: {
    padding: "12px"
  },

  presente: {
    color: "#008f39",
    fontWeight: "bold"
  },

  ausente: {
    color: "#b00020",
    fontWeight: "bold"
  },

  pendiente: {
    color: "#777"
  },

  btnPresente: {
    backgroundColor: "#008f39",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "8px"
  },

  btnAusente: {
    backgroundColor: "#b00020",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  saveBtn: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#006628",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "15px"
  }
};

export default Asistencia;
