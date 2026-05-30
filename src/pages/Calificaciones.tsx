// src/pages/Calificaciones.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Edit, Save, XCircle } from "lucide-react";

// MOCK DATA
const calificacionesMock = [
  { id: 1, estudiante: "María Cisneros", materia: "Matemática", nota: 18 },
  { id: 2, estudiante: "José Ramírez", materia: "Castellano", nota: 15 },
  { id: 3, estudiante: "Ana Torres", materia: "Ciencias Naturales", nota: 19 },
  { id: 4, estudiante: "Luis Mendoza", materia: "Historia", nota: 14 }
];

const Calificaciones: React.FC = () => {
  const navigate = useNavigate();

  const [calificaciones, setCalificaciones] = useState(calificacionesMock);
  const [editId, setEditId] = useState<number | null>(null);
  const [editNota, setEditNota] = useState<number | null>(null);

  const iniciarEdicion = (id: number, notaActual: number) => {
    setEditId(id);
    setEditNota(notaActual);
  };

  const cancelarEdicion = () => {
    setEditId(null);
    setEditNota(null);
  };

  const guardarNota = (id: number) => {
    if (editNota === null) return;

    const nuevas = calificaciones.map((c) =>
      c.id === id ? { ...c, nota: editNota } : c
    );

    setCalificaciones(nuevas);
    setEditId(null);
    setEditNota(null);

    alert("Calificación actualizada correctamente");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={18} /> Volver
          </button>
          <h2 style={styles.title}>Gestión de Calificaciones</h2>
        </div>

        {/* TABLA */}
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Estudiante</th>
              <th style={styles.th}>Materia</th>
              <th style={styles.th}>Nota</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {calificaciones.map((c) => (
              <tr key={c.id} style={styles.tr}>
                <td style={styles.td}>{c.estudiante}</td>
                <td style={styles.td}>{c.materia}</td>

                {/* Campo editable */}
                <td style={styles.td}>
                  {editId === c.id ? (
                    <input
                      type="number"
                      min={0}
                      max={20}
                      value={editNota ?? ""}
                      onChange={(e) => setEditNota(Number(e.target.value))}
                      style={styles.input}
                    />
                  ) : (
                    c.nota
                  )}
                </td>

                {/* Botones */}
                <td style={styles.td}>
                  {editId === c.id ? (
                    <div style={styles.actionGroup}>
                      <button
                        onClick={() => guardarNota(c.id)}
                        style={styles.saveBtn}
                      >
                        <Save size={16} />
                      </button>

                      <button
                        onClick={cancelarEdicion}
                        style={styles.cancelBtn}
                      >
                        <XCircle size={16} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => iniciarEdicion(c.id, c.nota)}
                      style={styles.editBtn}
                    >
                      <Edit size={16} />
                    </button>
                  )}
                </td>
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
    fontWeight: "bold"
  },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px"
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

  input: {
    width: "60px",
    padding: "6px",
    borderRadius: "6px",
    border: "1px solid #ccc"
  },

  actionGroup: {
    display: "flex",
    gap: "8px"
  },

  editBtn: {
    backgroundColor: "#008f39",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  saveBtn: {
    backgroundColor: "#006628",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  },

  cancelBtn: {
    backgroundColor: "#b00020",
    color: "white",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer"
  }
};

export default Calificaciones;
