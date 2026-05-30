import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ArrowLeft, Save, PlusCircle, Trash2, 
  BookOpen, GraduationCap, Download, Lightbulb, Search, User, RefreshCw, Layers, Plus, Book
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import type { UserOptions } from 'jspdf-autotable';

interface jsPDFWithPlugin extends jsPDF {
  autoTable: (options: UserOptions) => void;
  lastAutoTable?: {
    finalY: number;
  };
}

interface Estudiante {
  id_alumno: number;
  primer_nombre: string;
  primer_apellido: string;
}

interface Indicador {
  id: number;
  texto: string;
}

interface Competencia {
  id: number;
  nombre: string;
  indicadores: Indicador[];
}

interface FilaEvaluacion {
  id: number;
  area: string;
  competencias: Competencia[];
}

const Evaluaciones: React.FC = () => {
  const navigate = useNavigate();

  // Gestión de Pestañas
  const [tabActiva, setTabActiva] = useState<'cualitativa' | 'lectura'>('cualitativa');

  const niveles = useMemo(() => ["2do Nivel", "3er Nivel", "1er Grado", "2do Grado", "3er Grado", "4to Grado", "5to Grado", "6to Grado"], []);
  const momentos = useMemo(() => ["1er Momento", "2do Momento", "3er Momento"], []);
  const aniosDisponibles = useMemo(() => ["2025-2026", "2024-2025", "2023-2024"], []);
  const literalesLectura = useMemo(() => ["Subsilábico", "Silábico", "Vacilante", "Corriente", "Expresiva"], []);

  const [alumnos, setAlumnos] = useState<Estudiante[]>([]);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState<Estudiante | null>(null);
  const [busqueda, setBusqueda] = useState("");
  const [cargando, setCargando] = useState(false);
  const [buscandoHistorial, setBuscandoHistorial] = useState(false);
  
  const [anioEscolar, setAnioEscolar] = useState(aniosDisponibles[0]);
  const [docente, setDocente] = useState("");
  const [gradoSeccion, setGradoSeccion] = useState(niveles[0]);
  const [proyecto, setProyecto] = useState("");
  const [momento, setMomento] = useState(momentos[0]);
  const [apreciacionGlobal, setApreciacionGlobal] = useState("");

  // Estado para Niveles de Lectura (id_alumno -> nivel)
  const [lecturaData, setLecturaData] = useState<Record<number, string>>({});

  const [filas, setFilas] = useState<FilaEvaluacion[]>(() => [
    { id: Date.now(), area: '', competencias: [{ id: Date.now() + 1, nombre: '', indicadores: [{ id: Date.now() + 2, texto: '' }] }] }
  ]);

  useEffect(() => {
    const fetchAlumnos = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/alumnos');
        setAlumnos(res.data.estudiantes || res.data);
      } catch (err) { console.error("Error cargando alumnos:", err); }
    };
    fetchAlumnos();
  }, []);

  useEffect(() => {
    const cargarDatosHistoricos = async () => {
      if (!alumnoSeleccionado) return;
      setBuscandoHistorial(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/evaluaciones/buscar`, {
          params: { id_alumno: alumnoSeleccionado.id_alumno, anio_escolar: anioEscolar, momento: momento }
        });
        if (res.data && res.data.evaluacion) {
          const ev = res.data.evaluacion;
          setDocente(ev.docente || "");
          setProyecto(ev.proyecto || "");
          setGradoSeccion(ev.grado || niveles[0]);
          setApreciacionGlobal(ev.apreciacion_global || "");
          setFilas(ev.evaluaciones || [{ id: Date.now(), area: '', competencias: [{ id: Date.now() + 1, nombre: '', indicadores: [{ id: Date.now() + 2, texto: '' }] }] }]);
        } else {
          setDocente(""); setProyecto(""); setApreciacionGlobal("");
          setFilas([{ id: Date.now(), area: '', competencias: [{ id: Date.now() + 1, nombre: '', indicadores: [{ id: Date.now() + 2, texto: '' }] }] }]);
        }
      } catch (err) { console.error("Error en autocompletado:", err); }
      finally { setBuscandoHistorial(false); }
    };
    cargarDatosHistoricos();
  }, [alumnoSeleccionado, anioEscolar, momento, niveles]);

  const añadirCompetencia = (areaId: number) => {
    setFilas(filas.map(f => f.id === areaId ? {
      ...f, competencias: [...f.competencias, { id: Date.now(), nombre: '', indicadores: [{ id: Date.now() + 1, texto: '' }] }]
    } : f));
  };

  const añadirIndicador = (areaId: number, compId: number) => {
    setFilas(filas.map(f => f.id === areaId ? {
      ...f, competencias: f.competencias.map(c => c.id === compId ? {
        ...c, indicadores: [...c.indicadores, { id: Date.now(), texto: '' }]
      } : c)
    } : f));
  };

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
        // Guardar Niveles de Lectura
        const dataLectura = Object.entries(lecturaData).map(([id, nivel]) => ({
          id_alumno: parseInt(id),
          nivel: nivel
        }));
        await axios.post('http://localhost:8000/api/evaluaciones/lectura', {
          grado: gradoSeccion,
          momento,
          anio_escolar: anioEscolar,
          data: dataLectura
        });
      }
      alert("✅ Registro guardado exitosamente");
    } catch (error) { alert("❌ Error al guardar"); }
    finally { setCargando(false); }
  }, [alumnoSeleccionado, docente, gradoSeccion, momento, proyecto, filas, apreciacionGlobal, anioEscolar, tabActiva, lecturaData]);

  const generarPDF = () => {
    if (!alumnoSeleccionado) return alert("Seleccione un estudiante");
    const doc = new jsPDF() as jsPDFWithPlugin;
    const nombre = `${alumnoSeleccionado.primer_nombre} ${alumnoSeleccionado.primer_apellido}`;
    doc.setFillColor(3, 76, 32);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.text("COLEGIO AQUILES NAZOA", 105, 20, { align: 'center' });
    doc.save(`Informe_${nombre}.pdf`);
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <button onClick={() => navigate('/boletas')} style={styles.btnFlechaVerde}><ArrowLeft size={24} strokeWidth={2.5} /></button>
          <div>
            <h1 style={styles.title}>Evaluación y Niveles</h1>
            <p style={styles.subtitle}>SIGEAN • Colegio Aquiles Nazoa</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          {tabActiva === 'cualitativa' && <button onClick={generarPDF} style={styles.downloadButton}><Download size={18}/> PDF</button>}
          <button onClick={handleGuardar} disabled={cargando} style={styles.saveButton}>
            {cargando ? <RefreshCw className="animate-spin" size={18}/> : <Save size={18}/>} 
            {cargando ? "Guardando..." : "Guardar Registro"}
          </button>
        </div>
      </header>

      {/* SISTEMA DE TABS */}
      <div style={styles.tabsContainer}>
        <button 
          onClick={() => setTabActiva('cualitativa')}
          style={tabActiva === 'cualitativa' ? styles.tabActive : styles.tabInactive}
        >
          <BookOpen size={18} /> Evaluación Cualitativa
        </button>
        <button 
          onClick={() => setTabActiva('lectura')}
          style={tabActiva === 'lectura' ? styles.tabActive : styles.tabInactive}
        >
          <Book size={18} /> Niveles de Lectura
        </button>
      </div>

      <div style={styles.mainGrid}>
        <aside style={styles.sidebar}>
          <div style={styles.card}>
            <h3 style={styles.cardTitle}><Layers size={16} color="#059669"/> Contexto del Historial</h3>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Año Escolar</label>
              <select style={styles.select} value={anioEscolar} onChange={(e) => setAnioEscolar(e.target.value)}>
                {aniosDisponibles.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Nivel / Grado</label>
              <select style={styles.select} value={gradoSeccion} onChange={(e)=>setGradoSeccion(e.target.value)}>
                {niveles.map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div style={styles.inputGroup}>
              <label style={styles.label}>Momento Escolar</label>
              <select style={styles.select} value={momento} onChange={(e)=>setMomento(e.target.value)}>
                {momentos.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>
            <input style={styles.inputSimple} value={docente} onChange={(e)=>setDocente(e.target.value)} placeholder="Docente" />
            <input style={styles.inputSimple} value={proyecto} onChange={(e)=>setProyecto(e.target.value)} placeholder="Proyecto" />
          </div>

          {tabActiva === 'cualitativa' && (
            <div style={styles.card}>
              <h3 style={styles.cardTitle}><User size={16} color="#059669"/> Seleccionar Estudiante</h3>
              <div style={{ position: 'relative' }}>
                 <Search size={18} color="#94a3b8" style={{position: 'absolute', left: '12px', top: '12px'}} />
                 <input type="text" placeholder="Buscar por nombre..." value={busqueda} onChange={(e) => setBusqueda(e.target.value)} style={styles.inputSearch} />
              </div>
              {busqueda && (
                <div style={styles.dropdown}>
                  {alumnos.filter(a => a.primer_nombre.toLowerCase().includes(busqueda.toLowerCase())).map(a => (
                    <div key={a.id_alumno} onClick={() => { setAlumnoSeleccionado(a); setBusqueda(""); }} style={styles.dropdownItem}>
                      {a.primer_nombre} {a.primer_apellido}
                    </div>
                  ))}
                </div>
              )}
              {alumnoSeleccionado && (
                <div style={styles.studentBadge}>
                  <GraduationCap size={18} />
                  <span>{alumnoSeleccionado.primer_nombre} {alumnoSeleccionado.primer_apellido}</span>
                </div>
              )}
            </div>
          )}
        </aside>

        <section style={styles.content}>
          {tabActiva === 'cualitativa' ? (
            <>
              <div style={styles.cardTable}>
                <div style={styles.tableHeader}>
                  <h3 style={styles.cardTitle}><BookOpen size={18} color="#065f46"/> Matriz de Evaluación Cualitativa</h3>
                  <button onClick={() => setFilas([...filas, { id: Date.now(), area: '', competencias: [{ id: Date.now()+1, nombre: '', indicadores: [{ id: Date.now()+2, texto: '' }] }] }])} style={styles.addButton}>
                    <PlusCircle size={16}/> Nueva Área
                  </button>
                </div>
                <table style={styles.table}>
                  <thead>
                    <tr style={{backgroundColor: '#f1f5f9'}}>
                      <th style={{...styles.th, width: '20%'}}>Área</th>
                      <th style={{...styles.th, width: '35%'}}>Competencias</th>
                      <th style={{...styles.th, width: '40%'}}>Indicadores</th>
                      <th style={{ width: '40px' }}></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filas.map((fila) => (
                      <tr key={fila.id} style={{ borderBottom: '2px solid #e2e8f0' }}>
                        <td style={{ ...styles.td, verticalAlign: 'top' }}>
                          <input placeholder="Área..." style={styles.inputTable} value={fila.area} onChange={(e) => setFilas(filas.map(f => f.id === fila.id ? {...f, area: e.target.value} : f))} />
                        </td>
                        <td colSpan={2} style={{ padding: 0 }}>
                          {fila.competencias.map((comp) => (
                            <div key={comp.id} style={{ display: 'flex', borderBottom: '1px solid #edf2f7' }}>
                              <div style={{ width: '47%', padding: '10px', borderRight: '1px solid #edf2f7' }}>
                                <div style={{display:'flex', gap:'5px'}}>
                                  <textarea placeholder="Competencia..." style={styles.textarea} value={comp.nombre} onChange={(e) => setFilas(filas.map(f => f.id === fila.id ? {...f, competencias: f.competencias.map(c => c.id === comp.id ? {...c, nombre: e.target.value} : c)} : f))} />
                                  <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                                    <button onClick={() => añadirCompetencia(fila.id)} style={styles.miniPlus}><Plus size={12}/></button>
                                    {fila.competencias.length > 1 && <button onClick={() => setFilas(filas.map(f => f.id === fila.id ? {...f, competencias: f.competencias.filter(c => c.id !== comp.id)} : f))} style={styles.miniTrash}><Trash2 size={12}/></button>}
                                  </div>
                                </div>
                              </div>
                              <div style={{ width: '53%', padding: '10px' }}>
                                {comp.indicadores.map((ind) => (
                                  <div key={ind.id} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                    <textarea placeholder="Indicador..." style={{...styles.textarea, minHeight:'40px'}} value={ind.texto} onChange={(e) => setFilas(filas.map(f => f.id === fila.id ? {...f, competencias: f.competencias.map(c => c.id === comp.id ? {...c, indicadores: c.indicadores.map(i => i.id === ind.id ? {...i, texto: e.target.value} : i)} : c)} : f))} />
                                    <div style={{display:'flex', flexDirection:'column', gap:'4px'}}>
                                      <button onClick={() => añadirIndicador(fila.id, comp.id)} style={styles.miniPlus}><Plus size={12}/></button>
                                      {comp.indicadores.length > 1 && <button onClick={() => setFilas(filas.map(f => f.id === fila.id ? {...f, competencias: f.competencias.map(c => c.id === comp.id ? {...c, indicadores: c.indicadores.filter(i => i.id !== ind.id)} : c)} : f))} style={styles.miniTrash}><Trash2 size={12}/></button>}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </td>
                        <td style={styles.td}>
                          <button style={styles.deleteBtn} onClick={() => setFilas(filas.filter(f => f.id !== fila.id))}><Trash2 size={18}/></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={styles.cardFinal}>
                <h3 style={styles.cardTitle}><Lightbulb size={16} color="#9a3412"/> Apreciación Global</h3>
                <textarea style={styles.textareaBig} value={apreciacionGlobal} onChange={(e)=>setApreciacionGlobal(e.target.value)} placeholder="Síntesis del progreso..." />
              </div>
            </>
          ) : (
            <div style={styles.cardTable}>
              <div style={styles.tableHeader}>
                <h3 style={styles.cardTitle}><Book size={18} color="#065f46"/> Registro de Fluidez Lectora</h3>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr style={{backgroundColor: '#f1f5f9'}}>
                    <th style={{...styles.th, width: '60%'}}>Estudiante</th>
                    <th style={styles.th}>Literal de Lectura</th>
                  </tr>
                </thead>
                <tbody>
                  {alumnos.map((alumno) => (
                    <tr key={alumno.id_alumno} style={{ borderBottom: '1px solid #edf2f7' }}>
                      <td style={styles.td}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <User size={16} color="#94a3b8" />
                          <span style={{ fontWeight: '600' }}>{alumno.primer_nombre} {alumno.primer_apellido}</span>
                        </div>
                      </td>
                      <td style={styles.td}>
                        <select 
                          style={styles.selectLectura}
                          value={lecturaData[alumno.id_alumno] || ""}
                          onChange={(e) => setLecturaData({...lecturaData, [alumno.id_alumno]: e.target.value})}
                        >
                          <option value="">Seleccione...</option>
                          {literalesLectura.map(l => <option key={l} value={l.toLowerCase()}>{l}</option>)}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: { padding: '40px', backgroundColor: '#f0fdf4', minHeight: '100vh', fontFamily: 'sans-serif' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '30px', alignItems: 'center' },
  headerLeft: { display: 'flex', alignItems: 'center', gap: '20px' },
  btnFlechaVerde: { display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff', border: '1px solid #059669', borderRadius: '12px', width: '45px', height: '45px', cursor: 'pointer', color: '#059669', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' },
  title: { fontSize: '28px', fontWeight: '800', color: '#064e3b', margin: 0 },
  subtitle: { color: '#64748b', fontSize: '14px', margin: 0 },
  tabsContainer: { display: 'flex', gap: '10px', marginBottom: '25px', borderBottom: '2px solid #e2e8f0' },
  tabActive: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: '#fff', color: '#059669', border: '2px solid #059669', borderBottom: 'none', borderRadius: '12px 12px 0 0', fontWeight: 'bold', cursor: 'pointer' },
  tabInactive: { display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 24px', backgroundColor: 'transparent', color: '#64748b', border: 'none', fontWeight: '600', cursor: 'pointer' },
  mainGrid: { display: 'grid', gridTemplateColumns: '320px 1fr', gap: '30px' },
  sidebar: { display: 'flex', flexDirection: 'column', gap: '25px' },
  card: { backgroundColor: '#fff', padding: '24px', borderRadius: '18px', border: '1px solid #bbf7d0', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' },
  cardTitle: { fontSize: '12px', fontWeight: '700', color: '#065f46', marginBottom: '18px', display: 'flex', alignItems: 'center', gap: '8px', textTransform: 'uppercase' },
  label: { display: 'block', fontSize: '11px', fontWeight: '600', color: '#94a3b8', marginBottom: '5px' },
  inputGroup: { marginBottom: '15px' },
  select: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc', fontSize: '14px' },
  selectLectura: { width: '100%', padding: '8px', borderRadius: '8px', border: '1px solid #10b981', backgroundColor: '#fff', color: '#064e3b', fontWeight: '600' },
  inputSimple: { width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '10px' },
  inputSearch: { width: '100%', padding: '12px 12px 12px 40px', borderRadius: '10px', border: '1px solid #e2e8f0', backgroundColor: '#f8fafc' },
  studentBadge: { marginTop: '15px', padding: '12px', backgroundColor: '#10b981', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 'bold' },
  content: { display: 'flex', flexDirection: 'column', gap: '25px' },
  cardTable: { backgroundColor: '#fff', borderRadius: '20px', overflow: 'hidden', border: '2px solid #10b981', boxShadow: '0 10px 15px rgba(0,0,0,0.05)' },
  tableHeader: { padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  table: { width: '100%', borderCollapse: 'collapse' },
  th: { padding: '14px 24px', textAlign: 'left', fontSize: '12px', color: '#065f46', fontWeight: '700' },
  td: { padding: '10px 24px', borderBottom: '1px solid #f1f5f9' },
  inputTable: { width: '100%', padding: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' },
  textarea: { width: '100%', padding: '8px', border: '1px solid #e2e8f0', borderRadius: '8px', resize: 'none', fontSize: '13px' },
  cardFinal: { backgroundColor: '#f0fdf4', padding: '30px', borderRadius: '24px', border: '1px solid #10b981' },
  textareaBig: { width: '100%', minHeight: '120px', padding: '15px', borderRadius: '16px', border: '1px solid #10b981', marginBottom: '15px' },
  saveButton: { backgroundColor: '#10b981', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  downloadButton: { backgroundColor: '#fff', color: '#1e293b', border: '1px solid #e2e8f0', padding: '12px 24px', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' },
  addButton: { padding: '8px 16px', backgroundColor: '#064e3b', color: '#fff', border: 'none', borderRadius: '10px', fontSize: '12px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  deleteBtn: { color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer' },
  miniPlus: { padding: '4px', backgroundColor: '#10b981', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  miniTrash: { padding: '4px', backgroundColor: '#ef4444', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  dropdown: { position: 'absolute', width: '100%', backgroundColor: '#fff', border: '1px solid #e2e8f0', zIndex: 10, borderRadius: '12px', top: '100%' },
  dropdownItem: { padding: '10px', cursor: 'pointer', borderBottom: '1px solid #f1f5f9' }
};

export default Evaluaciones;