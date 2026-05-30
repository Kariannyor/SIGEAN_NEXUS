// src/pages/Dashboard.tsx
import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import {
  Users,
  ClipboardList,
  FileText,
  BookOpen,
  ArrowRight
} from "lucide-react";

ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  Tooltip,
  Legend
);

const Dashboard: React.FC = () => {
  // Datos de ejemplo
  const totalEstudiantes = 128;
  const asistenciaHoy = 112;
  const boletasGeneradas = 45;
  const calificacionesPendientes = 12;

  // Gráfico de barras (asistencia semanal)
  const asistenciaSemanal = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie"],
    datasets: [
      {
        label: "Asistencia",
        data: [22, 25, 24, 23, 18],
        backgroundColor: "#42A5F5"
      }
    ]
  };

  // Gráfico de pastel (distribución por grado)
  const distribucionGrados = {
    labels: ["1ro", "2do", "3ro", "4to", "5to", "6to"],
    datasets: [
      {
        data: [20, 18, 22, 21, 25, 22],
        backgroundColor: [
          "#4CAF50",
          "#66BB6A",
          "#90CAF9",
          "#42A5F5",
          "#81C784",
          "#A5D6A7"
        ]
      }
    ]
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Dashboard General</h2>

      {/* TARJETAS PRINCIPALES */}
      <div style={styles.cards}>
        <div style={{ ...styles.card, backgroundColor: "#4CAF50" }}>
          <Users size={32} color="#fff" />
          <h3 style={styles.cardNumber}>{totalEstudiantes}</h3>
          <p style={styles.cardLabel}>Estudiantes</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#42A5F5" }}>
          <ClipboardList size={32} color="#fff" />
          <h3 style={styles.cardNumber}>{asistenciaHoy}</h3>
          <p style={styles.cardLabel}>Asistencia Hoy</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#66BB6A" }}>
          <FileText size={32} color="#fff" />
          <h3 style={styles.cardNumber}>{boletasGeneradas}</h3>
          <p style={styles.cardLabel}>Boletas Generadas</p>
        </div>

        <div style={{ ...styles.card, backgroundColor: "#90CAF9" }}>
          <BookOpen size={32} color="#fff" />
          <h3 style={styles.cardNumber}>{calificacionesPendientes}</h3>
          <p style={styles.cardLabel}>Calificaciones Pendientes</p>
        </div>
      </div>

      {/* GRÁFICOS */}
      <div style={styles.graphs}>
        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Asistencia Semanal</h3>
          <Bar data={asistenciaSemanal} />
        </div>

        <div style={styles.graphCard}>
          <h3 style={styles.graphTitle}>Distribución por Grado</h3>
          <Pie data={distribucionGrados} />
        </div>
      </div>

      {/* ACTIVIDAD RECIENTE */}
      <div style={styles.activity}>
        <h3 style={styles.sectionTitle}>Actividad Reciente</h3>
        <ul style={styles.activityList}>
          <li>✔ María Cisneros fue registrada en 5to grado</li>
          <li>✔ Se creó la boleta de José Ramírez</li>
          <li>✔ Se registró asistencia del día</li>
          <li>✔ Nueva calificación añadida por el docente</li>
        </ul>
      </div>

      {/* ACCESOS RÁPIDOS */}
      <div style={styles.quickAccess}>
        <h3 style={styles.sectionTitle}>Accesos Rápidos</h3>
        <div style={styles.quickButtons}>
          <button style={styles.quickBtn}>
            Registrar Asistencia <ArrowRight size={18} />
          </button>
          <button style={styles.quickBtn}>
            Crear Boleta <ArrowRight size={18} />
          </button>
          <button style={styles.quickBtn}>
            Ver Estudiantes <ArrowRight size={18} />
          </button>
          <button style={styles.quickBtn}>
            Configuración <ArrowRight size={18} />
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
    padding: "20px"
  },

  title: {
    fontSize: "26px",
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: "20px"
  },

  /* TARJETAS */
  cards: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "20px",
    marginBottom: "30px"
  },

  card: {
    padding: "20px",
    borderRadius: "12px",
    color: "#fff",
    textAlign: "center" as const,
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    transition: "transform 0.2s",
    cursor: "pointer"
  },

  cardNumber: {
    fontSize: "32px",
    margin: "10px 0 0 0"
  },

  cardLabel: {
    margin: 0,
    fontSize: "14px"
  },

  /* GRÁFICOS */
  graphs: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "20px",
    marginBottom: "30px"
  },

  graphCard: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
  },

  graphTitle: {
    marginBottom: "10px",
    fontWeight: "bold",
    color: "#333"
  },

  /* ACTIVIDAD */
  activity: {
    marginBottom: "30px"
  },

  sectionTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: "10px"
  },

  activityList: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
    listStyle: "none",
    lineHeight: "1.8"
  },

  /* ACCESOS RÁPIDOS */
  quickAccess: {},

  quickButtons: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "15px"
  },

  quickBtn: {
    padding: "12px",
    backgroundColor: "#42A5F5",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between"
  }
};

export default Dashboard;
