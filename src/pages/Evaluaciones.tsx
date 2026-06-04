import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Save, PlusCircle, Trash2, 
  BookOpen, GraduationCap, Download, Lightbulb, Search, User, RefreshCw, Layers, Plus, Book
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

// Definición de tipos
interface Estudiante {
  id_alumno: number;
  primer_nombre: string;
  primer_apellido: string;
}

interface Indicador { id: number; texto: string; }
interface Competencia { id: number; nombre: string; indicadores: Indicador[]; }
interface FilaEvaluacion { id: number; area: string; competencias: Competencia[]; }

const Evaluaciones: React.FC = () => {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState<'cualitativa' | 'lectura'>('cualitativa');
  
  // Estados
  const [alumnos, setAlumnos] = useState<Estudiante[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Estudiante | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [anioEscolar] = useState("2025-2026");
  const [docente, setDocente] = useState("");
  const [gradoSeccion, setGradoSeccion] = useState("3er Grado");
  const [proyecto, setProyecto] = useState("");
  const [momento, setMomento] = useState("1er Momento");
  const [apreciacionGlobal, setApreciacionGlobal] = useState("");
  const [lecturaData, setLecturaData] = useState<Record<number, string>>({});
  const [filas, setFilas] = useState<FilaEvaluacion[]>([{ 
    id: Date.now(), 
    area: '', 
    competencias: [{ id: Date.now() + 1, nombre: '', indicadores: [{ id: Date.now() + 2, texto: '' }] }] 
  }]);

  // Carga inicial
  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/alumnos');
        setAlumnos(res.data.estudiantes || res.data);
      } catch (err) { console.error("Error cargando alumnos:", err); }
    };
    fetchAlumnos();
  }, []);

  const handleGuardar = useCallback(async () => {
    setCargando(true);
    try {
      if (tabActiva === 'cualitativa') {
        if (!alumnoSeleccionado) return alert("Seleccione un estudiante");
        await axios.post('http://localhost:8000/api/evaluaciones', {
          id_alumno: alumnoSeleccionado.id_alumno,
          docente, grado: gradoSeccion, momento, proyecto,
          evaluaciones: filas, apreciacion_global: apreciacionGlobal,
          anio_escolar: anioEscolar
        });
      } else {
        const dataLectura = Object.entries(lecturaData).map(([id, nivel]) => ({ id_alumno: parseInt(id), nivel }));
        await axios.post('http://localhost:8000/api/evaluaciones/lectura', {
          grado: gradoSeccion, momento, anio_escolar: anioEscolar, data: dataLectura
        });
      }
      alert("✅ Guardado con éxito");
    } catch (error) { alert("❌ Error al guardar"); }
    finally { setCargando(false); }
  }, [alumnoSeleccionado, docente, gradoSeccion, momento, proyecto, filas, apreciacionGlobal, anioEscolar, tabActiva, lecturaData]);

  // Objeto de estilos definido DENTRO del alcance del componente
  const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: '40px', backgroundColor: '#f0fdf4', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
    btnFlechaVerde: { padding: '10px', cursor: 'pointer' },
    title: { fontSize: '28px', color: '#064e3b' },
    tabsContainer: { display: 'flex', gap: '10px', marginBottom: '25px' },
    tabActive: { padding: '12px 24px', backgroundColor: '#fff', border: '2px solid #059669', color: '#059669', fontWeight: 'bold' },
    tabInactive: { padding: '12px 24px', backgroundColor: 'transparent', color: '#64748b' },
    mainGrid: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' },
    card: { backgroundColor: '#fff', padding: '24px', borderRadius: '18px', border: '1px solid #bbf7d0' },
    select: { width: '100%', padding: '10px' },
    saveButton: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer' },
    // Agrega aquí el resto de tus estilos según tu archivo original...
  };

  return (
    <div style={styles.container}>
      {/* ... Tu JSX sigue aquí ... */}
      <header style={styles.header}>
        <button onClick={() => navigate('/boletas')} style={styles.btnFlechaVerde}><ArrowLeft size={24} /></button>
        <button onClick={handleGuardar} style={styles.saveButton}>{cargando ? "Guardando..." : "Guardar"}</button>
      </header>
      
      <div style={styles.tabsContainer}>
        <button onClick={() => setTabActiva('cualitativa')} style={tabActiva === 'cualitativa' ? styles.tabActive : styles.tabInactive}><BookOpen size={18} /> Cualitativa</button>
        <button onClick={() => setTabActiva('lectura')} style={tabActiva === 'lectura' ? styles.tabActive : styles.tabInactive}><Book size={18} /> Lectura</button>
      </div>
      {/* Resto de tu contenido visual */}
    </div>
  );
};

export default Evaluaciones;