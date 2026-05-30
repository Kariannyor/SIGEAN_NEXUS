// src/pages/CrearBoleta.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Save } from "lucide-react";

// MOCK DATA DE ESTUDIANTES
const estudiantesMock = [
  { id: 1, nombre: "María Cisneros" },
  { id: 2, nombre: "José Ramírez" },
  { id: 3, nombre: "Ana Torres" },
  { id: 4, nombre: "Luis Mendoza" }
];

// MATERIAS DISPONIBLES
const materias = [
  "Matemática",
  "Castellano",
  "Ciencias Naturales",
  "Historia",
  "Geografía",
  "Inglés"
];

const CrearBoleta: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    estudiante: "",
    materia: "",
    nota: ""
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const guardarBoleta = () => {
    if (!formData.estudiante || !formData.materia || !formData.nota) {
      alert("Por favor complete todos los campos");
      return;
    }

    console.log("Boleta creada:", formData);
    alert("Boleta registrada correctamente");
    navigate("/boletas");
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* HEADER */}
        <div style={styles.header}>
          <button onClick={() => navigate(-1)} style={styles.backButton}>
            <ArrowLeft size={18} /> Volver
          </button>
          <h2 style={styles.title}>Redactar Nueva Boleta</h2>
        </div>

        {/* FORMULARIO */}
        <div style={styles.form}>
          <div style={styles.field}>
            <label style={styles.label}>Estudiante</label>
            <select
              name="estudiante"
              value={formData.estudiante}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Seleccione...</option>
              {estudiantesMock.map((e) => (
                <option key={e.id} value={e.nombre}>
                  {e.nombre}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Materia</label>
            <select
              name="materia"
              value={formData.materia}
              onChange={handleChange}
              style={styles.input}
            >
              <option value="">Seleccione...</option>
              {materias.map((m, i) => (
                <option key={i} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Nota</label>
            <input
              type="number"
              name="nota"
              min={0}
              max={20}
              value={formData.nota}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          {/* BOTÓN GUARDAR */}
          <button onClick={guardarBoleta} style={styles.saveBtn}>
            <Save size={18} /> Guardar Boleta
          </button>
        </div>
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
    maxWidth: "600px",
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

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px"
  },

  field: {
    display: "flex",
    flexDirection: "column"
  },

  label: {
    fontSize: "14px",
    marginBottom: "5px",
    fontWeight: "bold"
  },

  input: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px"
  },

  saveBtn: {
    marginTop: "10px",
    padding: "12px",
    backgroundColor: "#008f39",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontWeight: "bold",
    justifyContent: "center"
  }
};

export default CrearBoleta;
