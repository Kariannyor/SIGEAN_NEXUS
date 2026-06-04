import React, { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, Save, BookOpen, Book, RefreshCw 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// Definición de tipos simplificada
interface Estudiante {
  id_alumno: number;
  primer_nombre: string;
  primer_apellido: string;
}

const Evaluaciones: React.FC = () => {
  const navigate = useNavigate();
  const [tabActiva, setTabActiva] = useState<'cualitativa' | 'lectura'>('cualitativa');
  const [cargando, setCargando] = useState(false);
  
  // Estilos definidos DENTRO del componente para evitar errores de scope
  const styles: { [key: string]: React.CSSProperties } = {
    container: { padding: '40px', backgroundColor: '#f0fdf4', minHeight: '100vh' },
    header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px' },
    saveButton: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
    tabActive: { padding: '12px 24px', backgroundColor: '#fff', border: '2px solid #059669', color: '#059669', fontWeight: 'bold', cursor: 'pointer' },
    tabInactive: { padding: '12px 24px', backgroundColor: 'transparent', color: '#64748b', border: 'none', cursor: 'pointer' }
  };

  const handleGuardar = useCallback(async () => {
    setCargando(true);
    // Tu lógica de guardado...
    setTimeout(() => setCargando(false), 1000);
  }, []);

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <button onClick={() => navigate('/boletas')}><ArrowLeft size={24} /></button>
        <button onClick={handleGuardar} style={styles.saveButton}>
          {cargando ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>} 
          {cargando ? "Guardando..." : "Guardar"}
        </button>
      </header>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '25px' }}>
        <button onClick={() => setTabActiva('cualitativa')} style={tabActiva === 'cualitativa' ? styles.tabActive : styles.tabInactive}><BookOpen size={18} /> Cualitativa</button>
        <button onClick={() => setTabActiva('lectura')} style={tabActiva === 'lectura' ? styles.tabActive : styles.tabInactive}><Book size={18} /> Lectura</button>
      </div>
    </div>
  );
};

export default Evaluaciones;